"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Plus,
  Eye,
  FileText,
} from "lucide-react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@ekda/shared";

const REVENUE_DATA = [
  { month: "Jan", revenue: 420000, orders: 12 },
  { month: "Feb", revenue: 680000, orders: 18 },
  { month: "Mar", revenue: 540000, orders: 15 },
  { month: "Apr", revenue: 890000, orders: 24 },
  { month: "May", revenue: 1200000, orders: 32 },
  { month: "Jun", revenue: 980000, orders: 28 },
];

const RECENT_ORDERS = [
  {
    id: "EKDA-MK3X2F",
    product: "Premium Dried Crayfish × 20kg",
    customer: "Ngozi A. (London, UK)",
    amount: 170000,
    status: "in_transit",
    escrow: "partial_released",
    date: "2 hours ago",
  },
  {
    id: "EKDA-PL9Q4R",
    product: "Palm Oil 50L (×5 orders)",
    customer: "Emeka O. (Toronto, CA)",
    amount: 340000,
    status: "picked_up",
    escrow: "partial_released",
    date: "5 hours ago",
  },
  {
    id: "EKDA-TY7N1A",
    product: "Achi Seed Powder 10kg",
    customer: "Adaeze M. (Houston, USA)",
    amount: 38000,
    status: "processing",
    escrow: "held",
    date: "1 day ago",
  },
  {
    id: "EKDA-BF2K8S",
    product: "Garri Ijebu 100kg",
    customer: "Tunde F. (Lagos, NG)",
    amount: 320000,
    status: "delivered",
    escrow: "fully_released",
    date: "3 days ago",
  },
];

const STATUS_CONFIG = {
  pending: { label: "Pending", color: "warning", icon: Clock },
  processing: { label: "Processing", color: "blue", icon: Clock },
  picked_up: { label: "Picked Up", color: "blue", icon: Truck },
  in_transit: { label: "In Transit", color: "blue", icon: Truck },
  delivered: { label: "Delivered", color: "success", icon: CheckCircle2 },
  disputed: { label: "Disputed", color: "error", icon: AlertCircle },
};

export default function VendorDashboard() {
  return (
    <div className="space-y-6 max-w-7xl">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {[
          {
            title: "Total Revenue",
            value: formatCurrency(4710000, "NGN"),
            change: "+18.2%",
            trend: "up",
            icon: TrendingUp,
            color: "text-ekda-green-600",
            bg: "bg-ekda-green-50 dark:bg-ekda-green-900/20",
            sub: "This month: ₦1.2M",
          },
          {
            title: "Total Orders",
            value: "129",
            change: "+12.5%",
            trend: "up",
            icon: ShoppingCart,
            color: "text-blue-600",
            bg: "bg-blue-50 dark:bg-blue-900/20",
            sub: "5 pending action",
          },
          {
            title: "Active Products",
            value: "34",
            change: "+2",
            trend: "up",
            icon: Package,
            color: "text-purple-600",
            bg: "bg-purple-50 dark:bg-purple-900/20",
            sub: "3 need HS Code",
          },
          {
            title: "Wallet Balance",
            value: formatCurrency(892000, "NGN"),
            change: "₦340K escrow",
            trend: "neutral",
            icon: Wallet,
            color: "text-ekda-gold-600",
            bg: "bg-ekda-gold-50 dark:bg-ekda-gold-900/20",
            sub: "Pending: ₦340K",
          },
        ].map((stat) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <span
                    className={`text-xs font-medium flex items-center gap-0.5 ${
                      stat.trend === "up" ? "text-green-600" : "text-muted-foreground"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    ) : null}
                    {stat.change}
                  </span>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.sub}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Revenue Overview</CardTitle>
              <select className="text-sm border border-border rounded-lg px-2 py-1 bg-background">
                <option>Last 6 months</option>
                <option>Last year</option>
              </select>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  formatter={(v: number) => [`₦${(v / 1000).toFixed(1)}K`, "Revenue"]}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid hsl(var(--border))",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#16a34a"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/vendor/products/new">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4" />
                Add New Product
              </Button>
            </Link>
            <Link href="/dashboard/vendor/hs-codes">
              <Button className="w-full justify-start" variant="outline">
                <FileText className="h-4 w-4" />
                AI HS Code Tool
              </Button>
            </Link>
            <Link href="/dashboard/vendor/documents">
              <Button className="w-full justify-start" variant="outline">
                <Eye className="h-4 w-4" />
                Upload Documents
              </Button>
            </Link>

            {/* Escrow Alert */}
            <div className="p-4 bg-ekda-gold-50 dark:bg-ekda-gold-900/20 rounded-xl border border-ekda-gold-200 dark:border-ekda-gold-800">
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-ekda-gold-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm font-medium text-ekda-gold-800 dark:text-ekda-gold-300">
                  Escrow Pending Release
                </span>
              </div>
              <p className="text-xs text-ekda-gold-600 dark:text-ekda-gold-400 mb-3">
                ₦340,000 held in escrow for 2 orders awaiting carrier pickup confirmation.
              </p>
              <Link href="/dashboard/vendor/orders">
                <Button size="sm" className="w-full h-7 text-xs bg-ekda-gold-600 hover:bg-ekda-gold-700 text-white">
                  View Orders
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Link href="/dashboard/vendor/orders">
              <Button variant="ghost" size="sm">
                View all <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                    Order
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                    Product
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                    Customer
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                    Amount
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                    Escrow
                  </th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ORDERS.map((order) => {
                  const statusConf = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];
                  return (
                    <tr
                      key={order.id}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-primary font-medium">
                          {order.id}
                        </div>
                        <div className="text-xs text-muted-foreground">{order.date}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium max-w-[200px] truncate">
                          {order.product}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-muted-foreground">{order.customer}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold">
                          {formatCurrency(order.amount, "NGN")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusConf?.color as any} className="text-xs">
                          {statusConf?.label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            order.escrow === "fully_released"
                              ? "success"
                              : order.escrow === "partial_released"
                              ? "warning"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {order.escrow === "fully_released"
                            ? "✅ Released"
                            : order.escrow === "partial_released"
                            ? "⏳ 50% Released"
                            : "🔒 Held"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
