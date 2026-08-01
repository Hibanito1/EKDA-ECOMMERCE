import { NextRequest, NextResponse } from "next/server";
import { integrationUnavailable } from "@/lib/integrations/guards";

const PAYMENT_INTEGRATIONS = {
  paystack: {
    service: "Paystack payment initialization",
    requiredEnv: ["PAYSTACK_SECRET_KEY", "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY"],
    developerAction:
      "Install and wire the Paystack SDK, create a transaction initialization service, persist the payment attempt, and verify Paystack webhooks before creating escrow records.",
  },
  stripe: {
    service: "Stripe Checkout session initialization",
    requiredEnv: ["STRIPE_SECRET_KEY", "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", "STRIPE_WEBHOOK_SECRET"],
    developerAction:
      "Install and wire Stripe, create Checkout Sessions with real line items, persist session metadata, and verify Stripe webhooks before updating order state.",
  },
  monnify: {
    service: "Monnify checkout initialization",
    requiredEnv: ["MONNIFY_API_KEY", "MONNIFY_CONTRACT_CODE", "MONNIFY_BASE_URL"],
    developerAction:
      "Wire Monnify reserved account/checkout APIs, persist transaction references, and verify Monnify callbacks before releasing order processing.",
  },
} as const;

export async function POST(req: NextRequest) {
  try {
    const { gateway, amount, currency, email, metadata, order_id } =
      await req.json();

    if (!gateway || !amount || !email || !order_id) {
      return NextResponse.json(
        { error: "gateway, amount, email, and order_id are required" },
        { status: 400 }
      );
    }

    const integration = PAYMENT_INTEGRATIONS[gateway as keyof typeof PAYMENT_INTEGRATIONS];

    if (!integration) {
      return NextResponse.json(
        { error: `Unsupported payment gateway: ${gateway}` },
        { status: 400 }
      );
    }

    return integrationUnavailable(integration);
  } catch (error) {
    console.error("Payment API error:", error);
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  const gateway = searchParams.get("gateway");

  if (!reference) {
    return NextResponse.json({ error: "reference required" }, { status: 400 });
  }

  return integrationUnavailable({
    service: `${gateway || "Payment"} verification`,
    requiredEnv: ["PAYSTACK_SECRET_KEY or STRIPE_SECRET_KEY or MONNIFY_API_KEY"],
    developerAction:
      "Implement provider-specific verification and webhook signature validation. Do not trust query-string references without fetching the payment status from the gateway.",
  });
}
