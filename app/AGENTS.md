<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: Graphing Calculator

A web-based graphing calculator built with Next.js. Users type math expressions
(e.g. `sin(x) + 0.5*x^2`) and see them plotted on an interactive 2D canvas with
pan, zoom, and multi-function overlay.

## Stack

- Next.js 16 (App Router, `src/` layout)
- React 19
- TypeScript 5 (strict)
- Tailwind CSS v4
- Node 22+

Planned (added in Task 2 when the feature lands):
- `mathjs` for expression parsing/evaluation
- HTML `<canvas>` for plotting (no charting library — keep deps lean)

## Commands

- `npm run dev`   — start dev server on http://localhost:3000
- `npm run build` — production build
- `npm run start` — serve production build
- `npm run lint`  — ESLint via `eslint-config-next`

(No test runner yet — add `vitest` only if a feature needs it.)

## Conventions

- **Components** live in `src/components/`, PascalCase filenames (`Graph.tsx`).
- **Hooks** in `src/hooks/`, `useFoo.ts`.
- **Pure math/eval helpers** in `src/lib/`, kebab-case (`expression-eval.ts`).
- **Client interactivity** (canvas, inputs) uses `"use client"`; everything else
  stays a Server Component by default.
- **Styling**: Tailwind utilities only; no CSS modules, no styled-components.

## Guardrails

- Don't add a charting library (Chart.js, Recharts, D3) — plotting is canvas + math.
- Don't `eval()` user input. Expressions go through `mathjs.evaluate` only.
- Don't touch `next.config.ts`, `tsconfig.json`, or ESLint config unless the task
  explicitly says so.
- Don't commit `node_modules/`, `.next/`, `.env*`, or `*.log`.
