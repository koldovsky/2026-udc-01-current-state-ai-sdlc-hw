<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Stack & Versions

- **Next.js** 16.2.9 (App Router, not Pages Router)
- **React** 19.2.4
- **TypeScript** 5.x — strict mode enabled
- **Tailwind CSS** 4.x (via `@tailwindcss/postcss`)
- **ESLint** 9.x with `eslint-config-next` (core-web-vitals + typescript rules)
- **Node.js path alias:** `@/*` maps to the project root

## Environment Commands

```bash
# Development
npm run dev       # starts Next.js dev server (http://localhost:3000)

# Production
npm run build     # type-checks + compiles for production
npm run start     # serves the production build

# Quality
npm run lint      # runs ESLint across the project
```

## Coding Conventions

1. **File & component naming** — React components in `PascalCase.tsx`; utility modules in `camelCase.ts`; route segments follow Next.js App Router conventions (`page.tsx`, `layout.tsx`, `loading.tsx`).
2. **Imports** — use the `@/` alias for all intra-project imports (e.g. `import Foo from "@/components/Foo"`); never use relative `../../` paths.
3. **Styling** — Tailwind utility classes only; no inline `style=` props and no separate CSS files except `globals.css`. Dark mode via `dark:` variants.
4. **TypeScript** — no `any`, no type assertions (`as Foo`) without a comment explaining why. Prefer `interface` for object shapes and `type` for unions/aliases.
5. **React** — functional components only; keep Server Components the default and add `"use client"` only when browser APIs or interactivity require it.

## Guardrails (Do Not Touch)

1. **`app/AGENTS.md` marker block** — never remove or edit the `<!-- BEGIN:nextjs-agent-rules -->…<!-- END:nextjs-agent-rules -->` block; it is injected by tooling.
2. **`tsconfig.json` strict flags** — do not disable `strict`, `noEmit`, or `isolatedModules`; these are required for correct Next.js type-checking and build output.
3. **`eslint.config.mjs` rule overrides** — do not downgrade or disable `core-web-vitals` or TypeScript rules; fix the root cause instead of silencing the linter.