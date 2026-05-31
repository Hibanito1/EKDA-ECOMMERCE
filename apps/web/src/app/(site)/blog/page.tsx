import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@ekda/shared";

export const metadata: Metadata = {
  title: "Blog — Trade Guides, Import & Export Tips",
  description: "Learn how to export African goods, import vehicles to Nigeria, navigate customs, and grow your cross-border business with EKDA.",
};

const BLOG_POSTS = [
  {
    slug: "how-to-import-car-to-nigeria",
    title: "Complete Guide to Importing a Car to Nigeria in 2025",
    excerpt: "Step-by-step guide covering customs duties, port procedures, required documentation, and how to avoid common mistakes when importing vehicles.",
    category: "Importing",
    author: "EKDA Trade Team",
    date: "2025-06-01",
    readTime: "8 min read",
    emoji: "🚗",
    featured: true,
  },
  {
    slug: "escrow-explained-for-african-trade",
    title: "How EKDA Escrow Protects Your Money in Cross-Border Trade",
    excerpt: "A plain-English explanation of how escrow works on EKDA — the 50/50 release system, what triggers each release, and how disputes are handled.",
    category: "Payments",
    author: "EKDA Finance Team",
    date: "2025-05-28",
    readTime: "5 min read",
    emoji: "🔒",
    featured: true,
  },
  {
    slug: "hs-codes-guide-nigerian-exporters",
    title: "HS Code Guide for Nigerian Exporters: Crayfish, Palm Oil & More",
    excerpt: "Everything Nigerian exporters need to know about Harmonized System codes — what they are, how to get them right, and how EKDA AI auto-classifies your products.",
    category: "Compliance",
    author: "EKDA Compliance",
    date: "2025-05-22",
    readTime: "6 min read",
    emoji: "📋",
    featured: false,
  },
  {
    slug: "diaspora-grocery-business-uk",
    title: "How to Build a ₦10M/Month African Grocery Business from the UK",
    excerpt: "Success story and playbook: how Nigerian diaspora entrepreneurs are building thriving food businesses serving their communities across Europe.",
    category: "Success Stories",
    author: "Community Team",
    date: "2025-05-15",
    readTime: "10 min read",
    emoji: "🌿",
    featured: false,
  },
  {
    slug: "sea-vs-air-freight-guide",
    title: "Sea vs Air Freight for African Goods: The Complete Comparison",
    excerpt: "Cost breakdown, transit times, cargo restrictions, and when to choose each option. Includes real examples with pricing for Lagos to London.",
    category: "Logistics",
    author: "EKDA Logistics",
    date: "2025-05-08",
    readTime: "7 min read",
    emoji: "🚢",
    featured: false,
  },
];

const CATEGORIES = ["All", "Importing", "Exporting", "Payments", "Compliance", "Logistics", "Success Stories"];

export default function BlogPage() {
  const featured = BLOG_POSTS.filter((p) => p.featured);
  const regular = BLOG_POSTS.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-ekda-dark to-ekda-navy text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Badge className="mb-4 bg-white/10 text-white border-white/20">📚 EKDA Trade Knowledge</Badge>
          <h1 className="text-4xl font-bold mb-3">Learn to Trade Better</h1>
          <p className="text-white/70 text-lg">
            Expert guides on importing, exporting, customs compliance, and building cross-border businesses
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Featured Posts */}
        <h2 className="text-xl font-bold mb-6">Featured Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {featured.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-ekda-dark to-ekda-navy flex items-center justify-center group-hover:opacity-95 transition-opacity">
                  <span className="text-6xl">{post.emoji}</span>
                </div>
                <CardContent className="p-5">
                  <Badge variant="outline" className="text-[10px] mb-2">{post.category}</Badge>
                  <h3 className="font-bold text-lg leading-snug mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{post.author}</span>
                    <span>·</span>
                    <span>{formatDate(post.date)}</span>
                    <span>·</span>
                    <span>{post.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* All Posts */}
        <h2 className="text-xl font-bold mb-6">All Articles</h2>
        <div className="space-y-4">
          {regular.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200">
                <CardContent className="p-5 flex gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center text-3xl flex-shrink-0 group-hover:bg-primary/5 transition-colors">
                    {post.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px]">{post.category}</Badge>
                      <span className="text-xs text-muted-foreground">{post.readTime}</span>
                    </div>
                    <h3 className="font-semibold leading-snug mb-1 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{post.excerpt}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
