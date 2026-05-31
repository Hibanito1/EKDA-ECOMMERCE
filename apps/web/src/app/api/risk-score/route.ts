import { NextRequest, NextResponse } from "next/server";

interface RiskFactor {
  factor: string;
  score: number;
  weight: number;
  description: string;
}

export async function POST(req: NextRequest) {
  try {
    const {
      order_value,
      vendor_id,
      customer_id,
      vendor_kyc_status,
      customer_kyc_status,
      origin_country,
      destination_country,
      cargo_type,
      product_category,
      is_first_order,
      vendor_rating,
      customer_order_history,
    } = await req.json();

    const riskFactors: RiskFactor[] = [];
    let totalScore = 0;

    // Factor 1: KYC Status
    const vendorKycScore = vendor_kyc_status === "approved" ? 0 : vendor_kyc_status === "pending" ? 40 : 80;
    riskFactors.push({
      factor: "Vendor KYC",
      score: vendorKycScore,
      weight: 0.25,
      description: vendor_kyc_status === "approved" ? "Fully verified vendor" : "KYC incomplete or rejected",
    });

    const customerKycScore = customer_kyc_status === "approved" ? 0 : customer_kyc_status === "pending" ? 25 : 60;
    riskFactors.push({
      factor: "Customer KYC",
      score: customerKycScore,
      weight: 0.15,
      description: customer_kyc_status === "approved" ? "Verified customer" : "Customer identity not fully verified",
    });

    // Factor 2: Order Value
    const orderValueScore = order_value > 10000000 ? 60 : order_value > 1000000 ? 30 : order_value > 100000 ? 15 : 5;
    riskFactors.push({
      factor: "Order Value",
      score: orderValueScore,
      weight: 0.20,
      description: order_value > 10000000 ? "Very high value order — enhanced due diligence required" : "Standard order value",
    });

    // Factor 3: First Order
    const firstOrderScore = is_first_order ? 35 : 0;
    riskFactors.push({
      factor: "Order History",
      score: firstOrderScore,
      weight: 0.15,
      description: is_first_order ? "First order — no history to validate" : "Established buyer/seller relationship",
    });

    // Factor 4: Vendor Rating
    const vendorRatingScore = !vendor_rating ? 50 : vendor_rating >= 4.5 ? 0 : vendor_rating >= 4.0 ? 15 : vendor_rating >= 3.5 ? 30 : 60;
    riskFactors.push({
      factor: "Vendor Rating",
      score: vendorRatingScore,
      weight: 0.10,
      description: vendor_rating ? `Vendor rating: ${vendor_rating}/5` : "No vendor rating available",
    });

    // Factor 5: Route Risk
    const HIGH_RISK_CORRIDORS = [["US", "NG"], ["CN", "NG"], ["TR", "NG"]];
    const isHighRiskRoute = HIGH_RISK_CORRIDORS.some(
      ([o, d]) => (origin_country === o && destination_country === d) ||
                  (origin_country === d && destination_country === o)
    );
    const routeScore = isHighRisk(origin_country, destination_country) ? 40 : 10;
    riskFactors.push({
      factor: "Trade Route",
      score: routeScore,
      weight: 0.10,
      description: isHighRisk(origin_country, destination_country)
        ? "High-scrutiny trade corridor — additional documentation may be required"
        : "Standard trade route",
    });

    // Factor 6: Product Category
    const HIGH_RISK_CATEGORIES = ["agri_commodities", "vehicles"];
    const catScore = HIGH_RISK_CATEGORIES.includes(product_category) ? 25 : 5;
    riskFactors.push({
      factor: "Product Category",
      score: catScore,
      weight: 0.05,
      description: HIGH_RISK_CATEGORIES.includes(product_category)
        ? "Regulated category — additional compliance checks"
        : "Standard product category",
    });

    // Calculate weighted total
    totalScore = riskFactors.reduce((sum, f) => sum + f.score * f.weight, 0);

    const riskLevel = totalScore < 20 ? "low" : totalScore < 45 ? "medium" : totalScore < 70 ? "high" : "critical";

    const recommendations = [];
    if (vendorKycScore > 30) recommendations.push("Request vendor to complete full KYC verification");
    if (orderValueScore > 30) recommendations.push("Require video verification for this high-value order");
    if (firstOrderScore > 0) recommendations.push("Recommend vendor to request advance photos of goods");
    if (routeScore > 30) recommendations.push("Additional customs pre-clearance recommended for this route");

    return NextResponse.json({
      success: true,
      risk_score: Math.round(totalScore),
      risk_level: riskLevel,
      risk_factors: riskFactors,
      recommendations,
      escrow_recommendation: totalScore > 45 ? "Standard escrow with milestone photos required" : "Standard escrow",
      auto_approved: totalScore < 30,
      requires_manual_review: totalScore >= 70,
      calculated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Risk score error:", error);
    return NextResponse.json({ error: "Risk assessment failed" }, { status: 500 });
  }
}

function isHighRisk(origin: string, destination: string): boolean {
  const highRiskPairs = [["US", "NG"], ["CN", "NG"], ["TR", "NG"], ["AE", "NG"]];
  return highRiskPairs.some(([o, d]) =>
    (origin === o && destination === d) || (origin === d && destination === o)
  );
}
