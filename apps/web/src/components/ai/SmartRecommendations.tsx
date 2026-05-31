"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp,
  Users,
  MapPin,
  ChevronRight,
  Star,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@ekda/shared";

interface RecommendedProduct {
  id: string;
  name: string;
  vendor: string;
  price: number;
  currency: string;
  unit: string;
  emoji: string;
  rating: number;
  reviewCount: number;
  reasonTag: string;
  marketplaceType: "export" | "import";
  discount: number;
}

const RECOMMENDATION_SECTIONS = [
  {
    id: "customers_also_bought",
    title: "Customers who bought cocoa also bought",
    subtitle: "Based on real purchase patterns",
    icon: Users,
    color: "text-ekda-green-600",
    bgColor: "bg-ekda-green-50 dark:bg-ekda-green-900/20",
    badge: "🧠 AI",
    products: [
      { id: "r1", name: "Cashew Nuts W320", vendor: "Cross River Farms", price: 12000, currency: "NGN", unit: "kg", emoji: "🥜", rating: 4.9, reviewCount: 453, reasonTag: "Frequently bought together", marketplaceType: "export" as const, discount: 0 },
      { id: "r2", name: "Shea Butter Raw", vendor: "Northern Naturals", price: 7500, currency: "NGN", unit: "kg", emoji: "🧈", rating: 4.8, reviewCount: 312, reasonTag: "Popular pairing", marketplaceType: "export" as const, discount: 10 },
      { id: "r3", name: "Dried Tiger Nuts", vendor: "Lagos Export Co", price: 5800, currency: "NGN", unit: "kg", emoji: "🌰", rating: 4.7, reviewCount: 187, reasonTag: "Trending combo", marketplaceType: "export" as const, discount: 0 },
      { id: "r4", name: "Locust Bean Powder", vendor: "Ogun Spice House", price: 4200, currency: "NGN", unit: "500g", emoji: "🫘", rating: 4.8, reviewCount: 294, reasonTag: "Top choice", marketplaceType: "export" as const, discount: 0 },
    ],
  },
  {
    id: "popular_uk",
    title: "🇬🇧 Popular in United Kingdom",
    subtitle: "Top picks for UK diaspora this week",
    icon: MapPin,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    badge: "🌍 UK Trending",
    products: [
      { id: "r5", name: "Premium Dried Crayfish", vendor: "Badagry Creek Exports", price: 8500, currency: "NGN", unit: "kg", emoji: "🦐", rating: 4.9, reviewCount: 1240, reasonTag: "Top seller in UK", marketplaceType: "export" as const, discount: 0 },
      { id: "r6", name: "Egusi Seeds Ground", vendor: "Ekiti Farms", price: 6200, currency: "NGN", unit: "kg", emoji: "🌿", rating: 4.7, reviewCount: 876, reasonTag: "#2 in London", marketplaceType: "export" as const, discount: 5 },
      { id: "r7", name: "Ogbono Seeds", vendor: "Anambra Farms", price: 9800, currency: "NGN", unit: "kg", emoji: "🌱", rating: 4.8, reviewCount: 654, reasonTag: "Highly rated in UK", marketplaceType: "export" as const, discount: 0 },
      { id: "r8", name: "Uda Pepper Whole", vendor: "Spice Routes NG", price: 3600, currency: "NGN", unit: "200g", emoji: "🌶️", rating: 4.6, reviewCount: 423, reasonTag: "Diaspora favourite", marketplaceType: "export" as const, discount: 15 },
    ],
  },
  {
    id: "eid_bundles",
    title: "🌙 Eid & Ramadan Bundles",
    subtitle: "Curated packs for celebrations",
    icon: Sparkles,
    color: "text-ekda-gold-600",
    bgColor: "bg-ekda-gold-50 dark:bg-ekda-gold-900/20",
    badge: "🎁 Seasonal",
    products: [
      { id: "r9", name: "Ramadan Grocery Pack", vendor: "EKDA Bundles", price: 45000, currency: "NGN", unit: "pack", emoji: "📦", rating: 4.9, reviewCount: 234, reasonTag: "Eid Special", marketplaceType: "export" as const, discount: 20 },
      { id: "r10", name: "Halal Smoked Fish Pack", vendor: "Kwara Fish Co", price: 18500, currency: "NGN", unit: "pack", emoji: "🐟", rating: 4.7, reviewCount: 189, reasonTag: "Halal Certified", marketplaceType: "export" as const, discount: 0 },
      { id: "r11", name: "Dates & Nuts Combo", vendor: "Northern Farms", price: 22000, currency: "NGN", unit: "pack", emoji: "🌴", rating: 4.8, reviewCount: 156, reasonTag: "Eid favourite", marketplaceType: "export" as const, discount: 0 },
      { id: "r12", name: "Kunu & Zobo Mix", vendor: "Abuja Natural Drinks", price: 8900, currency: "NGN", unit: "pack", emoji: "🧃", rating: 4.6, reviewCount: 98, reasonTag: "Festive special", marketplaceType: "export" as const, discount: 0 },
    ],
  },
  {
    id: "price_drops",
    title: "📉 Price Drops This Week",
    subtitle: "AI detected price reductions on commodities",
    icon: TrendingUp,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-900/20",
    badge: "🔥 Limited",
    products: [
      { id: "r13", name: "Palm Oil 10L", vendor: "Ogun Premium", price: 62000, currency: "NGN", unit: "10L", emoji: "🫙", rating: 4.7, reviewCount: 892, reasonTag: "Was ₦72,000", marketplaceType: "export" as const, discount: 14 },
      { id: "r14", name: "Garri Ijebu Coarse", vendor: "Southwest Farms", price: 28000, currency: "NGN", unit: "10kg", emoji: "🌾", rating: 4.8, reviewCount: 1100, reasonTag: "Harvest season price", marketplaceType: "export" as const, discount: 12 },
      { id: "r15", name: "iPhone 14 Pro 128GB", vendor: "Dubai Tech Hub", price: 890000, currency: "NGN", unit: "unit", emoji: "📱", rating: 4.8, reviewCount: 567, reasonTag: "Price down 8%", marketplaceType: "import" as const, discount: 8 },
      { id: "r16", name: "Bitter Kola 500g", vendor: "Edo Forest Farms", price: 6800, currency: "NGN", unit: "500g", emoji: "🌰", rating: 4.7, reviewCount: 445, reasonTag: "Seasonal drop", marketplaceType: "export" as const, discount: 18 },
    ],
  },
];

function ProductMiniCard({ product }: { product: RecommendedProduct }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="flex-shrink-0 w-44 rounded-2xl border border-border bg-card overflow-hidden group cursor-pointer hover:shadow-lg hover:shadow-black/5 transition-shadow"
    >
      <div className="relative h-28 bg-muted flex items-center justify-center">
        <span className="text-5xl">{product.emoji}</span>
        {(product.discount ?? 0) > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
            -{product.discount}%
          </div>
        )}
        <div className={`absolute top-2 right-2 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
          product.marketplaceType === "export"
            ? "bg-ekda-green-100 dark:bg-ekda-green-900/40 text-ekda-green-700 dark:text-ekda-green-400"
            : "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400"
        }`}>
          {product.reasonTag}
        </div>
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-xs leading-snug line-clamp-2 group-hover:text-primary transition-colors mb-1">
          {product.name}
        </h4>
        <p className="text-[10px] text-muted-foreground mb-2">{product.vendor}</p>
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-2.5 w-2.5 fill-ekda-gold-400 text-ekda-gold-400" />
          <span className="text-[10px] font-medium">{product.rating}</span>
          <span className="text-[9px] text-muted-foreground">({product.reviewCount})</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-foreground">
              {formatCurrency(product.price, product.currency as any)}
            </div>
            {(product.discount ?? 0) > 0 && (
              <div className="text-[9px] text-muted-foreground line-through">
                {formatCurrency(Math.round(product.price / (1 - (product.discount ?? 0) / 100)), product.currency as any)}
              </div>
            )}
          </div>
          <button className="h-6 w-6 rounded-lg bg-primary text-white flex items-center justify-center text-xs hover:bg-primary/90 transition-colors">
            +
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export function SmartRecommendations() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-ekda-green-600 to-ekda-green-800 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Personalized For You</h2>
              <p className="text-sm text-muted-foreground">
                AI-powered recommendations based on trends and purchase patterns
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>

        <div className="space-y-12">
          {RECOMMENDATION_SECTIONS.map((section, sectionIdx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: sectionIdx * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`h-9 w-9 rounded-xl ${section.bgColor} flex items-center justify-center`}>
                    <section.icon className={`h-4 w-4 ${section.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">{section.title}</h3>
                    <p className="text-xs text-muted-foreground">{section.subtitle}</p>
                  </div>
                  <Badge variant="gold" className="text-[10px] px-2 py-0.5 ml-1">
                    {section.badge}
                  </Badge>
                </div>
                <button className="text-xs text-primary hover:underline flex items-center gap-0.5">
                  See all <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin -mx-4 px-4">
                {section.products.map((product) => (
                  <ProductMiniCard key={product.id} product={product} />
                ))}
                <div className="flex-shrink-0 w-44 rounded-2xl border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/30 hover:bg-muted/30 transition-all group">
                  <div className="text-center p-4">
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary mx-auto mb-2 transition-colors" />
                    <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors font-medium">
                      View all
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
