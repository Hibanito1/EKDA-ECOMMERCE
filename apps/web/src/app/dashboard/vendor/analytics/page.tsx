"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Globe, Package, ArrowUpRight, Zap, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@ekda/shared";

const REVENUE_DATA = [
  { month: "Jan", revenue: 420000, orders: 12, forecast: 480000 },
  { month: "Feb", revenue: 680000, orders: 18, forecast: 640000 },
  { month: "Mar", revenue: 540000, orders: 15, forecast: 580000 },
  { month: "Apr", revenue: 890000, orders: 24, forecast: 850000 },
  { month: "May", revenue: 1200000, orders: 32, forecast: 1100000 },
  { month: "Jun", revenue: 980000, orders: 28, forecast: 1050000 },
  { month: "Jul", revenue: null, orders: null, forecast: 1280000 },
  { month: "Aug", revenue: null, orders: null, forecast: 1450000 },
];

const TOP_DESTINATIONS = [
  { country: "🇬🇧 United Kingdom", orders: 45, revenue: 1840000, growth: 18 },
  { country: "🇺🇸 United States", orders: 38, revenue: 1420000, growth: 22 },
  { country: "🇨🇦 Canada", orders: 22, revenue: 880000, growth: 35 },
  { country: "🇩🇪 Germany", orders: 14, revenue: 610000, growth: -5 },
  { country: "🇳🇱 Netherlands", orders: 10, revenue: 420000, growth: 12 },
];

const DEMAND_FORECAST = [
  { product: "Dried Crayfish", current: 850, predicted: 1200, confidence: 92, trend: "up" },
  { product: "Palm Oil 5L", current: 340, predicted: 290, confidence: 84, trend: "down" },
  { product: "Garri Ijebu", current: 680, predicted: 820, confidence: 88, trend: "up" },
  { product: "Egusi Seeds", current: 420, predicted: 530, confidence: 76, trend: "up" },
];

const CATEGORY_PIE = [
  { name: "Dried Produce", value: 42, color: "#16a34a" },
  { name: "Groceries", value: 28, color: "#f59e0b" },
  { name: "Agri Commodities", value: 18, color: "#3b82f6" },
  { name: "Frozen Produce", value: 12, color: "#8b5cf6" },
];

export default function VendorAnalyticsPage() {
  const [period, setPeriod] = useState("6months");

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Advanced Analytics
            <Badge variant="gold" className="text-xs">
              <Sparkles className="h-3 w-3 mr-1" />
              Premium
            </Badge>
          </h1>
          <p className="text-muted-foreground text-sm">AI-powered insights and demand forecasting</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="text-sm border border-border rounded-xl px-3 py-2 bg-background"
        >
          <option value="3months">Last 3 months</option>
          <option value="6months">Last 6 months</option>
          <option value="year">Last year</option>
        </select>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: "₦4.71M", change: "+18.2%", up: true },
          { label: "Total Orders", value: "129", change: "+12.5%", up: true },
          { label: "Avg Order Value", value: "₦36,500", change: "+5.3%", up: true },
          { label: "Return Rate", value: "2.1%", change: "-0.4%", up: true },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
              <div className="text-xl font-bold">{stat.value}</div>
              <div className={`text-xs flex items-center gap-0.5 mt-1 ${stat.up ? "text-green-600" : "text-red-500"}`}>
                {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue + Forecast */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Revenue & AI Forecast</CardTitle>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1"><div className="h-2 w-4 bg-primary rounded-full" />Actual</div>
                <div className="flex items-center gap-1"><div className="h-2 w-4 bg-ekda-gold-400 rounded-full border-dashed border border-ekda-gold-400" />AI Forecast</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} tickFormatter={(v) => `₦${v / 1000}K`} />
                <Tooltip
                  formatter={(v: number) => [`₦${(v / 1000).toFixed(0)}K`, ""]}
                  contentStyle={{ borderRadius: "12px", fontSize: "12px", border: "1px solid hsl(var(--border))" }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2} fill="url(#revGradient)" name="Revenue" connectNulls={false} />
                <Area type="monotone" dataKey="forecast" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" fill="url(#forecastGradient)" name="Forecast" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Split */}
        <Card>
          <CardHeader><CardTitle>Sales by Category</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={CATEGORY_PIE} cx="50%" cy="50%" innerRadius={45} outerRadius={65} paddingAngle={3} dataKey="value">
                  {CATEGORY_PIE.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {CATEGORY_PIE.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Destinations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Top Destination Markets
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Country", "Orders", "Revenue", "Growth"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TOP_DESTINATIONS.map((dest) => (
                <tr key={dest.country} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-6 py-3 font-medium text-sm">{dest.country}</td>
                  <td className="px-6 py-3 text-sm text-muted-foreground">{dest.orders}</td>
                  <td className="px-6 py-3 text-sm font-semibold">{formatCurrency(dest.revenue, "NGN")}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-semibold flex items-center gap-0.5 w-fit ${dest.growth > 0 ? "text-green-600" : "text-red-500"}`}>
                      {dest.growth > 0 ? <ArrowUpRight className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                      {Math.abs(dest.growth)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* AI Demand Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-ekda-gold-600" />
            AI Demand Forecast (Next 30 days)
            <Badge variant="gold" className="text-[10px]">🤖 AI</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Product", "Current Stock", "AI Predicted Demand", "Confidence", "Action"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMAND_FORECAST.map((item) => (
                <tr key={item.product} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-6 py-3 font-medium text-sm">{item.product}</td>
                  <td className="px-6 py-3 text-sm text-muted-foreground">{item.current} units</td>
                  <td className="px-6 py-3">
                    <div className={`text-sm font-semibold flex items-center gap-1 ${item.trend === "up" ? "text-green-600" : "text-red-500"}`}>
                      {item.trend === "up" ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                      {item.predicted} units
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 bg-muted rounded-full">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${item.confidence}%` }} />
                      </div>
                      <span className="text-xs">{item.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    {item.trend === "up" && item.predicted > item.current ? (
                      <Badge variant="warning" className="text-[10px]">⚡ Restock Soon</Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px]">✓ Stock OK</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
