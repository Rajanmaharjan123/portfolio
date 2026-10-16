"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor, Preload } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { AVATAR_Z, END_Z, PORTRAIT_X, START_Z, exhibits, lightAt, zFromScroll } from "@/lib/museum";
import { museum } from "@/lib/store";
import { look } from "@/lib/look";
import Architecture, { HALF_W } from "./Architecture";
import Chandeliers from "./Chandeliers";
import Exhibit from "./Exhibit";

/* Gives metals something to reflect — generated locally, no HDR download */
function Env() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const env = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.55;
    return () => { env.dispose(); pm.dispose(); };
  }, [gl, scene]);
  return null;
}


/* Critically-damped follow (like Unity's SmoothDamp): eases in and out, never overshoots */
function smoothDamp(cur: number, target: number, vel: { v: number }, time: number, dt: number) {
  const omega = 2 / time, x = omega * dt, exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x);
  const change = cur - target, temp = (vel.v + omega * change) * dt;
  vel.v = (vel.v - omega * temp) * exp;
  return target + (change + temp) * exp;
}

/* First-person camera: scroll position = where you stand in the corridor.
   No head-bob, no swerving — a steady glide down the centre of the hall. */
function Walker() {
  const { camera, size } = useThree();
  const pos = useRef(START_Z);
  const vel = useRef({ v: 0 });
  const dir = useMemo(() => new THREE.Vector3(0, 0, -1), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const want = useMemo(() => new THREE.Vector3(), []);
  const lookS = useRef({ x: 0, y: 0 });

  useEffect(() => {
    (camera as THREE.PerspectiveCamera).fov = size.width / size.height < 0.8 ? 72 : 60;
    camera.updateProjectionMatrix();
  }, [camera, size]);

  useFrame((_, dt) => {
    dt = Math.min(dt, 0.05);
    const goal = zFromScroll();
    // phones get a slightly longer glide so momentum scrolling feels like walking
    pos.current = smoothDamp(pos.current, goal, vel.current, size.width < 760 ? 0.6 : 0.45, dt);
    camera.position.set(0, 1.65, pos.current);

    if (look.vr && look.orient.has) {
      vrLook(camera, dt, size.width / size.height < 0.8 ? 2.1 : 2.75);
      return;
    }

    // mouse-look is smoothed too, so the view drifts instead of snapping
    const k = 1 - Math.exp(-dt * (look.source === "gyro" ? 7 : 3));
    lookS.current.x += (look.x - lookS.current.x) * k;
    lookS.current.y += (look.y - lookS.current.y) * k;
    const lx = lookS.current.x, ly = lookS.current.y;
    const aspect = size.width / size.height, narrow = aspect < 0.8;

    const sel = museum.get().selected;
    const ex = sel ? exhibits.find((e) => e.id === sel) : null;
    if (ex) {
      const sideX = ex.wall ? ex.side * (HALF_W - 0.1) : ex.side * (narrow ? 2.1 : 2.75);
      // look at the exhibit, nudged so the pamphlet doesn't cover it
      want.set(sideX * (narrow ? 0.85 : 1) - (narrow ? 0 : ex.side * 0.9), ex.wall ? 2.4 : (ex.art === "desk" ? 1.5 : 1.9), ex.z);
      if (ex.art === "desk") want.set(0, 1.6, END_Z - 8);
      if (ex.art === "avatar") want.set(PORTRAIT_X + (narrow ? 0 : 0.9), narrow ? 1.2 : 2.1, ex.z);
    } else if (pos.current > AVATAR_Z + 1.2) {
      // at the entrance the eye is drawn to the portrait
      // on phones, aim low only from afar (so the portrait clears the intro card), then level out as you approach
      const far = Math.min(1, Math.max(0, (pos.current - (AVATAR_Z + 1.2)) / 4));
      want.set(PORTRAIT_X + lx * 1.2 - (aspect > 1.3 ? 1.1 : 0), narrow ? 2.0 - 1.6 * far : 2.1 + ly * 0.6, AVATAR_Z);
    } else {
      want.set(lx * 2.6, 1.6 + ly * 0.9, pos.current - 10);
    }
    tmp.copy(want).sub(camera.position).normalize();
    dir.lerp(tmp, 1 - Math.exp(-dt * 3)).normalize();
    camera.lookAt(tmp.copy(camera.position).add(dir));
  });
  return null;
}

/* ---------- VR tour: the phone becomes a window into the museum (3-DoF, 360°) ---------- */
const _e = new THREE.Euler(), _q = new THREE.Quaternion(), _qs = new THREE.Quaternion(), _off = new THREE.Quaternion();
const _qx = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // camera looks out the back of the device
const _zee = new THREE.Vector3(0, 0, 1), _yAxis = new THREE.Vector3(0, 1, 0), _fwd = new THREE.Vector3(), _to = new THREE.Vector3();
const D = THREE.MathUtils.DEG2RAD;
let dwellId: string | null = null, dwellT = 0, lastOpened: string | null = null, awayT = 0;

function deviceQuat(out: THREE.Quaternion) {
  const o = look.orient;
  _e.set(o.b * D, o.a * D, -o.g * D, "YXZ");
  out.setFromEuler(_e).multiply(_qx).multiply(_qs.setFromAxisAngle(_zee, -o.screen * D));
  return out;
}

/* where each exhibit "is" for gaze-selection purposes (its banner / painting / object) */
function gazePoints(e: (typeof exhibits)[number], x: number): [number, number, number][] {
  if (e.art === "avatar") return [[PORTRAIT_X, 2.3, AVATAR_Z]];
  if (e.art === "desk") return [[0, 1.8, e.z]];
  if (e.wall) return [[e.side * (HALF_W - 0.1), 2.5, e.z]];
  if (e.payload.kind === "tech") return [[e.side * x, 1.8, e.z]];
  return [[e.side * x, 1.8, e.z], [e.side * (x + (x < 2.5 ? 1.15 : 1.48)), 1.85, e.z + (x < 2.5 ? 0.7 : 0.91)]];
}

function vrLook(camera: THREE.Camera, dt: number, x: number) {
  deviceQuat(_q);
  if (look.recenter) {
    // whichever way the phone points now becomes "straight down the hall"
    _fwd.set(0, 0, -1).applyQuaternion(_q);
    const heading = Math.atan2(-_fwd.x, -_fwd.z);
    _off.setFromAxisAngle(_yAxis, -heading);
    look.recenter = false;
    camera.quaternion.copy(_off).multiply(_q);
  }
  _q.premultiply(_off);
  camera.quaternion.slerp(_q, 1 - Math.exp(-dt * 14)); // light smoothing kills sensor jitter, keeps it responsive

  // which way are we facing along the hall?
  _fwd.set(0, 0, -1).applyQuaternion(camera.quaternion);
  look.facing = _fwd.z <= 0 ? 1 : -1;

  // gaze-to-open: hold an exhibit in the centre of view for ~1.4 s
  let best: string | null = null, bestA = 0.16; // ~9°
  for (const e of exhibits) {
    const dz = Math.abs(e.z - camera.position.z);
    if (dz > 10) continue;
    for (const [px, py, pz] of gazePoints(e, x)) {
      _to.set(px - camera.position.x, py - camera.position.y, pz - camera.position.z);
      const dist = _to.length();
      if (dist > 9.5 || dist < 0.6) continue;
      const a = _fwd.angleTo(_to);
      if (a < bestA) { bestA = a; best = e.id; }
    }
  }
  const sel = museum.get().selected;
  // looking well away from the open exhibit for a moment closes its pamphlet
  const selEx = sel ? exhibits.find((e) => e.id === sel) : null;
  if (selEx) {
    const [px, py, pz] = gazePoints(selEx, x)[0];
    _to.set(px - camera.position.x, py - camera.position.y, pz - camera.position.z);
    awayT = _fwd.angleTo(_to) > 1.0 ? awayT + dt : 0;
    if (awayT > 1.6) { museum.set({ selected: null }); awayT = 0; }
  } else awayT = 0;
  if (best && best !== sel && best !== lastOpened) {
    if (best !== dwellId) { dwellId = best; dwellT = 0; }
    dwellT += dt;
    look.gaze.id = best; look.gaze.p = Math.min(1, dwellT / 1.4);
    if (dwellT >= 1.4) { museum.set({ selected: best }); lastOpened = best; dwellT = 0; look.gaze.p = 0; }
  } else {
    if (best !== lastOpened) lastOpened = best === null ? null : lastOpened;
    dwellId = null; dwellT = 0; look.gaze.id = best === sel ? best : null; look.gaze.p = 0;
  }
  if (museum.get().hovered !== (look.gaze.id ?? null)) museum.set({ hovered: look.gaze.id });
}

/* Tells the page the first real frames are on screen (after shaders compile) */
function Ready() {
  const n = useRef(0);
  useFrame(() => {
    n.current++;
    if (n.current === 4) museum.set({ ready: true });
  });
  return null;
}

export default function Scene() {
  const [dpr, setDpr] = useState(() => (typeof window !== "undefined" && innerWidth < 760 ? 1.25 : 1.5));
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      look.source = "mouse";
      look.x = (e.clientX / innerWidth) * 2 - 1;
      look.y = -((e.clientY / innerHeight) * 2 - 1);
    };
    addEventListener("pointermove", move);
    return () => removeEventListener("pointermove", move);
  }, []);

  return (
    <Canvas
      className="museum-canvas"
      dpr={dpr}
      camera={{ position: [0, 1.65, START_Z], fov: 62, near: 0.1, far: 80 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onPointerMissed={() => museum.set({ hovered: null })}
    >
      <color attach="background" args={["#160f0c"]} />
      <fog attach="fog" args={["#160f0c", 16, 52]} />
      {/* drop resolution on slower devices to keep walking smooth */}
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(Math.min(innerWidth < 760 ? 1.5 : 1.75, window.devicePixelRatio))} />
      <Env />
      <ambientLight intensity={0.22} color="#ffe7c4" />
      <HallMood />
      <directionalLight position={[2, 9, 4]} intensity={0.3} color="#ffe2b0" />
      <CameraLamp />
      <Architecture />
      <Chandeliers />
      <Exhibits />
      <Walker />
      <Ready />
      {/* compile every shader & upload every texture up front, so walking never hitches */}
      <Preload all />
    </Canvas>
  );
}

/* A warm lamp that travels with the visitor so nearby exhibits always read well */
function CameraLamp() {
  const l = useRef<THREE.PointLight>(null);
  const { camera } = useThree();
  useFrame(() => { l.current?.position.set(0, 4.5, camera.position.z - 4); });
  return <pointLight ref={l} intensity={9} distance={12} decay={1.6} color="#ffd9a0" />;
}

function Exhibits() {
  const { size } = useThree();
  const narrow = size.width / size.height < 0.8;
  const x = narrow ? 2.1 : 2.75;
  return <>{exhibits.map((e) => <Exhibit key={e.id} e={e} x={x} df={narrow ? 3.1 : 4.2} />)}</>;
}

/* The ambient sky/ground light shifts colour as you move between galleries */
function HallMood() {
  const ref = useRef<THREE.HemisphereLight>(null);
  const { camera } = useThree();
  const c = useMemo(() => new THREE.Color(), []);
  useFrame(() => {
    if (!ref.current) return;
    c.set(lightAt(camera.position.z));
    ref.current.color.lerp(c, 0.04);
  });
  return <hemisphereLight ref={ref} args={["#fff1d8", "#3a1a1a", 0.5]} />;
}
