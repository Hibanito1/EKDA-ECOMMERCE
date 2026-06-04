import { EKDA_COMMISSION_RATE, ESCROW_FIRST_RELEASE_RATE, ESCROW_SECOND_RELEASE_RATE } from "@ekda/shared";

// ─── Escrow State ─────────────────────────────────────────────────────────────

export type EscrowStatus = "held" | "partial_released" | "fully_released" | "refunded";

export interface DemoEscrowState {
  orderId: string;
  totalAmount: number;
  vendorShare: number;
  ekdaCommission: number;
  status: EscrowStatus;
  firstReleaseAmount: number;
  secondReleaseAmount: number;
  firstReleasedAt: string | null;
  secondReleasedAt: string | null;
}

/** Create an initial escrow state for a demo order */
export function createDemoEscrow(orderId: string, total: number): DemoEscrowState {
  const commission = total * EKDA_COMMISSION_RATE;
  const vendorShare = total - commission;
  return {
    orderId,
    totalAmount: total,
    vendorShare,
    ekdaCommission: commission,
    status: "held",
    firstReleaseAmount: vendorShare * ESCROW_FIRST_RELEASE_RATE,
    secondReleaseAmount: vendorShare * ESCROW_SECOND_RELEASE_RATE,
    firstReleasedAt: null,
    secondReleasedAt: null,
  };
}

/** Simulate the pickup event (1st release) */
export function simulatePickupRelease(state: DemoEscrowState): DemoEscrowState {
  return {
    ...state,
    status: "partial_released",
    firstReleasedAt: new Date().toISOString(),
  };
}

/** Simulate the destination arrival (2nd release) */
export function simulateDeliveryRelease(state: DemoEscrowState): DemoEscrowState {
  return {
    ...state,
    status: "fully_released",
    secondReleasedAt: new Date().toISOString(),
  };
}

/** Simulate a refund back to customer */
export function simulateEscrowRefund(state: DemoEscrowState): DemoEscrowState {
  return {
    ...state,
    status: "refunded",
    secondReleasedAt: new Date().toISOString(),
  };
}

// ─── Escrow Simulation Demo Steps ─────────────────────────────────────────────

export interface EscrowDemoStep {
  id: string;
  title: string;
  description: string;
  actor: "customer" | "ekda" | "vendor" | "carrier";
  delay: number;
  amount?: number;
  escrowAction?: "FUNDS_LOCKED" | "FIRST_RELEASE" | "SECOND_RELEASE";
}

/** Ordered steps for the animated escrow demo */
export const ESCROW_DEMO_STEPS: EscrowDemoStep[] = [
  {
    id: "payment",
    title: "Customer Places Order & Pays",
    description: "Payment secured 100% in EKDA escrow. Zero risk to buyer.",
    actor: "customer",
    delay: 0,
    amount: 196500,
    escrowAction: "FUNDS_LOCKED",
  },
  {
    id: "preparing",
    title: "Vendor Prepares Shipment",
    description: "Lagos Fresh Exports packages the order. Phytosanitary certificate obtained.",
    actor: "vendor",
    delay: 800,
  },
  {
    id: "carrier_assigned",
    title: "Carrier Assigned",
    description: "Maersk Line assigned for sea freight (Apapa → Tilbury). Transit: 28 days.",
    actor: "ekda",
    delay: 1400,
  },
  {
    id: "pickup",
    title: "🚢 Carrier Confirms Pickup",
    description: "Maersk confirms goods received at Apapa Port. 1st escrow release triggered.",
    actor: "carrier",
    delay: 2200,
    amount: 76500,
    escrowAction: "FIRST_RELEASE",
  },
  {
    id: "transit",
    title: "In Transit — Atlantic Ocean",
    description: "Vessel Maersk Enfield departed Apapa. ETA Tilbury: 28 days.",
    actor: "ekda",
    delay: 3000,
  },
  {
    id: "arrived",
    title: "🏁 Arrived at Destination Port",
    description: "Maersk confirms arrival at Tilbury, London. Final escrow release triggered.",
    actor: "carrier",
    delay: 3800,
    amount: 76500,
    escrowAction: "SECOND_RELEASE",
  },
  {
    id: "complete",
    title: "✅ Transaction Complete",
    description: "Vendor received ₦153,000 total. EKDA commission: ₦17,000. Order delivered!",
    actor: "ekda",
    delay: 4600,
  },
];

// ─── Loyalty Tiers ────────────────────────────────────────────────────────────

export type LoyaltyTier = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface LoyaltyTierConfig {
  min: number;
  max: number;
  icon: string;
  color: string;
  multiplier: number;
  cashback?: number;
  commissionDiscount?: number;
}

export const LOYALTY_TIERS: Record<LoyaltyTier, LoyaltyTierConfig> = {
  Bronze: { min: 0, max: 4999, icon: "🥉", color: "#cd7f32", multiplier: 1 },
  Silver: { min: 5000, max: 19999, icon: "🥈", color: "#C0C0C0", multiplier: 1.5 },
  Gold: { min: 20000, max: 49999, icon: "🥇", color: "#FFD700", multiplier: 2, cashback: 0.02 },
  Platinum: { min: 50000, max: 999999, icon: "💎", color: "#E5E4E2", multiplier: 3, cashback: 0.03, commissionDiscount: 0.01 },
};

export function getLoyaltyTier(points: number): LoyaltyTier {
  if (points >= 50000) return "Platinum";
  if (points >= 20000) return "Gold";
  if (points >= 5000) return "Silver";
  return "Bronze";
}

export function getNextTier(currentTier: LoyaltyTier): LoyaltyTier | null {
  const tiers: LoyaltyTier[] = ["Bronze", "Silver", "Gold", "Platinum"];
  const idx = tiers.indexOf(currentTier);
  return idx < tiers.length - 1 ? (tiers[idx + 1] ?? null) : null;
}
