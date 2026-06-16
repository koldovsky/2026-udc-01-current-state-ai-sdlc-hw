# Cost and Token Consumption Analysis — Character Counter Feature

Feature under analysis: [`CharacterCounter.tsx`](../app/components/CharacterCounter.tsx) vs. [`CharacterCounter2.tsx`](../app/components/CharacterCounter2.tsx). Same feature, two different prompting styles. Numbers below are measured (via `repomix`), not estimated guesses.

## The two prompts

**Prompt 1 (vague, no constraints):**
> Add a character counter component

**Prompt 2 (structured, with acceptance criteria and output constraints):**
> You are a senior React/Next.js dev working in this repo (see AGENTS.md).
> Context: app/components/, Tailwind only, TS strict, no `any`.
> Task: build a CharacterCounter2 component.
> Acceptance criteria:
> - input field, live count below it
> - turns red if >100 chars
> - "Clear" button resets
> Output: just the component file + one-line import note, no explanation prose.

## 1. Methodology

* **Context measurement tool:** `npx repomix`, scoped to `app/components/` with `--include` filters per file (isolates each component from its siblings in the same directory).
* **Prompt measurement tool:** same `repomix` tokenizer, run against the raw prompt text saved as plain `.txt` files, so prompt tokens and code tokens are counted with the identical tokenizer/methodology.
* **Output artifact:** packed XML blob (file summary + directory structure + XML-wrapped source).
* Repomix reports the token/char count of that blob — i.e. exactly what you'd pay for if you handed this context to a model.

## 2. Measured Token Consumption

📈 Prompt text (input to the model, before any repo context):

| Prompt | Tokens | Chars |
|---|---|---|
| Prompt 1 — "Add a character counter component" | 5 | 33 |
| Prompt 2 — structured w/ acceptance criteria | 87 | 361 |

📈 Generated component (output artifact, packed):

| File | Code tokens | Packed total tokens | Packed chars |
|---|---|---|---|
| `CharacterCounter.tsx` (from Prompt 1) | 686 | 1,084 | 4,492 |
| `CharacterCounter2.tsx` (from Prompt 2) | 500 | 901 | 3,834 |

**Observation:** `CharacterCounter.tsx` (686 code tokens) consumed **~37% more tokens** than `CharacterCounter2.tsx` (500 code tokens). Prompt 1's open-ended phrasing produced a component with extra, unrequested functionality (multi-line textarea, live word count, 280-char limit), while Prompt 2's acceptance criteria scoped the build down to exactly the 3 stated bullets (single-line input, red past 100 chars, Clear button) — nothing more. Repomix's fixed wrapper overhead (`file_summary`, `directory_structure`, XML tags) adds ~398–401 tokens regardless of file size, so it's a *smaller share* of the pack for the bigger file (36.7% for `CharacterCounter.tsx`) than the smaller one (44.5% for `CharacterCounter2.tsx`) — overhead doesn't scale with code size.

## 3. Cost Estimate

* **Chosen model:** Claude Sonnet
* **Pricing:** $3 / 1M input tokens, $15 / 1M output tokens

| | Prompt 1 | Prompt 2 |
|---|---|---|
| Prompt input tokens | 5 | 87 |
| Repo context input tokens (packed) | 1,084 | 901 |
| **Total input tokens** | **1,089** | **988** |
| Output tokens (generated code) | ~686 | ~500 |
| Output tokens (explanatory prose in response)* | unmeasured — no constraint given | ~0 (explicitly suppressed by prompt) |
| **Input cost** | $0.0033 | $0.0030 |
| **Output cost (code only)** | $0.0103 | $0.0075 |
| **Total (code-only) per iteration** | **≈ $0.0136** | **≈ $0.0105** |

\* Prompt 2 also bans explanation prose in the output, an additional (unmeasured) cost lever on top of the code-size gap above — the code itself is *not* equal cost between the two runs: Prompt 1's extra, unrequested functionality is the bigger driver (+$0.0031 vs. the prose suppression, which is upside only on Prompt 2's side).

## 4. Iterations

| | Prompt 1 | Prompt 2 |
|---|---|---|
| Generations to reach an accepted component | not logged for this session — no chat/git history survived for this file, so the true count is unknown | 1 (accepted on first pass, no rework requested) |
| Other rework | — | 1 unrelated restore, after the file was accidentally deleted outside the prompt/response loop (environment issue, not a prompt-quality issue) |

Because Prompt 1's generation history wasn't retained (the directory is untracked in git and no session log exists), its iteration count can't be verified — only the final artifact is available. This is itself a finding: without acceptance criteria baked into the prompt, there's no checkable record of *whether* the first draft was accepted as-is or revised, whereas Prompt 2's explicit criteria make "did it pass?" a yes/no check anyone can re-verify later.

## 5. Quality

Both prompts produced a component that uses Tailwind only, supports `dark:` variants, matches repo conventions, and has a working "Clear" button that disables itself when empty. But the two are **not the same scope**:

| | `CharacterCounter.tsx` (Prompt 1) | `CharacterCounter2.tsx` (Prompt 2) |
|---|---|---|
| Input | multi-line textarea | single-line input |
| Limit | 280 chars | 100 chars |
| Live count | chars **and** words | chars only |
| Over-limit behavior | red border + "N characters over limit" message | red text past 100 chars |

Prompt 1's vague instruction let the model add functionality nobody asked for (word count, a textarea, a higher limit) — none of it wrong, but none of it specified either. Prompt 2's acceptance criteria capped the build at exactly 3 bullets, and that's exactly what shipped: no more, no less.

## 6. Conclusion

The two prompts did **not** cost the same or produce the same code. The vague prompt (Prompt 1) resulted in a component with ~37% more code tokens (686 vs. 500) and a per-iteration cost of ≈$0.0136 vs. ≈$0.0105 — a ~30% premium — driven entirely by unrequested scope (word count, textarea, higher limit), not by quality or correctness. The structured prompt (Prompt 2) was both cheaper and exactly matched to spec, with no extra surface to review, test, or maintain later.

**Takeaway:** acceptance criteria in a prompt don't just buy verifiability (as previously assumed) — they cap scope. Without them, the model can quietly expand the deliverable, and the bill, with features nobody requested. Here, ~80 extra prompt tokens (≈$0.0003) bought a smaller, cheaper, criteria-exact component instead of a larger one with unrequested features bolted on.
