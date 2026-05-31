# EKDA Ecommerce — Africa's Premier Cross-Border Marketplace

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15.3-black.svg)](https://nextjs.org/)
[![Expo](https://img.shields.io/badge/Expo-52-blue.svg)](https://expo.dev/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2.9-red.svg)](https://turbo.build/)
[![Supabase](https://img.shields.io/badge/Supabase-2.48-green.svg)](https://supabase.com/)

**EKDA** is a world-class cross-border marketplace purpose-built for African trade — enabling Nigerian vendors to export groceries, dried produce, and agricultural commodities worldwide, and international vendors to import vehicles, electronics, and machinery to Nigeria and Africa.

---

## 🗂️ Repository Structure

```
ekda-ecommerce/                   # Turborepo monorepo root
├── apps/
│   ├── web/                      # Next.js 15 web application
│   │   ├── src/
│   │   │   ├── app/              # Next.js App Router pages
│   │   │   │   ├── (site)/       # Public site (marketplace, blog, help)
│   │   │   │   ├── auth/         # Authentication pages
│   │   │   │   ├── dashboard/    # User dashboards (admin, vendor, carrier, customer)
│   │   │   │   ├── onboarding/   # KYC onboarding
│   │   │   │   └── api/          # API route handlers
│   │   │   ├── components/       # React UI components
│   │   │   │   ├── ai/           # AI chat, recommendations, price intelligence
│   │   │   │   ├── admin/        # Admin dashboard components
│   │   │   │   ├── checkout/     # Cart and checkout components
│   │   │   │   ├── consent/      # GDPR/NDPR consent components
│   │   │   │   ├── kyc/          # KYC form and document upload
│   │   │   │   ├── layout/       # Navbar, footer, providers
│   │   │   │   ├── logistics/    # Landed cost, carbon tracker
│   │   │   │   ├── loyalty/      # Loyalty program components
│   │   │   │   ├── monitoring/   # Error boundaries, escrow demo
│   │   │   │   ├── notifications/# Notification preferences
│   │   │   │   ├── payments/     # BNPL, crypto, split payment
│   │   │   │   ├── search/       # Advanced search with visual/voice
│   │   │   │   ├── support/      # Help center FAQ
│   │   │   │   ├── trust/        # Verified badges, escrow transparency
│   │   │   │   └── ui/           # Base UI components (button, card, input, states)
│   │   │   ├── lib/              # Utilities and integrations
│   │   │   │   ├── analytics/    # PostHog + Sentry integration stubs
│   │   │   │   ├── errors/       # Error handling utilities
│   │   │   │   ├── i18n/         # Internationalization (6 languages)
│   │   │   │   ├── logger/       # Structured JSON logger
│   │   │   │   ├── rate-limit/   # In-memory rate limiter (Upstash-ready)
│   │   │   │   ├── supabase/     # Client and server Supabase helpers
│   │   │   │   └── validation/   # Form validation library + ARIA helpers
│   │   │   └── store/            # Zustand state stores (cart, chat, loyalty, prefs)
│   │   ├── middleware.ts          # Security headers + rate limiting
│   │   ├── next.config.js         # Next.js config with security headers
│   │   └── public/               # Static assets, manifest.json
│   │
│   └── mobile/                   # Expo React Native application
│       ├── app/
│       │   ├── (auth)/           # Login, register, welcome screens
│       │   └── (tabs)/           # Home, Exports, Imports, Cart, AI Chat, Account
│       └── app.json              # Expo app configuration
│
└── packages/
    ├── shared/                   # Shared types, constants, utilities
    │   └── src/
    │       ├── types.ts          # All TypeScript interfaces and types
    │       ├── constants.ts      # EKDA_COMMISSION_RATE, currencies, HS restrictions
    │       └── utils.ts          # formatCurrency, calculateOrderBreakdown, etc.
    ├── database/                 # Supabase client + TypeScript types
    │   └── src/
    │       ├── client.ts         # createClient, createServerClient
    │       ├── database.types.ts # Auto-generated DB types
    │       └── migrations/       # SQL migration files
    │           ├── 001_schema.sql          # Core tables (profiles, products, orders, etc.)
    │           ├── 002_kyc_consent_audit.sql # KYC, consent, audit trail
    │           └── 003_admin_dashboard.sql # Disputes, payouts, AI monitoring, etc.
    └── config/                   # Shared TypeScript and ESLint configs
```

---

## 🚀 Key Features

### Two-Way Marketplace
| Direction | Vendors | Products | Customers |
|-----------|---------|---------|-----------|
| **Export (🌿)** | Nigerian farmers and food exporters | Groceries, dried/frozen produce, agri-commodities | Global diaspora + local buyers |
| **Import (🌍)** | USA, UK, Germany, China, UAE vendors | Vehicles, electronics, machinery, general goods | Nigerian and African buyers |

### 🛡️ Smart Escrow System
```
Customer pays 100% → EKDA Escrow
    ↓
Carrier confirms pickup → 50% released to vendor (minus 10% commission)
    ↓
Carrier confirms destination arrival → Remaining 50% released
```

### 🤖 AI Capabilities
- **HS Code Engine**: Auto-classifies products with 97%+ accuracy (Groq Llama-3)
- **AI Chatbot**: Contextual trade assistant (product discovery, shipping calculation, customs guidance)
- **Risk Scoring**: Multi-factor fraud detection (KYC, order value, route, vendor rating)
- **Document Verification**: OCR + AI authenticity scoring for trade documents
- **Demand Forecasting**: 30-day stock predictions for vendors
- **Price Intelligence**: Commodity price trend predictions with alerts

### 💰 Payment Gateways
| Gateway | Use Case | Currency |
|---------|----------|---------|
| **Paystack** | Nigerian debit/credit cards, bank transfer | NGN |
| **Stripe** | International cards, Apple/Google Pay | USD, GBP, EUR |
| **Monnify** | USSD, bank transfer, Nigerian banks | NGN |
| **Crypto** | USDT, USDC, BTC (diaspora users) | Stable |

---

## ⚡ Quick Start

### Prerequisites
- Node.js ≥ 20.0.0
- npm ≥ 10.0.0
- A Supabase account (free tier works for development)

### 1. Clone and Install

```bash
git clone https://github.com/Hibanito1/EKDA-ECOMMERCE.git
cd ekda-ecommerce
npm install --legacy-peer-deps
```

### 2. Configure Environment

```bash
cp apps/web/.env.example apps/web/.env.local
```

Edit `apps/web/.env.local` with your credentials (see Environment Variables below).

### 3. Set Up Database

1. Create a project at [supabase.com](https://supabase.com)
2. Run migrations in order:
   ```sql
   -- In Supabase SQL Editor:
   -- 1. Run packages/database/src/migrations/001_schema.sql
   -- 2. Run packages/database/src/migrations/002_kyc_consent_audit.sql  
   -- 3. Run packages/database/src/migrations/003_admin_dashboard.sql
   ```

### 4. Start Development

```bash
# Start all apps
npm run dev

# Start web only (recommended for focused development)
cd apps/web && npm run dev

# Start mobile only
cd apps/mobile && npm start
```

Web app: http://localhost:3000  
Mobile: Expo Go app or simulator

---

## 🔑 Environment Variables

Create `apps/web/.env.local` with these variables:

### Required

```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Payment Gateways

```env
# Paystack (Nigeria payments)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_...
PAYSTACK_SECRET_KEY=sk_test_...

# Stripe (International payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Monnify (Nigerian bank payments)
MONNIFY_API_KEY=MK_TEST_...
MONNIFY_CONTRACT_CODE=...
MONNIFY_BASE_URL=https://sandbox.monnify.com
```

### AI Services

```env
# For HS Code, chatbot, and document verification
GROQ_API_KEY=gsk_...
OPENAI_API_KEY=sk-...  # Optional fallback
```

### Analytics & Monitoring

```env
# PostHog (product analytics)
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Sentry (error tracking)
SENTRY_DSN=https://...@sentry.io/...
NEXT_PUBLIC_SENTRY_DSN=https://...@sentry.io/...

# Optional
RESEND_API_KEY=re_...          # Email sending
TERMII_API_KEY=...              # SMS (Nigeria)
```

### App Configuration

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=EKDA Marketplace
NODE_ENV=development
```

---

## 📡 API Routes

All routes are in `apps/web/src/app/api/`:

| Route | Method | Auth | Description |
|-------|--------|------|-------------|
| `/api/ai-chat` | POST | Optional | AI chatbot — contextual trade assistant |
| `/api/hs-code` | POST | Optional | AI product HS code classification |
| `/api/shipping` | POST | No | Multi-carrier rate comparison |
| `/api/escrow` | GET, POST | Yes | Escrow creation and release management |
| `/api/documents` | POST | Yes | AI document OCR analysis |
| `/api/payments` | GET, POST | Yes | Payment gateway initialization/verification |
| `/api/kyc` | GET, POST, PATCH | Partial | KYC submission and admin approval |
| `/api/consent` | GET, POST, DELETE | Optional | GDPR/NDPR consent recording |
| `/api/risk-score` | POST | Yes (Admin) | AI fraud/risk scoring |
| `/api/demand-forecast` | POST | Yes (Vendor) | 30-day demand prediction |
| `/api/loyalty` | GET, POST | Yes | Loyalty points management |
| `/api/landed-cost` | POST | No | Total import cost calculator |
| `/api/health` | GET | No | Service health check |
| `/api/audit` | POST | Yes | Audit log creation |

### Rate Limits
- AI Chat: 20 requests/minute per IP
- HS Code: 30 requests/minute per IP  
- Auth endpoints: 10 requests/15 minutes per IP
- KYC: 5 submissions/hour per IP
- All other API: 100 requests/minute per IP

---

## 🗃️ Database Schema

### Core Tables
| Table | Description |
|-------|-------------|
| `profiles` | All users (customers, vendors, carriers, admins) |
| `products` | Products with HS codes, cargo recommendations |
| `orders` | Orders with escrow tracking |
| `order_items` | Individual line items |
| `tracking_milestones` | Shipment event log |
| `escrow_accounts` | Escrow release records |
| `wallets` | User wallet balances |
| `carrier_bids` | Carrier job bidding |
| `reviews` | Product and vendor reviews |
| `disputes_extended` | Dispute management |
| `dispute_messages` | Mediation chat threads |

### Compliance Tables
| Table | Description |
|-------|-------------|
| `kyc_applications` | Full 5-step KYC submissions |
| `kyc_documents` | Uploaded document storage with AI scores |
| `consent_records` | GDPR/NDPR consent audit trail |
| `audit_logs` | Immutable action audit log |
| `data_export_requests` | GDPR right-to-erasure requests |

### Operations Tables
| Table | Description |
|-------|-------------|
| `payouts` | Vendor and carrier payout records |
| `commission_adjustments` | Per-vendor commission overrides |
| `refunds` | Refund and chargeback records |
| `ai_usage_logs` | AI service usage, cost, accuracy tracking |
| `promo_codes` | Discount code management |
| `announcements` | Platform-wide announcements |
| `documents` | Trade document storage (B/L, Phyto, etc.) |

---

## 🛡️ Security Architecture

- **Middleware**: Security headers (HSTS, CSP, X-Frame-Options), rate limiting, bot protection
- **Authentication**: Supabase Auth with JWT + Row Level Security (RLS) on all tables
- **Escrow**: All fund flows are logged with audit trails; dual-admin approval for overrides
- **KYC**: Documents stored encrypted in Supabase Storage with restricted access
- **Rate Limiting**: In-memory limiter (swap with Upstash Redis for production scale)
- **Input Sanitization**: All API inputs validated; XSS protection via CSP headers
- **GDPR/NDPR**: Consent recording, data export, and account deletion flows implemented

---

## 📱 Mobile App (Expo)

```bash
cd apps/mobile

# Start
npm start

# iOS simulator  
npm run ios

# Android emulator
npm run android

# Build for production
npm run build:android
npm run build:ios
```

### App Configuration
- Bundle ID (iOS): `io.ekda.marketplace`
- Package (Android): `io.ekda.marketplace`
- Deep linking scheme: `ekda://`

---

## 🌐 Supported Languages (i18n)

| Code | Language | Status |
|------|----------|--------|
| `en` | English | ✅ Complete |
| `yo` | Yorùbá | 🟡 Partial (extend in `src/lib/i18n/index.ts`) |
| `ig` | Igbo | 🔴 Pending |
| `ha` | Hausa | 🔴 Pending |
| `pcm` | Nigerian Pidgin | 🟡 Partial |
| `fr` | Français | 🔴 Pending |

---

## 🚀 Production Deployment

### Web (Vercel — Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd apps/web && vercel --prod
```

Set all environment variables in the Vercel dashboard.

### Mobile (EAS Build — Expo)
```bash
npm install -g eas-cli
cd apps/mobile

# Configure
eas build:configure

# Build Android
eas build --platform android

# Build iOS
eas build --platform ios
```

---

## 🧪 Running Tests

```bash
# Unit tests
cd apps/web && npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 📄 Key Business Rules

1. **EKDA Commission**: Always 10% of order subtotal (adjustable per vendor premium plan)
2. **Escrow 1st Release**: 50% of vendor share when carrier confirms pickup
3. **Escrow 2nd Release**: Remaining 50% when carrier confirms destination arrival
4. **Minimum Escrow Approvals**: Admin overrides require 2 admin approvals
5. **KYC Required**: Vendors and Carriers must complete KYC before trading
6. **Air Cargo Restrictions**: Frozen goods, vehicles, and heavy machinery cannot be air freighted
7. **HS Code Required**: All products must have a valid HS code before listing
8. **SLA for Disputes**: 72 hours for admin to make a decision

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make changes and test locally
3. Ensure TypeScript: `npm run type-check`
4. Commit: `git commit -m "feat: your feature description"`
5. Push and open a PR

---

## 📄 License

Copyright © 2025 EKDA Technologies Ltd. All rights reserved.

Built with ❤️ for Africa's traders, the diaspora, and the global marketplace.
