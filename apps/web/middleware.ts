import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { authLimiter, apiLimiter, getIdentifier } from "./src/lib/rate-limit";

// ─── Security Headers ─────────────────────────────────────────────────────────

const SECURITY_HEADERS = {
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(self), payment=(self)",
  "X-DNS-Prefetch-Control": "on",
};

const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://checkout.paystack.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co https://images.unsplash.com https://lh3.googleusercontent.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co https://api.stripe.com https://api.paystack.co wss://*.supabase.co",
  "frame-src https://js.stripe.com https://checkout.paystack.com",
  "media-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

// ─── Protected Routes ─────────────────────────────────────────────────────────

const PROTECTED_ROUTES = [
  "/dashboard",
  "/api/escrow",
  "/api/payments",
  "/api/kyc",
  "/onboarding/kyc",
];

const RATE_LIMITED_ROUTES: Record<string, (id: string) => { success: boolean; message?: string }> = {
  "/api/ai-chat": (id) => apiLimiter(id),
  "/api/hs-code": (id) => apiLimiter(id),
  "/api/risk-score": (id) => apiLimiter(id),
  "/api/landed-cost": (id) => apiLimiter(id),
  "/api/demand-forecast": (id) => apiLimiter(id),
  "/auth/login": (id) => authLimiter(id),
  "/auth/register": (id) => authLimiter(id),
  "/api/kyc": (id) => apiLimiter(id),
};

// ─── Input Sanitization ───────────────────────────────────────────────────────

function sanitizeInput(value: string): string {
  return value
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const identifier = getIdentifier(request);
  const response = NextResponse.next();

  // ─── Apply Security Headers ────────────────────────────────────────────────

  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Only set CSP in production to avoid dev errors
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY);
  }

  // ─── Rate Limiting ─────────────────────────────────────────────────────────

  for (const [route, limiter] of Object.entries(RATE_LIMITED_ROUTES)) {
    if (pathname.startsWith(route)) {
      const result = limiter(identifier);
      if (!result.success) {
        return NextResponse.json(
          {
            error: result.message || "Rate limit exceeded",
            retry_after: Math.ceil((result as any).resetAt - Date.now()) / 1000,
          },
          {
            status: 429,
            headers: {
              "Retry-After": String(Math.ceil(((result as any).resetAt - Date.now()) / 1000)),
              "X-RateLimit-Limit": "100",
              "X-RateLimit-Remaining": "0",
            },
          }
        );
      }
      response.headers.set("X-RateLimit-Remaining", String((result as any).remaining ?? 0));
      break;
    }
  }

  // ─── Bot Protection on Auth Routes ─────────────────────────────────────────

  if (pathname.startsWith("/auth/") && request.method === "POST") {
    const userAgent = request.headers.get("user-agent") || "";
    const isSuspiciousBot =
      userAgent === "" ||
      userAgent.includes("curl") ||
      userAgent.includes("python-requests") ||
      userAgent.includes("Go-http-client");

    if (isSuspiciousBot && process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Access denied" },
        { status: 403 }
      );
    }
  }

  // ─── Cache Headers for Static Assets ──────────────────────────────────────

  if (
    pathname.startsWith("/_next/static") ||
    pathname.startsWith("/icons") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".jpg") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".ico")
  ) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
