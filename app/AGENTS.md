<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Stack & Versions

| Package | Version |
|---|---|
| next | 16.2.9 |
| react | 19.2.4 |
| react-dom | 19.2.4 |
| typescript | ^5 |
| tailwindcss | ^4 |
| eslint | ^9 |

- **Router:** App Router (`app/` directory)
- **Styling:** Tailwind CSS v4 via PostCSS (no `tailwind.config.*` — config is CSS-native)
- **Path alias:** `@/*` maps to the project root

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

> No test runner is configured. Do not add or invoke test scripts unless explicitly asked.

## Conventions

1. **File & folder names:** Use kebab-case for all files and directories (e.g., `user-profile/page.tsx`, `use-auth.ts`). Next.js special files (`page.tsx`, `layout.tsx`, `error.tsx`) must use their exact reserved names.
2. **Component & type names:** Use PascalCase for React components and TypeScript types/interfaces. Use camelCase for functions, variables, and hooks (hooks must start with `use`).
3. **Imports:** Use the `@/` path alias for all non-relative imports within the project. Prefer `import type` for type-only imports.
4. **Server vs. Client components:** Default to Server Components. Add `"use client"` only when the component requires browser APIs, event handlers, or React state/effects.
5. **Styling:** Use Tailwind utility classes directly in JSX. Do not add CSS Modules, styled-components, or additional CSS frameworks.

## Guardrails

1. **Do not modify config files** (`next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `tsconfig.json`) without explicit instruction — changes can break the build silently.
2. **Do not install new dependencies** without explicit instruction. The package set is intentionally minimal; adding packages requires deliberate review.
3. **Do not create a `pages/` directory.** This project uses the App Router exclusively. Mixing routers causes conflicts.
4. **Write all specs and AI-generated docs to `tmp/`** (e.g., `tmp/specs/`, `tmp/plans/`). This directory is gitignored and is never committed. Do not write specs or brainstorming output to `docs/` or any other tracked directory.
