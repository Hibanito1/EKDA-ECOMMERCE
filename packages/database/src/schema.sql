-- EKDA Ecommerce - Supabase Database Schema
-- Run this in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ─── Enums ───────────────────────────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'enterprise', 'carrier', 'admin');
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');
CREATE TYPE marketplace_type AS ENUM ('export', 'import');
CREATE TYPE cargo_type AS ENUM ('air', 'sea', 'road', 'mixed');
CREATE TYPE order_status AS ENUM (
  'pending', 'payment_confirmed', 'processing', 'carrier_assigned',
  'picked_up', 'in_transit', 'arrived_at_port', 'customs_clearance',
  'out_for_delivery', 'delivered', 'cancelled', 'disputed', 'refunded'
);
CREATE TYPE escrow_status AS ENUM ('held', 'partial_released', 'fully_released', 'refunded');
CREATE TYPE payment_method AS ENUM ('paystack', 'stripe', 'monnify', 'wallet');

-- ─── Profiles ────────────────────────────────────────────────────────────────

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'customer',
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  kyc_status verification_status NOT NULL DEFAULT 'pending',
  country TEXT NOT NULL DEFAULT 'NG',
  currency TEXT NOT NULL DEFAULT 'NGN',
  -- Vendor fields
  business_name TEXT,
  business_description TEXT,
  business_logo TEXT,
  business_country TEXT,
  business_address TEXT,
  vendor_type TEXT,
  -- Carrier fields
  company_name TEXT,
  carrier_type TEXT,
  -- Stats
  rating DECIMAL(3,2) DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  total_shipments INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view any profile" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Service role can insert profiles" ON profiles FOR INSERT WITH CHECK (TRUE);

-- ─── Products ────────────────────────────────────────────────────────────────

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  marketplace_type marketplace_type NOT NULL,
  images TEXT[] NOT NULL DEFAULT '{}',
  price DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  unit TEXT NOT NULL DEFAULT 'kg',
  min_order_quantity INTEGER NOT NULL DEFAULT 1,
  max_order_quantity INTEGER,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  -- HS Code
  hs_code TEXT,
  hs_code_description TEXT,
  hs_code_ai_confidence DECIMAL(3,2),
  hs_code_ai_suggested BOOLEAN DEFAULT FALSE,
  hs_code_restricted_air BOOLEAN DEFAULT FALSE,
  hs_code_duty_rate DECIMAL(5,2),
  -- Logistics
  origin_country TEXT NOT NULL DEFAULT 'NG',
  weight_kg DECIMAL(10,2) NOT NULL DEFAULT 1,
  length_cm DECIMAL(8,2),
  width_cm DECIMAL(8,2),
  height_cm DECIMAL(8,2),
  cargo_recommendation cargo_type NOT NULL DEFAULT 'sea',
  cargo_restriction_reason TEXT,
  supports_bulk BOOLEAN NOT NULL DEFAULT FALSE,
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active products" ON products FOR SELECT USING (is_active = TRUE OR vendor_id = auth.uid());
CREATE POLICY "Vendors can manage own products" ON products FOR ALL USING (vendor_id = auth.uid());

CREATE INDEX products_vendor_idx ON products(vendor_id);
CREATE INDEX products_category_idx ON products(category);
CREATE INDEX products_marketplace_idx ON products(marketplace_type);
CREATE INDEX products_search_idx ON products USING gin(to_tsvector('english', name || ' ' || description));

-- ─── Orders ───────────────────────────────────────────────────────────────────

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  customer_id UUID NOT NULL REFERENCES profiles(id),
  vendor_id UUID NOT NULL REFERENCES profiles(id),
  carrier_id UUID REFERENCES profiles(id),
  -- Financial
  subtotal DECIMAL(15,2) NOT NULL,
  shipping_cost DECIMAL(15,2) NOT NULL DEFAULT 0,
  duties_and_taxes DECIMAL(15,2) NOT NULL DEFAULT 0,
  ekda_commission DECIMAL(15,2) NOT NULL,
  total DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  -- Status
  status order_status NOT NULL DEFAULT 'pending',
  escrow_status escrow_status NOT NULL DEFAULT 'held',
  payment_method payment_method NOT NULL,
  payment_reference TEXT,
  -- Logistics
  cargo_type cargo_type NOT NULL DEFAULT 'sea',
  container_size TEXT,
  -- Addresses stored as JSONB
  origin_address JSONB,
  destination_address JSONB,
  -- Misc
  notes TEXT,
  estimated_delivery DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (
  customer_id = auth.uid() OR vendor_id = auth.uid() OR carrier_id = auth.uid()
);

CREATE INDEX orders_customer_idx ON orders(customer_id);
CREATE INDEX orders_vendor_idx ON orders(vendor_id);
CREATE INDEX orders_status_idx ON orders(status);

-- ─── Order Items ─────────────────────────────────────────────────────────────

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(15,2) NOT NULL,
  total_price DECIMAL(15,2) NOT NULL,
  hs_code TEXT,
  hs_code_description TEXT
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order participants can view items" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders o WHERE o.id = order_id AND (
      o.customer_id = auth.uid() OR o.vendor_id = auth.uid() OR o.carrier_id = auth.uid()
    )
  )
);

-- ─── Tracking Milestones ──────────────────────────────────────────────────────

CREATE TABLE tracking_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status order_status NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE tracking_milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Order participants can view milestones" ON tracking_milestones FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders o WHERE o.id = order_id AND (
      o.customer_id = auth.uid() OR o.vendor_id = auth.uid() OR o.carrier_id = auth.uid()
    )
  )
);

-- ─── Escrow ───────────────────────────────────────────────────────────────────

CREATE TABLE escrow_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL UNIQUE REFERENCES orders(id),
  total_amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  vendor_share DECIMAL(15,2) NOT NULL,
  ekda_commission DECIMAL(15,2) NOT NULL,
  status escrow_status NOT NULL DEFAULT 'held',
  first_release_amount DECIMAL(15,2) NOT NULL,
  first_release_at TIMESTAMPTZ,
  second_release_amount DECIMAL(15,2) NOT NULL,
  second_release_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Wallets ──────────────────────────────────────────────────────────────────

CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id),
  balance DECIMAL(15,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'NGN',
  pending_balance DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_earned DECIMAL(15,2) NOT NULL DEFAULT 0,
  total_withdrawn DECIMAL(15,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own wallet" ON wallets FOR SELECT USING (user_id = auth.uid());

-- ─── Documents ────────────────────────────────────────────────────────────────

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  order_id UUID REFERENCES orders(id),
  document_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  ai_verified BOOLEAN DEFAULT FALSE,
  ai_confidence DECIMAL(3,2),
  ai_extracted_data JSONB,
  hs_codes_found TEXT[] DEFAULT '{}',
  status verification_status NOT NULL DEFAULT 'pending',
  admin_notes TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own documents" ON documents FOR ALL USING (user_id = auth.uid());

-- ─── Notifications ────────────────────────────────────────────────────────────

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own notifications" ON notifications FOR ALL USING (user_id = auth.uid());

CREATE INDEX notifications_user_idx ON notifications(user_id, created_at DESC);

-- ─── Reviews ─────────────────────────────────────────────────────────────────

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  target_id UUID NOT NULL,
  target_type TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title TEXT,
  comment TEXT,
  images TEXT[] DEFAULT '{}',
  is_verified_purchase BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users can add reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- ─── Disputes ────────────────────────────────────────────────────────────────

CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  raised_by UUID NOT NULL REFERENCES profiles(id),
  against UUID NOT NULL REFERENCES profiles(id),
  reason TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'open',
  resolution TEXT,
  admin_id UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- ─── Carrier Bids ────────────────────────────────────────────────────────────

CREATE TABLE carrier_bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id),
  carrier_id UUID NOT NULL REFERENCES profiles(id),
  rate DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  transit_days INTEGER NOT NULL,
  cargo_type cargo_type NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Functions ───────────────────────────────────────────────────────────────

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Create wallet for new user
  INSERT INTO public.wallets (user_id) VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
