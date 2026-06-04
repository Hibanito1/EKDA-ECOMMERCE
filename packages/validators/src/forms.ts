/**
 * @ekda/validators — Composite form validators
 * Returns a Record<fieldName, errorMessage> for use in both
 * React (web) controlled forms and React Native forms.
 */

import { email, password, required, nigerianPhone } from "./primitives";
import { cacNumber } from "./business";

// ─── Login ────────────────────────────────────────────────────────────────────

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

// ─── Register ─────────────────────────────────────────────────────────────────

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

  if (data.phone) {
    const phoneResult = nigerianPhone(data.phone);
    if (!phoneResult.valid) errors.phone = phoneResult.error!;
  }

  if (!data.role) errors.role = "Please select a role";

  return errors;
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  stock_quantity: number;
  weight_kg: number;
  min_order_quantity?: number;
}

export function validateProduct(data: ProductFormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) errors.name = "Product name is required";
  if ((data.description?.length ?? 0) < 20) {
    errors.description = "Description must be at least 20 characters";
  }
  if (!data.price || data.price <= 0) errors.price = "Price must be a positive number";
  if (!data.category) errors.category = "Please select a category";
  if (!data.stock_quantity || data.stock_quantity <= 0) {
    errors.stock_quantity = "Stock quantity must be a positive number";
  }
  if (!data.weight_kg || data.weight_kg <= 0) {
    errors.weight_kg = "Weight must be a positive number";
  }

  return errors;
}

// ─── KYC Personal Info ────────────────────────────────────────────────────────

export interface KYCPersonalData {
  full_name: string;
  date_of_birth: string;
  nationality: string;
  phone: string;
  email: string;
}

export function validateKYCPersonal(data: KYCPersonalData): Record<string, string> {
  const errors: Record<string, string> = {};

  const nameResult = required(data.full_name, "Full name");
  if (!nameResult.valid) errors.full_name = nameResult.error!;

  if (!data.date_of_birth) errors.date_of_birth = "Date of birth is required";

  if (!data.nationality) errors.nationality = "Nationality is required";

  const emailResult = email(data.email);
  if (!emailResult.valid) errors.email = emailResult.error!;

  if (data.phone) {
    // Allow international numbers
    if (data.phone.replace(/\s/g, "").length < 7) {
      errors.phone = "Please enter a valid phone number";
    }
  }

  return errors;
}

// ─── KYC Business Details ─────────────────────────────────────────────────────

export interface KYCBusinessData {
  business_name: string;
  registration_number?: string;
  description?: string;
}

export function validateKYCBusiness(data: KYCBusinessData): Record<string, string> {
  const errors: Record<string, string> = {};

  const nameResult = required(data.business_name, "Business name");
  if (!nameResult.valid) errors.business_name = nameResult.error!;

  if (data.registration_number) {
    const cacResult = cacNumber(data.registration_number);
    if (!cacResult.valid) errors.registration_number = cacResult.error!;
  }

  return errors;
}

// ─── Helper: has any errors? ──────────────────────────────────────────────────

export function hasErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0;
}
