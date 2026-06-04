/**
 * @ekda/validators — Business-domain validators
 * Specific to EKDA's trade, commerce, and compliance rules.
 */

import type { ValidationResult } from "./primitives";
import { positiveNumber } from "./primitives";

// ─── HS Code ──────────────────────────────────────────────────────────────────

export function hsCode(value: string): ValidationResult {
  if (!value) return { valid: true }; // optional
  const digits = value.replace(/\./g, "");
  if (!/^\d{6,10}$/.test(digits)) {
    return { valid: false, error: "HS code must be 6-10 digits (e.g. 0306.17)" };
  }
  return { valid: true };
}

// ─── Order Quantity ───────────────────────────────────────────────────────────

export function orderQuantity(value: number, min: number, max?: number): ValidationResult {
  if (value < min) {
    return { valid: false, error: `Minimum order quantity is ${min}` };
  }
  if (max !== undefined && value > max) {
    return { valid: false, error: `Maximum order quantity is ${max}` };
  }
  return { valid: true };
}

// ─── Bank Account ─────────────────────────────────────────────────────────────

export function bankAccountNumber(value: string): ValidationResult {
  if (!value) return { valid: false, error: "Account number is required" };
  const cleaned = value.replace(/\s/g, "");
  if (cleaned.length < 8 || cleaned.length > 25) {
    return { valid: false, error: "Please enter a valid account number (8-25 digits)" };
  }
  return { valid: true };
}

// ─── CAC Number ──────────────────────────────────────────────────────────────

export function cacNumber(value: string): ValidationResult {
  if (!value) return { valid: true }; // optional
  if (!/^RC\d{6,8}$/i.test(value.trim())) {
    return {
      valid: false,
      error: "CAC number format: RC followed by 6-8 digits (e.g. RC1234567)",
    };
  }
  return { valid: true };
}

// ─── Product price ────────────────────────────────────────────────────────────

export function productPrice(value: string | number): ValidationResult {
  const result = positiveNumber(value);
  if (!result.valid) return { valid: false, error: "Product price must be a positive number" };
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (num < 1) return { valid: false, error: "Price must be at least ₦1" };
  if (num > 1_000_000_000) return { valid: false, error: "Price seems too high — please verify" };
  return { valid: true };
}

// ─── Weight in kg ─────────────────────────────────────────────────────────────

export function weightKg(value: string | number): ValidationResult {
  const result = positiveNumber(value);
  if (!result.valid) return { valid: false, error: "Weight must be a positive number" };
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (num > 100_000) return { valid: false, error: "Weight exceeds maximum shipping limit (100,000 kg)" };
  return { valid: true };
}
