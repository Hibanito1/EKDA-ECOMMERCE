/**
 * In-memory rate limiter for API routes.
 * For production, use Upstash Redis:
 * import { Ratelimit } from "@upstash/ratelimit";
 * import { Redis } from "@upstash/redis";
 */

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 60000);

export function rateLimit(config: RateLimitConfig) {
  const { windowMs, max, message = "Too many requests. Please try again later." } = config;

  return function checkRateLimit(identifier: string): {
    success: boolean;
    remaining: number;
    resetAt: number;
    message?: string;
  } {
    const now = Date.now();
    const key = identifier;
    const entry = store.get(key);

    if (!entry || entry.resetAt < now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      return { success: true, remaining: max - 1, resetAt: now + windowMs };
    }

    if (entry.count >= max) {
      return {
        success: false,
        remaining: 0,
        resetAt: entry.resetAt,
        message,
      };
    }

    entry.count++;
    return { success: true, remaining: max - entry.count, resetAt: entry.resetAt };
  };
}

// Pre-configured limiters for different endpoints
export const aiChatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,
  message: "AI chat rate limit exceeded. Please wait before sending more messages.",
});

export const hsCodeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  message: "HS Code classification rate limit exceeded. Please wait 1 minute.",
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: "Too many login attempts. Please wait 15 minutes.",
});

export const kycLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: "Too many KYC submissions. Please wait before trying again.",
});

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: "API rate limit exceeded.",
});

export function getIdentifier(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0]!.trim() : "unknown";
  const url = new URL(req.url);
  return `${ip}:${url.pathname}`;
}
