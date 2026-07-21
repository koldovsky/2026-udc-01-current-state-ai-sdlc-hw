import type { Plan } from "./SubscriptionPlans";

type PlanCardProps = {
  plan: Plan;
  onSelect: (plan: Plan) => void;
};

export function PlanCard({ plan, onSelect }: PlanCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(plan)}
      className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition-colors hover:bg-black/[.04] dark:hover:bg-white/[.05] ${
        plan.isBestValue
          ? "border-black dark:border-white"
          : "border-black/[.08] dark:border-white/[.145]"
      }`}
    >
      <span className="flex flex-col gap-1">
        <span className="flex items-center gap-2">
          <span className="font-medium text-black dark:text-zinc-50">
            {plan.name}
          </span>
          {plan.isBestValue && (
            <span className="inline-block rounded-full bg-foreground px-2 py-0.5 text-xs text-background">
              Best Value
            </span>
          )}
        </span>
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          {plan.billingPeriod}
        </span>
      </span>
      <span className="font-semibold text-black dark:text-zinc-50">
        {plan.price}
      </span>
    </button>
  );
}
