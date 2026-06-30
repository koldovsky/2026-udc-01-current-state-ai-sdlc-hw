<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — app

Guidance for an Agentic IDE working in this project (UDC Workshop 1 homework).

## Stack & versions

- **Next.js** 16.2.9 (App Router)
- **React** 19.2.4 / **react-dom** 19.2.4
- **TypeScript** 5 (strict)
- **Tailwind CSS** v4 (`@tailwindcss/postcss`)
- **Vitest** (unit tests)
- **Node** 22+ (developed on 22.16)

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | dev server (http://localhost:3000) |
| `npm run build` | production build |
| `npm run start` | run the built app |
| `npm run test` | unit tests (Vitest, single run) |
| `npm run lint` | ESLint (`eslint-config-next`) |

## Conventions

1. **Naming:** components — `PascalCase` (file and export match, e.g.
   `SignupForm.tsx`); functions/variables — `camelCase`.
2. **Structure:** routes and pages live in `app/` (App Router); reusable
   components in `app/components/`; pure, React-free logic in `app/lib/`.
3. **Server vs client components:** server by default; add the `"use client"`
   directive only where state/handlers/browser APIs are needed.
4. **Styling:** Tailwind utilities in `className`; no inline `style`, no CSS-in-JS.
5. **TypeScript:** strict mode; no `any`; keep business logic in pure, testable
   functions (`app/lib/`).

## Guardrails

- **Do not touch** generated files and dependencies: `node_modules/`, `.next/`,
  `package-lock.json`, `next-env.d.ts`.
- **Never** commit secrets, API keys, or `.env*` — they are gitignored, keep it
  that way.
- Do not bump major dependency versions without an explicit request.

## How to verify

Before opening a PR: `npm run lint && npm run test && npm run build` pass with no
errors, `npm run dev` starts, and the page renders.
