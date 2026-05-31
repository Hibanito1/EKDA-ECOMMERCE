"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  TrendingDown,
  TrendingUp,
  Minus,
  Target,
  Plus,
  X,
  CheckCircle2,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@ekda/shared";
import { usePreferencesStore } from "@/store";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface PricePoint {
  date: string;
  price: number;
}

const PRICE_DATA: Record<string, PricePoint[]> = {
  crayfish: [
    { date: "Jan", price: 7200 }, { date: "Feb", price: 7800 }, { date: "Mar", price: 8100 },
    { date: "Apr", price: 7900 }, { date: "May", price: 8500 }, { date: "Jun", price: 8200 },
  ],
  palm_oil: [
    { date: "Jan", price: 6200 }, { date: "Feb", price: 6500 }, { date: "Mar", price: 6800 },
    { date: "Apr", price: 7100 }, { date: "May", price: 6800 }, { date: "Jun", price: 6600 },
  ],
  garri: [
    { date: "Jan", price: 3500 }, { date: "Feb", price: 3200 }, { date: "Mar", price: 3100 },
    { date: "Apr", price: 3300 }, { date: "May", price: 3200 }, { date: "Jun", price: 2900 },
  ],
};

const AI_PREDICTIONS = [
  {
    id: "pred1",
    product: "Dried Crayfish",
    currentPrice: 8500,
    predictedPrice: 7800,
    change: -8.2,
    timeline: "2-3 weeks",
    reason: "Harvest season approaching in Lagos waterways",
    confidence: 87,
    trend: "down",
    currency: "NGN",
    unit: "kg",
    emoji: "🦐",
    alert: false,
  },
  {
    id: "pred2",
    product: "Palm Oil",
    currentPrice: 6800,
    predictedPrice: 7400,
    change: +8.8,
    timeline: "4-6 weeks",
    reason: "Dry season reducing production in Rivers State",
    confidence: 79,
    trend: "up",
    currency: "NGN",
    unit: "litre",
    emoji: "🫙",
    alert: false,
  },
  {
    id: "pred3",
    product: "Garri Ijebu",
    currentPrice: 3200,
    predictedPrice: 2800,
    change: -12.5,
    timeline: "1-2 weeks",
    reason: "New harvest flooding Ogun State markets",
    confidence: 92,
    trend: "down",
    currency: "NGN",
    unit: "kg",
    emoji: "🌾",
    alert: true,
  },
  {
    id: "pred4",
    product: "Sea Freight Rate (Lagos→UK)",
    currentPrice: 38000,
    predictedPrice: 34000,
    change: -10.5,
    timeline: "3-4 weeks",
    reason: "Maersk adding Nigeria capacity Q3 2025",
    confidence: 73,
    trend: "down",
    currency: "NGN",
    unit: "20kg",
    emoji: "🚢",
    alert: false,
  },
];

interface PriceChartProps {
  data: PricePoint[];
  trend: "up" | "down" | "stable";
}

function MiniSparkline({ data, trend }: PriceChartProps) {
  const max = Math.max(...data.map((d) => d.price));
  const min = Math.min(...data.map((d) => d.price));
  const range = max - min || 1;
  const w = 80;
  const h = 32;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((d.price - min) / range) * h;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        fill="none"
        stroke={trend === "up" ? "#ef4444" : trend === "down" ? "#22c55e" : "#6b7280"}
        strokeWidth="1.5"
        points={points}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={w}
        cy={h - ((data[data.length - 1]!.price - min) / range) * h}
        r="2.5"
        fill={trend === "up" ? "#ef4444" : trend === "down" ? "#22c55e" : "#6b7280"}
      />
    </svg>
  );
}

export function PriceIntelligence({ compact = false }: { compact?: boolean }) {
  const [alerts, setAlerts] = useState<Record<string, boolean>>(
    AI_PREDICTIONS.reduce((acc, p) => ({ ...acc, [p.id]: p.alert }), {})
  );
  const [targetPrices, setTargetPrices] = useState<Record<string, number>>({});

  const toggleAlert = (id: string, productName: string) => {
    const newState = !alerts[id];
    setAlerts((prev) => ({ ...prev, [id]: newState }));
    toast.success(
      newState
        ? `🔔 Price alert set for ${productName}`
        : `🔕 Alert removed for ${productName}`
    );
  };

  if (compact) {
    return (
      <div className="space-y-2">
        {AI_PREDICTIONS.slice(0, 3).map((pred) => (
          <div key={pred.id} className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors">
            <span className="text-xl">{pred.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium truncate">{pred.product}</div>
              <div className={cn("text-[10px] font-semibold flex items-center gap-0.5",
                pred.trend === "down" ? "text-green-600" : "text-red-500")}>
                {pred.trend === "down" ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                {Math.abs(pred.change)}% predicted in {pred.timeline}
              </div>
            </div>
            <button
              onClick={() => toggleAlert(pred.id, pred.product)}
              className={cn("h-7 w-7 rounded-lg flex items-center justify-center transition-colors",
                alerts[pred.id] ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-primary/10")}
            >
              <Bell className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-ekda-gold-500 to-ekda-gold-700 flex items-center justify-center">
          <BarChart3 className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            AI Price Intelligence
            <Badge variant="gold" className="text-[10px]">
              <Sparkles className="h-2.5 w-2.5 mr-1" />
              Live
            </Badge>
          </h2>
          <p className="text-sm text-muted-foreground">
            AI predicts price movements using market data, weather, and trade patterns
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AI_PREDICTIONS.map((pred, i) => (
          <motion.div
            key={pred.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card className={cn("overflow-hidden border", pred.trend === "down" ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800")}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{pred.emoji}</span>
                    <div>
                      <div className="font-semibold text-sm">{pred.product}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatCurrency(pred.currentPrice, pred.currency as any)}/{pred.unit}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MiniSparkline
                      data={PRICE_DATA.crayfish || []}
                      trend={pred.trend as "up" | "down"}
                    />
                    <button
                      onClick={() => toggleAlert(pred.id, pred.product)}
                      className={cn(
                        "h-8 w-8 rounded-xl flex items-center justify-center transition-all",
                        alerts[pred.id]
                          ? "bg-primary text-white shadow-md shadow-primary/30"
                          : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                      )}
                      title={alerts[pred.id] ? "Remove alert" : "Set price alert"}
                    >
                      <Bell className={cn("h-3.5 w-3.5", alerts[pred.id] && "fill-white")} />
                    </button>
                  </div>
                </div>

                <div className={cn(
                  "flex items-center gap-2 p-2.5 rounded-xl mb-3",
                  pred.trend === "down"
                    ? "bg-green-50 dark:bg-green-900/20"
                    : "bg-red-50 dark:bg-red-900/20"
                )}>
                  {pred.trend === "down" ? (
                    <TrendingDown className="h-4 w-4 text-green-600 flex-shrink-0" />
                  ) : (
                    <TrendingUp className="h-4 w-4 text-red-500 flex-shrink-0" />
                  )}
                  <div>
                    <div className={cn("text-xs font-bold", pred.trend === "down" ? "text-green-700 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                      {pred.trend === "down" ? "↓" : "↑"} {Math.abs(pred.change)}% predicted in {pred.timeline}
                    </div>
                    <div className="text-[10px] text-muted-foreground">{pred.reason}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="text-xs text-muted-foreground">AI Confidence:</div>
                    <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", pred.confidence >= 85 ? "bg-green-500" : pred.confidence >= 70 ? "bg-yellow-500" : "bg-red-500")}
                        style={{ width: `${pred.confidence}%` }}
                      />
                    </div>
                    <div className="text-xs font-medium">{pred.confidence}%</div>
                  </div>
                  <div className="text-xs">
                    Target: <span className="font-bold text-foreground">
                      {formatCurrency(pred.predictedPrice, pred.currency as any)}
                    </span>
                  </div>
                </div>

                {alerts[pred.id] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 pt-3 border-t border-border"
                  >
                    <div className="flex items-center gap-2 text-[10px] text-green-600">
                      <CheckCircle2 className="h-3 w-3" />
                      Alert active — you'll be notified when price reaches{" "}
                      <span className="font-bold">
                        {formatCurrency(pred.predictedPrice, pred.currency as any)}
                      </span>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
