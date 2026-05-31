-- EKDA Ecommerce — KYC, Consent & Audit Schema Migration
-- Run this after the initial schema.sql in your Supabase SQL editor

-- ─── KYC Applications ────────────────────────────────────────────────────────

CREATE TYPE kyc_application_status AS ENUM (
  'draft', 'submitted', 'ai_reviewing', 'pending_admin',
  'approved', 'rejected', 'more_info_requested', 'expired'
);

CREATE TYPE kyc_document_type AS ENUM (
  'national_id', 'passport', 'drivers_license',
  'cac_certificate', 'business_registration',
  'proof_of_address', 'tax_identification',
  'bank_verification', 'directors_id'
);

CREATE TABLE kyc_applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  application_number TEXT NOT NULL UNIQUE DEFAULT 'KYC-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8)),
  role user_role NOT NULL,
  status kyc_application_status NOT NULL DEFAULT 'draft',

  -- Step 1: Personal Info
  full_name TEXT,
  date_of_birth DATE,
  nationality TEXT,
  gender TEXT,
  phone TEXT,
  email TEXT,

  -- Step 2: ID Verification
  id_type TEXT,
  id_number TEXT,
  id_expiry_date DATE,
  id_document_url TEXT,
  id_selfie_url TEXT,

  -- Step 3: Business Details (Vendor/Carrier)
  business_name TEXT,
  business_type TEXT,
  registration_number TEXT,
  year_established INTEGER,
  website TEXT,
  description TEXT,
  cac_document_url TEXT,

  -- Step 4: Address Proof
  street_address TEXT,
  city TEXT,
  state TEXT,
  country TEXT DEFAULT 'NG',
  postal_code TEXT,
  address_proof_url TEXT,
  address_proof_type TEXT,

  -- Step 5: Bank Information
  bank_name TEXT,
  account_name TEXT,
  account_number TEXT,
  bank_code TEXT,
  swift_code TEXT,
  bank_statement_url TEXT,

  -- AI Verification
  ai_risk_score DECIMAL(5,2),
  ai_authenticity_score DECIMAL(5,2),
  ai_review_notes JSONB DEFAULT '{}',
  ai_flags TEXT[] DEFAULT '{}',
  ai_reviewed_at TIMESTAMPTZ,

  -- Admin Review
  admin_id UUID REFERENCES profiles(id),
  admin_notes TEXT,
  rejection_reason TEXT,
  more_info_requested TEXT,
  reviewed_at TIMESTAMPTZ,

  -- Metadata
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE kyc_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own KYC" ON kyc_applications
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all KYC" ON kyc_applications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE INDEX kyc_applications_user_idx ON kyc_applications(user_id);
CREATE INDEX kyc_applications_status_idx ON kyc_applications(status);
CREATE INDEX kyc_applications_role_idx ON kyc_applications(role);

-- ─── KYC Documents ────────────────────────────────────────────────────────────

CREATE TABLE kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kyc_application_id UUID NOT NULL REFERENCES kyc_applications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id),
  document_type kyc_document_type NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,

  -- AI Analysis
  ai_verified BOOLEAN DEFAULT FALSE,
  ai_confidence DECIMAL(3,2),
  ai_extracted_data JSONB DEFAULT '{}',
  ai_flags TEXT[] DEFAULT '{}',
  ai_authenticity_score DECIMAL(3,2),

  -- Review
  is_verified BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES profiles(id),
  verification_notes TEXT,

  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE kyc_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own KYC docs" ON kyc_documents
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Admins can view all KYC docs" ON kyc_documents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ─── Consent Management ───────────────────────────────────────────────────────

CREATE TABLE consent_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,

  -- Consent flags
  analytics_consent BOOLEAN NOT NULL DEFAULT FALSE,
  marketing_consent BOOLEAN NOT NULL DEFAULT FALSE,
  data_sharing_consent BOOLEAN NOT NULL DEFAULT FALSE,
  essential_consent BOOLEAN NOT NULL DEFAULT TRUE,

  -- Versions
  privacy_policy_version TEXT,
  terms_version TEXT,
  consent_banner_version TEXT,

  -- Metadata
  consent_source TEXT NOT NULL DEFAULT 'web', -- web, mobile, api
  consent_method TEXT NOT NULL DEFAULT 'explicit', -- explicit, implied
  withdrawn_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own consent" ON consent_records
  FOR ALL USING (user_id = auth.uid() OR user_id IS NULL);

CREATE INDEX consent_user_idx ON consent_records(user_id);
CREATE INDEX consent_session_idx ON consent_records(session_id);

-- ─── Audit Trail ──────────────────────────────────────────────────────────────

CREATE TYPE audit_action AS ENUM (
  'kyc_submitted', 'kyc_approved', 'kyc_rejected', 'kyc_more_info',
  'order_placed', 'payment_received', 'escrow_created',
  'escrow_first_release', 'escrow_second_release', 'escrow_refund',
  'user_login', 'user_logout', 'password_changed', 'email_changed',
  'data_export_requested', 'account_deleted',
  'document_uploaded', 'document_verified',
  'ai_classification', 'ai_chat_message',
  'dispute_opened', 'dispute_resolved',
  'vendor_approved', 'carrier_approved'
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  admin_id UUID REFERENCES profiles(id),
  action audit_action NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  before_state JSONB,
  after_state JSONB,
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN NOT NULL DEFAULT TRUE,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit logs are append-only — no UPDATE or DELETE
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audit logs" ON audit_logs
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Admins can view all audit logs" ON audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Authenticated users can insert audit logs" ON audit_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE INDEX audit_logs_user_idx ON audit_logs(user_id, created_at DESC);
CREATE INDEX audit_logs_action_idx ON audit_logs(action, created_at DESC);
CREATE INDEX audit_logs_entity_idx ON audit_logs(entity_type, entity_id);

-- ─── Data Export Requests ─────────────────────────────────────────────────────

CREATE TABLE data_export_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  request_type TEXT NOT NULL DEFAULT 'full_export', -- full_export, orders_only, profile_only
  status TEXT NOT NULL DEFAULT 'pending', -- pending, processing, ready, expired, failed
  download_url TEXT,
  expires_at TIMESTAMPTZ,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

ALTER TABLE data_export_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own export requests" ON data_export_requests
  FOR ALL USING (user_id = auth.uid());

-- ─── Rate Limiting Tracking ───────────────────────────────────────────────────

CREATE TABLE rate_limit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  identifier TEXT NOT NULL, -- IP or user_id
  endpoint TEXT NOT NULL,
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  window_end TIMESTAMPTZ NOT NULL,
  blocked BOOLEAN DEFAULT FALSE
);

CREATE INDEX rate_limit_identifier_idx ON rate_limit_log(identifier, endpoint, window_start);

-- ─── KYC Notifications ────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION notify_kyc_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status <> OLD.status THEN
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (
      NEW.user_id,
      'kyc_' || NEW.status,
      CASE NEW.status
        WHEN 'approved' THEN '✅ KYC Verification Approved'
        WHEN 'rejected' THEN '❌ KYC Verification Rejected'
        WHEN 'more_info_requested' THEN '📋 More Information Required'
        WHEN 'pending_admin' THEN '🔍 KYC Under Review'
        ELSE 'KYC Status Updated'
      END,
      CASE NEW.status
        WHEN 'approved' THEN 'Congratulations! Your KYC verification has been approved. You can now trade on EKDA.'
        WHEN 'rejected' THEN 'Your KYC application was not approved. Please check the admin notes and resubmit.'
        WHEN 'more_info_requested' THEN 'Additional information is required to complete your verification.'
        WHEN 'pending_admin' THEN 'Your KYC application is under review. We''ll notify you within 24 hours.'
        ELSE 'Your KYC status has been updated to ' || NEW.status
      END,
      jsonb_build_object('application_id', NEW.id, 'status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_kyc_status_change
  AFTER UPDATE ON kyc_applications
  FOR EACH ROW EXECUTE FUNCTION notify_kyc_status_change();

-- ─── Auto-update updated_at ────────────────────────────────────────────────────

CREATE TRIGGER update_kyc_applications_updated_at
  BEFORE UPDATE ON kyc_applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_consent_records_updated_at
  BEFORE UPDATE ON consent_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
