# EKDA Ecommerce — Testing Guide

**Version**: 1.0.0-beta | **Mode**: Demo (All payments simulated)

---

## 🎭 Demo Mode Overview

Demo mode allows full testing of all features **without real credentials, real payments, or real documents**.

**Enable Demo Mode:**
```bash
# Set in apps/web/.env.local:
NEXT_PUBLIC_DEMO_MODE=true
```

When active, a purple banner at the top of the app shows with one-click credential access.

---

## 🔑 Demo Login Credentials

All accounts use password: **`Demo@12345`**

| Role | Email | Password | Dashboard Access |
|------|-------|----------|-----------------|
| **Customer** | `demo.customer@ekda.io` | `Demo@12345` | `/dashboard/customer` |
| **Vendor** | `demo.vendor@ekda.io` | `Demo@12345` | `/dashboard/vendor` |
| **Carrier** | `demo.carrier@ekda.io` | `Demo@12345` | `/dashboard/carrier` |
| **Enterprise** | `demo.enterprise@ekda.io` | `Demo@12345` | `/dashboard/customer` |
| **Admin** | `demo.admin@ekda.io` | `Demo@12345` | `/dashboard/admin` |

### Quick Login (API)
```bash
curl -X POST http://localhost:3000/api/demo/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo.vendor@ekda.io","password":"Demo@12345"}'
```

---

## 🧪 Key Test Flows

### Flow 1: Customer — Browse to Checkout (Full Escrow)

1. **Login** as `demo.customer@ekda.io`
2. **Browse** → `/marketplace/export` → Search "crayfish"
3. **Add to cart** → Click the `+` button on any product
4. **Checkout** → `/cart` → Proceed to Checkout
5. **Select delivery** → Enter any UK address (demo)
6. **Choose carrier** → Select Maersk Line (sea freight)
7. **Select payment** → Choose Paystack (demo — no real charge)
8. **Place order** → See success animation with escrow confirmation

**Expected**: Order created, escrow shown as "held", order appears in customer dashboard

---

### Flow 2: Vendor — Add Product with AI HS Code

1. **Login** as `demo.vendor@ekda.io`
2. **Navigate** → Dashboard → HS Codes AI
3. **Enter description**: "Sun-dried crayfish from Lagos waterway, rich in protein"
4. **Click "Classify with AI"** → See HS code 0306.17 suggested at 97% confidence
5. **Try another**: "2021 Toyota Camry petrol sedan" → Gets 8703.23 + air cargo restriction

**Expected**: AI returns correct HS codes with confidence scores, air restriction detected for vehicles

---

### Flow 3: Vendor — KYC Flow

1. **Login** as `demo.vendor@ekda.io`
2. **Navigate** → `/onboarding/kyc?role=vendor`
3. **Step 1**: Fill in personal info (any data)
4. **Step 2**: Upload any image as ID (demo AI will score it 94%+)
5. **Step 3**: Fill business details (any CAC number like RC1234567)
6. **Step 4**: Upload any image as address proof
7. **Step 5**: Fill bank details, upload bank statement
8. **Step 6**: Review and submit

**Expected**: KYC submitted, admin notified, AI scores appear on documents

---

### Flow 4: Admin — KYC Approval Queue

1. **Login** as `demo.admin@ekda.io`
2. **Navigate** → Admin Dashboard → KYC Queue (`/dashboard/admin/kyc`)
3. **Review pending application** from Flow 3 above
4. **Expand application** → See AI risk score, documents
5. **Click "Approve KYC"** → Add admin notes → Confirm
6. **Verify**: Vendor receives notification (shown in demo)

**Expected**: KYC status updates, vendor notified, appears in approved list

---

### Flow 5: Escrow Demo Simulation

1. **Navigate** → `/escrow-demo` (public page, no login needed)
2. **Click "Start Demo"** → Watch animated escrow lifecycle:
   - Payment held (₦196,500)
   - Carrier confirmed pickup → 50% released (₦76,500)
   - Destination arrival → Final 50% released (₦76,500)
   - EKDA commission: ₦17,000 (10%)
3. **Verify**: Balance counters animate in real-time

**Expected**: Full escrow simulation plays with realistic timing and amounts

---

### Flow 6: AI Chatbot

1. **Any page** → Click the floating robot button (bottom right)
2. **Test queries**:
   - "Find me dried crayfish under ₦10,000"
   - "How much to ship 20kg to London?"
   - "How does escrow work?"
   - "Show me halal products"
   - "How to import a car to Nigeria?"

**Expected**: Contextual responses with product cards and quick reply suggestions

---

### Flow 7: Total Landed Cost Calculator

1. **Navigate** → `/marketplace/import` → Any product → Or `/b2b`
2. **Or use tool directly** in vendor dashboard
3. **Enter**: Product price ₦18,500,000 (a car), Weight 1500kg, HS Code 8703.23
4. **Select**: Sea freight, Apapa Port, Comprehensive insurance
5. **Click Calculate**

**Expected**: Full breakdown: customs duty 35%, port levy 7%, VAT 7.5%, clearing fees, total landed cost

---

### Flow 8: Admin Command Center

1. **Login** as `demo.admin@ekda.io`
2. **Review each section**:
   - `/dashboard/admin` — KPI cards, live activity feed, system health
   - `/dashboard/admin/disputes` — Open dispute modal, try mediation chat
   - `/dashboard/admin/financial` — Select payouts, batch process
   - `/dashboard/admin/ai-monitor` — Service cards, override log
   - `/dashboard/admin/analytics` — Switch between GMV/Products/Countries/Cohorts
   - `/dashboard/admin/kyc` — Filter, expand, approve/reject

---

### Flow 9: B2B RFQ Submission

1. **Navigate** → `/b2b`
2. **Scroll to RFQ form** → Fill company details, select "Agri Commodities"
3. **Enter quantity**: "5 tons of cocoa beans"
4. **Submit RFQ**

**Expected**: Success confirmation, sales team contact promise

---

### Flow 10: Loyalty Program

1. **Login** as `demo.customer@ekda.io`
2. **Navigate** → Dashboard → Loyalty & Rewards (`/dashboard/customer/loyalty`)
3. **View tier card** → Silver (2,450 points shown)
4. **Try redemption** → Click "Free Air Shipping" (2000 pts) → Should succeed
5. **Check referral code** → `EKDA-AO2024` → Try copy

---

## ⚠️ Known Limitations in Demo Mode

### Payment Processing
- **All payments are simulated** — no real Paystack/Stripe/Monnify charges
- Payment redirects show demo URLs (e.g., `checkout.paystack.com/demo_...`)
- No actual bank account charges will occur

### Authentication
- Demo users are not persisted in any database
- Logging out returns to login page — session not stored between refreshes
- Password reset / email verification not functional in demo mode

### AI Features
- HS Code AI: Keyword-matching only (not full Groq LLM)
- AI Chatbot: Pre-defined response tree (not live Groq API)
- Document Verification: Simulated confidence scores (no real OCR)
- Demand Forecasting: Static mock data

### Real-Time Features
- Supabase Realtime not connected — live activity feed uses static data
- Push notifications: Not functional without real Expo credentials
- Email/SMS: Not sent (Resend/Termii not configured)

### Maps & External APIs
- Shipment tracking map: Placeholder
- Carrier API rates: Simulated
- Exchange rates: Static values

### Admin Actions
- KYC approve/reject: Updates UI state only (not persisted)
- Payout processing: Simulated
- User suspension: UI-only changes

---

## 🌐 Web App — Local Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Copy demo environment
cp apps/web/.env.demo apps/web/.env.local

# Start development server
cd apps/web && npm run dev

# Open browser
open http://localhost:3000
```

**Or run with Turbo:**
```bash
npm run dev
```

---

## 📱 Mobile App — Local Testing

```bash
cd apps/mobile

# Install Expo Go on your device first
# iOS: https://apps.apple.com/app/expo-go/id982107779
# Android: https://play.google.com/store/apps/details?id=host.exp.exponent

# Start development server
npm start

# Scan the QR code with Expo Go app
# Or press 'a' for Android emulator, 'i' for iOS simulator
```

---

## 🤖 Android APK Build Instructions

### Prerequisites
```bash
# 1. Create Expo account at expo.dev
# 2. Login to EAS:
export PATH="$HOME/.npm-global/bin:$PATH"
eas login

# 3. Configure project (run once):
cd apps/mobile
eas build:configure
```

### Build APK (Preview Build)
```bash
cd apps/mobile

# Generate installable APK (no Play Store needed)
eas build --platform android --profile preview

# This will:
# 1. Upload code to Expo's cloud builders
# 2. Compile native Android code
# 3. Generate a signed APK
# 4. Provide a download link

# Expected build time: 8-15 minutes
```

### Build APK Locally (Faster, requires Android SDK)
```bash
cd apps/mobile

# Install local build tools
npm install -g @expo/cli

# Run local build (requires Android Studio + SDK)
npx expo run:android --device

# Or generate APK without device:
npx expo export --platform android
```

### Install APK on Android Device
```bash
# After EAS build completes, download from the link provided
# Or use ADB:
adb install ekda-marketplace.apk

# To install from device:
# 1. Enable "Unknown Sources": Settings → Security → Unknown Sources → ON
# 2. Transfer APK to device via USB or email
# 3. Tap the APK file to install
# 4. Or use: Settings → Install Unknown Apps → File Manager → Allow
```

---

## 🚀 Web Deployment — Vercel

### Option 1: One-Click Vercel Deployment

Click the button below (when repo is public):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Hibanito1/EKDA-ECOMMERCE)

### Option 2: Manual Vercel CLI Deployment

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy from web app directory
cd /workspace/apps/web

# 4. Deploy (follow prompts)
vercel --prod

# 5. Set environment variables
vercel env add NEXT_PUBLIC_DEMO_MODE production
# Enter: true

vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Enter your Supabase URL

# 6. Redeploy with env vars
vercel --prod
```

### Option 3: GitHub + Vercel Integration (Recommended)

1. Push code to GitHub
2. Visit [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Set root directory to `apps/web`
5. Set build command: `npm run build`
6. Add environment variables:
   - `NEXT_PUBLIC_DEMO_MODE` = `true`
   - (optional) Add real Supabase/payment keys for full functionality

---

## 📋 Quick Test Checklist

Before handing off to QA, verify these work:

- [ ] Landing page loads with all sections
- [ ] Demo banner shows and credentials are copyable
- [ ] Login with each demo role works
- [ ] Marketplace export page loads products
- [ ] Marketplace import page loads products
- [ ] Cart works (add/remove items)
- [ ] Checkout flow completes (4 steps)
- [ ] Order tracking page renders
- [ ] AI HS Code tool classifies products
- [ ] AI Chatbot responds to messages
- [ ] Vendor dashboard shows charts
- [ ] Admin dashboard KPIs load
- [ ] KYC form completes all 5 steps
- [ ] Admin KYC queue shows applications
- [ ] Dispute modal opens and chat works
- [ ] B2B RFQ form submits
- [ ] Loyalty page shows tier card
- [ ] Blog articles load
- [ ] Help FAQ expands/collapses
- [ ] Dark mode toggle works
- [ ] Mobile responsive on phone screen width

---

*For questions about test configuration, contact the development team.*
