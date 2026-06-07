# Task 3 — Token & Cost Analysis

## Project Context Size (repomix)

Run: `npx repomix app --style markdown`

### Top 5 Files by Token Count

| Rank | File | Tokens | Chars | Share |
|------|------|-------:|------:|------:|
| 1 | `components/feedback-form.tsx` | 1,143 | 4,943 | 31.7% |
| 2 | `thank-you/page.tsx` | 424 | 1,571 | 11.8% |
| 3 | `components/rating-question.tsx` | 364 | 1,344 | 10.1% |
| 4 | `api/feedback/route.ts` | 352 | 1,418 | 9.8% |
| 5 | `components/checkbox-question.tsx` | 340 | 1,332 | 9.4% |

### Pack Summary

| Metric | Value |
|--------|-------|
| Total files | 8 |
| Total tokens | 3,604 |
| Total characters | 14,575 |
| Security | ✔ No suspicious files detected |

---

## Claude Usage — First Implementation Session

### Session Overview

| Metric | Value |
|--------|-------|
| Total cost (reported) | **$2.24** |
| API duration | 10m 51s |
| Wall duration | 39m 59s |
| Lines added | 578 |
| Lines removed | 59 |

### Token Usage by Model

| Model | Input | Output | Cache Read | Cache Write |
|-------|------:|-------:|-----------:|------------:|
| `claude-haiku-4-5` | 1,100 | 3,800 | 186,100 | 22,100 |
| `claude-sonnet-4-6` | 3,200 | 32,800 | 4,400,000 | 96,400 |
| **Total** | **4,300** | **36,600** | **4,586,100** | **118,500** |

---

## Actual Cost Calculation

### Pricing Used (June 2026)

| Model | Input | Output | Cache Read | Cache Write (5 min TTL) |
|-------|------:|-------:|-----------:|------------------------:|
| `claude-haiku-4-5` | $1.00 /1M | $5.00 /1M | $0.10 /1M | $1.25 /1M |
| `claude-sonnet-4-6` | $3.00 /1M | $15.00 /1M | $0.30 /1M | $3.75 /1M |

> Cache read = 0.1× base input price. Cache write = 1.25× base input price (5-min TTL).

### Cost Breakdown

#### `claude-haiku-4-5`

| Token Type | Tokens | Rate | Cost |
|------------|-------:|-----:|-----:|
| Input | 1,100 | $1.00 /1M | $0.0011 |
| Output | 3,800 | $5.00 /1M | $0.0190 |
| Cache read | 186,100 | $0.10 /1M | $0.0186 |
| Cache write | 22,100 | $1.25 /1M | $0.0276 |
| **Subtotal** | | | **$0.0663** |

#### `claude-sonnet-4-6`

| Token Type | Tokens | Rate | Cost |
|------------|-------:|-----:|-----:|
| Input | 3,200 | $3.00 /1M | $0.0096 |
| Output | 32,800 | $15.00 /1M | $0.4920 |
| Cache read | 4,400,000 | $0.30 /1M | $1.3200 |
| Cache write | 96,400 | $3.75 /1M | $0.3615 |
| **Subtotal** | | | **$2.1831** |

#### Grand Total

| Model | Cost | Share |
|-------|-----:|------:|
| `claude-haiku-4-5` | $0.07 | 3.0% |
| `claude-sonnet-4-6` | $2.18 | 97.0% |
| **Total** | **$2.25** | 100% |

*Reported: $2.24 — calculated: $2.25 (difference <0.5%, due to rounding in displayed token counts)*

---

## Conclusions

### 1. Prompt caching is the single biggest cost lever

Cache reads alone cost **$1.34** — **59.5%** of total spend. Without caching, those
4.4M Sonnet cache-read tokens would have been billed as regular input:

| Scenario | Cost |
|----------|-----:|
| With caching (actual) | $2.25 |
| Without caching (hypothetical) | ~$14.30 |
| **Savings** | **~$12.05 (~84% cheaper)** |

The tiny project footprint (3,604 tokens, 8 files) meant the entire codebase fit
within a single cache window, producing an exceptional cache-hit ratio of
**~1,067 cached tokens per fresh input token**.

### 2. Sonnet carries 97% of the cost

`claude-sonnet-4-6` did all the substantive code generation ($2.18). `claude-haiku-4-5`
handled lighter orchestration tasks for just $0.07. The model split was appropriate —
Haiku for cheap scaffolding, Sonnet for quality output.

### 3. Output tokens are a small fraction of cost

Despite generating 32,800 output tokens (the actual code), Sonnet's output cost
only **$0.49** — just 22% of its total spend. Cache writes ($0.36) and cache reads
($1.32) dominated. This means optimizing output length has limited ROI here; the
real lever is keeping the prompt prefix stable to maximise cache hits.

### 4. Cost per line of code

| Metric | Value |
|--------|-------|
| Total lines changed | 637 (578 added + 59 removed) |
| Cost per line | **~$0.0035** |
| Wall time per line | ~3.8 seconds |

At ~$0.35 per 100 lines, AI-assisted greenfield development is cost-effective for
this stack size.

### 5. API vs wall time efficiency

API processing took **10m 51s** out of **39m 59s** wall time — meaning only **27%**
of elapsed time was actual inference. The remaining 73% was human review, prompting,
and iteration. Speeding up the human loop (better prompts, clearer requirements
upfront) would reduce wall time far more than optimising model choice.
