"use client";

import { useState } from "react";
import { PlanCard } from "./PlanCard";
import { BENEFITS, PLANS, type Plan } from "./plans";

export function SubscriptionPlans() {
  const [activePlan, setActivePlan] = useState<Plan | null>(null);

  if (activePlan) {
    return (
      <div className="flex w-full flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
            You&apos;re Premium!
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            {activePlan.activeDescription}
          </p>
        </div>

        <dl className="flex flex-col gap-2 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-zinc-600 dark:text-zinc-400">Plan</dt>
            <dd className="font-medium text-black dark:text-zinc-50">
              {activePlan.name}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-sm text-zinc-600 dark:text-zinc-400">Price</dt>
            <dd className="font-medium text-black dark:text-zinc-50">
              {activePlan.price}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-sm text-zinc-600 dark:text-zinc-400">
              Billing period
            </dt>
            <dd className="font-medium text-black dark:text-zinc-50">
              {activePlan.billingPeriod}
            </dd>
          </div>
        </dl>

        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          You can cancel your subscription at any time. Your Premium access will
          remain available until the end of the current billing period.
        </p>

        <button
          type="button"
          onClick={() => setActivePlan(null)}
          className="rounded-full border border-black/[.08] px-5 py-3 text-center font-medium text-black transition-colors hover:bg-black/[.04] dark:border-white/[.145] dark:text-zinc-50 dark:hover:bg-[#1a1a1a]"
        >
          Cancel Subscription
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Upgrade to Premium
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Unlock premium features and enjoy the best experience with Premium.
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {BENEFITS.map((benefit) => (
          <li
            key={benefit}
            className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300"
          >
            <span aria-hidden>✓</span>
            {benefit}
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} onSelect={setActivePlan} />
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          Payment will be charged to your account upon confirmation of purchase.
          Your subscription automatically renews unless canceled at least 24
          hours before the end of the current billing period. You can manage or
          cancel your subscription at any time in your account settings.
        </p>
        <div className="flex gap-4 text-xs">
          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-950 dark:text-zinc-50"
          >
            Privacy Policy
          </a>
          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-950 dark:text-zinc-50"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </div>
  );
}
