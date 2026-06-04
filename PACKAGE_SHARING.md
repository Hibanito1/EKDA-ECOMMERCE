# EKDA Shared Package Architecture

This document explains the Turborepo shared package strategy so changes in one place automatically benefit both web and mobile.

---

## Package Map

```
packages/
├── shared/        @ekda/shared     — Types, constants, pure utils (existing, enhanced)
├── demo/          @ekda/demo       — Demo fixtures, mock data, auth (new)
├── validators/    @ekda/validators — Form validators, business rules (new)
├── ui/            @ekda/ui         — Cross-platform UI logic: copy, tokens, notification config (new)
├── database/      @ekda/database   — Supabase client + generated types (existing)
└── config/        @ekda/config     — Shared TypeScript configs (existing)
```

---

## What Each Package Exports

### `@ekda/shared` — Core Business Logic
```ts
import { formatCurrency, calculateOrderBreakdown, getCargoRecommendation } from "@ekda/shared";
import { EKDA_COMMISSION_RATE, PRODUCT_CATEGORIES, NIGERIAN_SEAPORTS } from "@ekda/shared";
import type { UserRole, Product, Order, EscrowAccount } from "@ekda/shared";
```

### `@ekda/demo` — Demo Fixtures (Single Source of Truth)
```ts
// Users & Auth
import { DEMO_USERS, DEMO_CREDENTIALS, validateDemoCredentials, isDemoUser } from "@ekda/demo";
import { getDemoUserByEmail, getDemoRedirectPath } from "@ekda/demo";

// Products
import { EXPORT_PRODUCTS, IMPORT_PRODUCTS, FEATURED_PRODUCTS, ALL_PRODUCTS } from "@ekda/demo";
import type { DemoProduct } from "@ekda/demo";

// Orders
import { MOCK_ORDERS, DEMO_CARRIERS, MOCK_NOTIFICATIONS } from "@ekda/demo";

// AI Chat (identical on web and mobile)
import { CHAT_RESPONSES, HS_CODE_EXAMPLES, getAIChatResponse, classifyHSCode } from "@ekda/demo";
import type { ChatResponse, HSCodeExample } from "@ekda/demo";

// Escrow & Loyalty
import { LOYALTY_TIERS, getLoyaltyTier, createDemoEscrow, ESCROW_DEMO_STEPS } from "@ekda/demo";

// Config
import { DEMO_BANNER, DEMO_PAYMENT_RESPONSES } from "@ekda/demo";
```

### `@ekda/validators` — Form Validation
```ts
import { email, password, nigerianPhone, hsCode } from "@ekda/validators";
import { validateLogin, validateRegister, validateProduct, validateKYCPersonal } from "@ekda/validators";
import { hasErrors } from "@ekda/validators";
```

### `@ekda/ui` — Cross-Platform UI Logic
```ts
// Copy strings (same text on web and mobile)
import { EMPTY_STATES } from "@ekda/ui";
import type { EmptyStateCopy, EmptyStateKey } from "@ekda/ui";

// Design tokens (use in RN StyleSheet.create() or Tailwind theme)
import { colors, typography, spacing, radius, shadows, toastConfig } from "@ekda/ui";

// Notification config (icons excluded — each platform provides its own)
import { NOTIFICATION_CHANNELS, NOTIFICATION_CATEGORIES, buildDefaultPreferences } from "@ekda/ui";
import { countEnabledEvents, setAllInCategory } from "@ekda/ui";
```

---

## Verified Import Map (After Audit Jun 4, 2026)

### `apps/web` imports

| File | Imports from |
|------|-------------|
| `lib/demo/index.ts` | Re-exports all `@ekda/demo` + web env flag |
| `lib/validation/index.ts` | Re-exports all `@ekda/validators` + ARIA helpers |
| `components/ui/states.tsx` | `EMPTY_STATES`, `toastConfig` from `@ekda/ui` |
| `components/notifications/NotificationPreferences.tsx` | `NOTIFICATION_CHANNELS`, `NOTIFICATION_CATEGORIES`, `buildDefaultPreferences` from `@ekda/ui` |
| `components/demo/DemoBanner.tsx` | `DEMO_USERS`, `DEMO_BANNER` from `@ekda/demo` |
| `api/demo/login/route.ts` | `validateDemoCredentials`, `DEMO_CREDENTIALS`, `getDemoRedirectPath` from `@ekda/demo` |
| `api/ai-chat/route.ts` | `getAIChatResponse`, `EXPORT_PRODUCTS` from `@ekda/demo` |
| `marketplace/export/page.tsx` | `EXPORT_PRODUCTS` from `@ekda/demo` |
| `marketplace/import/page.tsx` | `IMPORT_PRODUCTS` from `@ekda/demo` |
| `auth/login/page.tsx` | via `@/lib/demo` re-export |

### `apps/mobile` imports

| File | Imports from |
|------|-------------|
| `(auth)/login.tsx` | `validateDemoCredentials` from `@ekda/demo`, `validateLogin` from `@ekda/validators` |
| `(tabs)/index.tsx` | `PRODUCT_CATEGORIES`, `formatCurrency` from `@ekda/shared`; `FEATURED_PRODUCTS`, `MOCK_ORDERS` from `@ekda/demo`; `EMPTY_STATES` from `@ekda/ui` |
| `(tabs)/export.tsx` | `EXPORT_PRODUCTS` from `@ekda/demo`, `formatCurrency` from `@ekda/shared` |
| `(tabs)/import.tsx` | `IMPORT_PRODUCTS` from `@ekda/demo`, `formatCurrency` from `@ekda/shared` |
| `(tabs)/cart.tsx` | `EXPORT_PRODUCTS` from `@ekda/demo`; `calculateOrderBreakdown`, `EKDA_COMMISSION_RATE`, `formatCurrency` from `@ekda/shared`; `EMPTY_STATES` from `@ekda/ui` |
| `(tabs)/ai-chat.tsx` | `CHAT_RESPONSES`, `getAIChatResponse` from `@ekda/demo` |
| `(tabs)/account.tsx` | `MOCK_ORDERS`, `MOCK_NOTIFICATIONS`, `LOYALTY_TIERS`, `getLoyaltyTier` from `@ekda/demo`; `formatCurrency` from `@ekda/shared` |

---

## How Changes Propagate

### Update a product price → both apps see it

```
# Edit packages/demo/src/products.ts
EXPORT_PRODUCTS[0].price = 9200   ← change here

# Rebuild (Turbo handles dependency graph)
npm run build

# Verified in web bundle:
grep "9200" apps/web/.next/static/chunks/*.js   ← ✅ found

# Mobile picks it up on next metro bundler run:
cd apps/mobile && npm start   ← product price updated automatically
```

**Test was performed on Jun 4, 2026:**
- Changed `EXPORT_PRODUCTS[0].price` from `8500` → `9200`
- `npm run build` in `apps/web` confirmed `9200` in compiled bundle
- Reverted to `8500` after verification

### Update AI chat responses → both apps in sync

```
# Edit packages/demo/src/chat.ts
CHAT_RESPONSES.crayfish.text = "Updated response..."

# Both apps use getAIChatResponse() from the same package
# Web: api/ai-chat/route.ts → getAIChatResponse()
# Mobile: app/(tabs)/ai-chat.tsx → getAIChatResponse()
```

### Add a new empty state copy → same text everywhere

```
# Edit packages/ui/src/copy/empty-states.ts
export const EMPTY_STATES = {
  ...existing,
  new_state: {
    emoji: "🆕",
    title: "New State Title",
    description: "Description goes here",
  }
};

# Web uses it in Tailwind+Framer Motion components
# Mobile uses it in RN StyleSheet components
# Both show identical copy
```

---

## Demo Mode Consistency: Web vs Mobile

| Feature | Web | Mobile | Source |
|---------|-----|--------|--------|
| Demo credentials | `DemoBanner.tsx` shows credentials | `login.tsx` populates form | `@ekda/demo` `DEMO_USERS` |
| Login validation | `validateDemoCredentials()` in API | `validateDemoCredentials()` in login screen | `@ekda/demo` |
| Redirect after login | `getDemoRedirectPath()` | `getDemoRedirectPath()` | `@ekda/demo` |
| Product listings | `EXPORT_PRODUCTS` / `IMPORT_PRODUCTS` | Same | `@ekda/demo` |
| Cart calculations | `calculateOrderBreakdown()` | Same | `@ekda/shared` |
| AI chat responses | `getAIChatResponse()` | Same | `@ekda/demo` |
| HS code examples | `classifyHSCode()` | Same | `@ekda/demo` |
| Empty state copy | `EMPTY_STATES.cart.title` | Same | `@ekda/ui` |
| Loyalty tiers | `LOYALTY_TIERS` | Same | `@ekda/demo` |
| Escrow demo steps | `ESCROW_DEMO_STEPS` | (not yet wired) | `@ekda/demo` |

---

## Platform Boundary

These are intentionally **NOT** shared (each platform implements locally):

| Asset | Web | Mobile | Why separate |
|-------|-----|--------|-------------|
| UI components | Tailwind + Framer Motion | RN StyleSheet | Different rendering |
| Icons | `lucide-react` | `@expo/vector-icons` | Different icon libs |
| Navigation | Next.js App Router | Expo Router | Different nav systems |
| Toasts | `react-hot-toast` | Alert/custom | Different APIs |
| Animations | Framer Motion | Reanimated | Different engines |
| ARIA helpers | `lib/validation` (web) | Not applicable | DOM-only |
| ConsentBanner | Web-only component | Not needed | Web regulation only |
| DemoBanner | `DemoBanner.tsx` | Inline banner in `index.tsx` | Platform styling differs |

**Rule: Share logic, constants, and copy. Implement UI per platform.**

---

## Step-by-Step: Adding a New Shared Feature

### Example: Add "Trending Products" section

```bash
# 1. Add to @ekda/demo
cat >> packages/demo/src/products.ts << 'EOF'
export const TRENDING_PRODUCTS = [
  EXPORT_PRODUCTS[2]!, // Garri
  EXPORT_PRODUCTS[4]!, // Egusi
  IMPORT_PRODUCTS[1]!, // iPhone
];
EOF

# 2. Export from package index
echo 'export { TRENDING_PRODUCTS } from "./products";' >> packages/demo/src/index.ts

# 3. Use in web
# apps/web/src/app/(site)/page.tsx:
# import { TRENDING_PRODUCTS } from "@ekda/demo";

# 4. Use in mobile
# apps/mobile/app/(tabs)/index.tsx:
# import { TRENDING_PRODUCTS } from "@ekda/demo";

# 5. Rebuild both
npm run build
```

---

## Quick Reference: Where Is X?

| You want... | Import from |
|-------------|-------------|
| `formatCurrency()` | `@ekda/shared` |
| `calculateOrderBreakdown()` | `@ekda/shared` |
| `EKDA_COMMISSION_RATE` | `@ekda/shared` |
| `UserRole`, `Product` types | `@ekda/shared` |
| Demo product data (export) | `@ekda/demo` → `EXPORT_PRODUCTS` |
| Demo product data (import) | `@ekda/demo` → `IMPORT_PRODUCTS` |
| Demo user credentials | `@ekda/demo` → `DEMO_USERS`, `DEMO_CREDENTIALS` |
| Demo login validation | `@ekda/demo` → `validateDemoCredentials()` |
| AI chat responses | `@ekda/demo` → `getAIChatResponse()` |
| HS code classifier | `@ekda/demo` → `classifyHSCode()` |
| Mock orders | `@ekda/demo` → `MOCK_ORDERS` |
| Loyalty tiers | `@ekda/demo` → `LOYALTY_TIERS`, `getLoyaltyTier()` |
| Escrow demo animation | `@ekda/demo` → `ESCROW_DEMO_STEPS` |
| `email()` validator | `@ekda/validators` |
| `validateLogin()` | `@ekda/validators` |
| `validateProduct()` | `@ekda/validators` |
| Empty state text | `@ekda/ui` → `EMPTY_STATES` |
| Brand colors (RN-safe) | `@ekda/ui` → `colors` |
| Notification categories | `@ekda/ui` → `NOTIFICATION_CATEGORIES` |
| Supabase client | `@ekda/database` |

---

## Duplication Eliminated (Before → After)

| Before | After |
|--------|-------|
| `DEMO_USERS` in 3 files | `@ekda/demo` → 1 source |
| `EXPORT_PRODUCTS` in 5 files | `@ekda/demo` → 1 source |
| Chat responses in 3 files | `@ekda/demo` → `getAIChatResponse()` |
| Commission math `* 0.1` in 2 files | `@ekda/shared` `EKDA_COMMISSION_RATE` |
| `formatCurrency` inline in 3 mobile files | `@ekda/shared` |
| `LOYALTY_TIERS` in 2 files | `@ekda/demo` |
| Notification categories in 1 file (unused on mobile) | `@ekda/ui` → both platforms |
| Empty state copy (unused on mobile) | `@ekda/ui` → both platforms |
| Validators unused in forms | `@ekda/validators` → wired into login |
| 570-line `standalone/mockData.js` | Re-exports from `@ekda/demo` |
