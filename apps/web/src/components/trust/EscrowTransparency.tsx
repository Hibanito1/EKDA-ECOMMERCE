"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  CheckCircle2,
  Truck,
  Anchor,
  RotateCcw,
  DollarSign,
  Eye,
  ChevronDown,
  ChevronUp,
  Clock,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@ekda/shared";
import { cn } from "@/lib/utils";

interface EscrowStage {
  id: string;
  label: string;
  description: string;
  amount: number;
  released: boolean;
  releasedAt?: string;
  triggeredBy: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface EscrowTransparencyDashboardProps {
  orderId: string;
  totalAmount: number;
  currency: string;
  ekdaCommission: number;
  stages: EscrowStage[];
  currentStage: string;
}

export function EscrowTransparencyDashboard({
  orderId,
  totalAmount,
  currency,
  ekdaCommission,
  stages,
  currentStage,
}: EscrowTransparencyDashboardProps) {
  const [expanded, setExpanded] = useState(false);
  const releasedAmount = stages.filter((s) => s.released).reduce((sum, s) => sum + s.amount, 0);
  const remainingAmount = totalAmount - ekdaCommission - releasedAmount;
  const progressPct = (releasedAmount / (totalAmount - ekdaCommission)) * 100;

  return (
    <Card className="border-2 border-ekda-green-200 dark:border-ekda-green-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-ekda-green-100 dark:bg-ekda-green-900/30 flex items-center justify-center">
              <Lock className="h-4 w-4 text-ekda-green-700 dark:text-ekda-green-400" />
            </div>
            <div>
              <CardTitle className="text-base">Escrow Transparency</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Track exactly where your money is at every stage
              </p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            {expanded ? "Less" : "Details"}
            {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Overview */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-muted/40 rounded-xl">
            <div className="text-lg font-bold">{formatCurrency(totalAmount, currency as any)}</div>
            <div className="text-[10px] text-muted-foreground">Total Held</div>
          </div>
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="text-lg font-bold text-green-700 dark:text-green-400">
              {formatCurrency(releasedAmount, currency as any)}
            </div>
            <div className="text-[10px] text-muted-foreground">Released</div>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
            <div className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
              {formatCurrency(remainingAmount, currency as any)}
            </div>
            <div className="text-[10px] text-muted-foreground">Pending Release</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
            <span>Release progress</span>
            <span>{Math.round(progressPct)}% released to vendor</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-ekda-green-500 to-ekda-green-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Stages */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 border-t border-border pt-4"
            >
              {/* Breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  Fund Breakdown
                </div>
                {[
                  ...stages.map((s) => ({
                    label: s.label,
                    amount: s.amount,
                    released: s.released,
                    color: s.released ? "text-green-600" : "text-muted-foreground",
                    bg: s.released ? "bg-green-50 dark:bg-green-900/20" : "bg-muted/30",
                  })),
                  {
                    label: "EKDA Commission (10%)",
                    amount: ekdaCommission,
                    released: true,
                    color: "text-ekda-gold-600",
                    bg: "bg-ekda-gold-50 dark:bg-ekda-gold-900/20",
                  },
                ].map((item) => (
                  <div key={item.label} className={cn("flex items-center justify-between p-2.5 rounded-xl", item.bg)}>
                    <div className="flex items-center gap-2">
                      {item.released ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
                      ) : (
                        <Clock className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      )}
                      <span className="text-xs font-medium">{item.label}</span>
                    </div>
                    <span className={cn("text-xs font-bold", item.color)}>
                      {formatCurrency(item.amount, currency as any)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Release Events */}
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mt-3 mb-2">
                Release Events
              </div>
              <div className="space-y-2">
                {stages.map((stage) => (
                  <div key={stage.id} className={cn(
                    "flex items-start gap-3 p-3 rounded-xl border",
                    stage.released ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800" : "bg-muted/30 border-border opacity-60"
                  )}>
                    <div className={cn(
                      "h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0",
                      stage.released ? "bg-green-100 dark:bg-green-900/40" : "bg-muted"
                    )}>
                      <stage.icon className={cn("h-4 w-4", stage.released ? "text-green-600" : "text-muted-foreground")} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold">{stage.label}</span>
                        {stage.released ? (
                          <Badge variant="success" className="text-[9px] px-1.5 py-0">Released</Badge>
                        ) : (
                          <Badge variant="outline" className="text-[9px] px-1.5 py-0">Pending</Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-muted-foreground">{stage.description}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        Triggered by: {stage.triggeredBy}
                      </p>
                      {stage.releasedAt && (
                        <p className="text-[10px] font-medium text-green-600 mt-0.5">
                          Released: {formatDateTime(stage.releasedAt)}
                        </p>
                      )}
                    </div>
                    <div className="text-xs font-bold text-foreground">
                      {formatCurrency(stage.amount, currency as any)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 p-2.5 bg-muted/30 rounded-xl">
                <Zap className="h-3.5 w-3.5 text-indigo-500" />
                <p className="text-[10px] text-muted-foreground">
                  All escrow transactions are cryptographically recorded and auditable.
                  Order #{orderId}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
