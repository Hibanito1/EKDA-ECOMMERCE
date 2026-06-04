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

---

## Pre-Launch Validation Results (June 4, 2026)

All 21 automated tests passed. Summary:

| Test | Result |
|------|--------|
| Homepage loads (HTTP 200) | ✅ |
| Demo login — all 5 roles | ✅ Customer, Vendor, Carrier, Enterprise, Admin |
| Wrong credentials rejected | ✅ |
| Session persistence (TTL 24h, version check, expiry) | ✅ |
| Role → redirect path mapping | ✅ customer=/customer, admin=/admin, etc. |
| AI Chat GROQ fallback (no key) | ✅ live_ai: false, model: ekda-demo-classifier |
| HS Code — crayfish (0306.17) | ✅ |
| HS Code — vehicle air restriction | ✅ restricted_air_cargo: true |
| Form validators (email, password, login) | ✅ 9/9 cases |
| 20 routes return 200 | ✅ All routes healthy |
| Health API | ✅ status: ok |
| Escrow calculation 50/50 | ✅ ₦176,850 vendor share splits equally |
| Dashboard role-matching | ✅ All 4 roles render correct page |
| Blog articles (3) | ✅ All SSG |
| Security headers (X-Frame, X-Content-Type, Referrer) | ✅ |
| Rate limiting (20 req/min) | ✅ 429 triggered |
| Product data in JS bundle | ✅ Found in main-app.js + 3 server chunks |
| Turbo build clean | ✅ EXIT 0, 83 pages, 0 errors |

---

## Additional Pre-Launch Items (Discovered Jun 4)

### Security

#### CSP (Content Security Policy)
Currently only applied in production env (`NODE_ENV=production`). Verify `middleware.ts` CSP string allows all Supabase, Paystack, Stripe domains before go-live.

```typescript
// In apps/web/src/middleware.ts, check these hostnames in connect-src:
// https://*.supabase.co, https://api.paystack.co, https://api.stripe.com
```

#### Supabase Session Cookies
When wiring real Supabase Auth, ensure the `@supabase/auth-helpers-nextjs` library sets `httpOnly` cookies via the server component client. Avoids XSS token theft.

```typescript
// apps/web/src/lib/supabase/server.ts
// createServerComponentClient sets httpOnly cookies automatically ✅
```

### Infrastructure

#### CI/CD Pipeline
No GitHub Actions workflow exists. Add for automated testing on every PR:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22 }
      - run: npm install --legacy-peer-deps
      - run: cd apps/web && npm run build
      - run: cd apps/web && npm test
```

#### Database Backups
Supabase Pro tier includes daily backups. For free tier, schedule a weekly manual dump:
```bash
supabase db dump -f backup_$(date +%Y%m%d).sql
```

#### EAS Project ID
The `eas.json` references `"projectId": "ekda-marketplace-app"` — this needs to be replaced with the actual Expo project ID after running `eas build:configure`.

### App Store Preparation

#### iOS App Store
- Requires Apple Developer account ($99/year)
- TestFlight for beta distribution
- Review time: 1–3 days
- Run: `eas build --platform ios --profile production`

#### Google Play Store  
- Requires Google Play developer account ($25 one-time)
- Internal testing track for testers
- Review time: 1–7 days  
- Run: `eas build --platform android --profile production` (generates AAB)

### Performance

#### Bundle Analysis
Run Lighthouse before launch:
```bash
npx @lhci/cli autorun --collect.url=https://your-vercel-url.vercel.app
```
Target scores: Performance >80, Accessibility >90, SEO >95

#### Image Optimization
All product images currently use `images.unsplash.com`. Before launch:
1. Upload real product photos to Supabase Storage
2. Update `next.config.js` `remotePatterns` with Supabase bucket URL

### Compliance

#### GDPR/NDPR Live Data Flow
The consent banner records to `consent_records` table (wired in `api/consent/route.ts`). Verify in production:
- `POST /api/consent` actually writes to Supabase
- `DELETE /api/consent` records withdrawal
- Users can trigger data export from account settings

#### Crypto Payment Compliance
USDT/USDC crypto payments (`components/payments/PaymentInnovations.tsx`) require:
- FINTRAC/CBN licensing check for Nigeria
- KYC on crypto wallet addresses
- Confirm with legal team before enabling in production

### Monitoring

#### Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```
Set: `SENTRY_DSN`, `NEXT_PUBLIC_SENTRY_DSN`

#### PostHog (Analytics)
```bash
npm install posthog-js
```
Uncomment initialization in `apps/web/src/lib/analytics/index.ts`
Set: `NEXT_PUBLIC_POSTHOG_KEY`

---

## Demo Testing Links

Once deployed, share these with testers:

```
Web App:    https://your-deploy.vercel.app
APK (v2):   https://github.com/Hibanito1/EKDA-ECOMMERCE/raw/cursor/health-check-fixes-1c4a/ekda-demo-v2.apk

Demo accounts (all use Demo@12345):
  Customer:   demo.customer@ekda.io  → /dashboard/customer
  Vendor:     demo.vendor@ekda.io    → /dashboard/vendor
  Carrier:    demo.carrier@ekda.io   → /dashboard/carrier
  Admin:      demo.admin@ekda.io     → /dashboard/admin

Key flows to test:
  1. Login → refresh page → still logged in (persistent session)
  2. Browse /marketplace/export → add to cart → checkout
  3. AI Chat → ask about crayfish (shows Demo AI Mode badge)
  4. /onboarding/kyc?role=vendor → complete 5 steps
  5. /escrow-demo → watch animated escrow simulation
  6. /dashboard/admin/kyc → approve/reject sample application
  7. /dashboard/vendor/hs-codes → classify a product
  8. /b2b → submit RFQ form
```
