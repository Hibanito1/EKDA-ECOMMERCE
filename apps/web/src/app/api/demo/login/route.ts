import { NextRequest, NextResponse } from "next/server";
import {
  validateDemoCredentials,
  getDemoRedirectPath,
  DEMO_CREDENTIALS,
  DEMO_MODE,
} from "@/lib/demo";

/**
 * Demo login endpoint — bypasses Supabase Auth for testing.
 * All credential validation uses @ekda/demo → validateDemoCredentials().
 */
export async function POST(req: NextRequest) {
  if (!DEMO_MODE) {
    return NextResponse.json({ error: "Demo mode is not enabled" }, { status: 403 });
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Single source of truth: @ekda/demo validateDemoCredentials
    const result = validateDemoCredentials(email, password);

    if (!result.valid || !result.user) {
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    const { user } = result;
    const redirectPath = getDemoRedirectPath(user.role);

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        kyc_status: user.kyc_status,
        is_verified: user.is_verified,
        demo_mode: true,
      },
      session: {
        access_token: user.token,
        token_type: "bearer",
        expires_in: 3600,
      },
      redirect_to: redirectPath,
      message: `Welcome! You're logged in as ${user.role} in demo mode.`,
    });
  } catch (error) {
    return NextResponse.json({ error: "Demo login failed" }, { status: 500 });
  }
}

/**
 * Get all demo credentials — used by quick-login UIs.
 * Returns DEMO_CREDENTIALS from @ekda/demo (single source of truth).
 */
export async function GET() {
  if (!DEMO_MODE) {
    return NextResponse.json({ error: "Demo mode is not enabled" }, { status: 403 });
  }

  return NextResponse.json({
    demo_users: DEMO_CREDENTIALS,
    note: "All demo transactions are fully simulated. No real payments, no real documents needed.",
  });
}
