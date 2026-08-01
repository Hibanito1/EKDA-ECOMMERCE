import { NextRequest, NextResponse } from "next/server";
import { hsCodeLimiter, getIdentifier } from "@/lib/rate-limit";
import { integrationUnavailable } from "@/lib/integrations/guards";

export async function POST(req: NextRequest) {
  const identifier = getIdentifier(req);
  
  const rl = hsCodeLimiter(identifier);
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit exceeded for HS Code classifications.", retry_after: 60 }, { status: 429 });
  }

  try {
    const { product_name, description } =
      await req.json();

    if (!description && !product_name) {
      return NextResponse.json(
        { error: "Product name or description is required" },
        { status: 400 }
      );
    }

    return integrationUnavailable({
      service: "HS code classifier",
      requiredEnv: ["GROQ_API_KEY or OPENAI_API_KEY"],
      developerAction:
        "Wire a real classifier prompt/model, persist classification attempts, enforce confidence thresholds, and require customs/admin review before using HS codes on listings.",
    });
  } catch (error) {
    console.error("HS Code API error:", error);
    return NextResponse.json({ error: "Classification failed" }, { status: 500 });
  }
}
