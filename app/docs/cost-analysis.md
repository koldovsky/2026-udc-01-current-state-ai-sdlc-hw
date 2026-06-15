# Cost Analysis — Repomix Token Report

Generated: 2026-06-14
Tool: repomix v1.14.1
Encoding: `o200k_base`

## Summary

| Metric | Value |
|--------|-------|
| Total files | 27 |
| Total tokens | 9,476 |
| Total chars | 30,667 |
| Output | repomix-output.xml |
| Security | No suspicious files detected |

## Per-File Token Breakdown

| # | File | Tokens | Chars | % of Total |
|---|------|-------:|------:|-----------:|
| 1 | `docs/workflow.md` | 1,269 | 5,478 | 13.4% |
| 2 | `public/next.svg` | 1,195 | 1,375 | 12.6% |
| 3 | `app/page.tsx` | 744 | 3,189 | 7.9% |
| 4 | `public/globe.svg` | 741 | 1,035 | 7.8% |
| 5 | `hooks/use-notes.ts` | 644 | 2,451 | 6.8% |
| 6 | `AGENTS.md` | 628 | 2,544 | 6.6% |
| 7 | `components/note-item.tsx` | 461 | 1,718 | 4.9% |
| 8 | `README.md` | 360 | 1,449 | 3.8% |
| 9 | `components/note-form.tsx` | 355 | 1,317 | 3.7% |
| 10 | `public/file.svg` | 269 | 391 | 2.8% |
| 11 | `public/window.svg` | 268 | 385 | 2.8% |
| 12 | `components/note-list.tsx` | 228 | 849 | 2.4% |
| 13 | `app/notes/page.tsx` | 211 | 825 | 2.2% |
| 14 | `tsconfig.json` | 205 | 665 | 2.2% |
| 15 | `package.json` | 185 | 524 | 2.0% |
| 16 | `app/layout.tsx` | 183 | 718 | 1.9% |
| 17 | `.gitignore` | 158 | 531 | 1.7% |
| 18 | `app/globals.css` | 145 | 487 | 1.5% |
| 19 | `eslint.config.mjs` | 111 | 464 | 1.2% |
| 20 | `.claude/settings.json` | 68 | 236 | 0.7% |
| 21 | `public/vercel.svg` | 58 | 128 | 0.6% |
| 22 | `app/notes/layout.tsx` | 53 | 234 | 0.6% |
| 23 | `types/note.ts` | 32 | 119 | 0.3% |
| 24 | `next.config.ts` | 30 | 132 | 0.3% |
| 25 | `.claude/settings.local.json` | 24 | 68 | 0.3% |
| 26 | `postcss.config.mjs` | 24 | 93 | 0.3% |
| 27 | `CLAUDE.md` | 4 | 10 | 0.0% |

## Claude API Cost Analysis

Model: **claude-sonnet-4-6**
Input context: **9,476 tokens** (full repomix output sent as prompt context)

### Pricing

| Token type | Rate |
|------------|------|
| Input | $3.00 / 1M tokens |
| Output | $15.00 / 1M tokens |
| Cache write | $3.75 / 1M tokens |
| Cache read | $0.30 / 1M tokens |

### Per-Call Input Cost

| Tokens | Cost |
|--------|------|
| 9,476 input tokens | $0.0000284 |

### Estimated Total Cost Per Call (input + output)

Assumes 9,476 input tokens + estimated output:

| Output estimate | Output tokens | Input cost | Output cost | Total per call |
|-----------------|--------------|-----------|------------|---------------|
| Short response | 500 | $0.0000284 | $0.0000075 | $0.0000359 |
| Medium response | 1,000 | $0.0000284 | $0.0000150 | $0.0000434 |
| Long response | 2,000 | $0.0000284 | $0.0000300 | $0.0000584 |

### Cost at Scale

Based on medium response (1,000 output tokens):

| Calls | Input cost | Output cost | Total |
|-------|-----------|------------|-------|
| 1 | $0.0000284 | $0.0000150 | $0.0000434 |
| 100 | $0.00284 | $0.00150 | $0.00434 |
| 1,000 | $0.0284 | $0.0150 | $0.0434 |
| 10,000 | $0.284 | $0.150 | $0.434 |
| 100,000 | $2.84 | $1.50 | $4.34 |

### With Prompt Caching

If the repomix context is cached (written once, read repeatedly):

| Scenario | Cost |
|----------|------|
| Cache write (one-time) | $0.0000355 |
| Cache read per call | $0.0000028 |
| Savings vs. standard input per call | ~90% on input tokens |

At 1,000 calls with cached context + medium output:
- Without cache: $0.0434
- With cache: $0.0000355 (write) + 1,000 × ($0.0000028 + $0.0000150) = **$0.0180** (~59% savings)

---

## Token Optimization Analysis

### What's Wasting Tokens

The baseline (9,476 tokens) includes files with little or no value for code-understanding tasks:

| Category | Files | Tokens | % of Total |
|----------|-------|-------:|----------:|
| SVG assets | `public/*.svg` (5 files) | 2,531 | 26.7% |
| Boilerplate docs | `README.md` | 360 | 3.8% |
| VCS / tooling config | `.gitignore`, `.claude/**` | 250 | 2.6% |
| Dev workflow docs | `docs/workflow.md` | 1,269 | 13.4% |
| **Total excludable** | | **4,410** | **46.5%** |

### Optimization Strategies

Three levels of optimization were tested (same codebase):

| Strategy | Tokens | vs. Baseline | Input cost/call |
|----------|-------:|-------------:|----------------:|
| Baseline (no config) | 9,476 | — | $0.0000284 |
| Exclude noise files | 4,947 | −47.8% | $0.0000148 |
| Exclude + `--compress` | 2,368 | −75.0% | $0.0000071 |

**Exclude noise files** — add to `.repomixignore` or `repomix.config.json`:
```
public/*.svg
README.md
.gitignore
.claude/**
docs/**
```

**Compress** — strips whitespace and minifies code structure. Reduces source code tokens dramatically (e.g. `app/page.tsx`: 744 → 14 tokens) but leaves markdown untouched. Best for tasks where exact formatting is irrelevant.

### Cost Savings at Scale

Based on medium output (1,000 tokens/call):

| Calls | Baseline total | Exclusions total | Excl. + compress total | Max savings |
|------:|-------------:|----------------:|----------------------:|------------:|
| 100 | $0.0043 | $0.0028 | $0.0022 | −49% |
| 1,000 | $0.043 | $0.028 | $0.022 | −49% |
| 10,000 | $0.43 | $0.28 | $0.22 | −49% |
| 100,000 | $4.34 | $2.78 | $2.21 | −49% |

> Note: at scale, output token cost dominates. For maximum savings, optimize output length or use prompt caching in addition to input reduction.

### Recommendation

For most AI coding tasks on this repo, the recommended config is **exclusions only** (no `--compress`):
- Cuts input tokens by ~48% with zero loss of code readability
- Keeps `AGENTS.md` and source files fully intact for accurate AI reasoning
- Add `--compress` only for high-volume batch pipelines where cost is critical and exact formatting does not matter

---

## Conclusions

1. **This codebase is cheap to use with Claude.** At baseline, sending the full repo as context costs $0.000028 per call in input tokens — roughly $4.34 per 100,000 calls including medium-length responses. At this scale, cost is not a concern for interactive or low-frequency use.

2. **Nearly half the token budget is noise.** SVG files, the boilerplate README, `.gitignore`, and `.claude/` settings together consume 46.5% of tokens (4,410 of 9,476) and provide zero value for code-understanding tasks. They should be excluded by default.

3. **The single highest-impact action is excluding SVGs.** Five SVG files in `public/` account for 2,531 tokens (26.7%) — more than any source code file. They tokenize poorly (SVG markup is verbose) and are never relevant to AI coding tasks.

4. **`--compress` is powerful but lossy.** It cuts source code tokens by up to 98% (`app/page.tsx`: 744 → 14 tokens) but does not compress markdown, leaving `AGENTS.md` and any docs intact. Suitable for pipelines where the model only needs to understand structure, not read exact code.

5. **Output tokens cost 5× more than input.** At $15/M vs $3/M, output is the larger cost driver at scale. Optimizing prompt design to get shorter, more focused responses has more leverage than trimming input tokens once the obvious noise is removed.

6. **Prompt caching is the highest-leverage cost lever.** If the same repomix context is reused across many calls, caching cuts input cost by ~90% per call. Combined with noise exclusion, input cost per call drops from $0.0000284 to under $0.0000005 on cache hits — effectively free.

7. **Three universal optimizations that apply regardless of tool:**

   - **Narrower context.** Don't send the whole repo for every task. Most tasks only need 2–5 files. Sending targeted files instead of a full repomix output cuts input tokens by 80–95% per call. Reserve full-repo context for architecture-level questions only.

   - **Cheaper model for routine tasks.** claude-haiku-4-5 costs ~15× less than claude-sonnet-4-6 on input ($0.80/M vs $3.00/M) and ~20× less on output ($1.00/M vs $15.00/M). Mechanical tasks — formatting, renaming, generating boilerplate, summarizing diffs — do not need Sonnet. Route them to Haiku and reserve Sonnet for reasoning-heavy work.

   - **Shorter, more specific prompts.** Vague prompts produce long, hedged responses with unnecessary explanation. A prompt that specifies the exact output format and scope (e.g. "return only the updated function, no explanation") can cut output tokens by 50–70%. Output tokens cost 5× more than input, so this is the highest-leverage edit to make.
