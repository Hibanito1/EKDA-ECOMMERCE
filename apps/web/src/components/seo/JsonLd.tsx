import type { Metadata } from "next";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
  keywords?: string[];
  noIndex?: boolean;
}

export function generateSEO({
  title = "EKDA — Africa's Premier Cross-Border Marketplace",
  description = "Shop authentic African groceries and import quality vehicles, electronics, and machinery to Nigeria. Escrow-protected trade platform with AI compliance.",
  image = "/og-image.png",
  url = "https://ekda.io",
  type = "website",
  publishedTime,
  authors,
  keywords = [],
  noIndex = false,
}: SEOProps = {}): Metadata {
  const baseKeywords = [
    "african groceries",
    "nigeria import",
    "diaspora shopping",
    "export africa",
    "crayfish palm oil",
    "import car nigeria",
    "escrow marketplace",
    "cross border trade",
    "EKDA marketplace",
  ];

  return {
    title,
    description,
    keywords: [...baseKeywords, ...keywords].join(", "),
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: "EKDA Marketplace",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(publishedTime && { publishedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: "summary_large_image",
      site: "@ekda_io",
      creator: "@ekda_io",
      title,
      description,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

// Structured data for SEO
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "EKDA Technologies Ltd",
    url: "https://ekda.io",
    logo: "https://ekda.io/icons/icon-512x512.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+234-800-EKDA-HELP",
      contactType: "customer service",
      availableLanguage: ["English", "Yoruba", "Pidgin"],
    },
    sameAs: [
      "https://twitter.com/ekda_io",
      "https://instagram.com/ekda_io",
      "https://linkedin.com/company/ekda",
    ],
  };
}

export function generateMarketplaceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "EKDA Marketplace",
    url: "https://ekda.io",
    description: "Africa's premier cross-border marketplace for African exports and global imports to Nigeria",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://ekda.io/marketplace/export?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  price: number;
  currency: string;
  image?: string;
  category?: string;
  rating?: number;
  reviewCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    category: product.category,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: "EKDA Marketplace" },
    },
    ...(product.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: product.rating,
        reviewCount: product.reviewCount || 1,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
}

export function generateFAQSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// Inline JSON-LD component
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
