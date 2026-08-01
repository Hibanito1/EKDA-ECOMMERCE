import { NextResponse } from "next/server";

/**
 * Legacy demo login endpoint.
 *
 * Demo auth bypasses have been removed for real-world handoff. Keep this route
 * as an explicit 410 so old clients fail closed instead of creating fake
 * sessions.
 * POST /api/demo/login
 */
export async function POST() {
  return NextResponse.json(
    {
      error: "Demo login has been removed. Wire Supabase Auth for real authentication.",
      code: "DEMO_AUTH_REMOVED",
    },
    { status: 410 },
  );
}

/**
 * Get all demo users for quick login panel
 * GET /api/demo/login
 */
export async function GET() {
  return NextResponse.json(
    {
      error: "Demo users have been removed. Seed real users through Supabase Auth and migrations.",
      code: "DEMO_USERS_REMOVED",
    },
    { status: 410 },
  );
}
