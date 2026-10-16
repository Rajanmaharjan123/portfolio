"use client";
import { useEffect, useState } from "react";
import { useMuseum } from "@/lib/store";

/* Opening the museum: a crest and progress bar, then two gilded doors swing apart
   once the 3D scene has rendered its first frames and the portrait has loaded. */
const STEPS = ["Polishing the marble", "Lighting the chandeliers", "Hanging the portraits", "Arranging the exhibits", "Opening the doors"];

export default function Loader() {
  const ready = useMuseum((s) => s.ready);
  const portrait = useMuseum((s) => s.portrait);
  const [fonts, setFonts] = useState(false);
  const [timeout, setTimedOut] = useState(false);
  const [pct, setPct] = useState(0);
  const [phase, setPhase] = useState<"loading" | "opening" | "done">("loading");

  const done = (ready && portrait && fonts) || timeout;

  useEffect(() => {
    document.fonts?.ready.then(() => setFonts(true)).catch(() => setFonts(true));
    const t = setTimeout(() => setTimedOut(true), 9000);    // never trap the visitor
    const f = setTimeout(() => setFonts(true), 2500);       // fonts may be blocked
    return () => { clearTimeout(t); clearTimeout(f); };
  }, []);

  // progress creeps toward 90% while loading, then completes
  useEffect(() => {
    if (phase !== "loading") return;
    const id = setInterval(() => {
      setPct((p) => {
        const real = (ready ? 35 : 0) + (portrait ? 25 : 0) + (fonts ? 15 : 0);
        const target = done ? 100 : Math.max(real, Math.min(88, p + 2.2));
        return p + (target - p) * 0.25;
      });
    }, 60);
    return () => clearInterval(id);
  }, [ready, portrait, fonts, done, phase]);

  useEffect(() => {
    if (phase === "loading" && done && pct > 99) setPhase("opening");
  }, [done, pct, phase]);

  useEffect(() => {
    if (phase !== "opening") return;
    const t = setTimeout(() => setPhase("done"), 1400);
    return () => clearTimeout(t);
  }, [phase]);

  useEffect(() => { document.body.classList.toggle("is-loading", phase !== "done"); }, [phase]);

  if (phase === "done") return null;
  const step = STEPS[Math.min(STEPS.length - 1, Math.floor((pct / 100) * STEPS.length))];

  return (
    <div className={`loader ${phase}`} aria-live="polite" aria-label={`Loading the museum, ${Math.round(pct)}%`}>
      <div className="door left"><i /></div>
      <div className="door right"><i /></div>
      <div className="loader-center">
        <div className="loader-crest">RM</div>
        <span className="loader-kicker">The Maharjan Collection</span>
        <div className="loader-bar"><i style={{ width: `${pct}%` }} /></div>
        <div className="loader-meta"><span>{step}…</span><span>{Math.round(pct)}%</span></div>
      </div>
    </div>
  );
}
