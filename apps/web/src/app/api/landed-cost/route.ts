import { NextRequest, NextResponse } from "next/server";

const DUTY_RATES: Record<string, number> = {
  "8703": 0.35, // Motor vehicles
  "8517": 0.20, // Smartphones/phones
  "0306": 0.05, // Crustaceans
  "1511": 0.05, // Palm oil
  "1903": 0.10, // Tapioca/garri
  "0305": 0.05, // Fish
  "8429": 0.10, // Bulldozers/machinery
  "8426": 0.10, // Cranes
  "2103": 0.05, // Sauces/condiments
  "0712": 0.05, // Dried vegetables
  "8471": 0.10, // Computers
  "8528": 0.20, // Televisions
  "default": 0.15,
};

const PORT_LEVIES: Record<string, number> = {
  NGAPP: 0.07, NGTCI: 0.07, NGPHC: 0.07, NGCBQ: 0.06, NGWRI: 0.06,
  LOS: 0.05, ABV: 0.05, PHC: 0.05, KAN: 0.05,
};

const CLEARING_COSTS: Record<string, number> = {
  sea: 85000, // NGN for sea freight
  air: 45000, // NGN for air freight
};

const EXCHANGE_RATES: Record<string, number> = {
  USD: 1650, GBP: 2100, EUR: 1820, CAD: 1200, AUD: 1080, NGN: 1,
};

export async function POST(req: NextRequest) {
  try {
    const {
      product_price,
      product_currency = "NGN",
      hs_code,
      cargo_type = "sea",
      weight_kg,
      destination_port,
      shipping_cost,
      insurance_rate = 0,
      quantity = 1,
    } = await req.json();

    if (!product_price || !weight_kg) {
      return NextResponse.json({ error: "product_price and weight_kg are required" }, { status: 400 });
    }

    // Convert to NGN
    const exchangeRate = EXCHANGE_RATES[product_currency] || 1;
    const productPriceNGN = product_price * exchangeRate * quantity;

    // CIF Value = Product cost + Freight + Insurance
    const freightCostNGN = shipping_cost || (cargo_type === "sea"
      ? weight_kg * 850 + 15000
      : weight_kg * 4500 + 8000);

    const insuranceCostNGN = productPriceNGN * insurance_rate;
    const cifValue = productPriceNGN + freightCostNGN + insuranceCostNGN;

    // Customs Duty
    const hsPrefix = hs_code ? hs_code.replace(/\./g, "").slice(0, 4) : null;
    const dutyRate: number = hsPrefix
      ? (DUTY_RATES[hsPrefix] ?? DUTY_RATES["default"] ?? 0.15)
      : (DUTY_RATES["default"] ?? 0.15);
    const customsDuty = cifValue * (dutyRate || 0.15);

    // Port Levy (Nigeria-specific)
    const portLevyRate: number = PORT_LEVIES[destination_port] ?? 0.07;
    const portLevy = cifValue * portLevyRate;

    // VAT (7.5% on imported goods in Nigeria)
    const vatRate = 0.075;
    const vat = (cifValue + customsDuty + portLevy) * vatRate;

    // Clearing agent fees
    const clearingFee: number = CLEARING_COSTS[cargo_type] ?? CLEARING_COSTS["sea"] ?? 85000;

    // SURCHARGE (CISS, ETLS, etc.)
    const surchargeCIS = cifValue * 0.01; // 1% CISS
    const surchargeETLS = cifValue * 0.005; // 0.5% ETLS

    // Total landed cost
    const totalLandedCost =
      productPriceNGN +
      freightCostNGN +
      insuranceCostNGN +
      customsDuty +
      portLevy +
      vat +
      clearingFee +
      surchargeCIS +
      surchargeETLS;

    const breakdown = {
      product_cost: Math.round(productPriceNGN),
      freight_cost: Math.round(freightCostNGN),
      insurance_cost: Math.round(insuranceCostNGN),
      cif_value: Math.round(cifValue),
      customs_duty: Math.round(customsDuty),
      port_levy: Math.round(portLevy),
      vat: Math.round(vat),
      clearing_fee: Math.round(clearingFee),
      ciss_surcharge: Math.round(surchargeCIS),
      etls_surcharge: Math.round(surchargeETLS),
      total_landed_cost: Math.round(totalLandedCost),
      currency: "NGN",
    };

    const rates = {
      duty_rate: dutyRate ?? 0.15,
      port_levy_rate: portLevyRate,
      vat_rate: vatRate,
      insurance_rate,
      hs_code: hs_code || "Not provided",
    };

    const as_percentage = {
      freight: ((freightCostNGN / totalLandedCost) * 100).toFixed(1),
      duties_taxes: (((customsDuty + portLevy + vat) / totalLandedCost) * 100).toFixed(1),
      product: ((productPriceNGN / totalLandedCost) * 100).toFixed(1),
    };

    return NextResponse.json({
      success: true,
      breakdown,
      rates,
      as_percentage,
      ai_note: (dutyRate ?? 0.15) >= 0.35
        ? "⚠️ High import duty rate (35%) on this category. Consider bulk orders to optimize per-unit cost."
        : (dutyRate ?? 0.15) <= 0.05
        ? "✅ Low duty rate on this product category. Excellent for regular imports."
        : "ℹ️ Standard duty rate applies. Use air freight for high-value, low-weight items.",
    });
  } catch (error) {
    console.error("Landed cost error:", error);
    return NextResponse.json({ error: "Calculation failed" }, { status: 500 });
  }
}
