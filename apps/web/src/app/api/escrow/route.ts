import { NextRequest, NextResponse } from "next/server";
import { integrationUnavailable } from "@/lib/integrations/guards";

export async function POST(req: NextRequest) {
  try {
    const { action, order_id, carrier_id, confirmed_by } = await req.json();

    if (!action || !order_id) {
      return NextResponse.json(
        { error: "action and order_id are required" },
        { status: 400 }
      );
    }

    switch (action) {
      case "create_escrow":
        return integrationUnavailable({
          service: "Escrow account creation",
          requiredEnv: ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
          developerAction:
            "Persist escrow records in Supabase inside the order transaction after verified payment. Compute vendor share and commission from stored order items, not client input.",
        });

      case "release_pickup":
        if (!carrier_id) {
          return NextResponse.json(
            { error: "carrier_id required for pickup confirmation" },
            { status: 400 }
          );
        }
        return integrationUnavailable({
          service: "First escrow release",
          requiredEnv: ["SUPABASE_SERVICE_ROLE_KEY", "PAYSTACK_SECRET_KEY or STRIPE_SECRET_KEY or MONNIFY_API_KEY"],
          developerAction:
            "Verify carrier pickup evidence, update order and escrow milestones in a database transaction, and call the real payout/transfer provider before marking funds released.",
        });

      case "release_destination":
        return integrationUnavailable({
          service: "Final escrow release",
          requiredEnv: ["SUPABASE_SERVICE_ROLE_KEY", "PAYSTACK_SECRET_KEY or STRIPE_SECRET_KEY or MONNIFY_API_KEY"],
          developerAction:
            "Verify destination-arrival evidence, resolve disputes/holds, update escrow in Supabase, and execute the final provider payout before changing order status.",
        });

      case "refund":
        return integrationUnavailable({
          service: "Escrow refund",
          requiredEnv: ["SUPABASE_SERVICE_ROLE_KEY", "PAYSTACK_SECRET_KEY or STRIPE_SECRET_KEY or MONNIFY_API_KEY"],
          developerAction:
            "Implement dispute/refund authorization, provider refund APIs, audit logs, and idempotency keys before exposing escrow refunds.",
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Escrow API error:", error);
    return NextResponse.json({ error: "Escrow operation failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const order_id = searchParams.get("order_id");

  if (!order_id) {
    return NextResponse.json({ error: "order_id required" }, { status: 400 });
  }

  return integrationUnavailable({
    service: "Escrow status lookup",
    requiredEnv: ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
    developerAction:
      "Fetch escrow state from Supabase by authenticated order ownership or admin role. Do not return hardcoded escrow states.",
  });
}
