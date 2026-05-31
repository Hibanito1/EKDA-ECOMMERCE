"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronDown,
  Star,
  Heart,
  Plus,
  Minus,
  ShoppingCart,
  Filter,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@ekda/shared";
import type { Product, MarketplaceType, ProductCategory } from "@ekda/shared";

// Mock product data for the export marketplace
const MOCK_EXPORT_PRODUCTS: Partial<Product>[] = [
  {
    id: "1",
    name: "Premium Dried Crayfish",
    description: "Sun-dried freshwater crayfish from Badagry Creek. Rich in protein, essential for West African soups.",
    category: "dried_produce",
    marketplace_type: "export",
    price: 8500,
    currency: "NGN",
    unit: "kg",
    min_order_quantity: 1,
    weight_kg: 1,
    origin_country: "NG",
    rating: 4.9,
    review_count: 1240,
    images: ["https://images.unsplash.com/photo-1571070083701-db30ea3b62f7?w=400&q=80"],
    cargo_recommendation: "sea",
    hs_code: { code: "0306.17", description: "Dried shrimps and prawns", ai_confidence: 0.97, ai_suggested: true, verified_by_admin: true, restricted_air_cargo: false },
    tags: ["crayfish", "dried", "protein", "soup"],
  },
  {
    id: "2",
    name: "Ogiri — Fermented Locust Bean",
    description: "Traditional Yoruba condiment made from fermented seeds. Adds deep umami flavor to Nigerian soups.",
    category: "groceries",
    marketplace_type: "export",
    price: 4200,
    currency: "NGN",
    unit: "pack",
    min_order_quantity: 2,
    weight_kg: 0.5,
    origin_country: "NG",
    rating: 4.8,
    review_count: 876,
    images: ["https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=400&q=80"],
    cargo_recommendation: "sea",
    hs_code: { code: "2103.90", description: "Other sauces and preparations", ai_confidence: 0.89, ai_suggested: true, verified_by_admin: false, restricted_air_cargo: false },
    tags: ["ogiri", "condiment", "fermented", "yoruba"],
  },
  {
    id: "3",
    name: "Achi Seed Powder",
    description: "Ground Brachystegia eurycoma seeds. Natural thickener for traditional Igbo soups.",
    category: "groceries",
    marketplace_type: "export",
    price: 3800,
    currency: "NGN",
    unit: "500g",
    min_order_quantity: 1,
    weight_kg: 0.5,
    origin_country: "NG",
    rating: 4.7,
    review_count: 652,
    images: ["https://images.unsplash.com/photo-1548345680-f5475ea5df84?w=400&q=80"],
    cargo_recommendation: "sea",
    tags: ["achi", "thickener", "igbo", "soup"],
  },
  {
    id: "4",
    name: "Frozen Stockfish (Okporoko)",
    description: "Norwegian-style air-dried cod, rehydrated and frozen. Essential for traditional Nigerian soups.",
    category: "frozen_produce",
    marketplace_type: "export",
    price: 22000,
    currency: "NGN",
    unit: "kg",
    min_order_quantity: 2,
    weight_kg: 2,
    origin_country: "NG",
    rating: 4.9,
    review_count: 2100,
    images: ["https://images.unsplash.com/photo-1559411237-e1b0d8e9c1df?w=400&q=80"],
    cargo_recommendation: "sea",
    cargo_restriction_reason: "Frozen goods require specialized cold chain handling. Air freight not recommended.",
    hs_code: { code: "0305.41", description: "Dried or smoked fish", ai_confidence: 0.96, ai_suggested: true, verified_by_admin: true, restricted_air_cargo: true },
    tags: ["stockfish", "okporoko", "dried fish", "frozen"],
  },
  {
    id: "5",
    name: "Efirin (African Basil) — Dried",
    description: "Authentic Nigerian basil leaves, carefully dried and packaged. Used in jollof rice and soups.",
    category: "dried_produce",
    marketplace_type: "export",
    price: 2500,
    currency: "NGN",
    unit: "100g",
    min_order_quantity: 3,
    weight_kg: 0.1,
    origin_country: "NG",
    rating: 4.6,
    review_count: 445,
    images: ["https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&q=80"],
    cargo_recommendation: "air",
    tags: ["efirin", "basil", "herbs", "dried"],
  },
  {
    id: "6",
    name: "Obi Obi Kola Nuts",
    description: "Premium bitter kola from Edo State. Culturally significant for ceremonies and medicinal use.",
    category: "agri_commodities",
    marketplace_type: "export",
    price: 15000,
    currency: "NGN",
    unit: "kg",
    min_order_quantity: 1,
    weight_kg: 1,
    origin_country: "NG",
    rating: 4.8,
    review_count: 330,
    images: ["https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=400&q=80"],
    cargo_recommendation: "sea",
    tags: ["kola nut", "bitter kola", "ceremonial"],
  },
  {
    id: "7",
    name: "Palm Oil — Pure Red",
    description: "Cold-pressed pure Nigerian red palm oil. Rich in beta-carotene. No additives or preservatives.",
    category: "groceries",
    marketplace_type: "export",
    price: 6800,
    currency: "NGN",
    unit: "litre",
    min_order_quantity: 5,
    weight_kg: 5,
    origin_country: "NG",
    rating: 4.7,
    review_count: 3200,
    images: ["https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80"],
    cargo_recommendation: "sea",
    tags: ["palm oil", "cooking oil", "red oil"],
  },
  {
    id: "8",
    name: "Garri — Ijebu Coarse Grade",
    description: "Coarse-grade Ijebu garri from Ogun State. Perfect for soaking with groundnuts or cooking eba.",
    category: "groceries",
    marketplace_type: "export",
    price: 3200,
    currency: "NGN",
    unit: "kg",
    min_order_quantity: 5,
    weight_kg: 5,
    origin_country: "NG",
    rating: 4.9,
    review_count: 5400,
    images: ["https://images.unsplash.com/photo-1506617420156-8e4536971650?w=400&q=80"],
    cargo_recommendation: "sea",
    tags: ["garri", "cassava", "ijebu", "eba"],
  },
];

const CATEGORIES = [
  { id: "all", label: "All Products" },
  { id: "groceries", label: "Groceries" },
  { id: "dried_produce", label: "Dried Produce" },
  { id: "frozen_produce", label: "Frozen Produce" },
  { id: "agri_commodities", label: "Agri Commodities" },
];

const SORT_OPTIONS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

function ProductCard({ product }: { product: Partial<Product> }) {
  const [qty, setQty] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden group cursor-pointer border hover:shadow-xl hover:shadow-black/5 transition-all duration-300">
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-muted">
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundImage: `url(${product.images?.[0] || ""})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {product.hs_code?.ai_suggested && (
              <Badge variant="gold" className="text-[10px] px-1.5 py-0.5">
                🤖 AI HS Code
              </Badge>
            )}
            {product.cargo_recommendation === "sea" && (
              <Badge className="text-[10px] px-1.5 py-0.5 bg-blue-600">
                🚢 Sea Freight
              </Badge>
            )}
          </div>

          {/* Air restriction warning */}
          {product.hs_code?.restricted_air_cargo && (
            <div className="absolute top-3 right-3">
              <Badge variant="warning" className="text-[10px] px-1.5 py-0.5">
                ✈️ Air Restricted
              </Badge>
            </div>
          )}

          {/* Wishlist */}
          <button
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
          >
            <Heart
              className={cn("h-4 w-4 transition-colors", isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600")}
            />
          </button>
        </div>

        <CardContent className="p-4">
          <div className="mb-2">
            <p className="text-xs text-muted-foreground mb-1 capitalize">
              {product.category?.replace("_", " ")} · {product.origin_country}
            </p>
            <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-3">
            <Star className="h-3.5 w-3.5 fill-ekda-gold-400 text-ekda-gold-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({product.review_count?.toLocaleString()})
            </span>
          </div>

          {/* HS Code */}
          {product.hs_code?.code && (
            <div className="flex items-center gap-1 mb-3">
              <span className="text-xs text-muted-foreground">HS:</span>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                {product.hs_code.code}
              </code>
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor:
                    product.hs_code.ai_confidence > 0.9 ? "#22c55e" :
                    product.hs_code.ai_confidence > 0.7 ? "#f59e0b" : "#ef4444",
                }}
                title={`AI confidence: ${Math.round((product.hs_code.ai_confidence || 0) * 100)}%`}
              />
            </div>
          )}

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-foreground">
                {formatCurrency(product.price || 0, product.currency as any)}
              </span>
              <span className="text-xs text-muted-foreground">/{product.unit}</span>
            </div>

            {qty === 0 ? (
              <Button
                size="sm"
                onClick={() => setQty(1)}
                className="h-8 rounded-lg px-3"
              >
                <Plus className="h-3.5 w-3.5" />
                Add
              </Button>
            ) : (
              <div className="flex items-center gap-1">
                <button
                  className="h-7 w-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted transition-colors"
                  onClick={() => setQty(Math.max(0, qty - 1))}
                >
                  <Minus className="h-3 w-3" />
                </button>
                <span className="w-6 text-center text-sm font-semibold">{qty}</span>
                <button
                  className="h-7 w-7 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
                  onClick={() => setQty(qty + 1)}
                >
                  <Plus className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          {/* Min order */}
          {(product.min_order_quantity || 0) > 1 && (
            <p className="text-xs text-muted-foreground mt-2">
              Min. order: {product.min_order_quantity} {product.unit}
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ExportMarketplacePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 50000]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredProducts = MOCK_EXPORT_PRODUCTS.filter((p) => {
    const matchesSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t) => t.includes(search.toLowerCase()));
    const matchesCategory =
      activeCategory === "all" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-ekda-green-900 to-ekda-green-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <Badge variant="export" className="mb-4 text-sm px-4 py-1.5">
              🌿 African Exports
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Authentic African Products
            </h1>
            <p className="text-white/70 text-lg mb-8">
              Groceries, dried produce, agri commodities — sourced directly from
              Nigerian and African vendors. Delivered worldwide.
            </p>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
              <input
                type="search"
                placeholder="Search for crayfish, garri, palm oil..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-base"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside
            className={cn(
              "lg:w-64 flex-shrink-0",
              showFilters ? "block" : "hidden lg:block"
            )}
          >
            <div className="sticky top-20 space-y-6">
              <div>
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                  Categories
                </h3>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-xl text-sm transition-all",
                        activeCategory === cat.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                  Cargo Type
                </h3>
                <div className="space-y-2">
                  {[
                    { id: "all", label: "All Types" },
                    { id: "air", label: "✈️ Air Freight" },
                    { id: "sea", label: "🚢 Sea Freight" },
                  ].map((opt) => (
                    <label key={opt.id} className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded" defaultChecked />
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                  AI HS Code
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">Verified by Admin</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm">AI Suggested</span>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                  Min. Rating
                </h3>
                <div className="space-y-1">
                  {[4.5, 4.0, 3.5, 3.0].map((r) => (
                    <button key={r} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn("h-3.5 w-3.5", i < Math.floor(r) ? "fill-ekda-gold-400 text-ekda-gold-400" : "text-muted")}
                        />
                      ))}
                      <span>{r}+</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} products
                </span>
                <button
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-3.5 w-3.5" />
                  Filters
                </button>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-border rounded-xl px-3 py-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="flex border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn("p-2 transition-colors", viewMode === "grid" ? "bg-primary text-white" : "hover:bg-muted")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn("p-2 transition-colors", viewMode === "list" ? "bg-primary text-white" : "hover:bg-muted")}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-thin">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all",
                    activeCategory === cat.id
                      ? "bg-primary text-white"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div
                className={cn(
                  "grid gap-5",
                  viewMode === "grid"
                    ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                )}
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Load More */}
            {!loading && filteredProducts.length > 0 && (
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
