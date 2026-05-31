"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Info,
  Loader2,
  Package,
  Truck,
  Shield,
  FileText,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@ekda/shared";
import { NIGERIAN_SEAPORTS, NIGERIAN_AIRPORTS } from "@ekda/shared";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface CostBreakdown {
  product_cost: number;
  freight_cost: number;
  insurance_cost: number;
  cif_value: number;
  customs_duty: number;
  port_levy: number;
  vat: number;
  clearing_fee: number;
  ciss_surcharge: number;
  etls_surcharge: number;
  total_landed_cost: number;
  currency: string;
}

interface LandedCostResult {
  breakdown: CostBreakdown;
  rates: {
    duty_rate: number;
    port_levy_rate: number;
    vat_rate: number;
    insurance_rate: number;
    hs_code: string;
  };
  as_percentage: { freight: string; duties_taxes: string; product: string };
  ai_note: string;
}

const PIE_COLORS = {
  product: "#16a34a",
  freight: "#3b82f6",
  duties_taxes: "#f59e0b",
  other: "#6b7280",
};

export function LandedCostCalculator({ prefillHsCode = "", prefillProductPrice = 0, prefillCurrency = "NGN" }: {
  prefillHsCode?: string;
  prefillProductPrice?: number;
  prefillCurrency?: string;
}) {
  const [form, setForm] = useState({
    product_price: prefillProductPrice || "",
    product_currency: prefillCurrency || "NGN",
    hs_code: prefillHsCode || "",
    cargo_type: "sea",
    weight_kg: "",
    destination_port: "NGAPP",
    destination_type: "sea",
    quantity: "1",
    insurance_rate: "0.025",
  });
  const [result, setResult] = useState<LandedCostResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleCalculate = async () => {
    if (!form.product_price || !form.weight_kg) {
      toast.error("Please enter product price and weight");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/landed-cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_price: Number(form.product_price),
          product_currency: form.product_currency,
          hs_code: form.hs_code,
          cargo_type: form.cargo_type,
          weight_kg: Number(form.weight_kg),
          destination_port: form.destination_port,
          insurance_rate: Number(form.insurance_rate),
          quantity: Number(form.quantity),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data);
        setExpanded(true);
      } else {
        toast.error(data.error || "Calculation failed");
      }
    } catch {
      toast.error("Service temporarily unavailable");
    } finally {
      setLoading(false);
    }
  };

  const portOptions = form.destination_type === "sea" ? NIGERIAN_SEAPORTS : NIGERIAN_AIRPORTS;

  const BREAKDOWN_ITEMS = result ? [
    { key: "product_cost", label: "Product Cost", icon: Package, color: "text-ekda-green-600", value: result.breakdown.product_cost },
    { key: "freight_cost", label: `Freight (${form.cargo_type === "sea" ? "Sea" : "Air"})`, icon: Truck, color: "text-blue-600", value: result.breakdown.freight_cost },
    { key: "insurance_cost", label: "Insurance", icon: Shield, color: "text-purple-600", value: result.breakdown.insurance_cost },
    { key: "customs_duty", label: `Customs Duty (${Math.round(result.rates.duty_rate * 100)}%)`, icon: FileText, color: "text-orange-600", value: result.breakdown.customs_duty },
    { key: "port_levy", label: `Port Levy (${Math.round(result.rates.port_levy_rate * 100)}%)`, icon: FileText, color: "text-yellow-600", value: result.breakdown.port_levy },
    { key: "vat", label: "VAT (7.5%)", icon: DollarSign, color: "text-red-600", value: result.breakdown.vat },
    { key: "clearing_fee", label: "Clearing Agent Fee", icon: CheckCircle2, color: "text-teal-600", value: result.breakdown.clearing_fee },
    { key: "ciss_surcharge", label: "CISS Surcharge (1%)", icon: Info, color: "text-gray-500", value: result.breakdown.ciss_surcharge },
    { key: "etls_surcharge", label: "ETLS Surcharge (0.5%)", icon: Info, color: "text-gray-500", value: result.breakdown.etls_surcharge },
  ] : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <Calculator className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>Total Landed Cost Calculator</CardTitle>
            <p className="text-sm text-muted-foreground">
              Full cost breakdown including duties, VAT, and clearing
            </p>
          </div>
          <Badge variant="gold" className="ml-auto text-xs">🤖 AI-Powered</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium">Product Price</label>
            <div className="flex gap-1.5">
              <select
                value={form.product_currency}
                onChange={(e) => update("product_currency", e.target.value)}
                className="w-16 h-10 text-xs border border-input rounded-xl px-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {["NGN", "USD", "GBP", "EUR"].map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Price"
                value={form.product_price}
                onChange={(e) => update("product_price", e.target.value)}
                className="flex-1 h-10 px-3 rounded-xl border border-input text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium">Weight (kg)</label>
            <input
              type="number"
              placeholder="e.g. 50"
              value={form.weight_kg}
              onChange={(e) => update("weight_kg", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-input text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium">HS Code</label>
            <input
              type="text"
              placeholder="e.g. 8703.23"
              value={form.hs_code}
              onChange={(e) => update("hs_code", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-input text-sm bg-background font-mono focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium">Quantity</label>
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => update("quantity", e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-input text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium">Cargo Type</label>
            <select
              value={form.cargo_type}
              onChange={(e) => update("cargo_type", e.target.value)}
              className="w-full h-10 text-sm border border-input rounded-xl px-3 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="sea">🚢 Sea Freight</option>
              <option value="air">✈️ Air Freight</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium">Destination</label>
            <select
              value={form.destination_port}
              onChange={(e) => update("destination_port", e.target.value)}
              className="w-full h-10 text-xs border border-input rounded-xl px-2 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {NIGERIAN_SEAPORTS.map((p) => (
                <option key={p.code} value={p.code}>{p.name}</option>
              ))}
              {NIGERIAN_AIRPORTS.map((a) => (
                <option key={a.code} value={a.code}>{a.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 col-span-2">
            <label className="text-xs font-medium">Insurance</label>
            <select
              value={form.insurance_rate}
              onChange={(e) => update("insurance_rate", e.target.value)}
              className="w-full h-10 text-sm border border-input rounded-xl px-3 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="0">No insurance</option>
              <option value="0.01">Basic (1%)</option>
              <option value="0.025">Comprehensive (2.5%)</option>
            </select>
          </div>
        </div>

        <Button onClick={handleCalculate} variant="premium" className="w-full" loading={loading}>
          <Calculator className="h-4 w-4" />
          Calculate Full Landed Cost
        </Button>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 pt-2 border-t border-border"
            >
              {/* AI Note */}
              <div className={cn(
                "flex items-start gap-2 p-3 rounded-xl text-sm",
                result.ai_note.startsWith("⚠️") ? "bg-yellow-50 dark:bg-yellow-900/20" :
                result.ai_note.startsWith("✅") ? "bg-green-50 dark:bg-green-900/20" :
                "bg-muted/40"
              )}>
                <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">{result.ai_note}</p>
              </div>

              {/* Total */}
              <div className="text-center p-4 bg-gradient-to-br from-ekda-dark to-ekda-navy rounded-2xl">
                <div className="text-white/60 text-xs mb-1">Total Landed Cost (Nigeria)</div>
                <div className="text-3xl font-bold text-white">
                  {formatCurrency(result.breakdown.total_landed_cost, "NGN")}
                </div>
                <div className="flex justify-center gap-4 mt-3">
                  {[
                    { label: "Product", pct: result.as_percentage.product, color: "bg-ekda-green-400" },
                    { label: "Freight", pct: result.as_percentage.freight, color: "bg-blue-400" },
                    { label: "Duties & Taxes", pct: result.as_percentage.duties_taxes, color: "bg-yellow-400" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-1">
                      <div className={cn("h-2 w-2 rounded-full", item.color)} />
                      <span className="text-white/60 text-[10px]">{item.label} {item.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Breakdown Toggle */}
              <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between text-sm font-medium hover:text-primary transition-colors"
              >
                <span>Detailed Breakdown</span>
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>

              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-2"
                  >
                    {BREAKDOWN_ITEMS.map((item) => (
                      <div key={item.key} className="flex items-center justify-between py-1.5 border-b border-border last:border-0">
                        <div className="flex items-center gap-2">
                          <item.icon className={cn("h-3.5 w-3.5", item.color)} />
                          <span className="text-xs text-muted-foreground">{item.label}</span>
                        </div>
                        <span className="text-xs font-semibold">
                          {formatCurrency(item.value, "NGN")}
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between py-2 font-bold">
                      <span className="text-sm">Total Landed Cost</span>
                      <span className="text-lg text-primary">
                        {formatCurrency(result.breakdown.total_landed_cost, "NGN")}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
