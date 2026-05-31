import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "EKDA Terms of Service — Rules governing the use of our marketplace platform",
};

const LAST_UPDATED = "1 June 2025";
const TERMS_VERSION = "v1.3";

export default function TermsPage() {
  const TERMS_SECTIONS = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing or using the EKDA Marketplace platform (ekda.io, mobile applications, and APIs), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, you must not use EKDA.

These terms apply to all users: Customers, Vendors, Enterprise Buyers, Carriers, and Administrators. Additional role-specific terms apply and are referenced below.`,
    },
    {
      title: "2. Platform Description",
      content: `EKDA is a two-way cross-border marketplace that:
(a) Enables Nigerian and African vendors to sell groceries, dried/frozen produce, and agricultural commodities to customers globally
(b) Enables international vendors to sell vehicles, electronics, machinery, and goods to Nigerian and African buyers
(c) Provides logistics, escrow, AI compliance tools, and payment gateway services to facilitate trade`,
    },
    {
      title: "3. Account Registration & KYC",
      content: `**Registration:** You must provide accurate, complete information. You are responsible for maintaining the security of your account credentials.

**KYC Verification:** Vendors, Carriers, and Enterprise Buyers must complete KYC verification before trading. Providing false KYC information is grounds for immediate termination and may be reported to Nigerian EFCC.

**Account Age:** You must be 18 years or older to register.

**One Account Rule:** Each person or business entity may have one account. Operating multiple accounts to circumvent restrictions is prohibited.`,
    },
    {
      title: "4. Escrow Payment System",
      content: `EKDA operates a mandatory escrow system:

(a) Customer pays 100% of the order total upfront into EKDA escrow
(b) First Release (50% of vendor's share): Triggered when the assigned carrier confirms physical pickup of goods
(c) Second Release (50% of vendor's share): Triggered when carrier confirms arrival at destination port or address
(d) EKDA Commission: 10% is automatically deducted from the vendor's share before release

**Escrow Protection:** EKDA holds funds as a trustee only. We do not earn interest on escrow funds.

**Disputes:** If a dispute is raised, funds are frozen until resolved by EKDA's dispute team or arbitration.`,
    },
    {
      title: "5. Vendor Obligations",
      content: `As a Vendor on EKDA, you agree to:
(a) Provide accurate product descriptions, weights, and origin information
(b) Ensure all products comply with export regulations of your country and import regulations of destination countries
(c) Obtain and maintain required permits, certificates (phytosanitary, NAFDAC, USDA, etc.)
(d) Package goods appropriately for sea or air freight as required
(e) Prepare accurate shipping documentation within 3 business days of order confirmation
(f) Not list counterfeit, prohibited, or regulated goods without proper licensing
(g) Maintain accurate inventory levels to prevent unfulfilled orders
(h) Accept that EKDA may use AI to classify your products with HS codes — you may review and update these`,
    },
    {
      title: "6. Carrier Obligations",
      content: `As a Carrier on EKDA, you agree to:
(a) Maintain valid operating licenses and insurance in all jurisdictions you serve
(b) Confirm pickup of goods within 24 hours of carrier assignment — failure triggers automatic reassignment
(c) Provide accurate real-time tracking updates at each milestone
(d) Immediately report any damage, loss, or delay to EKDA and the affected parties
(e) Confirm destination arrival within 24 hours of arrival — this triggers escrow release
(f) Not demand additional payment from buyers or vendors beyond the agreed rate
(g) Handle documents (Bill of Lading, manifests) accurately and promptly`,
    },
    {
      title: "7. Prohibited Activities",
      content: `The following are strictly prohibited on EKDA:

**Products:** Weapons, drugs, counterfeit goods, child sexual abuse material, endangered species, stolen property, human trafficking, unlicensed pharmaceuticals.

**Behavior:** Fraud, money laundering, market manipulation, review manipulation, creating fake accounts, circumventing KYC, harassing other users.

**Technical:** Reverse engineering, scraping, DDoS attacks, unauthorized API access, attempting to bypass security measures.

Violations will result in immediate account suspension, legal action where applicable, and reporting to relevant authorities.`,
    },
    {
      title: "8. AI Features & Disclaimer",
      content: `EKDA uses AI for HS code classification, document verification, cargo recommendations, and risk scoring. These AI tools are provided as assistance only:

(a) AI HS Code suggestions are not legal advice. You remain responsible for ensuring correct classification
(b) AI document verification does not guarantee authenticity — human review is conducted for all KYC documents
(c) AI risk scores are advisory only — EKDA may override AI decisions
(d) AI-generated content in chatbot responses is for guidance only — consult customs professionals for complex matters`,
    },
    {
      title: "9. Fees & Commissions",
      content: `**Platform Commission:** EKDA charges 10% of the transaction value (subtotal). This is automatically deducted from vendor proceeds.

**Premium Subscriptions:** Reduced commission rates apply for Starter (8.5%), Growth (7.5%), and Enterprise (7%) plans. Subscription fees are non-refundable.

**Payment Processing:** Standard payment gateway fees apply (typically 1.5–2.5% via Paystack/Stripe/Monnify).

**No Hidden Fees:** All fees are disclosed before checkout. EKDA does not charge listing fees.`,
    },
    {
      title: "10. Dispute Resolution",
      content: `If a dispute arises between buyer and vendor:

(a) Either party may open a dispute through the EKDA Dispute Center
(b) The other party has 72 hours to respond
(c) EKDA's dispute team will review evidence submitted by both parties
(d) EKDA's decision is final within our platform (either party may pursue external remedies)
(e) If resolution requires escrow adjustment, EKDA will action within 5 business days
(f) Abuse of the dispute system may result in account suspension`,
    },
    {
      title: "11. Liability Limitations",
      content: `EKDA acts as a marketplace intermediary and does not manufacture, store, or ship goods directly. Therefore:

(a) EKDA is not liable for the quality, legality, or authenticity of products listed by vendors
(b) EKDA is not liable for carrier delays, damage, or loss beyond facilitating the dispute resolution process
(c) Our maximum liability to any user shall not exceed the value of the disputed transaction
(d) EKDA is not liable for indirect, consequential, or punitive damages
(e) Force majeure events (acts of God, government actions, port strikes) release EKDA from performance obligations`,
    },
    {
      title: "12. Governing Law & Jurisdiction",
      content: `These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved by the courts of Lagos State, Nigeria, or through arbitration at the Lagos Multi-Door Courthouse (LMDC).

Users outside Nigeria may also have rights under their local consumer protection laws, which are not excluded by these terms.`,
    },
    {
      title: "13. Changes to Terms",
      content: `EKDA may update these Terms from time to time. Material changes will be notified via email and an in-app banner 30 days before they take effect. Your continued use after that date constitutes acceptance of the updated terms.`,
    },
    {
      title: "14. Contact",
      content: `For legal notices or terms-related queries:
Email: legal@ekda.io
Post: EKDA Technologies Ltd, 12 Adeola Odeku Street, Victoria Island, Lagos, Nigeria.`,
    },
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground mt-1">
            Last updated: {LAST_UPDATED} · Version {TERMS_VERSION}
          </p>
        </div>

        <div className="p-4 bg-muted/40 rounded-2xl border border-border mb-8 text-sm text-muted-foreground">
          <strong>Important:</strong> Please read these Terms carefully before using EKDA. These terms create a legally binding agreement between you and EKDA Technologies Ltd. If you are using EKDA on behalf of a business, you represent that you have authority to bind that business.
        </div>

        <div className="space-y-8">
          {TERMS_SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-bold mb-3">{section.title}</h2>
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border text-center space-y-3">
          <p className="text-sm text-muted-foreground">
            Legal questions?{" "}
            <a href="mailto:legal@ekda.io" className="text-primary hover:underline">legal@ekda.io</a>
          </p>
          <div className="flex justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Legal</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
