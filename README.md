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
| Walk | Scroll · W / S | Hold the gold ▲ / ▼ pad, or swipe up / down |
| Look around | Move the mouse | Turn / tilt the phone (Tilt toggle, ◎ re-centres) · or swipe sideways |
| Inspect an exhibit | Click it or its banner · Enter while aiming | Tap |
| Next / previous exhibit | → / ← (or D / A) | Pamphlet buttons |
| Floor guide | G or M | ☰ |
| Close | Esc | ✕ |

## Edit content
- All text lives in `lib/data.ts` (profile, services, tech, projects, experience, trophies).
- `lib/museum.ts` turns that data into galleries and exhibit positions — add an item to data.ts and it appears in the right gallery automatically.
- Replace `public/Rajan-Maharjan-CV.pdf` to update the CV download.
- Entrance portrait: replace `public/avatar/portrait.jpg` (3:4 ratio, e.g. 720×960).
- Gallery light colours: `LIGHT` in `lib/museum.ts`.

## Files
| File | What |
|---|---|
| `components/museum/Loader.tsx` | Opening screen: crest + progress, then gilded doors swing open once the scene is ready |
| `components/museum/MobileControls.tsx` | Phone controls: gyroscope look (asks permission on iPhone), hold-to-walk pad, swipe-to-look |
| `components/museum/Museum.tsx` | Page shell: entrance ticket, HUD, minimap, floor guide, keyboard, scroll length |
| `components/museum/Scene.tsx` | Canvas, lighting, first-person walking camera |
| `components/museum/Architecture.tsx` | Palace shell: inlaid marble floor, runner carpet, damask walls, gilt panels, columns, cornice, frescoed vault, sconces, arches |
| `components/museum/Chandeliers.tsx` | Crystal chandeliers (jhoomers) + the pool of lights that follows the visitor, tinted per gallery |
| `components/museum/Portrait.tsx` | Rajan's framed portrait on an easel at the entrance (`public/avatar/portrait.jpg`) |
| `components/museum/Exhibit.tsx` | Pedestals, vitrines, wall portraits, guestbook desk, floating banners |
| `components/museum/Artifacts.tsx` | The procedural "antiques" (gold, marble, holograms) |
| `components/museum/Pamphlet.tsx` | Side panel with exhibit details |
| `components/museum/Catalogue.tsx` | Plain-text catalogue: quick read for recruiters, accessibility & SEO |

Easter egg: ↑ ↑ ↓ ↓ ← → ← → B A.
