import { NextRequest, NextResponse } from "next/server";
import { integrationUnavailable } from "@/lib/integrations/guards";

export async function POST(req: NextRequest) {
  try {
    await req.json();

    return integrationUnavailable({
      service: "Consent recording",
      requiredEnv: ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
      developerAction:
        "Persist consent records with authenticated user/device context, consent version, source, and immutable audit history in Supabase.",
    });
  } catch (error) {
    console.error("Consent record error:", error);
    return NextResponse.json({ error: "Failed to record consent" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  if (!userId) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  return integrationUnavailable({
    service: "Consent lookup",
    requiredEnv: ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
    developerAction:
      "Read the latest consent state from Supabase for the authenticated user or anonymous device identifier.",
  });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // all, marketing, analytics, data_sharing

  if (!type) {
    return NextResponse.json({ error: "type required" }, { status: 400 });
  }

  return integrationUnavailable({
    service: "Consent withdrawal",
    requiredEnv: ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
    developerAction:
      "Persist consent withdrawal events and recalculate effective consent state from the audit trail.",
  });
}
