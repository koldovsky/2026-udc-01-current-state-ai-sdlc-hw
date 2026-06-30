// Pure validation logic for the sign-up form.
// No React here — these functions are easy to unit-test (Vitest).

// Regex is hoisted to module scope (js-hoist-regexp): not recreated on every call.
// Pragmatic "something@something.domain" pattern, good enough for client-side checks.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_MIN_LENGTH = 8;

export type FormValues = {
  email: string;
  password: string;
};

// null = no error; string = message shown under the field.
export type FormErrors = {
  email: string | null;
  password: string | null;
};

/** Validate the email. Returns an error message or null. */
export function validateEmail(email: string): string | null {
  const value = email.trim();
  if (value.length === 0) return "Email is required";
  if (!EMAIL_RE.test(value)) return "Invalid email";
  return null;
}

/** Validate the password. Returns an error message or null. */
export function validatePassword(password: string): string | null {
  if (password.length === 0) return "Password is required";
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `At least ${PASSWORD_MIN_LENGTH} characters`;
  }
  return null;
}

/** Validate the whole form in a single pass. */
export function validateForm(values: FormValues): FormErrors {
  return {
    email: validateEmail(values.email),
    password: validatePassword(values.password),
  };
}

/** True when the form has no errors. */
export function isFormValid(errors: FormErrors): boolean {
  return errors.email === null && errors.password === null;
}
