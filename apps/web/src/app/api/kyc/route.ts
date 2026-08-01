import { NextRequest, NextResponse } from "next/server";
import { integrationUnavailable } from "@/lib/integrations/guards";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, id_number, role } = body;

    if (!full_name || !id_number || !role) {
      return NextResponse.json(
        { error: "Required fields missing: full_name, id_number, role" },
        { status: 400 }
      );
    }

    return integrationUnavailable({
      service: "KYC submission",
      requiredEnv: ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "RESEND_API_KEY or TERMII_API_KEY"],
      developerAction:
        "Persist KYC applications and documents in Supabase, enforce RLS/admin review, run real document checks, write audit logs, and send real notification events.",
    });
  } catch (error) {
    console.error("KYC submission error:", error);
    return NextResponse.json({ error: "KYC submission failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const applicationId = searchParams.get("id");
  const userId = searchParams.get("user_id");

  if (!applicationId && !userId) {
    return NextResponse.json({ error: "application_id or user_id required" }, { status: 400 });
  }

  return integrationUnavailable({
    service: "KYC status lookup",
    requiredEnv: ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
    developerAction:
      "Fetch KYC application status from Supabase for the authenticated user or admin. Do not return synthetic review scores or timestamps.",
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const { application_id, action } = await req.json();

    if (!application_id || !action) {
      return NextResponse.json({ error: "application_id and action required" }, { status: 400 });
    }

    const validActions = ["approve", "reject", "request_more_info"];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: `Invalid action. Must be one of: ${validActions.join(", ")}` }, { status: 400 });
    }

    return integrationUnavailable({
      service: "KYC admin action",
      requiredEnv: ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "RESEND_API_KEY or TERMII_API_KEY"],
      developerAction:
        "Update KYC status in Supabase inside an admin-only transaction, write immutable audit logs, store review notes, and trigger real email/SMS notifications.",
    });
  } catch (error) {
    console.error("KYC admin action error:", error);
    return NextResponse.json({ error: "KYC action failed" }, { status: 500 });
  }
}

