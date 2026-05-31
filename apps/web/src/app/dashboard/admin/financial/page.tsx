"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, CheckCircle2,
  Clock, AlertCircle, Download, Filter, Search, DollarSign, Plus,
  RefreshCw, FileText, BarChart3, CreditCard, Zap
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@ekda/shared";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const PAYOUT_DATA = [
  { day: "Mon", amount: 12400000, count: 48 },
  { day: "Tue", amount: 9800000, count: 38 },
  { day: "Wed", amount: 15600000, count: 61 },
  { day: "Thu", amount: 11200000, count: 43 },
  { day: "Fri", amount: 18400000, count: 72 },
  { day: "Sat", amount: 21000000, count: 82 },
  { day: "Sun", amount: 16800000, count: 65 },
];

const PENDING_PAYOUTS = [
  { id: "p1", ref: "PAY-MK8X3F", user: "Lagos Fresh Exports", type: "vendor", amount: 847000, bank: "Access Bank", trigger: "escrow_release", status: "pending", created: "2025-06-01" },
  { id: "p2", ref: "PAY-PL9Q4R", user: "Maersk Line NG", type: "carrier", amount: 285000, bank: "Zenith Bank", trigger: "escrow_release", status: "pending", created: "2025-06-01" },
  { id: "p3", ref: "PAY-TY7N1A", user: "Amara Agricultural", type: "vendor", amount: 1240000, bank: "GTBank", trigger: "manual", status: "pending", created: "2025-05-31" },
  { id: "p4", ref: "PAY-BF2K8S", user: "DHL Express NG", type: "carrier", amount: 420000, bank: "First Bank", trigger: "scheduled", status: "processing", created: "2025-05-31" },
  { id: "p5", ref: "PAY-RT5V2Z", user: "Euro Auto GmbH", type: "vendor", amount: 8740000, bank: "SWIFT/EUR", trigger: "escrow_release", status: "pending", created: "2025-05-30" },
];

const COMMISSION_ADJUSTMENTS = [
  { vendor: "Lagos Fresh Exports", current: 8.5, standard: 10, plan: "Growth", since: "2025-05-01" },
  { vendor: "Amara Agricultural", current: 10, standard: 10, plan: "Standard", since: "2024-01-01" },
  { vendor: "Euro Auto GmbH", current: 7, standard: 10, plan: "Enterprise", since: "2025-03-15" },
];

const FINANCIAL_OVERVIEW = [
  { label: "Total GMV (MTD)", value: "₦2.4B", change: "+18%", trend: "up" },
  { label: "Commission Earned", value: "₦240M", change: "+18%", trend: "up" },
  { label: "Payouts Processed", value: "₦198M", change: "This month", trend: "neutral" },
  { label: "Pending Payouts", value: "₦11.5M", change: "67 pending", trend: "neutral" },
  { label: "Escrow Balance", value: "₦284M", change: "312 orders", trend: "neutral" },
  { label: "Refunds Issued", value: "₦4.2M", change: "This month", trend: "down" },
];

export default function FinancialControlsPage() {
  const [selectedPayouts, setSelectedPayouts] = useState<string[]>([]);
  const [processingAll, setProcessingAll] = useState(false);
  const [activeTab, setActiveTab] = useState<"payouts" | "commissions" | "refunds" | "reconciliation">("payouts");

  const handleBatchPayout = async () => {
    if (selectedPayouts.length === 0) {
      toast.error("Select payouts to process");
      return;
    }
    setProcessingAll(true);
    await new Promise((r) => setTimeout(r, 2000));
    setProcessingAll(false);
    toast.success(`✅ ${selectedPayouts.length} payouts initiated via Paystack Transfer API`);
    setSelectedPayouts([]);
  };

  const totalSelected = PENDING_PAYOUTS
    .filter((p) => selectedPayouts.includes(p.id))
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Wallet className="h-6 w-6 text-ekda-gold-600" />
            Financial Controls
          </h1>
          <p className="text-muted-foreground text-sm">Payouts, commissions, refunds, and reconciliation</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5" />Export</Button>
          <Button variant="premium" size="sm"><RefreshCw className="h-3.5 w-3.5" />Reconcile</Button>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {FINANCIAL_OVERVIEW.map((item, i) => (
          <motion.div key={item.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card>
              <CardContent className="p-4">
                <div className="text-lg font-bold">{item.value}</div>
                <div className="text-[10px] text-muted-foreground">{item.label}</div>
                <div className={cn("text-[10px] font-medium mt-0.5",
                  item.trend === "up" ? "text-green-600" : item.trend === "down" ? "text-red-500" : "text-muted-foreground"
                )}>{item.change}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Payout Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>7-Day Payout Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={PAYOUT_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} tickFormatter={(v) => `₦${(v / 1000000).toFixed(0)}M`} />
              <Tooltip formatter={(v: number) => [`₦${(v / 1000000).toFixed(1)}M`, "Payouts"]} contentStyle={{ borderRadius: "12px", fontSize: "11px", border: "1px solid hsl(var(--border))" }} />
              <Bar dataKey="amount" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted/50 rounded-2xl w-fit">
        {(["payouts", "commissions", "refunds", "reconciliation"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize",
              activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}>
            {tab}
          </button>
        ))}
      </div>

      {/* Payouts Tab */}
      {activeTab === "payouts" && (
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Pending Payouts</CardTitle>
              <div className="flex items-center gap-2">
                {selectedPayouts.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    {selectedPayouts.length} selected · {formatCurrency(totalSelected, "NGN")}
                  </div>
                )}
                <Button
                  size="sm"
                  variant="premium"
                  onClick={handleBatchPayout}
                  loading={processingAll}
                  disabled={selectedPayouts.length === 0}
                >
                  <Zap className="h-3.5 w-3.5" />
                  Process Selected ({selectedPayouts.length})
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left w-8">
                    <input type="checkbox" className="rounded" onChange={(e) => setSelectedPayouts(e.target.checked ? PENDING_PAYOUTS.map((p) => p.id) : [])} />
                  </th>
                  {["Reference", "Recipient", "Amount", "Bank", "Trigger", "Status", "Date", "Action"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PENDING_PAYOUTS.map((payout) => (
                  <tr key={payout.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="rounded" checked={selectedPayouts.includes(payout.id)} onChange={(e) => setSelectedPayouts(e.target.checked ? [...selectedPayouts, payout.id] : selectedPayouts.filter((id) => id !== payout.id))} />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-primary">{payout.ref}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium">{payout.user}</div>
                      <Badge variant={payout.type === "vendor" ? "export" : "blue"} className="text-[9px] mt-0.5">{payout.type}</Badge>
                    </td>
                    <td className="px-4 py-3 font-bold text-sm">{formatCurrency(payout.amount, "NGN")}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{payout.bank}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[10px] capitalize">{payout.trigger.replace("_", " ")}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={payout.status === "processing" ? "blue" : "warning"} className="text-[10px] capitalize">{payout.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(payout.created)}</td>
                    <td className="px-4 py-3">
                      <Button size="sm" className="h-7 text-xs" onClick={() => toast.success(`Processing ${payout.ref}...`)}>
                        Pay Now
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Commissions Tab */}
      {activeTab === "commissions" && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Commission Rate Management</CardTitle>
              <Button variant="premium" size="sm"><Plus className="h-3.5 w-3.5" />Add Override</Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Vendor", "Current Rate", "Standard Rate", "Plan", "Savings/Order", "Active Since", "Actions"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMMISSION_ADJUSTMENTS.map((adj) => (
                  <tr key={adj.vendor} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium">{adj.vendor}</td>
                    <td className="px-6 py-4">
                      <span className={cn("font-bold", adj.current < adj.standard ? "text-green-600" : "")}>{adj.current}%</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{adj.standard}%</td>
                    <td className="px-6 py-4"><Badge variant="gold" className="text-[10px]">{adj.plan}</Badge></td>
                    <td className="px-6 py-4 text-green-600 font-medium">
                      {adj.current < adj.standard ? `−${(adj.standard - adj.current).toFixed(1)}%` : "—"}
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">{formatDate(adj.since)}</td>
                    <td className="px-6 py-4">
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success("Commission editor opened")}>Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Refunds Tab */}
      {activeTab === "refunds" && (
        <div className="text-center py-16 text-muted-foreground">
          <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="font-medium mb-2">Refund Management</p>
          <p className="text-sm">Process chargebacks and issue refunds via Paystack/Stripe API</p>
          <Button variant="premium" className="mt-4" size="sm">
            <Plus className="h-3.5 w-3.5" />
            Create Refund
          </Button>
        </div>
      )}

      {/* Reconciliation Tab */}
      {activeTab === "reconciliation" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["Paystack Reconciliation", "Stripe Reconciliation", "Escrow Balance Check", "Commission Audit"].map((report) => (
            <Card key={report} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => toast.success(`Generating ${report}...`)}>
              <CardContent className="p-5 flex items-center gap-4">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{report}</div>
                  <div className="text-xs text-muted-foreground">Last run: 2 hours ago</div>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs">
                  <Download className="h-3 w-3" />
                  Run
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
