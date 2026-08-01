import { NextRequest, NextResponse } from "next/server";
import { aiChatLimiter, getIdentifier } from "@/lib/rate-limit";
import { aiLogger } from "@/lib/logger";
import { integrationUnavailable } from "@/lib/integrations/guards";

export async function POST(req: NextRequest) {
  const identifier = getIdentifier(req);

  // Rate limiting
  const rl = aiChatLimiter(identifier);
  if (!rl.success) {
    return NextResponse.json(
      { error: rl.message || "Rate limit exceeded", retry_after: Math.ceil(((rl as any).resetAt - Date.now()) / 1000) },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    return integrationUnavailable({
      service: "AI trade assistant",
      requiredEnv: ["GROQ_API_KEY or OPENAI_API_KEY"],
      developerAction:
        "Wire a real LLM provider, store prompt/version metadata, add product lookup context from Supabase, log token usage, and guard responses with safety/compliance policies.",
    });
  } catch (error) {
    aiLogger.error("AI Chat error", { error: String(error) });
    return NextResponse.json({ error: "Chat service unavailable. Please try again shortly." }, { status: 500 });
  }
}
