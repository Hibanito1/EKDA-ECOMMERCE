"use client";

import { motion } from "framer-motion";
import {
  Star,
  Crown,
  Zap,
  Gift,
  ArrowRight,
  Check,
  TrendingUp,
  Users,
  Ticket,
  Copy,
  Share2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLoyaltyStore, type LoyaltyTier } from "@/store";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface TierConfig {
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  gradient: string;
  pointsRequired: number;
  benefits: string[];
  multiplier: number;
  commissionDiscount: number;
}

const TIERS: Record<LoyaltyTier, TierConfig> = {
  bronze: {
    name: "Bronze",
    icon: "🥉",
    color: "text-orange-700",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
    borderColor: "border-orange-200 dark:border-orange-800",
    gradient: "from-orange-700 to-orange-900",
    pointsRequired: 0,
    benefits: ["1 point per ₦100 spent", "Access to member-only deals", "Basic support"],
    multiplier: 1,
    commissionDiscount: 0,
  },
  silver: {
    name: "Silver",
    icon: "🥈",
    color: "text-slate-600",
    bgColor: "bg-slate-50 dark:bg-slate-900/20",
    borderColor: "border-slate-200 dark:border-slate-700",
    gradient: "from-slate-500 to-slate-700",
    pointsRequired: 5000,
    benefits: ["1.5x point multiplier", "Priority customer support", "Free shipping on 3 orders/month", "10% shipping discount"],
    multiplier: 1.5,
    commissionDiscount: 0,
  },
  gold: {
    name: "Gold",
    icon: "🥇",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
    borderColor: "border-yellow-200 dark:border-yellow-800",
    gradient: "from-yellow-500 to-amber-700",
    pointsRequired: 20000,
    benefits: ["2x point multiplier", "2% cashback on all orders", "Dedicated account manager", "20% shipping discount", "Early access to new products"],
    multiplier: 2,
    commissionDiscount: 0,
  },
  platinum: {
    name: "Platinum",
    icon: "💎",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/20",
    borderColor: "border-indigo-200 dark:border-indigo-800",
    gradient: "from-indigo-600 to-purple-800",
    pointsRequired: 50000,
    benefits: [
      "3x point multiplier",
      "3% cashback on all orders",
      "1% commission reduction",
      "White-glove concierge service",
      "30% shipping discount",
      "Custom pricing for bulk orders",
      "Invited to EKDA Seller Summits",
    ],
    multiplier: 3,
    commissionDiscount: 1,
  },
};

const TIER_ORDER: LoyaltyTier[] = ["bronze", "silver", "gold", "platinum"];

export function LoyaltyCard({ compact = false }: { compact?: boolean }) {
  const { points, tier } = useLoyaltyStore();
  const config = TIERS[tier];
  const nextTierKey = TIER_ORDER[TIER_ORDER.indexOf(tier) + 1] as LoyaltyTier | undefined;
  const nextTier = nextTierKey ? TIERS[nextTierKey] : null;
  const progressPct = nextTier
    ? Math.min(100, ((points - config.pointsRequired) / (nextTier.pointsRequired - config.pointsRequired)) * 100)
    : 100;

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3 p-3 rounded-2xl border", config.bgColor, config.borderColor)}>
        <span className="text-2xl">{config.icon}</span>
        <div className="flex-1">
          <div className={cn("text-sm font-bold", config.color)}>
            {config.name} Member
          </div>
          <div className="text-xs text-muted-foreground">
            {points.toLocaleString()} points
          </div>
        </div>
        {nextTier && (
          <div className="text-right">
            <div className="text-[10px] text-muted-foreground">
              {(nextTier.pointsRequired - points).toLocaleString()} to {nextTier.name}
            </div>
            <div className="h-1.5 w-16 bg-muted rounded-full mt-1 overflow-hidden">
              <div
                className={cn("h-full bg-gradient-to-r", config.gradient, "rounded-full")}
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Current Tier Card */}
      <motion.div
        className={cn("rounded-3xl p-6 text-white relative overflow-hidden bg-gradient-to-br", config.gradient)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 8px)`,
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-white/60 text-xs mb-1">EKDA Loyalty</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                {config.icon} {config.name} Member
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{points.toLocaleString()}</div>
              <div className="text-white/60 text-xs">points</div>
            </div>
          </div>

          {nextTier && (
            <div>
              <div className="flex justify-between text-xs text-white/70 mb-1">
                <span>{config.name}</span>
                <span>{nextTier.name} ({nextTier.pointsRequired.toLocaleString()} pts)</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
              </div>
              <div className="text-[10px] text-white/60 mt-1">
                {(nextTier.pointsRequired - points).toLocaleString()} more points to reach {nextTierKey} {TIERS[nextTierKey!].icon}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Benefits */}
      <div>
        <div className="text-sm font-semibold mb-2">Your {config.name} Benefits</div>
        <div className="space-y-1.5">
          {config.benefits.map((benefit) => (
            <div key={benefit} className="flex items-center gap-2 text-sm">
              <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
              <span className="text-muted-foreground">{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* All Tiers Comparison */}
      <div className="grid grid-cols-4 gap-2">
        {TIER_ORDER.map((t) => {
          const tc = TIERS[t];
          const isActive = t === tier;
          const isPast = TIER_ORDER.indexOf(t) < TIER_ORDER.indexOf(tier);
          return (
            <div
              key={t}
              className={cn(
                "rounded-2xl p-3 text-center border transition-all",
                isActive ? cn("border-2", tc.borderColor, tc.bgColor) :
                isPast ? "bg-muted/30 border-border opacity-60" :
                "border-border opacity-40"
              )}
            >
              <div className="text-xl mb-1">{tc.icon}</div>
              <div className={cn("text-[10px] font-bold", isActive ? tc.color : "text-muted-foreground")}>
                {tc.name}
              </div>
              <div className="text-[9px] text-muted-foreground">{tc.pointsRequired.toLocaleString()}+</div>
              <div className={cn("text-[9px] font-semibold mt-0.5", isActive ? tc.color : "text-muted-foreground")}>
                {tc.multiplier}x pts
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ReferralProgram() {
  const { referralCode, totalReferrals } = useLoyaltyStore();

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success("Referral code copied!");
  };

  const shareReferral = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join EKDA Marketplace",
        text: `Use my code ${referralCode} to get ₦5,000 off your first order on EKDA — Africa's premier cross-border marketplace!`,
        url: `https://ekda.io/register?ref=${referralCode}`,
      });
    } else {
      copyCode();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-ekda-gold-600" />
          Referral Program
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Earn <span className="font-semibold text-foreground">₦5,000 credit</span> for every friend you refer who completes their first order.
        </p>

        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: "Referrals", value: totalReferrals, icon: Users },
            { label: "Earned", value: `₦${(totalReferrals * 5000).toLocaleString()}`, icon: TrendingUp },
            { label: "Pending", value: "2", icon: Ticket },
          ].map((stat) => (
            <div key={stat.label} className="p-3 bg-muted/40 rounded-xl">
              <stat.icon className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
              <div className="font-bold text-sm">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        <div>
          <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
            Your Referral Code
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 font-mono font-bold text-base bg-muted/50 rounded-xl px-4 py-3 border border-border">
              {referralCode}
            </div>
            <button
              onClick={copyCode}
              className="h-12 w-12 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={shareReferral}
              className="h-12 w-12 rounded-xl bg-primary text-white hover:bg-primary/90 flex items-center justify-center transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl text-sm">
          {["Share link", "Friend signs up", "They order", "You earn ₦5k"].map((step, i) => (
            <div key={step} className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{step}</span>
              {i < 3 && <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
