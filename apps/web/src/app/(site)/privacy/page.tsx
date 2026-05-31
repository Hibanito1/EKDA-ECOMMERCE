import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "EKDA Privacy Policy — How we collect, use, and protect your data in compliance with NDPR and GDPR",
};

const LAST_UPDATED = "1 June 2025";
const PRIVACY_VERSION = "v1.2";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="text-muted-foreground mt-1">
              Last updated: {LAST_UPDATED} · Version {PRIVACY_VERSION}
            </p>
          </div>
          <div className="ml-auto flex gap-2">
            <span className="px-3 py-1 bg-ekda-green-50 dark:bg-ekda-green-900/20 text-ekda-green-700 dark:text-ekda-green-400 rounded-full text-xs font-medium border border-ekda-green-200 dark:border-ekda-green-800">
              NDPR Compliant
            </span>
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs font-medium border border-blue-200 dark:border-blue-800">
              GDPR Compliant
            </span>
          </div>
        </div>

        <div className="prose prose-sm max-w-none dark:prose-invert">
          <div className="p-4 bg-muted/40 rounded-2xl border border-border mb-8 text-sm">
            <strong>Summary:</strong> EKDA Technologies Ltd (&ldquo;EKDA&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) operates an African cross-border marketplace. We collect your data only to provide and improve our services, protect against fraud, and comply with legal obligations. We never sell your personal data to third parties. You have full rights to access, correct, export, and delete your data.
          </div>

          {[
            {
              title: "1. Who We Are",
              content: `EKDA Technologies Ltd is a company registered in Nigeria (RC: 1234567) with registered offices at Victoria Island, Lagos, Nigeria. We operate the EKDA Marketplace platform available at ekda.io and via our mobile applications.

Data Controller: EKDA Technologies Ltd
Data Protection Officer: dpo@ekda.io
Address: 12 Adeola Odeku Street, Victoria Island, Lagos, Nigeria.`,
            },
            {
              title: "2. Data We Collect",
              content: `**Account Information:** Full name, email address, phone number, date of birth, nationality, profile photo.

**KYC Verification Data:** Government-issued ID (NIN, passport, driver's license), selfie photo, proof of address, business registration certificates, tax identification numbers.

**Transaction Data:** Orders placed, products purchased, payment references, shipping addresses, escrow transactions.

**Business Information (Vendors/Carriers):** Company name, CAC registration number, bank account details, product listings.

**Technical Data:** IP address, browser type, device information, cookies and tracking pixels (with consent), log files.

**Communications:** Support chat history, dispute records, review and rating content.`,
            },
            {
              title: "3. Legal Basis for Processing",
              content: `We process your personal data on the following legal bases:

**Performance of Contract:** To create and manage your account, process orders, facilitate payments, and provide our marketplace services.

**Legal Obligation:** KYC/AML compliance, tax reporting, fraud prevention, regulatory requirements.

**Legitimate Interests:** Platform security, fraud detection, service improvement, analytics (where these do not override your rights).

**Consent:** Marketing communications, analytics tracking, data sharing with partners. You may withdraw consent at any time.`,
            },
            {
              title: "4. How We Use Your Data",
              content: `- Account creation and management
- KYC identity verification and compliance
- Processing and tracking orders
- Escrow payment management
- Fraud detection and risk assessment
- Customer support and dispute resolution
- Sending transactional notifications (order updates, payment confirmations)
- Marketing communications (with consent only)
- Platform analytics and improvement
- Legal compliance and regulatory reporting`,
            },
            {
              title: "5. Data Sharing",
              content: `**Payment Processors:** Paystack, Stripe, Monnify — to process payments securely. They are bound by their own privacy policies.

**Logistics Partners:** Carrier companies — to arrange shipments. Only name, contact details, and shipment information are shared.

**AI Services:** OpenAI/Groq — for HS code classification and document verification. Data is anonymized where possible.

**Supabase:** Our infrastructure provider for database and authentication services.

**Legal Authorities:** We may disclose data when required by Nigerian law, court order, or to prevent imminent harm.

**We do NOT sell, rent, or trade your personal data to advertisers or data brokers.**`,
            },
            {
              title: "6. KYC Data Handling",
              content: `KYC documents (ID scans, selfies, business documents) are:
- Stored with AES-256 encryption in Supabase's secure storage
- Accessible only to authorized EKDA compliance staff
- Used solely for identity verification purposes
- Retained for 7 years as required by Nigerian SCUML and FCCPC regulations
- Never shared with third parties except legal authorities or with your explicit consent

AI document verification uses secure, encrypted API calls. No document data is retained by AI providers beyond the immediate API request.`,
            },
            {
              title: "7. Your Rights",
              content: `Under NDPR (Nigeria) and GDPR (EU/UK), you have the following rights:

**Access:** Request a copy of all personal data we hold about you.
**Rectification:** Correct inaccurate or incomplete data.
**Erasure:** Request deletion of your data (subject to legal retention requirements).
**Portability:** Receive your data in a machine-readable format (JSON/CSV).
**Restriction:** Restrict how we process your data in certain circumstances.
**Objection:** Object to processing based on legitimate interests.
**Withdraw Consent:** Withdraw marketing or analytics consent at any time.
**Complaint:** Lodge a complaint with NITDA (Nigeria) or your local data protection authority.

To exercise these rights, visit your account settings or email privacy@ekda.io`,
            },
            {
              title: "8. Data Retention",
              content: `- Active account data: Retained while your account is active
- Transaction records: 7 years (Nigerian tax law requirement)
- KYC documents: 7 years after account closure (SCUML requirement)
- Marketing preferences: Until you withdraw consent
- Audit logs: 5 years
- Deleted account data: Fully erased within 90 days except legal holds`,
            },
            {
              title: "9. Cookies",
              content: `EKDA uses the following types of cookies:

**Essential Cookies:** Required for authentication, security, and shopping cart functionality. Cannot be disabled.

**Analytics Cookies:** PostHog and Sentry for usage analytics and error tracking. Disabled by default — requires your consent.

**Marketing Cookies:** Used for campaign measurement and personalization. Disabled by default — requires your consent.

You can manage cookie preferences using our consent banner or in your account settings.`,
            },
            {
              title: "10. Security",
              content: `We implement industry-standard security measures including:
- AES-256 encryption for data at rest
- TLS 1.3 for data in transit
- Row-level security in our database
- Multi-factor authentication support
- Regular security audits
- PCI-DSS compliant payment processing
- SOC 2 Type II certified infrastructure

Despite these measures, no internet transmission is 100% secure. Please use a strong, unique password and enable 2FA on your account.`,
            },
            {
              title: "11. International Transfers",
              content: `EKDA serves users globally. Your data may be processed by our infrastructure partners (Supabase, AWS) in the United States and European Union. All transfers comply with applicable data protection laws, including NDPR Adequacy regulations and GDPR Standard Contractual Clauses (SCCs).`,
            },
            {
              title: "12. Children's Privacy",
              content: `EKDA is not intended for persons under 18 years of age. We do not knowingly collect data from minors. If we become aware that a minor has created an account, we will promptly delete the account and all associated data.`,
            },
            {
              title: "13. Contact Us",
              content: `For privacy inquiries, data requests, or to exercise your rights:

**Email:** privacy@ekda.io
**DPO:** dpo@ekda.io
**Post:** EKDA Technologies Ltd, Data Protection Officer, 12 Adeola Odeku Street, Victoria Island, Lagos, Nigeria.

We will respond to all requests within 30 days as required by NDPR.`,
            },
          ].map((section) => (
            <section key={section.title} className="mb-8">
              <h2 className="text-lg font-bold mb-3">{section.title}</h2>
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Questions about this policy?{" "}
            <a href="mailto:privacy@ekda.io" className="text-primary hover:underline">
              Contact our Data Protection Officer
            </a>
          </p>
          <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
            View Terms of Service →
          </Link>
        </div>
      </div>
    </div>
  );
}
