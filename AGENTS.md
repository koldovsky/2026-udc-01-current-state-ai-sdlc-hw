# AGENTS.md

Baseline guidance for an Agentic IDE working in **this homework repo**.

> UDC Workshop 1 homework — greenfield.

## Context

- This repo starts almost empty on purpose. 

## Conventions

- Documentation language: English.
- Keep generated artifacts in the agreed paths so auto-review can find them:
  - `app/` — the new project
  - `.agents/skills/` — at least one installed Agent Skill (Task 1; e.g.
    `npx skills add github.com/vercel-labs/agent-skills --skill vercel-react-best-practices`)
  - `docs/workflow.md` — Task 2 write-up (modes used, what was adjusted)
  - `docs/cost-analysis.md` — Task 3 (token/cost numbers + findings)
  - `docs/ab-experiment.md` — Task 4 (bonus, prompt A/B)

## Guardrails

- **NEVER** commit secrets, API keys, or `.env` files. They are gitignored —
  keep it that way.
- Keep `node_modules`, builds, and lockfiles out of the AI context
  (`.cursorignore` / equivalent) — this is literally Task 1.
- **Windows + Git Bash:** never use `2>nul` / `>nul` (creates a literal `nul`
  file). Use `2>/dev/null` / `>/dev/null`. `nul` is gitignored as a net.

## How to verify

Before opening a PR: the project starts (`npm run dev`), and the Task files
listed above exist with real content (not placeholders).
