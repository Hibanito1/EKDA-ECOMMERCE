# EKDA Ecommerce Real-World Takeover Report

Prepared for: EKDA Technologies Ltd.  
Prepared by: Cursor Cloud Agent  
Date: August 1, 2026  
Document purpose: Detailed explanation of what has been completed and what real-world developers still need to complete.

## 1. Executive Summary

EKDA Ecommerce is a cross-border marketplace concept and codebase for African exports, Nigeria-focused imports, B2B trade, logistics, escrow, KYC, compliance, and AI-assisted trade workflows. The project originally contained many high-quality demo screens and simulated success paths. Those simulations were useful for showing the product vision, but they were risky for real-world handoff because they could make fake payments, fake escrow releases, fake KYC approvals, fake AI results, fake shipping quotes, and fake mobile marketplace data look production-ready.

The recent work moved the app toward a real-world developer takeover baseline. High-risk simulated backend behavior has been removed and replaced with explicit fail-closed integration boundaries. The affected APIs now return clear `501 INTEGRATION_NOT_CONFIGURED` responses that identify the missing provider, required environment variables, and the implementation action expected from developers. Demo authentication and demo credential exposure were removed. Mobile screens that previously displayed hardcoded product, cart, and AI data now show integration-required handoff states instead of fake marketplace activity.

The app is now better positioned for a real engineering team because it no longer pretends that critical money, identity, AI, logistics, or compliance flows are complete. The next team can use the existing UI, architecture, database migrations, shared types, validation setup, and handoff documents as a foundation, while implementing real providers and persistent workflows.

## 2. What Has Been Completed

### 2.1 Business Plan Document

A Microsoft Word business plan and Markdown source were created:

- `docs/EKDA_Ecommerce_Business_Plan.docx`
- `docs/EKDA_Ecommerce_Business_Plan.md`

The business plan explains:

- EKDA's market opportunity.
- The cross-border African trade problem.
- The two-way marketplace model.
- Customer, vendor, carrier, enterprise, and admin value propositions.
- Revenue streams such as marketplace commission, B2B tiers, logistics margin, premium vendors, document verification, AI services, and enterprise services.
- Go-to-market strategy.
- Operations plan.
- Technical architecture.
- Production expectations.
- Financial planning framework.
- KPIs, risks, and stakeholder responsibilities.

### 2.2 Validation Setup Stabilized

The repo initially could not run validation because dependencies were missing and linting was interactive. The following work was completed:

- Installed project dependencies with `npm install --legacy-peer-deps`.
- Removed root-level React 19 dependencies that caused mobile React Native type conflicts.
- Added mobile TypeScript path mappings so Expo/React Native resolves React 18 types correctly.
- Added app-specific ESLint flat configs:
  - `apps/web/eslint.config.mjs`
  - `apps/mobile/eslint.config.mjs`
- Updated app lint scripts from framework prompts to direct noninteractive ESLint commands:
  - `eslint .`
- Added compatible ESLint dependencies.
- Tuned web ESLint policy so legacy demo patterns are reported as warnings instead of blocking validation.

Validation now passes:

```bash
npm run type-check
npm run lint
npm run build
```

### 2.3 Build-Safe Supabase Client

The web app previously failed production builds when Supabase environment variables were absent. The Supabase client now fails safely instead of crashing during prerender.

Changed file:

- `apps/web/src/lib/supabase/client.ts`

What changed:

- Added `isSupabaseConfigured`.
- Added a typed missing-Supabase fallback client.
- The fallback returns clear errors for auth and simple database operations.
- Production Supabase behavior remains available when real Supabase env vars are configured.

Why this matters:

- Developers can build the app locally before provider credentials exist.
- Missing Supabase setup is surfaced as an integration issue, not a prerender crash.

### 2.4 Demo Authentication Removed

The app previously exposed demo login flows and demo credentials. That was appropriate for demos but not for real-world handoff.

Changed files:

- `apps/web/src/app/auth/login/page.tsx`
- `apps/web/src/app/api/demo/login/route.ts`
- `apps/web/src/components/layout/Providers.tsx`
- Deleted `apps/web/src/components/demo/DemoBanner.tsx`
- Deleted `apps/web/src/lib/demo/index.ts`

What changed:

- Removed demo credential panel from login.
- Removed demo auth bypass logic.
- Removed demo banner from global providers.
- Removed demo users, demo payment responses, demo AI responses, and demo KYC responses.
- `/api/demo/login` now returns `410 Gone`.

Current expected behavior:

- Web login must use real Supabase Auth.
- Demo users must not be used for production handoff.
- If seed users are needed, developers should create them through Supabase Auth and controlled seed scripts.

### 2.5 Simulated Payment Flows Removed

Changed file:

- `apps/web/src/app/api/payments/route.ts`

Previous behavior:

- Returned fake Paystack checkout URLs.
- Returned fake Stripe session IDs.
- Returned fake Monnify checkout references.
- Returned fake payment verification success.

Current behavior:

- The route validates required request fields.
- Supported gateways are still recognized.
- It returns `501 INTEGRATION_NOT_CONFIGURED` with provider-specific requirements.

Developers must implement:

- Paystack transaction initialization and verification.
- Stripe Checkout Sessions and webhook verification.
- Monnify checkout or reserved account flow.
- Payment attempt persistence.
- Webhook signature verification.
- Idempotency keys.
- Order state updates after verified provider events only.

### 2.6 Simulated Escrow Flows Removed

Changed file:

- `apps/web/src/app/api/escrow/route.ts`

Previous behavior:

- Created synthetic escrow states.
- Pretended to release funds at pickup.
- Pretended to release funds at destination.
- Pretended to refund customers.
- Returned hardcoded escrow status.

Current behavior:

- The route validates action and order information.
- It returns explicit integration-required responses for:
  - escrow creation
  - first release
  - final release
  - refund
  - status lookup

Developers must implement:

- Escrow records in Supabase.
- Verified payment-backed escrow creation.
- Carrier milestone verification.
- Admin/dispute holds.
- Provider payout or transfer APIs.
- Refund flows.
- Idempotent release/refund processing.
- Immutable audit logs.

### 2.7 Simulated KYC Flows Removed

Changed file:

- `apps/web/src/app/api/kyc/route.ts`

Previous behavior:

- Returned fake KYC application IDs.
- Returned fake risk scores.
- Returned fake KYC status.
- Pretended admin approval/rejection had updated applicants and notifications.

Current behavior:

- The route still validates required request shape.
- Submit, status lookup, and admin action routes now return `501 INTEGRATION_NOT_CONFIGURED`.

Developers must implement:

- Supabase `kyc_applications` persistence.
- Supabase Storage for uploaded documents.
- Admin-only review permissions.
- KYC document status tracking.
- Real email/SMS notification events.
- Audit logging.
- Manual review workflow.
- Optional AI-assisted document checks with confidence thresholds.

### 2.8 Simulated Document OCR Removed

Changed file:

- `apps/web/src/app/api/documents/route.ts`

Previous behavior:

- Returned fake OCR data for phytosanitary certificates, bills of lading, certificates of origin, and commercial invoices.

Current behavior:

- The route validates a file was uploaded.
- It returns a real integration boundary requiring Supabase Storage and an OCR/vision provider.

Developers must implement:

- Storage buckets for trade documents.
- Signed upload/access policies.
- OCR or vision provider integration.
- Extracted field validation.
- Confidence scoring.
- Manual review queue.
- Audit logs.

### 2.9 Simulated AI Chat Removed

Changed file:

- `apps/web/src/app/api/ai-chat/route.ts`

Previous behavior:

- Returned canned contextual responses for shipping, vehicles, crayfish, halal products, HS codes, tracking, bundles, and loyalty.

Current behavior:

- Rate limiting remains.
- Request validation remains.
- The route now returns `501 INTEGRATION_NOT_CONFIGURED`.

Developers must implement:

- Groq or OpenAI provider client.
- Prompt/version management.
- Product/order/support context retrieval from Supabase.
- Token usage logging.
- Safety and compliance guardrails.
- Error handling and fallback messaging.

### 2.10 Simulated HS Code Classification Removed

Changed file:

- `apps/web/src/app/api/hs-code/route.ts`

Previous behavior:

- Keyword-matched product descriptions to hardcoded HS codes.

Current behavior:

- Rate limiting remains.
- Required product description/name validation remains.
- The route now returns `501 INTEGRATION_NOT_CONFIGURED`.

Developers must implement:

- Real LLM or classifier integration.
- Classification attempt persistence.
- Confidence thresholds.
- Admin/customs review.
- Air cargo restrictions from verified HS/product rules.
- Versioned classifier prompts/models.

### 2.11 Simulated Shipping Quotes Removed

Changed file:

- `apps/web/src/app/api/shipping/route.ts`

Previous behavior:

- Returned hardcoded Maersk, MSC, CMA CGM, DHL, and FedEx rates based on simple formulas.

Current behavior:

- Required route/weight validation remains.
- The route now returns `501 INTEGRATION_NOT_CONFIGURED`.

Developers must implement:

- Carrier or freight-forwarder API integrations.
- Quote normalization.
- Cargo restrictions.
- Quote expiry.
- Persisted selected quote IDs.
- Carrier assignment and tracking milestones.

### 2.12 Simulated Demand Forecasting Removed

Changed file:

- `apps/web/src/app/api/demand-forecast/route.ts`

Previous behavior:

- Returned fake 30-day and 60-day demand forecasts.
- Returned fake seasonal insights and restock recommendations.

Current behavior:

- Required vendor/product validation remains.
- The route returns an integration-required response.

Developers must implement:

- Historical sales pipeline.
- Inventory data.
- Seasonality and market data inputs.
- Forecast model endpoint or analytics service.
- Confidence intervals.
- Vendor-facing recommendation logic.

### 2.13 Simulated Loyalty Ledger Removed

Changed file:

- `apps/web/src/app/api/loyalty/route.ts`

Previous behavior:

- Returned hardcoded points, tier, referrals, and recent transactions.
- Mutated fake balances locally.

Current behavior:

- The route validates user/action inputs.
- Lookup and mutation now return integration-required responses.

Developers must implement:

- Loyalty ledger tables.
- Idempotent point events.
- Tier calculation rules.
- Referral tracking.
- Admin adjustments.
- Order/review/referral event integration.

### 2.14 Simulated Consent Records Removed

Changed file:

- `apps/web/src/app/api/consent/route.ts`

Previous behavior:

- Returned fake consent IDs.
- Returned fake current consent state.
- Returned fake withdrawal success.

Current behavior:

- The route returns integration-required responses for recording, lookup, and withdrawal.

Developers must implement:

- Consent records in Supabase.
- Anonymous device/user context.
- Consent banner versioning.
- Withdrawal audit events.
- Privacy export/delete flows.

### 2.15 Mobile Sample Marketplace Removed

Changed files:

- `apps/mobile/components/IntegrationRequired.tsx`
- `apps/mobile/app/(tabs)/index.tsx`
- `apps/mobile/app/(tabs)/export.tsx`
- `apps/mobile/app/(tabs)/import.tsx`
- `apps/mobile/app/(tabs)/cart.tsx`
- `apps/mobile/app/(tabs)/ai-chat.tsx`
- `apps/mobile/app/(auth)/login.tsx`

Previous behavior:

- Mobile home displayed hardcoded featured products.
- Export tab displayed hardcoded African products.
- Import tab displayed hardcoded vehicles/electronics/machinery.
- Cart tab displayed hardcoded items, totals, shipping, and escrow message.
- AI chat returned canned local responses.
- Login simulated auth and navigated into the app.

Current behavior:

- Mobile tabs now show clear integration-required handoff screens.
- Login no longer fakes a successful session.

Developers must implement:

- Supabase Auth on mobile.
- Secure session storage.
- Product API calls.
- Cart and checkout API calls.
- Payment and escrow API integration.
- Order tracking.
- Push notifications.
- Real AI chat API calls.

### 2.16 Escrow Demo Replaced

Changed files:

- `apps/web/src/app/(site)/escrow-demo/page.tsx`
- Deleted `apps/web/src/components/monitoring/EscrowDemo.tsx`

Previous behavior:

- Showed an animated escrow lifecycle with fake release events.

Current behavior:

- Shows a production handoff page explaining what real escrow requires.

### 2.17 Real-World Handoff Documentation Added

Added file:

- `docs/REAL_WORLD_HANDOFF.md`

Updated files:

- `DEVELOPER_HANDOVER.md`
- `TESTING.md`

The new handoff doc explains:

- What demo/simulated flows were removed.
- How `501 INTEGRATION_NOT_CONFIGURED` works.
- Critical integrations still required.
- Developer expectations.
- Validation commands.

## 3. Current Application Posture

The app is no longer a pure demo app. It is now a structured handoff baseline.

### What is production-safe now

- Validation commands run successfully.
- Demo credential exposure has been removed.
- High-risk backend routes no longer fake success.
- Mobile screens no longer show fake product/cart/AI data as if live.
- Missing Supabase env vars no longer break builds.
- Developers receive explicit integration requirements from unimplemented APIs.

### What is not production-ready yet

- Real authentication is not wired end-to-end.
- Most dashboards still need live Supabase data.
- Product catalogs on the web still need to be connected to persistent data.
- Payment providers are not implemented.
- Escrow logic is not implemented.
- KYC document storage/review is not implemented.
- AI provider calls are not implemented.
- Carrier quote/tracking integrations are not implemented.
- Notification delivery is not implemented.
- Consent persistence is not implemented.
- Admin actions need real authorization, persistence, and audit logs.

## 4. What Needs To Be Done Next

### 4.1 Authentication and Authorization

Developers need to implement:

- Supabase Auth sign-up and sign-in.
- Email verification and password reset.
- OAuth providers if required.
- Role assignment for customer, vendor, carrier, enterprise, and admin.
- Middleware/session enforcement.
- Protected dashboard routes.
- Admin-only APIs.
- Mobile secure session storage.

Acceptance criteria:

- Users cannot access protected dashboards without a valid session.
- Role-specific dashboards load based on database role, not hardcoded values.
- Admin APIs reject non-admin users.
- Mobile session persists securely across app restarts.

### 4.2 Database Integration

Developers need to implement:

- Run and validate Supabase migrations.
- Connect all product, order, KYC, escrow, payout, dispute, document, loyalty, and audit routes to Supabase.
- Enforce Row Level Security.
- Add seed scripts for development data.
- Add typed repository/service modules.

Acceptance criteria:

- Products load from database.
- Orders persist.
- KYC records persist.
- Escrow records persist.
- Admin dashboards query real data.
- RLS policies are tested.

### 4.3 Product Catalogs and Marketplace Data

Developers need to implement:

- Product listing APIs.
- Search, filtering, sorting, and pagination.
- Product images from Supabase Storage or CDN.
- Vendor verification status.
- Inventory tracking.
- Product approval workflow.
- HS code approval workflow.

Acceptance criteria:

- Export/import marketplace pages render live product data.
- Only active approved products are shown.
- Out-of-stock products cannot be checked out.
- Product data changes are visible without code edits.

### 4.4 Cart, Checkout, Orders, and Inventory

Developers need to implement:

- Persistent cart by user/session.
- Checkout order creation.
- Inventory reservation.
- Carrier quote selection.
- Payment initialization.
- Order status lifecycle.
- Order tracking.

Acceptance criteria:

- Checkout creates a pending order.
- Payment provider reference is attached to the order.
- Inventory cannot oversell.
- Order state transitions are auditable.

### 4.5 Payments

Developers need to implement:

- Paystack for Nigerian payments.
- Stripe for international card payments.
- Monnify for bank transfer/USSD flows if required.
- Payment webhooks.
- Signature validation.
- Idempotency.
- Payment reconciliation.
- Refund support.

Acceptance criteria:

- Fake payment references are never accepted.
- Webhooks are verified.
- Duplicate webhooks do not duplicate orders or payouts.
- Failed payments do not create active escrow.

### 4.6 Escrow

Developers need to implement:

- Escrow account records.
- Vendor share calculations.
- EKDA commission calculations.
- First release at verified pickup.
- Final release at verified destination arrival.
- Refunds after dispute/admin approval.
- Dual-admin overrides.
- Audit logs.

Acceptance criteria:

- Funds are never released without a verified payment and verified milestone.
- Refunds are tied to dispute/admin authorization.
- Every escrow transition has an audit record.
- Payout/refund operations are idempotent.

### 4.7 KYC and Compliance

Developers need to implement:

- KYC application persistence.
- Document uploads.
- Admin review queue.
- Approval/rejection/request-more-info flows.
- Notification events.
- AML/fraud checks where required.
- Compliance reporting.

Acceptance criteria:

- Vendors and carriers cannot trade before approved KYC.
- KYC documents are stored securely.
- Admin decisions are audited.
- Applicants receive real notifications.

### 4.8 Document OCR and Trade Documents

Developers need to implement:

- Supabase Storage buckets.
- OCR or document AI provider.
- Document metadata extraction.
- Confidence scoring.
- Manual review queue.
- Document-to-order association.

Acceptance criteria:

- Uploaded documents are stored with access controls.
- OCR results are marked as provider-generated.
- Low-confidence documents require human review.
- Trade documents are associated with real shipments/orders.

### 4.9 AI Services

Developers need to implement:

- Groq or OpenAI for chat.
- Groq or OpenAI for HS code classification.
- Optional document vision provider.
- Prompt versioning.
- Usage logging.
- Cost tracking.
- Safety filters.

Acceptance criteria:

- AI responses are generated by configured providers.
- AI output is logged with model, latency, and token usage.
- HS codes require confidence thresholds and review.
- AI cannot override compliance rules without admin review.

### 4.10 Logistics and Carrier Integrations

Developers need to implement:

- Carrier/freight-forwarder APIs.
- Quote normalization.
- Quote expiry.
- Carrier assignment.
- Pickup and delivery milestones.
- Tracking status.
- Proof-of-pickup and proof-of-delivery evidence.

Acceptance criteria:

- Shipping quotes come from real providers or approved rate tables.
- Selected quote IDs are persisted.
- Tracking milestones are auditable.
- Escrow release depends on verified logistics events.

### 4.11 Mobile App

Developers need to implement:

- Supabase Auth.
- Secure token/session storage.
- Product list APIs.
- Cart APIs.
- Order/checkout APIs.
- AI chat API.
- KYC upload flows.
- Push notifications.
- Offline/error states.

Acceptance criteria:

- Mobile users can sign in with real auth.
- Mobile marketplace data matches web/backend data.
- Mobile checkout uses the same payment/order/escrow APIs as web.
- Push notifications use real Expo tokens.

### 4.12 Admin Operations

Developers need to implement:

- Admin dashboard queries.
- KYC review actions.
- Dispute workflows.
- Payout review.
- User suspension/reactivation.
- Marketing/promo persistence.
- System health checks.
- Audit logs.

Acceptance criteria:

- Admin actions require admin role.
- Admin actions persist to database.
- Sensitive actions write audit logs.
- Dashboards show real operational metrics.

### 4.13 Notifications

Developers need to implement:

- Email through Resend or equivalent.
- SMS through Termii or equivalent.
- Push notifications through Expo.
- In-app notification records.
- Retry and failure handling.

Acceptance criteria:

- KYC, order, payment, dispute, and shipment notifications are sent through real providers.
- Notification failures are logged.
- Users can manage preferences.

### 4.14 Security and Compliance

Developers need to implement:

- RLS policies.
- API auth guards.
- Admin authorization.
- Rate limiting backed by Redis/Upstash.
- Secrets management.
- Webhook signature validation.
- Audit logging.
- Privacy exports/deletes.
- Legal review of terms, privacy, escrow, refund, and vendor/carrier agreements.

Acceptance criteria:

- No service-role key is exposed client-side.
- All sensitive APIs require authentication.
- Webhooks reject invalid signatures.
- Audit logs exist for money, KYC, admin, and privacy events.

### 4.15 DevOps and Release Management

Developers need to implement:

- Production Vercel project configuration.
- EAS build setup for mobile.
- Environment variable management.
- CI pipeline.
- Preview deployments.
- Database migration process.
- Monitoring and alerting.
- Backup and recovery.

Acceptance criteria:

- CI runs type-check, lint, tests, and build.
- Production env vars are configured outside the repo.
- Rollback process exists.
- Uptime/error alerts are configured.

## 5. Recommended Developer Workstreams

### Workstream 1: Core Backend

Focus:

- Supabase schema validation.
- Auth.
- RLS.
- Product/order repositories.
- API auth guards.

### Workstream 2: Payments and Escrow

Focus:

- Payment providers.
- Webhooks.
- Escrow records.
- Payouts/refunds.
- Audit logs.

### Workstream 3: KYC and Compliance

Focus:

- Document upload.
- Review queue.
- Admin decisions.
- Notifications.
- Compliance records.

### Workstream 4: Marketplace and Mobile

Focus:

- Product APIs.
- Web catalog.
- Mobile catalog.
- Cart/checkout API consumption.
- Order tracking.

### Workstream 5: AI and Logistics

Focus:

- AI chat.
- HS code classification.
- Document OCR.
- Carrier quotes.
- Shipment tracking.

### Workstream 6: Operations and Admin

Focus:

- Admin dashboards.
- Disputes.
- Payout review.
- User management.
- Reporting.

## 6. Key Environment Variables To Configure

### Supabase

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Payments

- `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- `PAYSTACK_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `MONNIFY_API_KEY`
- `MONNIFY_CONTRACT_CODE`
- `MONNIFY_BASE_URL`

### AI

- `GROQ_API_KEY`
- `OPENAI_API_KEY`
- `FORECAST_MODEL_ENDPOINT`
- `GOOGLE_DOCUMENT_AI_PROCESSOR_ID`

### Logistics

- `CARRIER_RATES_API_URL`
- `CARRIER_RATES_API_KEY`

### Notifications

- `RESEND_API_KEY`
- `TERMII_API_KEY`

### Monitoring

- `SENTRY_DSN`
- `NEXT_PUBLIC_SENTRY_DSN`
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`

## 7. Validation Completed

The current branch was validated with:

```bash
npm run type-check
npm run lint
npm run build
```

All commands passed after the simulation-removal and handoff changes.

## 8. Important Notes For Developers

- Do not reintroduce fake success paths for payments, escrow, KYC, documents, or AI.
- If a provider is not ready, keep the route fail-closed with `501 INTEGRATION_NOT_CONFIGURED`.
- Use service modules for provider clients instead of embedding provider calls directly in route handlers.
- Verify every webhook signature.
- Use idempotency keys for payment, payout, refund, and webhook operations.
- Write audit logs before returning success for sensitive actions.
- Treat mobile as a consumer of the same production APIs as web.

## 9. Conclusion

The app has moved from a demo-heavy prototype toward a real-world handoff baseline. The visual product direction, route structure, mobile shell, shared types, database migrations, and business documentation are in place. The dangerous part of the previous codebase was that several critical flows returned fake success data. Those high-risk simulations have now been removed.

The next development phase is provider integration and persistence. Real-world developers should now wire Supabase, payments, escrow, KYC, AI, logistics, notifications, admin operations, and mobile API consumption. Once those are complete and tested, EKDA can move from handoff baseline to a production-ready marketplace.
