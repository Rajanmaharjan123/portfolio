/* ------------------------------------------------------------------
   Museum floor plan. Turns the content in data.ts into halls and
   exhibits placed along one long corridor (camera walks toward -Z).
------------------------------------------------------------------- */
import {
  achievements, impact, inventory, profile, quests, services, techGroups,
  type Item, type Quest, type Service, type TechGroup,
} from "./data";

export type ArtKind =
  | "bust" | "obelisk"
  | "phone" | "ar" | "rescue" | "sdk" | "cross" | "chip"
  | "vitrine"
  | Item["icon"]
  | "frame" | "trophy" | "desk" | "avatar";

export type Payload =
  | { kind: "about" }
  | { kind: "impact" }
  | { kind: "service"; s: Service }
  | { kind: "tech"; g: TechGroup }
  | { kind: "project"; p: Item }
  | { kind: "job"; q: Quest }
  | { kind: "trophy"; t: (typeof achievements)[number] }
  | { kind: "contact" };

export type Exhibit = {
  id: string;
  no: number;
  hall: string;
  title: string;
  subtitle: string;
  side: -1 | 0 | 1;      // left wall, centre, right wall
  z: number;
  art: ArtKind;
  accent: string;        // holo colour
  wall?: boolean;        // hung on the wall instead of a pedestal
  payload: Payload;
};

export type Hall = { id: string; numeral: string; name: string; tagline: string; z: number; end: number; light: string };

const ROW = 4.6;         // distance between exhibit rows
const HALL_GAP = 6;      // walk from the arch to the first row

const holo: Record<string, string> = {
  cyan: "#5fe8ff", magenta: "#ff6ad5", lime: "#c5ff6a", amber: "#ffc76a", violet: "#b393ff", sky: "#7cbcff",
};
const rarityHolo = { LEGENDARY: "#ffd27a", EPIC: "#c79bff", RARE: "#6fe6ff" } as const;

export const halls: Hall[] = [];
export const exhibits: Exhibit[] = [];

/* Each gallery has its own chandelier light colour */
const LIGHT: Record<string, string> = {
  foyer: "#ffd9a0", craft: "#ffc483", arsenal: "#d6e6ff", works: "#ffe4bc", chronicle: "#ffad66", trophies: "#ffc9b0", guestbook: "#ffd9a0",
};

/* The visitor's host: Rajan's 3D avatar greets them in the entrance vestibule */
export const AVATAR_Z = -2.2;
export const PORTRAIT_X = -1.9; // the easel stands to the left so the visitor walks straight past
let no = 1;
exhibits.push({
  id: "about", no: no++, hall: "foyer", title: profile.name, subtitle: profile.role,
  side: -1, z: AVATAR_Z, art: "avatar", accent: holo.cyan, payload: { kind: "about" },
});

let z = -6.5;

function hall(id: string, numeral: string, name: string, tagline: string, items: Omit<Exhibit, "id" | "no" | "hall" | "z" | "side">[], wall = false) {
  const start = z;
  z -= HALL_GAP;
  items.forEach((it, i) => {
    exhibits.push({
      ...it,
      id: `${id}-${i}`,
      no: no++,
      hall: id,
      side: i % 2 === 0 ? -1 : 1,
      z: z - Math.floor(i / 2) * ROW - (i % 2 ? ROW * 0.45 : 0),
      wall: wall || it.wall,
    });
  });
  z -= Math.ceil(items.length / 2) * ROW + 3;
  halls.push({ id, numeral, name, tagline, z: start, end: z, light: LIGHT[id] });
}

hall("foyer", "I", "The Foyer", "Meet the developer", [
  { title: "Record of Impact", subtitle: impact.map((i) => i.value).join(" · "), art: "obelisk", accent: holo.amber, payload: { kind: "impact" } },
]);

hall("craft", "II", "Hall of Craft", "Services you can commission", services.map((s) => ({
  title: s.title, subtitle: s.tags.slice(0, 3).join(" · "), art: s.icon as ArtKind, accent: holo.cyan, payload: { kind: "service", s },
})));

hall("arsenal", "III", "The Arsenal", `${techGroups.reduce((a, g) => a + g.items.length, 0)} technologies on display`, techGroups.map((g) => ({
  title: g.label, subtitle: `${g.items.length} instruments`, art: "vitrine" as ArtKind, accent: holo[g.color], payload: { kind: "tech", g },
})));

hall("works", "IV", "Gallery of Works", `${inventory.length} apps, SDKs & games`, inventory.map((p) => ({
  title: p.name, subtitle: `${p.type} · ${p.category}`, art: p.icon, accent: rarityHolo[p.rarity], payload: { kind: "project", p },
})));

hall("chronicle", "V", "The Chronicle", "Portraits of a career", quests.map((q) => ({
  title: q.company, subtitle: q.period, art: "frame" as ArtKind, accent: q.status === "ACTIVE" ? holo.lime : holo.amber, payload: { kind: "job", q },
})), true);

hall("trophies", "VI", "Trophy Room", "Honours & milestones", achievements.map((t) => ({
  title: t.title, subtitle: t.year, art: "trophy" as ArtKind, accent: holo.amber, payload: { kind: "trophy", t },
})));

/* The guestbook at the end of the corridor */
const contactZ = z - 4;
exhibits.push({
  id: "contact", no: no++, hall: "guestbook", title: "The Guestbook", subtitle: "Sign in — start a project",
  side: 0, z: contactZ, art: "desk", accent: holo.cyan, payload: { kind: "contact" },
});
halls.push({ id: "guestbook", numeral: "VII", name: "The Guestbook", tagline: "Get in touch", z: z, end: contactZ - 6, light: LIGHT.guestbook });

export const START_Z = 4;            // camera starts outside the foyer arch
export const END_Z = contactZ + 5.2; // stops in front of the guestbook
export const LENGTH = START_Z - END_Z;
export const BACK_WALL_Z = contactZ - 7;
export const PX_PER_UNIT = 70;       // scroll distance per metre walked

/* scroll <-> corridor position */
export function zToProgress(zz: number) { return Math.min(1, Math.max(0, (START_Z - zz) / LENGTH)); }
/* set while the page is gliding to an exhibit, so "walked away" checks can ignore it */
export const travel = { z: 0, until: 0 };
export function walkTo(zz: number, smooth = true) {
  travel.z = zz;
  travel.until = Date.now() + 2500;
  const max = document.documentElement.scrollHeight - innerHeight;
  window.scrollTo({ top: zToProgress(zz) * max, behavior: smooth ? "smooth" : "auto" });
}
/* where the visitor stands to look at an exhibit */
export function viewingZ(e: Exhibit) {
  if (e.art === "desk") return END_Z;
  if (e.art === "avatar") return e.z + 4.3;
  return e.z + (e.wall ? 3.2 : 3.4);
}
/* light colour of the gallery containing z */
export function lightAt(zz: number) {
  const h = [...halls].reverse().find((x) => zz <= x.z + 0.5);
  return h?.light ?? LIGHT.foyer;
}
