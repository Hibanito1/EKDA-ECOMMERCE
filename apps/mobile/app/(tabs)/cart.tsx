import { IntegrationRequired } from "../../components/IntegrationRequired";

export default function CartTab() {
  return (
    <IntegrationRequired
      badge="Checkout"
      title="Cart simulation removed"
      description="The mobile cart must be connected to the shared cart store, product database, carrier quotes, payment initialization, and escrow records before real users can checkout."
      requirements={[
        "Load cart items from authenticated user state or persistent backend storage.",
        "Calculate totals from live products, inventory, taxes, shipping quotes, and commission rules.",
        "Create orders only after real payment gateway initialization succeeds.",
        "Show escrow status from verified payment and milestone records, not local mock data.",
      ]}
    />
  );
}
