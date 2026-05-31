import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { origin_country, destination_country, weight_kg, cargo_type, product_categories, hs_codes } =
      await req.json();

    // Simulated carrier rates (in production, query carrier APIs)
    const carriers = [];

    if (cargo_type === "sea" || !cargo_type) {
      carriers.push(
        {
          carrier_id: "maersk",
          carrier_name: "Maersk Line",
          cargo_type: "sea",
          transit_days: 28,
          rate: Math.round(weight_kg * 850 + 15000),
          currency: "NGN",
          includes_duties: false,
          rating: 4.7,
          service_name: "Maersk Standard",
        },
        {
          carrier_id: "msc",
          carrier_name: "MSC Cargo",
          cargo_type: "sea",
          transit_days: 32,
          rate: Math.round(weight_kg * 720 + 12000),
          currency: "NGN",
          includes_duties: false,
          rating: 4.5,
          service_name: "MSC Economy",
        },
        {
          carrier_id: "cma_cgm",
          carrier_name: "CMA CGM",
          cargo_type: "sea",
          transit_days: 25,
          rate: Math.round(weight_kg * 980 + 18000),
          currency: "NGN",
          includes_duties: true,
          rating: 4.8,
          service_name: "CMA Express",
        }
      );
    }

    // Check if air freight is allowed
    const airRestrictedCategories = ["frozen_produce", "vehicles", "machinery"];
    const hasAirRestricted = product_categories?.some((c: string) =>
      airRestrictedCategories.includes(c)
    );

    if (!hasAirRestricted && (cargo_type === "air" || !cargo_type)) {
      carriers.push(
        {
          carrier_id: "dhl",
          carrier_name: "DHL Express",
          cargo_type: "air",
          transit_days: 5,
          rate: Math.round(weight_kg * 4500 + 8000),
          currency: "NGN",
          includes_duties: false,
          rating: 4.9,
          service_name: "DHL Worldwide Express",
        },
        {
          carrier_id: "fedex",
          carrier_name: "FedEx International",
          cargo_type: "air",
          transit_days: 4,
          rate: Math.round(weight_kg * 5200 + 9000),
          currency: "NGN",
          includes_duties: true,
          rating: 4.8,
          service_name: "FedEx Priority Door-to-Door",
        }
      );
    }

    // Sort by rate
    carriers.sort((a, b) => a.rate - b.rate);

    const ai_recommendation = {
      recommended_carrier_id: carriers[0]?.carrier_id,
      reason: hasAirRestricted
        ? "Sea freight is required for this shipment due to cargo restrictions (frozen goods/vehicles/heavy machinery cannot be air freighted)."
        : "Sea freight offers the best value for this shipment weight and route.",
      air_restricted: hasAirRestricted,
    };

    return NextResponse.json({
      success: true,
      carriers,
      ai_recommendation,
      route: { origin_country, destination_country },
      total_weight_kg: weight_kg,
    });
  } catch (error) {
    console.error("Shipping rates error:", error);
    return NextResponse.json({ error: "Failed to fetch shipping rates" }, { status: 500 });
  }
}
