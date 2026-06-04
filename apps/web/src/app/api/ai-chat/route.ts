import { NextRequest, NextResponse } from "next/server";
import { aiChatLimiter, getIdentifier } from "@/lib/rate-limit";
import { aiLogger } from "@/lib/logger";
import { getAIChatResponse, EXPORT_PRODUCTS } from "@ekda/demo";
import { EKDA_COMMISSION_RATE } from "@ekda/shared";

const SYSTEM_PROMPT = `You are EKDA AI — an expert trade and shopping assistant for EKDA Marketplace,
Africa's premier cross-border e-commerce platform. When live, powered by Groq Llama-3.
In demo mode, contextual responses are from @ekda/demo.

Key facts:
- Escrow: 100% held, 50% released at carrier pickup, 50% at destination arrival
- Commission: ${EKDA_COMMISSION_RATE * 100}% on all transactions
- Payments: Paystack (Nigeria), Stripe (International), Monnify, Crypto
- Nigerian ports: Apapa, Tin Can Island (Lagos), Onne (Port Harcourt)
- Air cargo restrictions: frozen goods and vehicles CANNOT be air freighted`;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const identifier = getIdentifier(req);

  // Rate limiting
  const rl = aiChatLimiter(identifier);
  if (!rl.success) {
    return NextResponse.json(
      {
        error: rl.message || "Rate limit exceeded",
        retry_after: Math.ceil(((rl as any).resetAt - Date.now()) / 1000),
      },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  try {
    const { message, history = [] } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // In production, replace with live Groq call:
    // const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    // const completion = await groq.chat.completions.create({
    //   model: "llama-3.3-70b-versatile",
    //   messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history, { role: "user", content: message }],
    //   max_tokens: 1024,
    // });
    // const aiText = completion.choices[0].message.content;

    // Demo mode: use shared getAIChatResponse from @ekda/demo
    const chatResponse = getAIChatResponse(message);

    // Optionally enrich with product data from @ekda/demo
    const products =
      message.toLowerCase().includes("crayfish") ||
      message.toLowerCase().includes("dried")
        ? [EXPORT_PRODUCTS[0]].filter(Boolean).map((p) => ({
            id: p!.id,
            name: p!.name,
            price: p!.price,
            currency: p!.currency,
            unit: p!.unit,
            category: p!.category,
          }))
        : undefined;

    const reply = {
      reply: chatResponse.text,
      suggestions: chatResponse.suggestions,
      products,
    };

    aiLogger.ai("chat_message_processed", "ekda-demo-classifier", Date.now() - startTime, {
      metadata: {
        message_length: message.length,
        has_products: (reply.products?.length ?? 0) > 0,
      },
    });

    return NextResponse.json(reply);
  } catch (error) {
    aiLogger.error("AI Chat error", { error: String(error) });
    return NextResponse.json(
      { error: "Chat service unavailable. Please try again shortly." },
      { status: 500 }
    );
  }
}
