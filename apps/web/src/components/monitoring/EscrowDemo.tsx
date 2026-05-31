"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  CheckCircle2,
  Lock,
  Truck,
  Anchor,
  DollarSign,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Clock,
  Shield,
  Zap,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@ekda/shared";
import { cn } from "@/lib/utils";

interface EscrowMilestone {
  id: string;
  title: string;
  description: string;
  actor: "customer" | "ekda" | "vendor" | "carrier";
  icon: React.ComponentType<{ className?: string }>;
  amount?: number;
  escrowAction?: string;
  delay: number;
}

const DEMO_ORDER = {
  id: "EKDA-DEMO-001",
  product: "Premium Dried Crayfish (20kg)",
  vendor: "Lagos Fresh Exports",
  carrier: "Maersk Line",
  customer: "Adaeze O. (London, UK)",
  subtotal: 170000,
  shipping: 35000,
  insurance: 5100,
  ekdaCommission: 17000,
  total: 196500,
  vendorShare: 153000,
  currency: "NGN",
};

const MILESTONES: EscrowMilestone[] = [
  {
    id: "payment",
    title: "Customer Places Order & Pays",
    description: `Adaeze pays ₦196,500 via Paystack. Funds held 100% in EKDA escrow. Zero risk to buyer.`,
    actor: "customer",
    icon: DollarSign,
    amount: 196500,
    escrowAction: "FUNDS_LOCKED",
    delay: 0,
  },
  {
    id: "vendor_preparing",
    title: "Vendor Prepares Shipment",
    description: "Lagos Fresh Exports packages 20kg dried crayfish. Phytosanitary certificate obtained. Shipping documents prepared.",
    actor: "vendor",
    icon: Package,
    delay: 800,
  },
  {
    id: "carrier_assigned",
    title: "Carrier Assigned",
    description: "Maersk Line assigned for sea freight (Apapa → Tilbury). Transit time: 28 days. EKDA escrow balance: ₦196,500.",
    actor: "ekda",
    icon: Truck,
    delay: 1400,
  },
  {
    id: "pickup",
    title: "🚢 Carrier Confirms Pickup",
    description: "Maersk confirms goods received at Apapa Port. Escrow 1st release triggered automatically.",
    actor: "carrier",
    icon: Anchor,
    amount: 76500,
    escrowAction: "FIRST_RELEASE",
    delay: 2200,
  },
  {
    id: "transit",
    title: "In Transit — Atlantic Ocean",
    description: "Vessel Maersk Enfield departed Apapa. ETA Tilbury: 28 days. Real-time tracking active.",
    actor: "ekda",
    icon: Clock,
    delay: 3000,
  },
  {
    id: "arrived",
    title: "🏁 Arrived at Destination Port",
    description: "Maersk confirms arrival at Tilbury, London. Final escrow release triggered automatically.",
    actor: "carrier",
    icon: CheckCircle2,
    amount: 76500,
    escrowAction: "SECOND_RELEASE",
    delay: 3800,
  },
  {
    id: "complete",
    title: "✅ Transaction Complete",
    description: "Full escrow cycle complete. Vendor received ₦153,000 total. EKDA commission: ₦17,000. Adaeze's order delivered!",
    actor: "ekda",
    icon: Sparkles,
    delay: 4600,
  },
];

const ACTOR_CONFIG = {
  customer: { label: "Customer", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400", dot: "bg-blue-500" },
  ekda: { label: "EKDA", color: "bg-ekda-green-100 dark:bg-ekda-green-900/30 text-ekda-green-700 dark:text-ekda-green-400", dot: "bg-ekda-green-500" },
  vendor: { label: "Vendor", color: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400", dot: "bg-orange-500" },
  carrier: { label: "Carrier", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400", dot: "bg-purple-500" },
};

export function EscrowDemo() {
  const [playing, setPlaying] = useState(false);
  const [completedMilestones, setCompletedMilestones] = useState<string[]>([]);
  const [activeMilestone, setActiveMilestone] = useState<string | null>(null);
  const [escrowBalance, setEscrowBalance] = useState(0);
  const [vendorEarned, setVendorEarned] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const reset = () => {
    setPlaying(false);
    setCompletedMilestones([]);
    setActiveMilestone(null);
    setEscrowBalance(0);
    setVendorEarned(0);
    setIsComplete(false);
  };

  const runDemo = async () => {
    setPlaying(true);
    setCompletedMilestones([]);
    setActiveMilestone(null);
    setEscrowBalance(0);
    setVendorEarned(0);
    setIsComplete(false);

    for (let i = 0; i < MILESTONES.length; i++) {
      const milestone = MILESTONES[i]!;

      await new Promise((r) => setTimeout(r, milestone.delay));

      setActiveMilestone(milestone.id);
      await new Promise((r) => setTimeout(r, 600));

      // Update escrow/vendor balance
      if (milestone.escrowAction === "FUNDS_LOCKED") {
        setEscrowBalance(DEMO_ORDER.total);
      } else if (milestone.escrowAction === "FIRST_RELEASE") {
        setEscrowBalance((b) => b - (milestone.amount || 0) - DEMO_ORDER.ekdaCommission);
        setVendorEarned((e) => e + (milestone.amount || 0));
      } else if (milestone.escrowAction === "SECOND_RELEASE") {
        setEscrowBalance((b) => b - (milestone.amount || 0));
        setVendorEarned((e) => e + (milestone.amount || 0));
      }

      setCompletedMilestones((prev) => [...prev, milestone.id]);
      setActiveMilestone(null);

      if (i === MILESTONES.length - 1) {
        setIsComplete(true);
        setPlaying(false);
      }
    }
  };

  const progress = (completedMilestones.length / MILESTONES.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Escrow Flow Demo
            <Badge variant="gold" className="text-[10px]">Live Simulation</Badge>
          </h2>
          <p className="text-sm text-muted-foreground">
            Watch how EKDA&apos;s escrow system protects buyers and vendors
          </p>
        </div>
        <div className="flex gap-2">
          {(playing || isComplete) && (
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </Button>
          )}
          {!playing && !isComplete && (
            <Button variant="premium" size="sm" onClick={runDemo}>
              <Play className="h-3.5 w-3.5" />
              Start Demo
            </Button>
          )}
        </div>
      </div>

      {/* Order Summary */}
      <Card className="bg-ekda-dark text-white border-0">
        <CardContent className="p-5">
          <div className="text-xs text-white/50 mb-3 uppercase tracking-wider">Demo Order</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm font-bold text-ekda-gold-400">{formatCurrency(DEMO_ORDER.total, "NGN")}</div>
              <div className="text-[10px] text-white/50">Total Paid</div>
            </div>
            <div>
              <motion.div
                className={cn("text-sm font-bold", escrowBalance > 0 ? "text-yellow-400" : "text-white/30")}
                animate={{ scale: escrowBalance > 0 ? [1, 1.2, 1] : 1 }}
              >
                {formatCurrency(escrowBalance, "NGN")}
              </motion.div>
              <div className="text-[10px] text-white/50">In Escrow</div>
            </div>
            <div>
              <motion.div
                className={cn("text-sm font-bold", vendorEarned > 0 ? "text-ekda-green-400" : "text-white/30")}
                animate={{ scale: vendorEarned > 0 ? [1, 1.2, 1] : 1 }}
              >
                {formatCurrency(vendorEarned, "NGN")}
              </motion.div>
              <div className="text-[10px] text-white/50">Vendor Earned</div>
            </div>
            <div>
              <div className={cn("text-sm font-bold", isComplete ? "text-ekda-green-400" : "text-white/30")}>
                {formatCurrency(DEMO_ORDER.ekdaCommission, "NGN")}
              </div>
              <div className="text-[10px] text-white/50">EKDA Commission</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress */}
      {(playing || isComplete) && (
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Demo Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-ekda-green-400 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Milestones Timeline */}
      <div className="space-y-3">
        {MILESTONES.map((milestone, i) => {
          const isCompleted = completedMilestones.includes(milestone.id);
          const isActive = activeMilestone === milestone.id;
          const actorConf = ACTOR_CONFIG[milestone.actor];

          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0.4 }}
              animate={{
                opacity: isCompleted || isActive ? 1 : playing ? 0.4 : 1,
                scale: isActive ? 1.02 : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              <div className={cn(
                "flex gap-4 p-4 rounded-2xl border transition-all",
                isCompleted ? "bg-ekda-green-50 dark:bg-ekda-green-900/10 border-ekda-green-200 dark:border-ekda-green-800" :
                isActive ? "bg-primary/5 border-primary/30 ring-2 ring-primary/20" :
                "border-border bg-muted/20"
              )}>
                {/* Icon */}
                <div className={cn(
                  "h-10 w-10 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all",
                  isCompleted ? "bg-ekda-green-100 dark:bg-ekda-green-900/30" :
                  isActive ? "bg-primary/10" : "bg-muted"
                )}>
                  {isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Zap className="h-5 w-5 text-primary" />
                    </motion.div>
                  ) : isCompleted ? (
                    <CheckCircle2 className="h-5 w-5 text-ekda-green-600" />
                  ) : (
                    <milestone.icon className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-semibold text-sm">{milestone.title}</span>
                    <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full", actorConf.color)}>
                      {actorConf.label}
                    </span>
                    {milestone.escrowAction && (
                      <Badge
                        className={cn(
                          "text-[10px] px-1.5 py-0",
                          milestone.escrowAction === "FUNDS_LOCKED" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                          "bg-green-100 text-green-800 border-green-200"
                        )}
                      >
                        {milestone.escrowAction === "FUNDS_LOCKED" ? "🔒 LOCKED" :
                         milestone.escrowAction === "FIRST_RELEASE" ? "💸 50% RELEASED" : "✅ FINAL RELEASE"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{milestone.description}</p>
                  {milestone.amount && isCompleted && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1.5 text-xs font-bold text-ekda-green-600"
                    >
                      +{formatCurrency(milestone.amount, "NGN")} → Vendor wallet
                    </motion.div>
                  )}
                </div>

                {i < MILESTONES.length - 1 && isCompleted && (
                  <div className="flex-shrink-0 self-center">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Success Summary */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center p-6 bg-gradient-to-br from-ekda-green-50 to-blue-50 dark:from-ekda-green-900/20 dark:to-blue-900/20 rounded-3xl border border-ekda-green-200 dark:border-ekda-green-800"
          >
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="text-xl font-bold text-ekda-green-700 dark:text-ekda-green-400 mb-2">
              Escrow Cycle Complete!
            </h3>
            <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto mt-4">
              <div>
                <div className="text-lg font-bold text-foreground">{formatCurrency(vendorEarned, "NGN")}</div>
                <div className="text-xs text-muted-foreground">Vendor Earned</div>
              </div>
              <div>
                <div className="text-lg font-bold text-ekda-gold-600">{formatCurrency(DEMO_ORDER.ekdaCommission, "NGN")}</div>
                <div className="text-xs text-muted-foreground">EKDA (10%)</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">✅</div>
                <div className="text-xs text-muted-foreground">Buyer Protected</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
