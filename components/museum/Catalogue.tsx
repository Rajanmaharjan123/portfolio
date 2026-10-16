"use client";
import { achievements, impact, inventory, profile, quests, services, techGroups } from "@/lib/data";
import { museum, useMuseum } from "@/lib/store";

/* The printed catalogue: every detail as plain text. Doubles as the accessible / SEO version. */
export default function Catalogue() {
  const open = useMuseum((s) => s.catalogue);
  return (
    <div className={`catalogue ${open ? "open" : "sr"}`} role={open ? "dialog" : undefined} aria-modal={open || undefined} aria-label="Museum catalogue">
      <div className="cat-paper">
        <button className="pam-x cat-x" onClick={() => museum.set({ catalogue: false })} aria-label="Close catalogue">✕</button>
        <header className="cat-head">
          <span>The Maharjan Collection · Visitor Catalogue</span>
          <h1>{profile.name}</h1>
          <p className="cat-role">{profile.role} — AR · LiDAR · 3D · Real-time</p>
          <p>{profile.summary}</p>
          <div className="actions">
            <a className="btn btn-gold" href={`mailto:${profile.email}`}>{profile.email}</a>
            <a className="btn btn-line" href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
            <a className="btn btn-line" href={profile.cv} download>Download CV</a>
          </div>
          <div className="stats">{impact.map((s) => <div key={s.label}><b>{s.value}</b><span>{s.label}</span></div>)}</div>
        </header>

        <section>
          <h2><span>II</span> Services</h2>
          <div className="cat-grid">
            {services.map((s) => <article key={s.title}><h3>{s.title}</h3><p>{s.blurb}</p><div className="tags">{s.tags.map((t) => <span key={t}>{t}</span>)}</div></article>)}
          </div>
        </section>

        <section>
          <h2><span>III</span> Technologies</h2>
          <div className="cat-grid">
            {techGroups.map((g) => (
              <article key={g.id}><h3>{g.label}</h3><p className="cat-list">{g.items.map((t) => t.name).join(" · ")}</p></article>
            ))}
          </div>
        </section>

        <section>
          <h2><span>IV</span> Selected work</h2>
          <div className="cat-grid">
            {inventory.map((p) => (
              <article key={p.name}>
                <h3>{p.name} <small>{p.type}</small></h3>
                <p>{p.blurb}</p>
                {p.result && <p className="result">▲ {p.result}</p>}
                <div className="tags">{p.stack.map((t) => <span key={t}>{t}</span>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2><span>V</span> Experience</h2>
          {quests.map((q) => (
            <article key={q.id} className="cat-job">
              <h3>{q.title} <small>@ {q.company} · {q.period}</small></h3>
              <ul>{q.objectives.map((o, i) => <li key={i}>{o}</li>)}</ul>
            </article>
          ))}
        </section>

        <section>
          <h2><span>VI</span> Honours</h2>
          <ul className="cat-honours">{achievements.map((a) => <li key={a.title}><b>{a.title}</b> — {a.detail} <small>({a.year})</small></li>)}</ul>
        </section>
      </div>
    </div>
  );
}
