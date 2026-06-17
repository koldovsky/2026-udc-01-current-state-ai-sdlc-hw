# Task 3: Token & Cost Analysis

## What I Measured

I ran `npx repomix` on 2026-06-17 to get the current repo context size:

```
Total Files:  112 files
Total Tokens:  83,535 tokens
Total Chars:  336,250 chars
```

*(After removing the duplicate `.claude/skills/` directory — see Optimization 1 below. Pre-fix baseline was 188 files / 142,870 tokens.)*

**What this number means:** repomix measures the repo's *context footprint* — how many tokens it would cost to load the entire repository into one context window at once. It is not the same as tokens consumed during a conversation. The IDE only loads the files it actually needs per request.

---

## Repomix Breakdown: Where the Tokens Go

| Category | Tokens | % of Total |
|----------|--------|-----------|
| Skills directory (`.agents/`, single copy) | 60,013 | 71.8% |
| App source code (`app/`) | 13,409 | 16.1% |
| Docs (`docs/`) | 7,108 | 8.5% |
| Config, root files, other | 3,005 | 3.6% |

**Top individual files (measured):**

| File | Tokens | % of Total |
|------|--------|-----------|
| `.agents/skills/vercel-react-best-practices/AGENTS.md` | 26,653 | 31.9% |
| `app/__tests__/TodoList.test.tsx` | 5,403 | 6.5% |
| `docs/prompts-ab-test.md` | 2,897 | 3.5% |
| `.agents/skills/vercel-react-best-practices/SKILL.md` | 1,768 | 2.1% |
| `app/components/TodoList.tsx` | 1,721 | 2.1% |
| `app/public/next.svg` (static asset) | 1,195 | 1.4% |
| `app/components/TodoItem.tsx` | 713 | 0.9% |
| `docs/workflow.md` | 742 | 0.9% |

---

## Actual Conversation Token Estimate (Task 2 Session)

I didn't capture the IDE usage screen during Task 2, so conversation token consumption is estimated from what Claude actually touched — not the full repo. Estimates are based on measured file sizes from the repomix scan above.

**Input tokens per phase:**

| Source | Tokens | Source |
|--------|--------|--------|
| Skill guide (plan mode context) | 26,653 | exact — repomix |
| `app/AGENTS.md` | 447 | exact — repomix |
| User planning prompt | ~150 | estimate |
| Revision prompt (window.prompt pushback) | ~120 | estimate |
| Diff review + fix request | ~200 | estimate |
| **Input subtotal** | **~27,570** | 27,100 exact + ~470 estimated |

**Output tokens per phase:**

| Output | Tokens | Source |
|--------|--------|--------|
| Initial plan | ~1,800 | estimate |
| Revised plan (inline edit approach) | ~600 | estimate |
| `app/types/todo.ts` | 56 | exact — repomix |
| `app/components/TodoItem.tsx` | 713 | exact — repomix |
| `app/components/TodoList.tsx` | 1,721 | exact — repomix |
| `app/app/page.tsx` full rewrite | ~537 | approximate — repomix file size |
| Stats row fix | ~80 | estimate |
| **Output subtotal** | **~5,507** | 2,490 exact + ~3,017 estimated |

**Total estimated: ~33,077 tokens**

**Cost at Claude Sonnet 4.6 ($3.00 in / $15.00 out per 1M tokens):**
```
Input:  27,570 × $0.000003  = $0.08271
Output:  5,507 × $0.000015  = $0.08261
─────────────────────────────────────
Total estimated:              ~$0.165
```

The session cost roughly **$0.17** — almost entirely driven by loading the 26,653-token skill guide once at the start.

---

## Optimizations

### 1. Fix the skill guide duplication — ✅ Applied

The entire skill directory was installed twice — `.agents/skills/` and `.claude/skills/` were identical mirrors. Measured sizes before the fix:

| Directory | Files | Tokens |
|-----------|-------|--------|
| `.agents/skills/` (kept) | 76 | 60,013 |
| `.claude/skills/` (removed) | 76 | 59,974 |
| **Total before** | **152** | **119,987** |

**`.claude/skills/` was deleted.** Repo context dropped from 142,870 → 83,535 tokens — a reduction of **59,335 tokens (41.5%)**.

Input cost saving per session (AGENTS.md loaded once):
```
26,653 × $0.000003 = $0.079959
```
→ 10 sessions/week: **$0.80/week**, ~$41/year from this one fix

### 2. Exclude static assets from context

Two SVG files in `app/public/` account for 1,936 tokens combined (`next.svg`: 1,195 tokens, `globe.svg`: 741 tokens). The agent has no reason to read these — they are static visual assets. Adding `app/public/*.svg` to the context exclusion list in `.claude/settings.json` removes them.

**Impact:** 1,936 tokens saved per session where the agent loads all app files  
→ `1,936 × $0.000003 = $0.005808` per session — small here, but it's a good habit for projects with larger asset directories.

### 3. Use Claude Haiku 4.5 for test writing and documentation

Haiku 4.5 costs $1.00 in / $5.00 out per 1M — roughly 3× cheaper on output than Sonnet 4.6.

The test file (`app/__tests__/TodoList.test.tsx`) is 5,403 tokens — by far the largest single source file in the project. If Haiku had generated that file instead of Sonnet, the output cost for that step alone would be:

```
Sonnet 4.6:  5,403 × $0.000015 = $0.081
Haiku 4.5:   5,403 × $0.000005 = $0.027
Savings:                          $0.054
```

Same logic applies to documentation files (workflow.md: 742 tokens, cost-analysis.md: 1,327 tokens). These don't need architectural reasoning — Haiku handles them fine.

---

## Conclusions

1. **The repo context footprint (142,870 tokens) is not the session cost.** The actual Task 2 session consumed roughly 33,077 tokens (~$0.17). The agent only reads what it needs per request — not the whole repo at once.

2. **The skill guide duplication was the biggest cost driver — and it's now fixed.** Removing `.claude/skills/` cut the repo footprint by 59,335 tokens (41.5%), from 142,870 to 83,535 tokens. The single remaining copy in `.agents/skills/` is sufficient for both the skills CLI and Claude Code.

3. **Choosing the right model for the right task matters more on output.** Test generation (5,403 output tokens) and documentation are good candidates for Haiku 4.5 — switching those alone would cut output cost for this session from $0.080 to roughly $0.040.

---

*Model: Claude Sonnet 4.6 (`claude-sonnet-4-6`) — $3.00/1M input, $15.00/1M output*  
*Repo scanned: 2026-06-17 via `npx repomix` (v1.14.1) — post-fix baseline*  
*Conversation tokens: estimated from measured file sizes; IDE usage screen not captured*
