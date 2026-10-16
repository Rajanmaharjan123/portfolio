"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { look } from "@/lib/look";
import { LENGTH, pxPerUnit } from "@/lib/museum";
import { museum, useMuseum } from "@/lib/store";

/* Phone & tablet controls
   - VR tour: the phone becomes a window into the museum — turn around, look up at the
     chandeliers, look down at the floor (full 360°, driven by the gyroscope).
     Hold your gaze on an exhibit to open it. iOS asks permission on a tap.
   - Hold-to-walk pad: ▲ walks the way you're facing, with eased acceleration
   - Swipe sideways to look around when VR is off */

type DOE = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };

const clamp = (v: number, a: number) => Math.max(-a, Math.min(a, v));

export default function MobileControls({ hidden }: { hidden: boolean }) {
  const [touch, setTouch] = useState(false);
  const [vr, setVr] = useState<"off" | "on" | "ask" | "unavailable">("off");
  const [prompt, setPrompt] = useState(false);
  const [toast, setToast] = useState(false);
  const ready = useMuseum((s) => s.ready);
  const selected = useMuseum((s) => s.selected);
  const overlay = useMuseum((s) => s.guide || s.catalogue);
  const walk = useRef({ dir: 0, speed: 0, raf: 0, last: 0 });
  const ring = useRef<SVGCircleElement>(null);
  const gyro = vr; // kept for the swipe handler below

  /* ---------- detect a touch device ---------- */
  useEffect(() => {
    const coarse = matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    setTouch(coarse);
    if (!coarse) return;
    const DO = window.DeviceOrientationEvent as DOE | undefined;
    if (!DO) { setVr("unavailable"); return; }
    setVr(typeof DO.requestPermission === "function" ? "ask" : "off");
  }, []);

  /* once the doors open: Android goes straight into VR, iPhone gets a card (it needs a tap for permission) */
  useEffect(() => {
    if (!touch || !ready) return;
    let dismissed = false;
    try { dismissed = sessionStorage.getItem("vr-prompt") === "no"; } catch {}
    if (dismissed) return;
    const t = setTimeout(() => {
      if (vr === "ask") setPrompt(true);
      else if (vr === "off") startVr(true);
    }, 1600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [touch, ready]);

  /* ---------- device orientation → VR camera ---------- */
  useEffect(() => {
    look.vr = vr === "on";
    document.body.classList.toggle("vr-on", vr === "on");
    if (vr !== "on") { look.orient.has = false; return; }
    let got = false;
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.alpha == null || e.beta == null || e.gamma == null) return;
      got = true;
      const angle = (screen.orientation?.angle ?? (window as unknown as { orientation?: number }).orientation ?? 0) as number;
      look.orient.a = e.alpha; look.orient.b = e.beta; look.orient.g = e.gamma; look.orient.screen = angle;
      if (!look.orient.has) { look.orient.has = true; look.recenter = true; }
      look.source = "gyro";
    };
    addEventListener("deviceorientation", onOrient);
    const t = setTimeout(() => { if (!got) { setVr("unavailable"); setToast(false); } }, 2500); // no sensor
    // gaze ring animation
    let raf = 0;
    const tick = () => {
      if (ring.current) ring.current.style.strokeDashoffset = String(113 * (1 - look.gaze.p));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { removeEventListener("deviceorientation", onOrient); clearTimeout(t); cancelAnimationFrame(raf); look.vr = false; document.body.classList.remove("vr-on"); };
  }, [vr]);

  const startVr = useCallback(async (auto = false) => {
    setPrompt(false);
    const DO = window.DeviceOrientationEvent as DOE | undefined;
    if (!DO) { setVr("unavailable"); return; }
    try {
      const res = DO.requestPermission ? await DO.requestPermission() : "granted";
      if (res !== "granted") { setVr("unavailable"); return; }
      look.recenter = true;
      setVr("on");
      setToast(true); setTimeout(() => setToast(false), auto ? 4200 : 3200);
      // immersive: go full-screen where the browser allows it (Android)
      if (!auto) document.documentElement.requestFullscreen?.().catch(() => {});
    } catch { setVr("unavailable"); }
  }, []);

  const toggleVr = () => {
    if (vr === "on") { setVr("off"); look.x = 0; look.y = 0; if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {}); return; }
    startVr();
  };
  const recenter = () => { look.recenter = true; navigator.vibrate?.(10); };

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
    const target = w.dir * (look.vr ? look.facing : 1) * 3.0; // metres per second, in the direction you face
    w.speed += (target - w.speed) * (1 - Math.exp(-dt * (w.dir ? 3.5 : 10)));
    if (w.dir !== 0 || Math.abs(w.speed) > 0.01) {
      const maxY = LENGTH * pxPerUnit();
      scrollTo({ top: Math.max(0, Math.min(maxY, scrollY + w.speed * dt * pxPerUnit())), behavior: "instant" as ScrollBehavior });
      w.raf = requestAnimationFrame(loop);
    } else { w.speed = 0; w.raf = 0; w.last = 0; }
  }, []);
  /* Walk ONLY while a finger is on ▲ / ▼. Every way a touch can end stops the walk:
     finger lifted anywhere, touch cancelled, capture lost, app backgrounded, pad hidden. */
  const press = (dir: number) => (e: React.PointerEvent) => {
    e.preventDefault();
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch {}
    walk.current.dir = dir;
    look.walking = true;
    museum.set({ selected: null });
    if (!walk.current.raf) { walk.current.last = 0; walk.current.raf = requestAnimationFrame(loop); }
    navigator.vibrate?.(8);
  };
  const release = useCallback(() => { walk.current.dir = 0; look.walking = false; }, []);
  useEffect(() => {
    const stop = () => release();
    const vis = () => { if (document.hidden) release(); };
    addEventListener("pointerup", stop);
    addEventListener("pointercancel", stop);
    addEventListener("touchend", stop, { passive: true });
    addEventListener("touchcancel", stop, { passive: true });
    addEventListener("blur", stop);
    document.addEventListener("visibilitychange", vis);
    return () => {
      removeEventListener("pointerup", stop); removeEventListener("pointercancel", stop);
      removeEventListener("touchend", stop); removeEventListener("touchcancel", stop);
      removeEventListener("blur", stop); document.removeEventListener("visibilitychange", vis);
    };
  }, [release]);
  useEffect(() => () => cancelAnimationFrame(walk.current.raf), []);

  if (!touch) return null;
  const show = !hidden && !selected && !overlay;
  if (!show && walk.current.dir !== 0) { walk.current.dir = 0; look.walking = false; }

  return (
    <>
      <div className={`mpad ${show ? "show" : ""}`} aria-hidden={!show}>
        <button className="mpad-btn" onPointerDown={press(1)} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release} onContextMenu={(e) => e.preventDefault()} aria-label="Walk forward" tabIndex={show ? 0 : -1}>
          <svg viewBox="0 0 24 24"><path d="M12 5l7 9H5z" /></svg>
        </button>
        <button className="mpad-btn sm" onPointerDown={press(-1)} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release} onContextMenu={(e) => e.preventDefault()} aria-label="Walk back" tabIndex={show ? 0 : -1}>
          <svg viewBox="0 0 24 24"><path d="M12 19l-7-9h14z" /></svg>
        </button>
      </div>
      {vr !== "unavailable" && (
        <div className={`mgyro ${show ? "show" : ""}`}>
          <button className={`mgyro-btn ${vr === "on" ? "on" : ""}`} onClick={toggleVr} aria-pressed={vr === "on"} aria-label="VR tour" tabIndex={show ? 0 : -1}>
            <svg viewBox="0 0 24 24"><path d="M3 8.5C3 7.7 3.7 7 4.5 7h15c.8 0 1.5.7 1.5 1.5v6c0 .8-.7 1.5-1.5 1.5h-4l-2-2.5h-3L8.5 16h-4C3.7 16 3 15.3 3 14.5z" /><circle cx="8" cy="11" r="1.6" /><circle cx="16" cy="11" r="1.6" /></svg>
            <span>{vr === "on" ? "VR on" : "VR tour"}</span>
          </button>
          {vr === "on" && <button className="mgyro-btn" onClick={recenter} aria-label="Re-centre view" tabIndex={show ? 0 : -1}><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></svg></button>}
        </div>
      )}
      {vr === "on" && !overlay && (
        <div className={`vr-reticle ${selected ? "dim" : ""}`} aria-hidden>
          <svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="3" className="dot" /><circle cx="20" cy="20" r="18" className="track" /><circle ref={ring} cx="20" cy="20" r="18" className="fill" /></svg>
        </div>
      )}
      {toast && <div className="vr-toast" role="status"><b>VR tour on</b> Move your phone to look around · look at an exhibit to open it · hold ▲ to walk</div>}
      {prompt && (
        <div className="gyro-card" role="dialog" aria-label="VR tour">
          <div className="gyro-icon"><svg viewBox="0 0 24 24"><path d="M3 8.5C3 7.7 3.7 7 4.5 7h15c.8 0 1.5.7 1.5 1.5v6c0 .8-.7 1.5-1.5 1.5h-4l-2-2.5h-3L8.5 16h-4C3.7 16 3 15.3 3 14.5z" /><circle cx="8" cy="11" r="1.6" /><circle cx="16" cy="11" r="1.6" /></svg></div>
          <b>Take the VR tour</b>
          <p>Your phone becomes a window into the museum — turn around, look up at the chandeliers. Look at an exhibit to open it, hold ▲ to walk.</p>
          <div className="actions">
            <button className="btn btn-gold" onClick={() => startVr()}>Start VR tour</button>
            <button className="btn btn-line" onClick={() => { setPrompt(false); try { sessionStorage.setItem("vr-prompt", "no"); } catch {} }}>Not now</button>
          </div>
        </div>
      )}
    </>
  );
}
