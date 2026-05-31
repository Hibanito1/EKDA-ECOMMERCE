-- EKDA Admin Dashboard Extended Schema
-- Run after migrations 001 and 002

-- ─── Disputes ────────────────────────────────────────────────────────────────

CREATE TYPE dispute_status AS ENUM (
  'open', 'investigating', 'awaiting_customer', 'awaiting_vendor',
  'awaiting_carrier', 'mediation', 'resolved_customer', 'resolved_vendor',
  'escalated', 'closed'
);

CREATE TYPE dispute_priority AS ENUM ('low', 'medium', 'high', 'critical');

CREATE TABLE disputes_extended (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  dispute_number TEXT NOT NULL UNIQUE DEFAULT 'DIS-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8)),
  raised_by UUID REFERENCES profiles(id),
  against UUID REFERENCES profiles(id),
  assigned_admin UUID REFERENCES profiles(id),
  category TEXT NOT NULL, -- damaged_goods, not_delivered, wrong_item, escrow_dispute, fraud
  description TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT '{}',
  status dispute_status NOT NULL DEFAULT 'open',
  priority dispute_priority NOT NULL DEFAULT 'medium',
  resolution_type TEXT,
  resolution_notes TEXT,
  refund_amount DECIMAL(15,2),
  escrow_override_required BOOLEAN DEFAULT FALSE,
  escrow_override_approved_by UUID[] DEFAULT '{}',
  auto_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  sla_deadline TIMESTAMPTZ DEFAULT NOW() + INTERVAL '72 hours'
);

CREATE TABLE dispute_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispute_id UUID NOT NULL REFERENCES disputes_extended(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  sender_role TEXT NOT NULL, -- customer, vendor, carrier, admin
  message TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',
  is_internal BOOLEAN DEFAULT FALSE, -- admin-only notes
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Financial ───────────────────────────────────────────────────────────────

CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'completed', 'failed', 'cancelled');

CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  payout_reference TEXT NOT NULL UNIQUE DEFAULT 'PAY-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8)),
  user_id UUID NOT NULL REFERENCES profiles(id),
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  bank_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  status payout_status NOT NULL DEFAULT 'pending',
  gateway TEXT NOT NULL DEFAULT 'paystack',
  gateway_reference TEXT,
  trigger_type TEXT NOT NULL DEFAULT 'manual', -- manual, escrow_release, scheduled
  initiated_by UUID REFERENCES profiles(id),
  completed_at TIMESTAMPTZ,
  failed_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE commission_adjustments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vendor_id UUID REFERENCES profiles(id),
  adjusted_by UUID REFERENCES profiles(id),
  old_rate DECIMAL(5,3) NOT NULL,
  new_rate DECIMAL(5,3) NOT NULL,
  reason TEXT NOT NULL,
  effective_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  effective_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE refunds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id),
  dispute_id UUID REFERENCES disputes_extended(id),
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'NGN',
  reason TEXT NOT NULL,
  initiated_by UUID REFERENCES profiles(id),
  gateway TEXT,
  gateway_reference TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── AI Monitoring ────────────────────────────────────────────────────────────

CREATE TABLE ai_usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service TEXT NOT NULL, -- hs_code, chatbot, risk_score, document_verify
  user_id UUID REFERENCES profiles(id),
  model TEXT,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  duration_ms INTEGER,
  success BOOLEAN NOT NULL DEFAULT TRUE,
  confidence DECIMAL(3,2),
  was_overridden BOOLEAN DEFAULT FALSE,
  override_by UUID REFERENCES profiles(id),
  feedback TEXT, -- correct, incorrect, neutral
  cost_usd DECIMAL(10,6),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Marketing ────────────────────────────────────────────────────────────────

CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL DEFAULT 'percentage', -- percentage, fixed
  discount_value DECIMAL(10,2) NOT NULL,
  min_order_value DECIMAL(15,2),
  max_uses INTEGER,
  uses_count INTEGER DEFAULT 0,
  applicable_to TEXT DEFAULT 'all', -- all, new_users, vendors, carriers
  valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info', -- info, warning, success, critical
  target_roles TEXT[] DEFAULT '{"customer","vendor","carrier"}',
  is_active BOOLEAN DEFAULT TRUE,
  show_banner BOOLEAN DEFAULT TRUE,
  show_notification BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── System Monitoring ────────────────────────────────────────────────────────

CREATE TABLE system_health_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service TEXT NOT NULL,
  status TEXT NOT NULL, -- healthy, degraded, down
  response_time_ms INTEGER,
  error_message TEXT,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────────

CREATE INDEX disputes_status_idx ON disputes_extended(status, priority);
CREATE INDEX disputes_admin_idx ON disputes_extended(assigned_admin);
CREATE INDEX payouts_user_idx ON payouts(user_id, created_at DESC);
CREATE INDEX payouts_status_idx ON payouts(status);
CREATE INDEX ai_usage_service_idx ON ai_usage_logs(service, created_at DESC);
CREATE INDEX announcements_active_idx ON announcements(is_active, starts_at);

-- Auto-update updated_at
CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON disputes_extended FOR EACH ROW EXECUTE FUNCTION update_updated_at();
