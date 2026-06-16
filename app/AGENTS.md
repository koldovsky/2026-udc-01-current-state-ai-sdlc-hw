<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project context

## Stack & versions
- **Next.js 16.2.9** — App Router (`app/` directory; `layout.tsx` + `page.tsx` at root, no `src/`)
- **React 19.2.4** + **react-dom 19.2.4**
- **TypeScript ^5** — `strict: true`, target `ES2017`, path alias `@/* → ./*`
- **Tailwind CSS v4** via `@tailwindcss/postcss` (PostCSS pipeline; global styles in `app/globals.css`)
- **ESLint 9** flat config (`eslint.config.mjs`) extending `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- **Package manager:** npm (`package-lock.json`)
- **Node:** no `engines` pinned — assume Node 22+ per workshop prerequisites
- **Tests:** none configured yet

## Commands
- `npm run dev` — local dev server (`next dev`)
- `npm run build` — production build (`next build`)
- `npm run start` — serve the production build (`next start`)
- `npm run lint` — ESLint (`eslint`)
- *(no `test` script yet)*

## Conventions
1. **App Router only.** New routes/layouts/loading/error UI live under `app/`; do not add a `pages/` directory or mix routing models.
2. **TypeScript everywhere.** New files are `.ts` / `.tsx`; respect `strict` — no `any`, no `// @ts-ignore` without a one-line reason.
3. **Imports.** Prefer the `@/` alias for in-project imports (`@/app/...`, `@/lib/...`) over deep relative chains. External imports first, then `@/`, then relative — one blank line between groups.
4. **Naming & layout.** PascalCase filenames for components (`NoteList.tsx`); kebab-case for route segments (`app/notes/page.tsx`); colocate component-specific styles/tests next to the component.
5. **Styling = Tailwind.** Use Tailwind utility classes; only fall back to `globals.css` for true global concerns (resets, CSS vars, font setup). No CSS-in-JS libraries.

## Guardrails — what NOT to do
1. **Don't touch generated / build artifacts.** `.next/`, `node_modules/`, `next-env.d.ts`, lockfiles — never hand-edit. If a dep is missing, run `npm install <pkg>`; don't patch `package-lock.json` directly.
2. **Don't disable strictness or framework rules.** No relaxing `tsconfig.json` `strict`, no broad `eslint-disable` blocks, no removing the `eslint-config-next` presets. Fix the root cause instead.
3. **Don't introduce a second framework or routing model.** No Pages Router, no swapping Tailwind for another styling lib, no adding state-management libraries — keep the stack minimal until the feature actually needs it.
