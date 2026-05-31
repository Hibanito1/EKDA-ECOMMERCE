"use client";

import { motion } from "framer-motion";
import {
  Users,
  ShoppingCart,
  Wallet,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Package,
  Shield,
  BarChart3,
  Globe,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatCompactCurrency } from "@ekda/shared";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

const KYC_QUEUE = [
  { name: "Chen Wei Imports Ltd", country: "🇨🇳 CN", type: "vendor", submitted: "2h ago", risk: "low" },
  { name: "Amara Logistics", country: "🇳🇬 NG", type: "carrier", submitted: "5h ago", risk: "medium" },
  { name: "Euro Auto GmbH", country: "🇩🇪 DE", type: "vendor", submitted: "1d ago", risk: "low" },
  { name: "FastTrack Freight", country: "🇬🇧 GB", type: "carrier", submitted: "1d ago", risk: "high" },
];

const PIE_DATA = [
  { name: "African Exports", value: 58, color: "#16a34a" },
  { name: "Global Imports", value: 42, color: "#3b82f6" },
];

const MONTHLY_ORDERS = [
  { month: "Jan", exports: 240, imports: 120 },
  { month: "Feb", exports: 380, imports: 190 },
  { month: "Mar", exports: 290, imports: 210 },
  { month: "Apr", exports: 510, imports: 280 },
  { month: "May", exports: 620, imports: 340 },
  { month: "Jun", exports: 780, imports: 420 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Admin Overview</h1>
          <p className="text-muted-foreground text-sm">
            Platform health & key metrics — June 2025
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-muted-foreground">All systems operational</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { title: "Total GMV", value: "₦2.4B", sub: "+24% vs last month", icon: TrendingUp, color: "text-ekda-green-600", bg: "bg-ekda-green-50" },
          { title: "EKDA Commission", value: "₦240M", sub: "10% of GMV", icon: Wallet, color: "text-ekda-gold-600", bg: "bg-ekda-gold-50" },
          { title: "Total Orders", value: "14,832", sub: "238 today", icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Active Users", value: "52,410", sub: "1,204 new this week", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
          { title: "Active Vendors", value: "2,841", sub: "89 pending KYC", icon: Package, color: "text-teal-600", bg: "bg-teal-50" },
          { title: "Active Carriers", value: "486", sub: "12 pending KYC", icon: Globe, color: "text-orange-600", bg: "bg-orange-50" },
          { title: "Escrow Held", value: "₦84M", sub: "312 active orders", icon: Shield, color: "text-red-600", bg: "bg-red-50" },
          { title: "Open Disputes", value: "23", sub: "3 high priority", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
        ].map((stat) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-5">
                <div className={`h-9 w-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div className="text-xl font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5 opacity-70">{stat.sub}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Orders Chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Orders by Marketplace</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={MONTHLY_ORDERS}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px", border: "1px solid hsl(var(--border))" }} />
                <Bar dataKey="exports" fill="#16a34a" radius={[4, 4, 0, 0]} name="African Exports" />
                <Bar dataKey="imports" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Global Imports" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Marketplace Split</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={3} dataKey="value">
                  {PIE_DATA.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {PIE_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-semibold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KYC Queue */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pending KYC Review</CardTitle>
            <Badge variant="warning">{KYC_QUEUE.length} pending</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {["Business", "Country", "Type", "Submitted", "Risk", "Action"].map((h) => (
                  <th key={h} className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {KYC_QUEUE.map((item) => (
                <tr key={item.name} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-sm">{item.name}</td>
                  <td className="px-6 py-4 text-sm">{item.country}</td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="text-xs capitalize">{item.type}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{item.submitted}</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={item.risk === "high" ? "error" : item.risk === "medium" ? "warning" : "success"}
                      className="text-xs"
                    >
                      {item.risk}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <Button size="sm" className="h-7 text-xs bg-ekda-green-600 hover:bg-ekda-green-700 text-white">
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        Review
                      </Button>
                    </div>
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
