# Task 3 — Cost analysis

Real Claude Code usage numbers from the IDE usage panel, snapshotted after
each step. Cumulative totals per model (input / output / cache-read /
cache-write / $) are pasted verbatim from `usage.txt`; deltas are computed
below.

## Cumulative snapshots

| Checkpoint                       | Model       | Input | Output | Cache read | Cache write | $       |
| -------------------------------- | ----------- | ----- | ------ | ---------- | ----------- | ------- |
| post task 1                      | haiku-4-5   | 459   | 15     | 0          | 0           | 0.0005  |
| post task 1                      | opus-4-7    | 540   | 6.5k   | 648.0k     | 37.4k       | 0.72    |
| post task 2                      | haiku-4-5   | 1.1k  | 1.5k   | 70.3k      | 13.7k       | 0.0329  |
| post task 2                      | opus-4-7    | 572   | 27.1k  | 2.1m       | 69.2k       | 2.16    |
| task 3 p1 (sonnet: drag-pan)     | haiku-4-5   | 1.5k  | 1.6k   | 70.3k      | 13.7k       | 0.0335  |
| task 3 p1 (sonnet: drag-pan)     | opus-4-7    | 572   | 27.1k  | 2.1m       | 69.2k       | 2.16    |
| task 3 p1 (sonnet: drag-pan)     | sonnet-4-6  | 364   | 5.4k   | 585.4k     | 24.4k       | 0.3497  |
| task 3 p2 (opus: scroll-zoom)    | haiku-4-5   | 2.0k  | 1.6k   | 70.3k      | 13.7k       | 0.0340  |
| task 3 p2 (opus: scroll-zoom)    | opus-4-7    | 598   | 31.6k  | 2.7m       | 91.4k       | 2.73    |
| task 3 p2 (opus: scroll-zoom)    | sonnet-4-6  | 364   | 5.4k   | 585.4k     | 24.4k       | 0.3497  |

## Per-task spend (deltas)

| Task                                | Model used  | Output tokens | Cache read Δ | Cache write Δ | $ Δ    |
| ----------------------------------- | ----------- | ------------- | ------------ | ------------- | ------ |
| Task 1 — init project + Agent Skill | opus-4-7    | 6.5k          | 648.0k       | 37.4k         | 0.72   |
| Task 2 — first feature (plot/eval)  | opus-4-7    | +20.6k        | +1.45m       | +31.8k        | +1.44  |
| Task 3 p1 — drag-to-pan             | sonnet-4-6  | 5.4k          | 585.4k       | 24.4k         | 0.35   |
| Task 3 p2 — scroll-to-zoom          | opus-4-7    | +4.5k         | +0.6m        | +22.2k        | +0.57  |

Haiku rounds (auto-classifier / cheap helpers) added <$0.001 per step and are
ignored below.

## A/B on equivalent-difficulty features

Task 3 deliberately ran two comparable UX features — drag-to-pan and
scroll-to-zoom — through different models on the same codebase (so cache
warmth and project context were similar).

|                          | sonnet drag-pan | opus scroll-zoom |
| ------------------------ | --------------: | ---------------: |
| Output tokens (assistant)|           5,400 |            4,500 |
| Cache read               |          585.4k |          ~600k   |
| Cache write              |           24.4k |           22.2k  |
| **Cost**                 |       **$0.35** |       **$0.57**  |

Both shipped working features of similar size. **Opus was ~1.6× more
expensive for a slightly smaller change.** That ratio is dominated by Opus's
input/cache-read price (~5× Sonnet), not by output volume.

## Takeaways

1. **Default to Sonnet for "feature-shaped" UI work.** Drag-pan and
   scroll-zoom are equivalent in scope; Sonnet did the first for $0.35,
   Opus did the second for $0.57. The Opus output wasn't visibly better
   for this class of task — confirming the project note in `usage.txt`
   ("sonnet is fine for this type of work"). Keep Opus for tasks where
   reasoning depth actually matters (architectural decisions, gnarly
   debugging, ambiguous specs).

2. **Cache-read is the dominant line item, not output.** In the scroll-zoom
   step the assistant emitted only ~4.5k output tokens but consumed
   ~600k cache-read tokens — at Opus's cache-read rate that one number
   carries most of the bill. Practical lever: narrow context (close
   unrelated files, scope the agent to `app/src/components/`), keep
   sessions short so the prompt cache doesn't reload the whole world
   on every turn, and lean on `@AGENTS.md` instead of re-reading
   `node_modules/next/dist/docs/` on every step.

3. **Avoid agent-initiated heavy infra.** The author's note —
   *"when claude asks to build a playwright container to mess around
   in the browser, tell it to skip"* — is the right reflex. Spinning up
   a browser harness for a 30-line canvas tweak would have added
   several dollars in tool-call rounds (each round = fresh cache-read)
   for zero correctness gain over `tsc --noEmit` + a manual look.
   Rule of thumb: if the verification setup costs more than the
   feature, push back on the verification setup.
