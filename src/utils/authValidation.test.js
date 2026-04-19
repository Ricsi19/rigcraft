import { describe, expect, it } from "vitest";
import {
  getPasswordErrors,
  isValidEmail,
  validateLoginForm,
  validateRegisterForm
} from "./authValidation";

describe("authValidation", () => {
  it("accepts valid email format", () => {
    expect(isValidEmail("user@example.com")).toBe(true);
  });

  it("rejects invalid email format", () => {
    expect(isValidEmail("userexample.com")).toBe(false);
  });

  it("returns password length error", () => {
    const errors = getPasswordErrors("Ab1!");
    expect(errors[0]).toContain("8 karakter");
  });

  it("returns no password errors for strong password", () => {
    expect(getPasswordErrors("Strong123!")).toHaveLength(0);
  });

  it("validateRegisterForm flags invalid fields", () => {
    const errors = validateRegisterForm({ email: "bad", displayName: "A", password: "short" });
    expect(errors.email).toBeTruthy();
    expect(errors.displayName).toBeTruthy();
    expect(errors.password).toBeTruthy();
  });

  it("validateRegisterForm accepts valid payload", () => {
    const errors = validateRegisterForm({
      email: "richard@example.com",
      displayName: "Richard",
      password: "Strong123!"
    });
    expect(errors).toEqual({});
  });

  it("validateLoginForm rejects short password", () => {
    const errors = validateLoginForm({ email: "user@example.com", password: "short" });
    expect(errors.password).toBeTruthy();
  });

  it("validateLoginForm accepts valid credentials", () => {
    const errors = validateLoginForm({ email: "user@example.com", password: "Password123!" });
    expect(errors).toEqual({});
  });
});
