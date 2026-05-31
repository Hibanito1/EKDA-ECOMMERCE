import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { gateway, amount, currency, email, metadata, order_id } =
      await req.json();

    if (!gateway || !amount || !email || !order_id) {
      return NextResponse.json(
        { error: "gateway, amount, email, and order_id are required" },
        { status: 400 }
      );
    }

    switch (gateway) {
      case "paystack": {
        // In production, call Paystack API:
        // const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY);
        // const response = await paystack.transaction.initialize({ ... });

        return NextResponse.json({
          success: true,
          gateway: "paystack",
          authorization_url: `https://checkout.paystack.com/mock_${order_id}`,
          access_code: `mock_access_${Date.now()}`,
          reference: `EKDA_${order_id}_${Date.now()}`,
          message: "Authorization URL created",
        });
      }

      case "stripe": {
        // In production, call Stripe API:
        // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        // const session = await stripe.checkout.sessions.create({ ... });

        const amount_cents = Math.round(
          currency === "USD" ? amount * 100 : amount / 16 // Rough NGN to USD conversion for demo
        );

        return NextResponse.json({
          success: true,
          gateway: "stripe",
          session_id: `cs_mock_${order_id}`,
          url: `https://checkout.stripe.com/mock_${order_id}`,
          amount_cents,
          currency: currency.toLowerCase() === "ngn" ? "usd" : currency.toLowerCase(),
        });
      }

      case "monnify": {
        // In production, call Monnify API
        return NextResponse.json({
          success: true,
          gateway: "monnify",
          checkout_url: `https://sandbox.sdk.monnify.com/checkout/mock_${order_id}`,
          transaction_reference: `MNFY|MOCK|${order_id}|${Date.now()}`,
          amount_payable: amount,
          currency_code: currency,
        });
      }

      default:
        return NextResponse.json(
          { error: `Unsupported payment gateway: ${gateway}` },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Payment API error:", error);
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const reference = searchParams.get("reference");
  const gateway = searchParams.get("gateway");

  if (!reference) {
    return NextResponse.json({ error: "reference required" }, { status: 400 });
  }

  // Simulate payment verification
  return NextResponse.json({
    success: true,
    status: "success",
    gateway,
    reference,
    amount: 196500,
    currency: "NGN",
    paid_at: new Date().toISOString(),
    customer: { email: "customer@example.com" },
    metadata: { order_id: reference.split("_")[1] },
  });
}
