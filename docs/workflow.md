# Task 2 Workflow: Qlik Function Cheat Sheet

## Feature

A client-side cheat sheet page listing predefined Qlik functions with real-time search filtering.

## Acceptance Criteria

1. On load, all predefined functions are displayed — each card shows name, category, description, and example expression.
2. A search input filters the list in real-time (case-insensitive) across name, category, and description.
3. When no functions match the search, an empty-state message is shown.
4. Clearing the search restores the full list.
5. The layout is responsive (single column on mobile, two columns on desktop).

## Plan Mode

Asked the agent to produce acceptance criteria and an implementation plan before writing any code.

The plan identified four files:
- `app/lib/qlik-functions.ts` — static data with a shared `QlikFunction` type
- `app/components/FunctionCard.tsx` — presentational card component
- `app/components/SearchInput.tsx` — controlled input component
- `app/app/page.tsx` — page holding search state and filtered rendering

Reviewed the plan and confirmed the file split and data shape before proceeding.

## Agent Mode

Executed the agreed plan in one pass:
- Created the three new files as specified.
- Replaced the default `page.tsx` with the cheat sheet page using `"use client"` and `useState` for the search query.
- Filtering is a plain `.filter()` over the static array — no `useMemo`, kept deliberately simple.
- Tailwind only, no new dependencies.

## Adjustments After Plan Review

- Added a function count subtitle (`"12 functions"`) to the page header — small UX touch not in the original plan.
- Chose not to extract filtering logic into a separate hook; the component is simple enough that inline logic is clearer.

## Verification

- `npm run dev` — opened localhost:3000, confirmed all 12 cards render on load.
- Searched `"agg"` → only Aggregation functions shown.
- Searched `"date"` → Date & Time functions shown.
- Searched `"xyz"` → empty-state message displayed.
- Cleared input → full list restored.
- `npm run build` — completed successfully, no type errors or lint warnings.
