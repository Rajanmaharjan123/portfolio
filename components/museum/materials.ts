import * as THREE from "three";

/* ------------------------------------------------------------------
   Procedural palace textures (drawn on canvas — no image downloads)
------------------------------------------------------------------- */
const isClient = typeof document !== "undefined";

function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
}
function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  return [c, c.getContext("2d")!] as const;
}
function tex(c: HTMLCanvasElement, repeat = true) {
  const t = new THREE.CanvasTexture(c);
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}
function veins(g: CanvasRenderingContext2D, w: number, h: number, n: number, color: string, seed: number, width = 1.4) {
  const r = rng(seed);
  g.strokeStyle = color;
  for (let i = 0; i < n; i++) {
    g.lineWidth = 0.4 + r() * width;
    g.beginPath();
    let x = r() * w, y = r() * h;
    g.moveTo(x, y);
    for (let k = 0; k < 6; k++) {
      const nx = x + (r() - 0.5) * w * 0.35, ny = y + (r() - 0.3) * h * 0.3;
      g.quadraticCurveTo(x + (r() - 0.5) * 80, y + (r() - 0.5) * 80, nx, ny);
      x = nx; y = ny;
    }
    g.stroke();
  }
}

/* Veined white marble (columns, pedestals, mouldings) */
let _marble: THREE.CanvasTexture | null = null;
export function marbleTex() {
  if (_marble) return _marble;
  const [c, g] = canvas(512, 512);
  const grd = g.createLinearGradient(0, 0, 512, 512);
  grd.addColorStop(0, "#f3ede1"); grd.addColorStop(0.5, "#e9e1d1"); grd.addColorStop(1, "#f1eadc");
  g.fillStyle = grd; g.fillRect(0, 0, 512, 512);
  veins(g, 512, 512, 26, "rgba(140,128,112,0.28)", 11, 1.8);
  veins(g, 512, 512, 40, "rgba(170,155,135,0.16)", 23, 0.8);
  veins(g, 512, 512, 8, "rgba(196,164,108,0.25)", 5, 1.2);
  return (_marble = tex(c));
}

/* Inlaid marble floor: cream field, black-and-verde lozenges, brass lines, border band */
let _floor: THREE.CanvasTexture | null = null;
export function floorTex() {
  if (_floor) return _floor;
  const S = 1024;
  const [c, g] = canvas(S, S);
  g.fillStyle = "#ebe3d2"; g.fillRect(0, 0, S, S);
  veins(g, S, S, 40, "rgba(150,138,120,0.22)", 3, 1.6);
  // big square tiles with diamond insets
  const T = S / 2;
  for (let ty = 0; ty < 2; ty++) for (let tx = 0; tx < 2; tx++) {
    const x0 = tx * T, y0 = ty * T, cx = x0 + T / 2, cy = y0 + T / 2;
    // dark lozenge
    g.save();
    g.beginPath();
    g.moveTo(cx, y0 + 40); g.lineTo(x0 + T - 40, cy); g.lineTo(cx, y0 + T - 40); g.lineTo(x0 + 40, cy); g.closePath();
    const dg = g.createLinearGradient(x0, y0, x0 + T, y0 + T);
    dg.addColorStop(0, (tx + ty) % 2 ? "#1d2a24" : "#221d1a"); dg.addColorStop(1, (tx + ty) % 2 ? "#14201b" : "#171310");
    g.fillStyle = dg; g.fill();
    g.clip();
    veins(g, S, S, 30, "rgba(220,210,190,0.10)", 40 + tx + ty * 2, 1.2);
    g.restore();
    // brass outline + inner rosette
    g.strokeStyle = "rgba(196,158,84,0.85)"; g.lineWidth = 3;
    g.beginPath(); g.moveTo(cx, y0 + 40); g.lineTo(x0 + T - 40, cy); g.lineTo(cx, y0 + T - 40); g.lineTo(x0 + 40, cy); g.closePath(); g.stroke();
    g.fillStyle = "#e9dfc9";
    g.beginPath(); g.arc(cx, cy, 34, 0, Math.PI * 2); g.fill();
    g.strokeStyle = "rgba(196,158,84,0.9)"; g.lineWidth = 2;
    g.beginPath(); g.arc(cx, cy, 34, 0, Math.PI * 2); g.stroke();
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      g.beginPath(); g.ellipse(cx + Math.cos(a) * 18, cy + Math.sin(a) * 18, 12, 5, a, 0, Math.PI * 2);
      g.fillStyle = k % 2 ? "#7a2a2a" : "#2a3b33"; g.fill();
    }
    // grout lines
    g.strokeStyle = "rgba(80,70,58,0.35)"; g.lineWidth = 2; g.strokeRect(x0 + 1, y0 + 1, T - 2, T - 2);
  }
  return (_floor = tex(c));
}

/* Crimson silk damask with gold motif */
let _damask: THREE.CanvasTexture | null = null;
export function damaskTex() {
  if (_damask) return _damask;
  const [c, g] = canvas(256, 384);
  const bg = g.createLinearGradient(0, 0, 256, 0);
  bg.addColorStop(0, "#4a171b"); bg.addColorStop(0.5, "#5a1d22"); bg.addColorStop(1, "#4a171b");
  g.fillStyle = bg; g.fillRect(0, 0, 256, 384);
  // silk sheen stripes
  for (let x = 0; x < 256; x += 4) { g.fillStyle = `rgba(255,220,200,${x % 8 ? 0.012 : 0.028})`; g.fillRect(x, 0, 2, 384); }
  const motif = (cx: number, cy: number, s: number) => {
    g.save(); g.translate(cx, cy); g.scale(s, s);
    g.fillStyle = "rgba(212,170,96,0.30)"; g.strokeStyle = "rgba(232,196,120,0.45)"; g.lineWidth = 1.4;
    // central palmette
    g.beginPath(); g.moveTo(0, -70);
    g.bezierCurveTo(28, -50, 30, -10, 0, 10); g.bezierCurveTo(-30, -10, -28, -50, 0, -70); g.fill(); g.stroke();
    // side scrolls
    for (const sx of [-1, 1]) {
      g.beginPath(); g.moveTo(0, 10);
      g.bezierCurveTo(sx * 40, 10, sx * 55, -30, sx * 38, -48);
      g.bezierCurveTo(sx * 28, -58, sx * 18, -42, sx * 28, -36); g.stroke();
      g.beginPath(); g.moveTo(0, 10);
      g.bezierCurveTo(sx * 30, 30, sx * 50, 50, sx * 30, 70);
      g.bezierCurveTo(sx * 20, 80, sx * 10, 66, sx * 18, 60); g.stroke();
      g.beginPath(); g.ellipse(sx * 26, 30, 9, 16, sx * 0.5, 0, Math.PI * 2); g.fill();
    }
    g.beginPath(); g.moveTo(0, 10); g.lineTo(0, 80); g.stroke();
    g.beginPath(); g.arc(0, -20, 6, 0, Math.PI * 2); g.fillStyle = "rgba(240,206,130,0.45)"; g.fill();
    g.restore();
  };
  motif(128, 120, 1);
  motif(0, 312, 0.8); motif(256, 312, 0.8);
  return (_damask = tex(c));
}

/* Palace runner carpet: crimson field, gold border with lozenges, medallions */
let _carpet: THREE.CanvasTexture | null = null;
export function carpetTex() {
  if (_carpet) return _carpet;
  const [c, g] = canvas(256, 512);
  g.fillStyle = "#7a141b"; g.fillRect(0, 0, 256, 512);
  for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${Math.random() > 0.5 ? "255,200,180" : "40,0,0"},0.05)`; g.fillRect(Math.random() * 256, Math.random() * 512, 1, 2); }
  const gold = "#c9a14f";
  // borders
  for (const x of [0, 226]) {
    g.fillStyle = "#3a0b0f"; g.fillRect(x, 0, 30, 512);
    g.fillStyle = gold; g.fillRect(x + 3, 0, 2, 512); g.fillRect(x + 25, 0, 2, 512);
    for (let y = 0; y < 512; y += 32) {
      g.beginPath(); g.moveTo(x + 15, y + 4); g.lineTo(x + 23, y + 16); g.lineTo(x + 15, y + 28); g.lineTo(x + 7, y + 16); g.closePath();
      g.fillStyle = y % 64 ? gold : "#e3c27a"; g.fill();
    }
  }
  g.fillStyle = gold; g.fillRect(34, 0, 2, 512); g.fillRect(220, 0, 2, 512);
  // central medallion
  const cx = 128, cy = 256;
  g.strokeStyle = "rgba(214,174,92,0.75)"; g.lineWidth = 3;
  g.beginPath(); g.ellipse(cx, cy, 60, 110, 0, 0, Math.PI * 2); g.stroke();
  g.fillStyle = "rgba(58,11,15,0.9)"; g.beginPath(); g.ellipse(cx, cy, 52, 100, 0, 0, Math.PI * 2); g.fill();
  g.strokeStyle = "rgba(214,174,92,0.6)"; g.lineWidth = 1.5;
  for (let k = 0; k < 12; k++) {
    const a = (k / 12) * Math.PI * 2;
    g.beginPath(); g.ellipse(cx + Math.cos(a) * 26, cy + Math.sin(a) * 50, 10, 22, a, 0, Math.PI * 2); g.stroke();
  }
  g.fillStyle = "#d4ae5f"; g.beginPath(); g.arc(cx, cy, 10, 0, Math.PI * 2); g.fill();
  // corner sprigs
  for (const y of [40, 472]) for (const sx of [70, 186]) {
    g.beginPath(); g.arc(sx, y, 6, 0, Math.PI * 2); g.fillStyle = "rgba(214,174,92,0.6)"; g.fill();
  }
  return (_carpet = tex(c));
}

/* Painted fresco sky for the vaulted ceiling, framed by gilded coffers */
let _fresco: THREE.CanvasTexture | null = null;
export function frescoTex() {
  if (_fresco) return _fresco;
  const [c, g] = canvas(512, 512);
  const sky = g.createLinearGradient(0, 0, 0, 512);
  sky.addColorStop(0, "#c9b48d"); sky.addColorStop(0.5, "#8fa6b4"); sky.addColorStop(1, "#c9b48d");
  g.fillStyle = sky; g.fillRect(0, 0, 512, 512);
  const r = rng(77);
  for (let i = 0; i < 70; i++) {
    const x = r() * 512, y = 120 + r() * 272, rad = 20 + r() * 60;
    const cg = g.createRadialGradient(x, y, 0, x, y, rad);
    cg.addColorStop(0, "rgba(255,246,228,0.55)"); cg.addColorStop(1, "rgba(255,246,228,0)");
    g.fillStyle = cg; g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
  }
  // coffer frame (gold) around the painted panel
  g.lineWidth = 22; g.strokeStyle = "#5b4022"; g.strokeRect(11, 11, 490, 490);
  g.lineWidth = 6; g.strokeStyle = "#d2aa5a"; g.strokeRect(26, 26, 460, 460);
  g.lineWidth = 2; g.strokeStyle = "#f0d590"; g.strokeRect(34, 34, 444, 444);
  for (const [x, y] of [[26, 26], [486, 26], [26, 486], [486, 486]]) {
    g.fillStyle = "#e0bb6a"; g.beginPath(); g.arc(x, y, 14, 0, Math.PI * 2); g.fill();
  }
  return (_fresco = tex(c));
}

/* Soft round glow for candle flames and crystal sparkle (additive sprites) */
let _glow: THREE.CanvasTexture | null = null;
export function glowTex() {
  if (_glow) return _glow;
  const [c, g] = canvas(128, 128);
  const rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  rg.addColorStop(0, "rgba(255,240,210,1)"); rg.addColorStop(0.18, "rgba(255,210,140,0.65)"); rg.addColorStop(0.5, "rgba(255,170,90,0.15)"); rg.addColorStop(1, "rgba(255,160,80,0)");
  g.fillStyle = rg; g.fillRect(0, 0, 128, 128);
  return (_glow = tex(c, false));
}

/* ------------------------------------------------------------------
   Shared materials
------------------------------------------------------------------- */
const marbleMap = isClient ? marbleTex() : null;

export const M = {
  gold: new THREE.MeshStandardMaterial({ color: "#d8b46a", metalness: 1, roughness: 0.24 }),
  goldMatte: new THREE.MeshStandardMaterial({ color: "#b8924a", metalness: 0.95, roughness: 0.42 }),
  brass: new THREE.MeshStandardMaterial({ color: "#a8823f", metalness: 1, roughness: 0.32 }),
  bronze: new THREE.MeshStandardMaterial({ color: "#8a5a32", metalness: 0.9, roughness: 0.38 }),
  marble: new THREE.MeshStandardMaterial({ color: "#ffffff", map: marbleMap, roughness: 0.28, metalness: 0.02 }),
  marbleDark: new THREE.MeshStandardMaterial({ color: "#2a2522", roughness: 0.22, metalness: 0.1 }),
  verde: new THREE.MeshStandardMaterial({ color: "#1f3b33", roughness: 0.25 }),
  ivory: new THREE.MeshStandardMaterial({ color: "#f6efdf", roughness: 0.45 }),
  wood: new THREE.MeshStandardMaterial({ color: "#3b2416", roughness: 0.5 }),
  walnut: new THREE.MeshStandardMaterial({ color: "#2e1a10", roughness: 0.35 }),
  velvet: new THREE.MeshStandardMaterial({ color: "#7a1820", roughness: 0.95 }),
  ink: new THREE.MeshStandardMaterial({ color: "#14100d", roughness: 0.6 }),
  canvasDark: new THREE.MeshStandardMaterial({ color: "#1d1712", roughness: 0.75 }),
  glass: new THREE.MeshPhysicalMaterial({ color: "#eaf4ff", metalness: 0, roughness: 0.04, transparent: true, opacity: 0.16, clearcoat: 1, depthWrite: false, side: THREE.DoubleSide }),
  crystal: new THREE.MeshPhysicalMaterial({ color: "#fff8ec", metalness: 0.1, roughness: 0.02, emissive: "#ffe8c0", emissiveIntensity: 0.55, clearcoat: 1, transparent: true, opacity: 0.9 }),
  flame: new THREE.MeshBasicMaterial({ color: "#ffe2a8", toneMapped: false }),
  candle: new THREE.MeshStandardMaterial({ color: "#f8f1e2", roughness: 0.6, emissive: "#ffdca0", emissiveIntensity: 0.15 }),
};

const holoCache = new Map<string, THREE.MeshBasicMaterial>();
export function holo(color: string, opacity = 0.75, wireframe = false) {
  const k = `${color}-${opacity}-${wireframe}`;
  let m = holoCache.get(k);
  if (!m) {
    m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity, wireframe, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false });
    holoCache.set(k, m);
  }
  return m;
}
