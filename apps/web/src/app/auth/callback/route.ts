import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "@ekda/database";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const role = requestUrl.searchParams.get("role");

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({
      cookies: () => cookieStore,
    });
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect based on role
  const redirectPath = role ? `/auth/onboarding?role=${role}` : "/dashboard";
  return NextResponse.redirect(new URL(redirectPath, requestUrl.origin));
}
