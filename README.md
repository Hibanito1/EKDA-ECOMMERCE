# EKDA Ecommerce — World-Class African Cross-Border Marketplace

A **billion-dollar-looking**, production-ready, cross-platform e-commerce platform built as a Turborepo monorepo. The first marketplace purpose-built for Africa's cross-border trade — exporting African goods to the diaspora and importing international products to Nigeria/Africa.

## 🌍 What is EKDA?

EKDA is a **two-way marketplace**:

- **🌿 African Exports**: Nigerian vendors sell groceries, dried/frozen produce, and agricultural commodities to diaspora and local customers
- **🌍 Global Imports**: International vendors (China, USA, Europe) sell cars, electronics, machinery, and goods to Nigeria/Africa customers

---

## 🏗️ Architecture

```
ekda-ecommerce/
├── apps/
│   ├── web/          # Next.js 15 + App Router (Web Platform)
│   └── mobile/       # Expo (React Native) — iOS & Android
├── packages/
│   ├── shared/       # Types, constants, utilities
│   ├── database/     # Supabase client + schema + types
│   └── config/       # Shared TypeScript/ESLint configs
├── turbo.json        # Turborepo pipeline
└── package.json      # Workspace root
```

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Web** | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| **Mobile** | Expo (React Native), TypeScript, NativeWind |
| **Monorepo** | Turborepo |
| **Backend** | Supabase (Auth, PostgreSQL, Storage, Realtime, Edge Functions) |
| **Payments** | Paystack (Nigeria), Stripe (International), Monnify (Nigeria) |
| **AI** | OpenAI / Groq — HS Code classification, Document AI OCR |
| **Styling** | African-inspired: Deep greens, earth tones, gold accents |

---

## ✨ Core Features

### 🛡️ Smart Escrow System
- Customer pays 100% upfront → held in EKDA escrow
- **50% released** when carrier confirms pickup from vendor
- **50% released** when goods arrive at destination port/airport
- EKDA deducts **10% commission** automatically — transparent and fair

### 🤖 AI HS Code Engine
- Auto-classifies products using Harmonized System codes
- Detects air cargo restrictions and recommends sea freight
- Validates HS codes in uploaded documents
- Confidence scoring with human review for low-confidence results

### 🚢 Smart Logistics AI
- AI recommends cargo type (air/sea/road) based on product category
- Multi-carrier comparison with rates, transit times, and ratings
- Nigerian seaport/airport selection (Apapa, Tin Can, LOS, ABV, etc.)
- Real-time tracking with milestone updates

### 📄 AI Document Verification
- OCR extraction from PDFs and images
- Validates: Phytosanitary certs, Bills of Lading, Certificates of Origin
- Flags suspicious documents and extraction anomalies
- HS code cross-validation across documents

### 💱 Multi-Gateway Payments
- **Paystack** — Nigerian debit/credit cards, bank transfers
- **Stripe** — International cards, Apple/Google Pay
- **Monnify** — USSD, bank transfer, Nigerian banks
- Multi-currency: NGN, USD, GBP, EUR, CAD, AUD

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **Customer** | Browse, order, track, wallet |
| **Vendor** | Products, AI HS codes, orders, documents, wallet |
| **Enterprise** | Bulk orders, container loads, dedicated account |
| **Carrier** | Job bidding, pickup/delivery confirmation, earnings |
| **Admin** | Full platform: KYC, disputes, escrow, analytics, commissions |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20.0.0
- npm ≥ 10.0.0

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/ekda-ecommerce.git
cd ekda-ecommerce

# Install all dependencies
npm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
# Edit .env.local with your Supabase, payment, and AI API keys
```

### Database Setup

1. Create a [Supabase](https://supabase.com) project
2. Run the SQL schema: `packages/database/src/schema.sql`
3. Update `NEXT_PUBLIC_SUPABASE_URL` and keys in `.env.local`

### Development

```bash
# Run all apps in parallel
npm run dev

# Run web only
cd apps/web && npm run dev

# Run mobile only  
cd apps/mobile && npm start
```

### Building

```bash
# Build all apps
npm run build
```

---

## 📱 Mobile App (Expo)

```bash
cd apps/mobile

# Start development server
npm start

# iOS simulator
npm run ios

# Android emulator
npm run android

# Production build (EAS)
npm run build:android
npm run build:ios
```

---

## 🌐 Web App (Next.js)

Deployed on Vercel. The web app features:
- Beautiful landing page with animated hero
- Two-way marketplace (Export + Import) with AI-enhanced product cards
- Full auth flow with role selection
- AI HS Code tool
- Checkout with escrow visualization
- Admin, Vendor, Carrier, Customer dashboards
- Real-time order tracking
- AI document upload and verification

---

## 🔑 Environment Variables

See `apps/web/.env.example` for the complete list.

### Required for Production
- `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `PAYSTACK_SECRET_KEY` (Nigerian payments)
- `STRIPE_SECRET_KEY` (International payments)
- `OPENAI_API_KEY` or `GROQ_API_KEY` (AI features)

---

## 📊 API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/hs-code` | POST | AI HS Code classification |
| `/api/shipping` | POST | Get carrier rates |
| `/api/escrow` | GET/POST | Escrow management |
| `/api/documents` | POST | AI document analysis |
| `/api/payments` | GET/POST | Payment initialization & verification |

---

## 🏛️ Database Schema

Key tables:
- `profiles` — All users (customers, vendors, carriers, admins)
- `products` — Products with HS codes
- `orders` — Orders with escrow tracking
- `order_items` — Individual line items
- `tracking_milestones` — Shipment tracking events
- `escrow_accounts` — Escrow release records
- `wallets` — User wallets
- `documents` — Trade document storage with AI analysis
- `carrier_bids` — Carrier job bidding
- `disputes` — Dispute resolution

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m "feat: add my feature"`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

Copyright © 2025 EKDA Technologies Ltd. All rights reserved.

---

*Built with ❤️ for Africa's traders, diaspora, and the global marketplace.*
