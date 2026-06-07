# Task 4 (bonus) — Prompt A/B

One task, two prompts: a bare one vs. a structured one. Task chosen: **add a
"Reset" button to the counter** (a realistic small change on top of Task 2).

## Prompt A — basic

> Add a reset button to the counter.

## Prompt B — structured (role + context + constraints + acceptance + format)

> **Role:** You are a senior React/Next.js engineer working in this repo.
> **Context:** `app/` is Next.js 16 (App Router) + TypeScript + Tailwind v4.
> The counter is a client component at `app/src/app/components/Counter.tsx`
> using `useState`, bounded to 0–100. Conventions and guardrails are in
> `app/AGENTS.md` (no new dependencies; Tailwind utilities only; `PascalCase`
> components).
> **Task:** Add a **Reset** button that sets the value back to 0.
> **Constraints:** reuse existing state; no new deps; keep it accessible
> (`aria-label`); match the existing button styling; `npm run lint` and
> `npm run build` must stay green.
> **Acceptance criteria:**
> 1. A "Reset" control sits between − and +.
> 2. Clicking it sets the value to 0 from any state.
> 3. It has an `aria-label="Reset"`.
> 4. Lint and build pass.
> **Output format:** the edited `Counter.tsx` plus a one-line summary of the
> change.

## Result — observed difference

| Dimension | Prompt A (basic) | Prompt B (structured) |
|---|---|---|
| Quality | Works, but the agent had to **guess** the file, styling, and bounds; risk of a new `<a>`/inline style or a second state var | Lands in the right file with matching Tailwind classes, `aria-label`, and clamp reused |
| Iterations | ~2–3 (locate file → restyle → fix lint) | ~1 (constraints front-loaded) |
| Tokens | Higher — extra turns each re-send context | Lower overall despite a longer first prompt; fewer context passes |
| Verifiability | Vague — "done?" is subjective | Explicit acceptance criteria → easy to check |

## Conclusion

The structured prompt costs a few extra tokens up front but removes the
exploration/rework loop: it pins the file, constraints, and a checkable
definition of done, so the agent converges in roughly one iteration instead of
two or three. Net effect — **higher quality, fewer iterations, and usually fewer
total tokens** — which matches the Task 3 finding that turn count (context
passes), not prompt length, drives cost.
