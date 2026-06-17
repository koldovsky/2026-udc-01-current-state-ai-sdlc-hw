# Workflow: Shopping List Feature

## Acceptance Criteria

- Form with text input field + "Add" button
- New items appear in the list below
- Each item has a delete button (×)
- Deleted item disappears from the list
- List is saved in localStorage (does not disappear on page reload)
- Must have "Delete All" button

## Plan → Agent → Review

### Phase 1: Plan Mode
**Task:** Develop a plan for feature implementation

**What was needed:**
- Understand the Next.js project structure
- Determine where components will be located
- Plan state management (useState + localStorage)
- Identify hydration and SSR safety concerns

**Plan included:**
1. Create `app/components/ShoppingList.tsx` — single component with all logic
2. Use `useState` for items and input
3. `useEffect` for localStorage synchronization
4. Functions: `addItem`, `removeItem`, `clearAll`
5. Conditional rendering of buttons based on item count
6. Replace `app/app/page.tsx` content with `<ShoppingList />`
7. Update metadata in `layout.tsx`

**Critical decisions in plan:**
- Hydration: initialize state with `[]`, populate in `useEffect` (not on mount)
- IDs: use `crypto.randomUUID()` instead of `Date.now()`
- localStorage sync: two separate `useEffect` (read on mount, write on items change)

### Phase 2: Agent Mode
**Task:** Implement according to the agreed plan

**What was done:**
1. ✅ Created `ShoppingList.tsx` with full functionality
   - State: `items`, `input`, `mounted`
   - useEffect for localStorage read/write
   - Form with controlled input
   - Conditional rendering of list and buttons

2. ✅ Replaced `page.tsx` — removed Next.js starter code, added `<ShoppingList />`

3. ✅ Updated `layout.tsx` — changed title to "Shopping List"

4. ✅ Tests:
   - Dev server started without errors
   - Build passed without TypeScript errors
   - UI renders correctly

### Phase 3: Review and Corrections
**What was reviewed:**

1. **Component location** — initially the file was created as `app/app/components/ShoppingList.tsx`, but the `@/*` alias in tsconfig points to `app/`, so `app/components/` is needed
   - **Correction:** Move file to the correct location
   - **Result:** ✅ Server now finds the component

2. **Hydration logic** — `mounted` flag + `if (!mounted) return null`
   - **Check:** Correct — prevents SSR/client mismatch
   - **Result:** ✅ On page reload, data from localStorage is correctly restored

3. **localStorage key** — 'SHOPPING_LIST' — simple, does not conflict with other keys
   - **Result:** ✅ Good

4. **Tailwind styling** — classes directly in JSX, no custom CSS
   - **Result:** ✅ Matches AGENTS.md conventions

## Results

✅ **Feature works correctly:**
- Form accepts input
- "Add" button adds items
- Each item has a × button for deletion
- "Delete All" button clears the entire list
- localhost:3000 shows UI without errors
- localStorage syncs data

✅ **Build successful:**
```
✓ Compiled successfully in 972ms
✓ Finished TypeScript in 1205ms
✓ Generating static pages (4/4)
```

## Key Takeaways

1. **Plan mode was useful** — hydration and localStorage sync details were thought through before coding
2. **Most important correction** — correct component location in folder (`app/components/`, not `app/app/components/`)
3. **Focus on hydration** — React + Next.js SSR require special attention to localStorage access (client-side only)
4. **Single component vs multiple files** — for a small feature (< 200 lines) one file was the optimal solution
