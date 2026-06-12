# Task 3 — Token & cost analysis

Goal: **measure**, not guess. All token numbers below are real, produced by
`repomix` with the `o200k_base` encoding (the GPT-4o/4.1 tokenizer).

## Measured context size

Command: `npx repomix --token-count-encoding o200k_base`

| Scope | Files | Tokens | Chars |
|---|---:|---:|---:|
| Whole repo (packed context) | 104 | **71 095** | 281 236 |
| Feature source only (`app/src/**`) | 5 | **2 283** | 9 473 |

Top files by token count (whole repo):

| File | Tokens | Share |
|---|---:|---:|
| `.agents/skills/vercel-react-best-practices/AGENTS.md` | 26 362 | 37.1% |
| `.agents/skills/vercel-react-best-practices/SKILL.md` | 1 764 | 2.5% |
| `docs/walkthrough.md` | 1 688 | 2.4% |
| `.coderabbit.yaml` | 1 533 | 2.2% |
| `app/public/next.svg` | 1 195 | 1.7% |

**Key observation:** a single installed-skill file is **37%** of the entire
context, and the actual feature code is only **2 283 tokens (~3.2%)** of the
repo.

## Cost estimate

Method: `tokens × model price`. Model the counter feature as ~6 agent turns.
Compare two context strategies, holding output constant (~6 000 output tokens).

| Strategy | Input tokens/turn | Input total (×6) | + output | Total |
|---|---:|---:|---:|---:|
| **Whole repo each turn** | 71 095 | 426 570 | 6 000 | 432 570 |
| **Narrow (`app/src` + `app/AGENTS.md` ≈ 2 900)** | 2 900 | 17 400 | 6 000 | 23 400 |

Applying list prices (USD per 1M tokens, input / output):

| Model | Price in/out | Whole-repo cost | Narrow cost |
|---|---|---:|---:|
| **Claude Opus 4.8** (model actually used) | ~$15 / ~$75 | **$6.85** | **$0.71** |
| GPT-4.1 | $2.00 / $8.00 | $0.90 | $0.083 |
| GPT-4.1 mini | $0.40 / $1.60 | $0.18 | $0.017 |
| Gemini 2.5 Flash | $0.30 / $2.50 | $0.14 | $0.020 |

> **Tokenizer caveat:** `repomix` counted tokens with `o200k_base` (OpenAI's
> GPT-4o/4.1 tokenizer). For non-OpenAI models (Claude, Gemini) this is an
> **approximation** — their own tokenizers typically differ by ±10–20%, so the
> Claude/Gemini rows are estimates, not exact bills.
>
> Prices are public list prices and approximate; they shift over time. The
> *ratio* is the point: narrowing context made this feature **~9–11× cheaper**
> across models, and dropping from an Opus-tier model to a mini/flash model is
> another **~40–50×** on routine turns.

## Findings (optimizations)

1. **Narrow the context.** The feature lives in 2 283 tokens, but the packed
   repo is 71 095. Feeding `app/src` (via `repomix --include "app/src/**"` or
   an `.cursorignore`-scoped context) instead of the whole repo cuts input by
   **~31×** per turn.
2. **Quarantine the heavy skill file.** `vercel-react-best-practices/AGENTS.md`
   alone is 37% of context. It is useful as a reference but should not ride
   along on every turn — load it only when doing React-architecture work.
3. **Cheaper model for routine.** Use a mini/flash-class model for boilerplate
   and edits (≈5× cheaper input), reserving a frontier model for design and
   tricky debugging.
4. **Shorter iterations via Plan→Agent.** Agreeing the plan first (Task 2)
   avoided rework turns; fewer turns = fewer billed context passes.

## Conclusions

- The dominant cost driver here is **context breadth**, not the feature code:
  trimming context is worth far more than micro-optimizing prompts.
- Matching **model tier to task** (cheap for routine, frontier for hard) plus a
  plan-first flow keeps a small feature cheap. With the Opus-tier model actually
  used, narrowing context dropped this feature from **~$6.85 to ~$0.71**; on a
  mini/flash model the same work is in the **single-cent** range.
