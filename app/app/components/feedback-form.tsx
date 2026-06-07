"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RatingQuestion from "@/app/components/rating-question";
import CheckboxQuestion from "@/app/components/checkbox-question";
import type { FeedbackPayload } from "@/types/feedback";

type FormValues = {
  overallSatisfaction: number | null;
  recommendationScore: number | null;
  featuresUsed: string[];
  userRole: string[];
  prioritizedImprovements: string[];
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const FEATURES = ["Dashboard", "Reports", "Integrations", "Mobile App", "Support"];
const ROLES = ["Developer", "Designer", "Manager", "Marketing", "Other"];
const IMPROVEMENTS = [
  "Performance",
  "Better documentation",
  "More integrations",
  "Mobile experience",
  "Pricing",
];

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.overallSatisfaction === null)
    errors.overallSatisfaction = "Please select a rating.";
  if (values.recommendationScore === null)
    errors.recommendationScore = "Please select a rating.";
  if (values.featuresUsed.length === 0)
    errors.featuresUsed = "Please select at least one option.";
  if (values.userRole.length === 0)
    errors.userRole = "Please select at least one option.";
  if (values.prioritizedImprovements.length === 0)
    errors.prioritizedImprovements = "Please select at least one option.";

  return errors;
}

export default function FeedbackForm() {
  const router = useRouter();

  const [values, setValues] = useState<FormValues>({
    overallSatisfaction: null,
    recommendationScore: null,
    featuresUsed: [],
    userRole: [],
    prioritizedImprovements: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    setSubmitError(null);

    try {
      const payload: FeedbackPayload = {
        overallSatisfaction: values.overallSatisfaction as number,
        recommendationScore: values.recommendationScore as number,
        featuresUsed: values.featuresUsed,
        userRole: values.userRole,
        prioritizedImprovements: values.prioritizedImprovements,
      };

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Submission failed");
      }

      router.push("/thank-you");
    } catch {
      console.error('Feedback submission failed:', err);
      setSubmitError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      <RatingQuestion
        question="1. How satisfied are you with our product overall?"
        value={values.overallSatisfaction}
        onChange={(v) => setValues((prev) => ({ ...prev, overallSatisfaction: v }))}
        error={errors.overallSatisfaction}
      />

      <RatingQuestion
        question="2. How likely are you to recommend us to a friend or colleague?"
        value={values.recommendationScore}
        onChange={(v) => setValues((prev) => ({ ...prev, recommendationScore: v }))}
        error={errors.recommendationScore}
      />

      <CheckboxQuestion
        question="3. Which features do you use most?"
        options={FEATURES}
        value={values.featuresUsed}
        onChange={(v) => setValues((prev) => ({ ...prev, featuresUsed: v }))}
        error={errors.featuresUsed}
      />

      <CheckboxQuestion
        question="4. What best describes your role?"
        options={ROLES}
        value={values.userRole}
        onChange={(v) => setValues((prev) => ({ ...prev, userRole: v }))}
        error={errors.userRole}
      />

      <CheckboxQuestion
        question="5. Which improvements would you prioritize?"
        options={IMPROVEMENTS}
        value={values.prioritizedImprovements}
        onChange={(v) => setValues((prev) => ({ ...prev, prioritizedImprovements: v }))}
        error={errors.prioritizedImprovements}
      />

      {submitError && (
        <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="h-12 w-full rounded-full bg-zinc-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        {submitting ? "Submitting…" : "Submit Feedback"}
      </button>
    </form>
  );
}
