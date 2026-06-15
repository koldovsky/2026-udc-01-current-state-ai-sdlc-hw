# Notes Feature — Development Workflow

## Feature Acceptance Criteria

The notes feature must allow a user to:

1. **Add** a note with a title (text only, no body)
2. **Delete** a note permanently
3. **Mark as completed** — note title renders with a strikethrough; toggling reverses it
4. **Mark as important** — note floats to the top of the list; toggling reverses it
5. Notes persist across page refreshes via `localStorage`
6. The list sorts important notes first, then newest first within each group
7. Adding a note with an empty or whitespace-only title is prevented (button disabled)
8. The feature lives at `/notes` and is linked from the home page

---

## Plan Mode

Plan mode was used to complete the full brainstorming and design phase before any code was written. The process:

**Exploration**
An Explore subagent surveyed the codebase: a greenfield Next.js 16.2.9 app with no existing components, data layer, or state management — just the default home page.

**Clarifying questions (one at a time)**
Three key decisions were made through structured Q&A:
- **Storage:** localStorage — no backend needed, persists across refreshes
- **Note structure:** title only — sufficient for the scope, avoids an edit UI
- **Route:** `/notes` — dedicated page, clean separation from home

**Approach selection**
Three options were proposed:
- A: Custom `useNotes` hook (recommended)
- B: Inline state in the page component
- C: React Context provider

Option A was chosen for clean separation of logic from UI.

**Design approval (section by section)**
The design was presented and approved in four sections: data model, file structure and data flow, UI layout, and edge case handling.

**Plan written**
The approved design was saved to the plan file covering: data model, file structure, component responsibilities, data flow, UI spec, edge cases, implementation steps, and a verification checklist.

---

## Execution Mode

After plan approval, implementation proceeded in order:

1. **Spec doc** written to `docs/superpowers/specs/2026-06-14-notes-feature-design.md`
2. **`types/note.ts`** — `Note` type definition (`id`, `title`, `completed`, `important`, `createdAt`)
3. **`hooks/use-notes.ts`** — all CRUD logic and localStorage sync
4. **`components/note-form.tsx`** — controlled input with Add button
5. **`components/note-item.tsx`** — single note row with star, complete, and delete actions
6. **`components/note-list.tsx`** — list or empty state
7. **`app/notes/layout.tsx`** — metadata (`title: "Notes"`) in a server component, since the page must be a client component
8. **`app/notes/page.tsx`** — client component wiring hook and components together
9. **`app/page.tsx`** — Notes link added to the home page button row
10. **Lint** passed (`npm run lint`)

**Implementation deviation from plan — `useNotes` hook**

The plan specified a `useState` + `useEffect` approach for localStorage. During implementation, the ESLint rule `react-hooks/set-state-in-effect` rejected calling `setState` directly inside an effect. The hook was refactored to use `useSyncExternalStore` with a module-level store instead.

This turned out to be a better design:
- Correct React 19 API for subscribing to external stores
- No hydration flicker (server snapshot returns stable `EMPTY` constant; client initializes on first subscription)
- No `useEffect` needed, no cascading renders
- All CRUD functions mutate the module-level store and call `_emit()` to notify subscribers

A second runtime error appeared during testing: `getServerSnapshot` was returning a new `[]` literal on every call, which React treats as an unstable reference and loops on. Fixed by returning a module-level `EMPTY` constant.

---

## Adjustments After Code Review

A code reviewer subagent reviewed all files against the plan requirements. The following changes were made based on its feedback:

**Critical — fixed**

- `note-form.tsx:16` — `onAdd(value)` was passing the raw (untrimmed) input while `addNote` trimmed it internally. Changed to `onAdd(value.trim())` to make the data contract explicit and remove duplicated validation logic.

**Important — fixed**

- `note-form.tsx` — The `<input>` had a `placeholder` but no programmatic label. Screen readers would lose the label once the user started typing. Added `aria-label="New note title"`.
- `note-form.tsx` — The Enter key handler did not call `e.preventDefault()`. Added it to prevent unintended form submission if the component is ever nested inside a `<form>`.

**Minor — fixed**

- `hooks/use-notes.ts` — `toggleCompleted` was unnecessarily wrapping its `map` in `_sort()`. The sort function only considers `important` and `createdAt`; toggling `completed` cannot change list order. The `_sort` call was removed and a comment added to make the intent clear.
- `components/note-item.tsx` — All three action buttons (star, complete, delete) had no padding, making their touch targets smaller than the WCAG 2.5.5 recommended 44×44px minimum. Added `p-1` to each button.

**Deferred — acknowledged but not blocking**

- Module-level store state does not reset cleanly during Hot Module Replacement in development. Inherent to the singleton pattern; acceptable for this scope.
- Notes do not sync across browser tabs. A `storage` event listener in `_subscribe` would fix this, but cross-tab sync was not a stated requirement.
- `crypto.randomUUID()` requires a secure context (HTTPS or localhost). Low risk for the expected deployment target.
