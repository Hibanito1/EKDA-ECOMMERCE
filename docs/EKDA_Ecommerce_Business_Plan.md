# EKDA Ecommerce Business Plan

Prepared for: EKDA Technologies Ltd.  
Prepared by: Cursor Cloud Agent  
Date: June 24, 2026  
Document type: Microsoft Word business plan source

## 1. Executive Summary

EKDA Ecommerce is a cross-border marketplace built for African trade. The app connects Nigerian exporters with global customers who want authentic African groceries, dried produce, frozen goods, and agricultural commodities. It also connects international sellers of vehicles, electronics, machinery, and general goods with Nigerian and African buyers.

The current product is a strong demo and beta foundation. It includes a Next.js web marketplace, an Expo mobile app, customer/vendor/carrier/admin dashboards, KYC onboarding, checkout, escrow visualization, B2B RFQ flows, AI assisted HS code classification, document verification simulations, landed cost calculations, loyalty features, support content, and Supabase database migrations. The primary expectation before commercial launch is to replace mock data and simulated integrations with production-grade backend, payment, AI, storage, compliance, and operations systems.

EKDA's business goal is to become the trusted trade layer between African supply, diaspora demand, and global import channels. The company can generate revenue from marketplace commission, B2B account tiers, logistics coordination margin, premium vendor services, promoted listings, AI compliance services, document verification, market intelligence, and enterprise trade support.

## 2. Company and Product Overview

### Vision

To make African cross-border commerce trusted, transparent, and accessible for consumers, businesses, vendors, carriers, and enterprises.

### Mission

EKDA helps verified African and international sellers trade across borders by combining marketplace discovery, secure payments, escrow, logistics selection, compliance automation, and operational oversight in one platform.

### Product Format

| Product area | Current implementation |
| --- | --- |
| Web application | Next.js 15 app with marketplace, cart, checkout, dashboards, B2B, blog, help, privacy, and terms pages |
| Mobile application | Expo React Native app with auth, home, export, import, cart, AI chat, and account tabs |
| Shared packages | Shared TypeScript types, constants, utilities, Supabase client helpers, and config packages |
| Database foundation | Supabase migrations for profiles, products, orders, escrow, KYC, documents, disputes, payouts, audit logs, and operations tables |
| API layer | Route handlers for AI chat, HS code, shipping, escrow, payments, documents, KYC, consent, risk scoring, demand forecasting, loyalty, landed cost, health, and audit |

## 3. Market Problem and Opportunity

Cross-border African commerce is difficult because buyers and sellers face trust, logistics, payment, documentation, and customs challenges. Many transactions happen informally, which creates fraud risk, unclear delivery timelines, weak dispute resolution, and limited visibility into true landed cost.

### Core Problems

- Diaspora buyers struggle to reliably source authentic African food and groceries.
- Nigerian exporters have limited digital access to global customers and bulk buyers.
- Nigerian importers often deal with fragmented sourcing, customs, and logistics workflows.
- Buyers lack confidence that vendors, carriers, and documents are verified.
- Vendors lack tools for HS code classification, trade documents, and cargo restrictions.
- Importers often discover duties, taxes, clearing fees, and shipping costs too late.
- Carriers and logistics providers are not always integrated into marketplace checkout.

### Opportunity

EKDA can become the default trusted marketplace for African exports and Nigeria-focused imports by offering a single flow for discovery, compliance, escrow, logistics, and dispute resolution. The opportunity is strongest where trust and compliance create a high barrier to repeat transactions: diaspora grocery demand, agri-commodity exports, used vehicle imports, electronics, machinery, and enterprise bulk procurement.

## 4. Solution and Value Proposition

EKDA offers a two-way marketplace:

1. Export marketplace: Nigerian and African vendors list groceries, dried produce, frozen produce, and agricultural commodities for global and diaspora customers.
2. Import marketplace: International vendors list vehicles, electronics, machinery, and general goods for Nigerian and African buyers.

### Value by Stakeholder

| Stakeholder | Value delivered |
| --- | --- |
| Customers | Verified vendors, secure escrow, product discovery, cart, checkout, shipping options, order tracking, loyalty, and support |
| Vendors | Digital storefront, AI HS code support, KYC verification, analytics, demand forecasting, premium plans, bulk pricing, and payouts |
| Carriers | Access to trade shipments, carrier assignment flows, route visibility, and milestone-based delivery confirmation |
| Enterprises | RFQ workflows, volume pricing, contract support, API access, full-container support, and dedicated account services |
| Admin team | KYC review, disputes, financial oversight, AI monitoring, analytics, user management, announcements, and system health views |

### Differentiators

- Escrow release model that protects both buyer and vendor.
- AI supported HS code and document workflows to reduce compliance friction.
- Cross-border logistics awareness, including air cargo restrictions and freight recommendations.
- Multi-role platform covering customers, vendors, carriers, enterprise buyers, and admins.
- B2B tiering for SME, enterprise, government, and NGO accounts.
- Built-in consent, audit, privacy, and compliance structures.

## 5. Current App Scope Built

The current repository includes a production-ready structure with realistic UI and simulated flows. The following scope has been built:

| Area | Current status | Business meaning |
| --- | --- | --- |
| Marketplace pages | Export and import catalog pages with search, categories, product cards, ratings, HS code badges, and cargo guidance | Shows the core buying experience and merchandising strategy |
| Cart and checkout | Multi-step delivery, carrier, payment, and confirmation flow | Demonstrates order conversion flow and escrow-ready checkout |
| Escrow model | Visual lifecycle and API route simulation | Communicates trust model and payout logic |
| Authentication UI | Login, register, role selection, and demo login support | Enables role-based onboarding concept |
| KYC onboarding | Multi-step vendor/carrier KYC UI and API structure | Supports trust, compliance, and marketplace quality control |
| Admin dashboard | KYC, disputes, financial, analytics, AI monitoring, users, marketing, export, announcements, and system sections | Provides operational control center |
| Vendor dashboard | Product, analytics, documents, HS code, notifications, and premium sections | Supports seller operations and monetization |
| AI features | Simulated AI chat, HS code, risk scoring, demand forecast, document verification, recommendations, and price intelligence | Demonstrates compliance and intelligence value proposition |
| B2B portal | Account tiers, RFQ form, enterprise features, and business service positioning | Opens higher-value enterprise sales motion |
| Mobile app | Expo app with key marketplace and account flows | Gives EKDA mobile reach for buyers and sellers |
| Database migrations | Core schema, KYC/consent/audit, admin/operations extensions | Provides production data model foundation |
| Security and compliance | Middleware, headers, rate limit structure, consent records, audit logs, privacy and terms pages | Establishes production security direction |

## 6. Business Model and Revenue Streams

EKDA's revenue model should combine transactional take rate, value-added services, and enterprise accounts.

| Revenue stream | Description | Current product signal |
| --- | --- | --- |
| Marketplace commission | Default commission on order subtotal. Current shared constants define a 10 percent EKDA commission. | `EKDA_COMMISSION_RATE = 0.1` |
| B2B commission tiers | Lower take rates for high-volume accounts: SME 8 percent, enterprise 6 percent, government/NGO 5 percent. | B2B page includes account tiers and RFQ flow |
| Premium vendor plans | Monthly or annual subscriptions for analytics, priority listing, lower commission, storefront upgrades, and support. | Vendor premium dashboard exists |
| Promoted listings | Vendors pay to feature products in category pages, search results, or seasonal campaigns. | Marketplace UI supports product merchandising |
| Logistics coordination margin | EKDA earns a margin or referral fee from carrier selection, customs clearing partners, and shipping services. | Checkout includes carrier selection and landed cost logic |
| Payment and escrow service fee | Additional buyer or vendor fee for secure escrow, split payout, and dispute handling. | Escrow model is central to product trust |
| AI compliance services | Paid HS classification, risk scoring, demand forecast, and price intelligence tools for vendors and enterprises. | AI tools already exist as simulated modules |
| Document verification | Per-document fee for OCR, authenticity score, trade document checks, and admin review. | Document API and KYC flows are present |
| Market intelligence | Subscription data product for commodity trends, demand forecasts, route cost benchmarks, and import/export insights. | Price intelligence and demand forecast features exist |
| Enterprise services | Dedicated account management, API access, negotiated rates, procurement workflows, and contract support. | B2B page includes RFQ, API, FCL, and contract positioning |

### Unit Economics Framework

For each order:

- Gross merchandise value = product subtotal.
- EKDA commission = subtotal multiplied by applicable take rate.
- Gross revenue = commission plus service fees plus logistics margin plus premium/service revenue.
- Contribution margin = gross revenue minus payment processing, AI usage, customer support, chargebacks, refunds, incentives, and direct logistics coordination costs.

The business should validate these assumptions with real transaction data before publishing investor-facing financial forecasts.

## 7. Target Customers and Use Cases

| Segment | Primary need | Example use case |
| --- | --- | --- |
| Diaspora consumers | Reliable access to authentic African food products | A buyer in the UK orders dried crayfish, garri, palm oil, and herbs with escrow protection |
| Nigerian exporters | International demand, compliance support, and secure payments | A Lagos vendor lists dried produce and uses AI HS classification before export |
| Nigerian import buyers | Trusted sourcing for vehicles, electronics, and machinery | A buyer imports a used vehicle with landed cost visibility and sea freight guidance |
| International vendors | Access to Nigerian and African buyers | A vendor in China, UAE, Germany, UK, or USA lists electronics, vehicles, or machinery |
| Carriers and freight partners | Shipment demand and milestone-based jobs | A carrier confirms pickup and destination arrival to trigger escrow release |
| Enterprises and NGOs | Bulk sourcing, RFQ, procurement, and compliance | A buyer requests several tons of commodities or containerized goods with custom pricing |

## 8. Go-To-Market Strategy

### Supply Acquisition

- Onboard Nigerian vendors in high-demand categories: dried seafood, garri, palm oil, spices, herbs, fermented condiments, frozen produce, and agri-commodities.
- Recruit trusted international vendors for vehicles, electronics, machinery, and general goods.
- Require KYC and document verification before production trading.
- Offer early vendor incentives such as reduced commission, premium trial, and listing support.

### Demand Acquisition

- Target diaspora communities in the UK, USA, Canada, Europe, and Australia with authentic African grocery campaigns.
- Build content around "how to import to Nigeria", "how escrow protects buyers", "HS code basics", and "landed cost explained".
- Launch referral and loyalty programs for repeat customers.
- Use B2B outreach for SMEs, procurement teams, restaurants, African grocery stores, exporters, NGOs, and bulk commodity buyers.

### Partnership Strategy

- Payment partners: Paystack, Stripe, Monnify, and bank transfer providers.
- Logistics partners: DHL, FedEx, Maersk, local Nigerian logistics companies, clearing agents, freight forwarders, and cold-chain carriers.
- Compliance partners: customs brokers, legal advisors, trade document verification providers, and insurance partners.
- Growth partners: African community associations, grocery retailers, student associations, import/export consultants, and chambers of commerce.

## 9. Operations Plan

### Core Operating Workflows

1. User onboarding: Customers, vendors, carriers, enterprises, and admins register with role-specific flows.
2. KYC and verification: Vendors and carriers submit identity, business, tax, bank, and document information for admin approval.
3. Product listing: Vendors create products with price, category, HS code, origin, weight, cargo recommendation, images, bulk pricing, and document requirements.
4. Product discovery: Buyers search, filter, compare, and add products to cart.
5. Checkout: Buyers provide destination, select carrier, select payment method, and confirm total cost.
6. Payment and escrow: Customer payment is held in escrow until shipment milestones are confirmed.
7. Logistics: Carrier pickup and destination arrival trigger payout events.
8. Disputes: Admins review evidence, mediate messages, and resolve within the product's stated 72 hour dispute SLA.
9. Payouts: Vendor and carrier payments are processed after commission, refunds, and dispute rules are applied.
10. Support: Help center, notifications, email/SMS, and customer service teams support the transaction lifecycle.

### Escrow Business Rule

The platform currently documents this escrow structure:

- Customer pays 100 percent into EKDA escrow.
- Carrier confirms pickup, then 50 percent of vendor share is released after EKDA commission is accounted for.
- Carrier confirms destination arrival, then remaining vendor share is released.
- Admin overrides require dual-admin approval.

## 10. Technology and Product Architecture

### Current Architecture

| Layer | Implementation |
| --- | --- |
| Monorepo | Turborepo with web, mobile, shared, database, and config packages |
| Web | Next.js App Router, React, Tailwind, Zustand, Framer Motion, Radix UI |
| Mobile | Expo Router, React Native, NativeWind, Zustand, Supabase client |
| Database | Supabase PostgreSQL schema and TypeScript database types |
| APIs | Next.js route handlers for commerce, AI, payments, KYC, consent, and operations |
| State | Zustand stores for cart, chat, loyalty, and preferences |
| Security | Security headers, rate limiting structure, audit logs, consent records, and Supabase RLS direction |
| Monitoring direction | Sentry and PostHog integration stubs |

### Key Data Domains

- Users and profiles.
- Products and HS codes.
- Orders and order items.
- Escrow accounts and payment records.
- Tracking milestones and carrier bids.
- KYC applications and documents.
- Consent records and audit logs.
- Disputes, refunds, payouts, and commission adjustments.
- AI usage logs, promo codes, announcements, and operational documents.

## 11. Production Expectations and Go-Live Requirements

The current app should be treated as a demo-ready foundation until the following requirements are completed.

### Critical Go-Live Requirements

| Requirement | Expected outcome |
| --- | --- |
| Supabase connection | Replace mock data with real queries for products, users, orders, KYC, escrow, dashboards, loyalty, disputes, and payouts |
| Supabase Auth | Protect dashboard routes, load role from real session, enforce admin/vendor/carrier/customer permissions |
| Row Level Security | Apply and test Supabase RLS policies for all sensitive tables |
| Payment gateways | Integrate Paystack, Stripe, Monnify, payment verification, and production webhook handlers |
| Escrow and payouts | Implement real escrow state transitions, payout calculations, transfer APIs, refunds, and dual-admin overrides |
| AI services | Replace simulated AI with Groq or OpenAI integrations for chat, HS classification, documents, risk, and forecasting |
| Document storage | Create Supabase Storage buckets for KYC documents, product images, and trade documents with secure access policies |
| Logistics integrations | Replace static carrier options with partner APIs, negotiated rates, route logic, and milestone confirmations |
| Notifications | Wire email, SMS, push notifications, and in-app alerts for KYC, orders, payments, disputes, and RFQs |
| Rate limiting | Replace in-memory limiter with production Redis or Upstash-backed rate limits |
| Monitoring | Enable Sentry, PostHog, structured logs, uptime checks, and incident alerts |
| Legal review | Review privacy policy, terms, escrow terms, KYC/AML process, NDPR/GDPR wording, refund terms, and carrier/vendor contracts |
| Production deployment | Configure Vercel, EAS builds, environment variables, backups, domains, SSL, and release process |
| QA acceptance | Run end-to-end tests for registration, KYC, browsing, checkout, escrow, disputes, admin approval, and mobile smoke tests |

### Acceptance Criteria Before Launch

- Users can register, verify email/phone if required, and access only their permitted dashboards.
- Vendors and carriers cannot trade until KYC is approved.
- Products persist in the database and support images, HS codes, categories, stock, pricing, and cargo rules.
- Checkout creates a real order, initializes payment, verifies payment, and creates escrow records.
- Payment webhooks update order and escrow state exactly once.
- Carrier milestone confirmations are auditable and trigger correct payout logic.
- Admins can approve KYC, review disputes, manage payouts, view analytics, and audit sensitive actions.
- Buyers receive clear total cost, shipping option, refund terms, and order tracking status.
- Logs, analytics, and alerts show production health and transaction errors.

## 12. Financial Planning Framework

The app does not yet include real transaction data, so financial forecasts should be built from validated operating assumptions. The initial model should track:

| Financial input | Definition |
| --- | --- |
| GMV | Total value of goods sold through the platform |
| Take rate | Commission percentage by customer type and tier |
| Service fees | Escrow, document verification, AI, premium account, and logistics service fees |
| Average order value | Average transaction size by export, import, and B2B category |
| Repeat purchase rate | Percentage of customers making repeat purchases |
| Vendor activation rate | Percentage of onboarded vendors who list approved products and receive orders |
| Payment cost | Gateway fees, chargebacks, refunds, and failed payment handling |
| AI cost | Cost per HS code, chat, document scan, risk score, or forecast call |
| Support cost | Cost per ticket, dispute, KYC review, and RFQ handling |
| Logistics margin | Net revenue from shipping coordination after partner costs |

### Cost Categories

- Product and engineering.
- Cloud hosting, database, storage, monitoring, and analytics.
- Payment processing and fraud tools.
- AI API usage.
- Customer support and dispute operations.
- Vendor onboarding and quality assurance.
- Logistics partner management.
- Legal, compliance, audit, insurance, and licensing.
- Marketing, content, community partnerships, and referrals.

## 13. Key Performance Indicators

### Marketplace KPIs

- GMV by export, import, and B2B category.
- Number of active buyers, vendors, carriers, and enterprises.
- Product listings approved per week.
- Search-to-product-view conversion.
- Product-view-to-cart conversion.
- Cart-to-checkout conversion.
- Checkout completion rate.
- Average order value.
- Repeat purchase rate.
- Refund and dispute rate.

### Trust and Compliance KPIs

- KYC approval rate.
- KYC rejection or flagged rate.
- Time from KYC submission to admin decision.
- Percentage of products with verified HS codes.
- AI HS code confidence and admin override rate.
- Document verification pass rate.
- Chargeback rate.
- Fraud/risk score distribution.

### Operations KPIs

- Carrier pickup confirmation rate.
- On-time delivery rate.
- Escrow release accuracy.
- Vendor payout completion rate.
- Support first response time.
- Dispute resolution within SLA.
- RFQ response within 4 business hours.
- System uptime and API error rate.

## 14. Risks and Mitigation

| Risk | Potential impact | Mitigation |
| --- | --- | --- |
| Fraudulent vendors or carriers | Buyer loss, chargebacks, reputation damage | Enforce KYC, document checks, admin review, risk scoring, escrow, and vendor ratings |
| Customs or regulatory issues | Delays, seized goods, fines, customer dissatisfaction | Verify HS codes, trade documents, restricted goods, and use customs partners |
| Payment failures or chargebacks | Revenue loss and operational burden | Webhook verification, fraud checks, clear refund terms, and payment reconciliation |
| Logistics delays | Poor customer experience and disputes | Carrier SLAs, milestone tracking, proactive notifications, and backup partners |
| Quality control issues | Refunds, disputes, vendor churn | Vendor standards, product reviews, evidence collection, and dispute workflows |
| Marketplace liquidity | Buyers or sellers cannot find enough value | Focus launch categories, seed supply, run targeted acquisition, and build B2B pipeline |
| Data privacy breach | Legal exposure and trust loss | Supabase RLS, least privilege access, audit logs, encryption, monitoring, and incident plan |
| AI errors | Misclassification, wrong advice, compliance risk | Human review for high-risk outputs, confidence thresholds, audit logs, and fallback rules |
| Currency volatility | Margin loss and pricing confusion | Live FX rates, price validity windows, clear landed cost estimates, and treasury controls |

## 15. Team and Responsibilities Expected

| Function | Expected responsibility |
| --- | --- |
| Product leadership | Prioritize launch scope, validate market assumptions, own roadmap, and define KPIs |
| Engineering | Connect backend systems, harden security, integrate payments, ship production builds, and maintain reliability |
| Compliance and legal | Review KYC/AML, escrow terms, customs rules, privacy, NDPR/GDPR, contracts, and dispute policies |
| Operations | Manage KYC review, vendor approval, carrier onboarding, disputes, payouts, and quality control |
| Finance | Reconcile payments, commissions, payouts, refunds, chargebacks, and revenue reporting |
| Vendor success | Onboard sellers, train vendors, improve listings, resolve seller issues, and manage premium accounts |
| Logistics partnerships | Negotiate rates, connect carriers, manage SLAs, and coordinate customs/clearing partners |
| Customer support | Handle buyer inquiries, disputes, order tracking, refunds, and help center updates |
| Growth and marketing | Acquire vendors, buyers, and enterprises through content, partnerships, referrals, and paid campaigns |

## 16. Recommended Execution Phases

### Phase 1: Production Foundation

- Connect Supabase Auth, RLS, database queries, and storage.
- Replace mock product, dashboard, KYC, order, and user data.
- Add production environment variables and deployment configuration.
- Build basic end-to-end tests for auth, product browsing, cart, and checkout.

### Phase 2: Payments, Escrow, and Logistics

- Integrate Paystack, Stripe, Monnify, and webhook verification.
- Implement real order creation, escrow records, payout calculations, refunds, and disputes.
- Wire carrier selection to real or partner-provided rates.
- Add transaction reconciliation and finance reporting.

### Phase 3: AI and Compliance Operations

- Replace simulated HS code, chatbot, document verification, risk scoring, and demand forecast logic with production AI services.
- Add human review for high-risk AI outputs.
- Track AI usage, cost, accuracy, confidence, and override rates.
- Complete legal review of terms, privacy, escrow, KYC, refund, and vendor/carrier agreements.

### Phase 4: Mobile and Customer Experience

- Prepare Expo production builds.
- Add push notifications, deep links, saved preferences, and production auth.
- Improve mobile checkout and order tracking.
- Complete app store assets, QA, and release checks.

### Phase 5: Enterprise and Data Products

- Expand RFQ workflow into contract management.
- Add enterprise account approvals, team roles, net terms, and API access.
- Package market intelligence dashboards and data subscriptions.
- Formalize account management and quarterly business review process.

## 17. Appendix: What Is Expected From Stakeholders

### Founders and Business Owners

- Confirm launch categories and priority markets.
- Approve commission, escrow, refund, and dispute policies.
- Secure payment, logistics, legal, and compliance partners.
- Define business targets and funding requirements.

### Engineering Team

- Convert demo flows into persistent production workflows.
- Implement secure payment and escrow handling.
- Complete API integrations, monitoring, and release process.
- Maintain tests and technical documentation.

### Operations Team

- Create KYC review playbooks and vendor quality standards.
- Define support scripts, refund rules, and dispute evidence requirements.
- Build carrier onboarding and logistics escalation processes.
- Track operational KPIs and report exceptions.

### Vendors and Carriers

- Complete KYC and provide accurate business, bank, product, and document information.
- Follow listing, packaging, shipment, document, and communication requirements.
- Confirm shipment milestones truthfully and on time.

### Customers and Enterprises

- Provide accurate delivery, identity, and payment details.
- Review landed cost, delivery method, refund terms, and restricted cargo guidance before ordering.
- Raise disputes promptly with clear evidence when problems occur.

## 18. Conclusion

EKDA already has the product shape of a credible cross-border ecommerce platform. The app demonstrates a differentiated marketplace with escrow trust, AI compliance assistance, logistics awareness, B2B workflows, and role-based operations. The expected next step is not to redesign the concept, but to harden the platform: connect real data, real payments, real AI, real storage, real logistics, real legal review, and real operational controls.

If those expectations are met, EKDA can move from a demo-ready marketplace foundation to a production business that supports trusted African exports, Nigeria-focused imports, and enterprise cross-border trade.
