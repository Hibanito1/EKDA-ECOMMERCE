"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  TrendingUp, TrendingDown, Users, ShoppingCart, Wallet, Shield,
  AlertCircle, Package, Truck, Globe, CheckCircle2, Clock, Bot,
  ArrowUpRight, Zap, Activity, ChevronRight, BarChart3
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@ekda/shared";
import { cn } from "@/lib/utils";

const GMV_DATA = [
  { day: "Mon", gmv: 42000000, orders: 312, commission: 4200000 },
  { day: "Tue", gmv: 38000000, orders: 287, commission: 3800000 },
  { day: "Wed", gmv: 55000000, orders: 418, commission: 5500000 },
  { day: "Thu", gmv: 49000000, orders: 367, commission: 4900000 },
  { day: "Fri", gmv: 71000000, orders: 534, commission: 7100000 },
  { day: "Sat", gmv: 83000000, orders: 612, commission: 8300000 },
  { day: "Sun", gmv: 61000000, orders: 455, commission: 6100000 },
];

const MARKETPLACE_SPLIT = [
  { name: "African Exports", value: 58, color: "#16a34a" },
  { name: "Global Imports", value: 42, color: "#3b82f6" },
];

const SYSTEM_STATUS = [
  { service: "Paystack", status: "healthy", latency: 89 },
  { service: "Stripe", status: "healthy", latency: 142 },
  { service: "Groq AI", status: "healthy", latency: 312 },
  { service: "Supabase DB", status: "healthy", latency: 24 },
  { service: "Supabase Auth", status: "healthy", latency: 31 },
  { service: "Monnify", status: "degraded", latency: 892 },
];

const RECENT_ACTIVITY = [
  { type: "order", msg: "New order EKDA-MK3X2F — ₦196,500 (Sea Freight, Lagos→UK)", time: "12s ago", color: "text-blue-500" },
  { type: "kyc", msg: "KYC submitted by Chen Wei (Vendor, China) — AI Risk: 71/100", time: "45s ago", color: "text-yellow-500" },
  { type: "escrow", msg: "Escrow 1st release triggered — ₦84,000 to Lagos Fresh Exports", time: "2m ago", color: "text-green-500" },
  { type: "dispute", msg: "Dispute DIS-XY9K3 opened — FastTrack Freight / Missing cargo", time: "5m ago", color: "text-red-500" },
  { type: "ai", msg: "AI classified 23 products via HS Code Engine — avg 96% confidence", time: "8m ago", color: "text-purple-500" },
  { type: "payment", msg: "Payment ₦1.15M received via Paystack — Import order (Vehicle)", time: "11m ago", color: "text-ekda-gold-500" },
];

const CRITICAL_ALERTS = [
  { level: "critical", msg: "3 disputes unattended >48h — risk of SLA breach", action: "View Disputes", href: "/dashboard/admin/disputes" },
  { level: "warning", msg: "Monnify gateway latency elevated (892ms) — monitor closely", action: "Check System", href: "/dashboard/admin/system" },
  { level: "info", msg: "₦284M escrow balance — 8 orders awaiting 2nd release", action: "Manage Escrow", href: "/dashboard/admin/escrow" },
];

const KPI_CARDS = [
  { label: "7-Day GMV", value: "₦399M", change: "+18.2%", trend: "up", sub: "238 orders today", icon: TrendingUp, color: "text-ekda-green-600", bg: "bg-ekda-green-50 dark:bg-ekda-green-900/20" },
  { label: "Commission Earned", value: "₦39.9M", change: "+18.2%", trend: "up", sub: "7-day total", icon: Wallet, color: "text-ekda-gold-600", bg: "bg-ekda-gold-50 dark:bg-ekda-gold-900/20" },
  { label: "Active Users", value: "52,410", change: "+8.4%", trend: "up", sub: "1,204 new this week", icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { label: "Escrow Held", value: "₦284M", change: "312 orders", trend: "neutral", sub: "8 awaiting release", icon: Shield, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" },
  { label: "Open Disputes", value: "23", change: "3 critical", trend: "down", sub: "Avg resolution: 18h", icon: AlertCircle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
  { label: "KYC Pending", value: "8", change: "2 high risk", trend: "neutral", sub: "Avg 6h review time", icon: Package, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
  { label: "Active Carriers", value: "486", change: "+12 this week", trend: "up", sub: "14 jobs available", icon: Truck, color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-900/20" },
  { label: "AI Operations", value: "1,247", change: "Today", trend: "up", sub: "Avg 97% accuracy", icon: Bot, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
];

export default function AdminCommandCenter() {
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTicker((t) => t + 1), 5000);
    return () => clearInterval(interval);
  }, []);

  const weekGMV = GMV_DATA.reduce((s, d) => s + d.gmv, 0);
  const todayGMV = GMV_DATA[GMV_DATA.length - 1]!.gmv;

  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Critical Alerts */}
      {CRITICAL_ALERTS.length > 0 && (
        <div className="space-y-2">
          {CRITICAL_ALERTS.map((alert) => (
            <motion.div
              key={alert.msg}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm",
                alert.level === "critical" ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" :
                alert.level === "warning" ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800" :
                "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
              )}
            >
              <AlertCircle className={cn("h-4 w-4 flex-shrink-0",
                alert.level === "critical" ? "text-red-600" : alert.level === "warning" ? "text-yellow-600" : "text-blue-600"
              )} />
              <span className={cn("flex-1",
                alert.level === "critical" ? "text-red-700 dark:text-red-300" : alert.level === "warning" ? "text-yellow-700 dark:text-yellow-300" : "text-blue-700 dark:text-blue-300"
              )}>
                {alert.msg}
              </span>
              <Link href={alert.href}>
                <Button size="sm" className="h-7 text-xs flex-shrink-0">{alert.action}</Button>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-4">
        {KPI_CARDS.map((card, i) => (
          <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center mb-2", card.bg)}>
                  <card.icon className={cn("h-4 w-4", card.color)} />
                </div>
                <div className="text-lg font-bold leading-none">{card.value}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{card.label}</div>
                <div className={cn("text-[10px] font-medium mt-1", card.trend === "up" ? "text-green-600" : card.trend === "down" ? "text-red-500" : "text-muted-foreground")}>
                  {card.change}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* GMV Chart */}
        <Card className="xl:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>7-Day GMV & Commission</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Week total: {formatCurrency(weekGMV, "NGN")} · Today: {formatCurrency(todayGMV, "NGN")}
                </p>
              </div>
              <select className="text-xs border border-border rounded-lg px-2 py-1 bg-background">
                <option>This Week</option>
                <option>This Month</option>
                <option>This Quarter</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={GMV_DATA}>
                <defs>
                  <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="commGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} />
                <YAxis tick={{ fontSize: 10 }} tickLine={false} tickFormatter={(v) => `₦${(v / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(v: number) => [`₦${(v / 1000000).toFixed(1)}M`, ""]} contentStyle={{ borderRadius: "12px", fontSize: "11px", border: "1px solid hsl(var(--border))" }} />
                <Area type="monotone" dataKey="gmv" stroke="#16a34a" strokeWidth={2} fill="url(#gmvGrad)" name="GMV" />
                <Area type="monotone" dataKey="commission" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" fill="url(#commGrad)" name="Commission" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Marketplace Split + System */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Marketplace Split</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={100}>
                <PieChart>
                  <Pie data={MARKETPLACE_SPLIT} cx="50%" cy="50%" innerRadius={30} outerRadius={45} paddingAngle={3} dataKey="value">
                    {MARKETPLACE_SPLIT.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1 mt-1">
                {MARKETPLACE_SPLIT.map((m) => (
                  <div key={m.name} className="flex justify-between text-xs">
                    <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full" style={{ backgroundColor: m.color }} /><span className="text-muted-foreground">{m.name}</span></div>
                    <span className="font-semibold">{m.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                System Health
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 p-4 pt-0">
              {SYSTEM_STATUS.slice(0, 4).map((s) => (
                <div key={s.service} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{s.service}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={cn("font-medium", s.status === "healthy" ? "text-green-600" : "text-yellow-600")}>
                      {s.latency}ms
                    </span>
                    <div className={cn("h-1.5 w-1.5 rounded-full", s.status === "healthy" ? "bg-green-500" : "bg-yellow-500")} />
                  </div>
                </div>
              ))}
              <Link href="/dashboard/admin/system">
                <div className="text-[10px] text-primary hover:underline mt-1 cursor-pointer">View all services →</div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Activity Feed + Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Live Activity Feed */}
        <Card className="xl:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <CardTitle>Live Activity Feed</CardTitle>
              <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              <Badge variant="success" className="text-[10px] ml-auto">Real-time</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 p-4 pt-0">
            {RECENT_ACTIVITY.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-2.5 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <div className={cn("h-1.5 w-1.5 rounded-full mt-1.5 flex-shrink-0", item.color.replace("text-", "bg-"))} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-relaxed">{item.msg}</p>
                  <span className="text-[10px] text-muted-foreground">{item.time}</span>
                </div>
              </motion.div>
            ))}
            <Link href="/dashboard/admin/realtime">
              <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
                <Activity className="h-3.5 w-3.5" />
                View Full Activity Stream
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2 p-4 pt-0">
              {[
                { label: "Process KYC Queue (8)", href: "/dashboard/admin/kyc", icon: Package, variant: "warning" },
                { label: "Resolve Disputes (23)", href: "/dashboard/admin/disputes", icon: AlertCircle, variant: "error" },
                { label: "Process Payouts", href: "/dashboard/admin/financial", icon: Wallet, variant: "default" },
                { label: "Review AI Flags", href: "/dashboard/admin/ai-monitor", icon: Bot, variant: "default" },
                { label: "View All Orders", href: "/dashboard/admin/orders", icon: ShoppingCart, variant: "default" },
              ].map((action) => (
                <Link key={action.href} href={action.href}>
                  <div className={cn(
                    "flex items-center gap-2.5 p-3 rounded-xl border hover:bg-muted/50 transition-all cursor-pointer text-sm",
                    action.variant === "warning" && "border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10",
                    action.variant === "error" && "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10"
                  )}>
                    <action.icon className={cn("h-4 w-4 flex-shrink-0",
                      action.variant === "warning" ? "text-yellow-600" : action.variant === "error" ? "text-red-600" : "text-muted-foreground"
                    )} />
                    <span className="flex-1 text-xs">{action.label}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Zap className="h-4 w-4 text-ekda-gold-600" />Today's Stats</CardTitle></CardHeader>
            <CardContent className="space-y-2 p-4 pt-0">
              {[
                { label: "New Orders", value: "238" },
                { label: "New Signups", value: "84" },
                { label: "KYC Reviews", value: "12" },
                { label: "Disputes Resolved", value: "7" },
                { label: "AI Classifications", value: "1,247" },
              ].map((stat) => (
                <div key={stat.label} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className="font-semibold">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
