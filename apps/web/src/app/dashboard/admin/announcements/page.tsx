"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone, Plus, Eye, Trash2, CheckCircle2, Clock, AlertTriangle,
  Bell, Globe, Users, Edit, X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { formatDate } from "@ekda/shared";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const ANNOUNCEMENTS = [
  {
    id: "a1", title: "🌙 Eid al-Adha Special — 10% Off All Orders",
    message: "Celebrate Eid al-Adha with EKDA! Get 10% off all African grocery orders with code EID2025. Valid June 5-16, 2025.",
    type: "success", target_roles: ["customer"], is_active: true, show_banner: true,
    starts_at: "2025-06-05", ends_at: "2025-06-16", views: 18420, clicks: 4280,
  },
  {
    id: "a2", title: "⚙️ Scheduled Maintenance — June 15, 2-4 AM WAT",
    message: "EKDA will undergo scheduled maintenance on June 15, 2025 from 2:00 AM to 4:00 AM WAT. Some features may be unavailable during this window.",
    type: "warning", target_roles: ["customer", "vendor", "carrier"], is_active: true, show_banner: true,
    starts_at: "2025-06-14", ends_at: "2025-06-15", views: 42840, clicks: 1240,
  },
  {
    id: "a3", title: "🚀 New Feature: AI HS Code Classifier Now 10x Faster",
    message: "We've upgraded our AI HS Code classifier with Groq's latest Llama model. Classification now takes <1 second with 97.8% accuracy!",
    type: "info", target_roles: ["vendor"], is_active: false, show_banner: false,
    starts_at: "2025-05-20", ends_at: "2025-06-01", views: 8420, clicks: 3241,
  },
];

const TYPE_CONFIG = {
  info: { color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20", border: "border-blue-200 dark:border-blue-800", icon: Bell },
  success: { color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20", border: "border-green-200 dark:border-green-800", icon: CheckCircle2 },
  warning: { color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20", border: "border-yellow-200 dark:border-yellow-800", icon: AlertTriangle },
  critical: { color: "text-red-600", bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800", icon: AlertTriangle },
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(ANNOUNCEMENTS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", type: "info", targets: ["customer", "vendor", "carrier"] });

  const handleCreate = () => {
    toast.success("✅ Announcement created and published to all targeted users");
    setShowForm(false);
    setForm({ title: "", message: "", type: "info", targets: ["customer", "vendor", "carrier"] });
  };

  const toggleActive = (id: string) => {
    setAnnouncements((prev) => prev.map((a) => a.id === id ? { ...a, is_active: !a.is_active } : a));
    toast.success("Announcement status updated");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-purple-600" />
            Platform Announcements
          </h1>
          <p className="text-muted-foreground text-sm">Broadcast messages to users by role and segment</p>
        </div>
        <Button variant="premium" size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-3.5 w-3.5" />
          New Announcement
        </Button>
      </div>

      {/* Create Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Card className="border-primary/30 ring-1 ring-primary/20">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Create Announcement</h3>
                  <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-muted-foreground" /></button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Input label="Announcement Title" placeholder="🚀 New Feature: ..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Type</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm">
                      <option value="info">ℹ️ Info</option>
                      <option value="success">✅ Success</option>
                      <option value="warning">⚠️ Warning</option>
                      <option value="critical">🚨 Critical</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Target Roles</label>
                    <div className="flex gap-2">
                      {["customer", "vendor", "carrier", "admin"].map((role) => (
                        <label key={role} className="flex items-center gap-1 text-xs cursor-pointer">
                          <input type="checkbox" className="rounded" defaultChecked={role !== "admin"} />
                          <span className="capitalize">{role}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-sm font-medium">Message</label>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full h-24 px-3 py-2.5 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Announcement message..." />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="premium" size="sm" onClick={handleCreate}>Publish Now</Button>
                  <Button variant="outline" size="sm">Schedule</Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((ann, i) => {
          const typeConf = TYPE_CONFIG[ann.type as keyof typeof TYPE_CONFIG];
          return (
            <motion.div key={ann.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
              <Card className={cn("border", !ann.is_active && "opacity-60")}>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0", typeConf.bg)}>
                      <typeConf.icon className={cn("h-4 w-4", typeConf.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-sm">{ann.title}</h3>
                        <Badge variant={ann.is_active ? "success" : "outline"} className="text-[10px]">
                          {ann.is_active ? "Active" : "Inactive"}
                        </Badge>
                        {ann.show_banner && <Badge variant="blue" className="text-[10px]">Banner</Badge>}
                        {ann.target_roles.map((role) => (
                          <Badge key={role} variant="outline" className="text-[9px] capitalize">{role}</Badge>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{ann.message}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{ann.views.toLocaleString()} views</span>
                        <span>{ann.clicks.toLocaleString()} clicks ({Math.round(ann.clicks / ann.views * 100)}% CTR)</span>
                        <span>📅 {formatDate(ann.starts_at)} → {ann.ends_at ? formatDate(ann.ends_at) : "Ongoing"}</span>
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Edit className="h-3.5 w-3.5" /></Button>
                      <Button size="sm" variant="ghost" className={cn("h-8 w-8 p-0", ann.is_active ? "text-yellow-600" : "text-green-600")} onClick={() => toggleActive(ann.id)}>
                        {ann.is_active ? <X className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500"><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
