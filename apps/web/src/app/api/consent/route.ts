import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const {
      analytics_consent,
      marketing_consent,
      data_sharing_consent,
      essential_consent = true,
      consent_banner_version,
      consent_source = "web",
    } = await req.json();

    // In production, save to consent_records table in Supabase
    // const supabase = createSupabaseServerClient(url, key);
    // await supabase.from("consent_records").upsert({ user_id, ... });

    const consentId = `CONSENT-${Date.now().toString(36).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      consent_id: consentId,
      recorded_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Consent record error:", error);
    return NextResponse.json({ error: "Failed to record consent" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("user_id");

  // Return current consent status for user
  return NextResponse.json({
    user_id: userId,
    analytics_consent: false,
    marketing_consent: false,
    data_sharing_consent: false,
    essential_consent: true,
    last_updated: new Date().toISOString(),
  });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // all, marketing, analytics, data_sharing

  // Withdraw consent
  return NextResponse.json({
    success: true,
    withdrawn_types: type === "all" ? ["analytics", "marketing", "data_sharing"] : [type],
    withdrawn_at: new Date().toISOString(),
  });
}
