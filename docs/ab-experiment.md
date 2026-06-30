# Task 4 (bonus) — Prompt A/B experiment

Same task, two prompts — a **basic** one ("do X") and a **structured** one
(role + context + constraints + acceptance criteria + format). Both were run for
real, in parallel, by two separate agents on identical isolated copies of the
app, then compared.

**Task (identical for both):** add a password-strength indicator to the sign-up
form.

## Prompt A — basic

```
Add a password strength indicator to the sign-up form.
```

## Prompt B — structured

```
Role: You are a senior React/Next.js engineer.

Context: Stack is Next.js 16 (App Router), React 19, TypeScript 5 (strict),
Tailwind CSS v4, Vitest. Relevant existing files:
- app/components/SignupForm.tsx — a "use client" sign-up form (email + password).
- app/lib/validation.ts — pure validation functions.
- app/lib/validation.test.ts — existing Vitest suite (13 tests, passing).
Conventions (from AGENTS.md): pure logic with no React goes in app/lib/;
components are PascalCase; "use client" only where interactivity is needed;
Tailwind utilities in className (no inline styles, no CSS-in-JS); strict TS, no any.

Goal: add a password-strength indicator to the sign-up form.

Constraints:
- Implement the strength calculation as a PURE function in app/lib/ (no React),
  and add Vitest unit tests for it.
- Integrate into SignupForm.tsx without breaking existing validation or the 13 tests.
- Do NOT add any new npm dependency.
- Keep TypeScript strict — no any.

Acceptance criteria:
1. Pure function maps a password to a strength level (weak / medium / strong, or
   a 0–3 score) based on length and character-class variety.
2. The form shows a colored bar + text label that updates LIVE as the user types.
3. Accessible (role="status" / aria-live="polite" so changes are announced).
4. Existing 13 tests still pass; new tests cover the strength thresholds.

Output format: list files created/modified and the exact verify commands.
```

## Results (measured)

| Metric | A — basic | B — structured |
|---|---|---|
| Subagent tokens used | **31,791** | **32,968** |
| Tool calls | 17 | **14** |
| Edit→run cycles | ~1 | 1 |
| Pure tested function | yes (`passwordStrength.ts`) | yes (`getPasswordStrength` + helper) |
| New unit tests | 7 (20 total) | **10 (23 total)** |
| Lint / type-check | clean | clean |
| Strength scale | **invented** 0–4 (Very weak…Strong) | 0–3 weak/medium/strong (as the criteria implied) |
| Accessibility | `aria-live` on the indicator | `role="status"` + `aria-live`, bar `aria-hidden`, label as accessible name (exactly to spec) |
| Free-form assumptions | 4 (scale, thresholds, when to show, that it's presentational) | bounded by the given constraints; choices traceable to the spec |

## What differed

- **Quality / fit-to-intent.** Both produced clean, tested, convention-following
  code — the modern model + the project's `AGENTS.md` raise the floor even for a
  one-line prompt. The difference was **predictability**: A *invented* the scale,
  thresholds, and behaviour (a reasonable but arbitrary 0–4 ladder); B matched the
  acceptance criteria (0–3 weak/medium/strong), did accessibility exactly as
  specified, and wrote more tests (10 vs 7). With A you get *a* good result; with
  B you get *the* result you asked for.
- **Iterations / exploration.** Neither needed rework (~1 edit→run cycle each).
  But A spent **17 tool calls** vs B's **14** — A had to read around to infer the
  conventions B was simply handed. Less guessing, less exploration.
- **Tokens.** Nearly identical totals (31,791 vs 32,968). The structured prompt's
  larger input (~one sentence vs ~330 words) was offset by less exploration, so
  the better-specified result cost about the same.

## Conclusion

For a capable model on a small, well-scoped task, the **basic prompt still
produces working, conventional code** — the gap is smaller than it used to be.
But the **structured prompt removes ambiguity**: the first output already matches
the intended scale, behaviour, and accessibility, with fewer free-form
assumptions and slightly fewer tool calls — at roughly the same token cost. The
payoff of structure is **alignment and fewer follow-up iterations**, not just raw
quality. The bigger and fuzzier the task, the larger that payoff.

> Note: both implementations were built in throwaway copies of the app purely to
> run the experiment; the project's `app/` was not modified by this task. The
> copies themselves are not committed, so the raw agent reports and measured
> usage are reproduced below as the source of the metrics table.

## Appendix — raw agent reports (source of the metrics)

The two runs were executed as separate agents in parallel; each returned a
structured self-report. The measured usage (tokens / tool calls / duration) comes
from the run harness.

### Run A — basic prompt

- **Measured usage:** 31,791 tokens · 17 tool calls · ~176 s.
- Files: created `app/lib/passwordStrength.ts`, `app/lib/passwordStrength.test.ts`;
  modified `app/components/SignupForm.tsx`.
- Pure tested function: yes (`passwordStrength()` in `app/lib/passwordStrength.ts`).
- Tests: 20 pass (7 new + 13 existing); type-check clean; lint clean.
- Assumptions (because the task was underspecified): invented a 0–4 scale
  (Very weak…Strong), reused `PASSWORD_MIN_LENGTH` and chose 12 as the "strong"
  length, showed the indicator only for non-empty input, made it purely
  presentational (does not gate submission).
- Edit→run cycles: ~1.

### Run B — structured prompt

- **Measured usage:** 32,968 tokens · 14 tool calls · ~216 s.
- Files: created `app/lib/passwordStrength.ts`, `app/lib/passwordStrength.test.ts`;
  modified `app/components/SignupForm.tsx`.
- Pure tested function: yes (`getPasswordStrength()` + `countCharacterClasses()`).
- Tests: 23 pass (10 new + 13 existing); type-check clean (strict, no `any`);
  lint clean.
- Assumptions (bounded by the given constraints): 0–3 ladder Too weak/Weak/
  Medium/Strong; thresholds derived from `PASSWORD_MIN_LENGTH` and character-class
  count; 3-segment bar `aria-hidden`, label as the accessible name, `role="status"`
  / `aria-live="polite"` container always mounted.
- Edit→run cycles: 1.
