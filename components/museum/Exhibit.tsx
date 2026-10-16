"use client";
import { Float, Html } from "@react-three/drei";
import { useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { AVATAR_Z, exhibits, halls, viewingZ, walkTo, type Exhibit as Ex } from "@/lib/museum";
import { museum, useMuseum } from "@/lib/store";
import Artifact from "./Artifacts";
import Avatar from "./Avatar";
import { HALF_W } from "./Architecture";
import { M, holo } from "./materials";

export function openExhibit(id: string) {
  museum.set({ selected: id, guide: false });
  const e = exhibits.find((x) => x.id === id);
  if (e) walkTo(viewingZ(e));
}

function Spotlight({ color, on }: { color: string; on: boolean }) {
  const mat = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#ffe6b8", transparent: true, opacity: 0.06, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }),
    []
  );
  useFrame((_, d) => { mat.opacity += ((on ? 0.13 : 0.055) - mat.opacity) * Math.min(1, d * 4); });
  return (
    <group>
      <mesh position={[0, 4.6, 0]} material={mat}><cylinderGeometry args={[0.18, 1.15, 6.6, 24, 1, true]} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} material={holo(on ? color : "#ffe6b8", on ? 0.35 : 0.12)}>
        <circleGeometry args={[1.15, 40]} />
      </mesh>
    </group>
  );
}

/* Classical baluster pedestal: dark plinth, turned marble body, gilt cap, velvet cushion */
const pedestalBody = new THREE.LatheGeometry(
  [[0, 0], [0.38, 0], [0.38, 0.06], [0.32, 0.1], [0.27, 0.18], [0.24, 0.3], [0.25, 0.55], [0.3, 0.68], [0.36, 0.74], [0.36, 0.8], [0, 0.8]]
    .map(([x, y]) => new THREE.Vector2(x, y)), 40);
function Pedestal({ color, rarity, cushion = true }: { color: string; rarity?: string; cushion?: boolean }) {
  const ring = useRef<THREE.Mesh>(null);
  useFrame((_, d) => { if (ring.current) ring.current.rotation.z += d * 0.6; });
  return (
    <group>
      <mesh position={[0, 0.09, 0]} material={M.marbleDark}><boxGeometry args={[1.0, 0.18, 1.0]} /></mesh>
      <mesh position={[0, 0.2, 0]} material={M.gold}><boxGeometry args={[0.86, 0.04, 0.86]} /></mesh>
      <mesh position={[0, 0.22, 0]} geometry={pedestalBody} material={M.marble} />
      <mesh position={[0, 1.05, 0]} material={rarity === "LEGENDARY" ? M.gold : M.marbleDark}><boxGeometry args={[0.92, 0.07, 0.92]} /></mesh>
      <mesh position={[0, 1.0, 0]} material={M.gold}><boxGeometry args={[0.95, 0.03, 0.95]} /></mesh>
      {cushion && <mesh position={[0, 1.12, 0]} material={M.velvet}><boxGeometry args={[0.66, 0.07, 0.66]} /></mesh>}
      <mesh ref={ring} position={[0, 1.17, 0]} rotation={[-Math.PI / 2, 0, 0]} material={holo(color, 0.5)}>
        <ringGeometry args={[0.4, 0.42, 48, 1, 0, Math.PI * 1.6]} />
      </mesh>
    </group>
  );
}

/* Glass bell jar (cloche) over precious artifacts */
function BellJar() {
  return (
    <group position={[0, 1.15, 0]}>
      <mesh position={[0, 0.52, 0]} material={M.glass}><cylinderGeometry args={[0.52, 0.52, 1.04, 40, 1, true]} /></mesh>
      <mesh position={[0, 1.04, 0]} material={M.glass}><sphereGeometry args={[0.52, 40, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
      <mesh position={[0, 1.6, 0]} material={M.gold}><sphereGeometry args={[0.05, 16, 12]} /></mesh>
      <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.gold}><torusGeometry args={[0.53, 0.022, 8, 48]} /></mesh>
    </group>
  );
}

/* Brass stanchions with a sagging velvet rope in front of each exhibit */
const ropeGeo = new THREE.TubeGeometry(
  new THREE.CatmullRomCurve3([new THREE.Vector3(-0.75, 0.86, 0.95), new THREE.Vector3(-0.35, 0.66, 1.0), new THREE.Vector3(0, 0.62, 1.02), new THREE.Vector3(0.35, 0.66, 1.0), new THREE.Vector3(0.75, 0.86, 0.95)]),
  32, 0.022, 8, false);
function Stanchions() {
  return (
    <group>
      {[-0.75, 0.75].map((x) => (
        <group key={x} position={[x, 0, 0.95]}>
          <mesh position={[0, 0.02, 0]} material={M.brass}><cylinderGeometry args={[0.12, 0.14, 0.04, 20]} /></mesh>
          <mesh position={[0, 0.45, 0]} material={M.brass}><cylinderGeometry args={[0.022, 0.03, 0.86, 12]} /></mesh>
          <mesh position={[0, 0.9, 0]} material={M.gold}><sphereGeometry args={[0.05, 14, 10]} /></mesh>
        </group>
      ))}
      <mesh geometry={ropeGeo} material={M.velvet} />
    </group>
  );
}

/* Ornate gilt frame with corner rosettes, crest and a brass picture light */
function OrnateFrame({ glow }: { glow: string }) {
  const W = 2.3, H = 2.75, b = 0.24;
  return (
    <group position={[0, 3.1, 0]}>
      {/* outer moulding */}
      {[[0, H / 2 + b / 2, W + 2 * b, b], [0, -H / 2 - b / 2, W + 2 * b, b]].map(([x, y, w, h], i) => (
        <mesh key={`h${i}`} position={[x, y, 0.1]} material={M.gold}><boxGeometry args={[w, h, 0.16]} /></mesh>
      ))}
      {[[-W / 2 - b / 2, 0], [W / 2 + b / 2, 0]].map(([x, y], i) => (
        <mesh key={`v${i}`} position={[x, y, 0.1]} material={M.gold}><boxGeometry args={[b, H, 0.16]} /></mesh>
      ))}
      {/* inner lip */}
      {[[0, H / 2 - 0.03, W, 0.06], [0, -H / 2 + 0.03, W, 0.06]].map(([x, y, w, h], i) => (
        <mesh key={`ih${i}`} position={[x, y, 0.14]} material={M.goldMatte}><boxGeometry args={[w, h, 0.06]} /></mesh>
      ))}
      {[[-W / 2 + 0.03, 0], [W / 2 - 0.03, 0]].map(([x, y], i) => (
        <mesh key={`iv${i}`} position={[x, y, 0.14]} material={M.goldMatte}><boxGeometry args={[0.06, H, 0.06]} /></mesh>
      ))}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([sx, sy]) => (
        <mesh key={`${sx}${sy}`} position={[sx * (W / 2 + b / 2), sy * (H / 2 + b / 2), 0.2]} material={M.gold}><sphereGeometry args={[0.11, 16, 12]} /></mesh>
      ))}
      {/* crest */}
      <mesh position={[0, H / 2 + b + 0.12, 0.12]} scale={[1.6, 1, 0.5]} material={M.gold}><sphereGeometry args={[0.16, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
      {/* painted canvas */}
      <mesh position={[0, 0, 0.08]} material={M.canvasDark}><planeGeometry args={[W, H]} /></mesh>
      <mesh position={[0, 0, 0.085]} material={holo(glow, 0.1)}><planeGeometry args={[W, H]} /></mesh>
      {/* picture light */}
      <group position={[0, H / 2 + b + 0.42, 0.42]}>
        <mesh rotation={[0, 0, Math.PI / 2]} material={M.brass}><cylinderGeometry args={[0.06, 0.06, 1.3, 16]} /></mesh>
        <mesh position={[0, -0.05, 0.02]} material={M.flame}><boxGeometry args={[1.2, 0.015, 0.05]} /></mesh>
        {[-0.45, 0.45].map((x) => <mesh key={x} position={[x, -0.15, -0.2]} rotation={[0.9, 0, 0]} material={M.brass}><cylinderGeometry args={[0.015, 0.015, 0.5, 8]} /></mesh>)}
      </group>
      <mesh position={[0, 0.3, 0.09]} material={holo("#ffd59a", 0.12)}><planeGeometry args={[W, H * 0.8]} /></mesh>
    </group>
  );
}

function Vitrine({ color, count }: { color: string; count: number }) {
  const g = useRef<THREE.Group>(null);
  useFrame((s) => {
    g.current?.children.forEach((c, i) => { c.position.y = 0.15 + ((i % 3) * 0.28) + Math.sin(s.clock.elapsedTime * 1.2 + i) * 0.04; });
  });
  const orb = useMemo(() => new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9, metalness: 0.3, roughness: 0.3 }), [color]);
  return (
    <group position={[0, 1.12, 0]}>
      <mesh position={[0, 0.62, 0]} material={M.glass}><boxGeometry args={[0.95, 1.2, 0.95]} /></mesh>
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([x, z]) => (
        <mesh key={`${x}${z}`} position={[x * 0.47, 0.62, z * 0.47]} material={M.gold}><boxGeometry args={[0.035, 1.22, 0.035]} /></mesh>
      ))}
      <mesh position={[0, 1.24, 0]} material={M.gold}><boxGeometry args={[1.02, 0.05, 1.02]} /></mesh>
      <group ref={g}>
        {Array.from({ length: count }).map((_, i) => {
          const col = i % 3, row = Math.floor(i / 3) % 4;
          return (
            <mesh key={i} position={[(col - 1) * 0.26, 0.15, (row - 1.5) * 0.18]} material={orb}>
              <icosahedronGeometry args={[0.055, 1]} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

function Desk() {
  return (
    <group>
      <mesh position={[0, 0.55, 0]} material={M.wood}><boxGeometry args={[3, 1.1, 1.1]} /></mesh>
      <mesh position={[0, 1.13, 0]} material={M.marbleDark}><boxGeometry args={[3.15, 0.07, 1.25]} /></mesh>
      <mesh position={[0, 0.55, 0.56]} material={M.gold}><boxGeometry args={[2.6, 0.05, 0.02]} /></mesh>
      {/* open guestbook */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.27, 1.2, 0.05]} rotation={[-Math.PI / 2 + 0.05, s * 0.12, 0]} material={M.ivory}><planeGeometry args={[0.52, 0.66]} /></mesh>
      ))}
      <mesh position={[0.5, 1.32, 0.05]} rotation={[0.4, 0, -0.6]} material={M.gold}><cylinderGeometry args={[0.008, 0.012, 0.5, 8]} /></mesh>
      {/* holographic book light */}
      <mesh position={[0, 1.6, 0.05]} material={holo("#5fe8ff", 0.35, true)}><icosahedronGeometry args={[0.22, 1]} /></mesh>
    </group>
  );
}

export default function Exhibit({ e, x, df = 4.2 }: { e: Ex; x: number; df?: number }) {
  const { camera } = useThree();
  const [near, setNear] = useState(false);
  const banner = useRef<HTMLDivElement>(null);
  const selected = useMuseum((s) => s.selected === e.id);
  const hovered = useMuseum((s) => s.hovered === e.id);
  const numeral = halls.find((h) => h.id === e.hall)?.numeral ?? "";

  useFrame(() => {
    const d = camera.position.z - e.z; // >0 when exhibit is ahead
    // other banners wait until the visitor has stepped past the avatar
    const n = d > 0.3 && d < 34 && (e.art === "avatar" || camera.position.z < AVATAR_Z + 0.3);
    if (n !== near) setNear(n);
    if (banner.current) {
      const o = Math.max(0, Math.min(1, (32 - d) / 10, (d - 0.3) / 1.5));
      banner.current.style.opacity = String(o);
      banner.current.style.pointerEvents = o > 0.3 ? "auto" : "none";
    }
  });

  const over = (ev: ThreeEvent<PointerEvent>) => { ev.stopPropagation(); museum.set({ hovered: e.id }); document.body.style.cursor = "pointer"; };
  const out = () => { if (museum.get().hovered === e.id) museum.set({ hovered: null }); document.body.style.cursor = ""; };
  const click = (ev?: { stopPropagation?: () => void }) => { ev?.stopPropagation?.(); openExhibit(e.id); };

  const label = (
    <div ref={banner} className={`banner ${selected ? "on" : ""} ${hovered ? "hover" : ""}`} style={{ ["--accent" as string]: e.accent }}
      onClick={click} onPointerEnter={() => museum.set({ hovered: e.id })} onPointerLeave={() => museum.set({ hovered: null })}>
      <span className="banner-no">No. {String(e.no).padStart(2, "0")} · Gallery {numeral}</span>
      <b>{e.title}</b>
      <small>{e.subtitle}</small>
      <span className="banner-cta">{selected ? "Viewing" : "Inspect"} ▸</span>
    </div>
  );

  /* Portraits hung on the wall (experience) */
  if (e.wall) {
    const wx = e.side * (HALF_W - 0.05);
    return (
      <group position={[wx, 0, e.z]} rotation={[0, -e.side * Math.PI / 2, 0]}>
        <group onPointerOver={over} onPointerOut={out} onClick={click}>
          <OrnateFrame glow={selected || hovered ? e.accent : "#ffd59a"} />
        </group>
        {near && (
          <Html transform position={[0, 3.1, 0.2]} distanceFactor={df} zIndexRange={[20, 0]}>
            <div ref={banner} className={`portrait ${selected ? "on" : ""}`} style={{ ["--accent" as string]: e.accent }} onClick={click}>
              <span className="banner-no">No. {String(e.no).padStart(2, "0")} · {e.payload.kind === "job" && e.payload.q.status === "ACTIVE" ? "Current" : "Archive"}</span>
              <b>{e.title}</b>
              <i>{e.payload.kind === "job" ? e.payload.q.title : ""}</i>
              <small>{e.subtitle}</small>
              <span className="banner-cta">Read the story ▸</span>
            </div>
          </Html>
        )}
      </group>
    );
  }

  const isDesk = e.art === "desk";
  const isAvatar = e.art === "avatar";
  const jar = e.payload.kind === "project";
  const rot = e.side === 0 ? 0 : -e.side * 0.55;

  if (isAvatar) {
    return (
      <group position={[0, 0, e.z]}>
        <Spotlight color={e.accent} on />
        <group onPointerOver={over} onPointerOut={out} onClick={click}>
          <Avatar accent={e.accent} />
          <mesh position={[0, 2.0, 0]} visible={false}><boxGeometry args={[1.8, 3.6, 1.2]} /></mesh>
        </group>
        {near && (
          <Html transform position={[0, 3.75, 0]} distanceFactor={df} zIndexRange={[20, 0]}>
            {label}
          </Html>
        )}
      </group>
    );
  }
  return (
    <group position={[e.side * x, 0, e.z]} rotation={[0, rot, 0]}>
      <Spotlight color={e.accent} on={selected || hovered} />
      <group onPointerOver={over} onPointerOut={out} onClick={click}>
        {isDesk ? <Desk /> : <Pedestal color={e.accent} rarity={e.payload.kind === "project" ? e.payload.p.rarity : undefined} cushion={e.art !== "vitrine"} />}
        {jar && <BellJar />}
        {e.art === "vitrine" && e.payload.kind === "tech" && <Vitrine color={e.accent} count={e.payload.g.items.length} />}
        {!isDesk && e.art !== "vitrine" && (
          <Float speed={1.6} rotationIntensity={0.15} floatIntensity={0.35} floatingRange={[-0.05, 0.05]}>
            <group position={[0, 1.78, 0]}><Artifact kind={e.art} color={e.accent} /></group>
          </Float>
        )}
        {/* invisible hit box makes small artifacts easy to click/tap */}
        <mesh position={[0, 1.3, 0]} visible={false}><boxGeometry args={[1.4, 2.6, 1.4]} /></mesh>
      </group>
      {!isDesk && <Stanchions />}
      {near && (
        <Html transform position={[0, isDesk ? 2.75 : 3.2, 0]} distanceFactor={df} zIndexRange={[20, 0]}>
          {label}
        </Html>
      )}
    </group>
  );
}
