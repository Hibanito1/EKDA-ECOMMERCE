"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Play,
  Clock,
  Users,
  Star,
  ChevronRight,
  Award,
  Globe,
  FileText,
  Video,
  Mic,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const LEARNING_PATHS = [
  {
    id: "export_starter",
    title: "Export Starter Guide",
    description: "Complete guide to selling African products internationally — from sourcing to shipping",
    icon: "🌿",
    level: "Beginner",
    duration: "45 min",
    lessons: 8,
    enrolled: 2847,
    rating: 4.9,
    badge: "Most Popular",
    modules: [
      "Understanding the Export Process",
      "Product Preparation & Packaging",
      "HS Code Classification",
      "Required Documentation",
      "Choosing the Right Carrier",
      "Nigerian Export Laws & NAFDAC",
      "Pricing for International Markets",
      "Getting Your First Order",
    ],
  },
  {
    id: "import_nigeria",
    title: "How to Import to Nigeria",
    description: "Step-by-step import guide: vehicles, electronics, machinery — customs, duties, clearing",
    icon: "🚗",
    level: "Intermediate",
    duration: "60 min",
    lessons: 10,
    enrolled: 1932,
    rating: 4.8,
    badge: null,
    modules: [
      "Nigeria Customs & NAFDAC Overview",
      "Calculating Import Duties",
      "HS Codes for Import",
      "Bill of Lading Explained",
      "Working with Clearing Agents",
      "Port Procedures (Apapa, Tin Can)",
      "Vehicle Import Process",
      "Electronics Import Requirements",
      "Avoiding Common Mistakes",
      "Dispute Resolution",
    ],
  },
  {
    id: "hs_code_mastery",
    title: "HS Code Mastery",
    description: "Master Harmonized System codes for accurate customs declaration and duty optimization",
    icon: "📋",
    level: "Advanced",
    duration: "30 min",
    lessons: 6,
    enrolled: 1245,
    rating: 4.7,
    badge: "AI-Enhanced",
    modules: [
      "What is a Harmonized System Code?",
      "HS Code Structure Explained",
      "Using EKDA AI Classifier",
      "Common Misclassifications",
      "Duty Rate Optimization",
      "Bulk Document Classification",
    ],
  },
  {
    id: "diaspora_business",
    title: "Diaspora Business Toolkit",
    description: "Build a thriving African goods business from the UK, USA, Canada, or Europe",
    icon: "🌍",
    level: "Beginner",
    duration: "50 min",
    lessons: 9,
    enrolled: 3241,
    rating: 4.9,
    badge: "New",
    modules: [
      "Market Research for Diaspora",
      "Setting Up Your Online Store",
      "Multi-Currency Pricing",
      "Serving the African Community",
      "Marketing to Nigerian Diaspora",
      "Building Trust with Customers",
      "UK/US Tax Considerations",
      "Scaling Your Business",
      "Success Story: From Zero to ₦1M",
    ],
  },
];

const UPCOMING_WEBINARS = [
  {
    title: "Live Export Q&A with NAFDAC Officer",
    date: "Wed, Jun 11 · 2:00 PM WAT",
    host: "EKDA Academy + NAFDAC",
    attendees: 843,
  },
  {
    title: "How to Import Vehicles to Nigeria (2025 Update)",
    date: "Fri, Jun 13 · 4:00 PM WAT",
    host: "Customs Expert Panel",
    attendees: 1245,
  },
  {
    title: "Scaling Your African Food Business in the UK",
    date: "Sat, Jun 14 · 11:00 AM BST",
    host: "Diaspora Entrepreneurs Forum",
    attendees: 567,
  },
];

const QUICK_GUIDES = [
  { icon: "📄", title: "HS Code Quick Reference", type: "PDF", downloads: "12K+" },
  { icon: "🗺️", title: "Nigerian Import Duty Table 2025", type: "PDF", downloads: "8.4K+" },
  { icon: "✅", title: "Export Documentation Checklist", type: "PDF", downloads: "15K+" },
  { icon: "🧮", title: "Landed Cost Worksheet", type: "Excel", downloads: "6.2K+" },
  { icon: "⚓", title: "Nigerian Port Procedures Guide", type: "PDF", downloads: "9.8K+" },
  { icon: "📱", title: "Diaspora Seller Playbook", type: "PDF", downloads: "18K+" },
];

export default function LearningCenterPage() {
  const [activeCategory, setActiveCategory] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-ekda-dark via-ekda-navy to-ekda-green-900 text-white py-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 text-sm px-4 py-1.5">
            <BookOpen className="h-3.5 w-3.5 mr-1.5" />
            EKDA Learning Center
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            Master African Trade.{" "}
            <span className="text-ekda-gold-400">Free.</span>
          </h1>
          <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
            Video courses, live webinars, and expert guides to help you export, import, and build
            a thriving cross-border business — from beginner to expert.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60">
            {[
              { icon: BookOpen, label: "24 Courses" },
              { icon: Video, label: "120+ Videos" },
              { icon: Users, label: "28,000 Students" },
              { icon: Award, label: "Free Certificate" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-1.5">
                <stat.icon className="h-4 w-4 text-ekda-gold-400" />
                {stat.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Learning Paths */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-2">Learning Paths</h2>
          <p className="text-muted-foreground mb-8">Structured courses with certificates on completion</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LEARNING_PATHS.map((path, i) => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full overflow-hidden group cursor-pointer hover:shadow-xl transition-shadow">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{path.icon}</div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-base group-hover:text-primary transition-colors">
                              {path.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge
                              variant={path.level === "Beginner" ? "success" : path.level === "Advanced" ? "error" : "blue"}
                              className="text-[10px] px-1.5 py-0"
                            >
                              {path.level}
                            </Badge>
                            {path.badge && (
                              <Badge variant="gold" className="text-[10px] px-1.5 py-0">
                                {path.badge}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 flex-1">{path.description}</p>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{path.duration}</span>
                      <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{path.lessons} lessons</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{path.enrolled.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-ekda-gold-400 text-ekda-gold-400" />{path.rating}</span>
                    </div>

                    <Button variant="premium" size="sm" className="w-full">
                      <Play className="h-3.5 w-3.5" />
                      Start Learning Free
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Upcoming Webinars */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-2">Live Webinars & AMA Sessions</h2>
          <p className="text-muted-foreground mb-6">Join live sessions with industry experts and successful traders</p>
          <div className="space-y-3">
            {UPCOMING_WEBINARS.map((webinar) => (
              <Card key={webinar.title}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center flex-shrink-0">
                    <Video className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">{webinar.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {webinar.date} · {webinar.host}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-xs text-muted-foreground hidden sm:block">
                      <Users className="h-3.5 w-3.5 inline mr-1" />
                      {webinar.attendees.toLocaleString()} registered
                    </div>
                    <Button size="sm" variant="outline">
                      Register Free
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Downloads */}
        <div>
          <h2 className="text-2xl font-bold mb-2">Quick Reference Downloads</h2>
          <p className="text-muted-foreground mb-6">Free templates, checklists, and reference guides</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {QUICK_GUIDES.map((guide) => (
              <button key={guide.title} className="flex flex-col items-center p-4 rounded-2xl bg-muted/40 hover:bg-muted/70 border border-border hover:border-primary/30 transition-all text-center group">
                <span className="text-3xl mb-2">{guide.icon}</span>
                <div className="text-xs font-medium leading-snug mb-1 group-hover:text-primary transition-colors">
                  {guide.title}
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0">{guide.type}</Badge>
                </div>
                <div className="text-[9px] text-muted-foreground mt-1">{guide.downloads} downloads</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
