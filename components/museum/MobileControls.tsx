"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { look } from "@/lib/look";
import { LENGTH, pxPerUnit } from "@/lib/museum";
import { museum, useMuseum } from "@/lib/store";

/* Phone & tablet controls
   - Gyro look: turn / tilt the phone to look around (iOS asks permission on a tap)
   - Hold-to-walk pad: press ▲ / ▼ for a smooth, eased glide down the hall
   - Swipe sideways on the scene to look around (fallback when gyro is off) */

type DOE = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

const clamp = (v: number, a: number) => Math.max(-a, Math.min(a, v));
const wrap = (d: number) => ((d + 540) % 360) - 180;

export default function MobileControls({ hidden }: { hidden: boolean }) {
  const [touch, setTouch] = useState(false);
  const [gyro, setGyro] = useState<"off" | "on" | "ask" | "unavailable">("off");
  const [prompt, setPrompt] = useState(false);
  const ready = useMuseum((s) => s.ready);
  const selected = useMuseum((s) => s.selected);
  const overlay = useMuseum((s) => s.guide || s.catalogue);
  const base = useRef<{ a: number; b: number; g: number } | null>(null);
  const walk = useRef({ dir: 0, speed: 0, raf: 0, last: 0 });

  /* ---------- detect a touch device ---------- */
  useEffect(() => {
    const coarse = matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    setTouch(coarse);
    if (!coarse) return;
    const DO = window.DeviceOrientationEvent as DOE | undefined;
    if (!DO) { setGyro("unavailable"); return; }
    if (typeof DO.requestPermission === "function") setGyro("ask");   // iOS: needs a tap
    else setGyro("on");                                                // Android: just works
  }, []);

  /* show the "turn on motion look" card once the doors have opened */
  useEffect(() => {
    if (!touch || !ready || gyro !== "ask") return;
    let dismissed = false;
    try { dismissed = sessionStorage.getItem("gyro-prompt") === "no"; } catch {}
    if (!dismissed) { const t = setTimeout(() => setPrompt(true), 1800); return () => clearTimeout(t); }
  }, [touch, ready, gyro]);

  /* ---------- gyroscope ---------- */
  useEffect(() => {
    if (gyro !== "on") return;
    let got = false;
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.alpha == null || e.beta == null || e.gamma == null) return;
      got = true;
      const angle = (screen.orientation?.angle ?? (window as unknown as { orientation?: number }).orientation ?? 0) as number;
      if (!base.current) base.current = { a: e.alpha, b: e.beta, g: e.gamma };
      const yaw = wrap(e.alpha - base.current.a);           // turning left increases alpha
      let pitch: number;
      if (angle === 90) pitch = -(e.gamma - base.current.g);
      else if (angle === -90 || angle === 270) pitch = e.gamma - base.current.g;
      else pitch = e.beta - base.current.b;                 // portrait: tilt top away = look up
      look.source = "gyro";
      look.x = clamp(-yaw / 28, 2.2);
      look.y = clamp(pitch / 26, 1.3);
    };
    addEventListener("deviceorientation", onOrient);
    // no readings after a moment → this device has no gyro
    const t = setTimeout(() => { if (!got) setGyro("unavailable"); }, 2500);
    return () => { removeEventListener("deviceorientation", onOrient); clearTimeout(t); };
  }, [gyro]);

  const enableGyro = useCallback(async () => {
    setPrompt(false);
    const DO = window.DeviceOrientationEvent as DOE;
    try {
      const res = DO.requestPermission ? await DO.requestPermission() : "granted";
      base.current = null;
      setGyro(res === "granted" ? "on" : "unavailable");
    } catch { setGyro("unavailable"); }
  }, []);

  const toggleGyro = () => {
    if (gyro === "on") { setGyro("off"); look.x = 0; look.y = 0; return; }
    if (gyro === "ask" || gyro === "off") {
      const DO = window.DeviceOrientationEvent as DOE | undefined;
      if (DO && typeof DO.requestPermission === "function") enableGyro();
      else { base.current = null; setGyro("on"); }
    }
  };
  const recenter = () => { base.current = null; look.x = 0; look.y = 0; };

  /* ---------- sideways swipe to look (when gyro is off) ---------- */
  useEffect(() => {
    if (!touch) return;
    let sx = 0, sy = 0, lx = 0, horizontal: boolean | null = null;
    const start = (e: TouchEvent) => {
      if (!(e.target as HTMLElement).closest(".stage")) return;
      sx = e.touches[0].clientX; sy = e.touches[0].clientY; lx = look.x; horizontal = null;
    };
    const move = (e: TouchEvent) => {
      if (gyro === "on" || !(e.target as HTMLElement).closest(".stage")) return;
      const dx = e.touches[0].clientX - sx, dy = e.touches[0].clientY - sy;
      if (horizontal === null && Math.hypot(dx, dy) > 10) horizontal = Math.abs(dx) > Math.abs(dy) * 1.3;
      if (horizontal) { look.source = "touch"; look.x = clamp(lx - (dx / innerWidth) * 2.4, 1.6); }
    };
    const end = () => { if (horizontal && gyro !== "on") { const ease = () => { look.x *= 0.9; if (Math.abs(look.x) > 0.01 && look.source === "touch") requestAnimationFrame(ease); }; setTimeout(ease, 900); } };
    addEventListener("touchstart", start, { passive: true });
    addEventListener("touchmove", move, { passive: true });
    addEventListener("touchend", end, { passive: true });
    return () => { removeEventListener("touchstart", start); removeEventListener("touchmove", move); removeEventListener("touchend", end); };
  }, [touch, gyro]);

  /* ---------- hold-to-walk: eased acceleration, gentle stop ---------- */
  const loop = useCallback((t: number) => {
    const w = walk.current;
    const dt = Math.min(0.1, (t - (w.last || t)) / 1000);
    w.last = t;
    const target = w.dir * 3.0; // metres per second
    w.speed += (target - w.speed) * (1 - Math.exp(-dt * (w.dir ? 3.5 : 6)));
    if (w.dir !== 0 || Math.abs(w.speed) > 0.01) {
      const maxY = LENGTH * pxPerUnit();
      scrollTo({ top: Math.max(0, Math.min(maxY, scrollY + w.speed * dt * pxPerUnit())), behavior: "instant" as ScrollBehavior });
      w.raf = requestAnimationFrame(loop);
    } else { w.speed = 0; w.raf = 0; w.last = 0; }
  }, []);
  const press = (dir: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    museum.set({ selected: null });
    walk.current.dir = dir;
    if (!walk.current.raf) { walk.current.last = 0; walk.current.raf = requestAnimationFrame(loop); }
    navigator.vibrate?.(8);
  };
  const release = () => { walk.current.dir = 0; };
  useEffect(() => () => cancelAnimationFrame(walk.current.raf), []);

  if (!touch) return null;
  const show = !hidden && !selected && !overlay;

  return (
    <>
      <div className={`mpad ${show ? "show" : ""}`} aria-hidden={!show}>
        <button className="mpad-btn" onPointerDown={press(1)} onPointerUp={release} onPointerCancel={release} onPointerLeave={release} aria-label="Walk forward" tabIndex={show ? 0 : -1}>
          <svg viewBox="0 0 24 24"><path d="M12 5l7 9H5z" /></svg>
        </button>
        <button className="mpad-btn sm" onPointerDown={press(-1)} onPointerUp={release} onPointerCancel={release} onPointerLeave={release} aria-label="Walk back" tabIndex={show ? 0 : -1}>
          <svg viewBox="0 0 24 24"><path d="M12 19l-7-9h14z" /></svg>
        </button>
      </div>
      {gyro !== "unavailable" && (
        <div className={`mgyro ${show ? "show" : ""}`}>
          <button className={`mgyro-btn ${gyro === "on" ? "on" : ""}`} onClick={toggleGyro} aria-pressed={gyro === "on"} aria-label="Motion look" tabIndex={show ? 0 : -1}>
            <svg viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M3 9c-1 2-1 4 0 6M21 9c1 2 1 4 0 6" /></svg>
            <span>{gyro === "on" ? "Tilt on" : "Tilt"}</span>
          </button>
          {gyro === "on" && <button className="mgyro-btn" onClick={recenter} aria-label="Re-centre view" tabIndex={show ? 0 : -1}><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></svg></button>}
        </div>
      )}
      {prompt && (
        <div className="gyro-card" role="dialog" aria-label="Motion look">
          <div className="gyro-icon"><svg viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="2" /><path d="M3 9c-1 2-1 4 0 6M21 9c1 2 1 4 0 6" /></svg></div>
          <b>Look around by moving your phone</b>
          <p>Turn and tilt your phone to look around the halls. Hold ▲ to walk.</p>
          <div className="actions">
            <button className="btn btn-gold" onClick={enableGyro}>Turn on</button>
            <button className="btn btn-line" onClick={() => { setPrompt(false); try { sessionStorage.setItem("gyro-prompt", "no"); } catch {} }}>Not now</button>
          </div>
        </div>
      )}
    </>
  );
}
