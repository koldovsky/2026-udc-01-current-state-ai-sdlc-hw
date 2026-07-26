# Feature Specification: Subscription Plans Screen

## Overview

Implement a **Subscription Plans** screen that allows users to browse
available subscription plans and simulate purchasing a subscription.

The screen has **two UI states**:

1.  **Subscription Selection** -- displays subscription benefits,
    pricing options, and legal information.
2.  **Subscription Active** -- displayed after the user selects a
    subscription plan and simulates a successful purchase.

No backend integration is required. All state should be managed locally
within the application.

# Functional Requirements

## Initial State -- Subscription Selection

### Header

**Title**

> Upgrade to Premium

**Description**

> Unlock premium features and enjoy the best experience with Premium.

### Benefits

-   Unlimited access to premium content
-   Ad-free experience
-   Priority customer support
-   Early access to new features

### Subscription Plans

Display three vertically stacked subscription buttons:

-   **Monthly** --- \$9.99 / month
-   **Annual** --- \$79.99 / year *(Best Value)*
-   **Lifetime** --- \$199.99 one-time purchase

Each button displays:

-   Plan name
-   Price
-   Billing period

Selecting any plan simulates a successful subscription purchase.

### Legal Information

Display the following text:

> Payment will be charged to your account upon confirmation of purchase.
> Monthly and Annual subscriptions automatically renew unless canceled at
> least 24 hours before the end of the current billing period; the
> Lifetime plan is a one-time purchase and does not renew. You can manage
> or cancel your subscription at any time in your account settings.

Display two links below:

-   Privacy Policy
-   Terms of Service

Both links should navigate to **https://google.com**.

## Subscription Active State

After selecting a subscription plan:

### Success Message

**Title**

> You're Premium!

Display a short description depending on the selected plan.

### Subscription Summary

Display:

-   Selected plan
-   Price
-   Billing period

### Manage Subscription

> You can cancel your subscription at any time. Your Premium access will
> remain available until the end of the current billing period.

### Cancel Subscription

Display a secondary **Cancel Subscription** button.

When pressed:

-   simulate subscription cancellation;
-   return to the initial Subscription Selection state.

No confirmation dialog is required.

# Technical Notes

-   Framework: Next.js
-   React Functional Components
-   TypeScript
-   Local React state (`useState`)
-   No backend
-   No API calls
-   No routing
-   No external state management libraries
-   No UI component libraries

# Acceptance Criteria

1.  On initial render, the screen displays the subscription description,
    benefits list, three subscription plans, legal information, and
    links to the Privacy Policy and Terms of Service.
2.  Selecting any subscription plan immediately simulates a successful
    purchase and switches the UI to the Subscription Active state.
3.  The subscribed state displays the selected plan information, a
    success message, subscription management text, and a **Cancel
    Subscription** button.
4.  Pressing **Cancel Subscription** returns the user to the initial
    subscription selection screen.
5.  The Privacy Policy and Terms of Service links navigate to
    `https://google.com`.
6.  The implementation uses React functional components with TypeScript,
    local component state only, without backend integration or external
    state management libraries.
