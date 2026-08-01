import { NextRequest, NextResponse } from "next/server";
import { integrationUnavailable } from "@/lib/integrations/guards";

export async function POST(req: NextRequest) {
  try {
    const { vendor_id, product_ids } = await req.json();

    if (!vendor_id || !Array.isArray(product_ids)) {
      return NextResponse.json(
        { error: "vendor_id and product_ids are required" },
        { status: 400 },
      );
    }

    return integrationUnavailable({
      service: "Demand forecasting",
      requiredEnv: ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "GROQ_API_KEY or FORECAST_MODEL_ENDPOINT"],
      developerAction:
        "Train or integrate a real forecasting service using historical orders, inventory, seasonality, market data, and explicit confidence intervals before returning vendor recommendations.",
    });
  } catch (error) {
    console.error("Demand forecast error:", error);
    return NextResponse.json({ error: "Forecast generation failed" }, { status: 500 });
  }
}
