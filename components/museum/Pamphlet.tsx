"use client";
import { useEffect, useState } from "react";
import { exhibits, halls, viewingZ, walkTo, type Exhibit } from "@/lib/museum";
import { impact, inventory, profile, quests, type Tech } from "@/lib/data";
import { museum, useMuseum } from "@/lib/store";

/* ---------- cross-references between exhibits ---------- */
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9+]/g, "");
const projectEx = (name: string) => exhibits.find((x) => x.payload.kind === "project" && x.payload.p.name === name);
const jobEx = (id?: string) => (id ? exhibits.find((x) => x.payload.kind === "job" && x.payload.q.id === id) : undefined);
const quest = (id?: string) => quests.find((q) => q.id === id);
function usesTech(stack: string[], keys: string[]) {
  const ks = keys.map(norm);
  return stack.some((s) => ks.includes(norm(s)));
}
function techUsage(t: Tech) {
  const keys = [t.name, ...(t.match ?? [])];
  return {
    projects: inventory.filter((p) => usesTech(p.stack, keys)),
    jobs: quests.filter((q) => usesTech(q.stack, keys)),
  };
}

function XLink({ ex, label, sub }: { ex?: Exhibit; label: string; sub?: string }) {
  if (!ex) return <span className="xlink off"><b>{label}</b>{sub && <small>{sub}</small>}</span>;
  return (
    <button className="xlink" onClick={() => go(ex)}>
      <b>{label}</b>{sub && <small>{sub}</small>}<i>View ▸</i>
    </button>
  );
}

function Body({ e }: { e: Exhibit }) {
  const [copied, setCopied] = useState(false);
  const [openTech, setOpenTech] = useState<string | null>(null);
  const p = e.payload;
  switch (p.kind) {
    case "about":
      return (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="pam-portrait"><img src="/avatar/portrait.jpg" alt={`Portrait of ${profile.name}`} /></div>
          <p className="lede">{profile.headline}</p>
          <p>{profile.summary}</p>
          <p style={{ marginTop: 8 }}>{profile.strengths}</p>
          <div className="stats" style={{ marginTop: 14 }}>
            {impact.map((s) => <div key={s.label}><b>{s.value}</b><span>{s.label}</span></div>)}
          </div>
          <dl className="facts">
            <div><dt>Role</dt><dd>{profile.roleLong}</dd></div>
            <div><dt>Based in</dt><dd>{profile.location} · {profile.timezone}</dd></div>
            <div><dt>Education</dt><dd>{profile.education.degree} — {profile.education.school}, {profile.education.years}</dd></div>
            <div><dt>Languages</dt><dd>{profile.languages.join(" · ")}</dd></div>
            <div><dt>Off duty</dt><dd>{profile.interests}</dd></div>
            <div><dt>Contact</dt><dd><a href={`mailto:${profile.email}`}>{profile.email}</a> · <a href={`tel:${profile.phone.replace(/-/g, "")}`}>{profile.phone}</a></dd></div>
          </dl>
          <h4>Career at a glance</h4>
          <div className="xlinks">
            {quests.map((q) => <XLink key={q.id} ex={jobEx(q.id)} label={q.company} sub={`${q.title} · ${q.period}`} />)}
          </div>
          <div className="actions">
            <a className="btn btn-gold" href={`mailto:${profile.email}?subject=Project%20enquiry`}>Write to me</a>
            <a className="btn btn-line" href={profile.cv} download>Download CV</a>
          </div>
        </>
      );
    case "impact":
      return (
        <div className="stats">
          {impact.map((s) => <div key={s.label}><b>{s.value}</b><span>{s.label}</span></div>)}
        </div>
      );
    case "service":
      return (
        <>
          <p className="lede">{p.s.blurb}</p>
          <h4>What you get</h4>
          <ul className="objectives">{p.s.points.map((x) => <li key={x}>{x}</li>)}</ul>
          <h4>Tools of the trade</h4>
          <div className="tags">{p.s.tags.map((t) => <span key={t}>{t}</span>)}</div>
          <h4>Proof — see it in the museum</h4>
          <div className="xlinks">
            {p.s.proof.map((name) => { const pr = inventory.find((x) => x.name === name); return <XLink key={name} ex={projectEx(name)} label={name} sub={pr?.type} />; })}
          </div>
        </>
      );
    case "tech":
      return (
        <>
          <p className="lede">{p.g.items.length} skills in this cabinet. Tap one to see where it was used.</p>
          <ul className="techs open-list">
            {p.g.items.map((t) => {
              const u = techUsage(t);
              const n = u.projects.length + u.jobs.length;
              const isOpen = openTech === t.name;
              return (
                <li key={t.name} className={isOpen ? "on" : ""}>
                  <button className="tech-row" onClick={() => setOpenTech(isOpen ? null : t.name)} aria-expanded={isOpen}>
                    <b>{t.name}</b>
                    <small>{t.note ?? ""}{n ? `${t.note ? " · " : ""}${n} use${n > 1 ? "s" : ""}` : ""}</small>
                  </button>
                  {isOpen && (
                    <div className="tech-uses">
                      {n === 0 && <p className="meta">Listed on the CV — ask me about it.</p>}
                      {u.projects.map((pr) => <XLink key={pr.name} ex={projectEx(pr.name)} label={pr.name} sub={pr.type} />)}
                      {u.jobs.map((q) => <XLink key={q.id} ex={jobEx(q.id)} label={q.company} sub={`${q.title} · ${q.period}`} />)}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      );
    case "project": {
      const q = quest(p.p.job);
      const related = inventory.filter((x) => x.category === p.p.category && x.name !== p.p.name).slice(0, 4);
      return (
        <>
          <div className="pill-row">
            <span className="pill">{p.p.category}</span>
            {p.p.platforms && <span className="pill">{p.p.platforms}</span>}
          </div>
          <p className="lede">{p.p.blurb}</p>
          {p.p.result && <p className="result">▲ {p.p.result}</p>}
          {p.p.details && (<><h4>Highlights</h4><ul className="objectives">{p.p.details.map((d) => <li key={d}>{d}</li>)}</ul></>)}
          <h4>Built with</h4>
          <div className="tags">{p.p.stack.map((t) => <span key={t}>{t}</span>)}</div>
          {q && (<><h4>Built during</h4><div className="xlinks"><XLink ex={jobEx(q.id)} label={q.company} sub={`${q.title} · ${q.period}`} /></div></>)}
          {p.p.link && <div className="actions"><a className="btn btn-gold" href={p.p.link} target="_blank" rel="noreferrer">Visit {p.p.link.replace(/^https?:\/\//, "")} ↗</a></div>}
          {related.length > 0 && (<><h4>Related work</h4><div className="xlinks">{related.map((r) => <XLink key={r.name} ex={projectEx(r.name)} label={r.name} sub={r.type} />)}</div></>)}
        </>
      );
    }
    case "job": {
      const q = p.q;
      return (
        <>
          <dl className="facts">
            <div><dt>Role</dt><dd>{q.title}</dd></div>
            <div><dt>Company</dt><dd>{q.company}</dd></div>
            {q.client && <div><dt>Client</dt><dd>{q.client}</dd></div>}
            {q.location && <div><dt>Location</dt><dd>{q.location}</dd></div>}
            <div><dt>Period</dt><dd>{q.period} · <span className={q.status === "ACTIVE" ? "now" : ""}>{q.status === "ACTIVE" ? "Current" : "Completed"}</span></dd></div>
          </dl>
          {q.project && <p className="lede" style={{ marginTop: 12 }}>{q.project}</p>}
          <h4>What I did</h4>
          <ul className="objectives">{q.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul>
          <h4>Tech stack</h4>
          <div className="tags">{q.stack.map((t) => <span key={t}>{t}</span>)}</div>
          <h4>Apps & projects</h4>
          <div className="xlinks">
            {q.loot.map((name) => { const pr = inventory.find((x) => x.name === name); return <XLink key={name} ex={projectEx(name)} label={name} sub={pr?.type} />; })}
          </div>
          {q.link && <div className="actions"><a className="btn btn-gold" href={q.link} target="_blank" rel="noreferrer">Visit {q.link.replace(/^https?:\/\//, "")} ↗</a></div>}
        </>
      );
    }
    case "trophy":
      return (
        <>
          <p className="lede">{p.t.detail}</p>
          <dl className="facts"><div><dt>When</dt><dd>{p.t.year}</dd></div></dl>
        </>
      );
    case "contact":
      return (
        <>
          <p className="lede">Senior iOS roles, AR / LiDAR products, real-time apps, app rescues or a fresh build — sign the guestbook and I&apos;ll reply within a day.</p>
          <div className="actions">
            <a className="btn btn-gold" href={`mailto:${profile.email}?subject=Project%20enquiry`}>Write to me</a>
            <a className="btn btn-line" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a className="btn btn-line" href={profile.cv} download>Download CV</a>
          </div>
          <dl className="facts">
            <div><dt>Email</dt><dd><a href={`mailto:${profile.email}`}>{profile.email}</a> <button className="copy" onClick={async () => { try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {} }}>{copied ? "Copied ✓" : "Copy"}</button></dd></div>
            <div><dt>Phone</dt><dd><a href={`tel:${profile.phone.replace(/-/g, "")}`}>{profile.phone}</a></dd></div>
            <div><dt>LinkedIn</dt><dd><a href={profile.linkedin} target="_blank" rel="noreferrer">linkedin.com/in/rajan1122</a></dd></div>
            <div><dt>Region</dt><dd>{profile.location} · {profile.timezone} · remote-friendly</dd></div>
          </dl>
          <ol className="process">
            {[["Brief", "Tell me the idea, the app or the bug."], ["Plan", "Scope and estimate within 48h."], ["Build", "Weekly TestFlight builds."], ["Ship", "App Store release & handover."]].map(([t, d], i) => (
              <li key={t}><span>{["I", "II", "III", "IV"][i]}</span><b>{t}</b><small>{d}</small></li>
            ))}
          </ol>
        </>
      );
  }
}

export function go(e: Exhibit) {
  museum.set({ selected: e.id, guide: false });
  walkTo(viewingZ(e));
}

export default function Pamphlet() {
  const id = useMuseum((s) => s.selected);
  const e = exhibits.find((x) => x.id === id);
  const [shown, setShown] = useState<Exhibit | undefined>(e);
  useEffect(() => { if (e) setShown(e); }, [e]);

  const cur = e ?? shown;
  if (!cur) return null;
  const i = exhibits.indexOf(cur);
  const hall = halls.find((h) => h.id === cur.hall);
  // pamphlet opens on the side opposite the exhibit so the exhibit stays visible
  const side = cur.side === -1 ? "right" : "left";

  return (
    <aside className={`pamphlet ${side} ${e ? "open" : ""}`} aria-hidden={!e} aria-label={`Exhibit: ${cur.title}`} style={{ ["--accent" as string]: cur.accent }}>
      <div className="pam-holo" />
      <header>
        <span className="pam-no">Exhibit No. {String(cur.no).padStart(2, "0")} · {hall ? `Gallery ${hall.numeral} — ${hall.name}` : "The Entrance"}</span>
        <button className="pam-x" onClick={() => museum.set({ selected: null })} aria-label="Close pamphlet">✕</button>
      </header>
      <h2>{cur.title}</h2>
      <p className="pam-sub">{cur.subtitle}</p>
      <div className="rule"><i /></div>
      <div className="pam-body" key={cur.id}><Body key={cur.id} e={cur} /></div>
      <footer>
        <button disabled={i <= 0} onClick={() => go(exhibits[i - 1])}>◂ Previous</button>
        <span>{i + 1} / {exhibits.length}</span>
        <button disabled={i >= exhibits.length - 1} onClick={() => go(exhibits[i + 1])}>Next ▸</button>
      </footer>
    </aside>
  );
}
