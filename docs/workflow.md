# Workflow: Mini Finance Tracker

## 1. Plan Mode & Architecture

### Data Model (`app/types/transaction.ts`)
* `Transaction` type: `"income" | "expense"`
* Fields: `id`, `label`, `amount`, `type`, `discountAmount?`, `createdAt`

### Component Structure (`app/components/`)
* `finance-tracker.tsx` — root Client Component (state + localStorage)
* `balance-display.tsx` — presentational balance counter
* `transaction-form.tsx` — controlled form with validation
* `transaction-list.tsx` — sorted list with delete action

### Core Rules & Logic
* **Balance**: `Incomes − Expenses + Discount Amounts`
* **Validation**: `amount > 0`; `0 <= discountAmount <= amount`
* **Styling**: Tailwind v4 (Income: green `+`, Expense: red `−`, Discount: blue `+` + 🏷)
* **Persistence**: `localStorage` with try/catch block

---

## 2. Agent Mode (Implementation)

### Iteration 1: Initial Setup
1. Created shared TypeScript types.
2. Built UI components sequentially: Display → Form → List.
3. Connected state and persistence in the root component.
4. Updated `app/page.tsx` to render the tracker.

### Iteration 2: Discount Refactor
* Removed "Discount" as a standalone transaction type.
* Added a dynamic "Discount" checkbox/input inside the Expense form.
* Updated the balance reducer and list rendering to handle embedded discounts.

---

## 3. Review & Verification

### Diff Review Checklist
* `use client` directive placed correctly.
* Form button state disabled for all invalid inputs.
* `crypto.randomUUID()` used for safe ID generation.
* Zero inline styles; strictly Tailwind utility classes.

### Verification Results
* Headless Playwright tests passed successfully.
* State, colors, and balance recalculation verified on row deletion.
* Production build (`npm run build`) passed with zero errors.
