import type { UserRole } from "@ekda/shared";

// ─── Demo User Shape ──────────────────────────────────────────────────────────

export interface DemoUser {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  name: string;
  country: string;
  currency: "NGN" | "USD" | "GBP";
  kyc_status: "approved";
  is_verified: true;
  /** Avatar initials (2 chars) */
  avatar: string;
  orders: number;
  wallet: number;
  loyaltyPoints: number;
  loyaltyTier: "Bronze" | "Silver" | "Gold" | "Platinum";
  /** Only present for vendors */
  business?: string;
  /** Only present for carriers */
  company?: string;
  /** Internal JWT-style token used in demo API responses */
  token: string;
}

// ─── Demo Users ───────────────────────────────────────────────────────────────

export const DEMO_USERS: Record<string, DemoUser> = {
  customer: {
    id: "demo-user-customer",
    email: "demo.customer@ekda.io",
    password: "Demo@12345",
    role: "customer",
    name: "Adaeze Okonkwo",
    country: "GB",
    currency: "NGN",
    kyc_status: "approved",
    is_verified: true,
    avatar: "AO",
    orders: 24,
    wallet: 42000,
    loyaltyPoints: 2450,
    loyaltyTier: "Silver",
    token: "demo-customer-jwt-token",
  },
  vendor: {
    id: "demo-user-vendor",
    email: "demo.vendor@ekda.io",
    password: "Demo@12345",
    role: "vendor",
    name: "Kingsley Eze",
    country: "NG",
    currency: "NGN",
    kyc_status: "approved",
    is_verified: true,
    avatar: "KE",
    orders: 289,
    wallet: 892000,
    loyaltyPoints: 8400,
    loyaltyTier: "Gold",
    business: "Lagos Fresh Exports Ltd",
    token: "demo-vendor-jwt-token",
  },
  carrier: {
    id: "demo-user-carrier",
    email: "demo.carrier@ekda.io",
    password: "Demo@12345",
    role: "carrier",
    name: "Amara Logistics",
    country: "NG",
    currency: "NGN",
    kyc_status: "approved",
    is_verified: true,
    avatar: "AL",
    orders: 0,
    wallet: 285000,
    loyaltyPoints: 1200,
    loyaltyTier: "Bronze",
    company: "Amara Freight Services",
    token: "demo-carrier-jwt-token",
  },
  enterprise: {
    id: "demo-user-enterprise",
    email: "demo.enterprise@ekda.io",
    password: "Demo@12345",
    role: "enterprise",
    name: "TechCo Nigeria Ltd",
    country: "NG",
    currency: "NGN",
    kyc_status: "approved",
    is_verified: true,
    avatar: "TC",
    orders: 18,
    wallet: 24800000,
    loyaltyPoints: 15400,
    loyaltyTier: "Gold",
    business: "TechCo Nigeria Ltd",
    token: "demo-enterprise-jwt-token",
  },
  admin: {
    id: "demo-user-admin",
    email: "demo.admin@ekda.io",
    password: "Demo@12345",
    role: "admin",
    name: "EKDA Super Admin",
    country: "NG",
    currency: "NGN",
    kyc_status: "approved",
    is_verified: true,
    avatar: "SA",
    orders: 0,
    wallet: 0,
    loyaltyPoints: 0,
    loyaltyTier: "Platinum",
    token: "demo-admin-jwt-token",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** True if the email belongs to any demo account */
export function isDemoUser(email: string): boolean {
  return email.endsWith("@ekda.io") && email.startsWith("demo.");
}

/** Find demo user by email, returns null if not found */
export function getDemoUserByEmail(email: string): DemoUser | null {
  return Object.values(DEMO_USERS).find((u) => u.email === email) ?? null;
}

/** Validate demo credentials — password must be "Demo@12345" */
export function validateDemoCredentials(
  email: string,
  password: string
): { valid: boolean; user: DemoUser | null; error?: string } {
  if (!isDemoUser(email)) {
    return { valid: false, user: null, error: "Not a demo account" };
  }
  const user = getDemoUserByEmail(email);
  if (!user) {
    return {
      valid: false,
      user: null,
      error: "Use one of: demo.customer@ekda.io, demo.vendor@ekda.io, demo.carrier@ekda.io, demo.admin@ekda.io",
    };
  }
  if (password !== user.password) {
    return { valid: false, user: null, error: "Password should be: Demo@12345" };
  }
  return { valid: true, user };
}

/** Map a demo role to its dashboard path */
export function getDemoRedirectPath(role: UserRole): string {
  const paths: Record<UserRole, string> = {
    admin: "/dashboard/admin",
    vendor: "/dashboard/vendor",
    carrier: "/dashboard/carrier",
    enterprise: "/dashboard/customer",
    customer: "/dashboard/customer",
  };
  return paths[role] ?? "/dashboard";
}

/** All unique demo credentials as a flat list (useful for UI quick-login panels) */
export const DEMO_CREDENTIALS = Object.values(DEMO_USERS).map((u) => ({
  role: u.role,
  email: u.email,
  password: u.password,
  name: u.name,
  description: {
    customer: "Shop, track orders, manage wishlist",
    vendor: "List products, manage orders, AI HS codes",
    carrier: "Bid on shipments, confirm pickups/deliveries",
    enterprise: "Bulk orders, B2B portal, RFQ",
    admin: "Full platform control, KYC queue",
  }[u.role] ?? "",
  icon: { customer: "🛍️", vendor: "🏪", carrier: "🚢", enterprise: "🏢", admin: "⚡" }[u.role] ?? "👤",
}));
