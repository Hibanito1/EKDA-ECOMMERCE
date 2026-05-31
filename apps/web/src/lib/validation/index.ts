/**
 * EKDA Form Validation Library
 * Shared validation functions used across all forms
 */

export type ValidationResult = { valid: boolean; error?: string };

// ─── Basic Validators ─────────────────────────────────────────────────────────

export function required(value: string | undefined | null, label = "This field"): ValidationResult {
  if (!value || !value.toString().trim()) {
    return { valid: false, error: `${label} is required` };
  }
  return { valid: true };
}

export function email(value: string): ValidationResult {
  if (!value) return { valid: false, error: "Email is required" };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    return { valid: false, error: "Please enter a valid email address" };
  }
  return { valid: true };
}

export function password(value: string): ValidationResult {
  if (!value) return { valid: false, error: "Password is required" };
  if (value.length < 8) return { valid: false, error: "Password must be at least 8 characters" };
  if (!/[A-Z]/.test(value)) return { valid: false, error: "Password must contain at least one uppercase letter" };
  if (!/[0-9]/.test(value)) return { valid: false, error: "Password must contain at least one number" };
  return { valid: true };
}

export function passwordMatch(password: string, confirm: string): ValidationResult {
  if (password !== confirm) return { valid: false, error: "Passwords do not match" };
  return { valid: true };
}

export function phone(value: string): ValidationResult {
  if (!value) return { valid: true }; // Optional by default
  const cleaned = value.replace(/\s/g, "");
  if (!/^[+]?[\d\s\-()]{7,15}$/.test(cleaned)) {
    return { valid: false, error: "Please enter a valid phone number" };
  }
  return { valid: true };
}

export function nigerianPhone(value: string): ValidationResult {
  if (!value) return { valid: true };
  const cleaned = value.replace(/\s/g, "");
  if (!/^(\+?234|0)[789]\d{9}$/.test(cleaned)) {
    return { valid: false, error: "Please enter a valid Nigerian phone number (e.g. +234 801 234 5678)" };
  }
  return { valid: true };
}

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

export function positiveNumber(value: string | number): ValidationResult {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num) || num <= 0) {
    return { valid: false, error: "Must be a positive number" };
  }
  return { valid: true };
}

export function url(value: string): ValidationResult {
  if (!value) return { valid: true };
  try {
    new URL(value.startsWith("http") ? value : `https://${value}`);
    return { valid: true };
  } catch {
    return { valid: false, error: "Please enter a valid URL" };
  }
}

// ─── Business Validators ──────────────────────────────────────────────────────

export function hsCode(value: string): ValidationResult {
  if (!value) return { valid: true };
  const digits = value.replace(/\./g, "");
  if (!/^\d{6,10}$/.test(digits)) {
    return { valid: false, error: "HS code must be 6-10 digits (e.g. 0306.17)" };
  }
  return { valid: true };
}

export function orderQuantity(value: number, min: number, max?: number): ValidationResult {
  if (value < min) {
    return { valid: false, error: `Minimum order quantity is ${min}` };
  }
  if (max !== undefined && value > max) {
    return { valid: false, error: `Maximum order quantity is ${max}` };
  }
  return { valid: true };
}

export function bankAccountNumber(value: string): ValidationResult {
  if (!value) return { valid: false, error: "Account number is required" };
  const cleaned = value.replace(/\s/g, "");
  if (cleaned.length < 8 || cleaned.length > 25) {
    return { valid: false, error: "Please enter a valid account number (8-25 digits)" };
  }
  return { valid: true };
}

export function cacNumber(value: string): ValidationResult {
  if (!value) return { valid: true };
  if (!/^RC\d{6,8}$/i.test(value.trim())) {
    return { valid: false, error: "CAC number format: RC followed by 6-8 digits (e.g. RC1234567)" };
  }
  return { valid: true };
}

// ─── Composite Form Validators ────────────────────────────────────────────────

export interface LoginFormData {
  email: string;
  password: string;
}

export function validateLogin(data: LoginFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  const emailResult = email(data.email);
  if (!emailResult.valid) errors.email = emailResult.error!;
  if (!data.password) errors.password = "Password is required";
  return errors;
}

export interface RegisterFormData {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
  role: string;
}

export function validateRegister(data: RegisterFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  const nameResult = required(data.full_name, "Full name");
  if (!nameResult.valid) errors.full_name = nameResult.error!;
  const emailResult = email(data.email);
  if (!emailResult.valid) errors.email = emailResult.error!;
  const passwordResult = password(data.password);
  if (!passwordResult.valid) errors.password = passwordResult.error!;
  if (!data.role) errors.role = "Please select a role";
  return errors;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock_quantity: number;
  weight_kg: number;
  min_order_quantity: number;
}

export function validateProduct(data: ProductFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.name?.trim()) errors.name = "Product name is required";
  if (!data.description?.trim() || data.description.length < 20) errors.description = "Description must be at least 20 characters";
  const priceResult = positiveNumber(data.price);
  if (!priceResult.valid) errors.price = priceResult.error!;
  if (!data.category) errors.category = "Please select a category";
  const stockResult = positiveNumber(data.stock_quantity);
  if (!stockResult.valid) errors.stock_quantity = stockResult.error!;
  const weightResult = positiveNumber(data.weight_kg);
  if (!weightResult.valid) errors.weight_kg = weightResult.error!;
  return errors;
}

// ─── ARIA Helpers ─────────────────────────────────────────────────────────────

export function getAriaDescribedBy(fieldId: string, hasError: boolean, hasHint: boolean): string | undefined {
  const ids: string[] = [];
  if (hasError) ids.push(`${fieldId}-error`);
  if (hasHint) ids.push(`${fieldId}-hint`);
  return ids.length > 0 ? ids.join(" ") : undefined;
}

export function getInputAriaProps(fieldId: string, error?: string, hint?: string) {
  return {
    id: fieldId,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": getAriaDescribedBy(fieldId, !!error, !!hint),
    "aria-required": true as const,
  };
}
