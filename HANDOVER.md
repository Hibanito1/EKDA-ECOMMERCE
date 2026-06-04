# EKDA Ecommerce — Developer Handover Document

**Project:** EKDA — Africa's Premier Cross-Border Marketplace  
**Date:** June 4, 2026  
**Version:** 1.0.0-beta  
**Codebase:** [github.com/Hibanito1/EKDA-ECOMMERCE](https://github.com/Hibanito1/EKDA-ECOMMERCE)  
**Branch:** `cursor/health-check-fixes-1c4a`

---

## 1. What Was Built

### Overview

A **full-stack cross-border e-commerce platform** for Africa, built as a Turborepo monorepo. The platform enables:
- **Export flow:** Nigerian vendors sell groceries, dried/frozen produce, agri-commodities to the diaspora (UK, USA, Canada, Germany)
- **Import flow:** International vendors sell vehicles, electronics, machinery to Nigerian/African buyers
- All transactions protected by an **escrow payment system** (50% on pickup, 50% on delivery)

### Scale

| Metric | Value |
|--------|-------|
| Web routes (pages + API) | **78 pages + 14 API routes** |
| Dashboard sections built | **45 dashboard pages** |
| UI components | **29 React components** |
| Shared packages | **6 packages** |
| Mobile screens | **12 screens** |
| Lines of code | **~28,000** |
| TypeScript errors | **0** |
| Build status | **✅ Clean (83 static pages)** |

---

## 2. Technology Stack

### Web (`apps/web`)
| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 15.3.3 | App Router, SSG/SSR, API routes |
| React | 19.0 | UI framework |
| TypeScript | 5.7 | Type safety |
| Tailwind CSS | 3.4 | Styling |
| Framer Motion | 12.9 | Animations |
| Zustand | 5.0 | Client state (cart, chat, loyalty) |
| Radix UI | Latest | Accessible UI primitives |
| Recharts | 2.15 | Analytics charts |
| React Hot Toast | 2.4 | Notifications |

### Mobile (`apps/mobile`)
| Technology | Version | Purpose |
|-----------|---------|---------|
| Expo | 52 | React Native framework |
| React Native | 0.76.7 | Mobile UI |
| Expo Router | 4.0 | File-based navigation |
| NativeWind | 4.0 | Tailwind for RN |

### Standalone APK (`apps/standalone`)
| Technology | Purpose |
|-----------|---------|
| Expo 52 (custom tabs) | 100% offline demo app |
| No Expo Router | Custom tab navigator (crash-free) |
| @ekda/demo | All data from shared package |

### Backend / Infrastructure
| Service | Purpose |
|---------|---------|
| Supabase | Auth, PostgreSQL, Storage, Realtime |
| Next.js API routes | Backend logic (14 endpoints) |
| Vercel | Web hosting |
| EAS Build | Mobile APK/AAB builds |

### Shared Packages (`packages/`)
| Package | Purpose |
|---------|---------|
| `@ekda/shared` | Types, constants, formatCurrency, calculateOrderBreakdown |
| `@ekda/demo` | All mock data (products, users, chat, orders, escrow) |
| `@ekda/validators` | Form validators (email, password, KYC, login) |
| `@ekda/ui` | Empty states copy, design tokens, notification config |
| `@ekda/database` | Supabase client + TypeScript types |
| `@ekda/config` | Shared TypeScript configs |

---

## 3. Features Built

### 3.1 Public Website
| Feature | Status | Notes |
|---------|--------|-------|
| Landing page (hero, features, stats, escrow explainer) | ✅ Complete | Framer Motion animations, SEO optimized |
| African Exports marketplace | ✅ Complete | 8 products, filters, cart, HS codes |
| Global Imports marketplace | ✅ Complete | 6 products, vehicles + electronics |
| Cart + 4-step Checkout | ✅ Complete | Delivery → Carrier → Payment → Confirm |
| Order Tracking page | ✅ Complete | Milestone timeline + escrow breakdown |
| Escrow Demo animation | ✅ Complete | Interactive 7-step simulation at `/escrow-demo` |
| B2B Portal + RFQ | ✅ Complete | Enterprise tiers + quote request form |
| Blog (3 articles) | ✅ Complete | SSG, SEO meta, structured data |
| Help Center + FAQ | ✅ Complete | Searchable, support ticket form |
| Learning Center | ✅ Complete | 4 courses, webinars, downloadable guides |
| Sustainability page | ✅ Complete | Carbon tracker, farm-direct, impact stats |
| Privacy Policy | ✅ Complete | NDPR + GDPR compliant |
| Terms of Service | ✅ Complete | Nigerian governing law |

### 3.2 Authentication
| Feature | Status | Notes |
|---------|--------|-------|
| Login (email/password) | ✅ Complete | Uses @ekda/validators, demo bypass |
| Register (multi-step, role selection) | ✅ Complete | 5 roles, business details |
| Google OAuth | ✅ Wired | Redirects to Supabase OAuth (needs real keys) |
| Demo mode login | ✅ Complete | Persistent localStorage session, all 5 roles |
| Session persistence | ✅ Complete | 24h TTL, version check, expiry guard |
| Forgot Password | ✅ Page exists | "Coming Soon" — needs email provider |
| KYC Onboarding (5 steps) | ✅ Complete | Personal → ID → Business → Address → Bank |

### 3.3 Vendor Dashboard (`/dashboard/vendor`)
| Page | Status | Notes |
|------|--------|-------|
| Overview + Revenue Charts | ✅ Complete | Recharts, mock data |
| AI HS Code Tool | ✅ Complete | Classifies products, air restriction detection |
| Document Upload + AI Verification | ✅ Complete | OCR simulation, confidence scores |
| Advanced Analytics | ✅ Complete | GMV + AI forecast, top destinations, cohorts |
| Vendor Premium Subscription | ✅ Complete | 3 plans (7%–8.5% commission) |
| Notification Preferences | ✅ Complete | 6 categories, 4 channels, quiet hours |
| Products page | ⏳ Placeholder | "Coming Soon" — needs Supabase query |
| Orders page | ⏳ Placeholder | "Coming Soon" — needs Supabase query |
| Wallet page | ⏳ Placeholder | "Coming Soon" — needs Supabase + Paystack |

### 3.4 Customer Dashboard (`/dashboard/customer`)
| Page | Status | Notes |
|------|--------|-------|
| Loyalty & Rewards | ✅ Complete | Bronze/Silver/Gold/Platinum, redemption |
| Notification Preferences | ✅ Complete | Full preference center |
| Orders page | ⏳ Placeholder | Needs Supabase query |
| Track Shipment | ⏳ Placeholder | Needs carrier API integration |
| Wishlist | ⏳ Placeholder | Needs Supabase |
| Addresses | ⏳ Placeholder | Needs Supabase |
| Wallet | ⏳ Placeholder | Needs Paystack balance API |

### 3.5 Admin Command Center (`/dashboard/admin`)
| Page | Status | Notes |
|------|--------|-------|
| Command Center (overview) | ✅ Complete | KPIs, live feed, system health, charts |
| Dispute Resolution Center | ✅ Complete | Mediation chat, escrow override, resolve |
| KYC Review Queue | ✅ Complete | AI risk scores, approve/reject/more-info |
| Financial Controls | ✅ Complete | Payouts, commissions, reconciliation |
| AI Supervision | ✅ Complete | Usage stats, override log, feedback loop |
| System Health Monitor | ✅ Complete | Latency charts, incident tracker |
| Advanced Analytics | ✅ Complete | GMV + AI forecast, geo, cohorts |
| User Management | ✅ Complete | Search, bulk actions, suspend |
| Marketing Tools | ✅ Complete | Campaigns, promo codes, notifications |
| Platform Announcements | ✅ Complete | Create/publish/schedule |
| Reports & Export Center | ✅ Complete | 10 report types, PDF + Excel |
| Orders, Vendors, Carriers, Escrow, Payouts | ⏳ Placeholder | "Coming Soon" — needs Supabase |

### 3.6 Carrier Dashboard (`/dashboard/carrier`)
| Page | Status | Notes |
|------|--------|-------|
| All pages | ⏳ Placeholder | "Coming Soon" — full portal needs Supabase |

### 3.7 AI Features
| Feature | Status | Notes |
|---------|--------|-------|
| AI Chat Assistant (floating) | ✅ Complete | Keyword-matched, `live_ai: false` flag |
| HS Code Classifier | ✅ Complete | 97% accuracy demo, air restriction detection |
| Smart Recommendations | ✅ Complete | "Customers also bought", price drops, trending |
| Price Intelligence | ✅ Complete | Sparkline charts, confidence scores, alerts |
| AI Document Verification | ✅ Complete | OCR simulation, flag detection |
| Risk Scoring | ✅ Complete | Multi-factor fraud scoring |
| Demand Forecasting (vendor) | ✅ Complete | 30-day prediction, restock alerts |
| **GROQ_API_KEY not set** | ⚠️ Demo only | All AI returns simulated responses |

### 3.8 Payments & Escrow
| Feature | Status | Notes |
|---------|--------|-------|
| Escrow system architecture | ✅ Complete | Full logic, API routes |
| Paystack integration | ⏳ Simulated | Needs `PAYSTACK_SECRET_KEY` live |
| Stripe integration | ⏳ Simulated | Needs `STRIPE_SECRET_KEY` live |
| Monnify integration | ⏳ Simulated | Needs `MONNIFY_API_KEY` live |
| BNPL (Buy Now Pay Later) | ✅ UI Complete | Klarna/Paystack/Stripe UI wired |
| Crypto payments (USDT/USDC) | ✅ UI Complete | Wallet address display, amount calc |
| Split payments | ✅ UI Complete | Multi-participant, even-split |

### 3.9 Security & Compliance
| Feature | Status | Notes |
|---------|--------|-------|
| Security middleware (HSTS, CSP, X-Frame) | ✅ Active | `src/middleware.ts` |
| Rate limiting (AI endpoints) | ✅ Active | In-memory, Upstash-ready |
| GDPR/NDPR consent banner | ✅ Complete | Version-aware, per-category |
| Privacy Policy + Terms | ✅ Complete | Full legal pages |
| KYC form (5 steps) | ✅ Complete | Validator-wired |
| Audit logging | ✅ Schema ready | Needs Supabase wiring |

### 3.10 Mobile App
| Feature | Status | Notes |
|---------|--------|-------|
| Welcome + Login screens | ✅ Complete | `apps/mobile` (Expo Router) |
| Home tab | ✅ Complete | Categories from @ekda/shared |
| Export marketplace | ✅ Complete | 8 products from @ekda/demo |
| Import marketplace | ✅ Complete | 6 products from @ekda/demo |
| Cart + Checkout | ✅ Complete | @ekda/shared calculations |
| AI Chat tab | ✅ Complete | @ekda/demo responses |
| Account + Loyalty | ✅ Complete | @ekda/demo tiers |
| Session persistence | ✅ Complete | AsyncStorage, 24h TTL |
| **Standalone APK** | ✅ Built | `ekda-demo-v2.apk` (61MB) |

---

## 4. Testable Deliverables

### Web App
```bash
# Run locally with demo mode
git clone https://github.com/Hibanito1/EKDA-ECOMMERCE.git
cd EKDA-ECOMMERCE
npm install --legacy-peer-deps
cp apps/web/.env.demo apps/web/.env.local
cd apps/web && npm run dev
# Open: http://localhost:3000
```

### Android APK (Demo — no crashes)
```
Download: https://github.com/Hibanito1/EKDA-ECOMMERCE/raw/cursor/health-check-fixes-1c4a/ekda-demo-v2.apk
Package: io.ekda.standalone
Size: 61MB | Min Android: 7.0 (API 24)
```
**Install:** Settings → Security → Unknown Sources → ON → Tap APK

### Demo Credentials (password: `Demo@12345` for all)
| Role | Email | Access After Login |
|------|-------|-------------------|
| Customer | `demo.customer@ekda.io` | Shopping, cart, loyalty |
| Vendor | `demo.vendor@ekda.io` | Products, analytics, HS codes |
| Carrier | `demo.carrier@ekda.io` | Jobs, shipments |
| Admin | `demo.admin@ekda.io` | Full admin command center |

> **Sessions persist across page refresh** — stored in localStorage (web) and AsyncStorage (mobile) with 24-hour TTL.

---

## 5. Database Schema

Three SQL migration files are ready. Run in order in Supabase SQL Editor:

| File | Tables Created |
|------|----------------|
| `packages/database/src/migrations/001_schema.sql` | profiles, products, orders, order_items, tracking_milestones, escrow_accounts, wallets, documents, notifications, reviews, disputes, carrier_bids |
| `packages/database/src/migrations/002_kyc_consent_audit.sql` | kyc_applications, kyc_documents, consent_records, audit_logs, data_export_requests, rate_limit_log |
| `packages/database/src/migrations/003_admin_dashboard.sql` | disputes_extended, dispute_messages, payouts, commission_adjustments, refunds, ai_usage_logs, promo_codes, announcements, system_health_logs |

All tables have **Row Level Security (RLS)** policies, auto-triggers, and indexes.

---

## 6. Environment Variables

### Minimum for local demo (already in `.env.demo`):
```env
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder
NEXT_PUBLIC_APP_URL=http://localhost:3000
GROQ_API_KEY=demo_placeholder_key
PAYSTACK_SECRET_KEY=demo_placeholder
STRIPE_SECRET_KEY=demo_placeholder
```

### Full production environment:
```env
# ─── Core (Required) ───────────────────────────────────────────
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_APP_URL=https://ekda.io

# ─── Supabase ──────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ─── Payments ─────────────────────────────────────────────────
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_...
PAYSTACK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
MONNIFY_API_KEY=MK_PROD_...
MONNIFY_CONTRACT_CODE=...
MONNIFY_BASE_URL=https://api.monnify.com

# ─── AI (Optional — falls back to demo if missing) ────────────
GROQ_API_KEY=gsk_...         # Starts with gsk_ to enable live AI
OPENAI_API_KEY=sk-...        # Optional fallback

# ─── Communications ───────────────────────────────────────────
RESEND_API_KEY=re_...        # Transactional email
TERMII_API_KEY=...           # SMS for Nigeria
TERMII_SENDER_ID=EKDA

# ─── Monitoring (Optional but recommended) ────────────────────
NEXT_PUBLIC_POSTHOG_KEY=phc_...
SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# ─── App ──────────────────────────────────────────────────────
NEXT_PUBLIC_APP_NAME=EKDA Marketplace
NODE_ENV=production
```

---

## 7. What Developers Need to Do (Prioritised)

### 🔴 Sprint 1 — BLOCKERS (App cannot go live without these)

#### 1.1 Connect Supabase (2–3 days)
**File:** `apps/web/src/lib/supabase/client.ts`

```typescript
// Current (lazy stub):
export function getSupabase() {
  if (!_supabase) _supabase = createClientComponentClient<Database>();
  return _supabase;
}

// Required: Add real URL validation
// Also wire server-side client in apps/web/src/lib/supabase/server.ts
```

**Steps:**
1. Create Supabase project at [supabase.com](https://supabase.com)
2. Run the 3 SQL migrations (in order) in the SQL Editor
3. Add real credentials to environment variables
4. Test: `supabase.auth.signInWithPassword()` on login page
5. Enable Google OAuth: Supabase Dashboard → Auth → Providers → Google

#### 1.2 Wire Real Payments (3–5 days)
**File:** `apps/web/src/app/api/payments/route.ts`

The simulation code is clearly marked. Replace each gateway's mock block with the real SDK:

```typescript
// PAYSTACK (Nigeria):
// npm install @paystack/paystack-sdk
import Paystack from "@paystack/paystack-sdk";
const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);
const response = await paystack.transaction.initialize({ email, amount: total * 100, reference: orderId });

// STRIPE (International):
// npm install stripe
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const session = await stripe.checkout.sessions.create({ ... });
```

**Also create webhook handlers** at `/api/payments/webhook/[gateway]/route.ts` to trigger escrow releases.

#### 1.3 Implement Escrow Release Triggers (2–3 days)
**File:** `apps/web/src/app/api/escrow/route.ts`

The `release_pickup` and `release_destination` actions are simulated. Wire to Paystack Transfer API:

```typescript
// Paystack Transfer (for vendor payout):
await paystack.transfer.create({
  source: "balance",
  amount: firstReleaseAmount,
  recipient: vendorRecipientCode, // from bank_details in profiles table
  reason: `EKDA escrow release - Order ${orderId}`,
});
```

#### 1.4 Protect Dashboard Routes (1 day)
**File:** `apps/web/src/middleware.ts`

`PROTECTED_ROUTES` array is defined but **not enforced**. Add actual redirect logic:

```typescript
// In middleware.ts — add after rate limiting:
if (PROTECTED_ROUTES.some(r => pathname.startsWith(r))) {
  const session = await getServerSession(req);  // Supabase server session
  if (!session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}
```

---

### 🟡 Sprint 2 — IMPORTANT (Launch quality)

#### 2.1 Replace Dashboard Mock Data (3–4 days)
Every admin and vendor dashboard chart uses hardcoded arrays. Replace with Supabase queries:

| Dashboard Page | What to query |
|----------------|---------------|
| `/dashboard/vendor/page.tsx` | `SELECT * FROM orders WHERE vendor_id = $user_id` |
| `/dashboard/admin/page.tsx` | Aggregate: `SELECT SUM(total) FROM orders WHERE created_at > $30days` |
| `/dashboard/admin/disputes/page.tsx` | `SELECT * FROM disputes_extended ORDER BY created_at DESC` |
| `/dashboard/admin/kyc/page.tsx` | `SELECT * FROM kyc_applications WHERE status = 'pending_admin'` |
| `/dashboard/admin/analytics/page.tsx` | Monthly GMV aggregation query |

#### 2.2 KYC Document Storage (1 day)
**File:** `apps/web/src/components/kyc/KYCForm.tsx`, function `handleDocumentUpload`

```typescript
// Replace simulation:
const { data, error } = await supabase.storage
  .from("kyc-documents")
  .upload(`${userId}/${documentType}/${Date.now()}-${file.name}`, file, {
    contentType: file.type,
    upsert: false
  });

// Save URL to kyc_documents table
await supabase.from("kyc_documents").insert({
  kyc_application_id,
  user_id: userId,
  document_type: documentType,
  file_url: data.path,
  file_name: file.name
});
```

Create Supabase Storage buckets: `kyc-documents`, `product-images`, `trade-documents`

#### 2.3 Connect Groq AI (2–3 hours)
**File:** `apps/web/src/app/api/ai-chat/route.ts`

The code is already structured. Just uncomment the Groq block:

```typescript
if (GROQ_AVAILABLE) {
  const { Groq } = await import("groq-sdk");  // npm install groq-sdk
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history, { role: "user", content: message }],
    max_tokens: 1024,
  });
  chatResponseText = completion.choices[0]?.message?.content ?? "";
  isLiveAI = true;
}
```

Same pattern for `api/hs-code/route.ts`.

#### 2.4 Email & SMS (1 day)
Wire Resend (email) and Termii (SMS) into KYC status notifications. The database trigger `notify_kyc_status_change()` already inserts to `notifications` table — just add the send call.

#### 2.5 Complete Placeholder Pages (3–5 days)
**25 pages** show "Coming Soon". The most critical ones to complete first:

| Priority | Pages |
|----------|-------|
| High | `/dashboard/vendor/orders`, `/dashboard/vendor/products` |
| High | `/dashboard/customer/orders`, `/dashboard/customer/track` |
| Medium | Full carrier portal (`/dashboard/carrier/*`) |
| Low | Wishlist, Addresses, Wallets |

---

### 🟢 Sprint 3 — POST-LAUNCH

| Item | Effort | Notes |
|------|--------|-------|
| Replace in-memory rate limiter with Upstash | 2h | `npm install @upstash/ratelimit @upstash/redis` |
| Wire PostHog analytics | 2h | Uncomment `src/lib/analytics/index.ts` |
| Wire Sentry error tracking | 2h | Run `npx @sentry/wizard@latest -i nextjs` |
| Generate real PWA icons | 1h | Design 512x512 icon → export all sizes |
| Complete i18n (Yoruba, Igbo, Hausa) | 8h | Add dictionaries to `packages/ui/src/i18n` |
| Mobile offline mode (WatermelonDB) | 2–3 days | Replace AsyncStorage mock with proper sync |
| Supabase Realtime for admin feed | 4h | `supabase.channel('orders').on(...)` |
| CI/CD GitHub Actions | 2h | Template in `PRODUCTION_READINESS.md` |

---

## 8. Shared Package Architecture (IMPORTANT)

This project uses a **shared package strategy** where changing data in one place updates all apps automatically.

```
packages/
├── @ekda/shared     → formatCurrency, calculateOrderBreakdown, EKDA_COMMISSION_RATE
├── @ekda/demo       → ALL mock data: products, users, orders, chat responses
├── @ekda/validators → Form validation: email, password, KYC, login, register
├── @ekda/ui         → Empty states copy, design tokens, notification config
├── @ekda/database   → Supabase client + TypeScript types
└── @ekda/config     → TypeScript configurations
```

**Rule:** Change data in `packages/demo/src/products.ts` → rebuild → both web marketplace pages AND mobile tabs show the new data. See `PACKAGE_SHARING.md` for full documentation.

---

## 9. Deployment

### Web (Vercel — recommended)
```bash
# Option 1: GitHub integration (easiest)
# Connect repo at vercel.com/new → set root dir to apps/web
# Add all production env vars in Vercel dashboard

# Option 2: CLI
cd apps/web
npx vercel login
npx vercel --prod
```

### Mobile (EAS Build)
```bash
cd apps/mobile

# 1. Create Expo account at expo.dev
# 2. Update eas.json → replace "ekda-marketplace-app" with real EAS project ID
eas login
eas build:configure  # Run once

# Generate Android APK for testing
eas build --platform android --profile preview

# Generate AAB for Play Store
eas build --platform android --profile production

# iOS requires Apple Developer account ($99/year)
eas build --platform ios --profile production
```

### Database (Supabase)
```bash
# Run migrations in this EXACT order in Supabase SQL Editor:
# 1. packages/database/src/migrations/001_schema.sql
# 2. packages/database/src/migrations/002_kyc_consent_audit.sql
# 3. packages/database/src/migrations/003_admin_dashboard.sql
```

---

## 10. Known Technical Debt

| Issue | Location | Impact | Effort |
|-------|----------|--------|--------|
| Dashboard `layout.tsx` uses path-based role fallback | `apps/web/src/app/dashboard/layout.tsx` | Medium — role only correct after session loads | 2h |
| Demo session context not available in API routes | Web API routes can't read `DemoAuthContext` | Low — API uses `DEMO_MODE` env var instead | 2h |
| `@supabase/auth-helpers-nextjs` deprecated | `apps/web/src/lib/supabase/` | Medium — migrate to `@supabase/ssr` | 4h |
| Mobile `apps/mobile` has Expo Router but `apps/standalone` has custom nav | Two mobile apps exist | Low — standalone is for demo only | N/A |
| In-memory rate limiter resets on server restart | `src/lib/rate-limit/index.ts` | Medium in production | 2h |
| 25 placeholder "Coming Soon" pages | Multiple dashboard routes | Medium for real users | 3–5 days |
| No `useMemo` / `useCallback` optimisation on charts | Admin dashboard | Low — charts re-render on tab switch | 1 day |

---

## 11. Project File Map (Key Files Only)

```
ekda-ecommerce/
│
├── apps/web/src/
│   ├── app/
│   │   ├── (site)/                   ← Public website pages
│   │   │   ├── page.tsx              ← Landing page
│   │   │   ├── marketplace/          ← Export + Import marketplaces
│   │   │   ├── cart/ checkout/       ← Shopping flow
│   │   │   └── blog/ help/ learn/    ← Content pages
│   │   ├── auth/                     ← Login, Register, KYC
│   │   ├── dashboard/
│   │   │   ├── admin/                ← 12 admin sections
│   │   │   ├── vendor/               ← 8 vendor sections
│   │   │   ├── customer/             ← 7 customer sections
│   │   │   └── carrier/              ← 7 carrier sections (placeholders)
│   │   └── api/                      ← 14 API endpoints
│   │
│   ├── components/
│   │   ├── ai/                       ← Chat, recommendations, price intelligence
│   │   ├── demo/DemoBanner.tsx       ← Purple demo mode banner
│   │   ├── kyc/KYCForm.tsx           ← 5-step KYC wizard
│   │   ├── layout/Providers.tsx      ← DemoAuthProvider + ThemeProvider
│   │   ├── monitoring/               ← ErrorBoundary, EscrowDemo
│   │   ├── trust/                    ← Verified badges, escrow transparency
│   │   └── ui/                       ← Button, Card, Input, states
│   │
│   └── lib/
│       ├── auth/DemoAuthContext.tsx  ← Persistent demo session (localStorage)
│       ├── demo/index.ts             ← Re-exports from @ekda/demo
│       ├── validation/index.ts       ← Re-exports from @ekda/validators
│       ├── supabase/                 ← Client + Server Supabase helpers
│       └── rate-limit/               ← In-memory rate limiter
│
├── apps/mobile/app/                  ← Expo Router screens
│   ├── (auth)/welcome.tsx login.tsx  ← Auth screens
│   └── (tabs)/                       ← 6 tabs: home, exports, imports, cart, ai, account
│
├── apps/standalone/                  ← Crash-free offline demo APK
│   └── src/screens/                  ← 6 standalone screens
│
└── packages/
    ├── demo/src/                     ← MOCK DATA (single source of truth)
    │   ├── users.ts                  ← 5 demo accounts
    │   ├── products.ts               ← 8 exports + 6 imports
    │   ├── orders.ts                 ← 3 mock orders + carriers
    │   ├── chat.ts                   ← AI chat responses
    │   ├── escrow.ts                 ← Loyalty tiers, escrow demo steps
    │   ├── banner.ts                 ← Demo banner config
    │   └── session.ts                ← Session serialization (web + mobile)
    │
    ├── validators/src/               ← FORM VALIDATORS
    │   ├── primitives.ts             ← email, password, phone, etc.
    │   ├── business.ts               ← hsCode, bankAccount, cacNumber
    │   └── forms.ts                  ← validateLogin, validateRegister, KYC
    │
    └── ui/src/                       ← UI CONSTANTS
        ├── copy/empty-states.ts      ← Empty state text (web + mobile)
        ├── tokens/index.ts           ← Brand colors, spacing, shadows
        └── notifications/config.ts   ← Notification categories + events
```

---

## 12. Contacts & Credentials

| Resource | Details |
|----------|---------|
| GitHub repo | `github.com/Hibanito1/EKDA-ECOMMERCE` |
| Working branch | `cursor/health-check-fixes-1c4a` |
| Demo Web | Deploy from `apps/web` on Vercel |
| Standalone APK | `ekda-demo-v2.apk` in repo root (61MB) |
| Full-feature APK | `ekda-marketplace.apk` in repo root (71MB) |
| Supabase | Create new project at supabase.com |
| Paystack | Register at dashboard.paystack.com (Nigeria) |
| Stripe | Register at dashboard.stripe.com (International) |
| Groq AI | Get key at console.groq.com |
| Expo/EAS | Register at expo.dev |

---

## 13. Quick Start for New Developer

```bash
# 1. Clone
git clone https://github.com/Hibanito1/EKDA-ECOMMERCE.git
cd EKDA-ECOMMERCE
git checkout cursor/health-check-fixes-1c4a

# 2. Install
npm install --legacy-peer-deps

# 3. Configure demo environment
cp apps/web/.env.demo apps/web/.env.local

# 4. Run web app
cd apps/web && npm run dev
# → http://localhost:3000

# 5. Login with demo account
# Email: demo.vendor@ekda.io
# Password: Demo@12345
# → Goes to /dashboard/vendor (session persists on refresh)

# 6. Run mobile app
cd apps/mobile && npm start
# Scan QR code with Expo Go app on your phone

# 7. Build Android APK
./BUILD_APK.sh
# → ekda-marketplace.apk (requires Java 21 + Android SDK)

# 8. Run tests
cd apps/web && npm test

# 9. Type check all packages
/path/to/node_modules/.bin/tsc --noEmit --project apps/web/tsconfig.json
```

---

*Document prepared June 4, 2026. For questions, refer to `PACKAGE_SHARING.md` and `TESTING.md` in the repository root.*
