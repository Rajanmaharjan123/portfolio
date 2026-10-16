"use client";
import { useEffect, useState } from "react";
import { exhibits, halls, viewingZ, walkTo, type Exhibit } from "@/lib/museum";
import { impact, profile } from "@/lib/data";
import { museum, useMuseum } from "@/lib/store";

function Body({ e }: { e: Exhibit }) {
  const [copied, setCopied] = useState(false);
  const p = e.payload;
  switch (p.kind) {
    case "about":
      return (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="pam-portrait"><img src="/avatar/avatar-color.png" alt={`Portrait of ${profile.name}`} /></div>
          <p className="lede">{profile.headline}</p>
          <p>{profile.summary}</p>
          <dl className="facts">
            <div><dt>Based in</dt><dd>{profile.location}</dd></div>
            <div><dt>Class</dt><dd>{profile.className}</dd></div>
            <div><dt>Main hand</dt><dd>Swift · SwiftUI · UIKit</dd></div>
            <div><dt>Off hand</dt><dd>Flutter · Dart</dd></div>
            <div><dt>Languages</dt><dd>Nepali · Newari · English · Hindi</dd></div>
            <div><dt>Off duty</dt><dd>Football · Travel · Video games</dd></div>
          </dl>
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
          <h4>Tools of the trade</h4>
          <div className="tags">{p.s.tags.map((t) => <span key={t}>{t}</span>)}</div>
        </>
      );
    case "tech":
      return (
        <>
          <p className="lede">{p.g.items.length} instruments in this cabinet.</p>
          <ul className="techs">
            {p.g.items.map((t) => <li key={t.name}><b>{t.name}</b>{t.note && <small>{t.note}</small>}</li>)}
          </ul>
        </>
      );
    case "project":
      return (
        <>
          <div className="pill-row">
            <span className={`rarity r-${p.p.rarity}`}>◆ {p.p.rarity}</span>
            <span className="pill">{p.p.category}</span>
          </div>
          <p className="lede">{p.p.blurb}</p>
          {p.p.result && <p className="result">▲ {p.p.result}</p>}
          <h4>Built with</h4>
          <div className="tags">{p.p.stack.map((t) => <span key={t}>{t}</span>)}</div>
        </>
      );
    case "job":
      return (
        <>
          <p className="meta">{p.q.title} · {p.q.period} · <span className={p.q.status === "ACTIVE" ? "now" : ""}>{p.q.status === "ACTIVE" ? "Current" : "Completed"}</span></p>
          <ul className="objectives">{p.q.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul>
          <h4>Stack</h4>
          <div className="tags">{p.q.stack.map((t) => <span key={t}>{t}</span>)}</div>
          <h4>Apps shipped</h4>
          <div className="tags gold">{p.q.loot.map((t) => <span key={t}>{t}</span>)}</div>
        </>
      );
    case "trophy":
      return <p className="lede">{p.t.detail}</p>;
    case "contact":
      return (
        <>
          <p className="lede">Senior iOS roles, AR / LiDAR products, app rescues or a fresh build — sign the guestbook and I&apos;ll reply within a day.</p>
          <div className="actions">
            <a className="btn btn-gold" href={`mailto:${profile.email}?subject=Project%20enquiry`}>Write to me</a>
            <a className="btn btn-line" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a className="btn btn-line" href={profile.cv} download>Download CV</a>
          </div>
          <dl className="facts">
            <div><dt>Email</dt><dd><a href={`mailto:${profile.email}`}>{profile.email}</a> <button className="copy" onClick={async () => { try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {} }}>{copied ? "Copied ✓" : "Copy"}</button></dd></div>
            <div><dt>Phone</dt><dd><a href={`tel:${profile.phone.replace(/-/g, "")}`}>{profile.phone}</a></dd></div>
            <div><dt>Region</dt><dd>{profile.location} · {profile.timezone}</dd></div>
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
        <span className="pam-no">Exhibit No. {String(cur.no).padStart(2, "0")} · Gallery {hall?.numeral} — {hall?.name}</span>
        <button className="pam-x" onClick={() => museum.set({ selected: null })} aria-label="Close pamphlet">✕</button>
      </header>
      <h2>{cur.title}</h2>
      <p className="pam-sub">{cur.subtitle}</p>
      <div className="rule"><i /></div>
      <div className="pam-body" key={cur.id}><Body e={cur} /></div>
      <footer>
        <button disabled={i <= 0} onClick={() => go(exhibits[i - 1])}>◂ Previous</button>
        <span>{i + 1} / {exhibits.length}</span>
        <button disabled={i >= exhibits.length - 1} onClick={() => go(exhibits[i + 1])}>Next ▸</button>
      </footer>
    </aside>
  );
}
