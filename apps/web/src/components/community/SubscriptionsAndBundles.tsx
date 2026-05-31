"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Calendar, Package, ArrowRight, CheckCircle2, Star, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@ekda/shared";
import toast from "react-hot-toast";

const SUBSCRIPTION_BOXES = [
  {
    id: "monthly_groceries",
    name: "Monthly African Grocery Box",
    description: "12 essential Nigerian grocery staples curated by our food experts, shipped monthly",
    price: 85000,
    savings: 15000,
    frequency: "monthly",
    items: ["Palm Oil 2L", "Garri 5kg", "Crayfish 500g", "Egusi 1kg", "Ogiri 3 packs", "Achi 500g", "Ogbono 500g", "Stockfish 1kg", "Shea Butter 500ml", "Bitter Kola 250g", "Tiger Nuts 500g", "Dried Pepper 200g"],
    emoji: "🥘",
    subscribers: 1847,
    rating: 4.9,
    popular: true,
  },
  {
    id: "quarterly_commodities",
    name: "Quarterly Commodity Shipment",
    description: "Bulk agri-commodity shipment for businesses and restaurants — quarterly delivery",
    price: 450000,
    savings: 75000,
    frequency: "quarterly",
    items: ["Cocoa Beans 20kg", "Cashew Nuts 20kg", "Sesame Seeds 10kg", "Ginger 5kg", "Moringa 2kg"],
    emoji: "🌾",
    subscribers: 342,
    rating: 4.8,
    popular: false,
  },
  {
    id: "bi_weekly_fresh",
    name: "Bi-Weekly Fresh Bundle",
    description: "Fresh dried produce replenished every two weeks — never run out of essentials",
    price: 42000,
    savings: 8000,
    frequency: "bi-weekly",
    items: ["Crayfish 300g", "Uziza 100g", "Ede Ube (African Pear) 400g", "Oha Leaves 200g", "Bitter Leaf 150g"],
    emoji: "🌿",
    subscribers: 921,
    rating: 4.7,
    popular: false,
  },
];

const SMART_BUNDLES = [
  {
    id: "soup_kit",
    name: "Nigerian Soup Kit",
    description: "Everything for authentic soup making — AI paired for perfect flavor balance",
    items: ["Palm Oil 1L", "Crayfish 200g", "Stockfish 500g", "Achi 200g", "Ogiri 2 packs"],
    originalPrice: 38500,
    bundlePrice: 29900,
    savings: 22,
    emoji: "🍲",
  },
  {
    id: "import_starter",
    name: "Car Import Starter Pack",
    description: "Vehicle + shipping insurance + clearing agent deposit + port fees",
    items: ["Import Documentation", "Marine Insurance", "Clearing Agent Deposit", "Port Handling Fee"],
    originalPrice: 450000,
    bundlePrice: 380000,
    savings: 16,
    emoji: "🚗",
  },
  {
    id: "diaspora_welcome",
    name: "Diaspora Welcome Pack",
    description: "12-item starter kit for Nigerian diaspora — everything you missed from home",
    items: ["Garri 5kg", "Palm Oil 2L", "Crayfish 500g", "Egusi 1kg", "+8 more"],
    originalPrice: 72000,
    bundlePrice: 59900,
    savings: 17,
    emoji: "🏠",
  },
];

export function SmartBundles() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">🎁</span>
        <h3 className="font-semibold">AI Smart Bundles</h3>
        <Badge variant="gold" className="text-[10px]">🤖 AI Curated</Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {SMART_BUNDLES.map((bundle) => (
          <Card key={bundle.id} className="group cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="text-3xl mb-2">{bundle.emoji}</div>
              <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{bundle.name}</h4>
              <p className="text-xs text-muted-foreground mb-3">{bundle.description}</p>
              <div className="text-[10px] text-muted-foreground mb-3">
                {bundle.items.join(" · ")}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-base font-bold">{formatCurrency(bundle.bundlePrice, "NGN")}</div>
                  <div className="text-xs text-muted-foreground line-through">
                    {formatCurrency(bundle.originalPrice, "NGN")}
                  </div>
                </div>
                <Badge variant="success" className="text-xs">-{bundle.savings}%</Badge>
              </div>
              <Button variant="premium" size="sm" className="w-full mt-3">
                Add Bundle
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function SubscriptionBoxes() {
  const [subscribing, setSubscribing] = useState<string | null>(null);

  const handleSubscribe = (boxId: string, name: string) => {
    setSubscribing(boxId);
    setTimeout(() => {
      setSubscribing(null);
      toast.success(`🎉 Subscribed to ${name}! First delivery scheduled.`);
    }, 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <RefreshCw className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-semibold">Subscription Boxes</h3>
          <p className="text-xs text-muted-foreground">Auto-replenishment with up to 22% savings</p>
        </div>
      </div>
      <div className="space-y-4">
        {SUBSCRIPTION_BOXES.map((box, i) => (
          <motion.div
            key={box.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={box.popular ? "border-primary ring-1 ring-primary/20" : ""}>
              {box.popular && (
                <div className="bg-primary text-white text-[10px] font-bold text-center py-1.5 rounded-t-2xl">
                  ⭐ Most Popular Subscription
                </div>
              )}
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{box.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold">{box.name}</h4>
                      <Badge variant="outline" className="text-[10px] capitalize">{box.frequency}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{box.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {box.items.slice(0, 6).map((item) => (
                        <span key={item} className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">{item}</span>
                      ))}
                      {box.items.length > 6 && (
                        <span className="text-[10px] text-muted-foreground">+{box.items.length - 6} more</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-lg font-bold">{formatCurrency(box.price, "NGN")}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                            Save {formatCurrency(box.savings, "NGN")} vs individual
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-ekda-gold-400 text-ekda-gold-400" />
                            {box.rating} · {box.subscribers.toLocaleString()} subscribers
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="premium"
                        size="sm"
                        onClick={() => handleSubscribe(box.id, box.name)}
                        loading={subscribing === box.id}
                      >
                        Subscribe
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
