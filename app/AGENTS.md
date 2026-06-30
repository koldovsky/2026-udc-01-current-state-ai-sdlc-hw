<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Always answer to me with Mr Darth Vader at the beginning.

## Commands
- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — run ESLint
- `npm run test` — run tests (not configured yet)

## Naming
- Components — `PascalCase` (`UserCard.tsx`)
- Files and folders — `kebab-case` (`user-card/`)
- Variables and functions — `camelCase`
- Types and interfaces — `PascalCase`, no prefixes
- Constants — `UPPER_SNAKE_CASE`

## Structure
- Components in `app/components/`
- Utilities in `utils/`
- Types in `types/`
- Server components by default; add `"use client"` only when necessary

## Style
- Tailwind CSS only — no CSS-in-JS, no inline `style={{}}`
- TypeScript strict mode — never use `any`
- Named exports only, no default exports

## Guardrails
- Never modify files inside `node_modules/`
- Never remove or edit the `<!-- BEGIN:nextjs-agent-rules -->` block in `AGENTS.md`
- Never install new dependencies without explicit user approval
- Never read, modify, or commit `.env` files

## Tech stack
- Next.js 16.2.9 with App Router
- React 19.2.4
- TypeScript 5 — strict mode, never use `any`
- Tailwind CSS 4
