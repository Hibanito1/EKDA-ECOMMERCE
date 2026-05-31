"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Award,
  Leaf,
  Truck,
  Star,
  Globe,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type VerificationBadgeType =
  | "verified_farmer"
  | "diaspora_exporter"
  | "customs_cleared"
  | "halal_certified"
  | "organic_certified"
  | "premium_vendor"
  | "top_rated"
  | "blockchain_verified"
  | "carbon_neutral";

interface BadgeConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

const BADGE_CONFIGS: Record<VerificationBadgeType, BadgeConfig> = {
  verified_farmer: {
    label: "Verified Nigerian Farmer",
    icon: Leaf,
    color: "text-ekda-green-700 dark:text-ekda-green-400",
    bgColor: "bg-ekda-green-50 dark:bg-ekda-green-900/30",
    borderColor: "border-ekda-green-200 dark:border-ekda-green-700",
    description: "Identity and farm ownership verified by EKDA team",
  },
  diaspora_exporter: {
    label: "Diaspora Exporter",
    icon: Globe,
    color: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/30",
    borderColor: "border-blue-200 dark:border-blue-700",
    description: "Certified exporter serving the African diaspora",
  },
  customs_cleared: {
    label: "Customs Pre-Cleared",
    icon: ShieldCheck,
    color: "text-purple-700 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-900/30",
    borderColor: "border-purple-200 dark:border-purple-700",
    description: "Products pre-verified for international customs",
  },
  halal_certified: {
    label: "Halal Certified",
    icon: CheckCircle2,
    color: "text-teal-700 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-900/30",
    borderColor: "border-teal-200 dark:border-teal-700",
    description: "Third-party Halal certification verified",
  },
  organic_certified: {
    label: "Organic Certified",
    icon: Leaf,
    color: "text-lime-700 dark:text-lime-400",
    bgColor: "bg-lime-50 dark:bg-lime-900/30",
    borderColor: "border-lime-200 dark:border-lime-700",
    description: "Certified organic by NAFDAC/international body",
  },
  premium_vendor: {
    label: "EKDA Premium Vendor",
    icon: Star,
    color: "text-ekda-gold-700 dark:text-ekda-gold-400",
    bgColor: "bg-ekda-gold-50 dark:bg-ekda-gold-900/30",
    borderColor: "border-ekda-gold-200 dark:border-ekda-gold-700",
    description: "Premium subscription with verified performance",
  },
  top_rated: {
    label: "Top Rated Seller",
    icon: Award,
    color: "text-orange-700 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-900/30",
    borderColor: "border-orange-200 dark:border-orange-700",
    description: "Consistently rated 4.8+ by verified buyers",
  },
  blockchain_verified: {
    label: "Blockchain Verified",
    icon: Zap,
    color: "text-indigo-700 dark:text-indigo-400",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/30",
    borderColor: "border-indigo-200 dark:border-indigo-700",
    description: "Digital certificate stored on blockchain",
  },
  carbon_neutral: {
    label: "Carbon Neutral",
    icon: Leaf,
    color: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/30",
    borderColor: "border-green-200 dark:border-green-700",
    description: "Shipping offset via EKDA green program",
  },
};

interface VerifiedBadgeProps {
  type: VerificationBadgeType;
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
  blockchainId?: string;
}

export function VerifiedBadge({ type, size = "sm", showTooltip = false, blockchainId }: VerifiedBadgeProps) {
  const config = BADGE_CONFIGS[type];

  if (size === "sm") {
    return (
      <div className="relative group inline-flex">
        <div className={cn(
          "inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold",
          config.color, config.bgColor, config.borderColor
        )}>
          <config.icon className="h-2.5 w-2.5" />
          {config.label}
        </div>
        {showTooltip && (
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 w-48">
            <div className="bg-foreground text-background text-[10px] rounded-xl px-2.5 py-2 shadow-xl">
              {config.description}
              {blockchainId && (
                <div className="mt-1 font-mono text-[9px] opacity-70 truncate">
                  ID: {blockchainId}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-start gap-3 p-3 rounded-2xl border",
      config.bgColor, config.borderColor
    )}>
      <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0", config.bgColor)}>
        <config.icon className={cn("h-5 w-5", config.color)} />
      </div>
      <div>
        <div className={cn("font-semibold text-sm", config.color)}>
          {config.label}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{config.description}</div>
        {blockchainId && (
          <div className="flex items-center gap-1 mt-1">
            <Zap className="h-2.5 w-2.5 text-indigo-500" />
            <code className="text-[9px] text-muted-foreground font-mono">{blockchainId}</code>
          </div>
        )}
      </div>
    </div>
  );
}

interface VendorTrustPanelProps {
  badges: VerificationBadgeType[];
  vendorName: string;
  joinedYear: number;
  totalOrders: number;
  responseRate: number;
}

export function VendorTrustPanel({ badges, vendorName, joinedYear, totalOrders, responseRate }: VendorTrustPanelProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {badges.map((badge) => (
          <VerifiedBadge key={badge} type={badge} showTooltip size="sm" />
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Member Since", value: joinedYear.toString() },
          { label: "Total Orders", value: totalOrders.toLocaleString() + "+" },
          { label: "Response Rate", value: responseRate + "%" },
        ].map((stat) => (
          <div key={stat.label} className="text-center p-2 bg-muted/40 rounded-xl">
            <div className="font-bold text-sm">{stat.value}</div>
            <div className="text-[10px] text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
