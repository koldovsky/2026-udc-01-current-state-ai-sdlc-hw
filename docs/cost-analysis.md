# Repomix Context Cost Analysis

Comparison of `repomix-output_old.xml` (baseline) vs `repomix-output.xml` (current).
These snapshots represent the full repo payload sent as AI context on each agentic pass.

---

## At a Glance

| Metric | Old | New | Delta |
|--------|-----|-----|-------|
| Files packed | 109 | 108 | −1 |
| Content chars | 270,632 | 266,654 | −3,978 |
| Lines | 9,741 | 9,659 | −82 |
| Est. tokens (÷4) | ~67,658 | ~66,663 | −995 |
| Cost/pass · Sonnet input @ $3/MTok | $0.2030 | $0.2000 | −$0.003 |

---

## Content by Category

| Category | Old files | Old chars | New files | New chars | Delta |
|----------|----------:|----------:|----------:|----------:|------:|
| (root) | 6 | 9,406 | 6 | 8,840 | −566 |
| .agents | 76 | 230,377 | 76 | 230,377 | 0 |
| .claude | 0 | 0 | 1 | 416 | +416 |
| .github | 1 | 787 | 1 | 787 | 0 |
| app | 24 | 21,867 | 22 | 19,824 | −2,043 |
| docs | 2 | 8,195 | 2 | 6,410 | −1,785 |

The `.agents/` skill library (76 files, 230 KB) is the dominant cost driver and was untouched.

---

## Key Changes

### Files removed (old only)
| File | Chars | Lines |
|------|------:|------:|
| `app/components/FinanceTracker.tsx` | 1,130 | 30 |
| `app/components/SummaryCards.tsx` | 1,096 | 33 |
| `app/components/TransactionForm.tsx` | 4,139 | 126 |
| `app/components/TransactionItem.tsx` | 2,352 | 57 |
| `app/components/TransactionList.tsx` | 723 | 28 |
| `app/hooks/useTransactions.ts` | 1,507 | 62 |
| `app/lib/types.ts` | 400 | 14 |
| `.cursorignore` | 293 | 24 |
| **Total removed** | **11,640** | **374** |

### Files added (new only)
| File | Chars | Lines |
|------|------:|------:|
| `app/app/components/finance-tracker.tsx` | 1,674 | 59 |
| `app/app/components/balance-display.tsx` | 633 | 25 |
| `app/app/components/transaction-form.tsx` | 4,713 | 139 |
| `app/app/components/transaction-list.tsx` | 2,354 | 75 |
| `app/types/transaction.ts` | 161 | 9 |
| `.claude/settings.json` | 416 | 20 |
| `.claudeignore` | 93 | 12 |
| **Total added** | **10,044** | **339** |

### Significantly modified files
| File | Old chars | New chars | Delta |
|------|----------:|----------:|------:|
| `docs/workflow.md` | 3,579 | 1,794 | −1,785 |
| `AGENTS.md` | 1,619 | 1,253 | −366 |
| `app/AGENTS.md` | 2,031 | 1,677 | −354 |
| `app/app/page.tsx` | 122 | 247 | +125 |

---

## Summary

1. **Component refactor shrank the app layer by 2 KB.** Old structure (`app/components/`, `app/hooks/`, `app/lib/`) had 7 files totalling 11,640 chars. New structure (`app/app/components/`, `app/types/`) has 5 files at 7,536 chars — net −4,104 chars, driven by merging the hook into the root component and dropping the `SummaryCards` component.

2. **Docs trimmed nearly half.** `docs/workflow.md` was rewritten, cutting 1,785 chars (50%). `AGENTS.md` and `app/AGENTS.md` were also pruned, together saving 720 chars.

3. **New Claude tooling added a small overhead.** `.claude/settings.json` and `.claudeignore` add 509 chars, but `.cursorignore` (293 chars) was dropped, so the net addition is ~216 chars — negligible.

4. **Overall context reduction: ~1,000 tokens (~1.5%).** At $3/MTok (Sonnet input), each repomix context pass costs ~$0.20 and the refactor saves ~$0.003 per call. At scale (e.g. 1,000 agentic calls/month) this is ~$3/month saved, but the dominant cost remains the `.agents/` skill library at 230 KB (86% of total content).
