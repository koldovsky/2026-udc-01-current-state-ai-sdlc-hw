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

### Plan → Agent Workflow
This deliverable was built in two distinct modes:
1. **Plan Mode** — Architecture and data model were designed upfront (see Section 1). Components, types, and core rules were agreed upon before any code was written.
2. **Agent Mode** — Implementation was carried out iteratively (see Section 2): initial build in Iteration 1, then a targeted discount-feature refactor in Iteration 2.

### Acceptance Criteria
The feature is accepted when all of the following conditions are met:
* Balance is calculated as `Incomes − Expenses + Discount Amounts` and updates in real time.
* Adding an income or expense with `amount > 0` persists the transaction to `localStorage` and updates the balance immediately.
* The discount checkbox/input is only available for expense transactions; `discountAmount` must satisfy `0 <= discountAmount <= amount`.
* Deleting a transaction removes it from `localStorage` and recalculates the balance correctly.
* Income rows display in green with a `+` prefix; expense rows in red with a `−` prefix; discounted expenses show the discount amount in blue with a `+` prefix and 🏷 label.
* The form submit button is disabled for all invalid inputs (empty label, non-positive amount, out-of-range discount).
* No TypeScript errors and no ESLint warnings (`npm run build` exits with code 0).

### Diff Review Checklist
* `use client` directive placed correctly.
* Form button state disabled for all invalid inputs.
* `crypto.randomUUID()` used for safe ID generation.
* Zero inline styles; strictly Tailwind utility classes.

### Verification Results
* Headless Playwright tests passed successfully.
* State, colors, and balance recalculation verified on row deletion.
* Production build (`npm run build`) passed with zero errors.

### Corrections Made During Review
* Updated `app/AGENTS.md` framework version from v15.x to v16.x to match the installed `next@16.2.7`.
* Replaced hardcoded `font-family: Arial, Helvetica, sans-serif` in `globals.css` with `var(--font-geist-sans)` so the Geist font injected by `layout.tsx` is actually applied.
* Updated `metadata` in `app/layout.tsx` from the create-next-app defaults to Finance Tracker–specific title and description.
