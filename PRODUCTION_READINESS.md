# EKDA Ecommerce — Production Readiness Checklist

**Last updated:** June 4, 2026  
**Status:** Demo-ready · Awaiting backend wiring for production

---

## Current State

The platform is fully functional in **Demo Mode** — all UI flows work end-to-end with simulated data. Demo sessions now persist across page refreshes via `localStorage` (web) and `AsyncStorage` (mobile).

```
Demo Mode:  ✅ Fully functional, persistent sessions
Web Build:  ✅ 83 static pages, 0 TypeScript errors, 0 warnings
Mobile:     ✅ Standalone APK builds clean
Shared Pkgs: ✅ @ekda/demo · @ekda/validators · @ekda/ui · @ekda/shared
```

---

## 🔴 Hard Blockers (Must fix before real users)

### 1. Supabase Auth — No real authentication
**Impact:** Any non-demo user gets no session; protected routes are unguarded.

```bash
# Required environment variables:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...  # server-side only
```

**Fix steps:**
1. Create project at [supabase.com](https://supabase.com)
2. Run all 3 SQL migrations in order:
   - `packages/database/src/migrations/001_schema.sql`
   - `packages/database/src/migrations/002_kyc_consent_audit.sql`
   - `packages/database/src/migrations/003_admin_dashboard.sql`
3. Enable Google OAuth in Supabase Auth → Providers
4. Replace `apps/web/src/lib/supabase/client.ts` singleton with real lazy init
5. Wire `middleware.ts` `PROTECTED_ROUTES` array to actually redirect unauthenticated users

**Estimated effort:** 4–8 hours (Supabase RLS + session middleware)

---

### 2. Payment Gateways — All payments simulated
**Impact:** No real money can be processed.

```bash
# Required environment variables:
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
MONNIFY_API_KEY=MK_PROD_...
MONNIFY_CONTRACT_CODE=...
MONNIFY_BASE_URL=https://api.monnify.com
```

**Fix steps:**
1. Add live keys to Vercel environment variables
2. Replace simulation in `api/payments/route.ts` with real Paystack/Stripe SDK calls
3. Implement payment webhook handlers at `/api/payments/webhook/[gateway]/route.ts`
4. Wire webhook → escrow release trigger in `api/escrow/route.ts`

**Estimated effort:** 16–24 hours (3 gateways × webhook verification × escrow logic)

---

### 3. Escrow Release — Never actually transfers money
**Impact:** Vendors never receive payments.

**Fix steps:**
1. After `api/payments/webhook` confirms payment: create `escrow_accounts` row in Supabase
2. After carrier pickup confirmation: trigger `api/escrow` first-release via Paystack Transfer API
3. After destination arrival: trigger second-release
4. Add idempotency keys to prevent double-releases

---

## 🟡 Important (Launch quality — fix within first 2 weeks)

### 4. AI Services — Groq not connected
**Current behavior:** `/api/ai-chat` and `/api/hs-code` return simulated responses with `live_ai: false`.

```bash
# Add to environment:
GROQ_API_KEY=gsk_...  # Must start with "gsk_"
```

**Fix:** In `api/ai-chat/route.ts`, uncomment the Groq SDK call block (marked with `GROQ_AVAILABLE` flag). The fallback to `getAIChatResponse()` already handles the case where the key is missing — no crash.

---

### 5. Dashboard Data — All mock arrays
Every admin/vendor dashboard chart uses hardcoded demo data.

**Files to wire:**
```
src/app/dashboard/admin/page.tsx           → SELECT from orders, profiles
src/app/dashboard/admin/analytics/page.tsx → Aggregate queries
src/app/dashboard/vendor/page.tsx          → JOIN orders ON vendor_id
src/app/dashboard/admin/disputes/page.tsx  → disputes_extended table
src/app/dashboard/admin/kyc/page.tsx       → kyc_applications table
```

---

### 6. KYC Documents — Not uploaded to Supabase Storage
**Fix:**
```typescript
// In KYCForm.tsx handleDocumentUpload:
const { data } = await supabase.storage
  .from("kyc-documents")
  .upload(`${userId}/${docType}/${filename}`, file);
```

Create storage buckets: `kyc-documents`, `product-images`, `trade-documents`

---

### 7. Email/SMS Notifications — Not sent
**Fix:** Add to environment and wire:
```bash
RESEND_API_KEY=re_...          # Transactional email
TERMII_API_KEY=...              # SMS for Nigeria
TERMII_SENDER_ID=EKDA
```

---

## 🟢 Nice-to-Have (Post-launch improvements)

| Item | Effort | Description |
|------|--------|-------------|
| Upstash Rate Limiter | 2h | Replace in-memory rate limiter with `@upstash/ratelimit` |
| PWA Icons | 1h | Generate real icons for `/public/icons/` |
| i18n Completion | 8h | Add Yoruba, Igbo, Hausa, French to `@ekda/ui` dictionaries |
| PostHog Analytics | 2h | Uncomment and initialize in `src/lib/analytics/index.ts` |
| Sentry Error Tracking | 2h | Run `sentry-wizard` and wire DSN |
| Mobile Offline Mode | 16h | Add WatermelonDB or Supabase offline sync |
| AR Vehicle Preview | 40h | Viro React or AR.js for import vehicles |
| Real-Time Feed | 4h | Wire Supabase Realtime to admin activity feed |

---

## Environment Variables — Complete Reference

### Required for Demo Mode Only

```env
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=EKDA Marketplace (Demo)
GROQ_API_KEY=demo_placeholder_key
PAYSTACK_SECRET_KEY=demo_placeholder
STRIPE_SECRET_KEY=demo_placeholder
NODE_ENV=development
```

### Required for Production

```env
# Auth
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...

# Payments
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
MONNIFY_API_KEY=MK_PROD_...
MONNIFY_CONTRACT_CODE=...
MONNIFY_BASE_URL=https://api.monnify.com

# AI
GROQ_API_KEY=gsk_...  # Must start with "gsk_" to enable live AI

# Communications
RESEND_API_KEY=re_...
TERMII_API_KEY=...
TERMII_SENDER_ID=EKDA

# Analytics (optional but recommended)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# App
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_APP_URL=https://ekda.io
NEXT_PUBLIC_APP_NAME=EKDA Marketplace
NODE_ENV=production
```

---

## Deployment Checklist

### Web (Vercel)

```bash
# 1. Connect GitHub repo to Vercel
# 2. Set root directory: apps/web
# 3. Add all production env vars in Vercel dashboard
# 4. Deploy:
vercel --prod

# Verify:
curl https://your-deploy.vercel.app/api/health
# → { "status": "ok", "services": { "database": "available", ... } }
```

### Mobile (EAS Build)

```bash
cd apps/mobile

# 1. Login to Expo
eas login

# 2. Configure (one-time)
eas build:configure

# 3. Preview APK (for testing)
eas build --platform android --profile preview

# 4. Production AAB (for Play Store)
eas build --platform android --profile production

# 5. iOS (requires Apple Developer account)
eas build --platform ios --profile production
```

### Database (Supabase)

```sql
-- Run in Supabase SQL editor, in order:
-- 1. packages/database/src/migrations/001_schema.sql
-- 2. packages/database/src/migrations/002_kyc_consent_audit.sql
-- 3. packages/database/src/migrations/003_admin_dashboard.sql
```

---

## Demo Mode Features (Fully Working)

| Feature | Status | Notes |
|---------|--------|-------|
| Login/Logout | ✅ Persistent | localStorage (web), AsyncStorage (mobile) |
| Role-based dashboard | ✅ Working | Redirects to correct dashboard |
| Product catalog (Export) | ✅ 8 products | From @ekda/demo |
| Product catalog (Import) | ✅ 6 products | From @ekda/demo |
| Cart + Checkout flow | ✅ Full 4-step | Simulated payment |
| AI Chat | ✅ Keyword matching | Shows "Demo AI Mode" badge |
| HS Code classifier | ✅ 8 examples | Groq fallback active |
| KYC form (5 steps) | ✅ Full wizard | AI score simulation |
| Admin KYC queue | ✅ Sample data | Approve/Reject/More Info |
| Escrow demo | ✅ Animated | /escrow-demo page |
| Order tracking | ✅ Sample orders | Full milestone timeline |
| Loyalty program | ✅ Silver tier | 2,450 demo points |
| Admin Command Center | ✅ Charts + feed | Mock data |
| B2B Portal + RFQ | ✅ Form submits | Mock confirmation |
| Blog (3 articles) | ✅ SEO-ready | Static HTML |
| Help Center + FAQ | ✅ Searchable | Support ticket form |

---

## Architecture Summary

```
apps/web           → Next.js 15 (83 routes, Tailwind, Framer Motion)
apps/mobile        → Expo Router (6 tabs, React Native)
apps/standalone    → Offline-only Expo (crashless APK demo)

packages/shared    → Types, utils, constants
packages/demo      → Mock data, auth, chat responses  ← New
packages/validators → Form validation                 ← New
packages/ui        → Empty states, tokens, notifs     ← New
packages/database  → Supabase client + types
packages/config    → TypeScript configs
```

---

*Prepared by EKDA AI Engineering · June 4, 2026*
