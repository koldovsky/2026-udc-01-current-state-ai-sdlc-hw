# Cost Analysis: Subscription Plans Feature

Feature measured: the Subscription Plans screen from Task 2 (see
`docs/workflow.md` for the Plan → Agent process, spec in
`docs/subscription-plans-feature-specification.md`).

This was **one continuous Claude Code session**, split into two phases —
Plan, then Implementation — not two separate sessions. Claude Code reports
*cumulative* session usage at each checkpoint, so the numbers below account
for that.

## Raw usage

| Phase | Model | Input | Output | Lines +/- | Cost |
|---|---|---|---|---|---|
| Plan | claude-haiku-4-5 | 532 | 12 | — | $0.0006 |
| Plan | claude-sonnet-5 | 4.9k | 26.2k | +132 / -0 | $1.16 |
| Implementation | claude-haiku-4-5 | 1.1k | 25 | — | — |
| Implementation | claude-sonnet-5 | 6.0k | 32.2k | +341 / -58 | $0.63¹ |
| **Total (session)** | | | | **+341 / -58** | **$1.79** |

¹ Incremental phase cost: the tool showed $1.79 as the *cumulative* session
total at the end of the Implementation phase (not that phase in isolation).
Since Plan already cost $1.16, Implementation's own share is
$1.79 − $1.16 = **$0.63**. The input/output/line figures in that row are the
cumulative session totals reported at that checkpoint, not phase-only
deltas.

## Cost estimate

The dollar figures above are Claude Code's own metered cost — tokens ×
Anthropic's published per-model price — so no separate manual multiplication
is needed.

One thing worth calling out from the underlying token counts: session cache
read grew from roughly 1.0m tokens (end of Plan) to roughly 2.6m tokens (end
of Implementation) — about 1.6m tokens of already-seen context were served
from cache during Implementation instead of being billed at full input
price. That's a large part of why the Implementation phase, despite
producing more output and a bigger diff (+341/-58 vs +132/-0) than Plan,
only added $0.63 on top of Plan's $1.16 rather than costing as much or more.

## Optimizations

1. **Output tokens dominate cost within each phase.** Plan alone was 26.2k
   output tokens vs. 4.9k input; Implementation's output was even higher.
   Output is priced several times higher than input per token, so shorter,
   more targeted prompts and terser plan/explanation output would cut cost
   directly.
2. **Cache reuse is already doing a lot of the savings — lean into it
   further.** Avoid re-reading large files that are already in context, and
   let Explore/Plan-style subagents return summaries instead of dumping raw
   file contents into the main thread, so less *new* content needs writing
   into cache each turn.
3. **Haiku is essentially unused.** It contributed less than $0.002 total
   across the whole session while Sonnet carried all $1.79. Routing
   mechanical, low-judgment steps (running lint/build, transcribing
   checklist items, simple file scaffolding) to a cheaper model instead of
   Sonnet would reduce real spend.

## Conclusions

- Cost accumulates across the whole session, not per phase in isolation —
  Implementation only added $0.63 on top of Plan's $1.16, largely because
  ~1.6m tokens of context were reused from cache instead of re-billed.
- Output token volume, not prompt/input size, was the main cost driver
  within each phase (output ran 5-6x input token counts in both phases).
- Sonnet handled 100% of the $1.79 in billed work with no delegation to a
  cheaper model, even though some of the work (running checks, formatting)
  was mechanical enough for Haiku.
