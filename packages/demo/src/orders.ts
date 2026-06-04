// ─── Mock Orders ──────────────────────────────────────────────────────────────

export interface DemoMilestone {
  label: string;
  done: boolean;
  time: string;
}

export interface DemoEscrowStage {
  label: string;
  amount: number;
  released: boolean;
}

export interface DemoOrder {
  id: string;
  product: string;
  vendor: string;
  customer: string;
  amount: number;
  status: "pending" | "payment_confirmed" | "processing" | "carrier_assigned" | "picked_up" | "in_transit" | "arrived_at_port" | "delivered" | "disputed";
  escrow: "held" | "partial_released" | "fully_released";
  cargo: "sea" | "air" | "road";
  carrier: string;
  /** 0–100 percent complete */
  progress: number;
  date: string;
  milestones: DemoMilestone[];
  escrowStages: DemoEscrowStage[];
}

export const MOCK_ORDERS: DemoOrder[] = [
  {
    id: "EKDA-MK3X2F",
    product: "Premium Dried Crayfish × 20kg",
    vendor: "Lagos Fresh Exports",
    customer: "Adaeze O. — London, UK",
    amount: 170000,
    status: "in_transit",
    escrow: "partial_released",
    cargo: "sea",
    carrier: "Maersk Line",
    progress: 55,
    date: "Jun 1, 2025",
    milestones: [
      { label: "Payment Confirmed", done: true, time: "Jun 1, 2:30 PM" },
      { label: "Order Processing", done: true, time: "Jun 2, 9:00 AM" },
      { label: "Carrier Assigned", done: true, time: "Jun 3, 10:00 AM" },
      { label: "Picked Up — 50% Released", done: true, time: "Jun 4, 4:00 PM" },
      { label: "In Transit (Atlantic)", done: true, time: "Jun 5, 8:00 AM" },
      { label: "Arrived Destination Port", done: false, time: "~Jun 28" },
      { label: "Delivered", done: false, time: "~Jul 1" },
    ],
    escrowStages: [
      { label: "EKDA Commission (10%)", amount: 17000, released: true },
      { label: "1st Release — Pickup", amount: 76500, released: true },
      { label: "2nd Release — Delivery", amount: 76500, released: false },
    ],
  },
  {
    id: "EKDA-BF2K8S",
    product: "Palm Oil × 50L",
    vendor: "Ogun Premium Oils",
    customer: "Emeka O. — Toronto, CA",
    amount: 340000,
    status: "picked_up",
    escrow: "partial_released",
    cargo: "sea",
    carrier: "MSC Cargo",
    progress: 40,
    date: "May 31, 2025",
    milestones: [
      { label: "Payment Confirmed", done: true, time: "May 31" },
      { label: "Processing", done: true, time: "Jun 1" },
      { label: "Carrier Assigned", done: true, time: "Jun 2" },
      { label: "Picked Up", done: true, time: "Jun 3" },
      { label: "In Transit", done: false, time: "Pending" },
      { label: "Delivered", done: false, time: "Pending" },
    ],
    escrowStages: [
      { label: "EKDA Commission (10%)", amount: 34000, released: true },
      { label: "1st Release — Pickup", amount: 153000, released: true },
      { label: "2nd Release — Delivery", amount: 153000, released: false },
    ],
  },
  {
    id: "EKDA-TY7N1A",
    product: "Garri Ijebu 100kg",
    vendor: "Southwest Farms",
    customer: "Tunde F. — Lagos",
    amount: 320000,
    status: "delivered",
    escrow: "fully_released",
    cargo: "road",
    carrier: "Local Logistics",
    progress: 100,
    date: "May 28, 2025",
    milestones: [
      { label: "Payment Confirmed", done: true, time: "May 28" },
      { label: "Processing", done: true, time: "May 28" },
      { label: "Picked Up", done: true, time: "May 29" },
      { label: "In Transit", done: true, time: "May 29" },
      { label: "Delivered", done: true, time: "May 30" },
    ],
    escrowStages: [
      { label: "EKDA Commission (10%)", amount: 32000, released: true },
      { label: "1st Release — Pickup", amount: 144000, released: true },
      { label: "2nd Release — Delivery", amount: 144000, released: true },
    ],
  },
];

// ─── Carriers ─────────────────────────────────────────────────────────────────

export interface DemoCarrier {
  id: string;
  name: string;
  logo: string;
  type: "Sea" | "Air" | "Road";
  days: number;
  rate: number;
  rating: number;
  tag: string | null;
  includesDuties: boolean;
}

export const DEMO_CARRIERS: DemoCarrier[] = [
  { id: "c1", name: "Maersk Line", logo: "🚢", type: "Sea", days: 28, rate: 35000, rating: 4.7, tag: "Best Value", includesDuties: false },
  { id: "c2", name: "DHL Express", logo: "✈️", type: "Air", days: 5, rate: 85000, rating: 4.9, tag: "Fastest", includesDuties: false },
  { id: "c3", name: "MSC Cargo", logo: "🛳️", type: "Sea", days: 32, rate: 28000, rating: 4.5, tag: null, includesDuties: false },
  { id: "c4", name: "FedEx International", logo: "📦", type: "Air", days: 4, rate: 120000, rating: 4.8, tag: "Door-to-Door", includesDuties: true },
];

// ─── Notifications ────────────────────────────────────────────────────────────

export interface DemoNotification {
  id: string;
  type: "escrow" | "order" | "ai" | "promo" | "kyc";
  emoji: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const MOCK_NOTIFICATIONS: DemoNotification[] = [
  {
    id: "n1",
    type: "escrow",
    emoji: "💰",
    title: "Escrow Released — ₦76,500",
    message: "Maersk Line confirmed pickup for EKDA-MK3X2F. First payment released to your wallet.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "n2",
    type: "order",
    emoji: "🚢",
    title: "Shipment In Transit",
    message: "Your order EKDA-MK3X2F is now in transit on vessel Maersk Enfield. ETA: June 28.",
    time: "6 hours ago",
    read: false,
  },
  {
    id: "n3",
    type: "ai",
    emoji: "🤖",
    title: "Price Alert: Garri dropped 12%",
    message: "Garri Ijebu prices have dropped to ₦2,800/kg. Good time to stock up!",
    time: "1 day ago",
    read: true,
  },
  {
    id: "n4",
    type: "promo",
    emoji: "🎁",
    title: "New Promo: DIASPORA10",
    message: "Use code DIASPORA10 for 10% off your next order. Valid until June 30.",
    time: "2 days ago",
    read: true,
  },
];
