"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell, Mail, MessageSquare, Smartphone, VolumeX,
  CheckCircle2, ShoppingCart, Truck, Shield, AlertCircle,
  Tag, Zap, Save
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import {
  NOTIFICATION_CHANNELS,
  NOTIFICATION_CATEGORIES,
  buildDefaultPreferences,
  setAllInCategory,
  type NotificationPreferences as NotificationPreferenceMap,
} from "@ekda/ui";

// Map icon name strings (from @ekda/ui) → Lucide React components
const CHANNEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  smartphone: Smartphone, mail: Mail, "message-square": MessageSquare, bell: Bell,
};
const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "shopping-cart": ShoppingCart, shield: Shield, "check-circle": CheckCircle2,
  "alert-circle": AlertCircle, tag: Tag, zap: Zap,
};




export function NotificationPreferences() {
  const [channelEnabled, setChannelEnabled] = useState<Record<string, boolean>>({
    push: true, email: true, sms: false, in_app: true,
  });
  const [prefs, setPrefs] = useState<NotificationPreferenceMap>(buildDefaultPreferences);
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
    setPrefs((p) => setAllInCategory(p, catId, value));
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
          {NOTIFICATION_CHANNELS.map((channel) => {
            const isEnabled = channelEnabled[channel.id];
            const ChannelIcon = CHANNEL_ICONS[channel.iconName] ?? Bell;
            return (
              <div key={channel.id} className="flex items-center gap-4 p-3 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0",
                  isEnabled ? "bg-primary/10" : "bg-muted")}>
                  <ChannelIcon className={cn("h-4 w-4", isEnabled ? "text-primary" : "text-muted-foreground")} />
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
                  {(() => { const CI = CATEGORY_ICONS[category.iconName] ?? Bell; return <CI className="h-4 w-4 text-muted-foreground" />; })()}
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
