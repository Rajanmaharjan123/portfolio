"use client";
import { useMemo } from "react";
import * as THREE from "three";
import { M } from "./materials";

/* Rajan's portrait: a framed painting on a walnut easel, lit by a brass picture light. */
export const PORTRAIT = { w: 1.35, h: 1.8, y: 2.35 }; // canvas size & centre height

export default function Portrait() {
  const map = useMemo(() => {
    const t = new THREE.TextureLoader().load("/avatar/portrait.jpg");
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);
  const paint = useMemo(() => new THREE.MeshStandardMaterial({ map, emissiveMap: map, emissive: new THREE.Color("#ffffff"), emissiveIntensity: 0.35, roughness: 0.75 }), [map]);
  const { w, h, y } = PORTRAIT;
  const b = 0.17; // frame moulding width

  return (
    <group>
      {/* easel: two front legs, one back leg, ledge */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.5, 1.6, 0.12]} rotation={[0.06, 0, -s * 0.13]} material={M.walnut}>
          <boxGeometry args={[0.07, 3.3, 0.07]} />
        </mesh>
      ))}
      <mesh position={[0, 1.55, -0.45]} rotation={[-0.32, 0, 0]} material={M.walnut}><boxGeometry args={[0.06, 3.2, 0.06]} /></mesh>
      <mesh position={[0, y - h / 2 - b - 0.05, 0.2]} material={M.walnut}><boxGeometry args={[1.7, 0.08, 0.2]} /></mesh>
      <mesh position={[0, y - h / 2 - b - 0.05, 0.31]} material={M.gold}><boxGeometry args={[1.7, 0.02, 0.02]} /></mesh>
      <mesh position={[0, 3.25, 0.12]} material={M.gold}><sphereGeometry args={[0.05, 12, 10]} /></mesh>

      {/* frame */}
      <group position={[0, y, 0.2]} rotation={[-0.06, 0, 0]}>
        {[[0, h / 2 + b / 2, w + 2 * b, b], [0, -h / 2 - b / 2, w + 2 * b, b]].map(([x, yy, ww, hh], i) => (
          <mesh key={`h${i}`} position={[x, yy, 0]} material={M.gold}><boxGeometry args={[ww, hh, 0.12]} /></mesh>
        ))}
        {[-1, 1].map((s) => (
          <mesh key={`v${s}`} position={[s * (w / 2 + b / 2), 0, 0]} material={M.gold}><boxGeometry args={[b, h, 0.12]} /></mesh>
        ))}
        {/* inner gilt lip */}
        {[[0, h / 2 - 0.02, w, 0.04], [0, -h / 2 + 0.02, w, 0.04], [-w / 2 + 0.02, 0, 0.04, h], [w / 2 - 0.02, 0, 0.04, h]].map(([x, yy, ww, hh], i) => (
          <mesh key={`l${i}`} position={[x, yy, 0.04]} material={M.goldMatte}><boxGeometry args={[ww, hh, 0.04]} /></mesh>
        ))}
        {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sy]) => (
          <mesh key={`${sx}${sy}`} position={[sx * (w / 2 + b / 2), sy * (h / 2 + b / 2), 0.07]} material={M.gold}><sphereGeometry args={[0.08, 16, 12]} /></mesh>
        ))}
        {/* crest */}
        <mesh position={[0, h / 2 + b + 0.08, 0.02]} scale={[1.8, 1, 0.5]} material={M.gold}><sphereGeometry args={[0.12, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
        {/* the painting */}
        <mesh position={[0, 0, 0.01]} material={paint}><planeGeometry args={[w, h]} /></mesh>
        <mesh position={[0, 0, -0.065]} material={M.walnut}><boxGeometry args={[w + 2 * b, h + 2 * b, 0.02]} /></mesh>
        {/* picture light */}
        <group position={[0, h / 2 + b + 0.3, 0.32]}>
          <mesh rotation={[0, 0, Math.PI / 2]} material={M.brass}><cylinderGeometry args={[0.05, 0.05, 0.95, 16]} /></mesh>
          <mesh position={[0, -0.045, 0.02]} material={M.flame}><boxGeometry args={[0.85, 0.012, 0.04]} /></mesh>
          {[-0.3, 0.3].map((x) => <mesh key={x} position={[x, -0.12, -0.16]} rotation={[0.9, 0, 0]} material={M.brass}><cylinderGeometry args={[0.012, 0.012, 0.4, 8]} /></mesh>)}
        </group>
      </group>
      <pointLight position={[0, y + h / 2 + 0.4, 1.0]} intensity={4} distance={4} decay={2} color="#ffe2b0" />
    </group>
  );
}
