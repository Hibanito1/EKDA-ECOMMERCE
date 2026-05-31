"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ChevronDown, ChevronUp, BookOpen, MessageCircle,
  FileText, Phone, Mail, ExternalLink, CheckCircle2,
  HelpCircle, Truck, Shield, CreditCard, Package, Bot, Zap
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const FAQ_CATEGORIES = [
  {
    id: "getting_started",
    label: "Getting Started",
    icon: BookOpen,
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-900/20",
    questions: [
      { q: "How do I create an EKDA account?", a: "Click 'Get Started' on the homepage and choose your role (Customer, Vendor, Enterprise, or Carrier). Fill in your details and verify your email. For vendors and carriers, you'll also need to complete KYC verification before trading." },
      { q: "What is KYC verification and why do I need it?", a: "KYC (Know Your Customer) is our identity verification process. Vendors and Carriers must complete it before listing products or accepting shipment jobs. It typically takes 24 hours after you submit your documents." },
      { q: "What currencies does EKDA support?", a: "EKDA supports NGN, USD, GBP, EUR, CAD, and AUD. Paystack is used for Nigerian Naira payments, Stripe for international cards, and Monnify for additional Nigerian payment methods." },
      { q: "Is EKDA available outside Nigeria?", a: "Yes! Customers can shop from anywhere in the world. We serve the Nigerian diaspora in the UK, USA, Canada, Germany, and beyond. Vendors can be based internationally too — we have vendors from China, Germany, USA, and more." },
    ],
  },
  {
    id: "escrow",
    label: "Escrow & Payments",
    icon: Shield,
    color: "text-green-600",
    bg: "bg-green-50 dark:bg-green-900/20",
    questions: [
      { q: "How does the EKDA escrow system work?", a: "When you place an order, 100% of your payment is held in EKDA's secure escrow. The vendor receives 50% when the carrier confirms pickup of goods, and the remaining 50% when the carrier confirms arrival at your destination port or address. This ensures both buyers and vendors are protected." },
      { q: "What is EKDA's commission rate?", a: "EKDA charges 10% of the transaction value (excluding shipping). This is automatically deducted from the vendor's payment before release. Vendors on Premium plans can reduce this to 7-8.5%." },
      { q: "When will I receive my payout as a vendor?", a: "50% is released when your carrier confirms pickup. The remaining 50% is released when goods arrive at the destination. Payouts are processed via Paystack, Stripe, or SWIFT depending on your bank location, typically within 24 hours of the escrow release trigger." },
      { q: "What happens if there's a payment dispute?", a: "Open a dispute through your Order page. Both parties have 72 hours to respond. EKDA's team will review evidence and make a decision. During a dispute, escrow funds are frozen until resolution." },
    ],
  },
  {
    id: "shipping",
    label: "Shipping & Logistics",
    icon: Truck,
    color: "text-purple-600",
    bg: "bg-purple-50 dark:bg-purple-900/20",
    questions: [
      { q: "How do I choose between air and sea freight?", a: "Our AI automatically recommends the best option. Sea freight is recommended for heavy goods, bulk orders, frozen products, and vehicles (which cannot be air freighted). Air freight is best for lightweight, urgent, high-value items. Sea freight is 95%+ cheaper per kg but takes 25-35 days vs 4-7 days for air." },
      { q: "Which Nigerian ports does EKDA support?", a: "We support all major Nigerian ports: Apapa Port (Lagos), Tin Can Island Port (Lagos), Onne Port (Port Harcourt), Calabar Port, and Warri Port. For air freight, we support LOS (Lagos), ABV (Abuja), PHC (Port Harcourt), and KAN (Kano)." },
      { q: "How are HS Codes assigned?", a: "EKDA uses AI to automatically assign Harmonized System (HS) codes to all products. Our AI achieves 97%+ accuracy. Vendors can review and edit the AI suggestion. Correct HS codes ensure proper customs duties and avoid clearance delays." },
      { q: "What documents do I need for export?", a: "Standard export requires: Commercial Invoice, Packing List, Certificate of Origin. For agricultural products: Phytosanitary Certificate. For vehicles: Title/Registration documents. EKDA's document verification AI helps check authenticity of all submitted documents." },
    ],
  },
  {
    id: "vendors",
    label: "For Vendors",
    icon: Package,
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-900/20",
    questions: [
      { q: "How do I list products on EKDA?", a: "After KYC approval, go to Dashboard → Products → Add Product. Fill in the product details and our AI will automatically suggest an HS code. You can review and edit it. Products are live within minutes of submission." },
      { q: "What are the vendor tier benefits?", a: "Standard vendors pay 10% commission. EKDA Premium plans offer: Starter (₦15K/mo, 8.5%), Growth (₦35K/mo, 7.5%), Enterprise (₦85K/mo, 7%). Premium plans also include boosted listings, analytics, and priority support." },
      { q: "How does the AI Demand Forecasting work?", a: "For Premium vendors, EKDA's AI analyzes historical sales, diaspora population data, seasonal patterns (Ramadan, Christmas, harvest), and commodity price trends to predict demand 30 days ahead. It recommends when to restock and how much." },
    ],
  },
];

const SUPPORT_TICKETS = [] as const;

interface TicketForm {
  subject: string;
  category: string;
  priority: string;
  description: string;
  order_id: string;
}

export function HelpCenter() {
  const [search, setSearch] = useState("");
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"faq" | "contact" | "ticket">("faq");
  const [ticketForm, setTicketForm] = useState<TicketForm>({
    subject: "", category: "shipping", priority: "medium", description: "", order_id: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const allQuestions = FAQ_CATEGORIES.flatMap((cat) =>
    cat.questions.map((q) => ({ ...q, category: cat.label }))
  );

  const filtered = search
    ? allQuestions.filter(
        (q) =>
          q.q.toLowerCase().includes(search.toLowerCase()) ||
          q.a.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    toast.success("🎉 Support ticket submitted! We'll respond within 4 hours.");
    setTicketForm({ subject: "", category: "shipping", priority: "medium", description: "", order_id: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-ekda-dark to-ekda-navy text-white py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-3">Help & Support Center</h1>
          <p className="text-white/70 text-lg mb-8">
            Find answers fast or reach our support team directly
          </p>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
            <input
              type="text"
              placeholder="Search for help... e.g. 'escrow', 'HS code', 'port'"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 text-base"
            />
          </div>

          {/* Search Results */}
          <AnimatePresence>
            {search && filtered.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 bg-background rounded-2xl border border-border overflow-hidden shadow-2xl text-left"
              >
                {filtered.slice(0, 5).map((item) => (
                  <div key={item.q} className="p-4 border-b border-border last:border-0 hover:bg-muted/50 cursor-pointer" onClick={() => { setSearch(""); setActiveTab("faq"); }}>
                    <div className="text-sm font-medium text-foreground mb-0.5">{item.q}</div>
                    <div className="text-xs text-muted-foreground line-clamp-2">{item.a}</div>
                    <Badge variant="outline" className="text-[10px] mt-1">{item.category}</Badge>
                  </div>
                ))}
              </motion.div>
            )}
            {search && filtered.length === 0 && (
              <div className="mt-3 bg-background rounded-2xl border border-border p-4 text-sm text-muted-foreground">
                No results for &quot;{search}&quot; — <button onClick={() => { setActiveTab("ticket"); setSearch(""); }} className="text-primary hover:underline">Submit a support ticket</button>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Quick contact options */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: Bot, label: "AI Assistant", sub: "Instant answers", action: () => {}, color: "text-indigo-600" },
            { icon: MessageCircle, label: "Live Chat", sub: "Mon–Fri 8am–8pm WAT", action: () => {}, color: "text-blue-600" },
            { icon: Mail, label: "Email Support", sub: "support@ekda.io", action: () => {}, color: "text-green-600" },
            { icon: Phone, label: "Call Us", sub: "+234 800 EKDA HELP", action: () => {}, color: "text-purple-600" },
          ].map((contact) => (
            <button key={contact.label} onClick={contact.action}
              className="p-4 rounded-2xl border border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all text-center group">
              <contact.icon className={cn("h-6 w-6 mx-auto mb-2 transition-colors group-hover:text-primary", contact.color)} />
              <div className="text-sm font-semibold">{contact.label}</div>
              <div className="text-[10px] text-muted-foreground">{contact.sub}</div>
            </button>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-2xl w-fit mb-8">
          {(["faq", "contact", "ticket"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={cn("px-5 py-2 rounded-xl text-sm font-medium transition-all capitalize",
                activeTab === tab ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}>
              {tab === "faq" ? "📚 Knowledge Base" : tab === "contact" ? "💬 Contact Us" : "🎫 Open Ticket"}
            </button>
          ))}
        </div>

        {/* FAQ Tab */}
        {activeTab === "faq" && (
          <div className="space-y-8">
            {FAQ_CATEGORIES.map((category) => (
              <div key={category.id}>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center", category.bg)}>
                    <category.icon className={cn("h-4 w-4", category.color)} />
                  </div>
                  <h2 className="font-semibold text-lg">{category.label}</h2>
                </div>
                <div className="space-y-2">
                  {category.questions.map((item) => {
                    const key = `${category.id}-${item.q}`;
                    const isExpanded = expandedQuestion === key;
                    return (
                      <Card key={key} className={cn("overflow-hidden transition-all", isExpanded && "shadow-md")}>
                        <button
                          onClick={() => setExpandedQuestion(isExpanded ? null : key)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
                        >
                          <span className="font-medium text-sm pr-4">{item.q}</span>
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">
                                {item.a}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === "contact" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Mail, title: "Email Support", detail: "support@ekda.io", sub: "We reply within 4 hours on business days", cta: "Send Email", link: "mailto:support@ekda.io" },
              { icon: MessageCircle, title: "WhatsApp Business", detail: "+234 800 EKDA HELP", sub: "Monday–Friday, 8am–8pm WAT", cta: "Message Us", link: "https://wa.me/2348003352435" },
              { icon: HelpCircle, title: "Community Forum", detail: "community.ekda.io", sub: "Get help from other traders and vendors", cta: "Visit Forum", link: "#" },
              { icon: FileText, title: "Documentation", detail: "docs.ekda.io", sub: "Technical guides and API documentation", cta: "Read Docs", link: "#" },
            ].map((contact) => (
              <Card key={contact.title}>
                <CardContent className="p-5">
                  <contact.icon className="h-6 w-6 text-primary mb-3" />
                  <h3 className="font-semibold mb-1">{contact.title}</h3>
                  <div className="font-medium text-sm text-primary mb-1">{contact.detail}</div>
                  <p className="text-xs text-muted-foreground mb-4">{contact.sub}</p>
                  <Button variant="outline" size="sm" asChild>
                    <a href={contact.link} target="_blank" rel="noopener noreferrer">
                      {contact.cta}
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Ticket Tab */}
        {activeTab === "ticket" && (
          <form onSubmit={handleSubmitTicket} className="space-y-4 max-w-2xl">
            <Input label="Subject" placeholder="Brief description of your issue" value={ticketForm.subject} onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })} required />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category <span className="text-destructive">*</span></label>
                <select value={ticketForm.category} onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="shipping">Shipping & Logistics</option>
                  <option value="escrow">Escrow & Payments</option>
                  <option value="kyc">KYC Verification</option>
                  <option value="dispute">Dispute</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Priority</label>
                <select value={ticketForm.priority} onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                  className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High — Affects my order</option>
                  <option value="critical">Critical — Financial impact</option>
                </select>
              </div>
            </div>
            <Input label="Order ID (if applicable)" placeholder="EKDA-XXXXXX" value={ticketForm.order_id} onChange={(e) => setTicketForm({ ...ticketForm, order_id: e.target.value })} />
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Describe your issue <span className="text-destructive">*</span></label>
              <textarea value={ticketForm.description} onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                className="w-full h-32 px-3 py-2.5 rounded-xl border border-input bg-background text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Please provide as much detail as possible — what happened, what you expected, and any error messages you saw."
                required />
            </div>
            <Button type="submit" variant="premium" size="lg" className="w-full" loading={submitting}>
              <MessageCircle className="h-4 w-4" />
              Submit Support Ticket
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Expected response time: Premium users &lt;2h · Standard users &lt;8h on business days
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
