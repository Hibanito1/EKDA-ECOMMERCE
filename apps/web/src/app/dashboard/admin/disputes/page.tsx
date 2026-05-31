"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle, Search, Filter, MessageSquare, CheckCircle2, XCircle,
  ChevronDown, ChevronUp, Clock, Shield, Send, Paperclip, Eye,
  User, Building2, Truck, Flag, BarChart3, ArrowRight,
  DollarSign, FileText, RefreshCw, Zap, Bot, Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDateTime } from "@ekda/shared";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

type DisputeStatus = "open" | "investigating" | "mediation" | "awaiting_customer" | "awaiting_vendor" | "resolved_customer" | "resolved_vendor" | "escalated" | "closed";
type Priority = "low" | "medium" | "high" | "critical";

interface Dispute {
  id: string;
  number: string;
  order_id: string;
  category: string;
  description: string;
  status: DisputeStatus;
  priority: Priority;
  customer: { name: string; email: string; country: string };
  vendor: { name: string; business: string };
  carrier?: { name: string; company: string };
  order_value: number;
  escrow_held: number;
  created_at: string;
  sla_deadline: string;
  assigned_admin?: string;
  resolution?: string;
  messages_count: number;
  is_escrow_override: boolean;
}

const MOCK_DISPUTES: Dispute[] = [
  {
    id: "1", number: "DIS-XY9K3", order_id: "EKDA-MK3X2F",
    category: "damaged_goods", description: "Customer received 20kg crayfish package with water damage. 40% of product unusable. Seeking partial refund of ₦68,000.",
    status: "open", priority: "critical",
    customer: { name: "Adaeze Okonkwo", email: "adaeze@example.com", country: "🇬🇧 UK" },
    vendor: { name: "Kingsley Eze", business: "Lagos Fresh Exports Ltd" },
    carrier: { name: "Marcus Brown", company: "Maersk Line" },
    order_value: 196500, escrow_held: 98250, created_at: "2025-06-01T14:30:00Z",
    sla_deadline: "2025-06-04T14:30:00Z", assigned_admin: "Sarah Admin",
    messages_count: 8, is_escrow_override: true,
  },
  {
    id: "2", number: "DIS-PL7R2K", order_id: "EKDA-BF2K8S",
    category: "not_delivered", description: "Order marked as delivered but customer never received it at Tilbury Port. Carrier claiming port clearance issues.",
    status: "investigating", priority: "high",
    customer: { name: "Emeka Okafor", email: "emeka@example.com", country: "🇨🇦 Canada" },
    vendor: { name: "Amara Farms", business: "Amara Agricultural" },
    carrier: { name: "FastTrack Freight", company: "FastTrack International" },
    order_value: 450000, escrow_held: 450000, created_at: "2025-05-30T10:00:00Z",
    sla_deadline: "2025-06-02T10:00:00Z", messages_count: 12, is_escrow_override: true,
  },
  {
    id: "3", number: "DIS-RT5V2Z", order_id: "EKDA-TY7N1A",
    category: "wrong_item", description: "Customer ordered Garri Ijebu Coarse but received Garri Ijebu Fine. Vendor insisting they shipped correct item.",
    status: "mediation", priority: "medium",
    customer: { name: "Ngozi Adeleke", email: "ngozi@example.com", country: "🇺🇸 USA" },
    vendor: { name: "Southwest Farms", business: "Ogun Agro Exports" },
    order_value: 85000, escrow_held: 42500, created_at: "2025-05-29T08:00:00Z",
    sla_deadline: "2025-06-01T08:00:00Z", assigned_admin: "Sarah Admin",
    messages_count: 15, is_escrow_override: false,
  },
  {
    id: "4", number: "DIS-MN8L4P", order_id: "EKDA-RT5V2Z",
    category: "escrow_dispute", description: "Vendor claims carrier confirmed delivery but escrow not released. Carrier GPS confirms Apapa Port arrival but EKDA system not updated.",
    status: "awaiting_vendor", priority: "medium",
    customer: { name: "Chen Wei", email: "chen@example.com", country: "🇨🇳 China" },
    vendor: { name: "Euro Auto GmbH", business: "Euro Auto GmbH" },
    order_value: 18500000, escrow_held: 9250000, created_at: "2025-05-28T16:00:00Z",
    sla_deadline: "2025-05-31T16:00:00Z", messages_count: 6, is_escrow_override: true,
  },
];

const STATUS_CONFIG: Record<DisputeStatus, { label: string; color: string; bg: string }> = {
  open: { label: "Open", color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" },
  investigating: { label: "Investigating", color: "text-yellow-600", bg: "bg-yellow-100 dark:bg-yellow-900/30" },
  mediation: { label: "In Mediation", color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/30" },
  awaiting_customer: { label: "Awaiting Customer", color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/30" },
  awaiting_vendor: { label: "Awaiting Vendor", color: "text-orange-600", bg: "bg-orange-100 dark:bg-orange-900/30" },
  resolved_customer: { label: "Resolved → Customer", color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/30" },
  resolved_vendor: { label: "Resolved → Vendor", color: "text-teal-600", bg: "bg-teal-100 dark:bg-teal-900/30" },
  escalated: { label: "Escalated", color: "text-red-700", bg: "bg-red-200 dark:bg-red-900/50" },
  closed: { label: "Closed", color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-900/30" },
};

const PRIORITY_CONFIG: Record<Priority, { color: string; dot: string }> = {
  low: { color: "text-gray-500", dot: "bg-gray-400" },
  medium: { color: "text-yellow-600", dot: "bg-yellow-500" },
  high: { color: "text-orange-600", dot: "bg-orange-500" },
  critical: { color: "text-red-600", dot: "bg-red-500" },
};

const MOCK_MESSAGES = [
  { sender: "Adaeze Okonkwo", role: "customer", time: "Jun 1, 2:30 PM", message: "I received my package today and 40% of the crayfish is wet and smells bad. The package clearly had water damage. I have photos.", isInternal: false },
  { sender: "Kingsley Eze", role: "vendor", time: "Jun 1, 3:45 PM", message: "The goods were inspected before dispatch. All quality checks passed. I believe the damage occurred during transit with Maersk.", isInternal: false },
  { sender: "Sarah Admin", role: "admin", time: "Jun 1, 4:00 PM", message: "Requesting carrier damage report from Maersk. Also asking customer to provide photos with timestamp.", isInternal: true },
  { sender: "Marcus Brown", role: "carrier", time: "Jun 1, 5:30 PM", message: "Container was sea-worthy throughout transit. However, we did encounter heavy rain during Liverpool-to-Tilbury road transfer. Photos attached.", isInternal: false },
];

interface DisputeDetailProps {
  dispute: Dispute;
  onClose: () => void;
  onResolve: (id: string, winner: "customer" | "vendor") => void;
}

function DisputeDetail({ dispute, onClose, onResolve }: DisputeDetailProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [showEscrowPanel, setShowEscrowPanel] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [refundAmount, setRefundAmount] = useState(String(Math.round(dispute.escrow_held * 0.5)));

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    setSendingMessage(true);
    await new Promise((r) => setTimeout(r, 500));
    setSendingMessage(false);
    setNewMessage("");
    toast.success("Message sent to all parties");
  };

  const hoursSince = Math.round((Date.now() - new Date(dispute.created_at).getTime()) / 3600000);
  const slaPassed = new Date(dispute.sla_deadline) < new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-background rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="font-bold text-lg">{dispute.number}</span>
              <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold", STATUS_CONFIG[dispute.status].bg, STATUS_CONFIG[dispute.status].color)}>
                <div className={cn("h-1.5 w-1.5 rounded-full", PRIORITY_CONFIG[dispute.priority].dot)} />
                {STATUS_CONFIG[dispute.status].label}
              </div>
              {slaPassed && <Badge variant="error" className="text-[10px]">⚠️ SLA Breached</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">{dispute.category.replace("_", " ").toUpperCase()} · Order {dispute.order_id}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground p-2 rounded-xl hover:bg-muted transition-colors">×</button>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Left Panel: Parties & Info */}
          <div className="w-72 flex-shrink-0 border-r border-border overflow-y-auto p-4 space-y-4">
            {/* Parties */}
            <div className="space-y-2">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Parties</div>
              {[
                { role: "Customer", icon: User, name: dispute.customer.name, detail: dispute.customer.country, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
                { role: "Vendor", icon: Building2, name: dispute.vendor.name, detail: dispute.vendor.business, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
                ...(dispute.carrier ? [{ role: "Carrier", icon: Truck, name: dispute.carrier.name, detail: dispute.carrier.company, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/20" }] : []),
              ].map((party) => (
                <div key={party.role} className={cn("flex items-start gap-2.5 p-2.5 rounded-xl", party.bg)}>
                  <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0", party.bg)}>
                    <party.icon className={cn("h-3.5 w-3.5", party.color)} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold">{party.name}</div>
                    <div className="text-[10px] text-muted-foreground">{party.role} · {party.detail}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial */}
            <div className="space-y-2">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Financial</div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between"><span className="text-muted-foreground">Order Value</span><span className="font-semibold">{formatCurrency(dispute.order_value, "NGN")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Escrow Held</span><span className="font-semibold text-yellow-600">{formatCurrency(dispute.escrow_held, "NGN")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Hours Open</span><span className={cn("font-semibold", hoursSince > 48 ? "text-red-600" : "")}>{hoursSince}h</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Messages</span><span className="font-semibold">{dispute.messages_count}</span></div>
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Description</div>
              <p className="text-xs text-muted-foreground leading-relaxed">{dispute.description}</p>
            </div>

            {/* Escrow Override */}
            {dispute.is_escrow_override && (
              <div className="border border-orange-200 dark:border-orange-800 rounded-xl overflow-hidden">
                <button onClick={() => setShowEscrowPanel(!showEscrowPanel)}
                  className="w-full flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-900/20 text-xs font-semibold text-orange-700 dark:text-orange-400">
                  <Shield className="h-3.5 w-3.5" />
                  Escrow Override Required
                  {showEscrowPanel ? <ChevronUp className="h-3.5 w-3.5 ml-auto" /> : <ChevronDown className="h-3.5 w-3.5 ml-auto" />}
                </button>
                {showEscrowPanel && (
                  <div className="p-3 space-y-2">
                    <div className="text-[10px] text-muted-foreground">Refund Amount (NGN)</div>
                    <input type="number" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)}
                      className="w-full h-8 px-2 rounded-lg border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring" />
                    <div className="text-[10px] text-orange-600">⚠️ Requires dual admin approval</div>
                    <Button size="sm" className="w-full h-7 text-[10px] bg-orange-600 hover:bg-orange-700 text-white">
                      Request Override
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Resolution Actions */}
            <div className="space-y-2 border-t border-border pt-3">
              <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Resolve Dispute</div>
              <Button size="sm" className="w-full h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white" onClick={() => { onResolve(dispute.id, "customer"); onClose(); }}>
                ✅ Resolve: Favor Customer
              </Button>
              <Button size="sm" className="w-full h-8 text-xs bg-ekda-green-600 hover:bg-ekda-green-700 text-white" onClick={() => { onResolve(dispute.id, "vendor"); onClose(); }}>
                ✅ Resolve: Favor Vendor
              </Button>
              <Button size="sm" variant="outline" className="w-full h-8 text-xs border-red-300 text-red-600 hover:bg-red-50">
                <Flag className="h-3 w-3" /> Escalate
              </Button>
            </div>
          </div>

          {/* Right Panel: Mediation Chat */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="p-3 border-b border-border flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="font-semibold text-sm">Mediation Thread</span>
              <Badge variant="outline" className="text-[10px]">{dispute.messages_count} messages</Badge>
              <div className="ml-auto flex gap-2">
                <Button size="sm" variant="outline" className="h-7 text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {MOCK_MESSAGES.map((msg, i) => (
                <div key={i} className={cn("flex gap-3", msg.isInternal && "opacity-80")}>
                  <div className={cn("h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0",
                    msg.role === "customer" ? "bg-blue-100 text-blue-700" :
                    msg.role === "vendor" ? "bg-orange-100 text-orange-700" :
                    msg.role === "admin" ? "bg-ekda-green-100 text-ekda-green-700" :
                    "bg-purple-100 text-purple-700"
                  )}>
                    {msg.sender.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold">{msg.sender}</span>
                      <span className={cn("text-[9px] px-1.5 py-0.5 rounded-full font-medium",
                        msg.role === "admin" ? "bg-ekda-green-100 text-ekda-green-700" : "bg-muted text-muted-foreground"
                      )}>{msg.role}</span>
                      {msg.isInternal && <span className="text-[9px] text-orange-600 font-medium">[Internal]</span>}
                      <span className="text-[10px] text-muted-foreground ml-auto">{msg.time}</span>
                    </div>
                    <div className={cn("text-xs p-3 rounded-2xl", msg.isInternal ? "bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800" : "bg-muted/50")}>
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-border space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <label className="flex items-center gap-1.5 text-xs cursor-pointer">
                  <input type="checkbox" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} className="rounded" />
                  <span className="text-muted-foreground">Internal note (admin-only)</span>
                </label>
              </div>
              <div className="flex gap-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message to all parties..."
                  className="flex-1 h-20 px-3 py-2 rounded-xl border border-input bg-background text-xs resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="flex flex-col gap-2">
                  <Button size="sm" className="h-8 w-8 p-0" variant="outline"><Paperclip className="h-3.5 w-3.5" /></Button>
                  <Button size="sm" className="h-8 w-8 p-0 flex-1" onClick={sendMessage} loading={sendingMessage}><Send className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function DisputesPage() {
  const [disputes, setDisputes] = useState(MOCK_DISPUTES);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = disputes.filter((d) => {
    const matchStatus = statusFilter === "all" || d.status === statusFilter;
    const matchPriority = priorityFilter === "all" || d.priority === priorityFilter;
    const matchSearch = !search || d.number.includes(search.toUpperCase()) || d.customer.name.toLowerCase().includes(search.toLowerCase()) || d.vendor.business.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchPriority && matchSearch;
  });

  const handleResolve = (id: string, winner: "customer" | "vendor") => {
    setDisputes((prev) => prev.map((d) => d.id === id ? { ...d, status: winner === "customer" ? "resolved_customer" : "resolved_vendor" } : d));
    toast.success(`✅ Dispute resolved in favor of ${winner}`);
  };

  const handleBulkAction = (action: string) => {
    toast.success(`${action} applied to ${selectedIds.length} disputes`);
    setSelectedIds([]);
  };

  const stats = {
    open: disputes.filter((d) => d.status === "open").length,
    critical: disputes.filter((d) => d.priority === "critical").length,
    escrow: disputes.reduce((s, d) => s + d.escrow_held, 0),
    resolved: disputes.filter((d) => d.status.startsWith("resolved")).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertCircle className="h-6 w-6 text-red-600" />
            Dispute Resolution Center
          </h1>
          <p className="text-muted-foreground text-sm">Mediation tools, escrow overrides, and audit trails</p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-3.5 w-3.5" />
          Export Report
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Open Disputes", value: stats.open, color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20" },
          { label: "Critical Priority", value: stats.critical, color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
          { label: "Escrow at Risk", value: formatCurrency(stats.escrow, "NGN"), color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
          { label: "Resolved (30d)", value: stats.resolved + " / " + disputes.length, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className={cn("text-xl font-bold", stat.color)}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Search dispute, order, party..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Status</option>
          {Object.keys(STATUS_CONFIG).map((s) => (
            <option key={s} value={s}>{STATUS_CONFIG[s as DisputeStatus].label}</option>
          ))}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Priority</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        {selectedIds.length > 0 && (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleBulkAction("Assign")}>Bulk Assign</Button>
            <Button size="sm" variant="outline" onClick={() => handleBulkAction("Close")}>Bulk Close</Button>
          </div>
        )}
      </div>

      {/* Disputes Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 w-8">
                    <input type="checkbox" className="rounded" onChange={(e) => setSelectedIds(e.target.checked ? filtered.map((d) => d.id) : [])} />
                  </th>
                  {["Dispute", "Parties", "Status", "Priority", "Escrow", "Age", "Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((dispute) => {
                  const hoursSince = Math.round((Date.now() - new Date(dispute.created_at).getTime()) / 3600000);
                  const slaPassed = new Date(dispute.sla_deadline) < new Date();
                  const statusConf = STATUS_CONFIG[dispute.status];
                  const priorityConf = PRIORITY_CONFIG[dispute.priority];

                  return (
                    <tr key={dispute.id} className={cn("border-b border-border last:border-0 hover:bg-muted/30 transition-colors", selectedIds.includes(dispute.id) && "bg-primary/5")}>
                      <td className="px-4 py-3">
                        <input type="checkbox" className="rounded" checked={selectedIds.includes(dispute.id)} onChange={(e) => setSelectedIds(e.target.checked ? [...selectedIds, dispute.id] : selectedIds.filter((id) => id !== dispute.id))} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono text-primary font-semibold text-xs">{dispute.number}</div>
                        <div className="text-xs text-muted-foreground">{dispute.order_id}</div>
                        <div className="text-[10px] text-muted-foreground capitalize">{dispute.category.replace("_", " ")}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-medium">{dispute.customer.name}</div>
                        <div className="text-[10px] text-muted-foreground">vs. {dispute.vendor.business}</div>
                        {dispute.carrier && <div className="text-[10px] text-muted-foreground">Carrier: {dispute.carrier.company}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold", statusConf.bg, statusConf.color)}>
                          {statusConf.label}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className={cn("h-2 w-2 rounded-full", priorityConf.dot)} />
                          <span className={cn("text-xs font-semibold capitalize", priorityConf.color)}>{dispute.priority}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs font-semibold">{formatCurrency(dispute.escrow_held, "NGN")}</div>
                        {dispute.is_escrow_override && (
                          <Badge variant="warning" className="text-[9px] mt-0.5">Override Needed</Badge>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className={cn("text-xs font-semibold", hoursSince > 48 ? "text-red-600" : hoursSince > 24 ? "text-yellow-600" : "text-muted-foreground")}>
                          {hoursSince}h
                        </div>
                        {slaPassed && <div className="text-[9px] text-red-600 font-bold">SLA BREACHED</div>}
                      </td>
                      <td className="px-4 py-3">
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setSelectedDispute(dispute)}>
                          <Eye className="h-3 w-3 mr-1" />
                          Open
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Dispute Detail Modal */}
      {selectedDispute && (
        <DisputeDetail
          dispute={selectedDispute}
          onClose={() => setSelectedDispute(null)}
          onResolve={handleResolve}
        />
      )}
    </div>
  );
}
