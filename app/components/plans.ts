export type PlanId = "monthly" | "annual" | "lifetime";

export type Plan = {
  id: PlanId;
  name: string;
  price: string;
  billingPeriod: string;
  isBestValue?: boolean;
  activeDescription: string;
};

export const PLANS: Plan[] = [
  {
    id: "monthly",
    name: "Monthly",
    price: "$9.99",
    billingPeriod: "per month",
    activeDescription: "Enjoy full Premium access, billed monthly.",
  },
  {
    id: "annual",
    name: "Annual",
    price: "$79.99",
    billingPeriod: "per year",
    isBestValue: true,
    activeDescription:
      "Enjoy full Premium access at our best price, billed yearly.",
  },
  {
    id: "lifetime",
    name: "Lifetime",
    price: "$199.99",
    billingPeriod: "one-time purchase",
    activeDescription: "Enjoy full Premium access, forever — no more billing.",
  },
];

export const BENEFITS: string[] = [
  "Unlimited access to premium content",
  "Ad-free experience",
  "Priority customer support",
  "Early access to new features",
];
