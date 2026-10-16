"use client";
import { Html, Sparkles } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { AVATAR_Z, BACK_WALL_Z, START_Z, halls } from "@/lib/museum";
import { M, carpetTex, damaskTex, floorTex, frescoTex, glowTex, holo } from "./materials";

export const HALF_W = 5.6;   // corridor half width
export const WALL_H = 6.6;   // top of the wall / start of the vault
const FRONT = START_Z + 8;
const LEN = FRONT - BACK_WALL_Z;
const MID = (FRONT + BACK_WALL_Z) / 2;
export const COL_STEP = 5.2;

/* column positions along both walls */
export const columnZs: number[] = [];
for (let z = START_Z - 1; z > BACK_WALL_Z + 2; z -= COL_STEP) columnZs.push(z);
const chronicle = halls.find((h) => h.id === "chronicle");
const inChronicle = (z: number) => !!chronicle && z < chronicle.z && z > chronicle.end;

/* ---------- instancing helper: one draw call for many copies ---------- */
type Xf = { p: [number, number, number]; r?: [number, number, number]; s?: [number, number, number] };
function Instances({ geometry, material, items }: { geometry: THREE.BufferGeometry; material: THREE.Material; items: Xf[] }) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();
    items.forEach((it, i) => {
      e.set(...(it.r ?? [0, 0, 0])); q.setFromEuler(e);
      s.set(...(it.s ?? [1, 1, 1])); p.set(...it.p);
      m.compose(p, q, s);
      ref.current!.setMatrixAt(i, m);
    });
    ref.current!.instanceMatrix.needsUpdate = true;
    ref.current!.computeBoundingSphere();
  }, [items]);
  return <instancedMesh ref={ref} args={[geometry, material, items.length]} frustumCulled={false} />;
}

/* ---------- Corinthian-style columns, all instanced ---------- */
function Columns() {
  const parts = useMemo(() => {
    const at = (y: number) => columnZs.flatMap((z) => [-1, 1].map((s) => ({ p: [s * (HALF_W - 0.5), y, z] as [number, number, number] })));
    const vol = columnZs.flatMap((z) => [-1, 1].flatMap((s) => [[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([a, b]) => ({ p: [s * (HALF_W - 0.5) + a * 0.3, 5.92, z + b * 0.3] as [number, number, number] }))));
    return {
      plinth: { g: new THREE.BoxGeometry(1.05, 0.4, 1.05), m: M.marbleDark, i: at(0.2) },
      base1: { g: new THREE.TorusGeometry(0.4, 0.08, 10, 28).rotateX(Math.PI / 2), m: M.gold, i: at(0.48) },
      base2: { g: new THREE.TorusGeometry(0.36, 0.06, 10, 28).rotateX(Math.PI / 2), m: M.marble, i: at(0.6) },
      shaft: { g: new THREE.CylinderGeometry(0.3, 0.35, 5.0, 28), m: M.marble, i: at(3.1) },
      neck: { g: new THREE.TorusGeometry(0.31, 0.04, 8, 28).rotateX(Math.PI / 2), m: M.gold, i: at(5.62) },
      bell: { g: new THREE.CylinderGeometry(0.5, 0.31, 0.55, 28), m: M.gold, i: at(5.9) },
      volute: { g: new THREE.SphereGeometry(0.1, 12, 10), m: M.gold, i: vol },
      abacus: { g: new THREE.BoxGeometry(1.1, 0.16, 1.1), m: M.marble, i: at(6.25) },
    };
  }, []);
  return <>{Object.entries(parts).map(([k, v]) => <Instances key={k} geometry={v.g} material={v.m} items={v.i} />)}</>;
}

/* ---------- Wall sconces between columns: gilt plate, two candles, glow ---------- */
export const sconces: [number, number, number][] = [];
for (let i = 0; i < columnZs.length - 1; i++) {
  const z = (columnZs[i] + columnZs[i + 1]) / 2;
  if (inChronicle(z)) continue; // portraits hang there; they have picture lights instead
  for (const s of [-1, 1]) sconces.push([s * (HALF_W - 0.05), 3.4, z]);
}

function Sconces() {
  const items = useMemo(() => {
    const plate: Xf[] = [], arm: Xf[] = [], cup: Xf[] = [], candle: Xf[] = [], flame: Xf[] = [];
    sconces.forEach(([x, y, z]) => {
      const s = Math.sign(x), inX = x - s * 0.06;
      plate.push({ p: [inX, y, z], s: [1, 1, 1] });
      for (const dz of [-0.28, 0.28]) {
        arm.push({ p: [x - s * 0.22, y - 0.12, z + dz * 0.6], r: [0, 0, s * 0.9] });
        cup.push({ p: [x - s * 0.36, y + 0.02, z + dz], });
        candle.push({ p: [x - s * 0.36, y + 0.17, z + dz] });
        flame.push({ p: [x - s * 0.36, y + 0.33, z + dz] });
      }
    });
    return { plate, arm, cup, candle, flame };
  }, []);
  const g = useMemo(() => ({
    plate: new THREE.CylinderGeometry(0.16, 0.16, 0.05, 24, 1).rotateZ(Math.PI / 2).scale(1, 2.6, 1),
    arm: new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8),
    cup: new THREE.CylinderGeometry(0.07, 0.04, 0.06, 16),
    candle: new THREE.CylinderGeometry(0.028, 0.028, 0.26, 12),
    flame: new THREE.SphereGeometry(0.03, 8, 8).scale(1, 1.8, 1),
  }), []);
  const glow = useMemo(() => new THREE.SpriteMaterial({ map: glowTex(), color: "#ffcf8a", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), []);
  return (
    <>
      <Instances geometry={g.plate} material={M.gold} items={items.plate} />
      <Instances geometry={g.arm} material={M.brass} items={items.arm} />
      <Instances geometry={g.cup} material={M.gold} items={items.cup} />
      <Instances geometry={g.candle} material={M.candle} items={items.candle} />
      <Instances geometry={g.flame} material={M.flame} items={items.flame} />
      {sconces.map(([x, y, z], i) => (
        <sprite key={i} position={[x - Math.sign(x) * 0.4, y + 0.3, z]} scale={[1.6, 1.6, 1]} material={glow} />
      ))}
    </>
  );
}

/* ---------- Gilded wall panels (boiserie) between columns ---------- */
function Panels() {
  const items = useMemo(() => {
    const h: Xf[] = [], v: Xf[] = [];
    for (let i = 0; i < columnZs.length - 1; i++) {
      const z = (columnZs[i] + columnZs[i + 1]) / 2;
      if (inChronicle(z)) continue;
      for (const s of [-1, 1]) {
        const x = s * (HALF_W - 0.03);
        const w = COL_STEP - 1.6;
        // upper silk panel frame
        h.push({ p: [x, 5.9, z], s: [1, 1, w] }, { p: [x, 1.85, z], s: [1, 1, w] });
        v.push({ p: [x, 3.875, z - w / 2], s: [1, 4.1, 1] }, { p: [x, 3.875, z + w / 2], s: [1, 4.1, 1] });
        // lower dado panel
        h.push({ p: [x, 1.15, z], s: [1, 1, w] }, { p: [x, 0.35, z], s: [1, 1, w] });
        v.push({ p: [x, 0.75, z - w / 2], s: [1, 0.85, 1] }, { p: [x, 0.75, z + w / 2], s: [1, 0.85, 1] });
      }
    }
    return { h, v };
  }, []);
  const g = useMemo(() => ({ h: new THREE.BoxGeometry(0.06, 0.07, 1), v: new THREE.BoxGeometry(0.06, 1, 0.07) }), []);
  return (
    <>
      <Instances geometry={g.h} material={M.gold} items={items.h} />
      <Instances geometry={g.v} material={M.gold} items={items.v} />
    </>
  );
}

/* ---------- Cornice with dentils ---------- */
function Cornice() {
  const dentils = useMemo(() => {
    const out: Xf[] = [];
    for (let z = FRONT; z > BACK_WALL_Z; z -= 0.3) for (const s of [-1, 1]) out.push({ p: [s * (HALF_W - 0.12), 6.42, z] });
    return out;
  }, []);
  const dg = useMemo(() => new THREE.BoxGeometry(0.16, 0.14, 0.14), []);
  return (
    <>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * HALF_W, 0, MID]}>
          <mesh position={[-s * 0.08, 6.2, 0]} material={M.gold}><boxGeometry args={[0.16, 0.08, LEN]} /></mesh>
          <mesh position={[-s * 0.15, 6.42, 0]} material={M.marble}><boxGeometry args={[0.1, 0.3, LEN]} /></mesh>
          <mesh position={[-s * 0.26, 6.62, 0]} material={M.marble}><boxGeometry args={[0.52, 0.12, LEN]} /></mesh>
          <mesh position={[-s * 0.3, 6.7, 0]} material={M.gold}><boxGeometry args={[0.6, 0.05, LEN]} /></mesh>
        </group>
      ))}
      <Instances geometry={dg} material={M.marble} items={dentils} />
    </>
  );
}

/* ---------- Vaulted, frescoed ceiling with gilt ribs ---------- */
function Vault() {
  const fresco = useMemo(() => { const t = frescoTex().clone(); t.needsUpdate = true; t.repeat.set(3, LEN / 5.2); return t; }, []);
  const ribs = useMemo(() => columnZs.map((z) => ({ p: [0, WALL_H + 0.05, z] as [number, number, number], s: [1, 0.62, 1] as [number, number, number] })), []);
  const ribG = useMemo(() => new THREE.TorusGeometry(HALF_W - 0.55, 0.12, 8, 48, Math.PI), []);
  return (
    <>
      <mesh position={[0, WALL_H + 0.05, MID]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 1, 0.62]}>
        <cylinderGeometry args={[HALF_W - 0.5, HALF_W - 0.5, LEN, 48, 1, true, Math.PI / 2, Math.PI]} />
        <meshStandardMaterial map={fresco} side={THREE.BackSide} roughness={0.85} />
      </mesh>
      <Instances geometry={ribG} material={M.goldMatte} items={ribs} />
    </>
  );
}

function Arch({ z, numeral, name, tagline }: { z: number; numeral: string; name: string; tagline: string }) {
  const { camera } = useThree();
  const [near, setNear] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useFrame(() => {
    const d = camera.position.z - z;
    // keep signs hidden while the avatar stands between the visitor and the arch
    const n = d > 0.6 && d < 40 && camera.position.z < AVATAR_Z + 0.3;
    if (n !== near) setNear(n);
    if (ref.current) ref.current.style.opacity = String(Math.max(0, Math.min(1, (d - 0.6) / 2, (40 - d) / 10)));
  });
  return (
    <group position={[0, 0, z]}>
      {[-1, 1].map((s) => (
        <group key={s} position={[s * 3.9, 0, 0]}>
          <mesh position={[0, 0.2, 0]} material={M.marbleDark}><boxGeometry args={[1.15, 0.4, 1.15]} /></mesh>
          <mesh position={[0, 2.05, 0]} material={M.marble}><boxGeometry args={[0.9, 3.3, 0.9]} /></mesh>
          {[[0, 3.3, 0.5, 0.04], [0, 0.8, 0.5, 0.04], [-0.25, 2.05, 0.04, 2.54], [0.25, 2.05, 0.04, 2.54]].map(([x, y, w, h], i) => (
            <mesh key={i} position={[x, y, 0.46]} material={M.gold}><boxGeometry args={[w, h, 0.03]} /></mesh>
          ))}
          <mesh position={[0, 2.05, 0.46]} material={M.gold}><sphereGeometry args={[0.07, 14, 10]} /></mesh>
          <mesh position={[0, 3.78, 0]} material={M.gold}><boxGeometry args={[1.08, 0.16, 1.08]} /></mesh>
        </group>
      ))}
      <mesh position={[0, 3.86, 0]} material={M.marble}><torusGeometry args={[3.9, 0.45, 12, 48, Math.PI]} /></mesh>
      <mesh position={[0, 3.86, 0.42]} material={M.gold}><torusGeometry args={[3.9, 0.06, 8, 64, Math.PI]} /></mesh>
      <mesh position={[0, 3.86, 0.46]} material={holo("#5fe8ff", 0.45)}><torusGeometry args={[3.42, 0.012, 6, 60, Math.PI]} /></mesh>
      {/* keystone with crest */}
      <mesh position={[0, 7.8, 0.12]} material={M.gold}><boxGeometry args={[0.55, 0.7, 0.7]} /></mesh>
      <mesh position={[0, 7.8, 0.48]} material={M.marble}><circleGeometry args={[0.18, 24]} /></mesh>
      {near && (
        <Html transform position={[0, 2.85, 0.4]} distanceFactor={3.3} zIndexRange={[5, 0]} pointerEvents="none">
          <div className="sign" ref={ref}>
            <span className="sign-num">Gallery {numeral}</span>
            <b>{name}</b>
            <small>{tagline}</small>
          </div>
        </Html>
      )}
    </group>
  );
}

export default function Architecture() {
  const floor = useMemo(() => { const t = floorTex().clone(); t.needsUpdate = true; t.repeat.set((HALF_W * 2) / 4, LEN / 4); return t; }, []);
  const carpet = useMemo(() => { const t = carpetTex().clone(); t.needsUpdate = true; t.repeat.set(1, LEN / 5.2); return t; }, []);
  const damask = useMemo(() => { const t = damaskTex().clone(); t.needsUpdate = true; t.repeat.set(LEN / 1.5, 5.2 / 2.25); return t; }, []);

  return (
    <group>
      {/* inlaid marble floor + palace runner */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, MID]}>
        <planeGeometry args={[HALF_W * 2, LEN]} />
        <meshStandardMaterial map={floor} roughness={0.14} metalness={0.04} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, MID]}>
        <planeGeometry args={[2.6, LEN]} />
        <meshStandardMaterial map={carpet} roughness={0.95} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} rotation={[-Math.PI / 2, 0, 0]} position={[s * 1.5, 0.02, MID]} material={holo("#5fe8ff", 0.22)}><planeGeometry args={[0.025, LEN]} /></mesh>
      ))}

      {/* walls: marble dado, crimson silk damask above */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * HALF_W, 0, MID]} rotation={[0, -s * Math.PI / 2, 0]}>
          <mesh position={[0, 1.3 + 5.3 / 2, 0]}>
            <planeGeometry args={[LEN, 5.3]} />
            <meshStandardMaterial map={damask} roughness={0.7} metalness={0.05} />
          </mesh>
          <mesh position={[0, 0.65, 0.05]} material={M.marble}><boxGeometry args={[LEN, 1.3, 0.1]} /></mesh>
          <mesh position={[0, 1.33, 0.11]} material={M.gold}><boxGeometry args={[LEN, 0.08, 0.08]} /></mesh>
          <mesh position={[0, 0.08, 0.12]} material={M.marbleDark}><boxGeometry args={[LEN, 0.16, 0.06]} /></mesh>
        </group>
      ))}

      <Columns />
      <Panels />
      <Cornice />
      <Vault />
      <Sconces />

      {halls.map((h) => <Arch key={h.id} z={h.z} numeral={h.numeral} name={h.name} tagline={h.tagline} />)}

      {/* end wall with grand gilded doors */}
      <group position={[0, 0, BACK_WALL_Z]}>
        <mesh position={[0, 4.5, 0]}><planeGeometry args={[HALF_W * 2, 9]} /><meshStandardMaterial map={damask} roughness={0.7} /></mesh>
        <mesh position={[0, 2.9, 0.06]} material={M.gold}><boxGeometry args={[3.8, 5.8, 0.12]} /></mesh>
        <mesh position={[0, 5.9, 0.1]} material={M.gold}><torusGeometry args={[1.9, 0.12, 10, 40, Math.PI]} /></mesh>
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.88, 2.75, 0.14]}>
            <mesh material={M.walnut}><boxGeometry args={[1.66, 5.3, 0.08]} /></mesh>
            <mesh position={[0, 1.2, 0.05]} material={M.goldMatte}><boxGeometry args={[1.2, 2.1, 0.02]} /></mesh>
            <mesh position={[0, -1.4, 0.05]} material={M.goldMatte}><boxGeometry args={[1.2, 1.6, 0.02]} /></mesh>
            <mesh position={[-s * 0.65, 0, 0.1]} material={M.gold}><sphereGeometry args={[0.06, 12, 10]} /></mesh>
          </group>
        ))}
      </group>
      {/* entrance wall behind the visitor */}
      <mesh position={[0, 4.5, FRONT]} rotation={[0, Math.PI, 0]}><planeGeometry args={[HALF_W * 2, 9]} /><meshStandardMaterial map={damask} roughness={0.7} /></mesh>

      {/* dust motes in the candlelight */}
      <Sparkles count={110} scale={[HALF_W * 2, 6, LEN]} position={[0, 3.5, MID]} size={2} speed={0.12} opacity={0.45} color="#ffe2a8" />
    </group>
  );
}
