import { NextRequest, NextResponse } from "next/server";
import { getDemoUserByEmail, DEMO_MODE, getDemoRedirectPath } from "@/lib/demo";
import type { UserRole } from "@ekda/shared";

/**
 * Demo login endpoint — bypasses Supabase Auth for testing
 * POST /api/demo/login
 * Body: { email: string, password: string }
 */
export async function POST(req: NextRequest) {
  if (!DEMO_MODE) {
    return NextResponse.json({ error: "Demo mode is not enabled" }, { status: 403 });
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const demoUser = getDemoUserByEmail(email);

    if (!demoUser) {
      return NextResponse.json({
        error: "Invalid demo credentials. Use demo.customer@ekda.io, demo.vendor@ekda.io, demo.carrier@ekda.io, or demo.admin@ekda.io",
      }, { status: 401 });
    }

    if (password !== demoUser.password) {
      return NextResponse.json({ error: "Password should be: Demo@12345" }, { status: 401 });
    }

    const redirectPath = getDemoRedirectPath(demoUser.role as UserRole);

    return NextResponse.json({
      success: true,
      user: {
        id: `demo-user-${demoUser.role}`,
        email: demoUser.email,
        role: demoUser.role,
        name: demoUser.name,
        kyc_status: "approved",
        is_verified: true,
        demo_mode: true,
      },
      session: {
        access_token: demoUser.token,
        token_type: "bearer",
        expires_in: 3600,
      },
      redirect_to: redirectPath,
      message: `Welcome! You're logged in as ${demoUser.role} in demo mode.`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Demo login failed" }, { status: 500 });
  }
}

/**
 * Get all demo users for quick login panel
 * GET /api/demo/login
 */
export async function GET() {
  if (!DEMO_MODE) {
    return NextResponse.json({ error: "Demo mode is not enabled" }, { status: 403 });
  }

  return NextResponse.json({
    demo_users: [
      { role: "customer", email: "demo.customer@ekda.io", password: "Demo@12345", description: "Shop, track orders, manage wishlist" },
      { role: "vendor", email: "demo.vendor@ekda.io", password: "Demo@12345", description: "List products, manage orders, AI HS codes" },
      { role: "carrier", email: "demo.carrier@ekda.io", password: "Demo@12345", description: "Bid on shipments, confirm pickups/deliveries" },
      { role: "enterprise", email: "demo.enterprise@ekda.io", password: "Demo@12345", description: "Bulk orders, B2B portal, RFQ" },
      { role: "admin", email: "demo.admin@ekda.io", password: "Demo@12345", description: "Full admin control, KYC queue, escrow" },
    ],
    note: "All demo transactions are fully simulated. No real payments, no real documents needed.",
  });
}
