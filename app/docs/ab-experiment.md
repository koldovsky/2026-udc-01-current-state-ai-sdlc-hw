# Basic prompt

## Task
Implement a counter feature in Next.js with increment, decrement, reset buttons; floor at 0; localStorage persistence.

## Output Quality
**High.** The model correctly identified and reused the existing `useSyncExternalStore` store pattern from `hooks/use-notes.ts` rather than reaching for `useState` + `useEffect`. All project conventions were respected: `"use client"` directive, `@/` path aliases, Tailwind utility classes, kebab-case filenames, Server Component page shell wrapping a Client Component. All five requirements were satisfied in a single pass with no corrections.

## Iterations Required
**1** — task completed without back-and-forth, re-prompts, or bug-fix rounds.

## Approximate Token Usage
| Segment | Tokens |
|---|---|
| Input (git status, system context, AGENTS.md, tool schemas, file reads, user messages) | ~7,500 |
| Output (3 written files + prose) | ~2,200 |
| **Total** | **~9,700** |

## Notes
- The model read 2 existing files before writing any code, which grounded it in project patterns.
- A basic natural-language prompt produced correct, idiomatic output with no prompt engineering required.
- Token cost is dominated by the large git status blob in the system context (~3,200 tokens).

---

# Structured prompt

## Task
Implement a counter feature in Next.js with increment, decrement, reset buttons; floor at 0; localStorage persistence — delivered via a fully structured prompt with role definition, context, functional requirements, technical constraints, acceptance criteria, and a mandated 6-section output format.

## Output Quality
**High — identical to the basic prompt.** The model produced the same correct, idiomatic implementation: `useSyncExternalStore` module-level store matching `use-notes.ts`, proper `_getServerSnapshot` to prevent hydration warnings, `Math.max(0, …)` floor in the store, `useCallback` with empty deps, Server Component page wrapping a Client Component. All six acceptance criteria were satisfied in a single pass. The structured output format was followed faithfully, yielding a more verbose prose response (architecture rationale, trade-offs table, decision table) but no improvement to the code itself.

## Iterations Required
**1** — same as the basic prompt. The additional constraint surface (12 technical constraints, 6 acceptance criteria) did not prevent errors or require fewer clarifications because none were needed in the first place.

## Approximate Token Usage
| Segment | Tokens |
|---|---|
| Input (git status, system context, AGENTS.md, tool schemas) | ~7,500 |
| Structured user prompt (role + context + requirements + constraints + criteria + output format) | ~500 |
| File reads (5 files vs 2 for basic prompt) | ~2,000 |
| Output (3 written files + 6-section prose + tables) | ~3,500 |
| **Total** | **~13,500** |

Compared to the basic prompt (~9,700 tokens), the structured prompt consumed **~39% more tokens** with no measurable improvement in code quality or iteration count.

## Notes
- The structured prompt produced a longer, more formally organized response, which may aid human review or documentation but added no correctness benefit.
- The model read 5 files (vs 2 for the basic prompt) — the richer context request in the structured output led to more exploratory reads, increasing input cost.
- The mandated output format (architecture, file structure, persistence, decisions, trade-offs) is useful when the audience needs justification, not just code.
- For an experienced team with strong conventions already encoded in `AGENTS.md`, the basic prompt achieved equivalent results at lower cost. The structured prompt's value is in the prose artifact, not the code.
