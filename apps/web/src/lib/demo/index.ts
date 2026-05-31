/**
 * EKDA Demo Mode — Mock data and bypass configuration for testing
 *
 * Demo mode is enabled when NEXT_PUBLIC_DEMO_MODE=true
 * All API calls return realistic mock data without needing real credentials
 */

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

// ─── Demo User Accounts ────────────────────────────────────────────────────────

export const DEMO_USERS = {
  customer: {
    email: "demo.customer@ekda.io",
    password: "Demo@12345",
    role: "customer",
    name: "Adaeze Okonkwo",
    country: "GB",
    currency: "NGN",
    kyc: "approved",
    token: "demo-customer-jwt-token",
  },
  vendor: {
    email: "demo.vendor@ekda.io",
    password: "Demo@12345",
    role: "vendor",
    name: "Kingsley Eze",
    business: "Lagos Fresh Exports Ltd",
    country: "NG",
    kyc: "approved",
    token: "demo-vendor-jwt-token",
  },
  carrier: {
    email: "demo.carrier@ekda.io",
    password: "Demo@12345",
    role: "carrier",
    name: "Amara Logistics",
    company: "Amara Freight Services",
    country: "NG",
    kyc: "approved",
    token: "demo-carrier-jwt-token",
  },
  enterprise: {
    email: "demo.enterprise@ekda.io",
    password: "Demo@12345",
    role: "enterprise",
    name: "TechCo Nigeria Ltd",
    country: "NG",
    kyc: "approved",
    token: "demo-enterprise-jwt-token",
  },
  admin: {
    email: "demo.admin@ekda.io",
    password: "Demo@12345",
    role: "admin",
    name: "EKDA Super Admin",
    country: "NG",
    token: "demo-admin-jwt-token",
  },
} as const;

export type DemoUserRole = keyof typeof DEMO_USERS;

// ─── Demo Payment Responses ────────────────────────────────────────────────────

export const DEMO_PAYMENT_RESPONSES = {
  paystack: {
    success: {
      status: true,
      message: "Authorization URL created",
      data: {
        authorization_url: "https://checkout.paystack.com/demo_authorization",
        access_code: "demo_access_code",
        reference: "demo_ref_" + Date.now(),
      },
    },
    verify: {
      status: true,
      data: {
        status: "success",
        amount: 0, // filled dynamically
        reference: "demo_ref",
        paid_at: new Date().toISOString(),
        customer: { email: "demo.customer@ekda.io" },
      },
    },
  },
  stripe: {
    session: {
      id: "cs_test_demo_session",
      url: "https://checkout.stripe.com/pay/cs_test_demo_session",
      payment_status: "unpaid",
    },
  },
  monnify: {
    transactionReference: "MNFY|DEMO|" + Date.now(),
    paymentUrl: "https://sdk.monnify.com/checkout/demo",
  },
};

// ─── Demo Escrow State Machine ─────────────────────────────────────────────────

export interface DemoEscrowState {
  orderId: string;
  totalAmount: number;
  vendorShare: number;
  ekdaCommission: number;
  status: "held" | "partial_released" | "fully_released" | "refunded";
  firstReleaseAmount: number;
  secondReleaseAmount: number;
  firstReleasedAt: string | null;
  secondReleasedAt: string | null;
}

export function createDemoEscrow(orderId: string, total: number): DemoEscrowState {
  const commission = total * 0.10;
  const vendorShare = total - commission;
  return {
    orderId,
    totalAmount: total,
    vendorShare,
    ekdaCommission: commission,
    status: "held",
    firstReleaseAmount: vendorShare * 0.5,
    secondReleaseAmount: vendorShare * 0.5,
    firstReleasedAt: null,
    secondReleasedAt: null,
  };
}

// ─── Demo AI Responses ─────────────────────────────────────────────────────────

export const DEMO_AI_RESPONSES = {
  chat: {
    default: {
      reply: "👋 Welcome to EKDA Demo Mode! I'm your AI trade assistant. I can help you find products, calculate shipping costs, and explain customs requirements.\n\nTry asking: 'Show me dried crayfish' or 'How much to ship 20kg to UK?'",
      suggestions: ["Show dried crayfish", "Calculate UK shipping", "How does escrow work?"],
    },
    crayfish: {
      reply: "🦐 Here are our top dried crayfish options (Demo Mode — using sample data):\n\n• Premium Badagry Crayfish: ₦8,500/kg\n• Sun-dried Variety: ₦7,200/kg\n\nSea freight to UK: ~₦35,000 for 10kg (28 days transit)\nAir freight to UK: ~₦85,000 for 10kg (5 days transit)",
      products: [
        { id: "demo-1", name: "Premium Dried Crayfish", price: 8500, currency: "NGN", unit: "kg", category: "dried_produce" },
      ],
      suggestions: ["Add to cart", "Calculate full cost", "Check HS code"],
    },
  },
  hsCode: {
    crayfish: { suggested_code: "0306.17", description: "Dried shrimps and prawns", confidence: 0.97, restricted_air_cargo: false },
    vehicle: { suggested_code: "8703.23", description: "Motor cars — spark-ignition", confidence: 0.99, restricted_air_cargo: true },
    palm_oil: { suggested_code: "1511.10", description: "Palm oil, crude", confidence: 0.99, restricted_air_cargo: false },
  },
  riskScore: {
    low: { risk_score: 12, risk_level: "low", auto_approved: true, recommendations: [] },
    medium: { risk_score: 45, risk_level: "medium", auto_approved: false, recommendations: ["Verify ID document"] },
    high: { risk_score: 78, risk_level: "high", auto_approved: false, recommendations: ["Manual review required", "Request additional documentation"] },
  },
};

// ─── Demo KYC Flow ─────────────────────────────────────────────────────────────

export const DEMO_KYC_RESPONSES = {
  submit: {
    success: {
      application_id: "KYC-DEMO-" + Date.now().toString(36).toUpperCase(),
      status: "submitted",
      ai_risk_score: 87,
      ai_flags: [],
      estimated_review_time: "Demo: auto-approved in 3 seconds",
    },
  },
  aiAnalysis: {
    id_front: { is_authentic: true, confidence: 0.96, ai_flags: [] },
    address_proof: { is_authentic: true, confidence: 0.94, ai_flags: [] },
    cac_certificate: { is_authentic: true, confidence: 0.98, ai_flags: [] },
    bank_statement: { is_authentic: true, confidence: 0.91, ai_flags: [] },
  },
};

// ─── Demo Mode Guard ───────────────────────────────────────────────────────────

export function isDemoUser(email: string): boolean {
  return email.endsWith("@ekda.io") && email.startsWith("demo.");
}

export function getDemoUserByEmail(email: string) {
  return Object.values(DEMO_USERS).find((u) => u.email === email) ?? null;
}

export function getDemoRedirectPath(role: DemoUserRole): string {
  switch (role) {
    case "admin": return "/dashboard/admin";
    case "vendor": return "/dashboard/vendor";
    case "carrier": return "/dashboard/carrier";
    case "enterprise":
    case "customer": return "/dashboard/customer";
    default: return "/dashboard";
  }
}

// ─── Demo Banner Config ────────────────────────────────────────────────────────

export const DEMO_BANNER = {
  message: "🎭 Demo Mode Active — All payments are simulated. No real charges will be made.",
  paymentNote: "Use demo credentials — no real card needed",
  kycNote: "KYC documents are simulated — no real ID required",
};
