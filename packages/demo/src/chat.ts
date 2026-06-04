// ─── AI Chat Responses ────────────────────────────────────────────────────────
// Platform-agnostic — no React/RN imports

export type ChatResponseKey = "greeting" | "crayfish" | "car" | "escrow" | "shipping" | "default";

export interface ChatResponse {
  text: string;
  suggestions: string[];
}

export const CHAT_RESPONSES: Record<string, ChatResponse> = {
  greeting: {
    text: "Hi! 👋 I'm EKDA AI — your personal trade assistant.\n\nI can help you:\n• 🌿 Find African products\n• 🌍 Import goods to Nigeria\n• 🚢 Calculate shipping costs\n• 📋 Explain HS codes & customs\n• 💰 Calculate landed costs\n\nWhat can I help with today?",
    suggestions: ["Show me dried crayfish", "Import a car to Nigeria", "How does escrow work?"],
  },
  crayfish: {
    text: "🦐 Great choice! Here are our top dried crayfish listings:\n\n• Premium Badagry Crayfish: ₦8,500/kg\n• Bulk (10kg+): ₦7,800/kg avg\n\n**Shipping to UK:**\n🚢 Sea freight: ~₦35,000 for 10kg (28 days)\n✈️ Air freight: ~₦85,000 for 10kg (5 days)\n\n**HS Code:** 0306.17 (97% AI confidence)\n\nShall I add any to your cart?",
    suggestions: ["Add 5kg to cart", "Calculate full landed cost", "Check other dried produce"],
  },
  car: {
    text: "🚗 Importing a car to Nigeria:\n\n**Import costs example (Toyota Camry):**\n• Car price: ₦18,500,000\n• Sea freight: ~₦280,000 (RoRo)\n• Import duty: 35% of CIF = ~₦6,580,000\n• Port levy: 7% = ~₦1,316,000\n• Clearing agent: ~₦100,000\n\n**Total landed: ~₦26,776,000**\n\n⚠️ Vehicles CANNOT be air freighted. Sea only.\n🛡️ 100% escrow protected via EKDA\n\n**HS Code:** 8703.23",
    suggestions: ["Calculate full cost", "Browse vehicles", "How long does it take?"],
  },
  escrow: {
    text: "🔒 How EKDA Escrow works:\n\n**Step 1:** You pay 100% → held in EKDA escrow\n**Step 2:** Carrier confirms pickup → 50% released to vendor\n**Step 3:** Goods arrive at destination → Final 50% released\n\n**EKDA deducts 10% commission** before each release.\n\n✅ Your money is NEVER at risk. If goods don't arrive, you get a full refund.\n\n**Example (₦100,000 order):**\n• Escrow held: ₦100,000\n• After pickup: vendor gets ₦45,000\n• After delivery: vendor gets ₦45,000\n• EKDA keeps: ₦10,000 (10%)",
    suggestions: ["How to dispute?", "Payment methods", "Show me an order"],
  },
  shipping: {
    text: "🚢 Shipping cost estimator:\n\n**Sea Freight (Recommended for bulk):**\n• 1kg: ₦850 + ₦15,000 base\n• 10kg: ~₦23,500\n• 50kg: ~₦57,500\n• Transit: 25-35 days\n\n**Air Freight (Fast items):**\n• 1kg: ₦4,500 + ₦8,000 base\n• 10kg: ~₦53,000\n• Transit: 4-7 days\n\n⚠️ Frozen goods, vehicles & heavy machinery = Sea only.\n\nWhich route are you shipping?",
    suggestions: ["Lagos to London", "Lagos to Toronto", "Cheapest option for 20kg"],
  },
  default: {
    text: "I can help you with that! Here are some things I can assist with:\n\n• 🛒 Finding products on our marketplace\n• 💰 Shipping cost calculations\n• 📋 HS codes & customs classification\n• 🔒 How escrow protection works\n• 🚗 Vehicle import guide\n• 📦 Document requirements\n\nJust ask me anything about trade!",
    suggestions: ["Show popular products", "How to register as vendor", "Track my order"],
  },
};

/** Keyword-based response matcher — no external dependencies */
export function getAIChatResponse(userMessage: string): ChatResponse {
  const lower = userMessage.toLowerCase();
  if (lower.includes("crayfish") || lower.includes("dried") || lower.includes("shrimp")) {
    return CHAT_RESPONSES.crayfish!;
  }
  if (lower.includes("car") || lower.includes("vehicle") || lower.includes("toyota") || lower.includes("import car")) {
    return CHAT_RESPONSES.car!;
  }
  if (lower.includes("escrow") || lower.includes("payment") || lower.includes("how does")) {
    return CHAT_RESPONSES.escrow!;
  }
  if (lower.includes("ship") || lower.includes("freight") || lower.includes("cost") || lower.includes("kg")) {
    return CHAT_RESPONSES.shipping!;
  }
  return CHAT_RESPONSES.default!;
}

// ─── HS Code Classification Examples ─────────────────────────────────────────

export interface HSCodeExample {
  prompt: string;
  code: string;
  desc: string;
  confidence: number;
  restricted: boolean;
  reason?: string;
}

export const HS_CODE_EXAMPLES: HSCodeExample[] = [
  { prompt: "Dried crayfish from Nigeria", code: "0306.17", desc: "Dried shrimps and prawns", confidence: 97, restricted: false },
  { prompt: "Toyota Camry 2021 petrol", code: "8703.23", desc: "Motor cars — 1500–3000cc", confidence: 99, restricted: true, reason: "Vehicles cannot be air freighted. Sea freight only." },
  { prompt: "Palm oil crude", code: "1511.10", desc: "Palm oil, crude", confidence: 99, restricted: false },
  { prompt: "iPhone 15 smartphone", code: "8517.13", desc: "Smartphones & cellular phones", confidence: 99, restricted: false },
  { prompt: "Garri cassava flour", code: "1903.00", desc: "Tapioca and substitutes from starch", confidence: 96, restricted: false },
  { prompt: "Frozen stockfish cod", code: "0305.41", desc: "Dried fish, unsalted, not smoked", confidence: 94, restricted: true, reason: "Frozen/chilled fish requires cold chain. Air freight not suitable." },
  { prompt: "Industrial excavator 30 ton", code: "8429.52", desc: "Machinery with rotating superstructure", confidence: 98, restricted: true, reason: "Heavy machinery (>10 tons) cannot be air freighted." },
  { prompt: "Egusi melon seeds", code: "1207.70", desc: "Melon seeds", confidence: 95, restricted: false },
];

/** Classify a product description using keyword matching */
export function classifyHSCode(description: string): HSCodeExample {
  const lower = description.toLowerCase();
  const match = HS_CODE_EXAMPLES.find((ex) =>
    ex.prompt
      .toLowerCase()
      .split(" ")
      .some((word) => word.length > 3 && lower.includes(word))
  );
  return match ?? HS_CODE_EXAMPLES[0]!;
}
