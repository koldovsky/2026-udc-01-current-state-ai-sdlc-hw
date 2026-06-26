# Task 2 — Workflow: Money Spending Tracker

## Feature

A client-side spending tracker: log expenses by category, view a list of recent spendings, and add custom categories when presets are not enough. Data persists in browser `localStorage`.

## Acceptance criteria

1. User can pick a category from a preset list and enter a positive amount, then submit to log a spending.
2. User can add a custom category when the preset list does not fit (inline flow, no separate page).
3. Logged spendings appear in a list below the form (category + amount; newest first).
4. Spendings and custom categories survive page refresh via `localStorage`.
5. Form validates empty/invalid category and non-positive amount with visible feedback.
6. App starts cleanly: `npm run dev`, `npm run lint`, `npm run build` pass from `app/`.

## Plan mode

- Requested a plan before writing code (Task 2 requirement).
- Reviewed architecture: single client component orchestrator, child form/list components, `lib/` for types and storage.
- Confirmed two decisions during planning:
  - **Persistence:** `localStorage` (not in-memory only).
  - **Docs language:** English for this write-up.
- Out of scope agreed: edit/delete entries, server API, charts/totals.

## Agent mode

Implemented per plan:

| File | Role |
|------|------|
| `app/lib/types.ts` | `SpendingEntry` type |
| `app/lib/categories.ts` | Default category presets |
| `app/lib/storage.ts` | Versioned localStorage load/save |
| `app/components/SpendingForm.tsx` | Category select, add-new flow, amount input, validation |
| `app/components/SpendingList.tsx` | Sorted list with formatted amount and date |
| `app/components/SpendingTracker.tsx` | State + persistence orchestration |
| `app/app/page.tsx` | Replaced starter template with tracker |
| `app/app/layout.tsx` | Updated page metadata |

## Review after implementation

- Ran `npm run lint` and `npm run build` from `app/`.
- Manual browser checks:
  - Log spendings across preset categories → list updates immediately.
  - Add custom category (e.g. "Subscriptions") → appears in select and can be used.
  - Refresh page → categories and entries still present.
  - Submit with invalid amount or missing category → inline errors, no bad entry added.

## Plan adjustments during build

- Simplified `handleAddCategory` deduplication logic in `SpendingTracker` (removed unused merge step).
- No other scope changes from the approved plan.
