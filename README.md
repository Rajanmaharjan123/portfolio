# The Maharjan Collection — Rajan Maharjan's portfolio

A first-person walk through a classic museum. Scrolling moves the visitor down a marble corridor; every project, skill group, job and award is an exhibit with a floating holographic banner. Clicking one opens its pamphlet beside it.

Next.js (App Router) + React Three Fiber + drei.

## Run
```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site written to /out
```

## Controls
| Action | Desktop | Phone |
|---|---|---|
| Walk | Scroll · W / S | Swipe up / down |
| Look around | Move the mouse | — |
| Inspect an exhibit | Click it or its banner · Enter while aiming | Tap |
| Next / previous exhibit | → / ← (or D / A) | Pamphlet buttons |
| Floor guide | G or M | ☰ |
| Close | Esc | ✕ |

## Edit content
- All text lives in `lib/data.ts` (profile, services, tech, projects, experience, trophies).
- `lib/museum.ts` turns that data into galleries and exhibit positions — add an item to data.ts and it appears in the right gallery automatically.
- Replace `public/Rajan-Maharjan-CV.pdf` to update the CV download.
- Avatar: `public/avatar/avatar-color.png` (cut-out photo) and `avatar-depth.png` (greyscale height map, white = closest). Swap both to change the avatar.
- Gallery light colours: `LIGHT` in `lib/museum.ts`.

## Files
| File | What |
|---|---|
| `components/museum/Museum.tsx` | Page shell: entrance ticket, HUD, minimap, floor guide, keyboard, scroll length |
| `components/museum/Scene.tsx` | Canvas, lighting, first-person walking camera |
| `components/museum/Architecture.tsx` | Palace shell: inlaid marble floor, runner carpet, damask walls, gilt panels, columns, cornice, frescoed vault, sconces, arches |
| `components/museum/Chandeliers.tsx` | Crystal chandeliers (jhoomers) + the pool of lights that follows the visitor, tinted per gallery |
| `components/museum/Avatar.tsx` | Rajan's 3D avatar — the photo in `public/avatar/` sculpted into a relief that turns to face visitors |
| `components/museum/Exhibit.tsx` | Pedestals, vitrines, wall portraits, guestbook desk, floating banners |
| `components/museum/Artifacts.tsx` | The procedural "antiques" (gold, marble, holograms) |
| `components/museum/Pamphlet.tsx` | Side panel with exhibit details |
| `components/museum/Catalogue.tsx` | Plain-text catalogue: quick read for recruiters, accessibility & SEO |

Easter egg: ↑ ↑ ↓ ↓ ← → ← → B A.
