import { NextRequest, NextResponse } from "next/server";
import { integrationUnavailable } from "@/lib/integrations/guards";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  return integrationUnavailable({
    service: "Loyalty account lookup",
    requiredEnv: ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
    developerAction:
      "Fetch loyalty balance, tiers, referrals, and transaction ledger from Supabase for the authenticated user. Do not return hardcoded points.",
  });
}

export async function POST(req: NextRequest) {
  const { user_id, action } = await req.json();

  if (!user_id || !action) {
    return NextResponse.json({ error: "user_id and action are required" }, { status: 400 });
  }

  return integrationUnavailable({
    service: "Loyalty transaction mutation",
    requiredEnv: ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
    developerAction:
      "Implement a transaction-safe loyalty ledger with idempotency keys tied to verified orders, reviews, referrals, and admin adjustments.",
  });
}
