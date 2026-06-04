// ─── Demo Banner Configuration ────────────────────────────────────────────────
// Platform-agnostic strings — no React/RN imports

export const DEMO_BANNER = {
  message: "🎭 Demo Mode Active — All payments are simulated. No real charges will be made.",
  paymentNote: "Use demo credentials — no real card needed",
  kycNote: "KYC documents are simulated — no real ID required",
  safeguards: [
    "✓ No real payments processed",
    "✓ No real KYC documents needed",
    "✓ AI responses are simulated",
    "✓ Escrow flow fully testable",
  ],
};

export const DEMO_PAYMENT_RESPONSES = {
  paystack: {
    success: {
      status: true,
      message: "Authorization URL created",
      data: {
        authorization_url: "https://checkout.paystack.com/demo_authorization",
        access_code: "demo_access_code",
        reference: `demo_ref_${Date.now()}`,
      },
    },
    verify: {
      status: true,
      data: {
        status: "success",
        amount: 0,
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
    transactionReference: `MNFY|DEMO|${Date.now()}`,
    paymentUrl: "https://sdk.monnify.com/checkout/demo",
  },
};

export const DEMO_KYC_RESPONSES = {
  submit: {
    application_id: `KYC-DEMO-${Date.now().toString(36).toUpperCase()}`,
    status: "submitted",
    ai_risk_score: 87,
    ai_flags: [],
    estimated_review_time: "Demo: auto-approved in 3 seconds",
  },
  aiAnalysis: {
    id_front: { is_authentic: true, confidence: 0.96, ai_flags: [] },
    address_proof: { is_authentic: true, confidence: 0.94, ai_flags: [] },
    cac_certificate: { is_authentic: true, confidence: 0.98, ai_flags: [] },
    bank_statement: { is_authentic: true, confidence: 0.91, ai_flags: [] },
  },
};
