"use client";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { M, holo } from "./materials";

/* Rajan's avatar: the portrait photo sculpted into a 3D relief (depth map → displaced mesh),
   standing on a classical drum pedestal. It turns gently to face the visitor. */

const W = 1.5;
const H = W / (560 / 768);
const DEPTH = 0.42;

function useAvatarGeometry() {
  const [geo, setGeo] = useState<THREE.BufferGeometry | null>(null);
  useEffect(() => {
    const img = new Image();
    img.src = "/avatar/avatar-depth.png";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const g = c.getContext("2d")!;
      g.drawImage(img, 0, 0);
      const data = g.getImageData(0, 0, c.width, c.height).data;
      const sx = 110, sy = Math.round(110 * (H / W));
      const pg = new THREE.PlaneGeometry(W, H, sx, sy);
      const pos = pg.attributes.position as THREE.BufferAttribute;
      const uv = pg.attributes.uv as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const u = uv.getX(i), v = uv.getY(i);
        const px = Math.min(c.width - 1, Math.round(u * (c.width - 1)));
        const py = Math.min(c.height - 1, Math.round((1 - v) * (c.height - 1)));
        const d = data[(py * c.width + px) * 4] / 255;
        pos.setZ(i, d * DEPTH);
      }
      pg.computeVertexNormals();
      setGeo(pg);
    };
  }, []);
  return geo;
}

function Drum() {
  const geo = useMemo(() => {
    const pts = [[0, 0], [0.82, 0], [0.82, 0.12], [0.74, 0.16], [0.74, 0.2], [0.66, 0.26], [0.62, 0.32], [0.62, 0.86], [0.68, 0.9], [0.72, 0.96], [0.78, 1.0], [0.78, 1.06], [0, 1.06]]
      .map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(pts, 48);
  }, []);
  return (
    <group>
      <mesh position={[0, 0.06, 0]} material={M.marbleDark}><cylinderGeometry args={[1.05, 1.1, 0.12, 48]} /></mesh>
      <mesh position={[0, 0.12, 0]} geometry={geo} material={M.marble} />
      <mesh position={[0, 0.42, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.gold}><torusGeometry args={[0.625, 0.025, 8, 64]} /></mesh>
      <mesh position={[0, 0.94, 0]} rotation={[Math.PI / 2, 0, 0]} material={M.gold}><torusGeometry args={[0.625, 0.025, 8, 64]} /></mesh>
      {/* laurel-ish gold garland */}
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i / 18) * Math.PI * 2;
        return <mesh key={i} position={[Math.cos(a) * 0.64, 0.68, Math.sin(a) * 0.64]} rotation={[0, -a, 0.6]} scale={[1, 0.45, 0.25]} material={M.gold}><sphereGeometry args={[0.06, 10, 8]} /></mesh>;
      })}
      {/* nameplate */}
      <mesh position={[0, 0.68, 0.63]} material={M.gold}><boxGeometry args={[0.7, 0.16, 0.02]} /></mesh>
    </group>
  );
}

export default function Avatar({ accent }: { accent: string }) {
  const geo = useAvatarGeometry();
  const map = useMemo(() => {
    const t = new THREE.TextureLoader().load("/avatar/avatar-color.png");
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({
    map, emissiveMap: map, emissive: new THREE.Color("#ffffff"), emissiveIntensity: 0.55,
    roughness: 0.65, metalness: 0, alphaTest: 0.5, side: THREE.DoubleSide,
  }), [map]);
  const { camera } = useThree();
  const body = useRef<THREE.Group>(null);
  const halo = useRef<THREE.Group>(null);
  const world = useMemo(() => new THREE.Vector3(), []);

  useFrame((s, dt) => {
    if (body.current) {
      body.current.getWorldPosition(world);
      const want = Math.max(-1.1, Math.min(1.1, Math.atan2(camera.position.x - world.x, camera.position.z - world.z)));
      body.current.rotation.y += (want - body.current.rotation.y) * Math.min(1, dt * 3);
      body.current.scale.y = 1 + Math.sin(s.clock.elapsedTime * 1.6) * 0.004;
    }
    if (halo.current) halo.current.rotation.y += dt * 0.5;
  });

  return (
    <group>
      <Drum />
      <group ref={body} position={[0, 1.2, 0]}>
        {geo && <mesh geometry={geo} material={mat} position={[0, H / 2 - 0.2, -0.12]} />}
      </group>
      {/* holographic halo rings — the "virtual" layer */}
      <group ref={halo} position={[0, 1.22, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={holo(accent, 0.55)}><ringGeometry args={[0.86, 0.885, 64, 1, 0, Math.PI * 1.5]} /></mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} material={holo("#ffd27a", 0.35)}><ringGeometry args={[0.95, 0.96, 64, 1, Math.PI, Math.PI * 1.2]} /></mesh>
      </group>
    </group>
  );
}
