# Agent.md - Test project (/app folder)
This is a document which describes rules for any AI tool which will be used for development for building correct communication and workflow.

# Stack
- Minumum Node.js 20.9
- (app router) React 19
- Minimum TypeScript version: v5.1.0

## Commands
- dev : `npm run dev`
- test:  `npm test`
- build: `npm run build`

## Conventions
- Place shareable, reusable utilities and components in "libraries/" folder, 
  e.g. /libraries/combo-box.
- Place project-specific components in "components/" folder, 
  e.g. /components/game-score-tracker.
- Use type inference where intent is obvious (e.g., const x = 5 infers number).
- Add explicit types for function parameters and public API surfaces.
- Avoid `any` type unless explicitly justified in the comment.

## Guardrails
- do not show all suggestions, write suggestions one by one, and ask show next or not.
- do not use any new public library.
- use program languages which is defined in stack.
- when start answer use 🧠.