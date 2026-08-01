import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Escrow Integration Handoff",
  description: "Production escrow integration requirements for EKDA's payment protection system",
};

export default function EscrowDemoPage() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <div className="rounded-3xl border bg-card p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary mb-3">
          Production handoff
        </p>
        <h1 className="text-3xl font-bold mb-4">Escrow simulation removed</h1>
        <p className="text-muted-foreground mb-6">
          EKDA no longer ships a fake escrow animation or simulated release
          lifecycle. Real-world developers should wire this surface to verified
          payment webhooks, Supabase escrow records, carrier milestone evidence,
          payout APIs, refund rules, and immutable audit logs.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
          <li>Create escrow only after a payment provider verifies funds.</li>
          <li>Release funds only after authenticated carrier/admin milestones.</li>
          <li>Use idempotency keys for webhook, payout, and refund operations.</li>
          <li>Persist every escrow transition to audit logs before responding.</li>
        </ul>
      </div>
    </div>
  );
}
