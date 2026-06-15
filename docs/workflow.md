# Workflow: Calculator Feature

## Feature

A calculator with basic arithmetic operations, decimal number support, percentage, clear functions, and a calculation history panel.

## Acceptance Criteria

| # | Criterion |
|---|-----------|
| AC-1 | Basic operations `+` `−` `×` `÷` between two numbers, result shown after `=` |
| AC-2 | `.` button for decimal input; pressing `.` again on the same number is ignored |
| AC-3 | `CE` removes the last typed character (backspace); `C` resets all state to `0` |
| AC-4 | `%` divides the current display value by 100 |
| AC-5 | History panel: every completed expression `a op b = result` is appended to the list; last 10 entries visible; session-only (no persistence) |

---

## Plan Mode

**What we did:**
Before writing any code, we ran two agents in parallel: Explore (examined project structure, Tailwind v4 config, absence of `src/`, the `@/*` alias) and Plan (designed the architecture). Based on their output, we committed the plan to a file.

**What the plan defined:**
- State shape (`CalcState`) with `waitingForOperand`, `lastOperator`, `lastRhsOperand` fields to support repeated `=`
- A separate pure function `evaluate()` in `src/lib/calculator.ts` — no React dependency
- Split into 3 components: `Calculator` (container, `'use client'`), `Display` (number + history), `KeyPad` (button grid)
- File creation order: lib → hook → components → page

**What we adjusted after the plan review:**
The agent's plan handled repeated `=` as an edge case without a dedicated state field. During review we decided to explicitly add `lastOperator` and `lastRhsOperand` to `CalcState` so the repeated-`=` logic is visible from the type rather than buried in hook conditionals.

---

## Agent Mode

**What we did:**
Implemented all files following the approved plan:

```
src/lib/calculator.ts          — evaluate() + formatResult()
src/hooks/useCalculator.ts     — all state and 7 handlers
src/components/Display.tsx     — number display + history list
src/components/KeyPad.tsx      — 4×5 grid, buttons defined via BUTTONS array
src/components/Calculator.tsx  — 'use client', composes Display + KeyPad
app/app/page.tsx               — replaced Next.js boilerplate with <Calculator />
```

`app/layout.tsx` was not touched (guardrail).

**What we verified after implementation:**
- `npm run build` — passed with no TypeScript errors
- `npm run dev` + `curl localhost:3000` — server responded 200
- Manual browser check: `0.1 + 0.2 = 0.3`, `5 ÷ 0 = Error`, repeated `=`, history panel

---

## Key Technical Decisions

| Decision | Reason |
|----------|--------|
| `parseFloat(value.toPrecision(10))` in `formatResult` | Avoids `0.30000000000000004` in the display |
| `waitingForOperand` flag instead of a separate input string | Simpler state: one boolean instead of two strings |
| `BUTTONS` array in KeyPad instead of manual JSX | Avoids 19 near-identical `<button>` blocks |
| History cap via `.slice(-10)` on every append | No separate cleanup effect needed |
