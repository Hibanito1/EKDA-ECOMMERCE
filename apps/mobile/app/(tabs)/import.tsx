import { IntegrationRequired } from "../../components/IntegrationRequired";

export default function ImportTab() {
  return (
    <IntegrationRequired
      badge="Global Imports"
      title="Import catalog simulation removed"
      description="The import marketplace must be backed by real international vendor listings, landed-cost data, cargo restrictions, and carrier quotes."
      requirements={[
        "Fetch active import listings from Supabase or an approved marketplace service.",
        "Display real origin, seller, inspection, document, and availability data.",
        "Calculate landed cost from validated HS codes, live FX rates, freight quotes, and customs rules.",
        "Route checkout through verified payment and escrow APIs before order creation.",
      ]}
    />
  );
}
