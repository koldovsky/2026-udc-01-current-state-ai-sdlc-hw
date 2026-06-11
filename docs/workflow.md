# Task 2 Workflow — Graphing Calculator

Workshop 1, Task 2 of `docs/walkthrough.md`. Built a small 2D graphing
calculator on top of the Next.js scaffold from Task 1, driving the
agent through Plan mode → Agent mode.

## Acceptance criteria

Defined **before** any code was written:

1. Page replaces the default Next.js landing with a calculator UI
   (one expression input + plot canvas) on an **acid-yellow background**
   (`#d0ff00`).
2. Clicking "Plot" / pressing Enter renders the function on the canvas
   with X/Y axes, a unit grid, and tick labels at integer steps.
3. Up to **2–3 simultaneous expressions**, each with a distinct color,
   addable/removable from the UI.
4. Zoom in / Zoom out / Reset buttons change the visible domain and
   re-render without re-typing the expression.
5. An invalid expression (e.g. `sin(`) shows an inline error on that
   row and does **not** crash the canvas — other rows keep plotting.

## Plan mode

What the agent did before touching any source file:

- Ran a single `Explore` subagent over `app/` to confirm the scaffold
  shape: bare `create-next-app` (only `src/app/{page,layout,globals}` —
  no `components/`, `hooks/`, or `lib/` yet; `@/*` alias already
  configured in `tsconfig.json`).
- Drafted a plan file at `~/.claude/plans/elegant-giggling-seal.md`
  with: context, the 5 ACs, file layout, dependency choice (`mathjs`,
  no charting lib — per `app/AGENTS.md` guardrail), styling notes,
  explicit out-of-scope list, and a verification checklist.
- Presented the plan via `ExitPlanMode` for review.

### What got adjusted after plan review

The user reviewed the first plan and asked for one change:

> "mostly fine, I need to alter something so also make background
> acid yellow color"

Changes folded into the plan **before** any code:

- Added an explicit "Styling" section: page background `#d0ff00`
  (acid yellow) via Tailwind `bg-[#d0ff00]`; canvas itself stays
  near-white (`#fffef5`) so plotted lines remain readable against
  a yellow frame; text dark `neutral-900`; buttons get a black
  border with `shadow-[4px_4px_0_0_#1a1a1a]` for contrast.
- Updated AC1 to mention the acid-yellow background.
- Swapped the default seeded curves to colors that read well on
  yellow: deep blue (`#1d3fa8`) and deep magenta (`#b3157a`).
- Verification checklist gained one item: "background is acid
  yellow `#d0ff00`".

The second `ExitPlanMode` was approved without further changes.

## Agent mode

Implementation in approval order:

| Step | Result |
| ---- | ------ |
| `npm install mathjs` | mathjs 15.2.0 added — only runtime dep |
| `app/src/lib/expression.ts` | `compileExpression(src)` → tagged union `{ok:true, fn}` / `{ok:false, error}`; wraps `math.compile` and probes `x=0` to surface undefined-symbol errors early |
| `app/src/lib/viewport.ts` | Pure transforms `worldToScreen{X,Y}` / `screenToWorld{X,Y}` and a `tickStep(scale)` that picks 1/2/5×10ⁿ grid spacing |
| `app/src/components/Graph.tsx` | `"use client"` canvas; `devicePixelRatio`-aware; draws minor grid + major grid + axes + tick labels + each compiled function (sample one Y per pixel column, break the path on NaN/∞ or large jumps so `tan(x)`/`1/x` don't render vertical lines through asymptotes) |
| `app/src/components/Calculator.tsx` | `"use client"` state owner — expression rows (cap 3), color palette, zoom/reset buttons, inline per-row error text. `useMemo` recompiles on source change so invalid rows are flagged immediately while valid rows keep plotting |
| `app/src/app/page.tsx` | Replaced boilerplate with acid-yellow shell + `<Calculator />` (Server Component shell, client child) |

What went smoothly: the `tsconfig.json` `@/*` alias was already
configured by `create-next-app`, so imports were clean from the start.
`mathjs` ESM types worked out of the box with Next.js 16's bundler —
no `transpilePackages` shim needed.

Things that needed a second pass:

- First draft of `Graph.tsx` only skipped `NaN`/`Infinity`, which still
  let `tan(x)` draw a near-vertical line across the canvas at each
  asymptote. Added a `|sy - prevY| > height` jump-break before the
  `lineTo` so the path lifts cleanly across discontinuities.
- Initial styling put the canvas background on the acid yellow too —
  unreadable. Plan was updated to frame the canvas in white inside the
  yellow shell; matched in the component.

### Verification

- `npm run lint` — clean (no warnings on new files).
- `npx tsc --noEmit` — clean.
- `npm run dev` → `Ready in 164ms`. `GET /` → **HTTP 200**, server-rendered
  HTML contains `graphing calculator`, `bg-[#d0ff00]`, the `<canvas>`
  element, and the `Calculator` component tree.

**Caveat:** the actual plot pixels (lines on the canvas, grid labels)
render only on the client, so they were not verified from the CLI.
A real visual smoke-test against the ACs (default curves visible,
zoom buttons re-render, typing `sin(` flags that row in red while the
other row keeps plotting) still needs a human eyeball on
`http://localhost:3000`.

## Files touched

- `app/package.json`, `app/package-lock.json` — added `mathjs`
- `app/src/lib/expression.ts` *(new)*
- `app/src/lib/viewport.ts` *(new)*
- `app/src/components/Graph.tsx` *(new)*
- `app/src/components/Calculator.tsx` *(new)*
- `app/src/app/page.tsx` *(rewritten)*

## Token usage

Tracked via Claude Code's `/cost` command. The walkthrough's Task 3
asks for the numbers + 2–3 optimization ideas in
`docs/cost-analysis.md`; this workflow file just records the process.
