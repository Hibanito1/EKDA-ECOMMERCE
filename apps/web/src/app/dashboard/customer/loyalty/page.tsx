"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Crown,
  Zap,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Shield,
  BarChart3,
  Sparkles,
  Package,
  Headphones,
  Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LoyaltyCard, ReferralProgram } from "@/components/loyalty/LoyaltyCard";
import { PriceIntelligence } from "@/components/ai/PriceIntelligence";
import { formatCurrency } from "@ekda/shared";
import { useLoyaltyStore } from "@/store";

const POINT_EARNING_WAYS = [
  { icon: "🛒", label: "Every purchase", value: "1 point / ₦100", multiplier: null },
  { icon: "⭐", label: "Leave a review", value: "+150 points", multiplier: null },
  { icon: "📧", label: "Verify email", value: "+500 points", multiplier: null },
  { icon: "🎯", label: "Complete profile", value: "+250 points", multiplier: null },
  { icon: "📱", label: "Download app", value: "+200 points", multiplier: null },
  { icon: "👥", label: "Referral (per signup)", value: "+1,000 points", multiplier: null },
  { icon: "🏆", label: "Monthly top buyer", value: "+5,000 points", multiplier: null },
  { icon: "🎁", label: "Birthday bonus", value: "+1,000 points", multiplier: null },
];

const REDEMPTION_OPTIONS = [
  { icon: "✈️", label: "Free Air Shipping", points: 2000, value: "₦8,000 value" },
  { icon: "🚢", label: "Sea Freight Discount 10%", points: 1500, value: "up to ₦5,000 off" },
  { icon: "💳", label: "₦5,000 Voucher", points: 5000, value: "₦5,000 credit" },
  { icon: "🌳", label: "Plant 10 Trees (offset)", points: 500, value: "Carbon offset" },
  { icon: "🏷️", label: "5% Product Discount", points: 3000, value: "any single order" },
  { icon: "🎁", label: "Donate to Farmers Fund", points: 1000, value: "Support smallholders" },
];

export default function LoyaltyPage() {
  const { points, tier, redeemPoints } = useLoyaltyStore();
  const [redeeming, setRedeeming] = useState<string | null>(null);

  const handleRedeem = (label: string, requiredPoints: number) => {
    if (points < requiredPoints) {
      alert(`You need ${(requiredPoints - points).toLocaleString()} more points`);
      return;
    }
    setRedeeming(label);
    setTimeout(() => {
      redeemPoints(requiredPoints);
      setRedeeming(null);
      alert(`✅ Successfully redeemed: ${label}`);
    }, 1500);
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-ekda-gold-500 to-ekda-gold-700 flex items-center justify-center shadow-lg shadow-ekda-gold-500/25">
          <Star className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Loyalty & Rewards</h1>
          <p className="text-muted-foreground text-sm">
            Earn points on every trade, unlock premium benefits
          </p>
        </div>
        <Badge variant="gold" className="ml-auto">
          <Crown className="h-3 w-3 mr-1" />
          {tier.charAt(0).toUpperCase() + tier.slice(1)} Member
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LoyaltyCard />
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-ekda-gold-600" />
                Ways to Earn Points
              </h3>
              <div className="space-y-2">
                {POINT_EARNING_WAYS.map((way) => (
                  <div key={way.label} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{way.icon}</span>
                      <span className="text-muted-foreground text-xs">{way.label}</span>
                    </div>
                    <Badge variant="gold" className="text-[10px]">{way.value}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Redeem Points */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          Redeem Your Points
          <Badge variant="outline" className="ml-1 text-xs">
            {points.toLocaleString()} available
          </Badge>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {REDEMPTION_OPTIONS.map((option) => {
            const canAfford = points >= option.points;
            return (
              <motion.div key={option.label} whileHover={{ y: -2 }}>
                <Card className={!canAfford ? "opacity-60" : ""}>
                  <CardContent className="p-4">
                    <div className="text-3xl mb-3">{option.icon}</div>
                    <h4 className="font-semibold text-sm mb-1">{option.label}</h4>
                    <p className="text-xs text-muted-foreground mb-3">{option.value}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="gold" className="text-[10px]">
                        {option.points.toLocaleString()} pts
                      </Badge>
                      <Button
                        size="sm"
                        className="h-7 text-xs"
                        disabled={!canAfford || redeeming === option.label}
                        onClick={() => handleRedeem(option.label, option.points)}
                        loading={redeeming === option.label}
                        variant={canAfford ? "premium" : "outline"}
                      >
                        Redeem
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      <ReferralProgram />
      <PriceIntelligence compact />
    </div>
  );
}
