# EKDA Real-World Developer Handoff

Date: August 1, 2026

## Purpose

This document explains the current real-world handoff posture after removing
demo/simulated success paths from the EKDA web and mobile apps.

## What changed

- Demo auth UI and demo credential banner were removed from the web app shell.
- The `/api/demo/login` endpoint now returns `410 Gone`.
- Simulated payment initialization and payment verification were removed.
- Simulated escrow creation, release, refund, and status responses were removed.
- Simulated KYC submission/status/admin actions were removed.
- Simulated document OCR and trade document extraction were removed.
- Simulated AI chat, HS code classification, carrier quotes, demand forecasts,
  loyalty balances, and consent records were removed.
- Mobile sample product catalogs, cart totals, and canned AI chat were replaced
  with integration-required handoff screens.
- The public escrow demo animation was replaced with production integration
  requirements.

## API behavior for unimplemented integrations

Real provider-backed routes now fail closed with:

- HTTP status: `501`
- `code`: `INTEGRATION_NOT_CONFIGURED`
- `required_env`: required environment variables
- `developer_action`: what must be implemented before production use

This prevents fake successful transactions from being mistaken for production
behavior.

## Critical integrations still required

| Area | Required production work |
| --- | --- |
| Supabase Auth | Real sign-up/sign-in, session handling, role loading, route protection |
| Supabase Database | Replace page/dashboard fixtures with live queries, RLS, migrations, seeds |
| Supabase Storage | KYC documents, product images, trade documents, signed URL access |
| Payments | Paystack, Stripe, Monnify initialization, verification, webhooks, idempotency |
| Escrow | Payment-backed escrow records, milestone releases, refunds, audit logs |
| Logistics | Carrier quote APIs, carrier assignment, milestone evidence, tracking |
| AI | Groq/OpenAI-backed chat, HS classification, document analysis, risk/forecasting |
| Notifications | Email, SMS, push, in-app notifications, retry queues |
| Consent/Privacy | Persist consent history, withdrawals, export/delete requests |
| Mobile APIs | Authenticated product, cart, order, tracking, KYC, notification, and AI calls |

## Developer expectations

1. Treat every `501 INTEGRATION_NOT_CONFIGURED` response as an implementation
   task, not a runtime bug.
2. Do not reintroduce mock success responses for payments, escrow, KYC, or
   documents.
3. Add provider clients behind service modules with tests and idempotency.
4. Verify webhooks cryptographically before mutating orders or escrow.
5. Make database writes transactional where money, KYC, or inventory is
   involved.
6. Keep UI fixtures clearly marked as design-only until backed by real data.

## Validation commands

```bash
npm run type-check
npm run lint
npm run build
```

All three should pass before handoff or deployment.
