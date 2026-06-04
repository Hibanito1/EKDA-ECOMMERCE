import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Customer Overview" };

export default function DashboardCustomerPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-muted flex items-center justify-center text-2xl">
          🏠
        </div>
        <div>
          <h1 className="text-2xl font-bold">Customer Overview</h1>
          <p className="text-muted-foreground text-sm">Your orders, wallet, and activity</p>
        </div>
      </div>
      <div className="p-12 rounded-3xl border-2 border-dashed border-border text-center space-y-4">
        <div className="text-5xl">🚧</div>
        <h2 className="text-lg font-semibold">Coming Soon</h2>
        <p className="text-muted-foreground text-sm max-w-sm mx-auto">
          This section is under development. Connect the real Supabase backend to activate full functionality.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
