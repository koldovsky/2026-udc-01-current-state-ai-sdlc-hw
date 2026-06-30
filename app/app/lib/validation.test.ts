import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validatePassword,
  validateForm,
  isFormValid,
  PASSWORD_MIN_LENGTH,
} from "./validation";

describe("validateEmail", () => {
  it("accepts a valid email", () => {
    expect(validateEmail("user@example.com")).toBeNull();
  });

  it("trims surrounding whitespace", () => {
    expect(validateEmail("  user@example.com  ")).toBeNull();
  });

  it("requires a non-empty value", () => {
    expect(validateEmail("")).toBe("Email is required");
    expect(validateEmail("   ")).toBe("Email is required");
  });

  it.each(["plainaddress", "no-at-sign.com", "user@", "@example.com", "a@b"])(
    "rejects an invalid email: %s",
    (bad) => {
      expect(validateEmail(bad)).toBe("Invalid email");
    },
  );
});

describe("validatePassword", () => {
  it("accepts a long-enough password", () => {
    expect(validatePassword("a".repeat(PASSWORD_MIN_LENGTH))).toBeNull();
  });

  it("requires a non-empty value", () => {
    expect(validatePassword("")).toBe("Password is required");
    expect(validatePassword("        ")).toBe("Password is required");
  });

  it("rejects a too-short password", () => {
    expect(validatePassword("a".repeat(PASSWORD_MIN_LENGTH - 1))).toBe(
      `At least ${PASSWORD_MIN_LENGTH} characters`,
    );
  });
});

describe("validateForm / isFormValid", () => {
  it("a valid form has no errors", () => {
    const errors = validateForm({
      email: "user@example.com",
      password: "supersecret",
    });
    expect(errors).toEqual({ email: null, password: null });
    expect(isFormValid(errors)).toBe(true);
  });

  it("an invalid form flags both fields", () => {
    const errors = validateForm({ email: "nope", password: "123" });
    expect(errors.email).not.toBeNull();
    expect(errors.password).not.toBeNull();
    expect(isFormValid(errors)).toBe(false);
  });
});
