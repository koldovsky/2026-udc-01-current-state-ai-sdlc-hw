# Task 2 — Feature via modes (Plan → Agent)

## Feature: Counter

A small interactive counter built with React state, exposed at the `/counter`
route and linked from the home page.

## Acceptance criteria

1. The counter shows the current value and starts at `0`.
2. **+** increases the value by 1; **−** decreases it by 1.
3. **Reset** sets the value back to `0`.
4. The value is bounded to the range `0–100`; at the bounds the matching button
   is disabled (no out-of-range values).
5. It is keyboard- and screen-reader-accessible (buttons have `aria-label`, the
   value is an `aria-live` `<output>`), and `npm run lint` / `npm run build`
   pass cleanly.

## Mode 1 — Plan

Asked the agent to produce a plan **before** writing code. Agreed plan:

- Add a **client** component `src/app/components/Counter.tsx` (needs `useState`,
  so `"use client"`).
- Add a route `src/app/counter/page.tsx` (Server Component) that renders
  `Counter` and sets page `metadata`.
- Link to `/counter` from the home page using `next/link`.
- Keep styling in Tailwind utility classes, matching the existing template look.
- No new dependencies (guardrail in `app/AGENTS.md`).

### Plan review — what was adjusted

- **Added explicit bounds (0–100).** The first plan was an unbounded counter;
  during review I added min/max so criterion 4 has real validation and the
  buttons can communicate state by being disabled.
- **Accessibility moved into the criteria**, not left implicit: `aria-label` on
  each button and an `aria-live` `<output>` for the value, so the feature is
  verifiable.
- **Used `next/link`** for the home-page link instead of a plain `<a>`, to stay
  idiomatic for the App Router.

## Mode 2 — Agent

Executed the agreed plan:

- Created [app/src/app/components/Counter.tsx](app/src/app/components/Counter.tsx)
  — `increment` / `decrement` / `reset`, clamped to `0–100`, disabled buttons at
  the bounds.
- Created [app/src/app/counter/page.tsx](app/src/app/counter/page.tsx) — route +
  metadata.
- Updated [app/src/app/page.tsx](app/src/app/page.tsx) — added a "Counter demo"
  link.

## Diff review & verification

- `npm run lint` → no warnings/errors.
- `npm run build` → compiled successfully; `/counter` prerendered as static.
- `npm run dev` → `GET /counter 200`; in the browser the value increments,
  decrements, resets, and the +/− buttons disable at 100 / 0.
