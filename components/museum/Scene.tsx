"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { AVATAR_Z, END_Z, LENGTH, START_Z, exhibits, lightAt } from "@/lib/museum";
import { museum } from "@/lib/store";
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

const look = { x: 0, y: 0 };

/* First-person camera: scroll position = where you stand in the corridor */
function Walker() {
  const { camera, size } = useThree();
  const pos = useRef(START_Z);
  const dir = useMemo(() => new THREE.Vector3(0, 0, -1), []);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const want = useMemo(() => new THREE.Vector3(), []);
  const still = useMemo(() => typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const walked = useRef(0);

  useEffect(() => {
    (camera as THREE.PerspectiveCamera).fov = size.width / size.height < 0.8 ? 74 : 62;
    camera.updateProjectionMatrix();
  }, [camera, size]);

  useFrame((_, dt) => {
    dt = Math.min(dt, 0.05);
    const max = document.documentElement.scrollHeight - innerHeight || 1;
    const p = Math.min(1, Math.max(0, scrollY / max));
    const goal = START_Z - p * LENGTH;
    const prev = pos.current;
    pos.current += (goal - pos.current) * (1 - Math.exp(-dt * 4.5));
    const step = Math.abs(pos.current - prev);
    walked.current += step;
    const bob = still ? 0 : Math.sin(walked.current * 2.6) * Math.min(0.05, step * 0.6);
    // step around the avatar's pedestal in the entrance vestibule
    const around = Math.exp(-(((pos.current - AVATAR_Z) / 2.3) ** 2)) * 1.9;
    camera.position.set(around, 1.65 + bob, pos.current);

    const sel = museum.get().selected;
    const ex = sel ? exhibits.find((e) => e.id === sel) : null;
    if (ex) {
      const aspect = size.width / size.height;
      const sideX = ex.wall ? ex.side * (HALF_W - 0.1) : ex.side * (aspect < 0.8 ? 2.1 : 2.75);
      // look at the exhibit, nudged so the pamphlet doesn't cover it
      want.set(sideX * (aspect < 0.8 ? 0.85 : 1) - (aspect < 0.8 ? 0 : ex.side * 0.9), ex.wall ? 2.9 : (ex.art === "desk" ? 1.5 : 2.2), ex.z);
      if (ex.art === "desk") want.set(0, 1.6, END_Z - 8);
      if (ex.art === "avatar") want.set(aspect < 0.8 ? 0 : -0.7, 2.3, ex.z);
    } else if (pos.current > AVATAR_Z + 1.2) {
      // at the entrance, the visitor's eye is drawn to the host
      want.set(look.x * 1.5, 2.15 + look.y * 0.8, AVATAR_Z);
    } else {
      want.set(look.x * 3.2, 1.6 + look.y * 1.1, pos.current - 10);
    }
    // steer the *view direction* (not a point) so walking fast never flips the camera around
    tmp.copy(want).sub(camera.position).normalize();
    dir.lerp(tmp, 1 - Math.exp(-dt * 4)).normalize();
    camera.lookAt(tmp.copy(camera.position).add(dir));
  });
  return null;
}

export default function Scene() {
  const [dpr, setDpr] = useState(1.5);
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
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
      <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(Math.min(1.6, window.devicePixelRatio))} />
      <Env />
      <ambientLight intensity={0.22} color="#ffe7c4" />
      <HallMood />
      <directionalLight position={[2, 9, 4]} intensity={0.3} color="#ffe2b0" />
      <CameraLamp />
      <Architecture />
      <Chandeliers />
      <Exhibits />
      <Walker />
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
