"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, Shield, Settings, X, ChevronDown, ChevronUp, CheckCircle2, Info, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const COOKIE_BANNER_VERSION = "v1.2";
const STORAGE_KEY = "ekda_consent_preferences";

interface ConsentPreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  data_sharing: boolean;
  accepted_at: string | null;
  version: string;
}

const DEFAULT_PREFS: ConsentPreferences = {
  essential: true, // always true
  analytics: false,
  marketing: false,
  data_sharing: false,
  accepted_at: null,
  version: COOKIE_BANNER_VERSION,
};

const CONSENT_CATEGORIES = [
  {
    id: "essential",
    name: "Essential",
    required: true,
    description: "Required for the platform to function. Cannot be disabled.",
    examples: ["Authentication sessions", "Shopping cart", "Security tokens", "CSRF protection"],
    icon: Shield,
  },
  {
    id: "analytics",
    name: "Analytics & Performance",
    required: false,
    description: "Help us understand how you use EKDA to improve your experience.",
    examples: ["Page views & navigation", "Feature usage", "Error tracking (Sentry)", "Performance monitoring"],
    icon: Globe,
  },
  {
    id: "marketing",
    name: "Marketing & Personalization",
    required: false,
    description: "Enable personalized product recommendations and relevant promotions.",
    examples: ["Product recommendations", "Email campaign tracking", "Retargeting pixels", "Conversion tracking"],
    icon: Globe,
  },
  {
    id: "data_sharing",
    name: "Trusted Partners",
    required: false,
    description: "Share anonymized data with logistics and payment partners to improve service.",
    examples: ["Carrier performance data", "Payment fraud prevention", "Shipping rate optimization"],
    icon: Globe,
  },
];

export function ConsentBanner() {
  const [show, setShow] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [prefs, setPrefs] = useState<ConsentPreferences>(DEFAULT_PREFS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setShow(true);
        return;
      }
      const parsed: ConsentPreferences = JSON.parse(stored);
      if (parsed.version !== COOKIE_BANNER_VERSION) {
        setShow(true);
        return;
      }
      setPrefs(parsed);
    } catch {
      setShow(true);
    }
  }, []);

  const savePrefs = (newPrefs: ConsentPreferences) => {
    const saved = { ...newPrefs, essential: true, accepted_at: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    setPrefs(saved);
    setShow(false);

    // Send to server
    fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        analytics_consent: saved.analytics,
        marketing_consent: saved.marketing,
        data_sharing_consent: saved.data_sharing,
        essential_consent: true,
        consent_banner_version: COOKIE_BANNER_VERSION,
        consent_source: "web",
      }),
    }).catch(() => {}); // non-blocking
  };

  const acceptAll = () =>
    savePrefs({ ...DEFAULT_PREFS, analytics: true, marketing: true, data_sharing: true });

  const acceptEssential = () => savePrefs(DEFAULT_PREFS);

  const saveCustom = () => savePrefs(prefs);

  const togglePref = (key: keyof ConsentPreferences) => {
    if (key === "essential" || key === "accepted_at" || key === "version") return;
    setPrefs((p) => ({ ...p, [key]: !p[key as keyof ConsentPreferences] }));
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-[100]"
      >
        <div className="bg-ekda-dark border border-white/10 rounded-3xl shadow-2xl shadow-black/30 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 p-5 pb-3">
            <div className="h-10 w-10 rounded-xl bg-ekda-green-600/20 flex items-center justify-center flex-shrink-0">
              <Cookie className="h-5 w-5 text-ekda-green-400" />
            </div>
            <div className="flex-1">
              <div className="text-white font-semibold text-sm flex items-center gap-2">
                Privacy & Cookies
                <Badge className="text-[9px] bg-ekda-green-600/20 text-ekda-green-400 border-ekda-green-600/30">
                  NDPR · GDPR
                </Badge>
              </div>
              <p className="text-white/50 text-xs mt-0.5">
                We use cookies to improve your experience and ensure platform security.
              </p>
            </div>
          </div>

          {/* Expandable Settings */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-3 space-y-2">
                  {CONSENT_CATEGORIES.map((cat) => {
                    const isExpanded = expanded === cat.id;
                    const isEnabled = cat.required || (prefs[cat.id as keyof ConsentPreferences] as boolean);

                    return (
                      <div key={cat.id} className="rounded-xl border border-white/10 overflow-hidden">
                        <div className="flex items-center gap-2 p-3">
                          <button
                            onClick={() => setExpanded(isExpanded ? null : cat.id)}
                            className="flex items-center gap-2 flex-1 text-left min-w-0"
                          >
                            <div className={cn("text-xs font-medium truncate", cat.required ? "text-white" : "text-white/80")}>
                              {cat.name}
                            </div>
                            {cat.required && (
                              <Badge className="text-[9px] bg-white/10 text-white/60 border-0 flex-shrink-0">Required</Badge>
                            )}
                          </button>

                          {/* Toggle */}
                          {!cat.required ? (
                            <button
                              onClick={() => togglePref(cat.id as keyof ConsentPreferences)}
                              className={cn(
                                "h-5 w-9 rounded-full transition-all flex-shrink-0 relative",
                                isEnabled ? "bg-ekda-green-500" : "bg-white/20"
                              )}
                            >
                              <div className={cn(
                                "h-4 w-4 rounded-full bg-white absolute top-0.5 transition-all",
                                isEnabled ? "left-4" : "left-0.5"
                              )} />
                            </button>
                          ) : (
                            <CheckCircle2 className="h-4 w-4 text-ekda-green-400 flex-shrink-0" />
                          )}

                          <button onClick={() => setExpanded(isExpanded ? null : cat.id)}>
                            {isExpanded ? <ChevronUp className="h-3.5 w-3.5 text-white/40" /> : <ChevronDown className="h-3.5 w-3.5 text-white/40" />}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="px-3 pb-3 border-t border-white/10">
                            <p className="text-[11px] text-white/50 mt-2 mb-2">{cat.description}</p>
                            <div className="space-y-1">
                              {cat.examples.map((ex) => (
                                <div key={ex} className="flex items-center gap-1.5 text-[11px] text-white/40">
                                  <div className="h-1 w-1 rounded-full bg-white/30 flex-shrink-0" />
                                  {ex}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="p-4 pt-2 space-y-2">
            <div className="flex gap-2">
              <Button
                size="sm"
                className="flex-1 bg-ekda-green-600 hover:bg-ekda-green-700 text-white text-xs h-9"
                onClick={acceptAll}
              >
                Accept All
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-white/20 text-white hover:bg-white/10 text-xs h-9"
                onClick={acceptEssential}
              >
                Essential Only
              </Button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex-1 text-center text-[11px] text-white/40 hover:text-white/70 transition-colors flex items-center justify-center gap-1"
              >
                <Settings className="h-3 w-3" />
                {showSettings ? "Hide settings" : "Manage preferences"}
              </button>
              {showSettings && (
                <Button size="sm" variant="ghost" className="text-white/70 hover:text-white text-xs h-7 px-2" onClick={saveCustom}>
                  Save
                </Button>
              )}
            </div>
            <p className="text-[10px] text-white/30 text-center">
              By using EKDA you agree to our{" "}
              <a href="/privacy" className="underline hover:text-white/60">Privacy Policy</a>{" "}
              and{" "}
              <a href="/terms" className="underline hover:text-white/60">Terms of Service</a>
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Consent Manager (in account settings) ───────────────────────────────────

export function ConsentManager() {
  const [prefs, setPrefs] = useState<ConsentPreferences>(DEFAULT_PREFS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPrefs(JSON.parse(stored));
    } catch {}
  }, []);

  const toggle = (key: keyof ConsentPreferences) => {
    if (key === "essential" || key === "accepted_at" || key === "version") return;
    setPrefs((p) => ({ ...p, [key]: !p[key as keyof ConsentPreferences] }));
    setSaved(false);
  };

  const save = () => {
    const saved = { ...prefs, essential: true, accepted_at: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    setSaved(true);
    fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analytics_consent: saved.analytics, marketing_consent: saved.marketing, data_sharing_consent: saved.data_sharing }),
    }).catch(() => {});
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Privacy & Consent Settings</h3>
        <Badge variant="outline" className="text-xs ml-auto">NDPR · GDPR</Badge>
      </div>

      <div className="space-y-3">
        {CONSENT_CATEGORIES.map((cat) => {
          const isEnabled = cat.required || (prefs[cat.id as keyof ConsentPreferences] as boolean);
          return (
            <div key={cat.id} className="flex items-start gap-4 p-4 bg-muted/30 rounded-2xl border border-border">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{cat.name}</span>
                  {cat.required && <Badge variant="outline" className="text-[10px]">Always On</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">{cat.description}</p>
              </div>
              <button
                onClick={() => toggle(cat.id as keyof ConsentPreferences)}
                disabled={cat.required}
                className={cn(
                  "h-6 w-11 rounded-full transition-all flex-shrink-0 relative mt-0.5",
                  isEnabled ? "bg-primary" : "bg-muted",
                  cat.required && "opacity-50 cursor-not-allowed"
                )}
              >
                <div className={cn(
                  "h-5 w-5 rounded-full bg-white absolute top-0.5 transition-all shadow-sm",
                  isEnabled ? "left-5" : "left-0.5"
                )} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <Button variant="premium" size="sm" onClick={save}>
          {saved ? <><CheckCircle2 className="h-3.5 w-3.5" />Saved</> : "Save Preferences"}
        </Button>
        <a href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          View Privacy Policy →
        </a>
      </div>

      <div className="pt-4 border-t border-border space-y-3">
        <h4 className="font-medium text-sm">Data Rights (NDPR / GDPR)</h4>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "📤 Export My Data", desc: "Download all your EKDA data as JSON" },
            { label: "🗑️ Delete Account", desc: "Permanently delete your account and data" },
            { label: "📋 View Audit Log", desc: "See all actions taken on your account" },
            { label: "✋ Withdraw Consent", desc: "Withdraw specific consents" },
          ].map((item) => (
            <button
              key={item.label}
              className="text-left p-3 bg-muted/40 rounded-xl hover:bg-muted/70 border border-border transition-all text-sm"
            >
              <div className="font-medium text-xs">{item.label}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
