"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { exhibits, halls, LENGTH, PX_PER_UNIT, START_Z, travel, viewingZ, walkTo, zToProgress } from "@/lib/museum";
import { profile } from "@/lib/data";
import { museum, useMuseum } from "@/lib/store";
import Pamphlet, { go } from "./Pamphlet";
import Catalogue from "./Catalogue";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

function useProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const f = () => {
      const max = document.documentElement.scrollHeight - innerHeight || 1;
      setP(Math.min(1, Math.max(0, scrollY / max)));
    };
    f();
    addEventListener("scroll", f, { passive: true });
    addEventListener("resize", f);
    return () => { removeEventListener("scroll", f); removeEventListener("resize", f); };
  }, []);
  return p;
}

export default function Museum() {
  const p = useProgress();
  const hovered = useMuseum((s) => s.hovered);
  const selected = useMuseum((s) => s.selected);
  const guide = useMuseum((s) => s.guide);
  const catalogue = useMuseum((s) => s.catalogue);
  const [webgl, setWebgl] = useState(true);
  const [touch, setTouch] = useState(false);

  const z = START_Z - p * LENGTH;
  const hall = [...halls].reverse().find((h) => z <= h.z + 1) ?? null;

  useEffect(() => {
    try {
      const c = document.createElement("canvas");
      if (!(c.getContext("webgl2") || c.getContext("webgl"))) { setWebgl(false); museum.set({ catalogue: true }); }
    } catch { setWebgl(false); }
    setTouch(matchMedia("(pointer: coarse)").matches);
  }, []);

  /* keyboard: W/S walk, A/D or ←/→ hop between exhibits, Enter inspect, Esc close */
  useEffect(() => {
    const k = (ev: KeyboardEvent) => {
      if ((ev.target as HTMLElement).closest("input, textarea") || ev.metaKey || ev.ctrlKey) return;
      const s = museum.get();
      const key = ev.key.toLowerCase();
      if (key === "escape") { museum.set({ selected: null, guide: false, catalogue: false }); return; }
      if (s.catalogue) return;
      if (key === "w") { scrollBy({ top: 160, behavior: "smooth" }); museum.set({ selected: null }); }
      if (key === "s") { scrollBy({ top: -160, behavior: "smooth" }); museum.set({ selected: null }); }
      if (key === "enter" && s.hovered) museum.set({ selected: s.hovered });
      if (key === "m" || key === "g") museum.set({ guide: !s.guide });
      if (key === "arrowright" || key === "d" || key === "arrowleft" || key === "a") {
        ev.preventDefault();
        const fwd = key === "arrowright" || key === "d";
        const curIdx = s.selected ? exhibits.findIndex((e) => e.id === s.selected) : -1;
        let next;
        if (curIdx >= 0) next = exhibits[curIdx + (fwd ? 1 : -1)];
        else {
          const camZ = START_Z - (scrollY / (document.documentElement.scrollHeight - innerHeight || 1)) * LENGTH;
          next = fwd ? exhibits.find((e) => viewingZ(e) < camZ - 0.5) : [...exhibits].reverse().find((e) => viewingZ(e) > camZ + 0.5);
        }
        if (next) go(next);
      }
    };
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, []);

  /* close the pamphlet when the visitor walks away from the exhibit */
  useEffect(() => {
    if (!selected) return;
    const e = exhibits.find((x) => x.id === selected);
    if (!e) return;
    let t: ReturnType<typeof setTimeout>;
    const check = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        const max = document.documentElement.scrollHeight - innerHeight || 1;
        const camZ = START_Z - (scrollY / max) * LENGTH;
        if (Date.now() < travel.until && Math.abs(camZ - travel.z) > 0.5) return; // still gliding there
        if (Math.abs(camZ - viewingZ(e)) > 7) museum.set({ selected: null });
      }, 250);
    };
    addEventListener("scroll", check, { passive: true });
    return () => { clearTimeout(t); removeEventListener("scroll", check); };
  }, [selected]);

  useEffect(() => { document.body.style.overflow = catalogue ? "hidden" : ""; }, [catalogue]);

  const intro = selected ? 0 : Math.max(0, 1 - p * 45);

  return (
    <>
      {webgl && <div className="stage"><Scene /></div>}
      <div className="vignette" />

      {/* Entrance ticket — the hero */}
      <section className="ticket" style={{ opacity: intro, visibility: intro < 0.02 ? "hidden" : "visible", transform: `translateY(${(1 - intro) * -30}px)` }} id="top">
        <div className="ticket-card">
          <span className="ticket-kicker">Admit one · The Maharjan Collection</span>
          <h1>{profile.name}</h1>
          <p className="ticket-role">{profile.role}</p>
          <p className="ticket-sub">AR · LiDAR · 3D · Real-time · Flutter</p>
          <div className="rule"><i /></div>
          <p className="ticket-copy">{profile.headline}</p>
          <div className="actions">
            <button className="btn btn-gold" onClick={() => walkTo(halls[0].z - 4)}>Begin the tour</button>
            <button className="btn btn-line" onClick={() => museum.set({ catalogue: true })}>Read the catalogue</button>
          </div>
          <p className="ticket-hint">{touch ? "Swipe up to walk · tap an exhibit" : "Scroll or W / S to walk · move mouse to look · click an exhibit"}</p>
        </div>
      </section>

      {/* HUD */}
      <header className="hud">
        <a className="crest" href="#top" onClick={(e) => { e.preventDefault(); museum.set({ selected: null }); walkTo(START_Z); }} aria-label="Back to entrance">
          <span className="crest-mark">RM</span>
          <span className="crest-txt"><b>The Maharjan Collection</b><small>{hall ? `Gallery ${hall.numeral} · ${hall.name}` : "Entrance"}</small></span>
        </a>
        <nav className="hud-actions">
          <button className="btn btn-line btn-sm hide-sm" onClick={() => museum.set({ guide: !guide })} aria-expanded={guide}>Floor guide</button>
          <button className="btn btn-line btn-sm hide-sm" onClick={() => museum.set({ catalogue: true })}>Catalogue</button>
          <button className="btn btn-gold btn-sm" onClick={() => go(exhibits[exhibits.length - 1])}>Hire me</button>
          <button className="btn btn-line btn-sm show-sm" onClick={() => museum.set({ guide: !guide })} aria-label="Open floor guide">☰</button>
        </nav>
      </header>

      {/* crosshair */}
      {!touch && <div className={`reticle ${hovered ? "lock" : ""}`}><i />{hovered && <span>Inspect</span>}</div>}

      {/* corridor minimap */}
      <div className="minimap" aria-label="Tour progress">
        <div className="mm-track">
          <i className="mm-fill" style={{ width: `${p * 100}%` }} />
          {halls.map((h) => (
            <button key={h.id} className={`mm-hall ${hall?.id === h.id ? "on" : ""}`} style={{ left: `${zToProgress(h.z) * 100}%` }} onClick={() => { museum.set({ selected: null }); walkTo(h.z - 3); }} title={h.name}>
              <span>{h.numeral}</span>
            </button>
          ))}
          <span className="mm-you" style={{ left: `${p * 100}%` }} />
        </div>
        <div className="mm-label">{hall ? hall.name : "Entrance"} <span>{Math.round(p * 100)}%</span></div>
      </div>

      {/* floor guide drawer */}
      <div className={`guide ${guide ? "open" : ""}`} onClick={(e) => e.target === e.currentTarget && museum.set({ guide: false })} hidden={!guide}>
        <div className="guide-paper">
          <header>
            <span>Floor guide</span>
            <button className="pam-x" onClick={() => museum.set({ guide: false })} aria-label="Close floor guide">✕</button>
          </header>
          {halls.map((h) => (
            <div key={h.id} className="guide-hall">
              <button className="guide-hall-name" onClick={() => { museum.set({ selected: null, guide: false }); walkTo(h.z - 3); }}>
                <span>{h.numeral}</span>{h.name}<small>{h.tagline}</small>
              </button>
              <ul>
                {exhibits.filter((e) => e.hall === h.id).map((e) => (
                  <li key={e.id}><button onClick={() => go(e)}><span>No. {String(e.no).padStart(2, "0")}</span>{e.title}</button></li>
                ))}
              </ul>
            </div>
          ))}
          <button className="btn btn-line" style={{ width: "100%", marginTop: 12 }} onClick={() => museum.set({ guide: false, catalogue: true })}>Open the full catalogue</button>
        </div>
      </div>

      <Pamphlet />
      <Catalogue />

      {/* the corridor's length in scroll distance */}
      <div style={{ height: `calc(${Math.round(LENGTH * PX_PER_UNIT)}px + 100vh)` }} aria-hidden />
    </>
  );
}
