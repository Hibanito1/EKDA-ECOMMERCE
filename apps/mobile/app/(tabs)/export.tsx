import { IntegrationRequired } from "../../components/IntegrationRequired";

export default function ExportTab() {
  return (
    <IntegrationRequired
      badge="African Exports"
      title="Export catalog simulation removed"
      description="The export marketplace must read verified products, vendors, images, HS codes, stock, pricing, and cargo rules from the production backend."
      requirements={[
        "Fetch active export products from Supabase with pagination, search, filters, and image URLs.",
        "Show only vendors with approved KYC and products with approved compliance metadata.",
        "Use real HS classifications and cargo restrictions from backend records.",
        "Add to cart through the shared cart/order API instead of local mock arrays.",
      ]}
    />
  );
}
