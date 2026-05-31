"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity, Zap, CheckCircle2, XCircle, AlertTriangle, Clock,
  RefreshCw, TrendingUp, Globe, Server, Database, Bot, CreditCard,
  Truck, Shield, ArrowUpRight
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const SERVICES = [
  { id: "supabase_db", name: "Supabase Database", category: "Infrastructure", status: "healthy", latency: 24, uptime: 99.98, icon: Database, lastCheck: "5s ago" },
  { id: "supabase_auth", name: "Supabase Auth", category: "Infrastructure", status: "healthy", latency: 31, uptime: 99.99, icon: Shield, lastCheck: "5s ago" },
  { id: "supabase_storage", name: "Supabase Storage", category: "Infrastructure", status: "healthy", latency: 89, uptime: 99.95, icon: Server, lastCheck: "5s ago" },
  { id: "paystack", name: "Paystack Payment", category: "Payments", status: "healthy", latency: 142, uptime: 99.91, icon: CreditCard, lastCheck: "12s ago" },
  { id: "stripe", name: "Stripe International", category: "Payments", status: "healthy", latency: 198, uptime: 99.95, icon: CreditCard, lastCheck: "12s ago" },
  { id: "monnify", name: "Monnify Gateway", category: "Payments", status: "degraded", latency: 892, uptime: 98.74, icon: CreditCard, lastCheck: "12s ago", incident: "Elevated latency since 10:30 AM" },
  { id: "groq", name: "Groq AI (Llama-3)", category: "AI Services", status: "healthy", latency: 312, uptime: 99.80, icon: Bot, lastCheck: "30s ago" },
  { id: "openai", name: "OpenAI Vision API", category: "AI Services", status: "healthy", latency: 2840, uptime: 99.72, icon: Bot, lastCheck: "30s ago" },
  { id: "dhl_api", name: "DHL Tracking API", category: "Logistics", status: "healthy", latency: 420, uptime: 99.60, icon: Truck, lastCheck: "60s ago" },
  { id: "maersk_api", name: "Maersk Shipping API", category: "Logistics", status: "healthy", latency: 680, uptime: 99.40, icon: Truck, lastCheck: "60s ago" },
];

const LATENCY_DATA = Array.from({ length: 20 }, (_, i) => ({
  t: `${i}m`,
  supabase: 20 + Math.random() * 15,
  paystack: 130 + Math.random() * 50,
  groq: 280 + Math.random() * 120,
  monnify: 800 + Math.random() * 200,
}));

const INCIDENTS = [
  { severity: "warning", service: "Monnify", message: "Elevated response times (800-950ms) affecting Nigerian bank transfers", started: "10:30 AM", status: "ongoing" },
  { severity: "resolved", service: "OpenAI", message: "Brief API timeout spike — resolved automatically after 3 minutes", started: "Yesterday 3:15 PM", status: "resolved", resolved: "Yesterday 3:18 PM" },
];

const CATEGORY_GROUPS = ["Infrastructure", "Payments", "AI Services", "Logistics"];

export default function SystemHealthPage() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 1500));
    setRefreshing(false);
    toast.success("All service health checks refreshed");
  };

  const healthyCnt = SERVICES.filter((s) => s.status === "healthy").length;
  const degradedCnt = SERVICES.filter((s) => s.status === "degraded").length;
  const downCnt = SERVICES.filter((s) => s.status === "down").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="h-6 w-6 text-ekda-green-600" />
            System Health Monitor
          </h1>
          <p className="text-muted-foreground text-sm">Real-time service status and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">Last updated: just now</div>
          <Button variant="outline" size="sm" onClick={handleRefresh} loading={refreshing}>
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <div className={cn(
        "flex items-center gap-4 p-4 rounded-2xl border-2",
        downCnt > 0 ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800" :
        degradedCnt > 0 ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800" :
        "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
      )}>
        {downCnt > 0 ? <XCircle className="h-5 w-5 text-red-600" /> :
         degradedCnt > 0 ? <AlertTriangle className="h-5 w-5 text-yellow-600" /> :
         <CheckCircle2 className="h-5 w-5 text-green-600" />}
        <div>
          <div className={cn("font-semibold",
            downCnt > 0 ? "text-red-700 dark:text-red-300" :
            degradedCnt > 0 ? "text-yellow-700 dark:text-yellow-300" :
            "text-green-700 dark:text-green-300"
          )}>
            {downCnt > 0 ? `${downCnt} service(s) DOWN` : degradedCnt > 0 ? `${degradedCnt} service(s) degraded — investigating` : "All systems operational"}
          </div>
          <div className="text-xs text-muted-foreground">{healthyCnt}/{SERVICES.length} services healthy</div>
        </div>
        <div className="ml-auto flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-green-500" />{healthyCnt} healthy</div>
          <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-yellow-500" />{degradedCnt} degraded</div>
          <div className="flex items-center gap-1"><div className="h-2 w-2 rounded-full bg-red-500" />{downCnt} down</div>
        </div>
      </div>

      {/* Latency Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Response Time Trends (Last 20 minutes)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={LATENCY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="t" tick={{ fontSize: 10 }} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} tickFormatter={(v) => `${v}ms`} />
              <Tooltip formatter={(v: number) => [`${v.toFixed(0)}ms`, ""]} contentStyle={{ borderRadius: "12px", fontSize: "11px", border: "1px solid hsl(var(--border))" }} />
              <Line type="monotone" dataKey="supabase" stroke="#16a34a" strokeWidth={1.5} dot={false} name="Supabase" />
              <Line type="monotone" dataKey="paystack" stroke="#3b82f6" strokeWidth={1.5} dot={false} name="Paystack" />
              <Line type="monotone" dataKey="groq" stroke="#8b5cf6" strokeWidth={1.5} dot={false} name="Groq AI" />
              <Line type="monotone" dataKey="monnify" stroke="#f59e0b" strokeWidth={2} dot={false} name="Monnify" strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 text-[10px] text-muted-foreground">
            {[{ name: "Supabase", color: "#16a34a" }, { name: "Paystack", color: "#3b82f6" }, { name: "Groq AI", color: "#8b5cf6" }, { name: "Monnify", color: "#f59e0b" }].map((l) => (
              <div key={l.name} className="flex items-center gap-1"><div className="h-2 w-3 rounded-sm" style={{ backgroundColor: l.color }} />{l.name}</div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Services by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORY_GROUPS.map((category) => {
          const categoryServices = SERVICES.filter((s) => s.category === category);
          return (
            <Card key={category}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-4 pt-0">
                {categoryServices.map((service) => (
                  <div key={service.id} className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                    service.status === "healthy" ? "border-border hover:bg-muted/30" :
                    service.status === "degraded" ? "border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10" :
                    "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10"
                  )}>
                    <service.icon className={cn("h-4 w-4 flex-shrink-0",
                      service.status === "healthy" ? "text-muted-foreground" :
                      service.status === "degraded" ? "text-yellow-600" : "text-red-600"
                    )} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{service.name}</div>
                      {service.incident && (
                        <div className="text-[10px] text-yellow-600 mt-0.5">{service.incident}</div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={cn("text-xs font-bold",
                        service.latency < 200 ? "text-green-600" : service.latency < 500 ? "text-yellow-600" : "text-red-600"
                      )}>{service.latency}ms</div>
                      <div className="text-[10px] text-muted-foreground">{service.uptime}% uptime</div>
                    </div>
                    <div className={cn("h-2.5 w-2.5 rounded-full flex-shrink-0",
                      service.status === "healthy" ? "bg-green-500" :
                      service.status === "degraded" ? "bg-yellow-500 animate-pulse" : "bg-red-500 animate-pulse"
                    )} />
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Active Incidents */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            Incidents & Status History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0">
          {INCIDENTS.map((incident, i) => (
            <div key={i} className={cn(
              "flex items-start gap-3 p-3 rounded-xl border",
              incident.severity === "warning" && incident.status === "ongoing" ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800" :
              "bg-muted/30 border-border opacity-70"
            )}>
              <div className={cn("h-2.5 w-2.5 rounded-full mt-1 flex-shrink-0",
                incident.status === "ongoing" ? "bg-yellow-500 animate-pulse" : "bg-green-500"
              )} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{incident.service}</span>
                  <Badge variant={incident.status === "ongoing" ? "warning" : "success"} className="text-[10px]">
                    {incident.status}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{incident.message}</p>
                <div className="text-[10px] text-muted-foreground mt-1">
                  Started: {incident.started}
                  {incident.resolved && ` · Resolved: ${incident.resolved}`}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
