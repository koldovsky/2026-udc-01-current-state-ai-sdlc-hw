# Task 2: Todo List Feature — Workflow

## Feature

A simple **Todo List Manager** — add tasks, change their status (backlog → in progress → pending → done), and delete them.

---

## Acceptance Criteria

Defined before writing any code:

1. Users can add a new task with a title; it starts in "backlog" status
2. All tasks are visible in a list with their current status
3. Users can change a task's status and edit the title
4. Users can delete a task (with a confirmation step so nothing gets removed by accident)
5. The list shows a summary of how many tasks are in each status

---

## Plan Mode

I opened Plan mode and asked Claude to design the implementation before touching any code.

**What the initial plan proposed:**
- Three files: `todo.ts` for types, `TodoItem.tsx` for a single task row, `TodoList.tsx` as the container
- `useState` for the tasks array, `useCallback`/`useMemo` for derived data
- Tailwind CSS for styling, no external state library

**What I reviewed and adjusted:**

The first plan had `TodoItem.tsx` calling `window.prompt()` for editing titles — which is janky and breaks on some browsers. I pushed back on that and asked for inline editing instead. Claude revised the plan to use a controlled input that appears on edit mode rather than a native dialog.

I also questioned whether we needed both `useCallback` and `useMemo` for a list this small. Claude's reasoning was that memoization makes sense here because filter and stats recalculate on every render otherwise — I agreed and kept it.

After that revision the plan looked good, so I approved it and switched to Agent mode.

---

## Agent Mode

Executed straight from the agreed plan. The agent created the files in this order:

1. `app/types/todo.ts` — type definitions first to establish the contract
2. `app/components/TodoItem.tsx` — presentational component with edit/delete/status controls
3. `app/components/TodoList.tsx` — container managing state, filters, and stats
4. Updated `app/app/page.tsx` — swapped out the default Next.js page for `<TodoList />`

No surprises during execution. The inline edit input from the revised plan worked cleanly. TypeScript strict mode caught one type mismatch on the status dropdown that would have been a silent bug at runtime.

---

## Review and Browser Check

After the agent finished, I reviewed the diff manually before running anything.

A few things I noticed:
- The stats row showed "0" for statuses with no tasks, which looked cluttered. I asked Claude to hide zero-count statuses — quick one-liner fix.
- The delete confirmation used `window.confirm()` after all (not the inline approach I expected). It works fine for this scale, so I left it.

Then ran `npm run dev` and walked through the feature in the browser:
- Added a few tasks, cycled through statuses, edited a title, deleted one with and without confirming — all worked as expected
- Checked on a narrow viewport — the layout stacked correctly on mobile

---

## What I'd Do Differently

- Start with even tighter acceptance criteria — 5 points were still a bit broad for a 30-minute feature
- Push back on `window.confirm()` earlier; I caught it in the diff review but should have been explicit in the plan
- The inline edit approach required one extra round of revision that could have been avoided with a clearer initial prompt
