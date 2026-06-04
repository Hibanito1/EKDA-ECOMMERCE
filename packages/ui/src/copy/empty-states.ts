/**
 * @ekda/ui — Empty State Copy
 *
 * Platform-agnostic text content for empty states.
 * Web uses these with Framer Motion + Tailwind components.
 * Mobile uses them with React Native StyleSheet components.
 * Both can show the same copy from a single source.
 */

export interface EmptyStateCopy {
  emoji: string;
  title: string;
  description: string;
}

export const EMPTY_STATES = {
  cart: {
    emoji: "🛒",
    title: "Your cart is empty",
    description: "Discover authentic African products or import quality goods from around the world.",
  },
  orders: {
    emoji: "📦",
    title: "No orders yet",
    description: "Your order history will appear here once you place your first order.",
  },
  products: {
    emoji: "🔍",
    title: "No products found",
    description: "Try adjusting your search or filter criteria to find what you're looking for.",
  },
  disputes: {
    emoji: "✅",
    title: "No open disputes",
    description: "All disputes have been resolved. Great job keeping your transactions smooth!",
  },
  notifications: {
    emoji: "🔔",
    title: "All caught up!",
    description: "You have no new notifications. We'll let you know when something important happens.",
  },
  vendors: {
    emoji: "🏪",
    title: "No vendors found",
    description: "No vendors match your current search criteria.",
  },
  wishlist: {
    emoji: "❤️",
    title: "Your wishlist is empty",
    description: "Save products you love to your wishlist for easy access later.",
  },
  kyc_queue: {
    emoji: "✅",
    title: "KYC queue is clear",
    description: "All applications have been reviewed. Check back when new submissions arrive.",
  },
  carrier_jobs: {
    emoji: "📋",
    title: "No jobs available",
    description: "There are no shipment jobs available right now. Check back soon.",
  },
  search: {
    emoji: "🔍",
    title: "No results",
    description: "We couldn't find anything matching your search. Try different keywords.",
  },
  offline: {
    emoji: "📡",
    title: "You're offline",
    description: "Check your internet connection. Saved data is still accessible.",
  },
  coming_soon: {
    emoji: "🚧",
    title: "Coming Soon",
    description: "This section is under development. Connect the real backend to activate it.",
  },
} as const satisfies Record<string, EmptyStateCopy>;

export type EmptyStateKey = keyof typeof EMPTY_STATES;
