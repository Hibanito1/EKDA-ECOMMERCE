"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { SmartRecommendations } from "@/components/ai/SmartRecommendations";
import { PriceIntelligence } from "@/components/ai/PriceIntelligence";
import { JsonLd, generateOrganizationSchema, generateMarketplaceSchema } from "@/components/seo/JsonLd";
import {
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Truck,
  Star,
  Package,
  CheckCircle2,
  TrendingUp,
  Lock,
  CreditCard,
  Leaf,
  Car,
  Cpu,
  Wheat,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const STATS = [
  { value: "50K+", label: "Active Vendors" },
  { value: "120+", label: "Countries Served" },
  { value: "₦2.4B+", label: "Goods Traded" },
  { value: "99.8%", label: "Delivery Success" },
];

const FEATURES = [
  {
    icon: Shield,
    title: "Escrow Protection",
    description:
      "100% payment protection. Funds released in two stages: 50% at carrier pickup, 50% at destination arrival.",
    color: "text-ekda-green-600",
    bgColor: "bg-ekda-green-50 dark:bg-ekda-green-900/20",
  },
  {
    icon: Zap,
    title: "AI HS Code Engine",
    description:
      "Automatic Harmonized System Code assignment. AI analyzes products and assigns correct customs codes instantly.",
    color: "text-ekda-gold-600",
    bgColor: "bg-ekda-gold-50 dark:bg-ekda-gold-900/20",
  },
  {
    icon: Globe,
    title: "Multi-Currency Payments",
    description:
      "Pay in NGN, USD, GBP, EUR and more. Paystack for Nigeria, Stripe for diaspora, Monnify supported.",
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
  },
  {
    icon: Truck,
    title: "Smart Logistics AI",
    description:
      "AI detects restricted air cargo items and recommends sea freight with carrier comparison and rates.",
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/20",
  },
  {
    icon: Package,
    title: "Document Verification",
    description:
      "AI OCR verifies phytosanitary, Bill of Lading, certificates of origin, and all trade documents.",
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/20",
  },
  {
    icon: TrendingUp,
    title: "Bulk & Container Orders",
    description:
      "Full 20ft/40ft container support. Bulk pricing tiers, direct vendor negotiations, and enterprise accounts.",
    color: "text-teal-600",
    bgColor: "bg-teal-50 dark:bg-teal-900/20",
  },
];

const CATEGORIES = [
  {
    type: "export",
    icon: Leaf,
    title: "African Groceries",
    description: "Authentic ingredients from Nigeria & Africa",
    count: "12,400+ products",
    image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=400&q=80",
    color: "from-ekda-green-700 to-ekda-green-900",
    href: "/marketplace/export?category=groceries",
  },
  {
    type: "export",
    icon: Wheat,
    title: "Dried & Frozen Produce",
    description: "Premium dried, smoked & frozen commodities",
    count: "8,200+ products",
    image: "https://images.unsplash.com/photo-1571070083701-db30ea3b62f7?w=400&q=80",
    color: "from-ekda-earth-600 to-ekda-earth-800",
    href: "/marketplace/export?category=dried_produce",
  },
  {
    type: "import",
    icon: Car,
    title: "Vehicles & Cars",
    description: "Import quality vehicles to Nigeria",
    count: "3,800+ listings",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=80",
    color: "from-slate-700 to-slate-900",
    href: "/marketplace/import?category=vehicles",
  },
  {
    type: "import",
    icon: Cpu,
    title: "Electronics & Machinery",
    description: "Industrial equipment & consumer electronics",
    count: "28,000+ products",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80",
    color: "from-blue-700 to-blue-900",
    href: "/marketplace/import?category=electronics",
  },
];

const TESTIMONIALS = [
  {
    name: "Adaeze Okonkwo",
    role: "Diaspora Customer, London",
    avatar: "AO",
    content:
      "EKDA makes getting authentic Nigerian groceries in the UK so easy. The escrow system gives me total peace of mind — I paid and received exactly what I ordered.",
    rating: 5,
  },
  {
    name: "Kingsley Eze",
    role: "Vendor, Lagos",
    avatar: "KE",
    content:
      "I've been selling dried crayfish and ogiri internationally for 2 years on EKDA. The AI HS code tool saves me hours of paperwork every week.",
    rating: 5,
  },
  {
    name: "Chen Wei",
    role: "International Vendor, Guangzhou",
    avatar: "CW",
    content:
      "Onboarding was seamless. EKDA handles all the Nigerian import compliance automatically. My electronics reach Nigerian buyers smoothly every time.",
    rating: 5,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <JsonLd data={generateOrganizationSchema()} />
      <JsonLd data={generateMarketplaceSchema()} />
      {/* ─── Hero Section ──────────────────────────────────── */}
      <section className="hero-gradient min-h-[90vh] flex items-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-ekda-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-ekda-gold-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-ekda-green-900/20 rounded-full blur-3xl" />
          {/* African pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(45deg, #22c55e 0px, #22c55e 1px, transparent 1px, transparent 8px),
                repeating-linear-gradient(-45deg, #f59e0b 0px, #f59e0b 1px, transparent 1px, transparent 8px)`,
            }}
          />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-ekda-green-500/20 border border-ekda-green-500/30 rounded-full px-4 py-1.5 mb-8">
                <span className="h-1.5 w-1.5 rounded-full bg-ekda-green-400 animate-pulse" />
                <span className="text-ekda-green-300 text-sm font-medium">
                  Africa&apos;s #1 Cross-Border Marketplace
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.05]">
                Export African{" "}
                <span className="gradient-text">Excellence.</span>
                <br />
                Import Global{" "}
                <span className="text-ekda-gold-400">Innovation.</span>
              </h1>

              <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
                Ship African groceries, dried produce, and agri commodities
                worldwide. Import cars, electronics, and machinery to Nigeria —
                with AI-powered compliance, escrow protection, and smart logistics.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Link href="/marketplace/export">
                  <Button size="xl" variant="premium" className="w-full sm:w-auto">
                    <span>🌿</span>
                    Shop African Goods
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/marketplace/import">
                  <Button
                    size="xl"
                    variant="outline"
                    className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                  >
                    <span>🌍</span>
                    Import to Nigeria
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center gap-6 text-white/50 text-sm">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-ekda-green-400" />
                  <span>Escrow Protected</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-ekda-green-400" />
                  <span>AI Compliance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-ekda-green-400" />
                  <span>Multi-Currency</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-ekda-green-400" />
                  <span>Real-Time Tracking</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-t border-white/10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
              {STATS.map((stat) => (
                <div key={stat.label} className="py-5 px-8 text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Categories ──────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="export" className="mb-4 text-sm px-4 py-1.5">
                Two-Way Marketplace
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Explore Our Marketplace
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                From authentic African groceries to global machinery — we connect
                buyers and sellers across borders seamlessly.
              </p>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <Link href={cat.href}>
                  <div className="group relative rounded-3xl overflow-hidden h-72 cursor-pointer">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-90 group-hover:opacity-95 transition-opacity`}
                    />
                    {/* Background image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity scale-105 group-hover:scale-110 duration-700"
                      style={{ backgroundImage: `url(${cat.image})` }}
                    />
                    <div className="absolute inset-0 p-8 flex flex-col justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
                          <cat.icon className="h-5 w-5 text-white" />
                        </div>
                        <Badge
                          variant={cat.type === "export" ? "export" : "import"}
                          className="text-xs"
                        >
                          {cat.type === "export" ? "🌿 Export" : "🌍 Import"}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {cat.title}
                        </h3>
                        <p className="text-white/70 text-sm mb-3">
                          {cat.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-white/60 text-xs font-medium">
                            {cat.count}
                          </span>
                          <div className="flex items-center gap-1.5 text-white text-sm font-semibold group-hover:gap-3 transition-all">
                            Explore
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Escrow Flow ─────────────────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="success" className="mb-4 text-sm px-4 py-1.5">
              <Lock className="h-3.5 w-3.5" />
              Smart Escrow System
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Your Money is Always Safe
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              EKDA holds 100% payment in escrow. Vendors receive payment in two
              verified stages — ensuring you get exactly what you paid for.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                step: "01",
                icon: CreditCard,
                title: "Customer Pays 100%",
                description:
                  "Full payment held securely in EKDA escrow via Paystack, Stripe, or Monnify.",
                color: "text-ekda-green-600",
                bg: "bg-ekda-green-50 dark:bg-ekda-green-900/20",
              },
              {
                step: "02",
                icon: Truck,
                title: "50% Released at Pickup",
                description:
                  "When carrier confirms pickup from vendor, EKDA releases 50% to vendor minus 10% commission.",
                color: "text-ekda-gold-600",
                bg: "bg-ekda-gold-50 dark:bg-ekda-gold-900/20",
              },
              {
                step: "03",
                icon: CheckCircle2,
                title: "50% Released at Destination",
                description:
                  "Remaining 50% released when carrier confirms arrival at port or final destination.",
                color: "text-blue-600",
                bg: "bg-blue-50 dark:bg-blue-900/20",
              },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <Card className="text-center p-6 h-full">
                  <CardContent className="p-0">
                    <div className="relative inline-block mb-6">
                      <div
                        className={`h-16 w-16 rounded-2xl ${step.bg} flex items-center justify-center mx-auto`}
                      >
                        <step.icon className={`h-7 w-7 ${step.color}`} />
                      </div>
                      <span className="absolute -top-2 -right-2 text-xs font-bold bg-ekda-dark text-white rounded-full h-5 w-5 flex items-center justify-center">
                        {step.step}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <div className="inline-flex items-center gap-2 bg-ekda-green-50 dark:bg-ekda-green-900/20 text-ekda-green-700 dark:text-ekda-green-400 rounded-full px-5 py-2 text-sm font-medium">
              <Shield className="h-4 w-4" />
              EKDA deducts only 10% commission — transparent and fair
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ───────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4 text-sm px-4 py-1.5">Platform Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for Cross-Border Commerce
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade technology making African trade simple, safe, and
              compliant for everyone.
            </p>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map((feature) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <Card className="p-6 h-full card-hover" gradient>
                  <CardContent className="p-0">
                    <div
                      className={`h-12 w-12 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-5`}
                    >
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── Smart Recommendations ─────────────────────────────── */}
      <SmartRecommendations />

      {/* ─── Price Intelligence ──────────────────────────────────── */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <PriceIntelligence />
        </div>
      </section>

      {/* ─── Role Onboarding CTA ─────────────────────────────── */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Join EKDA as...
            </h2>
            <p className="text-lg text-muted-foreground">
              One platform, multiple roles. Start your journey today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: "🛍️",
                title: "Customer",
                description:
                  "Shop authentic African goods or import international products with full escrow protection.",
                href: "/auth/register?role=customer",
                cta: "Shop Now",
              },
              {
                icon: "🏪",
                title: "Vendor",
                description:
                  "Sell your African products globally or offer international imports to Nigerian buyers.",
                href: "/auth/register?role=vendor",
                cta: "Start Selling",
              },
              {
                icon: "🏢",
                title: "Enterprise",
                description:
                  "Bulk buying, container orders, and dedicated account management for businesses.",
                href: "/auth/register?role=enterprise",
                cta: "Get Enterprise",
              },
              {
                icon: "🚢",
                title: "Carrier",
                description:
                  "Offer logistics services, bid on shipments, and grow your freight business on EKDA.",
                href: "/auth/register?role=carrier",
                cta: "Become a Carrier",
              },
            ].map((role, i) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={role.href}>
                  <Card className="p-6 h-full text-center card-hover border-2 hover:border-primary/30">
                    <CardContent className="p-0">
                      <div className="text-4xl mb-4">{role.icon}</div>
                      <h3 className="font-semibold text-lg mb-2">{role.title}</h3>
                      <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                        {role.description}
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        {role.cta}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="gold" className="mb-4 text-sm px-4 py-1.5">
              <Star className="h-3.5 w-3.5" />
              Trusted by Thousands
            </Badge>
            <h2 className="text-4xl font-bold mb-4">What Our Users Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {TESTIMONIALS.map((testimonial, i) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <CardContent className="p-0">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: testimonial.rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="h-4 w-4 fill-ekda-gold-400 text-ekda-gold-400"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-ekda-green-500 to-ekda-green-700 flex items-center justify-center text-white text-sm font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="font-semibold text-sm">
                          {testimonial.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ───────────────────────────────────────── */}
      <section className="py-32 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-20 w-64 h-64 bg-ekda-green-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-20 w-80 h-80 bg-ekda-gold-500/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Trade <br />
              <span className="gradient-text">Across Borders?</span>
            </h2>
            <p className="text-xl text-white/70 mb-10 max-w-xl mx-auto">
              Join 50,000+ vendors, customers, and carriers who trust EKDA for
              seamless cross-border commerce.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="xl" variant="gold">
                  Create Free Account
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  size="xl"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
