import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  return NextResponse.json({
    points: 2450,
    tier: "silver",
    tier_benefits: {
      point_multiplier: 1.5,
      commission_discount: 0,
      shipping_discount: 0.1,
      support_priority: "standard",
    },
    next_tier: {
      name: "gold",
      points_required: 20000,
      points_needed: 17550,
    },
    recent_transactions: [
      { type: "earn", amount: 250, description: "Order EKDA-MK3X2F", date: "2025-06-01" },
      { type: "earn", amount: 150, description: "Review submitted", date: "2025-05-30" },
      { type: "earn", amount: 500, description: "Referral bonus", date: "2025-05-28" },
    ],
    referral_code: "EKDA-AO2024",
    total_referrals: 7,
    earned_from_referrals: 35000,
  });
}

export async function POST(req: NextRequest) {
  const { user_id, action, order_value } = await req.json();

  const POINT_RULES: Record<string, number | ((v: number) => number)> = {
    purchase: (orderValue: number) => Math.floor(orderValue / 100),
    review: 150,
    referral_signup: 1000,
    referral_purchase: 500,
    birthday: 1000,
    profile_complete: 250,
    email_verify: 500,
    app_download: 200,
  };

  const rule = POINT_RULES[action];
  const pointsEarned = typeof rule === "function"
    ? rule(order_value || 0)
    : (rule || 0);

  return NextResponse.json({
    success: true,
    points_earned: pointsEarned,
    action,
    new_balance: 2450 + pointsEarned,
    message: `+${pointsEarned} points earned for ${action}`,
  });
}
