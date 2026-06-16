# Cost and Token Consumption Analysis — Even/Odd Checker Feature

Feature under analysis: [`EvenOddChecker.tsx`](../app/components/EvenOddChecker.tsx) (see [workflow.md](workflow.md) for the build process). Numbers below are measured, not estimated guesses.

## 1. Methodology

* **Context measurement tool:** `npx repomix`, scoped to `app/components/` (the directory containing the feature file).
* **Output artifact:** `repomix-output.xml`
* Repomix packs the file into an LLM-ready context blob (file summary + directory structure + XML-wrapped source) and reports the token/char count of that blob — i.e. exactly what you'd pay for if you handed this context to a model.

## 2. Measured Token Consumption (Repomix)

📈 Top file by token count:

| File | Tokens | Chars | % of packed context |
|---|---|---|---|
| `EvenOddChecker.tsx` | 795 | 3,028 | 68.2% |

📊 Pack summary:

| Metric | Value |
|---|---|
| Total files packed | 1 |
| **Total tokens** | **1,165** |
| Total chars | 4,782 |

**Observation:** the gap between the file's own 795 tokens and the packed total of 1,165 tokens (≈370 tokens, ~32% of the pack) is repomix's wrapper overhead — `file_summary`, `directory_structure`, and XML tags — not feature code. That overhead is a roughly fixed cost per repomix run regardless of how small the target file is, which matters when deciding how granular to scope context pulls.

## 3. Cost Estimate

* **Chosen model:** Claude Sonnet
* **Pricing:** $3 / 1M input tokens, $15 / 1M output tokens

**Context-only cost** (just sending the packed file as input):
$$1{,}165 \times \$0.000003 \approx \$0.0035$$

**Realistic single-iteration cost** (packed context as input + a typical ~2,000-token model response to build/modify the component):

| | Tokens | Rate | Cost |
|---|---|---|---|
| Input (repomix pack) | 1,165 | $3/1M | $0.0035 |
| Output (generated code/response) | ~2,000 | $15/1M | $0.0300 |
| **Total per iteration** | | | **≈ $0.0335** |

**Multi-iteration session** (this feature went through a Plan pass and an Act pass — see [workflow.md](workflow.md)): if context is re-sent on each turn without trimming, 3 iterations (plan → build → verify) land around **$0.10** for a feature this small, and grow faster than linearly if full chat history accumulates instead of being narrowed each turn.

## 4. Optimizations

1. **Narrow context to the file, not the workspace.** This measurement used `npx repomix` scoped to a single component directory (1,165 packed tokens) instead of an editor's `@workspace`-style context injection, which would pull in unrelated config, build artifacts, and other components. Scoping repomix (or any context tool) to just the feature file(s) is what keeps the 795-token component from turning into a multi-thousand-token pull.
2. **Reset/split sessions between phases.** The feature was built across two distinct modes — Plan, then Agent/Act (see [workflow.md](workflow.md)). Starting a fresh session per phase, rather than carrying the full prior chat history into the next prompt, avoids re-paying input-token cost for context the model already used and discarded.
3. **Tier the model to task complexity.** `EvenOddChecker.tsx` is a single `useState` hook, one regex validator, and Tailwind markup — no business logic of consequence. Routine, low-complexity passes like this (boilerplate JSX, styling tweaks, simple validation) are good candidates for a cheaper/faster model, reserving a frontier model like Sonnet for the parts that need judgment (e.g., the plan review, edge-case validation logic).
