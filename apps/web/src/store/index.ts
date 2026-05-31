import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem, Product, SupportedCurrency, UserRole } from "@ekda/shared";

// ─── Cart Store ───────────────────────────────────────────────────────────────

interface CartStore {
  items: CartItem[];
  currency: SupportedCurrency;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      currency: "NGN",
      addItem: (product, quantity = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.product.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.product.id === product.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity }] };
        }),
      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) })),
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.product.id !== productId)
              : state.items.map((i) =>
                  i.product.id === productId ? { ...i, quantity } : i
                ),
        })),
      clearCart: () => set({ items: [] }),
      getTotal: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      getItemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "ekda-cart" }
  )
);

// ─── AI Chat Store ───────────────────────────────────────────────────────────

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  products?: Partial<Product>[];
  suggestions?: string[];
}

interface AIChatStore {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  toggleChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export const useAIChatStore = create<AIChatStore>((set, get) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  clearMessages: () => set({ messages: [] }),
  sendMessage: async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    set((state) => ({
      messages: [...state.messages, userMessage],
      isLoading: true,
    }));

    try {
      const response = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          history: get().messages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
        products: data.products,
        suggestions: data.suggestions,
      };
      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isLoading: false,
      }));
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again shortly.",
        timestamp: new Date(),
      };
      set((state) => ({ messages: [...state.messages, errorMsg], isLoading: false }));
    }
  },
}));

// ─── Loyalty Store ────────────────────────────────────────────────────────────

export type LoyaltyTier = "bronze" | "silver" | "gold" | "platinum";

interface LoyaltyStore {
  points: number;
  tier: LoyaltyTier;
  referralCode: string;
  totalReferrals: number;
  addPoints: (amount: number) => void;
  redeemPoints: (amount: number) => void;
}

export const useLoyaltyStore = create<LoyaltyStore>()(
  persist(
    (set, get) => ({
      points: 2450,
      tier: "silver",
      referralCode: "EKDA-AO2024",
      totalReferrals: 7,
      addPoints: (amount) =>
        set((state) => {
          const newPoints = state.points + amount;
          const tier: LoyaltyTier =
            newPoints >= 50000
              ? "platinum"
              : newPoints >= 20000
              ? "gold"
              : newPoints >= 5000
              ? "silver"
              : "bronze";
          return { points: newPoints, tier };
        }),
      redeemPoints: (amount) =>
        set((state) => ({ points: Math.max(0, state.points - amount) })),
    }),
    { name: "ekda-loyalty" }
  )
);

// ─── User Preferences Store ───────────────────────────────────────────────────

interface PreferencesStore {
  language: string;
  currency: SupportedCurrency;
  darkMode: boolean;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  dietaryFilters: string[];
  priceAlerts: Array<{
    productId: string;
    targetPrice: number;
    currency: SupportedCurrency;
  }>;
  setLanguage: (lang: string) => void;
  setCurrency: (currency: SupportedCurrency) => void;
  toggleDarkMode: () => void;
  addPriceAlert: (productId: string, targetPrice: number, currency: SupportedCurrency) => void;
  removePriceAlert: (productId: string) => void;
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      language: "en",
      currency: "NGN",
      darkMode: false,
      notifications: { email: true, sms: true, push: true },
      dietaryFilters: [],
      priceAlerts: [],
      setLanguage: (lang) => set({ language: lang }),
      setCurrency: (currency) => set({ currency }),
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      addPriceAlert: (productId, targetPrice, currency) =>
        set((state) => ({
          priceAlerts: [
            ...state.priceAlerts.filter((a) => a.productId !== productId),
            { productId, targetPrice, currency },
          ],
        })),
      removePriceAlert: (productId) =>
        set((state) => ({
          priceAlerts: state.priceAlerts.filter((a) => a.productId !== productId),
        })),
    }),
    { name: "ekda-preferences" }
  )
);
