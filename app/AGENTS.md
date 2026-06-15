## Stack

* Next.js 15
* React 19
* TypeScript
* Node.js 22

## Dev commands

```bash
npm run dev    # start dev server (localhost:3000)
npm run build  # production build
npm run test # tests
```

## Conventions

- Use the App Router (`app/` directory) — no `pages/` directory.
- **Components** live in `src/components/`.
- **Functions:** `camelCase`
- **Components:** PascalCase (`UserCard`, `NavBar`).
- **Constants:** `SCREAMING_SNAKE_CASE`
- **Types/Interfaces:** PascalCase, prefix interfaces with `I`

## Guardrails

- **NEVER touch `app/layout.tsx`** without explicit instruction — it sets global fonts, metadata, and body structure shared by every page.
- **NEVER commit `.env*` files or hardcode secrets** — use environment variables via `process.env` only, and keep them in `.env.local` (gitignored).
- **NEVER install new dependencies** without confirming with the user first — check if the need can be met by already-installed packages or built-in Next.js/React APIs.