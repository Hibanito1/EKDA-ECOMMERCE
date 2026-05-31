"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Mail, MessageSquare, Smartphone, Volume2, VolumeX,
  CheckCircle2, ShoppingCart, Truck, Shield, AlertCircle,
  Star, Tag, Zap, Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface NotificationChannel {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NotificationCategory {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  events: NotificationEvent[];
}

interface NotificationEvent {
  id: string;
  label: string;
  important?: boolean;
}

const CHANNELS: NotificationChannel[] = [
  { id: "push", label: "Push Notification", description: "Browser and mobile app alerts", icon: Smartphone },
  { id: "email", label: "Email", description: "Sent to your registered email", icon: Mail },
  { id: "sms", label: "SMS", description: "Text messages to your phone", icon: MessageSquare },
  { id: "in_app", label: "In-App", description: "Alerts inside the EKDA app", icon: Bell },
];

const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  {
    id: "orders",
    label: "Orders & Tracking",
    icon: ShoppingCart,
    description: "Order confirmations, status updates, and delivery alerts",
    events: [
      { id: "order_placed", label: "Order confirmed", important: true },
      { id: "payment_confirmed", label: "Payment received", important: true },
      { id: "carrier_assigned", label: "Carrier assigned" },
      { id: "order_picked_up", label: "Order picked up", important: true },
      { id: "in_transit", label: "Shipment in transit" },
      { id: "arrived_at_port", label: "Arrived at destination port", important: true },
      { id: "order_delivered", label: "Order delivered", important: true },
    ],
  },
  {
    id: "payments",
    label: "Payments & Escrow",
    icon: Shield,
    description: "Escrow releases, payouts, and payment alerts",
    events: [
      { id: "escrow_created", label: "Escrow created", important: true },
      { id: "escrow_first_release", label: "Escrow 50% released", important: true },
      { id: "escrow_fully_released", label: "Full payment released", important: true },
      { id: "payout_processed", label: "Payout processed" },
      { id: "payment_failed", label: "Payment failed", important: true },
    ],
  },
  {
    id: "kyc",
    label: "Account & KYC",
    icon: CheckCircle2,
    description: "Verification status and account security alerts",
    events: [
      { id: "kyc_submitted", label: "KYC application submitted" },
      { id: "kyc_approved", label: "KYC approved", important: true },
      { id: "kyc_rejected", label: "KYC rejected", important: true },
      { id: "more_info_required", label: "More information required", important: true },
      { id: "account_security", label: "Security alerts", important: true },
    ],
  },
  {
    id: "disputes",
    label: "Disputes & Support",
    icon: AlertCircle,
    description: "Dispute updates and support ticket notifications",
    events: [
      { id: "dispute_opened", label: "Dispute opened", important: true },
      { id: "dispute_message", label: "New message in dispute" },
      { id: "dispute_resolved", label: "Dispute resolved", important: true },
      { id: "support_reply", label: "Support ticket reply", important: true },
    ],
  },
  {
    id: "marketing",
    label: "Promotions & Offers",
    icon: Tag,
    description: "Deals, loyalty rewards, and platform news",
    events: [
      { id: "price_alert", label: "Price alert triggered" },
      { id: "loyalty_points", label: "Loyalty points earned" },
      { id: "promo_code", label: "New promo code available" },
      { id: "platform_news", label: "Platform updates and news" },
      { id: "weekly_digest", label: "Weekly digest email" },
    ],
  },
  {
    id: "ai",
    label: "AI Recommendations",
    icon: Zap,
    description: "Smart product recommendations and insights",
    events: [
      { id: "ai_recommendation", label: "Personalized product picks" },
      { id: "demand_forecast", label: "Stock replenishment reminders (vendors)" },
      { id: "price_prediction", label: "Commodity price predictions" },
    ],
  },
];

type Preferences = Record<string, Record<string, boolean>>;

function buildDefaultPreferences(): Preferences {
  const prefs: Preferences = {};
  NOTIFICATION_CATEGORIES.forEach((cat) => {
    prefs[cat.id] = {};
    cat.events.forEach((event) => {
      prefs[cat.id]![event.id] = event.important !== false;
    });
  });
  return prefs;
}

export function NotificationPreferences() {
  const [channelEnabled, setChannelEnabled] = useState<Record<string, boolean>>({
    push: true, email: true, sms: false, in_app: true,
  });
  const [prefs, setPrefs] = useState<Preferences>(buildDefaultPreferences);
  const [saving, setSaving] = useState(false);
  const [quietHours, setQuietHours] = useState({ enabled: false, from: "22:00", to: "07:00" });

  const toggleChannel = (channelId: string) =>
    setChannelEnabled((p) => ({ ...p, [channelId]: !p[channelId] }));

  const togglePref = (catId: string, eventId: string) =>
    setPrefs((p) => ({
      ...p,
      [catId]: { ...p[catId], [eventId]: !p[catId]?.[eventId] },
    }));

  const setAll = (catId: string, value: boolean) => {
    const cat = NOTIFICATION_CATEGORIES.find((c) => c.id === catId);
    if (!cat) return;
    const updated: Record<string, boolean> = {};
    cat.events.forEach((e) => { updated[e.id] = value; });
    setPrefs((p) => ({ ...p, [catId]: updated }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    toast.success("✅ Notification preferences saved");
  };

  const enabledChannels = Object.values(channelEnabled).filter(Boolean).length;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
          <Bell className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Notification Preferences</h2>
          <p className="text-muted-foreground text-sm">
            Control exactly how and when EKDA notifies you
          </p>
        </div>
        <Badge variant={enabledChannels > 0 ? "success" : "outline"} className="ml-auto text-xs">
          {enabledChannels} channels active
        </Badge>
      </div>

      {/* Channels */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Notification Channels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 p-4 pt-0">
          {CHANNELS.map((channel) => {
            const isEnabled = channelEnabled[channel.id];
            return (
              <div key={channel.id} className="flex items-center gap-4 p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0",
                  isEnabled ? "bg-primary/10" : "bg-muted")}>
                  <channel.icon className={cn("h-4 w-4", isEnabled ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{channel.label}</div>
                  <div className="text-xs text-muted-foreground">{channel.description}</div>
                </div>
                <button
                  onClick={() => toggleChannel(channel.id)}
                  className={cn(
                    "h-6 w-11 rounded-full transition-all relative flex-shrink-0",
                    isEnabled ? "bg-primary" : "bg-muted"
                  )}
                >
                  <motion.div
                    animate={{ left: isEnabled ? "calc(100% - 22px)" : "2px" }}
                    transition={{ type: "spring", damping: 20, stiffness: 300 }}
                    className="h-5 w-5 rounded-full bg-white absolute top-0.5 shadow-sm"
                  />
                </button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-sm flex items-center gap-2">
                <VolumeX className="h-4 w-4 text-muted-foreground" />
                Quiet Hours
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Pause non-critical notifications during these hours
              </div>
            </div>
            <button
              onClick={() => setQuietHours((qh) => ({ ...qh, enabled: !qh.enabled }))}
              className={cn("h-6 w-11 rounded-full transition-all relative", quietHours.enabled ? "bg-primary" : "bg-muted")}
            >
              <motion.div
                animate={{ left: quietHours.enabled ? "calc(100% - 22px)" : "2px" }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="h-5 w-5 rounded-full bg-white absolute top-0.5 shadow-sm"
              />
            </button>
          </div>
          <AnimatePresence>
            {quietHours.enabled && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-3 flex gap-4"
              >
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">From</label>
                  <input type="time" value={quietHours.from} onChange={(e) => setQuietHours((qh) => ({ ...qh, from: e.target.value }))}
                    className="h-9 px-3 rounded-xl border border-input bg-background text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">To</label>
                  <input type="time" value={quietHours.to} onChange={(e) => setQuietHours((qh) => ({ ...qh, to: e.target.value }))}
                    className="h-9 px-3 rounded-xl border border-input bg-background text-sm" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Categories */}
      {NOTIFICATION_CATEGORIES.map((category) => {
        const catPrefs = prefs[category.id] || {};
        const allEnabled = Object.values(catPrefs).every(Boolean);
        const enabledCount = Object.values(catPrefs).filter(Boolean).length;

        return (
          <Card key={category.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <category.icon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">{category.label}</div>
                    <div className="text-xs text-muted-foreground">{category.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-muted-foreground">{enabledCount}/{category.events.length}</span>
                  <button
                    onClick={() => setAll(category.id, !allEnabled)}
                    className="text-xs text-primary hover:underline font-medium"
                  >
                    {allEnabled ? "Disable all" : "Enable all"}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {category.events.map((event) => {
                  const isEnabled = catPrefs[event.id] ?? false;
                  return (
                    <div key={event.id} className="flex items-center justify-between py-1.5">
                      <div className="flex items-center gap-2 text-sm">
                        <span>{isEnabled ? "🔔" : "🔕"}</span>
                        <span className={cn("text-sm", !isEnabled && "text-muted-foreground line-through")}>{event.label}</span>
                        {event.important && (
                          <Badge className="text-[9px] px-1.5 py-0 bg-red-100 text-red-700 border-red-200">Critical</Badge>
                        )}
                      </div>
                      <button
                        onClick={() => togglePref(category.id, event.id)}
                        className={cn("h-5 w-9 rounded-full transition-all relative flex-shrink-0",
                          isEnabled ? "bg-primary" : "bg-muted"
                        )}
                      >
                        <motion.div
                          animate={{ left: isEnabled ? "calc(100% - 18px)" : "2px" }}
                          transition={{ type: "spring", damping: 20, stiffness: 300 }}
                          className="h-4 w-4 rounded-full bg-white absolute top-0.5 shadow-sm"
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <Button variant="premium" size="lg" onClick={handleSave} loading={saving} className="w-full">
        <Save className="h-4 w-4" />
        Save Notification Preferences
      </Button>
    </div>
  );
}
