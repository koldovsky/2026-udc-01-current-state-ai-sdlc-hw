# Cost Analysis — Robot Catalog App Session

## Usage

| Metric | Value |
|--------|-------|
| Total cost | $1.16 |
| API time | 6m 58s |
| Wall time | 57m 39s |
| Lines added | 798 |
| Lines removed | 63 |

### Breakdown by Model

| Model | Input | Output | Cache read | Cache write | Cost |
|-------|-------|--------|------------|-------------|------|
| claude-haiku-4-5 | 1.3k | 4.4k | 146.5k | 22.3k | $0.07 |
| claude-sonnet-4-6 | 2.5k | 19.4k | 2.0m | 51.3k | $1.10 |

**Sonnet drove 95% of cost.** Cache reads (2.0m tokens) were the dominant input — meaning repeated context (AGENTS.md, open files, system prompt) was served cheaply from cache rather than re-billed at full input rate. Without caching, this session would have cost roughly 6× more.

---

## Cost Optimization

### 1. Reduce Sonnet output with tighter scoping
Output tokens are the most expensive line item ($15/MTok for Sonnet). The `data/robots.ts` mock file alone was ~150 lines of generated content. Providing a skeleton or abbreviated example and asking the model to follow the pattern cuts output significantly on data-heavy files.

### 2. Route simple subtasks to Haiku
Haiku handled plan-phase exploration at $0.07 total. Any task that is read-only or mechanical — file searches, reading existing code, linting checks — can be explicitly delegated to Haiku. Sonnet should only handle code generation and reasoning.

---

## Summary

$1.16 for a complete 3-page Next.js app built from scratch in under an hour. The dominant cost was Sonnet output (generated code). Cache read volume (2.0m tokens) shows the session made heavy reuse of loaded context — the `ignorePatterns` config kept noise out and made that caching effective.
