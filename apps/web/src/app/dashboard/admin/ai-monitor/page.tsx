"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bot, Sparkles, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  XCircle, RefreshCw, DollarSign, BarChart3, Clock, Zap, Download,
  ThumbsUp, ThumbsDown, Eye, Settings, Activity
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const AI_SERVICES = [
  {
    id: "hs_code",
    name: "HS Code Classifier",
    model: "ekda-hs-v1 (Groq Llama-3)",
    icon: "📋",
    calls_today: 1247,
    calls_week: 8432,
    avg_confidence: 96.2,
    accuracy_rate: 97.8,
    avg_latency_ms: 340,
    cost_today_usd: 4.21,
    cost_month_usd: 87.40,
    error_rate: 0.3,
    overrides_today: 5,
    status: "healthy",
  },
  {
    id: "chatbot",
    name: "AI Shopping Assistant",
    model: "Groq Llama-3.3-70b",
    icon: "🤖",
    calls_today: 3841,
    calls_week: 28420,
    avg_confidence: null,
    accuracy_rate: null,
    avg_latency_ms: 890,
    cost_today_usd: 12.84,
    cost_month_usd: 284.20,
    error_rate: 0.8,
    overrides_today: 0,
    status: "healthy",
  },
  {
    id: "risk_score",
    name: "Risk Scoring Engine",
    model: "EKDA Rule Engine v2",
    icon: "🛡️",
    calls_today: 412,
    calls_week: 2847,
    avg_confidence: 88.4,
    accuracy_rate: 94.2,
    avg_latency_ms: 125,
    cost_today_usd: 0.82,
    cost_month_usd: 18.40,
    error_rate: 0.1,
    overrides_today: 12,
    status: "healthy",
  },
  {
    id: "document_verify",
    name: "Document Verification",
    model: "OpenAI Vision + OCR",
    icon: "📄",
    calls_today: 89,
    calls_week: 623,
    avg_confidence: 94.1,
    accuracy_rate: 96.5,
    avg_latency_ms: 2840,
    cost_today_usd: 8.90,
    cost_month_usd: 198.40,
    error_rate: 1.2,
    overrides_today: 3,
    status: "degraded",
  },
];

const USAGE_DATA = [
  { day: "Mon", hs_code: 1100, chatbot: 3200, risk: 380, doc: 72 },
  { day: "Tue", hs_code: 980, chatbot: 2900, risk: 340, doc: 65 },
  { day: "Wed", hs_code: 1380, chatbot: 4100, risk: 450, doc: 98 },
  { day: "Thu", hs_code: 1220, chatbot: 3600, risk: 410, doc: 84 },
  { day: "Fri", hs_code: 1540, chatbot: 4800, risk: 520, doc: 112 },
  { day: "Sat", hs_code: 1690, chatbot: 5200, risk: 570, doc: 124 },
  { day: "Sun", hs_code: 1247, chatbot: 3841, risk: 412, doc: 89 },
];

const RECENT_OVERRIDES = [
  { service: "HS Code", original: "0306.17 (Dried shrimps)", override: "0305.72 (Dried fish)", reason: "Vendor flagged: product is dried fish, not shrimp", admin: "Sarah A.", time: "1h ago" },
  { service: "Risk Score", original: "85/100 (Low Risk)", override: "Manual Review Required", reason: "Unusual payment pattern — same IP, 5 orders in 10 min", admin: "David M.", time: "3h ago" },
  { service: "Document", original: "92% authentic", override: "Flagged for Review", reason: "Certificate watermark appears digitally edited", admin: "Sarah A.", time: "5h ago" },
];

const COST_COLORS = ["#16a34a", "#3b82f6", "#8b5cf6", "#f59e0b"];

export default function AIMonitorPage() {
  const [selectedService, setSelectedService] = useState("hs_code");

  const totalCostToday = AI_SERVICES.reduce((s, sv) => s + sv.cost_today_usd, 0);
  const totalCallsToday = AI_SERVICES.reduce((s, sv) => s + sv.calls_today, 0);
  const totalOverrides = AI_SERVICES.reduce((s, sv) => s + sv.overrides_today, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6 text-indigo-600" />
            AI Supervision & Governance
          </h1>
          <p className="text-muted-foreground text-sm">Monitor, override, and improve all AI services</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-3.5 w-3.5" />Export</Button>
          <Button variant="premium" size="sm"><Settings className="h-3.5 w-3.5" />Configure</Button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total AI Calls (Today)", value: totalCallsToday.toLocaleString(), icon: Activity, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "AI Cost (Today)", value: `$${totalCostToday.toFixed(2)}`, icon: DollarSign, color: "text-ekda-gold-600", bg: "bg-ekda-gold-50 dark:bg-ekda-gold-900/20" },
          { label: "Manual Overrides", value: totalOverrides, icon: RefreshCw, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
          { label: "Avg Accuracy", value: "96.1%", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card>
              <CardContent className="p-4">
                <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center mb-2", kpi.bg)}>
                  <kpi.icon className={cn("h-4 w-4", kpi.color)} />
                </div>
                <div className="text-xl font-bold">{kpi.value}</div>
                <div className="text-[10px] text-muted-foreground">{kpi.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {AI_SERVICES.map((service, i) => (
          <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card
              className={cn("cursor-pointer transition-all hover:shadow-lg", selectedService === service.id && "ring-2 ring-primary/30 border-primary/50")}
              onClick={() => setSelectedService(service.id)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{service.icon}</span>
                    <div>
                      <div className="font-semibold text-xs">{service.name}</div>
                      <div className="text-[9px] text-muted-foreground">{service.model}</div>
                    </div>
                  </div>
                  <div className={cn("h-2 w-2 rounded-full", service.status === "healthy" ? "bg-green-500" : "bg-yellow-500")} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Calls Today</div>
                    <div className="font-bold">{service.calls_today.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Cost</div>
                    <div className="font-bold">${service.cost_today_usd}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Avg Latency</div>
                    <div className={cn("font-bold", service.avg_latency_ms > 1000 ? "text-red-600" : service.avg_latency_ms > 500 ? "text-yellow-600" : "text-green-600")}>
                      {service.avg_latency_ms}ms
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Error Rate</div>
                    <div className={cn("font-bold", service.error_rate > 1 ? "text-red-600" : "text-green-600")}>{service.error_rate}%</div>
                  </div>
                </div>

                {service.accuracy_rate && (
                  <div className="mt-3">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-muted-foreground">Accuracy</span>
                      <span className="font-semibold">{service.accuracy_rate}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${service.accuracy_rate}%` }} />
                    </div>
                  </div>
                )}

                {service.overrides_today > 0 && (
                  <Badge variant="warning" className="text-[9px] mt-2">{service.overrides_today} overrides today</Badge>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Usage Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>AI Usage — Last 7 Days</CardTitle>
            <div className="flex items-center gap-3 text-[10px]">
              {[{ name: "HS Code", color: "#16a34a" }, { name: "Chatbot", color: "#3b82f6" }, { name: "Risk", color: "#8b5cf6" }, { name: "Docs", color: "#f59e0b" }].map((s) => (
                <div key={s.name} className="flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-muted-foreground">{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={USAGE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: "12px", fontSize: "11px", border: "1px solid hsl(var(--border))" }} />
              <Bar dataKey="chatbot" fill="#3b82f6" radius={[2, 2, 0, 0]} name="Chatbot" stackId="a" />
              <Bar dataKey="hs_code" fill="#16a34a" radius={[2, 2, 0, 0]} name="HS Code" stackId="a" />
              <Bar dataKey="risk" fill="#8b5cf6" radius={[2, 2, 0, 0]} name="Risk Score" stackId="a" />
              <Bar dataKey="doc" fill="#f59e0b" radius={[2, 2, 0, 0]} name="Documents" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Overrides */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-orange-600" />
            <CardTitle>Recent Manual Overrides</CardTitle>
            <Badge variant="warning" className="text-[10px] ml-1">{RECENT_OVERRIDES.length} today</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Service", "AI Output", "Override To", "Reason", "Admin", "Time", "Feedback"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_OVERRIDES.map((override, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3"><Badge variant="outline" className="text-[10px]">{override.service}</Badge></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[140px] truncate">{override.original}</td>
                  <td className="px-4 py-3 text-xs font-medium max-w-[140px] truncate">{override.override}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground max-w-[180px] truncate">{override.reason}</td>
                  <td className="px-4 py-3 text-xs">{override.admin}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{override.time}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => toast.success("Marked as correct — improves model")} className="p-1 rounded hover:bg-green-100 text-green-600">
                        <ThumbsUp className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => toast.success("Marked as incorrect")} className="p-1 rounded hover:bg-red-100 text-red-500">
                        <ThumbsDown className="h-3.5 w-3.5" />
                      </button>
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
