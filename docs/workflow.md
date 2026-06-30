# Task 2 — Feature via modes (Plan → Agent)

Feature: a **sign-up form with client-side validation** (email + password),
built by driving the agent through **Plan** mode first, then **Agent** mode.

## Acceptance criteria (written before any code)

1. The form has an **email** field, a **password** field, and a submit button.
2. An invalid email shows an inline error and **blocks** submission.
3. A password shorter than 8 characters shows an inline error and **blocks**
   submission.
4. Errors **clear as the user fixes** the input; a valid submit shows a success
   message.
5. The validation logic is a **pure function** covered by a **unit test**.

## Plan mode

- Entered the IDE's Plan mode; the agent explored the repo read-only (existing
  `app/` scaffold, `docs/walkthrough.md`, repo `AGENTS.md`) instead of writing code.
- The agent proposed a step-by-step plan and asked clarifying questions before
  committing to an approach:
  - which feature to build → **form with validation**;
  - how to exclude context → **both** `.cursorignore` and `.claude/settings.json`;
  - whether to do the bonus Task 4 → **yes**.
- Reviewed the plan, requested edits, and approved it. Only then did coding start.

## What I adjusted after reviewing the plan

- **Documentation/code language → English.** The baseline allows UA/EN; I made it
  English everywhere (this doc, `app/AGENTS.md`, code comments, UI strings) for a
  single consistent language. Initial drafts were redone in English.
- **Added Vitest + a `test` script.** Needed to make criterion #5 (unit-tested
  pure function) real and to back the `npm run test` command listed in
  `app/AGENTS.md`.
- **Errors as derived state, not effects.** Per the installed
  `vercel-react-best-practices` skill (`rerender-derived-state-no-effect`), errors
  are computed during render from current values, so they clear automatically as
  the user types — no `useEffect` syncing.

## Agent mode (implementation against the agreed plan)

- `app/app/lib/validation.ts` — pure `validateEmail`, `validatePassword`,
  `validateForm`, `isFormValid`. Email regex hoisted to module scope
  (`js-hoist-regexp`).
- `app/app/lib/validation.test.ts` — 13 Vitest cases (valid/invalid email,
  whitespace trim, empty + too-short password, whole-form valid/invalid).
- `app/app/components/SignupForm.tsx` — `"use client"` component: controlled
  inputs, derived errors shown only after a submit attempt, success message,
  accessibility (`<label htmlFor>`, `aria-invalid`, `aria-describedby`, `role`).
  Conditional rendering uses ternaries, not `&&` (`rendering-conditional-render`).
- `app/app/page.tsx` — renders `<SignupForm />` on the home page.

## Diff review & verification

- Reviewed the diff: pure logic isolated in `lib/`, no `any`, server/client split
  correct (only the form is a client component).
- `npm run lint` → clean.
- `npm run test` → **13/13 passed**.
- `npm run build` → compiles, TypeScript passes, `/` prerendered as static.
- `npm run dev` → home page returns **HTTP 200** with the form markup
  (title, email/password fields, submit button) present.

### Manual browser checks (maps to acceptance criteria)

| # | Step | Expected |
|---|---|---|
| 1 | Open `/` | Email + password fields and a submit button are visible |
| 2 | Submit `bad-email` / short password | Inline errors under both fields; no success |
| 3 | Fix email to `you@example.com`, keep short password | Email error disappears; password error stays |
| 4 | Type an 8+ char password, submit | Errors gone; "Account for … has been created." shown |
