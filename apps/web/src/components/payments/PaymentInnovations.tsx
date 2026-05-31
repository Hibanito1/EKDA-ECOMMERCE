"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Bitcoin,
  Users,
  ChevronDown,
  CheckCircle2,
  Info,
  Wallet,
  ArrowRight,
  Shield,
  Clock,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@ekda/shared";
import { cn } from "@/lib/utils";

// ─── BNPL Selector ────────────────────────────────────────────────────────────

const BNPL_PLANS = [
  {
    id: "pay_now",
    label: "Pay in Full",
    description: "100% now — escrow protected",
    discount: "0% extra",
    icon: "💳",
    recommended: false,
  },
  {
    id: "pay_2",
    label: "Pay in 2",
    description: "50% now, 50% in 30 days",
    fee: "1.5%",
    icon: "⚡",
    recommended: false,
    provider: "Paystack",
  },
  {
    id: "pay_4",
    label: "Pay in 4",
    description: "4 equal payments every 2 weeks",
    fee: "0%",
    icon: "🎯",
    recommended: true,
    provider: "Klarna",
    tagline: "Interest-free",
  },
  {
    id: "pay_12",
    label: "Monthly (12mo)",
    description: "Spread over 12 months",
    fee: "12% APR",
    icon: "📅",
    recommended: false,
    provider: "Stripe",
    tagline: "Credit check required",
  },
];

const CRYPTO_OPTIONS = [
  { id: "usdt_trc20", symbol: "USDT", network: "TRC-20", icon: "₮", color: "text-green-600" },
  { id: "usdt_erc20", symbol: "USDT", network: "ERC-20", icon: "₮", color: "text-green-600" },
  { id: "usdc", symbol: "USDC", network: "ERC-20", icon: "🪙", color: "text-blue-600" },
  { id: "btc", symbol: "BTC", network: "Bitcoin", icon: "₿", color: "text-orange-500" },
];

interface BNPLSelectorProps {
  orderTotal: number;
  currency: string;
  onChange: (planId: string) => void;
}

export function BNPLSelector({ orderTotal, currency, onChange }: BNPLSelectorProps) {
  const [selected, setSelected] = useState("pay_now");

  const handleSelect = (id: string) => {
    setSelected(id);
    onChange(id);
  };

  const getInstallmentAmount = (planId: string) => {
    switch (planId) {
      case "pay_2": return orderTotal / 2;
      case "pay_4": return orderTotal / 4;
      case "pay_12": return orderTotal / 12;
      default: return orderTotal;
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <CreditCard className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">Payment Schedule</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {BNPL_PLANS.map((plan) => {
          const isSelected = selected === plan.id;
          const installment = getInstallmentAmount(plan.id);
          return (
            <motion.button
              key={plan.id}
              onClick={() => handleSelect(plan.id)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex flex-col items-start p-3 rounded-2xl border-2 text-left transition-all relative",
                isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
              )}
            >
              {plan.recommended && (
                <div className="absolute -top-2 right-3 bg-primary text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                  ✨ Popular
                </div>
              )}
              <span className="text-lg mb-1">{plan.icon}</span>
              <div className="font-semibold text-sm">{plan.label}</div>
              <div className="text-[10px] text-muted-foreground">{plan.description}</div>
              {plan.id !== "pay_now" && (
                <div className="mt-1.5 text-xs font-bold text-foreground">
                  {formatCurrency(installment, currency as any)}{" "}
                  <span className="text-[10px] font-normal text-muted-foreground">
                    /{plan.id === "pay_2" ? "payment" : plan.id === "pay_4" ? "fortnight" : "month"}
                  </span>
                </div>
              )}
              {plan.fee && (
                <Badge className={cn("text-[9px] mt-1 px-1.5 py-0", plan.fee === "0%" ? "bg-green-100 text-green-700 border-0" : "bg-muted text-muted-foreground")}>
                  {plan.fee === "0%" ? "Free" : plan.fee}
                </Badge>
              )}
              {plan.provider && (
                <div className="text-[9px] text-muted-foreground mt-0.5">via {plan.provider}</div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Crypto Payment ────────────────────────────────────────────────────────────

interface CryptoPaymentProps {
  orderTotal: number;
  currency: string;
  onSelect: (cryptoId: string) => void;
}

export function CryptoPayment({ orderTotal, currency, onSelect }: CryptoPaymentProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [showWallet, setShowWallet] = useState(false);

  // Simulated exchange rates
  const RATES: Record<string, number> = {
    usdt_trc20: 0.00061, usdt_erc20: 0.00061, usdc: 0.00061, btc: 0.000000037,
  };

  const handleSelect = (id: string) => {
    setSelected(id);
    setShowWallet(true);
    onSelect(id);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Bitcoin className="h-4 w-4 text-orange-500" />
        <span className="text-sm font-semibold">Pay with Crypto / Stablecoin</span>
        <Badge variant="outline" className="text-[10px]">Popular with Diaspora</Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        Instant settlement. No bank fees. Perfect for international payments.
      </p>
      <div className="grid grid-cols-2 gap-2">
        {CRYPTO_OPTIONS.map((crypto) => {
          const rate = RATES[crypto.id] || 0;
          const amount = orderTotal * rate;
          return (
            <button
              key={crypto.id}
              onClick={() => handleSelect(crypto.id)}
              className={cn(
                "flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all",
                selected === crypto.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
              )}
            >
              <span className={cn("text-xl font-bold", crypto.color)}>{crypto.icon}</span>
              <div>
                <div className="font-semibold text-xs">{crypto.symbol}</div>
                <div className="text-[9px] text-muted-foreground">{crypto.network}</div>
                <div className="text-[10px] font-medium mt-0.5">
                  ≈ {amount.toFixed(crypto.symbol === "BTC" ? 6 : 2)} {crypto.symbol}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {showWallet && selected && (
        <div className="p-3 bg-muted/40 rounded-xl border border-border text-center">
          <div className="text-xs font-medium mb-2">Send to wallet address:</div>
          <code className="text-[10px] bg-background border border-border px-2 py-1.5 rounded-lg block break-all">
            TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t
          </code>
          <div className="text-[9px] text-muted-foreground mt-1.5">
            Amount: {(orderTotal * (RATES[selected] || 0)).toFixed(2)} {CRYPTO_OPTIONS.find((c) => c.id === selected)?.symbol}
          </div>
          <div className="flex items-center justify-center gap-1 mt-2 text-[10px] text-yellow-600">
            <Clock className="h-3 w-3" />
            Expires in 15 minutes · Auto-confirms on 3 network confirmations
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Split Payment ────────────────────────────────────────────────────────────

interface SplitParticipant {
  id: string;
  name: string;
  email: string;
  share: number;
}

interface SplitPaymentProps {
  orderTotal: number;
  currency: string;
}

export function SplitPayment({ orderTotal, currency }: SplitPaymentProps) {
  const [participants, setParticipants] = useState<SplitParticipant[]>([
    { id: "1", name: "You", email: "", share: 50 },
    { id: "2", name: "", email: "", share: 50 },
  ]);

  const addParticipant = () => {
    const totalShares = participants.reduce((s, p) => s + p.share, 0);
    if (totalShares >= 100) return;
    setParticipants([...participants, { id: Date.now().toString(), name: "", email: "", share: 0 }]);
  };

  const evenSplit = () => {
    const share = Math.floor(100 / participants.length);
    const remainder = 100 - share * participants.length;
    setParticipants(participants.map((p, i) => ({
      ...p,
      share: i === 0 ? share + remainder : share,
    })));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-semibold">Split Payment</span>
        <Badge variant="blue" className="text-[10px]">Group Orders</Badge>
      </div>
      <p className="text-xs text-muted-foreground">
        Ideal for group imports, family purchases, or enterprise multi-buyer orders.
      </p>

      <div className="space-y-2">
        {participants.map((p, i) => {
          const amount = (orderTotal * p.share) / 100;
          return (
            <div key={p.id} className="flex items-center gap-2 p-2.5 bg-muted/30 rounded-xl">
              <div className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </div>
              <div className="flex-1">
                <div className="text-xs font-medium">{p.name || `Person ${i + 1}`}</div>
                <div className="text-[10px] text-muted-foreground">
                  {formatCurrency(amount, currency as any)} ({p.share}%)
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setParticipants(participants.map((part, idx) => idx === i ? { ...part, share: Math.max(0, part.share - 5) } : part))}
                  className="h-6 w-6 rounded border border-border flex items-center justify-center text-xs hover:bg-muted"
                >-</button>
                <span className="text-xs font-bold w-8 text-center">{p.share}%</span>
                <button
                  onClick={() => setParticipants(participants.map((part, idx) => idx === i ? { ...part, share: Math.min(100, part.share + 5) } : part))}
                  className="h-6 w-6 rounded border border-border flex items-center justify-center text-xs hover:bg-muted"
                >+</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={addParticipant} className="text-xs">
          + Add Person
        </Button>
        <Button variant="ghost" size="sm" onClick={evenSplit} className="text-xs">
          Split Evenly
        </Button>
      </div>

      {participants.reduce((s, p) => s + p.share, 0) === 100 && (
        <Button variant="premium" size="sm" className="w-full text-xs">
          <Zap className="h-3.5 w-3.5" />
          Send Payment Links to All Participants
        </Button>
      )}
    </div>
  );
}
