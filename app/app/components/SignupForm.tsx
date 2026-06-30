"use client";

import { useState } from "react";
import {
  validateForm,
  isFormValid,
  type FormValues,
} from "../lib/validation";

const EMPTY: FormValues = { email: "", password: "" };

export default function SignupForm() {
  const [values, setValues] = useState<FormValues>(EMPTY);
  // submitted = whether a submit was attempted; errors stay hidden until then.
  const [submitted, setSubmitted] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  // Errors are derived state: computed during render, not in a useEffect
  // (rerender-derived-state-no-effect). As fields are corrected the errors
  // recompute and disappear on their own.
  const errors = validateForm(values);

  function update(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    setRegisteredEmail(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    if (!isFormValid(errors)) return; // invalid — submission is blocked
    setRegisteredEmail(values.email.trim());
    setValues(EMPTY);
    setSubmitted(false);
  }

  const emailError = submitted ? errors.email : null;
  const passwordError = submitted ? errors.password : null;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-black/[.08] bg-white p-8 dark:border-white/[.145] dark:bg-zinc-950"
    >
      <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
        Sign up
      </h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={emailError ? "email-error" : undefined}
          className="rounded-lg border border-black/[.12] bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-white/[.2]"
          placeholder="you@example.com"
        />
        {emailError ? (
          <p id="email-error" role="alert" className="text-sm text-red-600">
            {emailError}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={values.password}
          onChange={(e) => update("password", e.target.value)}
          aria-invalid={passwordError ? true : undefined}
          aria-describedby={passwordError ? "password-error" : undefined}
          className="rounded-lg border border-black/[.12] bg-transparent px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-white/[.2]"
          placeholder="at least 8 characters"
        />
        {passwordError ? (
          <p id="password-error" role="alert" className="text-sm text-red-600">
            {passwordError}
          </p>
        ) : null}
      </div>

      <button
        type="submit"
        className="h-11 rounded-full bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Create account
      </button>

      {registeredEmail ? (
        <p role="status" className="text-sm text-green-600">
          Done! Account for {registeredEmail} has been created.
        </p>
      ) : null}
    </form>
  );
}
