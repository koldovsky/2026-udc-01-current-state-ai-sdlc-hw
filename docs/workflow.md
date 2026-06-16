# Workflow — Task 2 (Notes feature, Plan → Agent)

> Tool: Claude Code (Opus 4.7, 1M context). Stack: Next.js 16 + React 19 +
> TypeScript strict + Tailwind v4 (per `app/AGENTS.md`). Skill loaded:
> `vercel-react-best-practices` (`.agents/skills/vercel-react-best-practices/`).

## Acceptance criteria (frozen before any code)

1. **Add** — labeled input + Add button at `/notes`. Submitting trims
   whitespace; empty input shows an inline error and adds nothing. Enter
   submits; focus returns to the input after a successful add.
2. **Delete** — each note has an `×` button with
   `aria-label="Delete note: <text>"`. Clicking removes only that note.
3. **Persist** — notes survive a full page reload via `localStorage`
   (key `udc-notes-v1`). No SSR/hydration warning in the console.
4. **Empty state** — when there are no notes, the list area shows a muted
   "No notes yet." instead of an empty `<ul>`.
5. **Reachable + lint-clean** — visible link from `/` to `/notes`;
   `npm run lint` passes; `npm run build` succeeds.

## Plan mode

Conducted via Claude Code's built-in plan mode. The full plan was written
to `~/.claude/plans/shiny-toasting-crystal.md` and approved before any code
was touched. Highlights of what plan mode actually produced:

- **Pre-reads.** Before drafting, the agent read `docs/walkthrough.md`
  (Task 2 requirements), `.coderabbit.yaml` (grading), `app/AGENTS.md`
  (stack/conventions/guardrails), `app/app/layout.tsx` (so the new page
  matches `min-h-full flex flex-col` body), and `app/app/page.tsx` (palette).
- **Feature choice via AskUserQuestion** — three concrete options offered
  (notes list / signup form / counter); notes list selected.
- **Frozen acceptance criteria** above — written before any
  implementation tokens were spent.
- **File-level design.** New `app/app/notes/page.tsx` (server component) +
  new `app/app/notes/NoteList.tsx` (client component) + a one-line edit to
  `app/app/page.tsx` to add a `<Link href="/notes">`.
- **Storage/state design.** `localStorage` key `udc-notes-v1`,
  `crypto.randomUUID()` for IDs, `MAX_LEN = 200`, no extra dependencies
  (per guardrail #3 in `app/AGENTS.md`: no state-management libs).
- **Verification steps** enumerated up front: `npm run lint`, `npm run
  build`, then a scripted browser walk through all 5 criteria.

## Agent mode

After `ExitPlanMode`, executed the approved plan:

1. `app/app/notes/page.tsx` (24 lines) — server component, `Notes` title
   metadata, header with "← Home" link, mounts `<NoteList />` inside the
   matching zinc-50/black layout.
2. `app/app/notes/NoteList.tsx` — `"use client"`. Final shape uses
   `useSyncExternalStore` (see adjustments below); writes through a tiny
   in-module store that updates `localStorage` and notifies subscribers.
3. `app/app/page.tsx` — added `import Link from "next/link"` and a third
   pill-shaped CTA `<Link href="/notes">Notes</Link>` next to the existing
   `Deploy Now` / `Documentation` buttons.
4. Verified via Playwright MCP against the live dev server:
   - Add `buy bread` → list updates, input cleared, focus retained.
   - Add `finish hw` → most-recent on top.
   - Submit whitespace `"   "` → inline `Note can't be empty.` alert,
     input gets `aria-invalid`, no note appended.
   - Reload `/notes` → both notes still present.
   - Click `Delete note: buy bread` → row removed; reload → still gone.
   - Delete the last note → "No notes yet." shown.
   - `/` → "Notes" CTA visible and routes to `/notes`.
   - Console: 0 errors, 0 warnings on `/notes` (the one warning on `/` is
     a pre-existing `Image` aspect-ratio nag from the create-next-app
     starter, unrelated to this feature).
   - `npm run lint` clean; `npm run build` produces 3 static routes
     (`/`, `/_not-found`, `/notes`).

## What we adjusted after reviewing the plan

These are real refinements, recorded as they happened — not invented for
the writeup.

1. **Hydration pattern: `useEffect` + `useState` → `useSyncExternalStore`.**
   The plan called for two effects: one to hydrate from `localStorage` on
   mount, one to persist on every change (with a "skip first run" guard
   for the hydration race). The first lint pass flagged the hydrate
   effect with `react-hooks/set-state-in-effect`:
   _"Calling setState synchronously within an effect can trigger cascading
   renders"_ (linked to https://react.dev/learn/you-might-not-need-an-effect).
   Refactored to a tiny in-module store + `useSyncExternalStore` with
   `getSnapshot` / `getServerSnapshot` / `subscribe`. This is the React 19
   "external store" pattern the rule is steering toward, naturally avoids
   the SSR/CSR divergence, and removed the need for the "skip first run"
   guard entirely.
2. **No `useNotes` custom hook.** Considered extracting one during plan
   review and rejected it as a premature abstraction (one caller). Kept
   the store as plain module-level functions — fits the "don't introduce
   abstractions beyond what the task requires" guidance.
3. **`crypto.randomUUID()` over `Math.random()`** for note IDs — chosen
   in the plan, not later. Mentioned because it was an explicit decision,
   not an oversight: built-in, collision-resistant, no dependency.
4. **Validation: trim then validate; clear error on next keystroke.**
   Refined during plan review from the simpler "if empty then error" —
   the trim catches whitespace-only input (criterion 1's actual edge),
   and clearing on next change avoids a stale error sitting under a now-
   valid input.

## Result

All 5 acceptance criteria pass:

| # | Criterion | Status |
|---|-----------|--------|
| 1 | Add: trim, validate, refocus | ✅ |
| 2 | Delete with aria-label | ✅ |
| 3 | Persist across reload, no hydration warning | ✅ |
| 4 | Empty state copy | ✅ |
| 5 | Home → /notes link, lint + build clean | ✅ |

Nothing was deferred or skipped. Out of scope (per the chosen scope, not
unfinished work): edit-in-place for notes, server persistence/API routes.
