"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download, FileText, FileSpreadsheet, BarChart3, Calendar, Filter,
  Package, Users, Wallet, Shield, Truck, CheckCircle2, Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const REPORTS = [
  {
    id: "gmv_monthly", name: "Monthly GMV Report", description: "Total gross merchandise value with marketplace breakdown", icon: BarChart3, formats: ["PDF", "Excel"], category: "Revenue",
  },
  {
    id: "commission_report", name: "Commission & Fee Report", description: "All commissions, deductions, and adjustments by vendor", icon: Wallet, formats: ["PDF", "Excel", "CSV"], category: "Revenue",
  },
  {
    id: "escrow_summary", name: "Escrow Summary Report", description: "All active escrow balances and release history", icon: Shield, formats: ["PDF", "Excel"], category: "Financial",
  },
  {
    id: "payout_summary", name: "Payout Reconciliation", description: "All vendor and carrier payouts with gateway references", icon: Package, formats: ["PDF", "Excel", "CSV"], category: "Financial",
  },
  {
    id: "kyc_compliance", name: "KYC Compliance Report", description: "KYC submissions, approvals, rejections — NDPR/GDPR ready", icon: Shield, formats: ["PDF", "Excel"], category: "Compliance",
  },
  {
    id: "audit_log_export", name: "Audit Log Export", description: "Complete audit trail for all admin actions", icon: FileText, formats: ["CSV", "JSON"], category: "Compliance",
  },
  {
    id: "dispute_report", name: "Dispute Resolution Report", description: "All disputes, resolutions, and resolution times", icon: FileText, formats: ["PDF", "Excel"], category: "Operations",
  },
  {
    id: "carrier_performance", name: "Carrier Performance", description: "On-time delivery, SLA adherence, ratings by carrier", icon: Truck, formats: ["PDF", "Excel"], category: "Operations",
  },
  {
    id: "user_acquisition", name: "User Acquisition Report", description: "Signups by role, channel, country with cohort data", icon: Users, formats: ["PDF", "Excel"], category: "Growth",
  },
  {
    id: "ai_usage_report", name: "AI Usage & Cost Report", description: "AI service utilization, costs, accuracy, and overrides", icon: BarChart3, formats: ["PDF", "Excel"], category: "Technology",
  },
];

const CATEGORIES = ["All", "Revenue", "Financial", "Compliance", "Operations", "Growth", "Technology"];

export default function ExportPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [dateRange, setDateRange] = useState("this_month");
  const [generating, setGenerating] = useState<string | null>(null);

  const filtered = REPORTS.filter((r) => activeCategory === "All" || r.category === activeCategory);

  const handleGenerate = async (reportId: string, format: string) => {
    setGenerating(`${reportId}_${format}`);
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(null);
    toast.success(`✅ ${format} report generated — downloading...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Download className="h-6 w-6 text-primary" />
            Reports & Export Center
          </h1>
          <p className="text-muted-foreground text-sm">Generate branded PDF and Excel reports for all operational data</p>
        </div>
        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
          className="h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="today">Today</option>
          <option value="this_week">This Week</option>
          <option value="this_month">This Month</option>
          <option value="last_quarter">Last Quarter</option>
          <option value="this_year">This Year</option>
          <option value="custom">Custom Range</option>
        </select>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-all",
              activeCategory === cat ? "bg-primary text-white" : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
            )}>
            {cat}
          </button>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((report, i) => (
          <motion.div key={report.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="h-full">
              <CardContent className="p-5 flex flex-col h-full">
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <report.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm">{report.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{report.description}</p>
                    <Badge variant="outline" className="text-[9px] mt-1.5">{report.category}</Badge>
                  </div>
                </div>
                <div className="flex gap-2 mt-auto">
                  {report.formats.map((format) => {
                    const isGenerating = generating === `${report.id}_${format}`;
                    return (
                      <Button key={format} variant="outline" size="sm" className="text-xs flex-1 h-8"
                        onClick={() => handleGenerate(report.id, format)}
                        disabled={isGenerating}
                      >
                        {isGenerating ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : format === "PDF" ? (
                          <FileText className="h-3 w-3 mr-1 text-red-500" />
                        ) : (
                          <FileSpreadsheet className="h-3 w-3 mr-1 text-green-600" />
                        )}
                        {isGenerating ? "..." : format}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Keyboard Shortcuts */}
      <Card className="bg-muted/30">
        <CardContent className="p-4">
          <div className="text-xs font-semibold text-muted-foreground mb-2">⌨️ Admin Keyboard Shortcuts</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {[
              { keys: "⌘K", action: "Search anything" },
              { keys: "⌘D", action: "Go to Dashboard" },
              { keys: "⌘U", action: "Go to Users" },
              { keys: "⌘O", action: "Go to Orders" },
              { keys: "⌘F", action: "Financial Controls" },
              { keys: "⌘I", action: "AI Monitor" },
              { keys: "⌘E", action: "Export Center" },
              { keys: "⌘?", action: "Show all shortcuts" },
            ].map((shortcut) => (
              <div key={shortcut.keys} className="flex items-center gap-2">
                <kbd className="px-2 py-0.5 bg-background border border-border rounded text-[10px] font-mono">{shortcut.keys}</kbd>
                <span className="text-muted-foreground">{shortcut.action}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
