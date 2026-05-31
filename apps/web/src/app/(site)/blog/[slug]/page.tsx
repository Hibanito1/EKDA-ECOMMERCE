import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@ekda/shared";

const ARTICLES: Record<string, {
  title: string; excerpt: string; category: string; author: string; date: string; readTime: string; emoji: string;
  content: string; seo_description: string;
}> = {
  "how-to-import-car-to-nigeria": {
    title: "Complete Guide to Importing a Car to Nigeria in 2025",
    excerpt: "Step-by-step guide covering customs duties, port procedures, required documentation, and how to avoid common mistakes.",
    category: "Importing",
    author: "EKDA Trade Team",
    date: "2025-06-01",
    readTime: "8 min read",
    emoji: "🚗",
    seo_description: "Learn how to import a car to Nigeria in 2025. Complete guide on customs duties (35%), port procedures, required documents, and using EKDA for escrow-protected vehicle imports.",
    content: `
## Why Import a Car to Nigeria?

Importing a quality used car from the USA, UK, or Germany can save you 30-50% compared to buying locally, especially for high-end vehicles like Toyota, Mercedes-Benz, or BMW.

## Step-by-Step Import Process

### Step 1: Find Your Vehicle on EKDA
Browse our Global Imports marketplace for vehicles from verified international vendors. Our AI automatically assigns the correct HS code (8703.xx) and calculates estimated duties.

### Step 2: Understand the Costs
The total cost of importing includes:
- **Vehicle price** (FOB or CIF)
- **Freight cost** (Sea only — RoRo or Container)
- **Import duty**: 35% of CIF value
- **Port levy**: 7% of CIF value  
- **VAT**: 7.5% on total
- **Clearing agent fees**: ₦80,000–₦120,000
- **CISS surcharge**: 1%

*Example: A $10,000 car (₦16.5M) with $500 freight = CIF ₦17.3M → Duties ~₦7.4M → Total landed ~₦25M*

### Step 3: Required Documents
- Commercial Invoice (from vendor)
- Bill of Lading (from shipping line)
- Certificate of Title / Vehicle Registration
- Import Declaration (Form M)
- NESS Certificate

### Step 4: Pay via EKDA Escrow
Your payment is held 100% in escrow. You pay nothing direct to the vendor or carrier outside EKDA.

### Step 5: Choose Sea Freight
Vehicles CANNOT be air freighted. Use RoRo (Roll-on/Roll-off) for cheaper rates or container for more security.

### Step 6: Port Clearance
At Apapa or Tin Can Island Port, your clearing agent handles:
- Customs documentation
- Scanning and inspection
- Duty payment
- Physical release

### Common Mistakes to Avoid
- ❌ Not verifying vehicle history (use Carfax/AutoCheck)
- ❌ Using an unregistered clearing agent
- ❌ Undervaluing the vehicle (attracts penalties)
- ❌ Not budgeting for all fees (many buyers forget VAT and port levies)

## Why Use EKDA for Vehicle Imports?
- 🔒 Escrow protection — only pay when your car arrives
- 🤖 AI HS Code assignment and duty pre-calculation
- 📋 Verified vendor network from USA, UK, Germany
- 📍 Direct port delivery options
`,
  },
  "escrow-explained-for-african-trade": {
    title: "How EKDA Escrow Protects Your Money in Cross-Border Trade",
    excerpt: "A plain-English explanation of how escrow works — the 50/50 release system, what triggers each release, and how disputes are handled.",
    category: "Payments",
    author: "EKDA Finance Team",
    date: "2025-05-28",
    readTime: "5 min read",
    emoji: "🔒",
    seo_description: "Understand how EKDA's escrow system protects buyers and vendors in African cross-border trade. Learn about the 50/50 pickup-and-delivery release mechanism.",
    content: `
## What is Escrow?

Escrow is a neutral holding account where your payment sits until specific conditions are met. EKDA acts as the trusted third party between buyer and seller.

## How EKDA's 50/50 Escrow Works

### Stage 1: Order Placed (100% Held)
When you pay for an order, 100% goes directly into EKDA's escrow account — not to the vendor. The vendor knows the money is secured, so they immediately begin preparing your order.

### Stage 2: Carrier Confirms Pickup (50% Released)
When your assigned carrier scans and confirms physical pickup of goods from the vendor, EKDA automatically releases 50% of the vendor's share.

This protects vendors against non-shipment while giving buyers confidence the goods are actually moving.

### Stage 3: Arrival Confirmed (Final 50% Released)
When the carrier confirms arrival at your destination port or address, the remaining 50% is released to the vendor.

## The 10% EKDA Commission
EKDA deducts 10% from the vendor's payment as our platform commission. This is automatically applied before release — no hidden fees.

## What Happens in a Dispute?
If you raise a dispute, escrow funds are frozen. Our team mediates between the parties and reviews evidence. Resolution typically takes 48–72 hours.

## Why This Protects Everyone
- **Buyers**: Never lose money to scams — if goods don't arrive, funds are returned
- **Vendors**: Guaranteed payment once goods are confirmed picked up
- **Carriers**: Clear incentive to confirm milestones accurately
`,
  },
  "hs-codes-guide-nigerian-exporters": {
    title: "HS Code Guide for Nigerian Exporters: Crayfish, Palm Oil & More",
    excerpt: "Everything Nigerian exporters need to know about HS codes — what they are, how to get them right, and how EKDA AI auto-classifies products.",
    category: "Compliance",
    author: "EKDA Compliance",
    date: "2025-05-22",
    readTime: "6 min read",
    emoji: "📋",
    seo_description: "Complete guide to HS codes for Nigerian exporters. Learn how to classify crayfish, palm oil, garri, and other African exports using EKDA's AI HS Code Engine.",
    content: `
## What is an HS Code?

The Harmonized System (HS) code is an international classification for goods traded across borders. Every product in international trade has a unique code.

## Why HS Codes Matter for Nigerian Exporters

- **Customs duty calculation** — import duties in destination countries depend on HS code
- **Shipping restrictions** — some codes are restricted from air cargo
- **Trade agreements** — preferential tariff rates depend on correct classification
- **Legal compliance** — incorrect HS codes can lead to fines or cargo seizure

## Common Nigerian Export HS Codes

| Product | HS Code | Air Cargo |
|---------|---------|-----------|
| Dried Crayfish | 0306.17 | ✅ Allowed |
| Palm Oil (Crude) | 1511.10 | ✅ Allowed |
| Garri / Cassava products | 1903.00 | ✅ Allowed |
| Stockfish / Dried Fish | 0305.41 | ⚠️ Restricted |
| Frozen Fish | 0303.xx | ❌ Air Restricted |
| Bitter Kola | 0802.80 | ✅ Allowed |
| Shea Butter | 1515.90 | ✅ Allowed |
| Cocoa Beans | 1801.00 | ✅ Allowed |
| Sesame Seeds | 1207.40 | ✅ Allowed |

## How EKDA AI Classifies Your Products

EKDA's AI HS Code Engine (powered by Groq's Llama model) analyzes your product name, description, and category to suggest the correct HS code in under 1 second with 97%+ accuracy.

1. Go to Dashboard → Products → Add Product
2. Fill in product name and description
3. AI instantly suggests HS code with confidence score
4. Review and confirm — you can edit if needed
5. HS code is saved to the product and included on all shipping documents

## What if the AI Gets It Wrong?

The AI suggests — you verify. If you're unsure, EKDA's compliance team can review your product. You can also use the [UN Comtrade HS Search](https://comtrade.un.org) or consult with a licensed customs agent.
`,
  },
};

export async function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) return {};
  return {
    title: article.title,
    description: article.seo_description,
    openGraph: {
      title: article.title,
      description: article.seo_description,
      type: "article",
      publishedTime: article.date,
      authors: [article.author],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.seo_description,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  if (!article) notFound();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Back */}
        <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors mb-8 inline-flex items-center gap-1">
          ← Back to Blog
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline">{article.category}</Badge>
            <span className="text-sm text-muted-foreground">{article.readTime}</span>
          </div>
          <div className="text-5xl mb-4">{article.emoji}</div>
          <h1 className="text-3xl font-bold leading-tight mb-4">{article.title}</h1>
          <p className="text-lg text-muted-foreground mb-4">{article.excerpt}</p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>By {article.author}</span>
            <span>·</span>
            <span>{formatDate(article.date)}</span>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-bold prose-h2:text-xl prose-h2:mt-8 prose-h3:text-base prose-h3:mt-6 prose-p:text-muted-foreground prose-p:leading-relaxed">
          {article.content.split("\n").map((line, i) => {
            if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold mt-8 mb-3">{line.slice(3)}</h2>;
            if (line.startsWith("### ")) return <h3 key={i} className="text-base font-semibold mt-5 mb-2">{line.slice(4)}</h3>;
            if (line.startsWith("- ") || line.startsWith("* ")) return <li key={i} className="text-sm text-muted-foreground ml-4 mb-1">{line.slice(2)}</li>;
            if (line.startsWith("| ")) return null;
            if (line.trim() === "") return <div key={i} className="h-3" />;
            return <p key={i} className="text-sm text-muted-foreground leading-relaxed">{line}</p>;
          })}
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 bg-gradient-to-br from-ekda-green-900 to-ekda-dark rounded-3xl text-white text-center">
          <h3 className="text-xl font-bold mb-2">Ready to start trading?</h3>
          <p className="text-white/70 text-sm mb-5">Join 50,000+ vendors, customers, and carriers on EKDA</p>
          <div className="flex gap-3 justify-center">
            <Link href="/auth/register">
              <Button className="bg-ekda-green-500 hover:bg-ekda-green-400 text-white">
                Create Free Account
              </Button>
            </Link>
            <Link href="/help">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
