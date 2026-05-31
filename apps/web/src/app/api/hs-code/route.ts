import { NextRequest, NextResponse } from "next/server";
import { hsCodeLimiter, getIdentifier } from "@/lib/rate-limit";
import { aiLogger } from "@/lib/logger";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const identifier = getIdentifier(req);
  
  const rl = hsCodeLimiter(identifier);
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit exceeded for HS Code classifications.", retry_after: 60 }, { status: 429 });
  }

  try {
    const { product_name, description, category, origin_country, images } =
      await req.json();

    if (!description && !product_name) {
      return NextResponse.json(
        { error: "Product name or description is required" },
        { status: 400 }
      );
    }

    // In production, call OpenAI or Groq API here
    // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    // const completion = await openai.chat.completions.create({ ... });

    // Simulate AI HS Code classification
    const prompt = `${product_name || ""} ${description || ""} ${category || ""}`.toLowerCase();

    let result: { suggested_code: string; description: string; confidence: number; alternative_codes: Array<{ code: string; description: string; confidence: number }>; restricted_air_cargo: boolean; notes: string } = {
      suggested_code: "9999.99",
      description: "Unclassified — manual review required",
      confidence: 0.42,
      alternative_codes: [] as Array<{ code: string; description: string; confidence: number }>,
      restricted_air_cargo: false,
      notes: "Unable to auto-classify. Please contact EKDA customs team.",
    };

    if (prompt.includes("crayfish") || prompt.includes("shrimp")) {
      result = {
        suggested_code: "0306.17",
        description: "Other shrimps and prawns, dried/salted or in brine",
        confidence: 0.97,
        alternative_codes: [
          { code: "0305.72", description: "Dried fish, salted or in brine", confidence: 0.71 },
        ],
        restricted_air_cargo: false,
        notes: "Common Nigerian export. Air freight permitted. Sea recommended for bulk.",
      };
    } else if (prompt.includes("palm oil")) {
      result = {
        suggested_code: "1511.10",
        description: "Palm oil, crude",
        confidence: 0.99,
        alternative_codes: [
          { code: "1511.90", description: "Palm oil, refined", confidence: 0.81 },
        ],
        restricted_air_cargo: false,
        notes: "Zero duty under most trade agreements.",
      };
    } else if (prompt.includes("car") || prompt.includes("vehicle") || prompt.includes("toyota") || prompt.includes("mercedes")) {
      result = {
        suggested_code: "8703.23",
        description: "Motor cars, spark-ignition engine, 1500–3000cc",
        confidence: 0.99,
        alternative_codes: [
          { code: "8703.24", description: "Motor cars, >3000cc", confidence: 0.72 },
        ],
        restricted_air_cargo: true,
        notes: "Vehicles: sea freight only (RoRo or container). Import duty Nigeria: 35%.",
      };
    } else if (prompt.includes("smartphone") || prompt.includes("phone") || prompt.includes("iphone") || prompt.includes("samsung")) {
      result = {
        suggested_code: "8517.13",
        description: "Smartphones — cellular telephone handsets",
        confidence: 0.99,
        alternative_codes: [] as Array<{ code: string; description: string; confidence: number }>,
        restricted_air_cargo: false,
        notes: "Import duty: 20%. ICAO Packing Instruction compliance required for lithium batteries.",
      };
    } else if (prompt.includes("garri") || prompt.includes("cassava")) {
      result = {
        suggested_code: "1903.00",
        description: "Tapioca and substitutes prepared from starch",
        confidence: 0.96,
        alternative_codes: [
          { code: "1108.14", description: "Cassava starch", confidence: 0.70 },
        ],
        restricted_air_cargo: false,
        notes: "Popular Nigerian food export.",
      };
    } else if (prompt.includes("frozen") || prompt.includes("stockfish") || prompt.includes("fish")) {
      result = {
        suggested_code: "0305.41",
        description: "Dried or smoked fish — Pacific cod",
        confidence: 0.94,
        alternative_codes: [] as Array<{ code: string; description: string; confidence: number }>,
        restricted_air_cargo: true,
        notes: "⚠️ Air freight RESTRICTED. Refrigerated sea container mandatory.",
      };
    }

    return NextResponse.json({
      success: true,
      result,
      model: "ekda-hs-classifier-v1",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("HS Code API error:", error);
    return NextResponse.json({ error: "Classification failed" }, { status: 500 });
  }
}
