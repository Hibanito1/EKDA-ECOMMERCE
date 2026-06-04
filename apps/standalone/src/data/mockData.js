/**
 * apps/standalone/src/data/mockData.js
 *
 * Re-exports everything from the canonical @ekda/demo package.
 * The standalone app no longer maintains its own copy of demo data —
 * all fixtures come from the shared package.
 */

export {
  DEMO_USERS,
  DEMO_CREDENTIALS,
  isDemoUser,
  getDemoUserByEmail,
  validateDemoCredentials,
  EXPORT_PRODUCTS,
  IMPORT_PRODUCTS,
  ALL_PRODUCTS,
  FEATURED_PRODUCTS,
  MOCK_ORDERS,
  DEMO_CARRIERS,
  MOCK_NOTIFICATIONS,
  CHAT_RESPONSES,
  HS_CODE_EXAMPLES,
  getAIChatResponse,
  classifyHSCode,
  createDemoEscrow,
  LOYALTY_TIERS,
  getLoyaltyTier,
  DEMO_BANNER,
} from "@ekda/demo";

// formatCurrency stays in @ekda/shared
export { formatCurrency } from "@ekda/shared";
