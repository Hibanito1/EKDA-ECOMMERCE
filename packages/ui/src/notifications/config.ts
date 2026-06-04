/**
 * @ekda/ui — Notification Configuration
 *
 * Channel and category definitions shared between web and mobile.
 * Icons are intentionally excluded — each platform supplies its own.
 * (Web uses lucide-react, Mobile uses @expo/vector-icons)
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NotificationChannel {
  id: string;
  label: string;
  description: string;
  /** Icon name hint — resolved per-platform */
  iconName: string;
}

export interface NotificationEvent {
  id: string;
  label: string;
  /** If true, shown as "Critical" — cannot be disabled on some platforms */
  important?: boolean;
}

export interface NotificationCategory {
  id: string;
  label: string;
  description: string;
  /** Icon name hint for the category header */
  iconName: string;
  events: NotificationEvent[];
}

export type NotificationPreferences = Record<string, Record<string, boolean>>;

// ─── Channels ─────────────────────────────────────────────────────────────────

export const NOTIFICATION_CHANNELS: NotificationChannel[] = [
  { id: "push", label: "Push Notification", description: "Browser and mobile app alerts", iconName: "smartphone" },
  { id: "email", label: "Email", description: "Sent to your registered email", iconName: "mail" },
  { id: "sms", label: "SMS", description: "Text messages to your phone", iconName: "message-square" },
  { id: "in_app", label: "In-App", description: "Alerts inside the EKDA app", iconName: "bell" },
];

// ─── Categories & Events ──────────────────────────────────────────────────────

export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
  {
    id: "orders",
    label: "Orders & Tracking",
    description: "Order confirmations, status updates, and delivery alerts",
    iconName: "shopping-cart",
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
    description: "Escrow releases, payouts, and payment alerts",
    iconName: "shield",
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
    description: "Verification status and account security alerts",
    iconName: "check-circle",
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
    description: "Dispute updates and support ticket notifications",
    iconName: "alert-circle",
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
    description: "Deals, loyalty rewards, and platform news",
    iconName: "tag",
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
    description: "Smart product recommendations and insights",
    iconName: "zap",
    events: [
      { id: "ai_recommendation", label: "Personalized product picks" },
      { id: "demand_forecast", label: "Stock replenishment reminders (vendors)" },
      { id: "price_prediction", label: "Commodity price predictions" },
    ],
  },
];

// ─── Default Preferences ──────────────────────────────────────────────────────

/** Build default preferences — important events ON, others OFF */
export function buildDefaultPreferences(): NotificationPreferences {
  const prefs: NotificationPreferences = {};
  NOTIFICATION_CATEGORIES.forEach((cat) => {
    prefs[cat.id] = {};
    cat.events.forEach((event) => {
      prefs[cat.id]![event.id] = event.important === true;
    });
  });
  return prefs;
}

/** Count how many events are enabled across all categories */
export function countEnabledEvents(prefs: NotificationPreferences): number {
  return Object.values(prefs).reduce((total, catPrefs) => {
    return total + Object.values(catPrefs).filter(Boolean).length;
  }, 0);
}

/** Enable/disable all events in a category */
export function setAllInCategory(
  prefs: NotificationPreferences,
  categoryId: string,
  enabled: boolean
): NotificationPreferences {
  const cat = NOTIFICATION_CATEGORIES.find((c) => c.id === categoryId);
  if (!cat) return prefs;
  const updated: Record<string, boolean> = {};
  cat.events.forEach((e) => { updated[e.id] = enabled; });
  return { ...prefs, [categoryId]: updated };
}
