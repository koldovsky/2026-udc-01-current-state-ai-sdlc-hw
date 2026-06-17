<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Stack & Versions

- **Framework:** Next.js 15.x with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.x
- **Node:** v24.13.0+
- **Package Manager:** npm 11.6.2+

## Commands

- `npm run dev` — Start dev server (http://localhost:3000)
- `npm run build` — Production build
- `npm run test` — Run tests
- `npm start` — Run production server

## Conventions

1. **File Structure:** Components in `app/components/`, pages in `app/`, utilities in `app/lib/`
2. **Naming:** PascalCase components (UserCard.tsx), camelCase utilities (useAuth.ts)
3. **Components:** Functional only, TypeScript interfaces for props, default exports
4. **Styling:** Use Tailwind classes directly, avoid custom CSS
5. **Imports:** Use `@/*` alias for absolute imports

## Guardrails

### ✅ Do:
- Keep components small (<200 lines)
- Use TypeScript strictly (no `any` without comment)
- Use the `@/*` alias for absolute imports
- Style with Tailwind classes only
- Avoid custom CSS (no `.css` files or `<style>` blocks beyond `globals.css`)
- Test in browser before committing

### ❌ Don't:
- Add runtime dependencies without review
- Modify tsconfig.json or next.config.js without discussion
- Commit node_modules/, .next/, .env.local
