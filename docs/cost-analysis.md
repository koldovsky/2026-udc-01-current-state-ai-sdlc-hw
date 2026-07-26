# Cost Analysis: Subscription Plans Feature

Feature measured: the Subscription Plans screen from Task 2 (see
`docs/workflow.md` for the Plan → Agent process, spec in
`docs/subscription-plans-feature-specification.md`).

The same feature was built twice, in two separate Claude Code sessions —
once with Sonnet 4.5, once with Opus 4.8. Each session was split into two
phases (Plan, then Implementation). Claude Code reports *cumulative*
session usage at each checkpoint, so the numbers below account for that.

## Raw usage — Session 1 (Sonnet)

| Phase | Model | Input | Output | Lines +/- | Cost |
|---|---|---|---|---|---|
| Plan | claude-haiku-4-5 | 532 | 12 | — | $0.0006 |
| Plan | claude-sonnet-5 | 4.9k | 26.2k | +132 / -0 | $1.16 |
| Implementation | claude-haiku-4-5 | 1.1k | 25 | — | — |
| Implementation | claude-sonnet-5 | 6.0k | 32.2k | +341 / -58 | $0.63¹ |
| **Total (session)** | | | | **+341 / -58** | **$1.79** |

## Raw usage — Session 2 (Opus)

| Phase | Model | Input | Output | Lines +/- | Cost |
|---|---|---|---|---|---|
| Plan | claude-haiku-4-5 | 533 | 12 | — | $0.0006 |
| Plan | claude-opus-4-8 | 24 | 6.1k | +130 / -8 | $0.63 |
| Implementation | claude-haiku-4-5 | 533 | 12 | — | — |
| Implementation | claude-opus-4-8 | 546 | 10.4k | +336 / -65 | $0.40¹ |
| **Total (session)** | | | | **+336 / -65** | **$1.03** |

¹ Incremental phase cost — the tool shows the *cumulative* session total at
each checkpoint, so the Implementation row is (session total − Plan cost).
Its input/output/line figures are likewise cumulative session totals, not
phase-only deltas.

## Sonnet vs Opus on the same feature

| | Sonnet session | Opus session |
|---|---|---|
| Plan phase cost | $1.16 | $0.63 |
| Implementation phase cost | $0.63 | $0.40 |
| **Total** | **$1.79** | **$1.03** |
| Output tokens (session) | 32.2k | 10.4k |
| Final diff | +341 / -58 | +336 / -65 |

Opus produced a comparably sized diff for **43% less money** ($1.03 vs
$1.79), and the qualitative review was that both the plan and the
implementation were better. The mechanism is visible in the token counts:
Opus emitted ~10.4k output tokens against Sonnet's ~32.2k — about a third
as much. Even at Opus's higher per-token price, needing far fewer tokens
(fewer restatements, fewer correction rounds) more than paid for the
difference.

## Optimizations

1. **Output tokens dominate cost within each phase.** Sonnet's Plan alone
   was 26.2k output tokens vs. 4.9k input. Output is priced several times
   higher than input per token, so shorter, more targeted prompts and
   terser plan/explanation output cut cost directly.
2. **A more expensive model can be the cheaper option.** Price per token is
   not price per task — Opus finished the same feature for $1.03 vs
   Sonnet's $1.79 by needing ~3x fewer output tokens. Judging models on
   list price alone would have picked the more expensive run.
3. **Cache reuse carries a lot of the savings — lean into it.** Opus's
   session read 364k → 821k tokens from cache while writing only ~36k new
   cache tokens. Avoid re-reading large files already in context, and let
   Explore/Plan-style subagents return summaries instead of dumping raw
   file contents into the main thread.
4. **Haiku is essentially unused.** It contributed under $0.002 in either
   session while the frontier model carried the entire bill. Routing
   mechanical, low-judgment steps (running lint/build, transcribing
   checklist items, simple file scaffolding) to a cheaper model would
   reduce real spend.

## Conclusions

- **Opus was both better and cheaper on this task.** $1.03 vs $1.79 for a
  comparable diff (+336/-65 vs +341/-58), with a stronger plan and
  implementation. Cost per *task* is the number that matters, not cost per
  token.
- **Output volume, not prompt size, was the main cost driver.** In both
  sessions output tokens ran several times higher than input tokens, and
  the cheaper session was precisely the one that emitted ~3x less output.
- **Cost accumulates across a session, not per phase in isolation.** In
  both runs the Implementation phase added less than the Plan phase cost
  ($0.63 → +$0.40 for Opus, $1.16 → +$0.63 for Sonnet), because most of
  the context it needed was already in cache by then. Planning up front is
  where the money goes; executing an approved plan is comparatively cheap.
