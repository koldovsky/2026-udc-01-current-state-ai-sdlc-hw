# Task 3 — Token & cost analysis

Goal: **measure** the context/token footprint of the Task 2 feature and reason
about cost, instead of guessing.

## Measured context size (`npx repomix`)

`repomix` packs the repo into a single file and reports its size in tokens
(real, reproducible numbers — run `npx repomix` to verify):

| Scope packed | Files | Tokens |
|---|---:|---:|
| **Whole repo** (everything committable) | 106 | **70,857** |
| Repo **without** the installed skill (`.agents/**`) | 30 | 12,897 |
| **Feature only** (`app/app/**` + `app/AGENTS.md` + `app/package.json`) | 8 | **3,485** |

Two facts jump out:

- The installed Agent Skill (`vercel-react-best-practices`) is **~57,960 tokens
  ≈ 82%** of the whole-repo context (70,857 − 12,897). It ships a compiled
  `AGENTS.md` *plus* ~70 individual rule files — a lot of duplicated content.
- The code actually needed to build the sign-up form is only **3,485 tokens** —
  **~20× smaller** than the whole repo.

> The session's real spend can also be cross-checked in Claude Code with the
> `/cost` command (live usage screen). The repomix numbers above are the hard,
> reproducible measurement used for the estimate below.

## Pricing (per 1M tokens)

Model used in this session: **Claude Opus 4.8** (`claude-opus-4-8`).

| Model | Input | Output | Cache read (~0.1× in) | Cache write 5m (~1.25× in) |
|---|---:|---:|---:|---:|
| **Claude Opus 4.8** | $5.00 | $25.00 | $0.50 | $6.25 |
| Claude Sonnet 4.6 | $3.00 | $15.00 | $0.30 | $3.75 |
| Claude Haiku 4.5 | $1.00 | $5.00 | $0.10 | $1.25 |

## Cost estimate for the feature

Assumptions (stated, so the math is auditable): the feature took **~10 agent
turns** (read files → write 5 files → run lint/test/build → fix) and produced
**~8,000 output tokens** of code + text. Cost = `tokens × price`.

**A. Naive** — full-repo context resent every turn, no caching, on Opus 4.8:

- Input: 10 × 70,857 = 708,570 tok × $5/1M = **$3.54**
- Output: 8,000 tok × $25/1M = **$0.20**
- **Total ≈ $3.74**

**B. Optimized** — narrow context (only the 8 feature files, 3,485 tok/turn) on
Opus 4.8:

- Input: 10 × 3,485 = 34,850 tok × $5/1M = **$0.17**
- Output: 8,000 tok × $25/1M = **$0.20**
- **Total ≈ $0.37** → **~10× cheaper** than naive, just by trimming context.

**C. Optimized + cheaper model for routine** — same narrow context, but route the
mechanical turns (boilerplate, test scaffolding) to **Haiku 4.5**:

- Input: 34,850 tok × $1/1M = **$0.03**; Output: 8,000 tok × $5/1M = **$0.04**
- **Total ≈ $0.07**

## 2–3 optimizations (with the real numbers behind them)

1. **Narrow the context.** Don't feed the model the whole repo. The feature
   needs 3,485 tok, not 70,857 — and the skill alone is ~58k tok. `.cursorignore`
   / `.claude/settings.json` (Task 1) already strip `node_modules`/`.next`/locks;
   loading only the relevant files takes input cost from ~$3.54 to ~$0.17 per the
   run above (~20× fewer input tokens).
2. **Cheaper model for routine work.** Boilerplate, test scaffolding, and
   renames don't need Opus. Haiku 4.5 is **5× cheaper on input and output**
   ($1/$5 vs $5/$25). Keep Opus for design/debugging; drop to Sonnet/Haiku for
   mechanical edits.
3. **Prompt caching for the stable prefix.** A cache read is ~0.1× of input
   ($0.50 vs $5.00 on Opus 4.8). The stable prefix (system prompt + `AGENTS.md` +
   tool list) is identical across turns — caching it makes every turn after the
   first ~10× cheaper on that prefix. (Note: Opus 4.8's minimum cacheable prefix
   is 4,096 tokens, so a 3,485-token context only benefits once the full prefix
   crosses that threshold — which the real session prefix does.)
4. **Shorter iterations / clearer prompts.** Fewer round-trips = fewer times the
   context is resent. A precise up-front spec (acceptance criteria written before
   code, as in Task 2) cut re-work and kept turn count — and therefore input
   tokens — down.

## Conclusions

1. **Context size dominates cost, not output.** Input tokens (resent every turn)
   drove ~95% of the naive estimate. The single biggest lever is *what you put in
   context*: trimming whole-repo → feature-only was a ~20× input-token reduction
   (70,857 → 3,485) and ~10× total-cost reduction (~$3.74 → ~$0.37).
2. **A heavyweight skill is not free.** The installed skill is ~82% of the repo's
   packable context. Useful, but it should be loaded on-demand for the relevant
   task, not packed into every request — otherwise it silently dominates spend.
3. **Model choice is a 5× knob.** Reserving Opus for hard reasoning and routing
   routine edits to Haiku/Sonnet compounds with context-narrowing (estimate C:
   ~$0.07). Measure first (`repomix`, `/cost`), then optimize the biggest line.
