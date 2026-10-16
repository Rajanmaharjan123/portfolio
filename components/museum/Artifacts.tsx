"use client";
import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { ArtKind } from "@/lib/museum";
import { M, holo } from "./materials";

/* Each artifact is ~1 unit tall, centred at its origin, sitting on a pedestal.
   Classic materials (gold, marble, bronze) + one holographic element for the "virtual" touch. */

function Spin({ children, speed = 0.4 }: { children: React.ReactNode; speed?: number }) {
  const r = useRef<THREE.Group>(null);
  useFrame((_, d) => { if (r.current) r.current.rotation.y += d * speed; });
  return <group ref={r}>{children}</group>;
}

function ScanRing({ color, r = 0.55 }: { color: string; r?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const mat = useMemo(() => holo(color, 0.6).clone(), [color]);
  useFrame((s) => {
    if (!ref.current) return;
    const t = (s.clock.elapsedTime * 0.5) % 1;
    ref.current.position.y = -0.45 + t * 0.95;
    mat.opacity = Math.sin(t * Math.PI) * 0.8;
  });
  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]} material={mat}>
      <torusGeometry args={[r, 0.008, 6, 48]} />
    </mesh>
  );
}

function Trophy() {
  const geo = useMemo(() => {
    const pts = [[0, -0.5], [0.28, -0.5], [0.28, -0.44], [0.1, -0.4], [0.06, -0.15], [0.08, -0.05], [0.3, 0.12], [0.34, 0.45], [0.31, 0.46], [0.26, 0.16], [0.0, 0.0]]
      .map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 32);
  }, []);
  return (
    <group>
      <mesh geometry={geo} material={M.gold} />
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.36, 0.25, 0]} rotation={[0, 0, s * 0.2]} material={M.gold}>
          <torusGeometry args={[0.1, 0.022, 8, 20, Math.PI]} />
        </mesh>
      ))}
    </group>
  );
}

export default function Artifact({ kind, color }: { kind: ArtKind; color: string }) {
  const H = holo(color, 0.7);
  const W = holo(color, 0.45, true);

  switch (kind) {
    case "bust":
      return (
        <group position={[0, -0.05, 0]}>
          <mesh position={[0, -0.32, 0]} scale={[1, 0.55, 0.62]} material={M.marble}><sphereGeometry args={[0.38, 28, 20]} /></mesh>
          <mesh position={[0, -0.05, 0]} material={M.marble}><cylinderGeometry args={[0.1, 0.12, 0.22, 16]} /></mesh>
          <mesh position={[0, 0.22, 0]} scale={[0.86, 1, 0.95]} material={M.marble}><sphereGeometry args={[0.24, 28, 20]} /></mesh>
          <Spin speed={0.6}><mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2.3, 0, 0]} material={H}><torusGeometry args={[0.38, 0.01, 6, 60]} /></mesh></Spin>
          <ScanRing color={color} r={0.42} />
        </group>
      );
    case "obelisk":
      return (
        <group position={[0, 0.15, 0]}>
          <mesh rotation={[0, Math.PI / 4, 0]} material={M.marbleDark}><cylinderGeometry args={[0.13, 0.26, 1.3, 4]} /></mesh>
          <mesh position={[0, 0.75, 0]} rotation={[0, Math.PI / 4, 0]} material={M.gold}><coneGeometry args={[0.13, 0.22, 4]} /></mesh>
          <Spin><mesh position={[0, 0.2, 0]} material={W}><icosahedronGeometry args={[0.55, 1]} /></mesh></Spin>
        </group>
      );
    case "phone":
      return (
        <Spin speed={0.5}>
          <group rotation={[0.1, 0, 0]}>
            <RoundedBox args={[0.5, 0.98, 0.06]} radius={0.06} material={M.gold} />
            <mesh position={[0, 0, 0.032]} material={H}><planeGeometry args={[0.43, 0.9]} /></mesh>
            <mesh position={[0, 0, -0.032]} rotation={[0, Math.PI, 0]} material={M.ink}><planeGeometry args={[0.44, 0.9]} /></mesh>
          </group>
        </Spin>
      );
    case "ar":
    case "cube":
      return (
        <group>
          <Spin speed={0.6}><mesh material={M.gold}>{kind === "ar" ? <octahedronGeometry args={[0.32]} /> : <boxGeometry args={[0.36, 0.36, 0.36]} />}</mesh></Spin>
          <Spin speed={-0.3}><mesh material={W}>{kind === "ar" ? <icosahedronGeometry args={[0.55, 1]} /> : <boxGeometry args={[0.7, 0.7, 0.7]} />}</mesh></Spin>
          <ScanRing color={color} />
        </group>
      );
    case "rescue":
      return (
        <Spin>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh material={M.gold}><torusGeometry args={[0.28, 0.08, 10, 32]} /></mesh>
            {Array.from({ length: 10 }).map((_, i) => {
              const a = (i / 10) * Math.PI * 2;
              return <mesh key={i} position={[Math.cos(a) * 0.4, Math.sin(a) * 0.4, 0]} rotation={[0, 0, a]} material={M.gold}><boxGeometry args={[0.12, 0.1, 0.12]} /></mesh>;
            })}
            <mesh material={H}><circleGeometry args={[0.18, 32]} /></mesh>
          </group>
        </Spin>
      );
    case "sdk":
      return (
        <Spin speed={0.35}>
          <mesh position={[0, -0.3, 0]} material={M.bronze}><boxGeometry args={[0.42, 0.26, 0.42]} /></mesh>
          <mesh position={[0, -0.02, 0]} rotation={[0, 0.5, 0]} material={M.marble}><boxGeometry args={[0.36, 0.26, 0.36]} /></mesh>
          <mesh position={[0, 0.25, 0]} rotation={[0, 1, 0]} material={M.gold}><boxGeometry args={[0.3, 0.26, 0.3]} /></mesh>
          <mesh position={[0, 0.5, 0]} rotation={[0, 1.4, 0]} material={W}><boxGeometry args={[0.26, 0.22, 0.26]} /></mesh>
        </Spin>
      );
    case "cross":
      return (
        <Spin speed={0.4}>
          <RoundedBox args={[0.42, 0.8, 0.05]} radius={0.05} position={[-0.2, 0, 0]} rotation={[0, 0.35, -0.08]} material={M.gold} />
          <RoundedBox args={[0.42, 0.8, 0.05]} radius={0.05} position={[0.2, 0.06, -0.1]} rotation={[0, -0.35, 0.08]} material={M.marble} />
          <mesh position={[0, 0.03, 0.05]} material={H}><torusGeometry args={[0.12, 0.012, 6, 30]} /></mesh>
        </Spin>
      );
    case "chip":
      return (
        <Spin speed={0.35}>
          <group rotation={[0.35, 0, 0]}>
            <mesh material={M.ink}><boxGeometry args={[0.6, 0.08, 0.6]} /></mesh>
            {Array.from({ length: 16 }).map((_, i) => {
              const side = Math.floor(i / 4), k = (i % 4) - 1.5;
              const p: [number, number, number] = side === 0 ? [k * 0.13, 0, 0.36] : side === 1 ? [k * 0.13, 0, -0.36] : side === 2 ? [0.36, 0, k * 0.13] : [-0.36, 0, k * 0.13];
              return <mesh key={i} position={p} material={M.gold}><boxGeometry args={[0.05, 0.03, 0.05]} /></mesh>;
            })}
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} material={H}><planeGeometry args={[0.32, 0.32]} /></mesh>
          </group>
        </Spin>
      );
    case "vitrine":
      return null; // drawn by Exhibit (needs item count)
    case "dice":
      return (
        <group position={[0, -0.25, 0]}>
          <mesh position={[0, -0.18, 0]} material={M.bronze}><cylinderGeometry args={[0.5, 0.45, 0.06, 32]} /></mesh>
          <Spin speed={0.3}>
            {Array.from({ length: 6 }).map((_, i) => {
              const a = (i / 6) * Math.PI * 2;
              return (
                <mesh key={i} position={[Math.cos(a) * 0.28, -0.04 + (i % 2) * 0.16, Math.sin(a) * 0.28]} rotation={[i, i * 0.7, 0]} material={i % 2 ? M.ivory : M.gold}>
                  <boxGeometry args={[0.16, 0.16, 0.16]} />
                </mesh>
              );
            })}
          </Spin>
          <mesh position={[0, 0.5, 0]} material={W}><icosahedronGeometry args={[0.18, 0]} /></mesh>
        </group>
      );
    case "scan":
      return (
        <group>
          <mesh rotation={[-0.5, 0, 0]} material={M.gold}><boxGeometry args={[0.8, 0.04, 0.58]} /></mesh>
          <mesh rotation={[-0.5 - Math.PI / 2, 0, 0]} position={[0, 0.022, 0.012]} material={M.ink}><planeGeometry args={[0.74, 0.52]} /></mesh>
          <Spin speed={0.4}>
            <group position={[0, 0.42, 0]}>
              <mesh material={W}><boxGeometry args={[0.7, 0.3, 0.5, 4, 2, 3]} /></mesh>
            </group>
          </Spin>
          <ScanRing color={color} r={0.45} />
        </group>
      );
    case "car":
      return (
        <Spin speed={0.6}>
          <mesh position={[0, 0.18, 0]} material={M.gold}><sphereGeometry args={[0.24, 24, 16]} /></mesh>
          <mesh position={[0, -0.13, 0]} rotation={[Math.PI, 0, 0]} material={M.gold}><coneGeometry args={[0.2, 0.46, 24]} /></mesh>
          <mesh position={[0, 0.18, 0.2]} material={M.ink}><circleGeometry args={[0.09, 20]} /></mesh>
          <mesh position={[0, -0.42, 0]} rotation={[Math.PI / 2, 0, 0]} material={H}><torusGeometry args={[0.32, 0.01, 6, 40]} /></mesh>
        </Spin>
      );
    case "shield":
      return (
        <Spin speed={0.5}>
          <mesh scale={[1, 1.25, 0.25]} rotation={[Math.PI / 2, 0, 0]} material={M.gold}><cylinderGeometry args={[0.36, 0.36, 0.3, 6]} /></mesh>
          <mesh position={[0, 0, 0.06]} scale={[0.7, 0.85, 1]} material={H}><circleGeometry args={[0.32, 6]} /></mesh>
        </Spin>
      );
    case "chat":
      return (
        <Spin speed={0.5}>
          <RoundedBox args={[0.8, 0.5, 0.16]} radius={0.12} material={M.marble} />
          <mesh position={[-0.2, -0.3, 0]} rotation={[0, 0, 0.6]} material={M.marble}><coneGeometry args={[0.08, 0.2, 3]} /></mesh>
          {[-0.2, 0, 0.2].map((x) => <mesh key={x} position={[x, 0, 0.09]} material={H}><circleGeometry args={[0.045, 16]} /></mesh>)}
        </Spin>
      );
    case "film":
      return (
        <Spin speed={0.5}>
          <group rotation={[0, 0, 0]}>
            <mesh material={M.gold}><torusGeometry args={[0.34, 0.05, 10, 40]} /></mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={M.bronze}><cylinderGeometry args={[0.34, 0.34, 0.05, 40]} /></mesh>
            {Array.from({ length: 5 }).map((_, i) => {
              const a = (i / 5) * Math.PI * 2;
              return <mesh key={i} position={[Math.cos(a) * 0.19, Math.sin(a) * 0.19, 0.03]} material={M.ink}><circleGeometry args={[0.07, 16]} /></mesh>;
            })}
            <mesh position={[0, 0, 0.03]} material={H}><circleGeometry args={[0.05, 16]} /></mesh>
          </group>
        </Spin>
      );
    case "lock":
      return (
        <Spin speed={0.5}>
          <RoundedBox args={[0.5, 0.42, 0.2]} radius={0.04} position={[0, -0.1, 0]} material={M.gold} />
          <mesh position={[0, 0.12, 0]} material={M.bronze}><torusGeometry args={[0.16, 0.04, 10, 24, Math.PI]} /></mesh>
          <mesh position={[0, -0.1, 0.105]} material={H}><circleGeometry args={[0.06, 20]} /></mesh>
        </Spin>
      );
    case "wallet":
      return (
        <group position={[0, -0.2, 0]}>
          {Array.from({ length: 6 }).map((_, i) => (
            <mesh key={i} position={[(i % 2) * 0.015, -0.15 + i * 0.065, 0]} material={M.gold}><cylinderGeometry args={[0.22, 0.22, 0.055, 32]} /></mesh>
          ))}
          <Spin speed={0.8}>
            <mesh position={[0.0, 0.48, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.gold}><cylinderGeometry args={[0.2, 0.2, 0.04, 32]} /></mesh>
            <mesh position={[0, 0.48, 0]} material={W}><torusGeometry args={[0.28, 0.01, 6, 40]} /></mesh>
          </Spin>
        </group>
      );
    case "store":
      return (
        <Spin speed={0.4}>
          <mesh position={[0, -0.15, 0]} material={M.marble}><boxGeometry args={[0.56, 0.42, 0.46]} /></mesh>
          <mesh position={[0, 0.22, 0]} rotation={[0, Math.PI / 4, 0]} material={M.bronze}><coneGeometry args={[0.46, 0.32, 4]} /></mesh>
          <mesh position={[0, -0.2, 0.235]} material={H}><planeGeometry args={[0.16, 0.26]} /></mesh>
          {[-0.18, 0.18].map((x) => <mesh key={x} position={[x, -0.25, 0.235]} material={M.gold}><boxGeometry args={[0.04, 0.32, 0.02]} /></mesh>)}
        </Spin>
      );
    case "plane":
      return (
        <Spin speed={0.5}>
          <group rotation={[0.2, 0, 0.25]}>
            <mesh scale={[1, 0.25, 1.9]} rotation={[0, Math.PI, 0]} material={M.ivory}><coneGeometry args={[0.32, 0.6, 3]} /></mesh>
            <mesh position={[0, -0.03, 0]} rotation={[Math.PI / 2, 0, 0]} material={W}><ringGeometry args={[0.45, 0.47, 40]} /></mesh>
          </group>
        </Spin>
      );
    case "trophy":
      return <Spin speed={0.4}><group position={[0, 0, 0]}><Trophy /></group></Spin>;
    default:
      return null;
  }
}
