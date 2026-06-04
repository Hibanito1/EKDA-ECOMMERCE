# EKDA Shared Package Architecture

This document explains the Turborepo shared package strategy so that a change in one app automatically benefits the other.

---

## Package Map

```
packages/
├── shared/        @ekda/shared    — Types, constants, pure utils (EXISTING, enhanced)
├── demo/          @ekda/demo      — Demo fixtures, mock data, demo auth (NEW)
├── validators/    @ekda/validators — Form validators, business rules (NEW)
├── ui/            @ekda/ui        — Cross-platform UI logic: copy, tokens, notification config (NEW)
├── database/      @ekda/database  — Supabase client + generated types (EXISTING)
└── config/        @ekda/config    — Shared TypeScript configs (EXISTING)
```

---

## What Each Package Exports

### `@ekda/shared` — Business Logic
```ts
import { formatCurrency, calculateOrderBreakdown } from "@ekda/shared";
import { EKDA_COMMISSION_RATE, PRODUCT_CATEGORIES, NIGERIAN_SEAPORTS } from "@ekda/shared";
import type { UserRole, Product, Order, EscrowAccount } from "@ekda/shared";
```

### `@ekda/demo` — Demo Fixtures
```ts
import { DEMO_USERS, DEMO_CREDENTIALS, validateDemoCredentials } from "@ekda/demo";
import { EXPORT_PRODUCTS, IMPORT_PRODUCTS, FEATURED_PRODUCTS } from "@ekda/demo";
import { MOCK_ORDERS, DEMO_CARRIERS, MOCK_NOTIFICATIONS } from "@ekda/demo";
import { CHAT_RESPONSES, HS_CODE_EXAMPLES, getAIChatResponse, classifyHSCode } from "@ekda/demo";
import { LOYALTY_TIERS, getLoyaltyTier, createDemoEscrow, ESCROW_DEMO_STEPS } from "@ekda/demo";
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

// Design tokens (use in RN StyleSheet.create() or Tailwind theme sync)
import { colors, typography, spacing, radius, shadows, toastConfig } from "@ekda/ui";

// Notification config (no icons — each platform provides its own)
import { NOTIFICATION_CHANNELS, NOTIFICATION_CATEGORIES, buildDefaultPreferences } from "@ekda/ui";
```

---

## How Changes Propagate

### Update demo product data → affects both apps instantly

```
packages/demo/src/products.ts   ← Edit here
         ↓
apps/web (marketplace pages)    ← Sees change on next `npm run dev`
apps/mobile (export/import tabs) ← Sees change on next `npm start`
apps/standalone (offline app)   ← Sees change via mockData.js re-export
```

### Update empty state copy → web and mobile in sync

```
packages/ui/src/copy/empty-states.ts  ← Edit the text here
         ↓
apps/web/src/components/ui/states.tsx  ← Imports EMPTY_STATES, renders with Tailwind
apps/mobile/app/(tabs)/*.tsx           ← Imports EMPTY_STATES, renders with StyleSheet
```

### Add a new form validator → available everywhere

```
packages/validators/src/forms.ts   ← Add validateKYCBankInfo()
         ↓
apps/web/src/app/onboarding/kyc/   ← import { validateKYCBankInfo } from "@ekda/validators"
apps/mobile/app/(auth)/register    ← import { validateKYCBankInfo } from "@ekda/validators"
```

---

## Platform Boundary

These things are intentionally **NOT** shared (each platform implements locally):

| Thing | Web implementation | Mobile implementation |
|-------|-------------------|----------------------|
| UI components | Tailwind + Framer Motion | React Native StyleSheet |
| Icons | `lucide-react` | `@expo/vector-icons` |
| Navigation | Next.js App Router | Expo Router |
| Toasts | `react-hot-toast` | Alert / custom RN component |
| Animations | Framer Motion | Reanimated / Animated |
| ARIA helpers | `lib/validation` (web-only) | Not applicable |
| ConsentBanner | Web-only (Radix + Framer) | Not applicable |
| DemoBanner | Web-only (`DemoBanner.tsx`) | Not applicable |
| Supabase client | `lib/supabase/client.ts` | Separate RN client |

The rule: **logic → shared**, **presentation → per-platform**.

---

## Demo Mode Consistency Checklist

Both apps pull from the same source:

| Feature | Source | Web | Mobile |
|---------|--------|-----|--------|
| Demo user emails/passwords | `@ekda/demo` → `users.ts` | `DemoBanner.tsx` | `login.tsx` |
| Product listings | `@ekda/demo` → `products.ts` | marketplace pages | export/import tabs |
| AI chat responses | `@ekda/demo` → `chat.ts` | `api/ai-chat/route.ts` | `ai-chat.tsx` |
| HS code examples | `@ekda/demo` → `chat.ts` | `dashboard/vendor/hs-codes` | `ai-chat.tsx` |
| Mock orders | `@ekda/demo` → `orders.ts` | dashboard/track | account.tsx |
| Escrow demo steps | `@ekda/demo` → `escrow.ts` | `/escrow-demo` page | (not yet wired) |
| Loyalty tiers | `@ekda/demo` → `escrow.ts` | loyalty dashboard | account.tsx |

---

## Adding a New Shared Feature (Step-by-Step)

1. **Create** the logic in the right package:
   ```bash
   # Example: add price alert logic
   echo 'export function ...' >> packages/demo/src/alerts.ts
   # Export from index
   echo 'export * from "./alerts";' >> packages/demo/src/index.ts
   ```

2. **Import** in web:
   ```ts
   // apps/web/src/components/ai/PriceIntelligence.tsx
   import { createPriceAlert } from "@ekda/demo";
   ```

3. **Import** in mobile:
   ```ts
   // apps/mobile/app/(tabs)/account.tsx
   import { createPriceAlert } from "@ekda/demo";
   ```

4. **Rebuild** both apps:
   ```bash
   npm run build   # Turbo rebuilds all changed packages + apps
   ```

---

## Quick Reference: Where Is X?

| You want... | Import from |
|-------------|-------------|
| `formatCurrency()` | `@ekda/shared` |
| `calculateOrderBreakdown()` | `@ekda/shared` |
| `EKDA_COMMISSION_RATE` | `@ekda/shared` |
| `UserRole` type | `@ekda/shared` |
| Demo product data | `@ekda/demo` |
| Demo user credentials | `@ekda/demo` |
| AI chat responses | `@ekda/demo` |
| HS code examples | `@ekda/demo` |
| Mock orders | `@ekda/demo` |
| Loyalty tiers | `@ekda/demo` |
| `email()` validator | `@ekda/validators` |
| `validateLogin()` | `@ekda/validators` |
| `validateProduct()` | `@ekda/validators` |
| Empty state copy | `@ekda/ui` |
| Design tokens (colors, spacing) | `@ekda/ui` |
| Notification categories | `@ekda/ui` |
| Supabase client | `@ekda/database` |
