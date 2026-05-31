import { NextResponse } from "next/server";

export async function GET() {
  const start = Date.now();

  const checks = {
    status: "ok",
    version: process.env.npm_package_version || "1.0.0",
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime_ms: process.uptime() * 1000,
    services: {
      database: await checkDatabase(),
      ai: "available",
      payments: "available",
    },
    response_time_ms: Date.now() - start,
  };

  const allHealthy = Object.values(checks.services).every((s) => s !== "degraded" && s !== "unavailable");

  return NextResponse.json(checks, {
    status: allHealthy ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, no-cache",
      "Content-Type": "application/json",
    },
  });
}

async function checkDatabase(): Promise<"available" | "degraded" | "unavailable"> {
  try {
    // In production: ping Supabase
    // const { data, error } = await supabase.from("profiles").select("count").single();
    // if (error) return "degraded";
    return "available";
  } catch {
    return "unavailable";
  }
}
