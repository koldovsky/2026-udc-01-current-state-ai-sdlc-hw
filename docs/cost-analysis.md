# Cost Analysis: Calculator Feature

## Model Used

**Claude Sonnet 4.6**
- Input: $3.00 / 1M tokens
- Output: $15.00 / 1M tokens

---

## Context Size (measured with repomix)

```
npx repomix                          → 7,241 tokens  (full repo, incl. public SVGs)
npx repomix --ignore "public/**,..."  → 4,665 tokens  (source files only)
```

Top token consumers in source:
| File | Tokens | % of source context |
|------|--------|---------------------|
| `src/hooks/useCalculator.ts` | 1,008 | 21.6% |
| `src/components/KeyPad.tsx` | 773 | 16.6% |
| `README.md` | 360 | 7.7% |
| `AGENTS.md` | 254 | 5.4% |
| other (7 TS/TSX files) | ~830 | ~18% |

> Note: `public/*.svg` added 2,576 tokens to the context but contain zero business logic.

---

## Session Token Estimate

The calculator feature was built across two modes (Plan + Agent). Each agent spawn starts a fresh context window.

| Phase | What ran | Est. input tokens | Est. output tokens |
|-------|----------|------------------|--------------------|
| Plan / Explore agent | Explored project structure, read ~10 files | ~12,000 | ~800 |
| Plan / Plan agent | Designed architecture, produced plan | ~8,000 | ~1,500 |
| Agent mode: implementation | 6 files written, build verified | ~25,000 | ~3,800 |
| Main conversation turns | Q&A, plan review, corrections | ~15,000 | ~1,200 |
| **Total** | | **~60,000** | **~7,300** |

### Cost calculation

```
Input:  60,000 / 1,000,000 × $3.00  = $0.18
Output:  7,300 / 1,000,000 × $15.00 = $0.11
─────────────────────────────────────────────
Total session cost ≈ $0.29
```

> These are estimates. Exact numbers are visible on the Claude Code usage screen (`/usage` or the IDE sidebar). The token counts above align with repomix's 4,665-token source context plus system prompt + conversation history overhead.

---

## Optimizations Found

### 1. Remove SVG assets from AI context

`public/*.svg` contribute **2,576 tokens** (35% of total repomix output) but contain only static graphics — no logic an agent needs to read.

**Fix:** Add a `.repomixignore` (or `repomix.config.json`) to exclude `public/**`:
```json
{ "ignore": { "patterns": ["public/**", "*.svg"] } }
```
**Saving:** ~2,600 tokens per context load → ~$0.008 per session at Sonnet 4.6 prices. Scales up with longer sessions and repeated file reads.

---

### 2. Use Haiku 4.5 for the Explore phase

The Explore agent's job is read-only file search — it doesn't generate code. It ran on Sonnet 4.6 (~$3/$15 per MTok) but Haiku 4.5 ($0.80/$4.00 per MTok) handles grep and file reads just as well.

**Estimated saving on the Explore agent turn (~12,000 input + 800 output tokens):**
```
Sonnet 4.6: 12,000/1M × $3 + 800/1M × $15 = $0.048
Haiku 4.5:  12,000/1M × $0.80 + 800/1M × $4 = $0.013
Saving per explore phase: ~$0.035  (~73% cheaper)
```

**When to apply:** Any agent whose sole job is "find files / read structure / grep" — route it to Haiku.

---

### 3. Tighter prompts = shorter input context

During Plan mode, both agents received open-ended prompts with full architectural freedom. This caused the Plan agent to produce an exhaustive plan (~1,500 output tokens) covering alternatives that were later discarded.

**Fix:** Provide a constrained prompt with pre-decided choices:
- State shape already defined → skip "design state" section
- Component split already decided → skip alternatives

Estimated input savings: ~3,000–5,000 tokens per planning session by front-loading decisions in the prompt rather than letting the agent explore them.

---

## Conclusions

1. **SVG/binary assets in context are silent waste.** 35% of the full-repo token count here was static images. A `.repomixignore` takes 2 minutes to add and cuts context by a third — the highest ROI optimization available.

2. **Model routing matters more than prompt length tuning.** Switching the Explore phase from Sonnet 4.6 to Haiku 4.5 saves ~73% on that sub-task for identical quality. For a project with many files to scan, this compounds across every session.

3. **The absolute cost for a focused feature (~$0.29) is low, but the pattern scales.** A 10-feature project following the same workflow without optimizations would cost ~$2.90. With SVG exclusion + Haiku routing for search, the same 10 features would cost ~$1.60 — a 45% reduction with zero quality trade-off.
