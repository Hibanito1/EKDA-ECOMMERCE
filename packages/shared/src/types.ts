// ─── User & Auth ────────────────────────────────────────────────────────────

export type UserRole =
  | "customer"
  | "vendor"
  | "enterprise"
  | "carrier"
  | "admin";

export type VerificationStatus = "pending" | "approved" | "rejected" | "flagged";

export interface User {
  id: string;
  email: string;
  phone?: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  is_verified: boolean;
  kyc_status: VerificationStatus;
  country: string;
  currency: SupportedCurrency;
  created_at: string;
  updated_at: string;
}

export interface VendorProfile extends User {
  business_name: string;
  business_description?: string;
  business_logo?: string;
  business_country: string;
  business_address: string;
  vendor_type: VendorType;
  rating: number;
  total_sales: number;
  bank_details?: BankDetails;
  documents: VendorDocument[];
}

export interface CarrierProfile extends User {
  company_name: string;
  carrier_type: CarrierType;
  service_routes: ServiceRoute[];
  fleet_info?: FleetInfo;
  rating: number;
  total_shipments: number;
  documents: CarrierDocument[];
}

export type VendorType = "nigerian_export" | "international_import" | "both";
export type CarrierType = "local_logistics" | "international_freight" | "both";

// ─── Products ───────────────────────────────────────────────────────────────

export type MarketplaceType = "export" | "import";
export type ProductCategory =
  | "groceries"
  | "dried_produce"
  | "frozen_produce"
  | "agri_commodities"
  | "electronics"
  | "vehicles"
  | "machinery"
  | "general_goods";

export type CargoType = "air" | "sea" | "road" | "mixed";
export type ContainerSize = "20ft" | "40ft" | "40ft_hc" | "lcl";

export interface HSCode {
  code: string;
  description: string;
  ai_confidence: number;
  ai_suggested: boolean;
  verified_by_admin: boolean;
  restricted_air_cargo: boolean;
  duty_rate?: number;
}

export interface Product {
  id: string;
  vendor_id: string;
  vendor?: VendorProfile;
  name: string;
  description: string;
  category: ProductCategory;
  marketplace_type: MarketplaceType;
  images: string[];
  price: number;
  currency: SupportedCurrency;
  unit: string;
  min_order_quantity: number;
  max_order_quantity?: number;
  stock_quantity: number;
  hs_code?: HSCode;
  origin_country: string;
  weight_kg: number;
  dimensions?: ProductDimensions;
  cargo_recommendation: CargoType;
  cargo_restriction_reason?: string;
  supports_bulk: boolean;
  bulk_pricing?: BulkPricing[];
  is_active: boolean;
  rating: number;
  review_count: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface ProductDimensions {
  length_cm: number;
  width_cm: number;
  height_cm: number;
}

export interface BulkPricing {
  min_qty: number;
  max_qty?: number;
  price_per_unit: number;
}

// ─── Orders & Logistics ─────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "payment_confirmed"
  | "processing"
  | "carrier_assigned"
  | "picked_up"
  | "in_transit"
  | "arrived_at_port"
  | "customs_clearance"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "disputed"
  | "refunded";

export type EscrowStatus =
  | "held"
  | "partial_released"
  | "fully_released"
  | "refunded";

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer?: User;
  vendor_id: string;
  vendor?: VendorProfile;
  carrier_id?: string;
  carrier?: CarrierProfile;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  duties_and_taxes: number;
  ekda_commission: number;
  total: number;
  currency: SupportedCurrency;
  status: OrderStatus;
  escrow_status: EscrowStatus;
  escrow_id?: string;
  payment_method: PaymentMethod;
  payment_reference?: string;
  origin_address: Address;
  destination_address: Address;
  cargo_type: CargoType;
  container_size?: ContainerSize;
  tracking_milestones: TrackingMilestone[];
  documents: OrderDocument[];
  notes?: string;
  estimated_delivery?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  unit_price: number;
  total_price: number;
  hs_code?: HSCode;
}

export interface TrackingMilestone {
  id: string;
  order_id: string;
  status: OrderStatus;
  title: string;
  description: string;
  location?: string;
  timestamp: string;
  completed: boolean;
}

// ─── Payments & Escrow ──────────────────────────────────────────────────────

export type PaymentMethod = "paystack" | "stripe" | "monnify" | "wallet";
export type SupportedCurrency = "NGN" | "USD" | "GBP" | "EUR" | "CAD" | "AUD";

export interface EscrowAccount {
  id: string;
  order_id: string;
  total_amount: number;
  currency: SupportedCurrency;
  vendor_share: number;
  ekda_commission: number;
  status: EscrowStatus;
  first_release_amount: number;
  first_release_at?: string;
  second_release_amount: number;
  second_release_at?: string;
  created_at: string;
}

export interface Wallet {
  id: string;
  user_id: string;
  balance: number;
  currency: SupportedCurrency;
  pending_balance: number;
  total_earned: number;
  total_withdrawn: number;
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  type: "credit" | "debit";
  amount: number;
  currency: SupportedCurrency;
  description: string;
  reference: string;
  status: "pending" | "completed" | "failed";
  created_at: string;
}

// ─── Logistics & Carriers ───────────────────────────────────────────────────

export interface ShippingRate {
  carrier_id: string;
  carrier_name: string;
  carrier_logo?: string;
  cargo_type: CargoType;
  transit_days: number;
  rate: number;
  currency: SupportedCurrency;
  includes_duties: boolean;
  rating: number;
  service_name: string;
}

export interface ServiceRoute {
  origin_country: string;
  destination_country: string;
  cargo_types: CargoType[];
  port_options: string[];
}

export interface FleetInfo {
  vehicle_types: string[];
  total_vehicles: number;
  container_support: ContainerSize[];
}

export interface CarrierBid {
  id: string;
  carrier_id: string;
  carrier?: CarrierProfile;
  order_id: string;
  rate: number;
  currency: SupportedCurrency;
  transit_days: number;
  cargo_type: CargoType;
  notes?: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  created_at: string;
}

// ─── Documents & KYC ────────────────────────────────────────────────────────

export type DocumentType =
  | "phytosanitary"
  | "certificate_of_origin"
  | "bill_of_lading"
  | "import_declaration"
  | "export_declaration"
  | "commercial_invoice"
  | "packing_list"
  | "insurance_certificate"
  | "government_id"
  | "business_registration"
  | "tax_identification"
  | "bank_statement";

export interface VendorDocument {
  id: string;
  vendor_id: string;
  document_type: DocumentType;
  file_url: string;
  file_name: string;
  ai_verified: boolean;
  ai_confidence?: number;
  ai_extracted_data?: Record<string, unknown>;
  hs_codes_found?: string[];
  status: VerificationStatus;
  admin_notes?: string;
  uploaded_at: string;
}

export interface CarrierDocument extends VendorDocument {
  carrier_id: string;
}

export interface OrderDocument {
  id: string;
  order_id: string;
  document_type: DocumentType;
  file_url: string;
  file_name: string;
  uploaded_by: string;
  ai_verified: boolean;
  status: VerificationStatus;
  uploaded_at: string;
}

// ─── Address & Location ──────────────────────────────────────────────────────

export interface Address {
  id?: string;
  user_id?: string;
  label?: string;
  full_name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postal_code?: string;
  country: string;
  is_port?: boolean;
  port_name?: string;
  port_code?: string;
  is_default?: boolean;
}

// ─── Bank Details ────────────────────────────────────────────────────────────

export interface BankDetails {
  bank_name: string;
  account_name: string;
  account_number: string;
  bank_code?: string;
  routing_number?: string;
  swift_code?: string;
  currency: SupportedCurrency;
}

// ─── Notifications ───────────────────────────────────────────────────────────

export type NotificationType =
  | "order_placed"
  | "payment_confirmed"
  | "carrier_assigned"
  | "order_picked_up"
  | "order_in_transit"
  | "order_arrived"
  | "order_delivered"
  | "escrow_released"
  | "kyc_approved"
  | "kyc_rejected"
  | "new_bid"
  | "bid_accepted"
  | "dispute_opened"
  | "dispute_resolved";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
}

// ─── Disputes ───────────────────────────────────────────────────────────────

export type DisputeStatus =
  | "open"
  | "investigating"
  | "resolved_customer"
  | "resolved_vendor"
  | "escalated";

export interface Dispute {
  id: string;
  order_id: string;
  raised_by: string;
  against: string;
  reason: string;
  description: string;
  evidence_urls: string[];
  status: DisputeStatus;
  resolution?: string;
  admin_id?: string;
  created_at: string;
  resolved_at?: string;
}

// ─── Reviews & Ratings ───────────────────────────────────────────────────────

export interface Review {
  id: string;
  order_id: string;
  reviewer_id: string;
  reviewer?: User;
  target_id: string;
  target_type: "vendor" | "carrier" | "product";
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
  is_verified_purchase: boolean;
  created_at: string;
}

// ─── AI Features ─────────────────────────────────────────────────────────────

export interface AIHSCodeSuggestion {
  suggested_code: string;
  description: string;
  confidence: number;
  alternative_codes: AlternativeHSCode[];
  restricted_air_cargo: boolean;
  restriction_reason?: string;
  estimated_duty_rate?: number;
  notes?: string;
}

export interface AlternativeHSCode {
  code: string;
  description: string;
  confidence: number;
}

export interface AIDocumentAnalysis {
  document_type: DocumentType;
  is_authentic: boolean;
  confidence: number;
  extracted_data: Record<string, unknown>;
  hs_codes_found: string[];
  flags: string[];
  summary: string;
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  quantity: number;
  selected_cargo_type?: CargoType;
  selected_carrier?: ShippingRate;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  currency: SupportedCurrency;
}

// ─── Analytics (Admin) ───────────────────────────────────────────────────────

export interface AnalyticsOverview {
  total_orders: number;
  total_revenue: number;
  active_vendors: number;
  active_carriers: number;
  pending_kyc: number;
  open_disputes: number;
  escrow_held: number;
  commission_earned: number;
  period_start: string;
  period_end: string;
}
