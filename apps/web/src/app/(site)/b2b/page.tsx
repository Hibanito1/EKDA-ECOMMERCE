"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  FileText,
  Users,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Package,
  Globe,
  Handshake,
  BarChart3,
  Shield,
  Zap,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@ekda/shared";
import toast from "react-hot-toast";

const B2B_TIERS = [
  {
    id: "smb",
    name: "SME",
    icon: "🏢",
    description: "Small & medium businesses",
    min_order: 500000,
    commission: 8,
    features: ["Custom pricing tiers", "Dedicated buyer portal", "API access (100 calls/day)", "Net 30 payment terms"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: "🏗️",
    description: "Large corporations & bulk buyers",
    min_order: 5000000,
    commission: 6,
    features: [
      "Negotiated contract rates",
      "Full-container load (FCL) support",
      "Unlimited API access + webhooks",
      "Net 60 payment terms",
      "Dedicated EKDA relationship manager",
      "Custom SLA and priority shipping",
      "Quarterly business reviews",
    ],
  },
  {
    id: "government",
    name: "Government & NGO",
    icon: "🏛️",
    description: "Public sector & aid organizations",
    min_order: 1000000,
    commission: 5,
    features: [
      "Procurement-compliant invoicing",
      "Tender and RFQ support",
      "UN/NGO vendor compliance",
      "Special commodity pricing",
      "Multi-level approval workflows",
    ],
  },
];

interface RFQForm {
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  product_type: string;
  quantity: string;
  destination: string;
  timeline: string;
  notes: string;
}

export default function B2BPage() {
  const [form, setForm] = useState<RFQForm>({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    product_type: "",
    quantity: "",
    destination: "",
    timeline: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const updateForm = (key: keyof RFQForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
    toast.success("🎉 RFQ submitted! Our B2B team will respond within 4 hours.");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-ekda-dark to-ekda-navy text-white py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Badge className="mb-6 text-sm px-4 py-1.5 bg-white/10 text-white border-white/20">
            <Building2 className="h-3.5 w-3.5 mr-1.5" />
            B2B & Enterprise Portal
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Scale Your African Trade.{" "}
            <span className="text-ekda-gold-400">At Enterprise Rates.</span>
          </h1>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Dedicated B2B platform with custom pricing, contract management, RFQ workflows,
            API access, and full-container load (FCL) support for high-volume buyers and sellers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" variant="gold">
              Submit RFQ
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Tiers */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">B2B Account Tiers</h2>
          <p className="text-muted-foreground">Volume-based pricing and dedicated services for every scale</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {B2B_TIERS.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="text-3xl mb-3">{tier.icon}</div>
                  <div className="font-bold text-xl mb-1">{tier.name}</div>
                  <p className="text-sm text-muted-foreground mb-3">{tier.description}</p>
                  <div className="flex gap-4 mb-4">
                    <div>
                      <div className="text-xs text-muted-foreground">Min. Order</div>
                      <div className="font-bold">{formatCurrency(tier.min_order, "NGN")}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Commission</div>
                      <div className="font-bold text-ekda-green-600">{tier.commission}%</div>
                    </div>
                  </div>
                  <div className="space-y-1.5 mb-6 flex-1">
                    {tier.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Apply for {tier.name}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { icon: FileText, title: "RFQ System", desc: "Submit and manage quote requests" },
            { icon: Handshake, title: "Contract Module", desc: "Long-term supplier agreements" },
            { icon: Zap, title: "API Access", desc: "Integrate with your ERP/WMS" },
            { icon: BarChart3, title: "Market Intelligence", desc: "Real-time price & demand data" },
            { icon: Globe, title: "Multi-Country Sourcing", desc: "20+ African country suppliers" },
            { icon: Shield, title: "Trade Finance", desc: "Letter of Credit, SBLC support" },
            { icon: Users, title: "Multi-User Accounts", desc: "Team roles and approvals" },
            { icon: Package, title: "Container Loads", desc: "20ft, 40ft, LCL/FCL support" },
          ].map((feat) => (
            <div key={feat.title} className="p-4 bg-muted/30 rounded-2xl text-center">
              <feat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
              <div className="font-semibold text-sm mb-1">{feat.title}</div>
              <div className="text-xs text-muted-foreground">{feat.desc}</div>
            </div>
          ))}
        </div>

        {/* RFQ Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Submit Request for Quote (RFQ)
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Our B2B team will respond with custom pricing within 4 business hours.
            </p>
          </CardHeader>
          <CardContent>
            {submitted ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">RFQ Submitted!</h3>
                <p className="text-muted-foreground mb-6">
                  Our B2B team will contact you at {form.email} within 4 business hours with a custom quote.
                </p>
                <Button onClick={() => setSubmitted(false)} variant="outline">Submit Another RFQ</Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Company Name" value={form.company_name} onChange={(e) => updateForm("company_name", e.target.value)} required />
                <Input label="Contact Name" value={form.contact_name} onChange={(e) => updateForm("contact_name", e.target.value)} required />
                <Input type="email" label="Business Email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} required />
                <Input type="tel" label="Phone / WhatsApp" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} required />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Product Type <span className="text-destructive">*</span></label>
                  <select value={form.product_type} onChange={(e) => updateForm("product_type", e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" required>
                    <option value="">Select category</option>
                    <option value="groceries">African Groceries</option>
                    <option value="dried_produce">Dried Produce</option>
                    <option value="agri_commodities">Agri Commodities (Cocoa, Cashew, etc.)</option>
                    <option value="frozen_produce">Frozen Produce</option>
                    <option value="vehicles">Vehicles</option>
                    <option value="electronics">Electronics</option>
                    <option value="machinery">Machinery & Equipment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Input label="Estimated Quantity / Volume" placeholder="e.g. 5 tons / 2x 40ft containers" value={form.quantity} onChange={(e) => updateForm("quantity", e.target.value)} required />
                <Input label="Destination Country/Port" placeholder="e.g. UK / Apapa Port Lagos" value={form.destination} onChange={(e) => updateForm("destination", e.target.value)} required />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Required Timeline</label>
                  <select value={form.timeline} onChange={(e) => updateForm("timeline", e.target.value)}
                    className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="">Select timeline</option>
                    <option value="urgent">Urgent (within 1 week)</option>
                    <option value="2weeks">2 weeks</option>
                    <option value="month">1 month</option>
                    <option value="quarter">This quarter</option>
                    <option value="ongoing">Ongoing / Recurring</option>
                  </select>
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium">Additional Notes</label>
                  <textarea value={form.notes} onChange={(e) => updateForm("notes", e.target.value)}
                    className="w-full h-24 px-3 py-2.5 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Specific requirements, certifications needed, payment terms preference..." />
                </div>
                <div className="md:col-span-2">
                  <Button type="submit" variant="premium" size="lg" className="w-full" loading={loading}>
                    Submit RFQ — Get Custom Quote
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
