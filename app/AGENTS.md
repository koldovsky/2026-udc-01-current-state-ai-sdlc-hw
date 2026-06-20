<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Stack

- Next.js 16.2.9 (App Router)
- React 19.2.4
- TypeScript 5
- Tailwind CSS 4
- ESLint 9

## Commands

```bash
npm run dev    # start dev server on localhost:3000
npm run build  # production build
npm run lint   # ESLint
npm run start  # serve production build
```

## Conventions

- Use App Router only — no `pages/` directory.
- Server Components by default; add `"use client"` only when you need browser APIs or interactivity.
- File names: `kebab-case` for files, `PascalCase` for React components.
- Co-locate component styles with Tailwind utility classes; no separate CSS files unless necessary.
- Prefer TypeScript strict types; avoid `any`.

## Guardrails

- Do not modify `package.json` or `package-lock.json` without explicit instruction.
- Do not add third-party libraries without approval — check if built-ins or existing deps cover the need first.
- Do not touch `next.config.ts` unless the task specifically requires it.
