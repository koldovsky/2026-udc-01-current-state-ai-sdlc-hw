# Robot Catalog App — Workflow Log

## Acceptance Criteria

1. `/robots` renders a grid of robots with name, image, difficulty badge, and build time.
2. Typing in the search bar filters the grid; the query is reflected in the URL (`?q=`).
3. Clicking a robot navigates to `/robots/[id]` with the full image, description, and numbered assembly instructions.
4. A "View Parts List" link on the detail page navigates to `/robots/[id]/parts`.
5. The parts page shows a table with part name, quantity, colour-coded material, and print time.
6. Back-navigation links are present on the detail and parts pages.
7. Visiting an unknown robot ID returns a 404 via Next.js `notFound()`.
8. `next build` completes with zero errors and zero TypeScript complaints.

---

## User Actions

| # | Action |
|---|--------|
| 1 | Requested a 3-page robot catalog app in plan mode: robot list with search, robot detail with info, per-robot parts list. |
| 2 | Answered clarifying questions: data source = MakerWorld profile (`https://makerworld.com/en/@Spike_Doc/upload`), parts scope = per-robot, images = placeholder URLs. |
| 3 | Approved the plan. |
| 4 | Reported runtime 500 after dev server started: `next/image` blocked `placehold.co` because the hostname was not in `next.config.ts`. |
| 5 | Reported follow-up error: `placehold.co` returns SVG and `dangerouslyAllowSVG` was disabled. |

---

## User Corrections of the Plan

### 1. `next.config.ts` image hostname not in plan

The plan made no mention of configuring `images.remotePatterns` in `next.config.ts`. Using an external image host with `next/image` always requires explicit allowlisting, so this was a gap in the plan.

**Fix:** Added `remotePatterns: [{ hostname: "placehold.co" }]` to `next.config.ts` after the error was reported.

### 2. SVG images not anticipated

`placehold.co` serves SVG placeholders. Next.js blocks SVG through its image optimizer by default. The plan did not account for this constraint when choosing the placeholder service.

**Fix:** Added `dangerouslyAllowSVG: true` to `next.config.ts`. A better long-term choice would be a placeholder service that returns raster images (e.g. `picsum.photos`) to avoid needing this flag.
