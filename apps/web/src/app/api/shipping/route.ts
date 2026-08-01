import { NextRequest, NextResponse } from "next/server";
import { integrationUnavailable } from "@/lib/integrations/guards";

export async function POST(req: NextRequest) {
  try {
    const { origin_country, destination_country, weight_kg } =
      await req.json();

    if (!origin_country || !destination_country || !weight_kg) {
      return NextResponse.json(
        { error: "origin_country, destination_country, and weight_kg are required" },
        { status: 400 },
      );
    }

    return integrationUnavailable({
      service: "Carrier rate quote",
      requiredEnv: ["CARRIER_RATES_API_URL", "CARRIER_RATES_API_KEY"],
      developerAction:
        "Integrate real carrier/freight-forwarder APIs, normalize quote responses, enforce cargo restrictions from HS/product data, and persist selected quote IDs before checkout.",
    });
  } catch (error) {
    console.error("Shipping rates error:", error);
    return NextResponse.json({ error: "Failed to fetch shipping rates" }, { status: 500 });
  }
}
