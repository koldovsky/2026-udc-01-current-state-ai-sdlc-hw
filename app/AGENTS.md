<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

when answering to me always start with 🫩

# Project

Small Next.js App Router app (UDC WS1 homework).

## Stack

- Next.js 16.2.9 (App Router)
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4
- ESLint 9 (eslint-config-next)

Node 22+.

## Commands

Run from `app/`:

- `npm run dev` — dev server
- `npm run build` — production build
- `npm run start` — serve build
- `npm run lint` — ESLint

No test runner yet; use lint as quality gate.

## Conventions

1. **Structure** — App Router in `app/app/`; shared UI in `app/components/`, utilities in `app/lib/` when added; static assets in `app/public/`.
2. **Imports** — use `@/*` path alias (maps to project root); prefer direct imports over barrel files.
3. **Components** — PascalCase filenames; default export for pages/layouts; Server Components by default; add `'use client'` only for hooks/events/browser APIs.
4. **TypeScript** — `strict: true`; type props explicitly; use `import type` for type-only imports.
5. **Style** — Tailwind utility classes in `className`; no inline styles unless dynamic; run `npm run lint` before PR.

## Guardrails

1. **Secrets** — never commit `.env*` or API keys; already gitignored and in `.cursorignore`.
2. **Next.js 16** — APIs differ from training data; read `node_modules/next/dist/docs/` before changing routing or data-fetching.
3. **Context hygiene** — don't edit `node_modules/`, `.next/`, or `package-lock.json` by hand; keep heavy dirs out of AI context via `.cursorignore`.
