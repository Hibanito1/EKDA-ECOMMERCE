import { NextRequest, NextResponse } from "next/server";
import {
  EKDA_COMMISSION_RATE,
  ESCROW_FIRST_RELEASE_RATE,
  ESCROW_SECOND_RELEASE_RATE,
} from "@ekda/shared";

export async function POST(req: NextRequest) {
  try {
    const { action, order_id, carrier_id, confirmed_by } = await req.json();

    if (!action || !order_id) {
      return NextResponse.json(
        { error: "action and order_id are required" },
        { status: 400 }
      );
    }

    // In production, this would update the Supabase database and trigger
    // payment gateway releases via Paystack/Stripe/Monnify APIs

    switch (action) {
      case "create_escrow": {
        const { total_amount, currency = "NGN" } = await req.json().catch(() => ({}));
        const ekda_commission = total_amount * EKDA_COMMISSION_RATE;
        const vendor_share = total_amount - ekda_commission;
        const first_release = vendor_share * ESCROW_FIRST_RELEASE_RATE;
        const second_release = vendor_share * ESCROW_SECOND_RELEASE_RATE;

        return NextResponse.json({
          success: true,
          escrow: {
            order_id,
            total_amount,
            currency,
            ekda_commission,
            vendor_share,
            first_release_amount: first_release,
            second_release_amount: second_release,
            status: "held",
          },
        });
      }

      case "release_pickup": {
        // 50% released when carrier confirms pickup
        if (!carrier_id) {
          return NextResponse.json(
            { error: "carrier_id required for pickup confirmation" },
            { status: 400 }
          );
        }
        return NextResponse.json({
          success: true,
          message: "First escrow release triggered (50% to vendor on carrier pickup)",
          release_stage: "first",
          order_status_updated_to: "picked_up",
          escrow_status_updated_to: "partial_released",
          triggered_at: new Date().toISOString(),
        });
      }

      case "release_destination": {
        // Final 50% released when goods arrive at destination
        return NextResponse.json({
          success: true,
          message: "Final escrow release triggered (50% to vendor on destination arrival)",
          release_stage: "second",
          order_status_updated_to: "arrived_at_port",
          escrow_status_updated_to: "fully_released",
          triggered_at: new Date().toISOString(),
        });
      }

      case "refund": {
        return NextResponse.json({
          success: true,
          message: "Full refund initiated from escrow to customer",
          order_status_updated_to: "refunded",
          escrow_status_updated_to: "refunded",
          triggered_at: new Date().toISOString(),
        });
      }

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

  // Simulated escrow state
  return NextResponse.json({
    escrow: {
      order_id,
      total_amount: 196500,
      currency: "NGN",
      ekda_commission: 16500,
      vendor_share: 180000,
      first_release_amount: 90000,
      second_release_amount: 90000,
      status: "partial_released",
      first_release_at: new Date(Date.now() - 2 * 24 * 3600000).toISOString(),
      second_release_at: null,
    },
  });
}
