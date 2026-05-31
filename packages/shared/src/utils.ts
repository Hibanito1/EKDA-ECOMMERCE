import type { SupportedCurrency, Product, CargoType } from "./types";
import { CURRENCY_SYMBOLS, EKDA_COMMISSION_RATE } from "./constants";

// ─── Currency Formatting ──────────────────────────────────────────────────────

export function formatCurrency(
  amount: number,
  currency: SupportedCurrency = "NGN"
): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formatted = new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${symbol}${formatted}`;
}

export function formatCompactCurrency(
  amount: number,
  currency: SupportedCurrency = "NGN"
): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  if (amount >= 1_000_000) {
    return `${symbol}${(amount / 1_000_000).toFixed(1)}M`;
  }
  if (amount >= 1_000) {
    return `${symbol}${(amount / 1_000).toFixed(1)}K`;
  }
  return `${symbol}${amount.toFixed(2)}`;
}

// ─── Commission Calculator ────────────────────────────────────────────────────

export function calculateOrderBreakdown(subtotal: number, shippingCost: number) {
  const ekdaCommission = subtotal * EKDA_COMMISSION_RATE;
  const total = subtotal + shippingCost + ekdaCommission;
  const vendorReceives = subtotal - ekdaCommission;
  const escrowFirstRelease = vendorReceives * 0.5;
  const escrowSecondRelease = vendorReceives * 0.5;

  return {
    subtotal,
    shippingCost,
    ekdaCommission,
    total,
    vendorReceives,
    escrowFirstRelease,
    escrowSecondRelease,
  };
}

// ─── Cargo Intelligence ───────────────────────────────────────────────────────

export function getCargoRecommendation(product: Product): {
  recommendation: CargoType;
  reason: string;
  isRestricted: boolean;
} {
  const restrictedCategories = ["frozen_produce", "agri_commodities"];
  const isRestricted = restrictedCategories.includes(product.category);

  if (isRestricted) {
    return {
      recommendation: "sea",
      reason:
        "This product category is restricted from air cargo due to agricultural regulations and perishability concerns. Sea freight is strongly recommended.",
      isRestricted: true,
    };
  }

  if (product.weight_kg > 100) {
    return {
      recommendation: "sea",
      reason:
        "Heavy cargo (>100kg) is more cost-effective via sea freight, especially for bulk orders.",
      isRestricted: false,
    };
  }

  if (product.weight_kg < 5 && product.price > 500) {
    return {
      recommendation: "air",
      reason:
        "Light, high-value items are ideal for air freight ensuring fast, secure delivery.",
      isRestricted: false,
    };
  }

  return {
    recommendation: "sea",
    reason:
      "Sea freight offers the best value for this product. Air freight is available as an option.",
    isRestricted: false,
  };
}

// ─── Date Formatting ──────────────────────────────────────────────────────────

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getRelativeTime(date: string | Date): string {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diff = new Date(date).getTime() - Date.now();
  const seconds = Math.round(diff / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (Math.abs(seconds) < 60) return rtf.format(seconds, "second");
  if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
  if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
  return rtf.format(days, "day");
}

// ─── String Utilities ─────────────────────────────────────────────────────────

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateOrderNumber(): string {
  const prefix = "EKDA";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidNigerianPhone(phone: string): boolean {
  return /^(\+?234|0)[789]\d{9}$/.test(phone.replace(/\s/g, ""));
}

export function isValidHSCode(code: string): boolean {
  return /^\d{6,10}$/.test(code.replace(/\./g, ""));
}

// ─── HS Code Formatting ───────────────────────────────────────────────────────

export function formatHSCode(code: string): string {
  const digits = code.replace(/\D/g, "");
  if (digits.length >= 6) {
    return `${digits.slice(0, 4)}.${digits.slice(4, 6)}${
      digits.length > 6 ? `.${digits.slice(6)}` : ""
    }`;
  }
  return code;
}
