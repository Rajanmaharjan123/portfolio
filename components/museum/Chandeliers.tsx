"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { lightAt } from "@/lib/museum";
import { COL_STEP, columnZs } from "./Architecture";
import { M, glowTex } from "./materials";

/* Jhoomer positions: one over the carpet every other bay */
export const chandelierZs = columnZs.filter((_, i) => i % 2 === 0).map((z) => z - COL_STEP / 2);
const Y = 5.7; // height of the lower candle ring

type P = [number, number, number];
function useInstanced(items: { p: P; r?: P; s?: P }[]) {
  const ref = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), s = new THREE.Vector3(), p = new THREE.Vector3();
    items.forEach((it, i) => {
      e.set(...(it.r ?? [0, 0, 0])); q.setFromEuler(e); s.set(...(it.s ?? [1, 1, 1])); p.set(...it.p);
      ref.current!.setMatrixAt(i, m.compose(p, q, s));
    });
    ref.current!.instanceMatrix.needsUpdate = true;
  }, [items]);
  return ref;
}

function build() {
  const crystals: { p: P; s?: P }[] = [], candles: { p: P }[] = [], flames: { p: P }[] = [], cups: { p: P }[] = [], arms: { p: P; r: P; s: P }[] = [];
  const rings: { p: P; s: P }[] = [], stems: { p: P }[] = [], balls: { p: P; s: P }[] = [], chains: { p: P }[] = [];
  for (const z of chandelierZs) {
    chains.push({ p: [0, 8.7, z] });
    stems.push({ p: [0, Y + 0.55, z] });
    balls.push({ p: [0, Y - 0.15, z], s: [1, 1.2, 1] }, { p: [0, Y + 1.25, z], s: [0.7, 0.7, 0.7] });
    rings.push({ p: [0, Y, z], s: [1, 1, 1] }, { p: [0, Y + 0.6, z], s: [0.6, 0.6, 0.6] }, { p: [0, Y + 1.15, z], s: [0.32, 0.32, 0.32] });
    // tier 1: 10 candles, tier 2: 6 candles
    for (const [n, r, y] of [[10, 1.05, Y], [6, 0.63, Y + 0.6]] as const) {
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + (n === 6 ? 0.3 : 0);
        const x = Math.cos(a) * r, zz = Math.sin(a) * r;
        cups.push({ p: [x, y + 0.04, z + zz] });
        candles.push({ p: [x, y + 0.17, z + zz] });
        flames.push({ p: [x, y + 0.33, z + zz] });
        arms.push({ p: [x * 0.5, y - 0.04, z + zz * 0.5], r: [0, -a, Math.PI / 2], s: [1, r, 1] });
        // pendant strand under each arm
        if (n === 10) for (let k = 1; k <= 3; k++) crystals.push({ p: [x * 0.98, y - 0.12 - k * 0.11, z + zz * 0.98], s: k === 3 ? [1.6, 1.6, 1.6] : [1, 1, 1] });
        // swag between this candle and the next
        const a2 = ((i + 1) / n) * Math.PI * 2 + (n === 6 ? 0.3 : 0);
        for (let k = 1; k < 5; k++) {
          const t = k / 5, aa = a + (a2 - a) * t, sag = Math.sin(t * Math.PI) * (n === 10 ? 0.28 : 0.18);
          crystals.push({ p: [Math.cos(aa) * r * 0.97, y - 0.05 - sag, z + Math.sin(aa) * r * 0.97] });
        }
      }
    }
    // central drop cascade
    for (let k = 0; k < 5; k++) crystals.push({ p: [0, Y - 0.4 - k * 0.12, z], s: [1.2 - k * 0.12, 1.2 - k * 0.12, 1.2 - k * 0.12] });
    // crown fringe
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; crystals.push({ p: [Math.cos(a) * 0.34, Y + 1.0, z + Math.sin(a) * 0.34] }); }
  }
  return { crystals, candles, flames, cups, arms, rings, stems, balls, chains };
}

export default function Chandeliers() {
  const d = useMemo(build, []);
  const geo = useMemo(() => ({
    crystal: new THREE.OctahedronGeometry(0.045, 0).scale(1, 1.7, 1),
    candle: new THREE.CylinderGeometry(0.03, 0.03, 0.24, 10),
    flame: new THREE.SphereGeometry(0.032, 8, 8).scale(1, 1.8, 1),
    cup: new THREE.CylinderGeometry(0.08, 0.045, 0.07, 14),
    arm: new THREE.CylinderGeometry(0.022, 0.022, 1, 8),
    ring: new THREE.TorusGeometry(1.05, 0.035, 10, 64).rotateX(Math.PI / 2),
    stem: new THREE.CylinderGeometry(0.05, 0.09, 1.5, 16),
    ball: new THREE.SphereGeometry(0.13, 20, 16),
    chain: new THREE.CylinderGeometry(0.018, 0.018, 4.6, 6),
  }), []);
  const refs = {
    crystals: useInstanced(d.crystals), candles: useInstanced(d.candles), flames: useInstanced(d.flames), cups: useInstanced(d.cups),
    arms: useInstanced(d.arms), rings: useInstanced(d.rings), stems: useInstanced(d.stems), balls: useInstanced(d.balls), chains: useInstanced(d.chains),
  };

  const glow = useMemo(() => new THREE.SpriteMaterial({ map: glowTex(), color: "#ffd59a", transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.9 }), []);

  // twinkle
  useFrame((s) => { (M.crystal as THREE.MeshPhysicalMaterial).emissiveIntensity = 0.45 + Math.sin(s.clock.elapsedTime * 2.3) * 0.12; });

  return (
    <group>
      <instancedMesh ref={refs.chains} args={[geo.chain, M.brass, d.chains.length]} frustumCulled={false} />
      <instancedMesh ref={refs.stems} args={[geo.stem, M.gold, d.stems.length]} frustumCulled={false} />
      <instancedMesh ref={refs.balls} args={[geo.ball, M.crystal, d.balls.length]} frustumCulled={false} />
      <instancedMesh ref={refs.rings} args={[geo.ring, M.gold, d.rings.length]} frustumCulled={false} />
      <instancedMesh ref={refs.arms} args={[geo.arm, M.gold, d.arms.length]} frustumCulled={false} />
      <instancedMesh ref={refs.cups} args={[geo.cup, M.gold, d.cups.length]} frustumCulled={false} />
      <instancedMesh ref={refs.candles} args={[geo.candle, M.candle, d.candles.length]} frustumCulled={false} />
      <instancedMesh ref={refs.flames} args={[geo.flame, M.flame, d.flames.length]} frustumCulled={false} />
      <instancedMesh ref={refs.crystals} args={[geo.crystal, M.crystal, d.crystals.length]} frustumCulled={false} />
      {chandelierZs.map((z) => (
        <group key={z}>
          <sprite position={[0, Y + 0.3, z]} scale={[5, 5, 1]} material={glow} />
          <sprite position={[0, Y + 0.3, z]} scale={[1.6, 1.6, 1]} material={glow} />
        </group>
      ))}
      <LightPool />
    </group>
  );
}

/* A handful of real lights hop to the chandeliers nearest the visitor, tinted by gallery */
function LightPool() {
  const { camera } = useThree();
  const lights = useRef<(THREE.PointLight | null)[]>([]);
  const col = useMemo(() => new THREE.Color(), []);
  useFrame((_, dt) => {
    const cz = camera.position.z - 5;
    // Each light owns every 3rd chandelier, so a light only ever hops between chandeliers
    // that are ~30 m apart — out of sight — and the lighting never visibly "pops".
    for (let i = 0; i < 3; i++) {
      const l = lights.current[i];
      if (!l) continue;
      let best = chandelierZs[i] ?? 0, bd = Infinity;
      for (let k = i; k < chandelierZs.length; k += 3) {
        const d = Math.abs(chandelierZs[k] - cz);
        if (d < bd) { bd = d; best = chandelierZs[k]; }
      }
      if (Math.abs(l.position.z - best) > 0.01) {
        // fade out, move, fade back in
        l.intensity = Math.max(0, l.intensity - dt * 90);
        if (l.intensity <= 0.5) l.position.set(0, Y - 0.2, best);
      } else {
        l.intensity += (30 - l.intensity) * Math.min(1, dt * 3);
      }
      col.set(lightAt(best));
      l.color.lerp(col, Math.min(1, dt * 2));
    }
  });
  return (
    <>
      {[0, 1, 2].map((i) => (
        <pointLight key={i} ref={(r) => { lights.current[i] = r; }} intensity={30} distance={16} decay={1.5} color="#ffd9a0" />
      ))}
    </>
  );
}
