<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Stack & Versions

- **Next.js** 16.2.7
- **React** 19.2.4 — use new hooks (`use`, `useOptimistic`, `useFormStatus`)
- **TypeScript** 5.x — strict mode enabled
- **Tailwind CSS** 4.x — CSS-first config (`@import "tailwindcss"`), no `tailwind.config.js`
- **Node.js** 25.x

## Conventions

1. All routes live under `app/` using App Router file conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
2. Server Components are the default — add `"use client"` only when the component needs browser APIs or interactivity.
3. Data fetching happens in Server Components via `async/await`; never use `getServerSideProps` or `getStaticProps` (removed).
4. Styles are written with Tailwind utility classes; no CSS Modules or styled-components.
5. Shared types live in `app/types/`; never define one-off types inline inside component files.

## Guardrails

1. **Never modify `package.json` or install dependencies** without explicit user approval — version mismatches in this stack break silently.
2. **Never add `"use client"` to a file that does data fetching** — mixing client boundary with async data access causes runtime errors in Next.js 16.
3. **Never write raw SQL or call external APIs directly from a component** — side effects belong in Server Actions (`app/actions/`) or Route Handlers (`app/api/`).

## Testing

- Use `npm test` from the `app/` folder to run unit tests.
- The project uses Vitest for lightweight unit test execution.

## Commands

All commands run from the `app/` directory.

- **`npm run dev`** — Start the development server (http://localhost:3000).
- **`npm run build`** — Build the app for production.
- **`npm start`** — Start the production server (after `npm run build`).
- **`npm test`** — Run unit tests with Vitest.
- **`npm run lint`** — Run linting checks.
<!-- END:nextjs-agent-rules -->
