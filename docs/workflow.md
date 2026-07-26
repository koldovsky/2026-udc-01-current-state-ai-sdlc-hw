# Workflow: Subscription Plans Screen

This documents the Plan → Agent workflow used to implement the
Subscription Plans screen (spec:
`docs/subscription-plans-feature-specification.md`).

## Acceptance Criteria

Taken directly from the feature spec:

1. On initial render, the screen displays the subscription description,
   benefits list, three subscription plans, legal information, and links
   to the Privacy Policy and Terms of Service.
2. Selecting any subscription plan immediately simulates a successful
   purchase and switches the UI to the Subscription Active state.
3. The subscribed state displays the selected plan information, a
   success message, subscription management text, and a **Cancel
   Subscription** button.
4. Pressing **Cancel Subscription** returns the user to the initial
   subscription selection screen.
5. The Privacy Policy and Terms of Service links navigate to
   `https://google.com`.
6. The implementation uses React functional components with TypeScript,
   local component state only, without backend integration or external
   state management libraries.

## Plan Mode

1. Read the feature spec and the project's `app/AGENTS.md` (stack,
   conventions, guardrails).
2. Ran an Explore agent against the `app/` project to confirm current
   state: a completely untouched `create-next-app` starter — no
   `components/` folder, no prior features, no test runner, Tailwind-only
   styling, App Router at `app/app/`.
3. Attempted to clarify two open decisions via `AskUserQuestion`
   (screen placement: replace home page vs. new `/subscription` route;
   whether to add a test runner). The user declined the question prompt
   and instead just confirmed the project root (`app/`), so both
   decisions were made directly instead of asked again:
   - **Placement**: replace `app/app/page.tsx` directly — the spec says
     "no routing" and this is the app's only feature, so a separate route
     folder would add structure the spec doesn't call for.
   - **Testing**: no test runner added; verification would be manual via
     `npm run dev`, consistent with `AGENTS.md` noting none exists yet.
4. Ran a Plan agent to design the concrete implementation: component
   breakdown, `Plan` type/data shape, state model, an acceptance-criteria
   → implementation mapping, Tailwind styling approach, and a manual
   verification checklist.
5. Wrote the final plan to a plan file and requested approval via
   `ExitPlanMode`.

## Agent Mode

Once the plan was approved, implementation followed it directly:

1. Created `app/components/PlanCard.tsx` — stateless presentational
   component for one plan button (name, price, billing period, optional
   "Best Value" badge); imports the `Plan` type from
   `app/components/plans.ts`.
2. Created `app/app/SubscriptionPlans.tsx` — the stateful container
   (`"use client"`) co-located with the root route. It imports the `Plan`
   type and the static `PLANS` and `BENEFITS` data from
   `app/components/plans.ts` (rather than defining them inline), and holds
   a single `useState<Plan | null>` driving both which view renders and
   what data the Active view shows, plus both the Selection and Active
   view markup.
3. Rewrote `app/app/page.tsx` to remove the starter boilerplate (Next.js
   logo, Deploy Now / Documentation links) and render
   `<SubscriptionPlans />` inside the existing centered card shell.
4. Verified with `npm run lint` and `npm run build` — both passed with
   no type errors and no new dependencies.
5. Started the dev server and fetched the rendered homepage HTML to
   confirm the initial Selection state included the title, all four
   benefits, all three plans with correct pricing, the "Best Value"
   badge, the legal text, and both links to `https://google.com`.

## Adjustments After Plan Review

- The plan itself was approved as written — no content changes were
  requested during review.
- Two adjustments happened during execution, outside the plan document:
  - A stale `next-server` process was already listening on port 3000
    from an earlier run. Rather than reuse it, it was killed and a fresh
    dev server was started on request, to test against a clean process
    running the current code.
  - Automated browser verification (via a browser-automation skill) was
    offered for the click-through flow (select plan → Active state →
    Cancel → back to Selection) but declined in favor of the user
    checking that interaction manually in the browser themselves.
