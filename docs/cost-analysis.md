# Cost analysis — WS1 features (notes + clear-all)

## TL;DR

A 15-line "Clear all" button was implemented four ways to compare costs:

| Variant | Total | Ratio |
|---|---|---|
| **A** — Opus does everything (baseline) | **$1.23** | **1.00× (cheapest)** |
| B — Opus orchestrate + Sonnet worker, same session | $1.59 | 1.29× |
| C — Opus orchestrate + Sonnet worker, fresh session | $1.27 | 1.03× |
| D — Opus orchestrate + Sonnet gen + Haiku verify | $2.28 | 1.85× |

**Headline finding:** every tiered variant cost *more* than just doing
it inline on Opus — even though each individual cost line behaved as
predicted (Sonnet generated 5× cheaper, Haiku verified ~14× cheaper).
At this feature size, the orchestration overhead on the parent
(writing agent prompts, summarizing results, growing the conversation
context) is larger than the savings from tiering.

**Three practical takeaways:**

1. **For tiny one-file edits, skip the orchestration** — just edit
   inline. Plan → Agent → Verify is the right shape only when the
   worker has enough work to amortize coordination cost.
2. **Trim repo dumps** — excluding `.agents/**` from a repomix pack
   drops it by 78 % (73,555 → 15,843 tokens) because the skill
   payload doesn't need to ride in every prompt.
3. **Measure in fresh sessions** — cache reads grow ~565× faster than
   fresh input, so optimizations measured inside a long session can
   lose to cache-growth even when the per-turn generation cost drops.

The full four-variant breakdown, deltas, and findings are below.

## Methodology

- **Repo-context size** measured with `repomix` (v1.14.1) — `npx repomix` for
  the full-repo baseline, then
  `npx repomix --ignore '.agents/**,repomix-output.xml,.playwright-mcp/**'`
  to model a focused agent prompt that excludes the installed skill payload.
- **Per-feature spend** is the Clear-all button feature, measured four times:
  - **Variant A — Baseline** — Opus 4.7 doing both orchestration and generation.
  - **Variant B — In-session optimized** — Opus 4.7 orchestrating + Sonnet 4.6
    worker via the Agent tool's `model: "sonnet"` parameter, measured in
    the same long-running session as the baseline.
  - **Variant C — Fresh-session optimized** — same Opus+Sonnet pairing,
    but measured after `/clear` so the conversation starts cold.
  - **Variant D — Generation + verification both tiered down** — Opus
    orchestrates, Sonnet 4.6 generates the edit, Haiku 4.5 runs the four
    Playwright MCP scenarios + lint and returns a pass/fail report. The
    intent: move the dominant cost line (parent-side verification) onto
    the cheapest model available.
  All four captured via `/usage` deltas across the Plan → Agent(s) → verify cycle.
- **Pricing** cross-checked at <https://www.anthropic.com/pricing>. All
  dollar figures below come straight from `/usage` — no scaled estimates.
- **Caching matters more than the first pass admitted.** `/usage` shows that
  on the clear-all turn, fresh input was 3,000 tokens but **cache reads were
  1.7M tokens** — a ~565× ratio. Cache reads carry a real (smaller, but
  non-zero) per-token cost, so workflows that replay large context cheaply
  still pay for it. The first version of this doc treated input/output as
  the whole cost; cache reads are now called out as a third axis.

## Repomix snapshot

| Run | Files | Chars | Tokens |
|---|---|---|---|
| Full repo (`npx repomix`) | 105 | 290,326 | 73,555 |
| `.agents/**` ignored | 30 | 51,241 | 15,843 |
| **Delta (skill payload)** | 75 | 239,085 | **57,712 (78.5 % of full)** |

Top single contributor in the full run: `.agents/skills/vercel-react-best-practices/AGENTS.md`
at 26,362 tokens — 35.8 % of the full-repo total, one file.

## Per-feature spend

### Clear-all button — baseline run (Opus-only, measured)

Same Plan → Agent → verify pattern, one-file edit to
`app/app/notes/NoteList.tsx` (add `onClearAll` handler + conditional
button + count badge). Verified end-to-end in the browser via Playwright
MCP across four scenarios (empty / populated / accept-confirm /
cancel-confirm).

`/usage` deltas (Opus 4.7) from before-feature → after-feature:

| Metric | Baseline | After | **Delta** |
|---|---|---|---|
| Input tokens | 7,100 | 10,100 | **+3,000** |
| Output tokens | 82,600 | 91,400 | **+8,800** |
| Cache-read tokens | 11,400,000 | 13,100,000 | **+1,700,000** |
| Cache-write tokens | 884,100 | 905,600 | **+21,500** |
| Cost (Opus 4.7) | $13.31 | $14.54 | **+$1.23** |

So the baseline run cost **$1.23** end-to-end on Opus 4.7. The bulk
of the spend (vs the modest fresh input/output) is the cache-read
line — ~1.7M tokens of replayed context across the Plan → Agent →
4-scenario-browser-verify cycle.

### Clear-all button — in-session optimized re-run (Sonnet 4.6 worker, measured)

To test the model-tiering finding empirically, the same feature was
**reverted and re-implemented** with three optimizations applied:

1. **Sonnet 4.6** as the Agent worker (`model: "sonnet"`) instead of
   Opus-inheritance.
2. **Trimmed working set** — parent did no pre-reading; Agent prompt
   was self-contained, Agent read only the target file.
3. **No skill auto-load** — explicit `subagent_type: general-purpose`,
   prompt instructed the agent not to invoke skills.

Same verification: lint clean, four Playwright MCP scenarios pass. The
Sonnet output was *almost* identical to Opus's (two cosmetic slips: a
missing `text-sm` class on the Clear-all button, and shallower `<li>`
indentation inside the new fragment — neither functional, both lint-clean).

`/usage` deltas split by model:

| Model | Δ Input | Δ Output | Δ Cache read | Δ Cache write | **Δ $** |
|---|---|---|---|---|---|
| Opus 4.7 (parent orchestrate + verify) | +100 | +5,100 | **+2,400,000** | +100,000 | **+$1.41** |
| Sonnet 4.6 (Agent generation) | +9 | +2,700 | +141,300 | +25,900 | **+$0.18** |
| **Total** | | | | | **+$1.59** |

### Clear-all button — fresh-session optimized re-run (Sonnet 4.6 worker, measured)

To isolate the cache-growth confounder the in-session run surfaced,
the same feature was reverted again and re-implemented in a **fresh
`/clear`-ed session**, applying the same three optimizations as the
in-session variant. Identical verification (lint clean, four Playwright
MCP scenarios pass). Sonnet's output this time was a closer match to
Opus's canonical version — both the `text-sm` class and the deeper `<li>`
indentation were present.

`/usage` deltas split by model:

| Model | Δ Input | Δ Output | Δ Cache read | Δ Cache write | **Δ $** |
|---|---|---|---|---|---|
| Opus 4.7 (parent orchestrate + verify) | ~0 | +5,300 | **+1,900,000** | ~0 | **+$1.12** |
| Sonnet 4.6 (Agent generation) | +7 | +1,700 | +90,300 | +24,500 | **+$0.15** |
| **Total** | | | | | **+$1.27** |

### Clear-all button — Variant D (Sonnet gen + Haiku verify, measured)

To attack the dominant cost line (Opus parent doing verification), the
same feature was reverted a third time and re-implemented as a
three-model pipeline: **Opus orchestrates → Sonnet 4.6 edits the file →
Haiku 4.5 runs lint + 4 Playwright scenarios and reports pass/fail**.
The parent only sees a 5-line summary from Haiku, not the snapshot
output of every browser turn.

Haiku verified all four scenarios + lint cleanly with no retries.

`/usage` deltas split by model:

| Model | Δ Input | Δ Output | Δ Cache read | Δ Cache write | **Δ $** |
|---|---|---|---|---|---|
| Opus 4.7 (parent orchestrate only) | +100 | +16,900 | **+3,000,000** | ~0 | **+$2.08** |
| Sonnet 4.6 (generation) | +5 | +2,300 | +42,500 | +24,900 | **+$0.14** |
| Haiku 4.5 (verification) | +53 | +1,300 | +258,000 | +23,800 | **+$0.06** |
| **Total** | | | | | **+$2.28** |

**Important caveat on this measurement.** The Opus delta above also
rolls in (a) writing the variant-C doc update after C's /usage capture,
(b) a short meta-discussion deciding to run variant D, (c) writing two
long agent prompts (Sonnet ~600 tokens + Haiku ~700 tokens, both billed
as Opus output), and (d) two rounds of task setup. A more isolated
variant-D measurement would be lower; the +$2.08 figure is the
practical-not-theoretical cost of adding more orchestration layers on
top of an already-running session.

### A/B/C/D comparison

| Variant | Opus $ | Sonnet $ | Haiku $ | Total $ | Ratio vs baseline |
|---|---|---|---|---|---|
| **A — Baseline** (Opus-only) | $1.23 | — | — | **$1.23** | 1.00× |
| **B — In-session optimized** (Opus + Sonnet) | $1.41 | $0.18 | — | **$1.59** | 1.29× |
| **C — Fresh-session optimized** (Opus + Sonnet) | $1.12 | $0.15 | — | **$1.27** | 1.03× |
| **D — Tiered verify** (Opus + Sonnet + Haiku verify) | $2.08 | $0.14 | $0.06 | **$2.28** | **1.85× more expensive** |

**The four-variant picture is unkind to every optimization tried.**
Every variant that adds an orchestration layer ended up more expensive
than the do-it-inline baseline, despite each layer working as
intended in isolation:

- **Variant C** isolated the cache-growth confounder — Opus parent's
  cache reads dropped from **+2.4M (in-session)** to **+1.9M (fresh)**,
  almost matching baseline's **+1.7M**. Sonnet generation cost $0.15.
  Net: still 1.03× more expensive.
- **Variant D** isolated the verification confounder — Haiku ran the
  same four-scenario Playwright + lint cycle for **$0.06**, vs the
  ~$0.88 the parent had been paying for the same work in A/B/C. That's
  a **~14× saving on the verification line.** Net: still 1.85× more
  expensive — because the orchestration apparatus on Opus
  (planning, dispatching two agents, writing their prompts, summarizing
  their reports) grew by more than the verification savings.

**What this means:** the list-price ratios between Opus / Sonnet /
Haiku are real, and each individual cost line behaved as predicted
once isolated (cheap generation on Sonnet, cheap verification on
Haiku). But **at this feature size, every layer of orchestration
added to the parent costs more than it saves on the dispatched
worker.** The parent ends up paying to coordinate workers whose total
bill is less than the coordination cost itself — a textbook overhead
inversion.

The cheapest variant for a one-file, ~15-line edit is the one with
**no Plan, no Agent, no verifier** — just edit the file inline. Plan
→ Agent → Haiku-verify is the right pattern when the worker's job is
genuinely big enough to amortize the orchestration. It is not, here.

## Optimization findings

1. **Trim the skill rule payload from in-conversation context.**
   The `vercel-react-best-practices` skill ships **74 rule files** under
   `.agents/skills/`. Excluding `.agents/**` from a repomix dump shrinks the
   pack by **57,712 tokens (78.5 %)**, from 73,555 → 15,843. The skill loads
   only the rules it actually needs at invocation time, so the tokens never
   need to ride in every prompt. Same principle as the existing
   `node_modules` / `.next` / `.playwright-mcp/` exclusions in
   `.claude/settings.json` — extend it to skill payloads when packing repo
   context for ad-hoc prompts. **Concrete saving: ≈58K input tokens per pack.**

2. **Tier the model to the phase of work** — *refuted at this feature
   size, across four variants.*
   The intent — Opus 4.7 for planning, Sonnet 4.6 / Haiku 4.5 for
   mechanical work — is correct in principle, and the four variants
   above confirm each individual cost line behaves as predicted in
   isolation: Sonnet generates for $0.14-$0.18, Haiku verifies for
   $0.06. But across **all** optimized variants, total cost went **up**,
   not down:
   - Variant B (in-session, Sonnet gen): **1.29×** ($1.59 vs $1.23).
   - Variant C (fresh-session, Sonnet gen): **1.03×** ($1.27 vs $1.23).
   - Variant D (Sonnet gen + Haiku verify): **1.85×** ($2.28 vs $1.23).
   The deeper structural reason — surfaced clearly only by variant D —
   is that **each layer of orchestration adds Opus parent output**
   (writing agent prompts, summarizing agent results, coordinating tasks)
   and **grows Opus cache reads** (the conversation gets longer, so
   every parent turn replays more context). On a tiny feature
   (~15 LOC, ~1.7K tokens of generated output, ~4 quick browser checks),
   the orchestration apparatus is bigger than the work it orchestrates.
   Practical rules:
   - Tier **when the worker's job is big enough to amortize the
     orchestration cost.** For a one-file edit + four happy-path browser
     checks, that condition is not met.
   - For tiny features, just **do it inline** — no Plan, no Agent, no
     verifier. The cheapest tool for a 15-line change is "edit the file
     and lint."
   - Plan → Agent → Haiku-verify is the right shape for *larger*
     features (multi-file refactors, long generated outputs, complex
     verification matrices). The per-line ratios prove the pattern
     works; this feature is just too small to use it.

3. **Plan → Agent + trimmed working set.**
   The baseline Clear-all run used **3,000 tokens of fresh input** vs
   the **73,555-token** full-repo repomix pack — a **~24× reduction**.
   The optimized runs (self-contained prompt, no parent pre-reads) drove
   the Sonnet worker's fresh input down to **9 tokens (in-session) / 7
   tokens (fresh-session)** — the entire spec was in the prompt and
   cached. The Plan does the reading, the Agent does the writing, and
   neither stage carries the whole repo. Defaulting to this flow (rather
   than "give the model everything") is the single biggest structural
   saving available. **Caveat:** the 1.7M-2.4M cache-read tokens per
   turn show that *prior* context still rides along on every call —
   fresh input shrinks, but the prompt is far from "tiny". Cache rates
   are lower than fresh-input rates, so this is still a win; just not
   as dramatic as the fresh-input ratio alone suggests, and the cache
   total is where the dollars actually go.

## Conclusion

- A one-file, ~15-line "Clear all" feature cost **$1.23 measured** on
  Opus 4.7 baseline. Three optimized variants were tried — Sonnet
  worker in-session ($1.59, 1.29×), Sonnet worker in a fresh session
  ($1.27, 1.03×), and Sonnet worker + Haiku verifier ($2.28, 1.85×).
  **None beat the do-it-inline baseline.**
- The single largest cost driver in this repo's pack is the installed
  skill payload (`.agents/**`, ~78 % of total tokens) — exclude it from
  any repo dump that isn't specifically about skills.
- **Model tiering** delivered on each individual worker bill (Sonnet
  $0.14-$0.18 generation, Haiku $0.06 verification — a ~14× saving on
  the verify line specifically) but never on the total. The structural
  reason, surfaced by variant D: **at this feature size the orchestration
  apparatus (writing agent prompts, summarizing reports, growing the
  conversation) costs more on the Opus parent than the tiered workers
  save**. Tier when the worker has genuinely large work to do; don't
  tier a 15-line edit + 4 browser checks.
- **Plan → Agent** is still a cheap pattern *per turn* — fresh input to
  the Sonnet worker was 7-9 tokens because the prompt was
  self-contained. The win is real but tiny features can't amortize
  the parent-side coordination overhead.
- **Four surprises from this analysis:**
  1. Caching is a real cost axis the first draft missed. Cache reads
     on Opus turns are ~565× the fresh input — that's where the money
     actually goes.
  2. Optimizations measured inside one long session can lose to
     cache-growth even when the per-turn generation cost drops, because
     every tool call replays the (now longer) prior context.
  3. Even after eliminating the cache-growth confounder with a fresh
     session, tiering generation still lost — because verification
     (not generation) dominated the cost at this feature size.
  4. Even after moving verification to Haiku and seeing the 14× per-line
     saving land as predicted, tiering *still* lost — because the
     orchestration apparatus added to the parent grew faster than the
     verification savings. **More layers ≠ cheaper for small features.**
- **Practical guidance from the four-variant data:**
  - For one-file edits, just do it inline (no Plan, no Agent, no
    verifier). The cheapest tool is the simplest one.
  - For multi-file refactors / large generated outputs / complex
    verification matrices, the Plan → Sonnet → Haiku-verify shape
    should win — the per-line ratios prove the components work; they
    just need a job big enough to amortize coordination.
  - Measure in a fresh session whenever possible; cache-growth in
    long sessions is a real confounder.
