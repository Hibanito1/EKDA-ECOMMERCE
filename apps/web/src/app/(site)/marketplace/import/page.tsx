"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Grid3X3,
  List,
  Star,
  Heart,
  Plus,
  Minus,
  Filter,
  Shield,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ProductCardSkeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@ekda/shared";
import { IMPORT_PRODUCTS } from "@ekda/demo";
import type { DemoProduct } from "@ekda/demo";
import type { Product } from "@ekda/shared";

const MOCK_IMPORT_PRODUCTS = IMPORT_PRODUCTS;

const IMPORT_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "vehicles", label: "🚗 Vehicles" },
  { id: "electronics", label: "📱 Electronics" },
  { id: "machinery", label: "⚙️ Machinery" },
  { id: "general_goods", label: "📦 General Goods" },
];

function ImportProductCard({ product }: { product: DemoProduct }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const originFlags: Record<string, string> = {
    US: "🇺🇸", GB: "🇬🇧", DE: "🇩🇪", CN: "🇨🇳", AE: "🇦🇪", JP: "🇯🇵",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden group cursor-pointer border hover:shadow-xl hover:shadow-black/5 transition-all duration-300">
        <div className="relative h-52 overflow-hidden bg-muted">
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
            style={{ backgroundColor: "#f0fdf4" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          <div className="absolute top-3 left-3 flex gap-1.5">
            <Badge variant="import" className="text-[10px] px-1.5 py-0.5">
              🌍 Import
            </Badge>
            {product.origin && (
              <Badge className="text-[10px] px-1.5 py-0.5 bg-black/60">
                {originFlags[product.origin] || "🌍"} {product.origin}
              </Badge>
            )}
          </div>

          <button
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            onClick={(e) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
          >
            <Heart className={cn("h-4 w-4 transition-colors", isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600")} />
          </button>

          {/* Sea freight badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-blue-600/90 text-white px-2 py-1 rounded-full text-[10px] font-medium">
            <Truck className="h-3 w-3" />
            Sea Freight Only
          </div>
        </div>

        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1 capitalize">
            {product.category?.replace("_", " ")}
          </p>
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center gap-1 mb-3">
            <Star className="h-3.5 w-3.5 fill-ekda-gold-400 text-ekda-gold-400" />
            <span className="text-sm font-medium">{product.rating}</span>
            <span className="text-xs text-muted-foreground">
              ({product.reviews?.toLocaleString()})
            </span>
          </div>

          {product.hsCode && (
            <div className="flex items-center gap-1 mb-3">
              <span className="text-xs text-muted-foreground">HS:</span>
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                {product.hsCode}
              </code>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-foreground">
                {formatCurrency(product.price || 0, product.currency as any)}
              </span>
              <span className="text-xs text-muted-foreground block">
                + shipping & duties
              </span>
            </div>
            <Button size="sm" className="h-8 rounded-lg px-3">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function ImportMarketplacePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const filtered = MOCK_IMPORT_PRODUCTS.filter((p) => {
    const matchesSearch =
      !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.tags?.some((t) => t.includes(search.toLowerCase()));
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-blue-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <Badge variant="import" className="mb-4 text-sm px-4 py-1.5">
              🌍 Global Imports
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Import Quality Goods to Nigeria
            </h1>
            <p className="text-white/70 text-lg mb-8">
              Cars, trucks, electronics, machinery from USA, UK, China, Germany
              and beyond — delivered to your port or doorstep.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { icon: "🚢", text: "Sea Freight Specialists" },
                { icon: "🛡️", text: "Escrow Protected" },
                { icon: "📋", text: "Customs Cleared" },
                { icon: "🤖", text: "AI HS Code Verified" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1.5 text-sm">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
              <input
                type="search"
                placeholder="Search for Toyota, iPhone, excavator..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 text-base"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-thin">
          {IMPORT_CATEGORIES.map((cat) => (
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

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-muted-foreground">{filtered.length} products</span>
          <div className="flex border border-border rounded-xl overflow-hidden">
            <button onClick={() => setViewMode("grid")} className={cn("p-2 transition-colors", viewMode === "grid" ? "bg-primary text-white" : "hover:bg-muted")}>
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button onClick={() => setViewMode("list")} className={cn("p-2 transition-colors", viewMode === "list" ? "bg-primary text-white" : "hover:bg-muted")}>
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className={cn("grid gap-5", viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
            {filtered.map((product) => (
              <ImportProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
