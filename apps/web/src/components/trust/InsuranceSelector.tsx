"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Info,
  ChevronDown,
  CheckCircle2,
  X,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@ekda/shared";
import { cn } from "@/lib/utils";

const INSURANCE_PLANS = [
  {
    id: "none",
    name: "No Insurance",
    description: "Proceed without coverage (not recommended for high-value orders)",
    price: 0,
    coverage: 0,
    features: [],
    recommended: false,
    variant: "none" as const,
  },
  {
    id: "basic",
    name: "Basic Coverage",
    description: "Covers loss and major damage during transit",
    price: 0.01, // 1% of order value
    coverage: 0.8, // 80% of declared value
    features: [
      "Lost shipment coverage",
      "Major damage (>50% value loss)",
      "Documentation included",
    ],
    recommended: false,
    variant: "basic" as const,
  },
  {
    id: "comprehensive",
    name: "Comprehensive Coverage",
    description: "Full protection including partial damage, delay, and theft",
    price: 0.025, // 2.5%
    coverage: 1.0, // 100%
    features: [
      "Everything in Basic",
      "Partial damage coverage",
      "Shipment delay compensation",
      "Theft protection",
      "Temperature excursion (frozen goods)",
      "Priority claims processing",
    ],
    recommended: true,
    variant: "comprehensive" as const,
  },
];

interface InsuranceSelectorProps {
  orderValue: number;
  currency: string;
  onChange: (planId: string, cost: number) => void;
}

export function InsuranceSelector({ orderValue, currency, onChange }: InsuranceSelectorProps) {
  const [selected, setSelected] = useState("basic");
  const [expanded, setExpanded] = useState(false);

  const handleSelect = (planId: string, price: number) => {
    setSelected(planId);
    const cost = price * orderValue;
    onChange(planId, cost);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Shield className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">Shipment Insurance</span>
        <Badge variant="success" className="text-[10px]">Recommended</Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        Protect your shipment against loss, damage, and delays during transit.
      </p>

      <div className="space-y-2">
        {INSURANCE_PLANS.map((plan) => {
          const cost = plan.price * orderValue;
          const isSelected = selected === plan.id;

          return (
            <motion.button
              key={plan.id}
              onClick={() => handleSelect(plan.id, plan.price)}
              whileTap={{ scale: 0.99 }}
              className={cn(
                "w-full flex items-start gap-3 p-3.5 rounded-2xl border-2 text-left transition-all",
                isSelected
                  ? plan.id === "comprehensive"
                    ? "border-primary bg-primary/5"
                    : "border-border bg-muted/30"
                  : "border-border hover:border-primary/30"
              )}
            >
              <div
                className={cn(
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-all",
                  isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                )}
              >
                {isSelected && <div className="h-2 w-2 rounded-full bg-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold">{plan.name}</span>
                  {plan.recommended && (
                    <Badge className="text-[9px] px-1.5 py-0">✨ Best</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{plan.description}</p>

                {isSelected && plan.features.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-2 space-y-1"
                  >
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                        <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                    {plan.coverage > 0 && (
                      <div className="mt-1.5 text-[10px] font-medium text-foreground">
                        Covers up to {Math.round(plan.coverage * 100)}% of{" "}
                        {formatCurrency(orderValue, currency as any)}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
              <div className="text-right flex-shrink-0">
                {cost > 0 ? (
                  <div>
                    <div className="text-sm font-bold text-foreground">
                      {formatCurrency(cost, currency as any)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {Math.round(plan.price * 100)}% of order
                    </div>
                  </div>
                ) : (
                  <div className="text-sm font-bold text-muted-foreground">Free</div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      {selected === "none" && (
        <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
          <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-yellow-700 dark:text-yellow-400">
            Proceeding without insurance. If your shipment is lost or damaged, EKDA escrow only covers confirmed non-delivery — not partial damage or delays.
          </p>
        </div>
      )}
    </div>
  );
}
