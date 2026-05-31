// Auto-generated Supabase database types
// Run `supabase gen types typescript` to regenerate from your database schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          full_name: string;
          avatar_url: string | null;
          role: "customer" | "vendor" | "enterprise" | "carrier" | "admin";
          is_verified: boolean;
          kyc_status: "pending" | "approved" | "rejected" | "flagged";
          country: string;
          currency: string;
          business_name: string | null;
          business_description: string | null;
          business_country: string | null;
          business_address: string | null;
          vendor_type: "nigerian_export" | "international_import" | "both" | null;
          carrier_type: "local_logistics" | "international_freight" | "both" | null;
          company_name: string | null;
          rating: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          phone?: string | null;
          full_name: string;
          avatar_url?: string | null;
          role?: "customer" | "vendor" | "enterprise" | "carrier" | "admin";
          is_verified?: boolean;
          kyc_status?: "pending" | "approved" | "rejected" | "flagged";
          country?: string;
          currency?: string;
          business_name?: string | null;
          business_description?: string | null;
          business_country?: string | null;
          business_address?: string | null;
          vendor_type?: "nigerian_export" | "international_import" | "both" | null;
          carrier_type?: "local_logistics" | "international_freight" | "both" | null;
          company_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          phone?: string | null;
          full_name?: string;
          avatar_url?: string | null;
          role?: "customer" | "vendor" | "enterprise" | "carrier" | "admin";
          is_verified?: boolean;
          kyc_status?: "pending" | "approved" | "rejected" | "flagged";
          country?: string;
          currency?: string;
          business_name?: string | null;
          business_description?: string | null;
          business_country?: string | null;
          business_address?: string | null;
          vendor_type?: "nigerian_export" | "international_import" | "both" | null;
          carrier_type?: "local_logistics" | "international_freight" | "both" | null;
          company_name?: string | null;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          vendor_id: string;
          name: string;
          description: string;
          category: string;
          marketplace_type: "export" | "import";
          images: string[];
          price: number;
          currency: string;
          unit: string;
          min_order_quantity: number;
          max_order_quantity: number | null;
          stock_quantity: number;
          hs_code: string | null;
          hs_code_description: string | null;
          hs_code_ai_confidence: number | null;
          hs_code_ai_suggested: boolean;
          hs_code_restricted_air: boolean;
          origin_country: string;
          weight_kg: number;
          cargo_recommendation: string;
          cargo_restriction_reason: string | null;
          supports_bulk: boolean;
          is_active: boolean;
          rating: number;
          review_count: number;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vendor_id: string;
          name: string;
          description: string;
          category: string;
          marketplace_type: "export" | "import";
          images?: string[];
          price: number;
          currency?: string;
          unit: string;
          min_order_quantity?: number;
          max_order_quantity?: number | null;
          stock_quantity: number;
          hs_code?: string | null;
          origin_country: string;
          weight_kg: number;
          supports_bulk?: boolean;
          is_active?: boolean;
          tags?: string[];
        };
        Update: {
          name?: string;
          description?: string;
          category?: string;
          images?: string[];
          price?: number;
          currency?: string;
          unit?: string;
          min_order_quantity?: number;
          stock_quantity?: number;
          hs_code?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string;
          vendor_id: string;
          carrier_id: string | null;
          subtotal: number;
          shipping_cost: number;
          duties_and_taxes: number;
          ekda_commission: number;
          total: number;
          currency: string;
          status: string;
          escrow_status: string;
          payment_method: string;
          payment_reference: string | null;
          cargo_type: string;
          notes: string | null;
          estimated_delivery: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number: string;
          customer_id: string;
          vendor_id: string;
          carrier_id?: string | null;
          subtotal: number;
          shipping_cost: number;
          duties_and_taxes?: number;
          ekda_commission: number;
          total: number;
          currency?: string;
          status?: string;
          escrow_status?: string;
          payment_method: string;
          cargo_type: string;
        };
        Update: {
          status?: string;
          carrier_id?: string | null;
          escrow_status?: string;
          payment_reference?: string | null;
          estimated_delivery?: string | null;
          updated_at?: string;
        };
      };
      wallets: {
        Row: {
          id: string;
          user_id: string;
          balance: number;
          currency: string;
          pending_balance: number;
          total_earned: number;
          total_withdrawn: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          balance?: number;
          currency?: string;
        };
        Update: {
          balance?: number;
          pending_balance?: number;
          total_earned?: number;
          total_withdrawn?: number;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          data: Json | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          message: string;
          data?: Json | null;
          is_read?: boolean;
        };
        Update: {
          is_read?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "customer" | "vendor" | "enterprise" | "carrier" | "admin";
      verification_status: "pending" | "approved" | "rejected" | "flagged";
      marketplace_type: "export" | "import";
      cargo_type: "air" | "sea" | "road" | "mixed";
      escrow_status: "held" | "partial_released" | "fully_released" | "refunded";
    };
  };
}
