import type {
  SupportedCurrency,
  ProductCategory,
  MarketplaceType,
  CargoType,
  OrderStatus,
  UserRole,
} from "./types";

// ─── Currency ────────────────────────────────────────────────────────────────

export const SUPPORTED_CURRENCIES: SupportedCurrency[] = [
  "NGN",
  "USD",
  "GBP",
  "EUR",
  "CAD",
  "AUD",
];

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
  CAD: "CA$",
  AUD: "A$",
};

export const CURRENCY_NAMES: Record<SupportedCurrency, string> = {
  NGN: "Nigerian Naira",
  USD: "US Dollar",
  GBP: "British Pound",
  EUR: "Euro",
  CAD: "Canadian Dollar",
  AUD: "Australian Dollar",
};

// ─── EKDA Commission ─────────────────────────────────────────────────────────

export const EKDA_COMMISSION_RATE = 0.1; // 10%
export const ESCROW_FIRST_RELEASE_RATE = 0.5; // 50% on carrier pickup
export const ESCROW_SECOND_RELEASE_RATE = 0.5; // 50% on arrival at destination

// ─── Product Categories ───────────────────────────────────────────────────────

export const PRODUCT_CATEGORIES: Record<
  ProductCategory,
  { label: string; icon: string; marketplaceType: MarketplaceType }
> = {
  groceries: {
    label: "African Groceries",
    icon: "🌿",
    marketplaceType: "export",
  },
  dried_produce: {
    label: "Dried Produce",
    icon: "🌾",
    marketplaceType: "export",
  },
  frozen_produce: {
    label: "Frozen Produce",
    icon: "❄️",
    marketplaceType: "export",
  },
  agri_commodities: {
    label: "Agri Commodities",
    icon: "🌱",
    marketplaceType: "export",
  },
  electronics: {
    label: "Electronics",
    icon: "📱",
    marketplaceType: "import",
  },
  vehicles: {
    label: "Vehicles & Cars",
    icon: "🚗",
    marketplaceType: "import",
  },
  machinery: {
    label: "Machinery",
    icon: "⚙️",
    marketplaceType: "import",
  },
  general_goods: {
    label: "General Goods",
    icon: "📦",
    marketplaceType: "import",
  },
};

// ─── Cargo Types ─────────────────────────────────────────────────────────────

export const CARGO_TYPE_INFO: Record<
  CargoType,
  { label: string; icon: string; description: string }
> = {
  air: {
    label: "Air Freight",
    icon: "✈️",
    description: "Fast delivery, 3–7 days. Best for small, high-value items.",
  },
  sea: {
    label: "Sea Freight",
    icon: "🚢",
    description:
      "Cost-effective for bulk. 20–45 days. Ideal for containers & heavy cargo.",
  },
  road: {
    label: "Road Transport",
    icon: "🚛",
    description: "Best for intra-Africa routes. 2–10 days.",
  },
  mixed: {
    label: "Multi-Modal",
    icon: "🔄",
    description: "Combination of air, sea, and road for optimal routing.",
  },
};

// ─── Nigerian Ports ───────────────────────────────────────────────────────────

export const NIGERIAN_SEAPORTS = [
  { name: "Apapa Port, Lagos", code: "NGAPP" },
  { name: "Tin Can Island Port, Lagos", code: "NGTCI" },
  { name: "Onne Port, Port Harcourt", code: "NGPHC" },
  { name: "Calabar Port", code: "NGCBQ" },
  { name: "Warri Port", code: "NGWRI" },
];

export const NIGERIAN_AIRPORTS = [
  { name: "Murtala Muhammed International, Lagos", code: "LOS" },
  { name: "Nnamdi Azikiwe International, Abuja", code: "ABV" },
  { name: "Port Harcourt International", code: "PHC" },
  { name: "Mallam Aminu Kano International", code: "KAN" },
];

// ─── Order Status Flow ────────────────────────────────────────────────────────

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Payment Pending",
  payment_confirmed: "Payment Confirmed",
  processing: "Processing",
  carrier_assigned: "Carrier Assigned",
  picked_up: "Picked Up",
  in_transit: "In Transit",
  arrived_at_port: "Arrived at Destination Port",
  customs_clearance: "Customs Clearance",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  disputed: "Disputed",
  refunded: "Refunded",
};

export const ORDER_STATUS_COLORS: Record<
  OrderStatus,
  "default" | "blue" | "yellow" | "green" | "red"
> = {
  pending: "yellow",
  payment_confirmed: "blue",
  processing: "blue",
  carrier_assigned: "blue",
  picked_up: "blue",
  in_transit: "blue",
  arrived_at_port: "blue",
  customs_clearance: "yellow",
  out_for_delivery: "blue",
  delivered: "green",
  cancelled: "red",
  disputed: "red",
  refunded: "default",
};

// ─── User Roles ───────────────────────────────────────────────────────────────

export const USER_ROLE_INFO: Record<
  UserRole,
  { label: string; description: string; icon: string }
> = {
  customer: {
    label: "Customer",
    description: "Shop for African goods or import international products",
    icon: "🛍️",
  },
  vendor: {
    label: "Vendor",
    description: "Sell African exports or international imports",
    icon: "🏪",
  },
  enterprise: {
    label: "Enterprise / Bulk Buyer",
    description: "Buy in bulk or full container loads",
    icon: "🏢",
  },
  carrier: {
    label: "Carrier / Logistics",
    description: "Provide shipping and logistics services",
    icon: "🚢",
  },
  admin: {
    label: "EKDA Admin",
    description: "Platform administration and oversight",
    icon: "⚡",
  },
};

// ─── Document Types ───────────────────────────────────────────────────────────

export const DOCUMENT_TYPE_LABELS = {
  phytosanitary: "Phytosanitary Certificate",
  certificate_of_origin: "Certificate of Origin",
  bill_of_lading: "Bill of Lading",
  import_declaration: "Import Declaration",
  export_declaration: "Export Declaration",
  commercial_invoice: "Commercial Invoice",
  packing_list: "Packing List",
  insurance_certificate: "Insurance Certificate",
  government_id: "Government-issued ID",
  business_registration: "Business Registration",
  tax_identification: "Tax Identification",
  bank_statement: "Bank Statement",
};

// ─── Air Cargo Restrictions ───────────────────────────────────────────────────

export const AIR_CARGO_RESTRICTED_CATEGORIES: ProductCategory[] = [
  "frozen_produce",
  "agri_commodities",
];

export const AIR_CARGO_RESTRICTED_HS_PREFIXES = [
  "01", // Live animals
  "02", // Meat
  "03", // Fish
  "06", // Live trees/plants
  "07", // Vegetables
  "08", // Fruits/nuts
  "10", // Cereals
];
