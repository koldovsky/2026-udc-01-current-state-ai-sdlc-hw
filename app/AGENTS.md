<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Stack & Versions

| Package | Version |
|---|---|
| Next.js | 16.2.9 (App Router) |
| React | 19.2.4 |
| TypeScript | ^5 (strict mode) |
| Tailwind CSS | ^4 |
| ESLint | ^9 with `eslint-config-next` |

## Commands

```bash
npm run dev      # start local dev server (next dev)
npm run build    # production build (next build)
npm run lint     # run ESLint
# No test framework — do not add Jest or Vitest without explicit approval
```

## Conventions

1. **App Router only.** All routes live under `app/`. Do not create a `pages/` directory.
2. **TypeScript everywhere.** All new files must be `.ts` or `.tsx`. The compiler runs in strict mode — no `any`, no implicit types.
3. **Path alias `@/*`.** Import from the project root via `@/` (e.g. `import { Foo } from "@/components/Foo"`). Do not use relative `../../` chains.
4. **Tailwind v4 syntax.** CSS uses `@import "tailwindcss"` and `@theme` blocks — not v3's `@tailwind base/components/utilities` directives. Keep styles in `globals.css` or co-located CSS modules; do not add inline `style={}` for anything Tailwind can handle.
5. **File-system routing conventions.** Route segments are folders; `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, and `route.ts` are the only special filenames. Colocate non-routable UI in `app/_components/` and shared logic in `app/_lib/` to keep them out of the URL space.
6. **Component files.** One React component per file, named in PascalCase (`PianoKey.tsx`). Custom hooks live in `app/_lib/hooks/`, named `use<Name>.ts`. Keep side-effects (Web Audio API, `AudioContext`) in hooks, not in component bodies.
7. **Shared types.** Define shared types/interfaces in `app/_lib/types.ts`. Use `unknown` + type guards at boundaries — never `any`.
8. **Audio singleton.** Create a single `AudioContext` lazily (on first user gesture) and reuse it across the session. Never create a new context per interaction.

## Guardrails

1. **Do NOT create a `pages/` directory.** App Router is the only routing system; adding `pages/` silently breaks routing in Next.js 16.
2. **Do NOT install a test framework** (Jest, Vitest, Testing Library, etc.) without explicit user approval — the project intentionally ships without one.
3. **Do NOT modify `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, or `eslint.config.mjs`** unless the task explicitly requires it — these are stable baseline configs.
