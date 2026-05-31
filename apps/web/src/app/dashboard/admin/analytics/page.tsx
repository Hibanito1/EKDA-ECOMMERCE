"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, TrendingDown, Globe, Users, BarChart3, Map, Sparkles,
  ArrowUpRight, ArrowDownRight, Download, Calendar, Zap
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@ekda/shared";
import { cn } from "@/lib/utils";

const MONTHLY_GMV = [
  { month: "Jan", exports: 180000000, imports: 120000000, total: 300000000, users: 42000, commission: 30000000 },
  { month: "Feb", exports: 210000000, imports: 140000000, total: 350000000, users: 44200, commission: 35000000 },
  { month: "Mar", exports: 240000000, imports: 160000000, total: 400000000, users: 46800, commission: 40000000 },
  { month: "Apr", exports: 280000000, imports: 200000000, total: 480000000, users: 48900, commission: 48000000 },
  { month: "May", exports: 320000000, imports: 230000000, total: 550000000, users: 51000, commission: 55000000 },
  { month: "Jun", exports: 290000000, imports: 240000000, total: 530000000, users: 52410, commission: 53000000 },
  { month: "Jul", exports: null, imports: null, total: null, users: null, commission: null, forecast_total: 610000000 },
  { month: "Aug", exports: null, imports: null, total: null, users: null, commission: null, forecast_total: 680000000 },
];

const TOP_PRODUCTS = [
  { name: "Dried Crayfish", category: "Dried Produce", revenue: 84200000, orders: 2847, growth: 28 },
  { name: "Palm Oil (5L)", category: "Groceries", revenue: 62400000, orders: 1920, growth: 18 },
  { name: "Toyota Camry Import", category: "Vehicles", revenue: 185000000, orders: 10, growth: -5 },
  { name: "Garri Ijebu", category: "Groceries", revenue: 48600000, orders: 3240, growth: 42 },
  { name: "iPhone 15 Pro", category: "Electronics", revenue: 92400000, orders: 80, growth: 12 },
];

const TOP_COUNTRIES = [
  { country: "🇬🇧 United Kingdom", orders: 8420, gmv: 840000000, growth: 22, type: "export" },
  { country: "🇺🇸 United States", orders: 6840, gmv: 620000000, growth: 18, type: "export" },
  { country: "🇳🇬 Nigeria (Local)", orders: 12400, gmv: 1200000000, growth: 35, type: "both" },
  { country: "🇨🇦 Canada", orders: 3200, gmv: 284000000, growth: 40, type: "export" },
  { country: "🇩🇪 Germany", orders: 1840, gmv: 840000000, growth: 12, type: "import" },
  { country: "🇨🇳 China", orders: 940, gmv: 420000000, growth: 55, type: "import" },
];

const COHORT_DATA = [
  { month: "Jan", retained_m1: 68, retained_m3: 45, retained_m6: 32, ltv: 84000 },
  { month: "Feb", retained_m1: 71, retained_m3: 48, retained_m6: 35, ltv: 91000 },
  { month: "Mar", retained_m1: 74, retained_m3: 52, retained_m6: 38, ltv: 98000 },
  { month: "Apr", retained_m1: 76, retained_m3: 54, retained_m6: 40, ltv: 104000 },
  { month: "May", retained_m1: 79, retained_m3: 57, retained_m6: null, ltv: 112000 },
  { month: "Jun", retained_m1: 81, retained_m3: null, retained_m6: null, ltv: 118000 },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("6months");
  const [activeTab, setActiveTab] = useState<"gmv" | "products" | "countries" | "cohorts">("gmv");

  const totalGMV = MONTHLY_GMV.filter((m) => m.total).reduce((s, m) => s + (m.total || 0), 0);
  const totalCommission = MONTHLY_GMV.filter((m) => m.commission).reduce((s, m) => s + (m.commission || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Analytics & Business Intelligence
            <Badge variant="gold" className="text-[10px]">
              <Sparkles className="h-3 w-3 mr-1" />
              AI Forecasts
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm">Platform-wide GMV, market intelligence, and user cohort analysis</p>
        </div>
        <div className="flex gap-2">
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="h-9 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none">
            <option value="3months">Last 3 months</option>
            <option value="6months">Last 6 months</option>
            <option value="year">This year</option>
          </select>
          <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5" />Export PDF</Button>
        </div>
      </div>

      {/* Top KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total GMV (6mo)", value: formatCurrency(totalGMV, "NGN"), change: "+28%", trend: "up" },
          { label: "Commission Revenue", value: formatCurrency(totalCommission, "NGN"), change: "+28%", trend: "up" },
          { label: "New Users (6mo)", value: "10,410", change: "+24%", trend: "up" },
          { label: "Avg Order Value", value: "₦42,800", change: "+12%", trend: "up" },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card>
              <CardContent className="p-4">
                <div className="text-xl font-bold">{kpi.value}</div>
                <div className="text-xs text-muted-foreground">{kpi.label}</div>
                <div className={cn("text-xs font-medium mt-1 flex items-center gap-0.5", kpi.trend === "up" ? "text-green-600" : "text-red-500")}>
                  {kpi.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change} vs previous period
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-muted/50 rounded-2xl w-fit">
        {(["gmv", "products", "countries", "cohorts"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize",
              activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}>
            {tab === "gmv" ? "GMV & Revenue" : tab === "products" ? "Top Products" : tab === "countries" ? "Market Geography" : "User Cohorts"}
          </button>
        ))}
      </div>

      {/* GMV Tab */}
      {activeTab === "gmv" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card className="xl:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>GMV Trend with AI Forecast</CardTitle>
                <div className="flex items-center gap-3 text-[10px]">
                  {[{ c: "#16a34a", n: "Exports" }, { c: "#3b82f6", n: "Imports" }, { c: "#f59e0b", n: "AI Forecast" }].map((l) => (
                    <div key={l.n} className="flex items-center gap-1"><div className="h-2 w-4 rounded-sm" style={{ backgroundColor: l.c }} />{l.n}</div>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={MONTHLY_GMV}>
                  <defs>
                    {[["expGrad", "#16a34a"], ["impGrad", "#3b82f6"], ["foreGrad", "#f59e0b"]].map(([id, color]) => (
                      <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={color} stopOpacity={0.12} />
                        <stop offset="95%" stopColor={color} stopOpacity={0} />
                      </linearGradient>
                    ))}
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} tickLine={false} tickFormatter={(v) => `₦${(v / 1000000).toFixed(0)}M`} />
                  <Tooltip formatter={(v: number) => [`₦${(v / 1000000).toFixed(0)}M`, ""]} contentStyle={{ borderRadius: "12px", fontSize: "11px", border: "1px solid hsl(var(--border))" }} />
                  <Area type="monotone" dataKey="exports" stroke="#16a34a" strokeWidth={2} fill="url(#expGrad)" name="Exports" connectNulls={false} />
                  <Area type="monotone" dataKey="imports" stroke="#3b82f6" strokeWidth={2} fill="url(#impGrad)" name="Imports" connectNulls={false} />
                  <Area type="monotone" dataKey="forecast_total" stroke="#f59e0b" strokeWidth={2} strokeDasharray="6 4" fill="url(#foreGrad)" name="AI Forecast" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === "products" && (
        <Card>
          <CardHeader className="pb-2"><CardTitle>Top Products by Revenue</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["#", "Product", "Category", "Revenue (6mo)", "Orders", "Growth"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOP_PRODUCTS.map((product, i) => (
                  <tr key={product.name} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-6 py-4 text-muted-foreground font-medium">{i + 1}</td>
                    <td className="px-6 py-4 font-semibold">{product.name}</td>
                    <td className="px-6 py-4"><Badge variant="outline" className="text-[10px]">{product.category}</Badge></td>
                    <td className="px-6 py-4 font-bold">{formatCurrency(product.revenue, "NGN")}</td>
                    <td className="px-6 py-4 text-muted-foreground">{product.orders.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={cn("text-xs font-semibold flex items-center gap-0.5 w-fit", product.growth > 0 ? "text-green-600" : "text-red-500")}>
                        {product.growth > 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                        {Math.abs(product.growth)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Countries Tab */}
      {activeTab === "countries" && (
        <Card>
          <CardHeader className="pb-2"><CardTitle>Market Geography</CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Country", "Orders", "Total GMV", "Type", "Growth"].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-xs font-medium text-muted-foreground uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOP_COUNTRIES.map((country) => (
                  <tr key={country.country} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-6 py-4 font-semibold">{country.country}</td>
                    <td className="px-6 py-4 text-muted-foreground">{country.orders.toLocaleString()}</td>
                    <td className="px-6 py-4 font-bold">{formatCurrency(country.gmv, "NGN")}</td>
                    <td className="px-6 py-4">
                      <Badge variant={country.type === "export" ? "export" : country.type === "import" ? "import" : "default"} className="text-[10px] capitalize">
                        {country.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("text-xs font-semibold flex items-center gap-0.5 w-fit", "text-green-600")}>
                        <ArrowUpRight className="h-3.5 w-3.5" />+{country.growth}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Cohorts Tab */}
      {activeTab === "cohorts" && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>User Cohort Retention Analysis</CardTitle>
            <p className="text-xs text-muted-foreground">% of users still active after 1, 3, and 6 months</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={COHORT_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v: number) => [`${v}%`, ""]} contentStyle={{ borderRadius: "12px", fontSize: "11px", border: "1px solid hsl(var(--border))" }} />
                <Line type="monotone" dataKey="retained_m1" stroke="#16a34a" strokeWidth={2} dot={{ r: 4 }} name="1-Month Retention" connectNulls={false} />
                <Line type="monotone" dataKey="retained_m3" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="3-Month Retention" connectNulls={false} />
                <Line type="monotone" dataKey="retained_m6" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} name="6-Month Retention" connectNulls={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
