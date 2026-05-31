"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Crown,
  Star,
  TrendingUp,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Shield,
  BarChart3,
  Package,
  Headphones,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const PREMIUM_PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: 15000,
    period: "month",
    description: "Perfect for new vendors scaling up",
    badge: null,
    color: "border-border",
    features: [
      "8.5% commission (vs 10% standard)",
      "10 boosted listings",
      "Basic analytics dashboard",
      "Email support (24h response)",
      "EKDA Verified badge",
    ],
    cta: "Start Starter",
  },
  {
    id: "growth",
    name: "Growth",
    price: 35000,
    period: "month",
    description: "For established vendors growing internationally",
    badge: "Most Popular",
    color: "border-primary ring-2 ring-primary/20",
    features: [
      "7.5% commission rate",
      "50 boosted listings",
      "Advanced analytics + forecasts",
      "Priority support (4h response)",
      "Featured in marketplace homepage",
      "AI HS Code unlimited uses",
      "Premium vendor badge",
      "WhatsApp business integration",
    ],
    cta: "Go Growth",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 85000,
    period: "month",
    description: "White-glove service for high-volume exporters",
    badge: "Best Value",
    color: "border-ekda-gold-400 ring-2 ring-ekda-gold-400/20",
    features: [
      "7% commission rate (3% savings)",
      "Unlimited boosted listings",
      "Real-time revenue intelligence",
      "Dedicated account manager",
      "Homepage banner placement",
      "Custom domain sub-store",
      "API access for inventory sync",
      "Bulk order automation",
      "SLA guarantee: 1h support",
      "Monthly strategy consultation",
    ],
    cta: "Contact Sales",
  },
];

const ROI_EXAMPLES = [
  { gmv: 500000, standard: 50000, growth: 37500 + 35000, savings: 7500, plan: "Growth" },
  { gmv: 2000000, standard: 200000, growth: 150000 + 35000, savings: 15000, plan: "Growth" },
  { gmv: 5000000, standard: 500000, growth: 350000 + 85000, savings: 65000, plan: "Enterprise" },
];

export default function VendorPremiumPage() {
  const [activePlan, setActivePlan] = useState("growth");
  const [showROI, setShowROI] = useState(false);

  const handleSubscribe = (planId: string) => {
    if (planId === "enterprise") {
      toast.success("📞 Sales team will contact you within 2 hours!");
    } else {
      toast.success(`🎉 Upgrading to ${planId.charAt(0).toUpperCase() + planId.slice(1)} — redirecting to payment...`);
    }
  };

  return (
    <div className="max-w-5xl space-y-8">
      <div className="text-center">
        <Badge variant="gold" className="mb-4 text-sm px-4 py-1.5">
          <Crown className="h-3.5 w-3.5 mr-1.5" />
          EKDA Premium for Vendors
        </Badge>
        <h1 className="text-3xl font-bold mb-3">
          Grow Faster. Pay Less Commission.
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Premium vendors earn up to 3% more per sale with lower commissions, boosted visibility,
          and AI-powered tools that automate compliance and logistics.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PREMIUM_PLANS.map((plan, i) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className={cn("relative overflow-hidden h-full", plan.color)}>
              {plan.badge && (
                <div className="absolute top-4 right-4">
                  <Badge
                    className={cn("text-xs", plan.id === "enterprise" ? "bg-ekda-gold-500 text-white" : "")}
                  >
                    {plan.badge}
                  </Badge>
                </div>
              )}
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-5">
                  <div className="font-bold text-xl mb-1">{plan.name}</div>
                  <p className="text-xs text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl font-bold">
                      ₦{plan.price.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground text-sm mb-1">/{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-6 flex-1">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-xs">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={plan.id === "growth" ? "premium" : plan.id === "enterprise" ? "gold" : "outline"}
                  className="w-full"
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ROI Calculator */}
      <Card>
        <CardContent className="p-6">
          <button
            onClick={() => setShowROI(!showROI)}
            className="w-full flex items-center justify-between font-semibold"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              See How Much You Save (ROI Calculator)
            </div>
            {showROI ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          {showROI && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">Monthly GMV</th>
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">Standard (10%)</th>
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">With Premium</th>
                    <th className="text-left py-2 text-xs text-muted-foreground font-medium">Monthly Savings</th>
                  </tr>
                </thead>
                <tbody>
                  {ROI_EXAMPLES.map((row) => (
                    <tr key={row.gmv} className="border-b border-border last:border-0">
                      <td className="py-3 font-medium">₦{row.gmv.toLocaleString()}</td>
                      <td className="py-3 text-red-500">-₦{row.standard.toLocaleString()}</td>
                      <td className="py-3 text-muted-foreground">
                        -₦{row.growth.toLocaleString()} ({row.plan})
                      </td>
                      <td className="py-3">
                        <Badge variant="success" className="text-xs">
                          +₦{row.savings.toLocaleString()}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-muted-foreground mt-3">
                * Savings calculated after subscription cost. Premium pays for itself at ₦500K+ monthly GMV.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { icon: "📊", title: "AI Demand Forecasting", desc: "Know what to stock before customers search" },
          { icon: "🤖", title: "Unlimited HS Code AI", desc: "Auto-classify all products instantly" },
          { icon: "🚀", title: "Boosted Search Ranking", desc: "Appear higher in marketplace search" },
          { icon: "🎯", title: "Targeted Ads Platform", desc: "Run ads on EKDA for logistics & services" },
          { icon: "📞", title: "Dedicated Account Manager", desc: "Enterprise and Growth plans" },
          { icon: "🔗", title: "API & ERP Integration", desc: "Sync your inventory automatically" },
        ].map((feat) => (
          <div key={feat.title} className="p-4 bg-muted/30 rounded-2xl">
            <div className="text-2xl mb-2">{feat.icon}</div>
            <div className="font-semibold text-sm mb-1">{feat.title}</div>
            <div className="text-xs text-muted-foreground">{feat.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
