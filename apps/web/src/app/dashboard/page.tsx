"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// In demo mode, the login flow redirects directly to the right dashboard.
// This catch-all handles direct visits to /dashboard and sends them to vendor
// as a sensible default (the demo banner tells users to login first).
export default function DashboardPage() {
  const router = useRouter();
  useEffect(() => {
    // Default to vendor dashboard; real auth would determine actual role.
    router.replace("/dashboard/vendor");
  }, [router]);
  return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin h-8 w-8 rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}
