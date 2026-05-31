"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Megaphone, TrendingUp, Tag, Users, Mail, Bell, Plus, Edit, Trash2,
  CheckCircle2, Clock, Target, Zap, BarChart3, Send, Calendar, Gift
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatDate } from "@ekda/shared";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const PROMO_CODES = [
  { code: "DIASPORA10", type: "percentage", value: 10, uses: 847, max_uses: 1000, valid_until: "2025-07-31", status: "active", revenue_impact: -284000 },
  { code: "NEWVENDOR", type: "percentage", value: 50, uses: 124, max_uses: 200, valid_until: "2025-06-30", status: "active", revenue_impact: -62000, target: "new_vendors" },
  { code: "EID2025", type: "fixed", value: 5000, uses: 2840, max_uses: null, valid_until: "2025-06-16", status: "expired", revenue_impact: -14200000 },
];

const CAMPAIGNS = [
  { id: "c1", name: "Eid al-Adha Promotion", type: "email", status: "active", sent: 42800, opened: 18240, clicked: 8420, conversions: 1247, revenue: 24800000, target: "All Customers" },
  { id: "c2", name: "Vendor Premium Upgrade Drive", type: "push", status: "active", sent: 2841, opened: 1920, clicked: 847, conversions: 142, revenue: 4970000, target: "Vendors" },
  { id: "c3", name: "Welcome Series — New Diaspora Users", type: "email", status: "active", sent: 8420, opened: 5040, clicked: 2840, conversions: 924, revenue: 38400000, target: "New Customers (UK/USA/CA)" },
];

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "promos" | "notifications" | "referrals">("campaigns");
  const [showNewPromo, setShowNewPromo] = useState(false);
  const [newPromo, setNewPromo] = useState({ code: "", type: "percentage", value: "", max_uses: "" });

  const handleCreatePromo = () => {
    toast.success(`✅ Promo code "${newPromo.code}" created and activated`);
    setShowNewPromo(false);
    setNewPromo({ code: "", type: "percentage", value: "", max_uses: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            Marketing & Growth Tools
          </h1>
          <p className="text-muted-foreground text-sm">Campaigns, promo codes, notifications, and referral analytics</p>
        </div>
        <Button variant="premium" size="sm"><Plus className="h-3.5 w-3.5" />New Campaign</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-muted/50 rounded-2xl w-fit">
        {(["campaigns", "promos", "notifications", "referrals"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize",
              activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}>
            {tab}
          </button>
        ))}
      </div>

      {/* Campaigns */}
      {activeTab === "campaigns" && (
        <div className="space-y-4">
          {CAMPAIGNS.map((camp, i) => (
            <motion.div key={camp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{camp.name}</h3>
                        <Badge variant={camp.type === "email" ? "blue" : "default"} className="text-[10px]">
                          {camp.type === "email" ? <Mail className="h-2.5 w-2.5 mr-1" /> : <Bell className="h-2.5 w-2.5 mr-1" />}
                          {camp.type}
                        </Badge>
                        <Badge variant="success" className="text-[10px]">Active</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">Target: {camp.target}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-ekda-green-600">{formatCurrency(camp.revenue, "NGN")}</div>
                      <div className="text-xs text-muted-foreground">Attributed Revenue</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    {[
                      { label: "Sent", value: camp.sent.toLocaleString() },
                      { label: "Opened", value: camp.opened.toLocaleString(), sub: `${Math.round(camp.opened / camp.sent * 100)}% rate` },
                      { label: "Clicked", value: camp.clicked.toLocaleString(), sub: `${Math.round(camp.clicked / camp.sent * 100)}% CTR` },
                      { label: "Conversions", value: camp.conversions.toLocaleString(), sub: `${Math.round(camp.conversions / camp.clicked * 100)}% rate` },
                    ].map((stat) => (
                      <div key={stat.label} className="p-2.5 bg-muted/30 rounded-xl">
                        <div className="font-bold">{stat.value}</div>
                        <div className="text-[10px] text-muted-foreground">{stat.label}</div>
                        {stat.sub && <div className="text-[9px] text-ekda-green-600">{stat.sub}</div>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Promo Codes */}
      {activeTab === "promos" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold">Active Promo Codes</h2>
            <Button variant="premium" size="sm" onClick={() => setShowNewPromo(true)}>
              <Plus className="h-3.5 w-3.5" />
              Create Promo
            </Button>
          </div>

          {showNewPromo && (
            <Card className="border-primary/30 ring-1 ring-primary/20">
              <CardContent className="p-5">
                <div className="font-semibold text-sm mb-4">Create New Promo Code</div>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Promo Code" placeholder="DIASPORA15" value={newPromo.code} onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })} />
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Discount Type</label>
                    <select value={newPromo.type} onChange={(e) => setNewPromo({ ...newPromo, type: e.target.value })}
                      className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₦)</option>
                    </select>
                  </div>
                  <Input label="Discount Value" placeholder={newPromo.type === "percentage" ? "10" : "5000"} value={newPromo.value} onChange={(e) => setNewPromo({ ...newPromo, value: e.target.value })} />
                  <Input label="Max Uses (leave blank = unlimited)" placeholder="1000" value={newPromo.max_uses} onChange={(e) => setNewPromo({ ...newPromo, max_uses: e.target.value })} />
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="premium" size="sm" onClick={handleCreatePromo}>Create & Activate</Button>
                  <Button variant="outline" size="sm" onClick={() => setShowNewPromo(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    {["Code", "Type", "Uses", "Revenue Impact", "Valid Until", "Status", "Actions"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-muted-foreground uppercase">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PROMO_CODES.map((promo) => (
                    <tr key={promo.code} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3 font-mono font-bold text-primary">{promo.code}</td>
                      <td className="px-5 py-3">
                        <Badge variant="outline" className="text-[10px]">
                          {promo.type === "percentage" ? `${promo.value}% off` : `₦${promo.value.toLocaleString()} off`}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-xs">{promo.uses.toLocaleString()}{promo.max_uses ? `/${promo.max_uses}` : ""}</td>
                      <td className="px-5 py-3 text-xs text-red-500">{formatCurrency(promo.revenue_impact, "NGN")}</td>
                      <td className="px-5 py-3 text-xs text-muted-foreground">{formatDate(promo.valid_until)}</td>
                      <td className="px-5 py-3">
                        <Badge variant={promo.status === "active" ? "success" : "outline"} className="text-[10px]">{promo.status}</Badge>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0"><Edit className="h-3.5 w-3.5" /></Button>
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notifications */}
      {activeTab === "notifications" && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Send Segmented Notification</h3>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Target Audience</label>
                <select className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm">
                  <option>All Users (52,410)</option>
                  <option>All Vendors (2,841)</option>
                  <option>All Carriers (486)</option>
                  <option>UK Diaspora Customers (8,420)</option>
                  <option>Users with active orders</option>
                  <option>Users who haven't ordered in 30+ days</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Channel</label>
                  <select className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm">
                    <option>Push Notification</option>
                    <option>Email</option>
                    <option>SMS</option>
                    <option>In-App Banner</option>
                  </select>
                </div>
                <Input label="Schedule (optional)" type="datetime-local" />
              </div>
              <Input label="Notification Title" placeholder="🌿 Eid Special — 10% off all African groceries" />
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Message</label>
                <textarea className="w-full h-24 px-3 py-2.5 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Celebrate Eid al-Adha with authentic African groceries. Shop now and get 10% off with code EID2025. Valid until June 16." />
              </div>
              <Button variant="premium">
                <Send className="h-4 w-4" />
                Send Notification
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Referrals */}
      {activeTab === "referrals" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Total Referrals", value: "7,842", change: "+24% this month" },
            { label: "Credits Issued", value: "₦39.2M", change: "₦5,000 per referral" },
            { label: "Revenue from Referrals", value: "₦284M", change: "7.2x ROI" },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-5 flex items-center gap-3">
                <Gift className="h-8 w-8 text-ekda-gold-600 flex-shrink-0" />
                <div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                  <div className="text-xs text-green-600 font-medium">{stat.change}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
