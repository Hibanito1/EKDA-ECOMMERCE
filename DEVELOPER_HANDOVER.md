# EKDA Ecommerce — Developer Handover Document

**Date**: June 1, 2025  
**Version**: 1.0.0-beta  
**Prepared by**: EKDA AI Engineering Team  
**For**: Human Development Team

---

## 🎯 What Has Been Built

This monorepo contains a production-ready foundation for Africa's premier cross-border marketplace. All core features are implemented as **high-quality UI with realistic simulations and proper hooks** — the main work for human developers is to wire the real backend integrations.

### Completed (✅ Production-Ready Structure)

| Feature | Status | Notes |
|---------|--------|-------|
| Turborepo monorepo setup | ✅ Complete | Web + Mobile + 3 shared packages |
| Next.js 15 web app (45+ routes) | ✅ Complete | All pages, layouts, components |
| Expo React Native mobile app | ✅ Complete | 6-tab navigation, key screens |
| Authentication UI (login, register, role selection) | ✅ UI Complete | Needs Supabase Auth wiring |
| Two-way marketplace (Export + Import) | ✅ Complete | Needs real product API |
| Cart and Checkout flow | ✅ UI Complete | Needs payment gateway live keys |
| Escrow visualization | ✅ Complete | Needs Supabase + payment webhook |
| KYC 5-step form | ✅ UI Complete | Needs Supabase Storage + real AI |
| Admin Dashboard (10 sections) | ✅ Complete | Needs real data queries |
| AI HS Code Engine | ✅ Simulated | Needs GROQ_API_KEY |
| AI Chatbot | ✅ Simulated | Needs GROQ_API_KEY |
| Document Verification | ✅ Simulated | Needs OpenAI Vision API |
| Risk Scoring | ✅ Rule-based | Can upgrade to ML model |
| Demand Forecasting | ✅ Simulated | Needs historical data |
| Loyalty Program | ✅ UI Complete | Needs Supabase points tables |
| GDPR/NDPR Consent System | ✅ Complete | Needs Supabase consent_records |
| Privacy Policy & Terms | ✅ Complete | Legal review recommended |
| Security Headers + Rate Limiting | ✅ Complete | Upgrade rate limiter to Upstash |
| Error Boundaries + Logging | ✅ Complete | Wire Sentry |
| i18n Structure | ✅ Structure | Add Yoruba/Igbo/Hausa dictionaries |
| Blog with 3 articles | ✅ Complete | Add more content |
| Help Center + FAQ | ✅ Complete | Real ticket system needed |
| PWA Manifest | ✅ Complete | Add real icons in /public/icons/ |
| Database Schema (3 migrations) | ✅ Complete | Run in Supabase |

---

## 🔥 Critical: What MUST Be Done Before Go-Live

### 1. Connect Supabase (BLOCKER)
All data operations currently use mock data. You need to:

```typescript
// Currently in most API routes:
// return NextResponse.json(mockData);

// Replace with:
const supabase = createSupabaseServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
const { data, error } = await supabase.from("products").select("*");
```

**Files that need real Supabase queries:**
- `src/app/api/kyc/route.ts` — save KYC to `kyc_applications`
- `src/app/api/escrow/route.ts` — update `orders` and `escrow_accounts`
- `src/app/api/payments/route.ts` — save payment to `orders`
- `src/app/api/documents/route.ts` — upload to Supabase Storage
- `src/app/api/loyalty/route.ts` — update `wallets` and add loyalty points table
- All dashboard pages — replace `MOCK_*` arrays with `supabase.from(...)` queries

### 2. Wire Real Payment Gateways (BLOCKER)

**Paystack (Nigeria):**
```typescript
// Install: npm install @paystack/paystack-sdk
import Paystack from "@paystack/paystack-sdk";
const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);
const response = await paystack.transaction.initialize({
  email, amount: total * 100, reference: orderId
});
```

**Stripe (International):**
```typescript
// Install: npm install stripe
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [...],
  mode: "payment",
  success_url: `${origin}/checkout/success`,
});
```

**Webhook handlers needed** in `src/app/api/payments/webhook/route.ts` for escrow trigger events.

### 3. Connect Real AI (BLOCKER for AI features)

**Groq AI:**
```typescript
// Install: npm install groq-sdk
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const completion = await groq.chat.completions.create({
  model: "llama-3.3-70b-versatile",
  messages: [{ role: "user", content: prompt }],
});
```

**Replace simulation in:**
- `src/app/api/ai-chat/route.ts` (lines with `simulateContextualReply`)
- `src/app/api/hs-code/route.ts` (lines with `simulateAIHSCode`)

### 4. Supabase Storage for Documents (BLOCKER for KYC)

```typescript
// Upload document
const { data: uploadData } = await supabase.storage
  .from("kyc-documents")
  .upload(`${userId}/${documentType}/${filename}`, file, {
    contentType: file.type,
    upsert: false,
  });
```

Create storage buckets: `kyc-documents`, `product-images`, `trade-documents` with appropriate RLS policies.

---

## ⚠️ Tech Debt & Known Issues

### High Priority
1. **Rate Limiter**: Currently in-memory (resets on restart). Replace with [Upstash Redis](https://upstash.com/):
   ```bash
   npm install @upstash/ratelimit @upstash/redis
   ```
2. **Mock Data**: All dashboard components use hardcoded arrays — replace with real queries
3. **Auth State**: `dashboard/layout.tsx` has hardcoded `role = "vendor"` — wire to Supabase session
4. **Escrow**: The escrow release logic in `src/app/api/escrow/route.ts` is simulated — needs real Paystack Transfer API calls
5. **Admin Layout**: `collapsed` state in admin sidebar isn't persisted — add localStorage

### Medium Priority
6. **Real-time Updates**: Supabase Realtime subscriptions not yet wired. Add to:
   - Admin dashboard live activity feed
   - Order tracking milestones
   - Dispute chat messages
7. **Image Uploads**: Product images currently use Unsplash URLs — replace with Supabase Storage
8. **Push Notifications**: Expo Push Tokens need to be collected and stored
9. **Email/SMS**: Use Resend (email) and Termii (SMS) for KYC notifications, order updates
10. **Currency Conversion**: Live forex rates not implemented — currently static estimates

### Low Priority
11. **PWA Icons**: `/public/icons/` directory needs actual PNG icons generated
12. **Blog Content**: Only 3 articles + metadata — needs a CMS or more static content
13. **i18n Completion**: Yoruba, Igbo, Hausa, French dictionaries only have English fallback
14. **Mobile Offline Mode**: WatermelonDB not yet integrated
15. **AR Preview**: Placeholder concept only — needs AR.js or Viro integration

---

## 🧪 Critical Flows to Test Before Launch

### 1. Full Order Flow (E2E)
```
Register as Customer → Browse Marketplace → Add to Cart → 
Checkout (Delivery → Carrier → Payment → Confirm) → 
Order appears in dashboard → Vendor sees order → Carrier assigned → 
Pickup confirmed → Escrow 1st release verified → 
Delivery confirmed → Escrow 2nd release verified
```

### 2. Vendor KYC to Active Listing
```
Register as Vendor → Complete 5-step KYC → Upload documents → 
Admin receives KYC notification → Admin reviews + approves → 
Vendor receives approval notification → Vendor lists product → 
AI assigns HS code → Product visible in marketplace
```

### 3. Dispute Resolution
```
Customer receives damaged goods → Customer opens dispute → 
Admin assigns to dispute team → Mediation chat opened → 
Evidence reviewed → Admin resolves in customer's favor → 
Escrow refunded to customer → Audit log created
```

### 4. Payment Gateway Verification
- Test Paystack with test cards: `4084 0840 8408 4081` (success)
- Test Stripe with: `4242 4242 4242 4242` (success)
- Verify webhook receipt and escrow state transitions

### 5. Admin Security
- Verify admin routes are protected (`/dashboard/admin/*`)
- Test that regular users cannot access admin pages
- Verify KYC override requires dual-admin approval

---

## 🏗️ Architecture Decisions & Rationale

| Decision | Rationale |
|----------|-----------|
| **Turborepo monorepo** | Shared types prevent drift between web and mobile; shared packages reduce duplication |
| **Next.js App Router** | Server components for SEO, client components for interactivity |
| **Supabase** | PostgreSQL + Auth + Storage + Realtime in one service; generous free tier |
| **Zustand for state** | Lightweight vs Redux; perfect for cart, loyalty, and chat state |
| **In-memory rate limiter** | Pragmatic for initial launch; swap to Upstash when scaling |
| **10% commission** | Standard African marketplace rate; adjustable per vendor tier |
| **50/50 escrow split** | Balances vendor risk (50% guaranteed at pickup) vs buyer protection |
| **HS Code AI** | Automates compliance; reduces vendor friction; monetizable feature |

---

## 🌍 Environment Setup for Each Team Member

```bash
# 1. Clone
git clone https://github.com/Hibanito1/EKDA-ECOMMERCE.git
cd ekda-ecommerce

# 2. Install (use legacy-peer-deps due to React 19 + expo peer dep resolution)
npm install --legacy-peer-deps

# 3. Copy env
cp apps/web/.env.example apps/web/.env.local
# Fill in your Supabase credentials (minimum required)

# 4. Run
npm run dev
```

---

## 📞 Handover Contacts

| Role | Responsibility | Contact |
|------|---------------|---------|
| Backend Lead | Supabase schema, RLS policies, edge functions | TBD |
| Frontend Lead | Component refinement, real API integration | TBD |
| Mobile Lead | Expo enhancements, push notifications, offline mode | TBD |
| DevOps | Vercel deployment, EAS build, monitoring | TBD |
| Legal | Privacy policy review, NDPR compliance sign-off | TBD |

---

## 📈 Recommended First Sprint (Post-Handover)

**Sprint 1 (Week 1-2): Core Integration**
1. Wire Supabase Auth to all protected routes
2. Replace mock product data with real Supabase queries
3. Integrate Paystack test mode for Nigerian payments
4. Wire KYC documents to Supabase Storage

**Sprint 2 (Week 3-4): Payments & Escrow**
1. Integrate Stripe for international payments
2. Implement real Paystack Transfer for vendor payouts
3. Build payment webhook handlers
4. Wire escrow release triggers to payment gateway

**Sprint 3 (Week 5-6): AI & Operations**
1. Replace simulated AI with Groq API calls
2. Set up Supabase Realtime for live feed
3. Add push notification support (Expo)
4. Set up Sentry and PostHog in production

**Sprint 4 (Week 7-8): Mobile + Polish**
1. Expo production builds (EAS)
2. App Store submission preparation
3. Mobile offline mode (WatermelonDB)
4. Performance optimization + bundle analysis

---

*This handover document was generated by the EKDA AI Engineering Team. Last updated: June 1, 2025.*
