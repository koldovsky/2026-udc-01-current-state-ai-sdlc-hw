# Task 2: Marketing Research Feedback Form

## Feature Overview

A 5-question marketing research survey form embedded on the homepage. Users answer two rating questions (scale 1–10) and three multi-select checkbox questions, then submit. The response is stored in a server-side in-memory array and the user is redirected to a `/thank-you` confirmation page.

### Questions (placeholder content)

| # | Type | Text |
|---|------|------|
| 1 | Rating 1–10 | How satisfied are you with our product overall? |
| 2 | Rating 1–10 | How likely are you to recommend us to a friend or colleague? |
| 3 | Checkboxes | Which features do you use most? |
| 4 | Checkboxes | What best describes your role? |
| 5 | Checkboxes | Which improvements would you prioritize? |

### Files Created / Modified

| File | Change |
|------|--------|
| `types/feedback.ts` | New — shared TypeScript types (`FeedbackPayload`, `FeedbackSubmission`) |
| `app/api/feedback/route.ts` | New — `POST` handler with in-memory store; `GET` for debugging |
| `app/components/rating-question.tsx` | New — 1–10 numbered-button selector with error state |
| `app/components/checkbox-question.tsx` | New — checkbox group with toggle logic and error state |
| `app/components/feedback-form.tsx` | New — client component orchestrating state, validation, fetch, redirect |
| `app/thank-you/page.tsx` | New — server component confirmation page |
| `app/page.tsx` | Modified — replaced default content with `<FeedbackForm />` |
| `package.json` | Modified — switched `dev` script to use webpack bundler |
| `next.config.ts` | Modified — added `serverExternalPackages` (attempted fix, ultimately unused) |

---

## Plan Mode

The session entered **plan mode** before writing any code. In this phase the assistant:

1. **Explored the codebase** using an Explore agent to understand the project structure — confirming it was a minimal Next.js 16 + React 19 + Tailwind 4 + TypeScript starter with no existing components, forms, or state management.

2. **Asked four clarifying questions** to avoid making assumptions:
   - What are the 5 questions and their types?
   - Where should the form live in the app?
   - What happens after the user submits?
   - What should happen with the submitted data?

3. **Designed the implementation plan** covering: file structure, TypeScript types, validation rules, per-component responsibilities, and a verification checklist.

4. **Presented the plan for approval** before touching any file.

### User Corrections During Plan Phase

| Decision Point | Initial Assumption | User Choice |
|---|---|---|
| Form location | A dedicated `/feedback` route was offered as first option | **Homepage** — form embedded directly on the existing root page |
| Post-submit behaviour | "Success message on same page" was offered first | **Redirect to `/thank-you`** — a separate confirmation page |
| Data handling | "Server Action + console log" was offered first | **API route + in-memory store** — POST to `/api/feedback`, results survive across navigations until server restart |
| Question content | Specific questions could be provided by the user | **Use placeholder content** — generic marketing questions to be customised later |

---

## Implementation (Agent Mode)

After plan approval the assistant implemented all seven steps in order, parallelising independent file writes where possible.

### What Went Smoothly

- All TypeScript types, API route, two reusable UI components, the main form component, the thank-you page, and the homepage update were created without revision.
- `tsc --noEmit` and ESLint both reported zero errors after implementation.
- Client-side and server-side validation were implemented consistently using the same rules.

### Issues Encountered and Corrections

#### 1. Dev server crash — `@tailwindcss/oxide` native binding not found

**Symptom:** The app returned HTTP 500 immediately on load with the error:
```
Cannot find native binding. Cannot find module '@tailwindcss/oxide-darwin-arm64'
```

**Root cause:** Tailwind CSS 4 uses a Rust-based native module (`@tailwindcss/oxide`) for CSS processing. Turbopack (Next.js 16's default dev bundler) patches the global `require` at runtime. When `@tailwindcss/oxide` tried to load its platform binary through that patched `require`, Turbopack's module resolver failed to locate the scoped package even though it was physically installed.

**Attempts before the working fix:**

| Attempt | Outcome |
|---------|---------|
| `rm -rf node_modules package-lock.json && npm install` | Binary was already installed correctly — reinstall did not help |
| `rm -rf .next && npm run dev` | Same Turbopack chunk re-generated with identical hash — did not help |
| Copy `.node` binary into oxide package directory | Turbopack's patched `require` intercepted the relative path too — did not help |
| Add `serverExternalPackages` to `next.config.ts` | PostCSS runs in a different pipeline than server JS bundles — did not help |

**Working fix:** Switch the dev bundler from Turbopack to webpack using the `--webpack` flag:
```json
"dev": "next dev --webpack"
```
Webpack's PostCSS loader uses Node's native `require` without patching, so the Oxide binary resolves correctly.

**User correction:** The first attempt used `--no-turbopack` (the Next.js 15 flag). The user ran it and got `unknown option '--no-turbopack'`. The correct flag in Next.js 16 is `--webpack`, found by reading `node_modules/next/dist/docs/01-app/03-api-reference/06-cli/next.md`.

#### 2. Hydration mismatch warning in the browser console

**Symptom:** React reported a hydration mismatch on `<body>`, showing two injected attributes:
```
__processed_cf8ef229-45d5-43da-a076-205a21fe741b__="true"
bis_register="..."
```

**Root cause:** A browser extension (VPN/proxy, identified by the `bis_register` attribute pattern) was modifying the `<body>` tag after the server rendered the HTML but before React finished hydrating. This is explicitly listed in React's own hydration-mismatch documentation as a known external cause.

**Resolution:** No code change required. The user confirmed the form submitted correctly. Opening the page in an incognito window (extensions disabled) reproduces no warning.
