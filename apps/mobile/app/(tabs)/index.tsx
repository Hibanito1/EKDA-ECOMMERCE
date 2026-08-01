import { IntegrationRequired } from "../../components/IntegrationRequired";

export default function HomeTab() {
  return (
    <IntegrationRequired
      badge="Developer Handoff"
      title="Mobile app ready for real integrations"
      description="Sample marketplace data has been removed from the mobile app. The next team should connect authenticated APIs before enabling buyer, vendor, carrier, or admin workflows."
      requirements={[
        "Wire Supabase Auth and persist sessions securely with platform storage.",
        "Connect export/import tabs to real product APIs with search, filters, and pagination.",
        "Connect cart and checkout to payment, shipping, order, and escrow APIs.",
        "Connect notifications, order tracking, KYC, and AI assistant to production services.",
      ]}
    />
  );
}
