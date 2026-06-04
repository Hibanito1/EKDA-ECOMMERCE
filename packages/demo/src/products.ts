import type { MarketplaceType } from "@ekda/shared";

// ─── Demo Product Shape ────────────────────────────────────────────────────────
// Intentionally does NOT extend Partial<Product> because the shared Product type
// uses VendorProfile for 'vendor', but demo products use a simple vendor name string.

export interface DemoProduct {
  id: string;
  name: string;
  vendor: string;
  price: number;
  currency: "NGN" | "USD" | "GBP";
  unit: string;
  category: string;
  marketplaceType: MarketplaceType;
  emoji: string;
  rating: number;
  reviews: number;
  origin: string;
  weight: number;
  hsCode: string;
  cargo: "air" | "sea" | "road";
  airRestricted: boolean;
  inStock: boolean;
  description: string;
  tags: string[];
  /** Import duty rate (imports only) */
  duty?: string;
}

// ─── African Export Products ──────────────────────────────────────────────────

export const EXPORT_PRODUCTS: DemoProduct[] = [
  {
    id: "e1",
    name: "Premium Dried Crayfish",
    vendor: "Lagos Fresh Exports",
    price: 8500,
    currency: "NGN",
    unit: "kg",
    category: "dried_produce",
    marketplaceType: "export",
    emoji: "🦐",
    rating: 4.9,
    reviews: 1240,
    origin: "🇳🇬 Nigeria",
    weight: 1,
    hsCode: "0306.17",
    cargo: "sea",
    airRestricted: false,
    inStock: true,
    description:
      "Sun-dried freshwater crayfish from Badagry Creek. Rich in protein, essential for West African soups and stews.",
    tags: ["protein", "soup", "traditional"],
  },
  {
    id: "e2",
    name: "Palm Oil — Pure Red",
    vendor: "Ogun Premium Oils",
    price: 6800,
    currency: "NGN",
    unit: "litre",
    category: "groceries",
    marketplaceType: "export",
    emoji: "🫙",
    rating: 4.7,
    reviews: 3200,
    origin: "🇳🇬 Nigeria",
    weight: 1,
    hsCode: "1511.10",
    cargo: "sea",
    airRestricted: false,
    inStock: true,
    description: "Cold-pressed pure Nigerian red palm oil. Rich in beta-carotene. No additives.",
    tags: ["cooking", "oil", "vitamin-a"],
  },
  {
    id: "e3",
    name: "Garri Ijebu Coarse",
    vendor: "Southwest Farms",
    price: 3200,
    currency: "NGN",
    unit: "kg",
    category: "groceries",
    marketplaceType: "export",
    emoji: "🌾",
    rating: 4.9,
    reviews: 5400,
    origin: "🇳🇬 Nigeria",
    weight: 5,
    hsCode: "1903.00",
    cargo: "sea",
    airRestricted: false,
    inStock: true,
    description: "Coarse-grade Ijebu garri from Ogun State. Perfect for soaking with groundnuts or cooking eba.",
    tags: ["cassava", "eba", "staple"],
  },
  {
    id: "e4",
    name: "Frozen Stockfish (Okporoko)",
    vendor: "Badagry Fish Co",
    price: 22000,
    currency: "NGN",
    unit: "kg",
    category: "frozen_produce",
    marketplaceType: "export",
    emoji: "🐟",
    rating: 4.8,
    reviews: 2100,
    origin: "🇳🇬 Nigeria",
    weight: 2,
    hsCode: "0305.41",
    cargo: "sea",
    airRestricted: true,
    inStock: true,
    description:
      "Air-dried cod, rehydrated and frozen. Essential for traditional Nigerian soups. Sea freight only.",
    tags: ["fish", "protein", "ofe-onugbu"],
  },
  {
    id: "e5",
    name: "Egusi Seeds (Ground)",
    vendor: "Ekiti Farms",
    price: 6200,
    currency: "NGN",
    unit: "kg",
    category: "groceries",
    marketplaceType: "export",
    emoji: "🌿",
    rating: 4.7,
    reviews: 876,
    origin: "🇳🇬 Nigeria",
    weight: 1,
    hsCode: "1207.70",
    cargo: "air",
    airRestricted: false,
    inStock: true,
    description: "Ground egusi (melon seeds). Perfect for egusi soup — a West African delicacy.",
    tags: ["melon", "soup", "protein"],
  },
  {
    id: "e6",
    name: "Bitter Kola Nuts",
    vendor: "Edo Naturals",
    price: 15000,
    currency: "NGN",
    unit: "kg",
    category: "agri_commodities",
    marketplaceType: "export",
    emoji: "🌰",
    rating: 4.8,
    reviews: 330,
    origin: "🇳🇬 Nigeria",
    weight: 1,
    hsCode: "0802.80",
    cargo: "sea",
    airRestricted: false,
    inStock: true,
    description: "Premium bitter kola from Edo State. Culturally significant for ceremonies and medicinal use.",
    tags: ["kola", "ceremonial", "medicinal"],
  },
  {
    id: "e7",
    name: "Ogbono Seeds",
    vendor: "Anambra Farms",
    price: 9800,
    currency: "NGN",
    unit: "kg",
    category: "groceries",
    marketplaceType: "export",
    emoji: "🫘",
    rating: 4.8,
    reviews: 654,
    origin: "🇳🇬 Nigeria",
    weight: 1,
    hsCode: "1207.99",
    cargo: "air",
    airRestricted: false,
    inStock: true,
    description: "Wild mango seeds, dried and ground. Natural thickener for Ogbono soup.",
    tags: ["soup", "thickener", "igbo"],
  },
  {
    id: "e8",
    name: "Shea Butter (Raw)",
    vendor: "Northern Harvest",
    price: 7500,
    currency: "NGN",
    unit: "kg",
    category: "agri_commodities",
    marketplaceType: "export",
    emoji: "🧈",
    rating: 4.9,
    reviews: 2890,
    origin: "🇳🇬 Nigeria",
    weight: 1,
    hsCode: "1515.90",
    cargo: "sea",
    airRestricted: false,
    inStock: true,
    description: "Unrefined raw shea butter from Northern Nigeria. Used for skincare and cooking.",
    tags: ["cosmetics", "skincare", "cooking"],
  },
];

// ─── Global Import Products ───────────────────────────────────────────────────

export const IMPORT_PRODUCTS: DemoProduct[] = [
  {
    id: "i1",
    name: "2021 Toyota Camry XSE V6",
    vendor: "USA Auto Exports",
    price: 18500000,
    currency: "NGN",
    unit: "unit",
    category: "vehicles",
    marketplaceType: "import",
    emoji: "🚗",
    rating: 4.8,
    reviews: 143,
    origin: "🇺🇸 USA",
    weight: 1497,
    hsCode: "8703.23",
    cargo: "sea",
    airRestricted: true,
    duty: "35%",
    inStock: true,
    description:
      "Clean Carfax, 45,000 miles. V6 3.5L engine, leather interior. Port: Baltimore → Apapa.",
    tags: ["toyota", "sedan", "usa"],
  },
  {
    id: "i2",
    name: "iPhone 15 Pro Max 256GB",
    vendor: "Dubai Electronics Hub",
    price: 1150000,
    currency: "NGN",
    unit: "unit",
    category: "electronics",
    marketplaceType: "import",
    emoji: "📱",
    rating: 4.9,
    reviews: 3421,
    origin: "🇦🇪 UAE",
    weight: 0.22,
    hsCode: "8517.13",
    cargo: "air",
    airRestricted: false,
    duty: "20%",
    inStock: true,
    description: "Factory unlocked, Natural Titanium. All accessories included. Ships from Dubai warehouse.",
    tags: ["apple", "smartphone", "unlocked"],
  },
  {
    id: "i3",
    name: "Mercedes-Benz GLE 450 2022",
    vendor: "Euro Auto GmbH",
    price: 42000000,
    currency: "NGN",
    unit: "unit",
    category: "vehicles",
    marketplaceType: "import",
    emoji: "🏎️",
    rating: 4.9,
    reviews: 89,
    origin: "🇩🇪 Germany",
    weight: 2050,
    hsCode: "8703.24",
    cargo: "sea",
    airRestricted: true,
    duty: "35%",
    inStock: true,
    description: "AMG Package, Panoramic roof, 4MATIC. 38,000km. Port: Hamburg → Apapa Lagos.",
    tags: ["mercedes", "suv", "luxury"],
  },
  {
    id: "i4",
    name: "Samsung Galaxy S24 Ultra",
    vendor: "Korea Tech Direct",
    price: 890000,
    currency: "NGN",
    unit: "unit",
    category: "electronics",
    marketplaceType: "import",
    emoji: "📲",
    rating: 4.7,
    reviews: 1876,
    origin: "🇰🇷 South Korea",
    weight: 0.23,
    hsCode: "8517.13",
    cargo: "air",
    airRestricted: false,
    duty: "20%",
    inStock: true,
    description: "512GB, Titanium Black. S Pen included. 200MP camera. Ships via DHL Express.",
    tags: ["samsung", "android", "s-pen"],
  },
  {
    id: "i5",
    name: "XCMG XCT25L5 Crane 25-Ton",
    vendor: "Sinotech Equipment",
    price: 55000000,
    currency: "NGN",
    unit: "unit",
    category: "machinery",
    marketplaceType: "import",
    emoji: "🏗️",
    rating: 4.7,
    reviews: 28,
    origin: "🇨🇳 China",
    weight: 35000,
    hsCode: "8426.41",
    cargo: "sea",
    airRestricted: true,
    duty: "10%",
    inStock: true,
    description: "Brand new 25-ton mobile crane. FOB Shanghai. Complete documentation, CE certified.",
    tags: ["crane", "construction", "xcmg"],
  },
  {
    id: "i6",
    name: 'MacBook Pro 16" M3 Pro',
    vendor: "London Apple Reseller",
    price: 1850000,
    currency: "NGN",
    unit: "unit",
    category: "electronics",
    marketplaceType: "import",
    emoji: "💻",
    rating: 4.9,
    reviews: 672,
    origin: "🇬🇧 UK",
    weight: 2.1,
    hsCode: "8471.30",
    cargo: "air",
    airRestricted: false,
    duty: "10%",
    inStock: true,
    description: "18GB RAM, 512GB SSD. Space Black. Apple warranty valid in Nigeria.",
    tags: ["apple", "laptop", "professional"],
  },
];

/** All products combined */
export const ALL_PRODUCTS: DemoProduct[] = [...EXPORT_PRODUCTS, ...IMPORT_PRODUCTS];

/** Find a demo product by id */
export function getDemoProductById(id: string): DemoProduct | null {
  return ALL_PRODUCTS.find((p) => p.id === id) ?? null;
}

/** Featured products for the home screen (cross-platform safe) */
export const FEATURED_PRODUCTS = [
  EXPORT_PRODUCTS[0]!, // Crayfish
  IMPORT_PRODUCTS[1]!, // iPhone
  EXPORT_PRODUCTS[1]!, // Palm Oil
];
