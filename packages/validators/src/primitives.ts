/**
 * @ekda/validators — Primitive validators
 * Platform-agnostic: works in Next.js (web), Expo (mobile), Node.js (API)
 * No DOM, React, or React Native imports.
 */

export type ValidationResult = { valid: boolean; error?: string };

// ─── Required ─────────────────────────────────────────────────────────────────

export function required(
  value: string | undefined | null,
  label = "This field"
): ValidationResult {
  if (!value || !value.toString().trim()) {
    return { valid: false, error: `${label} is required` };
  }
  return { valid: true };
}

// ─── Email ────────────────────────────────────────────────────────────────────

export function email(value: string): ValidationResult {
  if (!value) return { valid: false, error: "Email is required" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return { valid: false, error: "Please enter a valid email address" };
  }
  return { valid: true };
}

// ─── Password ─────────────────────────────────────────────────────────────────

export function password(value: string): ValidationResult {
  if (!value) return { valid: false, error: "Password is required" };
  if (value.length < 8) return { valid: false, error: "Password must be at least 8 characters" };
  if (!/[A-Z]/.test(value)) return { valid: false, error: "Password must contain at least one uppercase letter" };
  if (!/[0-9]/.test(value)) return { valid: false, error: "Password must contain at least one number" };
  return { valid: true };
}

export function passwordMatch(pw: string, confirm: string): ValidationResult {
  if (pw !== confirm) return { valid: false, error: "Passwords do not match" };
  return { valid: true };
}

// ─── Phone ────────────────────────────────────────────────────────────────────

export function phone(value: string): ValidationResult {
  if (!value) return { valid: true }; // optional by default
  const cleaned = value.replace(/\s/g, "");
  if (!/^[+]?[\d\s\-()]{7,15}$/.test(cleaned)) {
    return { valid: false, error: "Please enter a valid phone number" };
  }
  return { valid: true };
}

export function nigerianPhone(value: string): ValidationResult {
  if (!value) return { valid: true }; // optional
  const cleaned = value.replace(/\s/g, "");
  if (!/^(\+?234|0)[789]\d{9}$/.test(cleaned)) {
    return {
      valid: false,
      error: "Please enter a valid Nigerian phone number (e.g. +234 801 234 5678)",
    };
  }
  return { valid: true };
}

// ─── Length ───────────────────────────────────────────────────────────────────

export function minLength(value: string, min: number): ValidationResult {
  if (!value || value.length < min) {
    return { valid: false, error: `Must be at least ${min} characters` };
  }
  return { valid: true };
}

export function maxLength(value: string, max: number): ValidationResult {
  if (value && value.length > max) {
    return { valid: false, error: `Must be ${max} characters or less` };
  }
  return { valid: true };
}

// ─── Numbers ──────────────────────────────────────────────────────────────────

export function positiveNumber(value: string | number): ValidationResult {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num) || num <= 0) {
    return { valid: false, error: "Must be a positive number" };
  }
  return { valid: true };
}

// ─── URL ──────────────────────────────────────────────────────────────────────

export function url(value: string): ValidationResult {
  if (!value) return { valid: true };
  try {
    new URL(value.startsWith("http") ? value : `https://${value}`);
    return { valid: true };
  } catch {
    return { valid: false, error: "Please enter a valid URL" };
  }
}
