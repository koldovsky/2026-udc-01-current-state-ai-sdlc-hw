<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Stack

- Next.js 16.2.10 (App Router), React 19.2.4, TypeScript 5
- Tailwind CSS 4, ESLint 9
- Node.js 22+

## Commands

- `npm run dev` — start the dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint
- No test runner is configured yet — add one (e.g. Vitest) before writing tests.

## Conventions

- TypeScript everywhere (`.tsx`/`.ts`) — no new `.js`/`.jsx` files.
- App Router only: `page.tsx`, `layout.tsx`, `loading.tsx`, etc. under `app/`.
  Don't reintroduce the Pages Router (`pages/`).
- Co-locate route-specific UI inside its `app/<route>/` folder; shared/reusable
  UI goes in a top-level `components/` folder (create it if needed).
- Component names: PascalCase (`NoteList.tsx`); route segment folders:
  lowercase/kebab-case (`app/notes/`).
- Styling via Tailwind utility classes; avoid inline styles and ad-hoc CSS
  files outside `globals.css`.

## Guardrails

- **NEVER** commit secrets, API keys, or `.env` files — they're gitignored,
  keep it that way.
- Don't hand-edit `node_modules/`, `package-lock.json`, or `.next/` —
  regenerate via `npm install` / `npm run build` instead.
- Don't add a `pages/` directory or otherwise mix Pages Router code into this
  App Router project.
