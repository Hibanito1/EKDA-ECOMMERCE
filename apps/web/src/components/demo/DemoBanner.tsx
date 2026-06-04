"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Info, ChevronDown, ChevronUp, Copy, CheckCircle2 } from "lucide-react";
import { DEMO_USERS, DEMO_BANNER } from "@/lib/demo";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

interface DemoCredential {
  role: string;
  email: string;
  password: string;
  description: string;
  icon: string;
}

const DEMO_CREDENTIALS: DemoCredential[] = [
  { role: "Customer", email: DEMO_USERS.customer!.email, password: DEMO_USERS.customer!.password, description: "Shop, checkout, track orders", icon: "🛍️" },
  { role: "Vendor", email: DEMO_USERS.vendor!.email, password: DEMO_USERS.vendor!.password, description: "List products, manage orders, AI HS codes", icon: "🏪" },
  { role: "Carrier", email: DEMO_USERS.carrier!.email, password: DEMO_USERS.carrier!.password, description: "Bid on jobs, confirm pickups", icon: "🚢" },
  { role: "Admin", email: DEMO_USERS.admin!.email, password: DEMO_USERS.admin!.password, description: "Full platform control, KYC queue", icon: "⚡" },
];

function DemoCredentialCard({ credential }: { credential: DemoCredential }) {
  const [copied, setCopied] = useState<"email" | "password" | null>(null);

  const copy = async (text: string, field: "email" | "password") => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    toast.success(`${field === "email" ? "Email" : "Password"} copied!`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="p-3 bg-black/30 rounded-xl border border-white/10 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-base">{credential.icon}</span>
        <span className="text-white font-semibold text-sm">{credential.role}</span>
        <span className="text-white/50 text-xs ml-auto">{credential.description}</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        <button
          onClick={() => copy(credential.email, "email")}
          className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 rounded-lg px-2 py-1.5 text-left transition-colors group"
        >
          <code className="text-[10px] text-ekda-green-300 flex-1 truncate">{credential.email}</code>
          {copied === "email" ? (
            <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0" />
          ) : (
            <Copy className="h-3 w-3 text-white/30 group-hover:text-white/60 flex-shrink-0" />
          )}
        </button>
        <button
          onClick={() => copy(credential.password, "password")}
          className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 rounded-lg px-2 py-1.5 text-left transition-colors group"
        >
          <code className="text-[10px] text-ekda-gold-300 flex-1">Demo@12345</code>
          {copied === "password" ? (
            <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0" />
          ) : (
            <Copy className="h-3 w-3 text-white/30 group-hover:text-white/60 flex-shrink-0" />
          )}
        </button>
      </div>
    </div>
  );
}

export function DemoBanner() {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  if (!isDemo || dismissed) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
        className="fixed top-0 left-0 right-0 z-[200] bg-gradient-to-r from-indigo-900 via-purple-900 to-ekda-dark border-b border-white/10 shadow-2xl"
      >
        {/* Main Banner Row */}
        <div className="flex items-center gap-3 px-4 py-2.5">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="h-5 w-5 rounded-full bg-yellow-400 flex items-center justify-center animate-pulse">
              <Zap className="h-3 w-3 text-yellow-900" />
            </div>
            <span className="text-yellow-300 text-xs font-bold uppercase tracking-wider">
              Demo Mode
            </span>
          </div>
          <span className="text-white/70 text-xs flex-1 hidden sm:block">
            {DEMO_BANNER.message}
          </span>
          <span className="text-white/70 text-xs flex-1 sm:hidden">
            Demo — all payments simulated
          </span>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[10px] text-white/50 hover:text-white/80 transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded-lg"
            >
              {expanded ? "Hide" : "Credentials"}
              {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="h-6 w-6 rounded-lg text-white/40 hover:text-white/70 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Expanded Credentials */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-white/10"
            >
              <div className="px-4 py-3">
                <p className="text-white/50 text-[10px] mb-3 uppercase tracking-wide font-semibold">
                  Click to copy credentials — password is Demo@12345 for all accounts
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-2">
                  {DEMO_CREDENTIALS.map((cred) => (
                    <DemoCredentialCard key={cred.role} credential={cred} />
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-[10px] text-white/40">
                  <div className="flex items-center gap-1"><span className="text-green-400">✓</span> No real payments processed</div>
                  <div className="flex items-center gap-1"><span className="text-green-400">✓</span> No real KYC documents needed</div>
                  <div className="flex items-center gap-1"><span className="text-green-400">✓</span> AI responses are simulated</div>
                  <div className="flex items-center gap-1"><span className="text-green-400">✓</span> Escrow flow fully testable</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
