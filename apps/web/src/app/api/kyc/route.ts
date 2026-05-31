import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      full_name, date_of_birth, nationality, gender, phone, email,
      id_type, id_number, id_expiry_date,
      business_name, business_type, registration_number, description,
      street_address, city, state, country, postal_code,
      bank_name, account_name, account_number, bank_code, swift_code,
      role,
    } = body;

    if (!full_name || !id_number || !role) {
      return NextResponse.json(
        { error: "Required fields missing: full_name, id_number, role" },
        { status: 400 }
      );
    }

    // In production: save to Supabase kyc_applications table
    // const supabase = createSupabaseServerClient(url, key);
    // const { data, error } = await supabase.from("kyc_applications").insert({...});

    // Simulate AI risk scoring
    let aiRiskScore = 100;
    const aiFlags: string[] = [];

    // Scoring factors
    if (!id_expiry_date) {
      aiRiskScore -= 10;
      aiFlags.push("ID expiry date not provided");
    }
    if (description && description.length < 50) {
      aiRiskScore -= 5;
      aiFlags.push("Business description is brief");
    }
    if (!bank_code && !swift_code) {
      aiRiskScore -= 5;
    }

    const applicationId = `KYC-${Date.now().toString(36).toUpperCase()}`;

    // Log audit entry
    await logAuditEvent({
      action: "kyc_submitted",
      entity_type: "kyc_application",
      metadata: { application_id: applicationId, role },
    });

    return NextResponse.json({
      success: true,
      application_id: applicationId,
      status: "submitted",
      ai_risk_score: aiRiskScore,
      ai_flags: aiFlags,
      estimated_review_time: "24 hours",
      message: "KYC application submitted successfully. You will be notified when reviewed.",
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

  // Mock KYC status response
  return NextResponse.json({
    application_id: applicationId || `KYC-USER-${userId}`,
    status: "pending_admin",
    ai_risk_score: 87,
    ai_authenticity_score: 94,
    ai_flags: [],
    submitted_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    estimated_review_time: "Within 24 hours",
    documents_submitted: 4,
    admin_notes: null,
  });
}

export async function PATCH(req: NextRequest) {
  try {
    const { application_id, action, admin_notes, rejection_reason, more_info_request } = await req.json();

    if (!application_id || !action) {
      return NextResponse.json({ error: "application_id and action required" }, { status: 400 });
    }

    const validActions = ["approve", "reject", "request_more_info"];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: `Invalid action. Must be one of: ${validActions.join(", ")}` }, { status: 400 });
    }

    const statusMap: Record<string, string> = {
      approve: "approved",
      reject: "rejected",
      request_more_info: "more_info_requested",
    };

    const newStatus = statusMap[action]!;

    // In production: update Supabase and trigger notifications
    await logAuditEvent({
      action: `kyc_${action}d` as any,
      entity_type: "kyc_application",
      metadata: { application_id, action, admin_notes },
    });

    return NextResponse.json({
      success: true,
      application_id,
      new_status: newStatus,
      message: `KYC application ${newStatus}. Applicant has been notified via email and SMS.`,
    });
  } catch (error) {
    console.error("KYC admin action error:", error);
    return NextResponse.json({ error: "KYC action failed" }, { status: 500 });
  }
}

async function logAuditEvent(params: {
  action: string;
  entity_type: string;
  metadata: Record<string, unknown>;
}) {
  // In production, insert to audit_logs table
  console.log("[AUDIT]", JSON.stringify(params));
}
