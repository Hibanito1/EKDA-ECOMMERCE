/**
 * EKDA Analytics — PostHog + Sentry Integration
 *
 * In production:
 * - Install: npm install posthog-js @sentry/nextjs
 * - Configure in next.config.js with withSentryConfig
 * - Set NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST env vars
 */

// ─── PostHog Analytics Events ─────────────────────────────────────────────────

type EKDAEvent =
  // User lifecycle
  | "user_signed_up"
  | "user_logged_in"
  | "user_logged_out"
  | "kyc_started"
  | "kyc_step_completed"
  | "kyc_submitted"
  | "kyc_approved"
  | "kyc_rejected"
  // Shopping
  | "product_viewed"
  | "product_added_to_cart"
  | "product_removed_from_cart"
  | "search_performed"
  | "filter_applied"
  | "wishlist_added"
  // Checkout funnel
  | "checkout_started"
  | "checkout_step_completed"
  | "carrier_selected"
  | "payment_method_selected"
  | "order_placed"
  | "checkout_abandoned"
  // Payments
  | "payment_initiated"
  | "payment_completed"
  | "payment_failed"
  | "bnpl_selected"
  | "crypto_payment_initiated"
  | "split_payment_created"
  // Escrow
  | "escrow_created"
  | "escrow_first_release"
  | "escrow_second_release"
  | "escrow_refund"
  | "escrow_disputed"
  // AI Features
  | "ai_chat_message_sent"
  | "ai_hs_code_classified"
  | "ai_document_analyzed"
  | "ai_price_alert_set"
  | "ai_recommendation_clicked"
  | "ai_visual_search_used"
  // Vendor actions
  | "vendor_product_listed"
  | "vendor_order_accepted"
  | "vendor_document_uploaded"
  | "vendor_premium_upgraded"
  // Carrier actions
  | "carrier_bid_submitted"
  | "carrier_pickup_confirmed"
  | "carrier_delivery_confirmed"
  // B2B & Loyalty
  | "rfq_submitted"
  | "loyalty_points_earned"
  | "loyalty_points_redeemed"
  | "referral_code_shared"
  | "subscription_started"
  // Feature usage
  | "landed_cost_calculated"
  | "carbon_offset_added"
  | "hs_code_tool_used"
  | "learning_module_started";

interface AnalyticsProperties {
  [key: string]: string | number | boolean | null | undefined;
}

let posthogInstance: unknown = null;

function getPostHog() {
  if (typeof window === "undefined") return null;
  return posthogInstance;
}

export function initAnalytics() {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

  // In production, initialize PostHog:
  // import posthog from "posthog-js";
  // posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  //   api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
  //   loaded: (ph) => {
  //     if (process.env.NODE_ENV === "development") ph.debug();
  //   },
  //   autocapture: false, // Manual tracking for better control
  //   capture_pageview: true,
  //   session_recording: { maskAllInputs: true }, // Mask for privacy
  // });
  // posthogInstance = posthog;
}

export function track(event: EKDAEvent, properties?: AnalyticsProperties) {
  if (typeof window === "undefined") return;

  // Console log in development for debugging
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${event}`, properties);
    return;
  }

  try {
    // posthog.capture(event, properties);
    // In production, the actual PostHog call goes here
  } catch (err) {
    console.warn("[Analytics] Failed to track event:", event, err);
  }
}

export function identifyUser(userId: string, traits?: AnalyticsProperties) {
  if (typeof window === "undefined") return;
  // posthog.identify(userId, traits);
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] Identify user: ${userId}`, traits);
  }
}

export function pageView(pageName: string, properties?: AnalyticsProperties) {
  track("product_viewed" as EKDAEvent, { page: pageName, ...properties });
}

// ─── Sentry Error Tracking ────────────────────────────────────────────────────

export function captureError(error: Error, context?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  console.error("[Sentry]", error.message, context);

  // In production:
  // Sentry.captureException(error, { extra: context });
}

export function captureMessage(message: string, level: "info" | "warning" | "error" = "info") {
  if (typeof window === "undefined") return;

  console.log(`[Sentry/${level}]`, message);

  // In production:
  // Sentry.captureMessage(message, level);
}

// ─── Pre-built tracking helpers ───────────────────────────────────────────────

export const Analytics = {
  kycStarted: (role: string) =>
    track("kyc_started", { role }),

  kycStepCompleted: (step: string, role: string) =>
    track("kyc_step_completed", { step, role }),

  kycSubmitted: (role: string, documentCount: number) =>
    track("kyc_submitted", { role, document_count: documentCount }),

  orderPlaced: (orderId: string, total: number, currency: string, marketplaceType: string) =>
    track("order_placed", { order_id: orderId, total, currency, marketplace_type: marketplaceType }),

  checkoutAbandoned: (step: string, cartValue: number) =>
    track("checkout_abandoned", { step, cart_value: cartValue }),

  escrowCreated: (orderId: string, amount: number, currency: string) =>
    track("escrow_created", { order_id: orderId, amount, currency }),

  escrowReleased: (orderId: string, stage: "first" | "second", amount: number) =>
    track(stage === "first" ? "escrow_first_release" : "escrow_second_release", {
      order_id: orderId, amount,
    }),

  aiChatMessage: (messageLength: number, hasProductResults: boolean) =>
    track("ai_chat_message_sent", { message_length: messageLength, has_product_results: hasProductResults }),

  hsCodeClassified: (productCategory: string, confidence: number, isRestricted: boolean) =>
    track("ai_hs_code_classified", { category: productCategory, confidence, is_restricted: isRestricted }),

  landedCostCalculated: (cargoType: string, destinationCountry: string, totalCost: number) =>
    track("landed_cost_calculated", { cargo_type: cargoType, destination: destinationCountry, total_cost: totalCost }),

  loyaltyPointsEarned: (action: string, points: number, tier: string) =>
    track("loyalty_points_earned", { action, points, tier }),

  rfqSubmitted: (tier: string, productType: string) =>
    track("rfq_submitted", { tier, product_type: productType }),

  vendorPremiumUpgraded: (planId: string, priceNGN: number) =>
    track("vendor_premium_upgraded", { plan_id: planId, price_ngn: priceNGN }),
};
