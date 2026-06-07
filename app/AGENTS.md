<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — `app/` (Next.js counter project)

Guidance for an Agentic IDE working inside this Next.js project (UDC Workshop 1
homework). Read this before making changes.

## Stack & versions

| Tool | Version |
|---|---|
| Next.js | 16.2.7 (App Router) |
| React | 19.2.4 |
| TypeScript | ^5 |
| Tailwind CSS | ^4 (`@tailwindcss/postcss`) |
| ESLint | ^9 (`eslint-config-next`) |
| Node | 22+ (developed on 24.16) |
| Package manager | npm |

## Commands

| Action | Command |
|---|---|
| Dev server | `npm run dev` (http://localhost:3000) |
| Production build | `npm run build` |
| Start prod build | `npm run start` |
| Lint | `npm run lint` |
| Test | not configured yet — add Vitest/RTL before writing tests |

> Run all commands from the `app/` directory.

## Conventions

1. **App Router only.** Pages/components live under `src/app/`. Use the `@/*`
   import alias (e.g. `@/app/components/Counter`).
2. **TypeScript everywhere.** No `.js`/`.jsx` source files; prefer explicit
   prop types and avoid `any`.
3. **Components:** `PascalCase` filenames and component names; one component per
   file. Reusable UI goes in `src/app/components/`.
4. **Client vs Server:** default to Server Components; add `"use client"` only
   when a component needs state, effects, or browser APIs.
5. **Styling:** Tailwind utility classes in JSX. No inline `style` objects and
   no extra CSS files unless a utility cannot express it.

## Guardrails

- **Do NOT** edit generated/config scaffolding without a clear reason:
  `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `package-lock.json`.
- **Do NOT** commit secrets or `.env*` files, and never add `node_modules/` or
  `.next/` to git or to the AI context (see `.cursorignore`).
- **Do NOT** introduce new runtime dependencies for the counter feature — it
  must work with plain React state.

## How to verify

`npm run dev` starts cleanly, `npm run lint` passes, and the counter increments,
decrements, and resets in the browser.
