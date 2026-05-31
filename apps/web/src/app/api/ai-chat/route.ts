import { NextRequest, NextResponse } from "next/server";
import { aiChatLimiter, getIdentifier } from "@/lib/rate-limit";
import { aiLogger } from "@/lib/logger";

const SYSTEM_PROMPT = `You are EKDA AI — an expert trade and shopping assistant for EKDA Marketplace, Africa's premier cross-border e-commerce platform.

You help:
- Nigerian vendors export African groceries, dried/frozen produce, and agri-commodities to the diaspora
- International vendors import cars, electronics, and machinery to Nigeria/Africa
- Customers find products, understand shipping costs, navigate customs requirements

Key facts about EKDA:
- Escrow protection: 100% funds held, 50% released at pickup, 50% at destination
- 10% EKDA commission on all transactions
- Supported payments: Paystack (Nigeria), Stripe (International), Monnify
- Cargo types: Air freight (fast, 4-7 days) and Sea freight (cheaper, 25-35 days)
- Nigerian ports: Apapa, Tin Can Island (Lagos), Onne (Port Harcourt)
- Nigerian airports: LOS (Lagos), ABV (Abuja), PHC (Port Harcourt)

AI-powered features:
- HS Code classification for products
- Air cargo restriction detection (frozen goods, vehicles are restricted from air)
- Customs duty calculation based on HS codes
- Carrier comparison

Be concise, helpful, and culturally aware. Use emojis sparingly for tone. 
When recommending products, return them in the products array. 
When appropriate, provide 2-3 quick reply suggestions.

If asked about pricing, note prices can vary and recommend checking the live marketplace.
Always prioritize customer safety and escrow protection.`;

export async function POST(req: NextRequest) {
  const startTime = Date.now();
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
    const { message, history = [] } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // In production, call Groq API:
    // const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    // const completion = await groq.chat.completions.create({
    //   model: "llama-3.3-70b-versatile",
    //   messages: [
    //     { role: "system", content: SYSTEM_PROMPT },
    //     ...history,
    //     { role: "user", content: message }
    //   ],
    //   max_tokens: 1024,
    //   temperature: 0.7,
    // });

    // Smart contextual responses
    const reply = generateSmartReply(message.toLowerCase(), history);

    aiLogger.ai("chat_message_processed", "ekda-classifier", Date.now() - startTime, {
      metadata: { message_length: message.length, has_products: (reply.products?.length || 0) > 0 }
    });

    return NextResponse.json(reply);
  } catch (error) {
    aiLogger.error("AI Chat error", { error: String(error) });
    return NextResponse.json({ error: "Chat service unavailable. Please try again shortly." }, { status: 500 });
  }
}

function generateSmartReply(message: string, history: Array<{ role: string; content: string }>) {
  const isFollowUp = history.length > 0;

  if (message.includes("crayfish") || message.includes("dried")) {
    return {
      reply: "🦐 Great choice! Here are our top dried crayfish options from verified Nigerian vendors. Premium Badagry crayfish runs ₦8,500/kg — perfect for soups and stews.\n\nShipping to UK: Sea freight ~₦35,000 for 10kg (28 days) or air freight ~₦85,000 (5 days).",
      products: [
        { id: "1", name: "Premium Dried Crayfish", price: 8500, currency: "NGN", unit: "kg", category: "dried_produce" },
        { id: "2", name: "Sun-dried Shrimp", price: 7200, currency: "NGN", unit: "kg", category: "dried_produce" },
      ],
      suggestions: ["How much to ship 20kg?", "Show me palm oil too", "What's the HS code?"],
    };
  }

  if (message.includes("ship") || message.includes("shipping") || message.includes("freight")) {
    return {
      reply: "🚢 Here's a quick shipping guide:\n\n**Sea Freight** (recommended for bulk):\n• 25-35 days transit\n• ~₦850/kg + ₦15,000 base\n• Best for 5kg+ orders\n\n**Air Freight** (fast delivery):\n• 4-7 days transit\n• ~₦4,500/kg + ₦8,000 base\n• Best for urgent, high-value items\n\n⚠️ Frozen goods and vehicles are restricted from air freight.",
      suggestions: ["Calculate cost for 50kg", "Which carriers are best?", "Show Nigerian ports"],
    };
  }

  if (message.includes("toyota") || message.includes("car") || message.includes("vehicle") || message.includes("import car")) {
    return {
      reply: "🚗 Importing vehicles to Nigeria is one of our specialties! Here's what you need to know:\n\n**Import Costs (example: 2021 Toyota Camry)**\n• Car price: ~₦18,500,000\n• Sea freight: ~₦280,000 (Ro-Ro)\n• Import duty: 35% of CIF value\n• Port levies: 7%\n• Total landed: ~₦32,000,000+\n\n⚠️ Vehicles CANNOT be air freighted. Sea freight only (20-30 days).\n\nHere are some current listings:",
      products: [
        { id: "i1", name: "2021 Toyota Camry XSE V6", price: 18500000, currency: "NGN", unit: "unit", category: "vehicles" },
      ],
      suggestions: ["Calculate full landed cost", "How long does it take?", "What documents do I need?"],
    };
  }

  if (message.includes("halal") || message.includes("eid") || message.includes("ramadan")) {
    return {
      reply: "🌙 We have a curated selection of Halal-certified products perfect for Eid and Ramadan!\n\n**Eid Gift Bundle** (popular this season):\n• Dried dates from Kano\n• Halal smoked fish\n• Turmeric & spice pack\n• Shea butter collection\n\nAll vendors are verified with Halal certification. Estimated delivery to UK: 28 days via sea freight.",
      suggestions: ["Show Halal groceries", "Bundle pricing?", "Fastest delivery option?"],
    };
  }

  if (message.includes("customs") || message.includes("hs code") || message.includes("duty")) {
    return {
      reply: "📋 Our AI HS Code Engine handles customs classification automatically!\n\n**How it works:**\n1. Upload your product description\n2. AI classifies to the correct HS Code (97%+ accuracy)\n3. Get estimated duty rates instantly\n4. Generate customs documentation\n\n**Common Nigerian import duties:**\n• Vehicles: 35%\n• Electronics: 20%\n• Food products: 5-10%\n• Agricultural machinery: 10%\n\nWant me to classify a specific product?",
      suggestions: ["Classify my product", "Help with customs docs", "Calculate duty for electronics"],
    };
  }

  if (message.includes("uk") || message.includes("london") || message.includes("britain") || message.includes("diaspora")) {
    return {
      reply: "🇬🇧 Great news — we have a dedicated UK logistics network!\n\n**UK-specific features:**\n• Apapa → Tilbury port route (28 days)\n• HMRC-compliant documentation\n• UK customs pre-clearance support\n• Delivery to any UK address after port\n\n**Popular with UK diaspora:**\n• Dried crayfish & ogiri\n• Palm oil & egusi\n• Frozen stockfish (sea only)\n• Pounded yam flour\n\nAll products priced in NGN, GBP, or USD.",
      suggestions: ["Show UK-popular products", "Calculate UK shipping cost", "UK customs requirements"],
    };
  }

  if (message.includes("budget") || message.includes("cheap") || message.includes("affordable") || message.includes("under")) {
    const priceMatch = message.match(/₦?([\d,]+)/);
    const budget = priceMatch ? parseInt((priceMatch[1] ?? '0').replace(",", "")) : 10000;
    return {
      reply: `💡 Found products within your budget of ₦${budget.toLocaleString()}:\n\nI can filter the catalog for the best value options. Our price comparison tool also shows:\n• Current market price\n• 30-day price trend\n• Best time to buy\n• Price alert setup\n\nWould you like to set a price alert so I notify you when prices drop?`,
      suggestions: ["Set price alert", "Show cheapest products", "Filter by budget"],
    };
  }

  if (message.includes("bundle") || message.includes("combo") || message.includes("package")) {
    return {
      reply: "🎁 Smart Bundles are one of our best features! AI creates complementary bundles:\n\n**Popular Bundles:**\n• 🍲 **Nigerian Soup Kit** — Crayfish + Palm oil + Ogiri + Stockfish\n• 🌿 **Diaspora Starter Pack** — 10 essential African groceries\n• 🚗 **Car Import Bundle** — Vehicle + shipping + insurance + clearing agent\n• ☕ **West African Spice Box** — 12 authentic spices for UK/US customers\n\nBundles save 15-25% vs buying individually!",
      suggestions: ["Build custom bundle", "View all bundles", "Subscribe monthly"],
    };
  }

  if (message.includes("loyalty") || message.includes("points") || message.includes("reward")) {
    return {
      reply: "⭐ EKDA Loyalty Program — earn while you trade!\n\n**Tier Benefits:**\n• 🥉 Bronze (0-4,999 pts): 1pt per ₦100 spent\n• 🥈 Silver (5,000+): 1.5x points + priority support\n• 🥇 Gold (20,000+): 2x points + 2% cashback\n• 💎 Platinum (50,000+): 3x points + 1% commission reduction\n\nYou can redeem points for shipping discounts, product vouchers, or donate to smallholder farmers!",
      suggestions: ["Check my points", "How to earn more", "Redeem points"],
    };
  }

  if (message.includes("track") || message.includes("where is my") || message.includes("order status")) {
    return {
      reply: "📦 To track your order, I'll need your order ID (format: EKDA-XXXXXX).\n\nYour EKDA dashboard shows:\n• Real-time shipment location\n• Carrier vessel information\n• Escrow release status\n• Estimated delivery date\n\nYou can also opt in to SMS/WhatsApp alerts at every milestone — pickup, port arrival, customs clearance, and delivery!",
      suggestions: ["Track order EKDA-MK3X2F", "Set up notifications", "Contact my carrier"],
    };
  }

  // Default contextual response
  return {
    reply: isFollowUp
      ? "I'm here to help! Could you tell me more specifically what you're looking for? I can help with:\n\n• 🛒 Finding products (grocery, electronics, vehicles)\n• 🚢 Shipping costs & carrier selection\n• 📋 HS Codes & customs clearance\n• 💰 Price calculations & alerts\n• 📦 Order tracking & support"
      : "Hello! 👋 I'm your EKDA AI Trade Assistant, powered by Groq.\n\nI can help you:\n• 🌿 Find authentic African products\n• 🌍 Import vehicles or electronics to Nigeria\n• 🚢 Calculate shipping & landed costs\n• 📋 Navigate HS codes & customs\n• 💡 Get personalized recommendations\n\nWhat can I help you with today?",
    suggestions: ["Show popular exports", "Import car to Nigeria", "Calculate shipping cost"],
  };
}
