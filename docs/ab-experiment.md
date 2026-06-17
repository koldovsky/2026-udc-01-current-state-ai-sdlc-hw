# A/B Experiment — Incremental Prompt Cost

Comparing cumulative session cost **before** and **after** each prompt to isolate the cost of individual feature additions.

---

## Prompt 1 — `/contacts` Route

> **Prompt:** `add new route with contacts`

### Snapshots

| Metric | Before (full app) | After (+ contacts) | Delta |
|--------|------------------|--------------------|-------|
| Total cost | $1.16 | $1.31 | **+$0.15** |
| API time | 6m 58s | 7m 44s | +46s |
| Wall time | 57m 39s | 1h 4m 27s | +6m 48s |
| Lines added | 798 | 911 | +113 |
| Lines removed | 63 | 63 | 0 |

## Model Delta (contacts prompt only)

| Model | Input | Output | Cache read | Cache write | Cost |
|-------|-------|--------|------------|-------------|------|
| claude-haiku-4-5 | — | — | — | — | $0.00 |
| claude-sonnet-4-6 | +0.3k | +2.0k | +0.4m | +2.6k | **+$0.15** |

Haiku was not invoked — it was a straightforward generation task with no planning or exploration phase.

## Takeaway

A single new page (1 file, 113 lines) cost **$0.15** and took **46s of API time**. The 0.4m cache read tokens show that most of the input context (system prompt, AGENTS.md, open files) was served from cache rather than billed at full rate — without caching this prompt would have cost roughly $1.20 in input tokens alone.

---

## Prompt 2 — `/about` Page (NavBar + author page)

> **Prompt:** `add new separate contact page. Place mock contact information on the bottom of page, add short description of author of app in the middle of page. Contacts should be easy to read. Phone, email should be links. Add way to navigate to new contacts page from every other page of application. if there are any questions ask them. old contacts page should be intact. new contacts should have separate route.`

### Snapshots

| Metric | Before | After (+ /about) | Delta |
|--------|--------|-----------------|-------|
| Total cost | $1.31 | $1.70 | **+$0.39** |
| API time | 7m 44s | 9m 30s | +1m 46s |
| Wall time | 1h 4m 27s | 1h 13m 8s | +8m 41s |
| Lines added | 911 | 1072 | +161 |
| Lines removed | 63 | 64 | +1 |

### Model Delta (/about prompt only)

| Model | Input | Output | Cache read | Cache write | Cost |
|-------|-------|--------|------------|-------------|------|
| claude-haiku-4-5 | — | — | — | — | $0.00 |
| claude-sonnet-4-6 | +0.4k | +5.9k | +0.9m | +6.5k | **+$0.39** |

### Why 2.6× more expensive than Prompt 1

| Factor | Contacts route | /about page |
|--------|---------------|-------------|
| Files created/edited | 1 | 3 (NavBar, layout, about page) |
| Output tokens | +2.0k | +5.9k |
| Cache read | +0.4m | +0.9m |
| Clarifying question round | No | Yes (route name) |

The extra cost came from generating a `NavBar` component, editing `layout.tsx`, and writing a more structured page with a `ContactRow` subcomponent — roughly 3× the output of the simple contacts page. The clarifying question also added a round-trip.

---

## Summary

| Prompt | Cost | Lines |
|--------|------|-------|
| Add `/contacts` route | $0.15 | +113 |
| Add `/about` + NavBar | $0.39 | +161 |
| **Total** | **$0.54** | **+274** |

Vague prompt → cheap. Detailed prompt with multiple requirements → 2.6× more. Actual result of first prompt is generic and mostly not usable(no navigation etc.). Second one costs more, but has more predictable result.
