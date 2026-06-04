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
import { EXPORT_PRODUCTS } from "@ekda/demo";
import type { DemoProduct } from "@ekda/demo";

// Products from @ekda/demo — single source of truth
const MOCK_EXPORT_PRODUCTS = EXPORT_PRODUCTS;
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

function ProductCard({ product }: { product: DemoProduct }) {
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
            style={{ backgroundColor: "#f0fdf4" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {true && (
              <Badge variant="gold" className="text-[10px] px-1.5 py-0.5">
                🤖 AI HS Code
              </Badge>
            )}
            {product.cargo === "sea" && (
              <Badge className="text-[10px] px-1.5 py-0.5 bg-blue-600">
                🚢 Sea Freight
              </Badge>
            )}
          </div>

          {/* Air restriction warning */}
          {product.airRestricted && (
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
              {product.category?.replace("_", " ")} · {product.origin}
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
              ({product.reviews?.toLocaleString()})
            </span>
          </div>

          {/* HS Code */}
          {product.hsCode && (
            <div className="flex items-center gap-1 mb-3">
              <span className="text-xs text-muted-foreground">HS:</span>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                {product.hsCode}
              </code>
              <div
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "#22c55e" }}
                title="AI confidence: 97%"
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
          {(product.price > 0 ? 1 : 1 || 0) > 1 && (
            <p className="text-xs text-muted-foreground mt-2">
              Min. order: {product.price > 0 ? 1 : 1} {product.unit}
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
