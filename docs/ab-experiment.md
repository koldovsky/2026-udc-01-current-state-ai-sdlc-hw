# A/B prompts experiment — sort toggle

## TL;DR

Same feature (sort toggle on the notes list), two prompts. The basic
prompt ("add a sort toggle…") hit **6 / 7** acceptance criteria for
**$0.83** — the one miss was `aria-pressed`, invisible to sighted
smoke testing. The structured prompt (role + context + constraints +
7 explicit criteria) hit **7 / 7** for **$1.24** — +$0.41, ≈50% more,
one extra criterion. Both runs were single-iteration and lint-clean.
The premium isn't the prompt format itself; it's the *judgment baked
into the criteria*. Reach for structure when the failure modes are
subtle (accessibility, edge cases, invariants) and skip it when the
task is small enough to eyeball.

## Context

Workshop 1, Task 4 (bonus). The exercise asks for a side-by-side
comparison of a **basic** prompt ("do X") versus a **structured**
prompt (role + context + constraints + acceptance criteria + output
format) on the same task, measured by quality, iterations, and tokens.
Subject feature: a sort toggle on the notes list at
`app/app/notes/NoteList.tsx` that switches between newest-first and
oldest-first. The feature is small enough for the time budget,
isolated to one file, and has clear UX edges (default order, ARIA
state, persistence vs ephemeral, empty state) where a casual prompt
is plausibly weaker than a structured one.

Run order was **basic first, structured second**, with a `git
checkout` of `NoteList.tsx` in between. That ordering prevents the
structured run from cribbing ideas off the basic-run diff sitting on
disk. The basic prompt was sent to Opus 4.7 directly in the main
thread (no Plan, no Agent). The structured prompt was dispatched via
Plan → Agent to Sonnet 4.6, mirroring the pattern used in
`cost-analysis.md` variants C/D.

## The two prompts

### Basic prompt (verbatim)

> Add a sort toggle to the notes list so I can switch between newest
> first and oldest first.

### Structured prompt (verbatim)

> **Role:** You are a senior React/Next.js engineer working in this
> Next.js 16 + React 19 + TS + Tailwind v4 notes app.
>
> **Context:** The notes list lives in `app/app/notes/NoteList.tsx`.
> Notes are stored in localStorage as a `Note[]` with `{ id, text,
> createdAt }`. New notes are prepended in `onSubmit` so the natural
> order is newest-first. The list also has a header row above the
> `<ul>` (count span on the left, Clear-all button on the right) —
> that row is the natural place to put the sort toggle.
>
> **Constraints:**
> 1. One-file edit (`NoteList.tsx`) only. No new deps.
> 2. Reuse the existing Tailwind class set used by the Clear-all
>    button for visual consistency.
> 3. No localStorage persistence — the sort preference is ephemeral
>    per page load (default newest-first).
> 4. Do not mutate the stored `notes` array — derive a sorted copy
>    for render.
> 5. `npm run lint` must remain clean.
>
> **Acceptance criteria:**
> - [ ] A toggle (`<button>` with `aria-pressed`) lives in the header
>       row alongside the count + Clear-all button.
> - [ ] Default state: newest first (`createdAt` desc),
>       `aria-pressed=false`.
> - [ ] When pressed: oldest first (`createdAt` asc),
>       `aria-pressed=true`.
> - [ ] Adding a note while sorted oldest-first keeps the new note
>       visible (it goes to the bottom of the list, not hidden).
> - [ ] Deleting a note preserves current sort order.
> - [ ] Toggle is keyboard-operable and gets the same focus styles
>       as the existing buttons.
> - [ ] Empty state is untouched — toggle does not render when
>       `notes.length === 0`.
>
> **Output format:** Apply the edit directly to the target file.
> After the edit, report in one paragraph: what changed, where, and a
> note on any acceptance criterion you couldn't satisfy.

## Comparison

The seven acceptance criteria from the structured prompt were used as
a hidden rubric to score both outputs. Token figures come from
`/usage` deltas split by model. The basic run was Opus-only; the
structured run was Plan → Agent (Sonnet worker) under an Opus parent
thread, so its cost has two rows.

| Axis | Basic prompt | Structured prompt |
|---|---|---|
| Iterations to "good enough" | 1 (no clarifying questions) | 1 (no clarifying questions) |
| Quality (criteria met / 7) | **6 / 7** | **7 / 7** |
| Miss(es) | `aria-pressed` absent — label change is the only state cue | none |
| Code shape | `[...notes].sort()` derived; toggle in header `<div>` reusing Clear-all classes; empty state preserved | `[...notes].sort()` derived; toggle in header `<div>` reusing Clear-all classes; `aria-pressed={oldestFirst}` |
| Tokens — input | +0.1k | +0.1k (Opus parent) + ~8 (Sonnet worker) |
| Tokens — output | +7.9k (Opus) | +7.7k (Opus parent) + +1.9k (Sonnet worker) |
| Tokens — cache read | +1.1m (Opus) | +1.5m (Opus parent) + +113.5k (Sonnet worker) |
| Cost (Opus parent) | **$0.83** | **$1.07** |
| Cost (Sonnet worker) | – | **$0.17** |
| **Cost (total)** | **$0.83** | **$1.24** |
| Lint after run | clean | clean |
| Browser smoke (add 2, toggle, add while oldest-first) | passed; order flipped | passed; order flipped; new note correctly fell to the bottom |

A note on the cost split. The structured run's parent-thread Opus
spend ($1.07) is higher than the basic run's Opus spend ($0.83) even
though the parent doesn't write the code in the structured case — it
authored the structured prompt earlier (in the plan file), drove the
Agent dispatch, and ran an extra smoke test (a third "add while
oldest-first" case the basic run didn't bother with). The Sonnet
worker itself was very cheap ($0.17) for the actual implementation.
So the **+$0.41 delta** for structure breaks down roughly as: a fuller
verification pass on top of one cheap Sonnet code-gen.

## Conclusion

On this feature the basic prompt landed surprisingly close — 6 of 7
acceptance criteria, lint-clean, smoke-passing — and cost a third
less. The one miss was `aria-pressed`, which matters for screen
readers but is invisible to sighted-keyboard testing; a casual review
would not have caught it. The structured prompt earned its 7/7 by
encoding accessibility, mutation-safety, and the empty-state edge
as explicit checks the model couldn't drift past — but every one of
those checks is *a thing I had to know to ask for*. That is the real
lesson: structured prompting is not a free upgrade applied to a basic
intent; it is a way to harden the prompt with judgment the author
already has. On a feature this small the cost premium ($0.41) is
trivial and the quality bump is real but narrow. On a feature where
the model's failure modes are subtler or where downstream cost-of-bug
is higher — auth flows, data migrations, anything user-visible at
scale — the same structure pays for itself many times over because
the rubric *prevents misses you wouldn't notice in smoke testing*.
The honest takeaway is to reach for structured prompts whenever the
acceptance criteria are non-obvious to the model, and not to bother
when the task is genuinely simple and easy to eyeball.
