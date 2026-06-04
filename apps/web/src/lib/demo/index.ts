/**
 * apps/web/src/lib/demo/index.ts
 *
 * Thin re-export of @ekda/demo — keeps all existing imports working
 * while the canonical source of truth is now the shared package.
 *
 * Web-specific additions (browser env flag, payment gateway mocks) are kept here.
 */

// Re-export everything from the shared package
export * from "@ekda/demo";

// ─── Web-specific: environment flag ──────────────────────────────────────────
// process.env.NEXT_PUBLIC_* is inlined by Next.js at build time.
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

// ─── Web-specific: payment simulation redirect URLs ───────────────────────────
export const DEMO_PAYMENT_REDIRECT = {
  paystack_success: "/checkout?demo_payment=success&gateway=paystack",
  stripe_success: "/checkout?demo_payment=success&gateway=stripe",
  monnify_success: "/checkout?demo_payment=success&gateway=monnify",
  cancel: "/checkout?demo_payment=cancelled",
};
