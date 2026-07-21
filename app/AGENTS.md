<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Stack

| Layer      | Package             | Version |
|------------|---------------------|---------|
| Framework  | next                | 16.2.9  |
| UI         | react / react-dom   | 19.2.4  |
| Language   | typescript          | ^5      |
| Styling    | tailwindcss         | ^4      |
| Testing    | vitest / @vitest/ui | ^4.1.8  |
| DOM env    | jsdom               | ^29.1.1 |
| Linting    | eslint              | ^9      |
| Node types | @types/node         | ^20     |

## Commands

```bash
npm run dev       # dev server (http://localhost:3000)
npm run build     # production build → .next/
npm run start     # serve the production build
npm run lint      # ESLint (next core-web-vitals + typescript rules)
npm run test      # Vitest (watch mode)
npm run test:ui   # Vitest with browser UI
```

## Conventions

1. **App Router only** — all routes live under `app/`. Never use `pages/`.
2. **File naming** — route segments as `kebab-case` directories; component files as `PascalCase.tsx` co-located with their route.
3. **Styling** — Tailwind utility classes only; no inline `style={}` and no separate `.module.css` files unless Tailwind cannot cover the use case.
4. **Imports** — use the `@/` path alias (maps to repo root) for all non-relative imports.
5. **TypeScript** — strict mode is on; no `any`, no `@ts-ignore` without a comment explaining why.

## Guardrails

- **Do not touch `node_modules/`, `.next/`, or `package-lock.json`** — never edit, commit, or include them in context.
- **Do not add a `pages/` directory** — this app uses App Router exclusively; mixing routers breaks Next.js 16.
- **Do not commit `.env*` files** — secrets are gitignored; keep it that way.
