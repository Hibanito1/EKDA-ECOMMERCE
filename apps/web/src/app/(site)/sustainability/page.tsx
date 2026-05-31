"use client";

import { motion } from "framer-motion";
import { Leaf, TreePine, Heart, Globe, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const IMPACT_STATS = [
  { icon: "🌳", value: "42,800", label: "Trees Planted", desc: "Via carbon offset program" },
  { icon: "👩‍🌾", value: "3,241", label: "Farmers Supported", desc: "Direct farm-to-buyer connections" },
  { icon: "💚", value: "₦284M", label: "Paid to Smallholders", desc: "Fair price guarantee" },
  { icon: "🌍", value: "18.2t", label: "CO₂ Offset", desc: "Across all EKDA shipments" },
  { icon: "📦", value: "12,400", label: "Orders Fulfilled", desc: "Via sustainable carriers" },
  { icon: "🔋", value: "94%", label: "Green Shipping Rate", desc: "Sea freight preferred" },
];

const FARM_DIRECT_PRODUCTS = [
  { name: "Cocoa Beans (Grade A)", farmer: "Adamu Mohammed, Plateau State", margin: "+32%", emoji: "🍫" },
  { name: "Sesame Seeds", farmer: "Cooperative: Kano Farms Assoc.", margin: "+28%", emoji: "🌾" },
  { name: "Ginger Root Dried", farmer: "Mrs. Grace Eze, Nassarawa", margin: "+35%", emoji: "🫚" },
  { name: "Shea Butter Raw", farmer: "Northern Harvest Collective", margin: "+41%", emoji: "🧈" },
];

export default function SustainabilityPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-ekda-green-900 via-green-800 to-teal-900 text-white py-20">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <Badge className="mb-6 bg-white/10 text-white border-white/20 text-sm px-4 py-1.5">
            <Leaf className="h-3.5 w-3.5 mr-1.5" />
            EKDA Impact & Sustainability
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            Trade That{" "}
            <span className="text-ekda-gold-400">Heals the Planet</span>
            {" "}& Empowers Farmers
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Every EKDA order supports smallholder African farmers with fair prices,
            plants trees through our carbon offset program, and prioritizes green shipping routes.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Impact Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {IMPACT_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Card className="text-center p-4">
                <CardContent className="p-0">
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-xl font-bold text-ekda-green-600">{stat.value}</div>
                  <div className="text-xs font-semibold">{stat.label}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">{stat.desc}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Farm Direct Section */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-10 w-10 rounded-2xl bg-ekda-green-100 dark:bg-ekda-green-900/30 flex items-center justify-center">
              <Heart className="h-5 w-5 text-ekda-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Buy Direct from Farmers</h2>
              <p className="text-muted-foreground text-sm">
                Skip the middleman. Farmers earn 30-40% more. You pay fair prices.
              </p>
            </div>
            <Badge variant="success" className="ml-auto">🌾 Farm-to-Table</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FARM_DIRECT_PRODUCTS.map((product) => (
              <Card key={product.name} className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="text-3xl mb-3">{product.emoji}</div>
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">by {product.farmer}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="success" className="text-[10px]">
                      {product.margin} to farmer
                    </Badge>
                    <Button size="sm" variant="outline" className="h-7 text-xs px-2">
                      Buy Direct
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Green Shipping */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
              <Globe className="h-5 w-5 text-teal-600" />
              Green Shipping Options
            </h2>
            <p className="text-muted-foreground mb-6">
              EKDA highlights low-emission carriers and incentivizes sea freight over air freight.
              Every sea shipment produces ~98% less CO₂ than the equivalent air freight.
            </p>
            <div className="space-y-3">
              {[
                { label: "🚢 Sea Freight (Preferred)", pct: 94, color: "bg-ekda-green-500", desc: "Lowest emissions per tonne-km" },
                { label: "🚛 Road Freight", pct: 4, color: "bg-yellow-500", desc: "Intra-Africa routes" },
                { label: "✈️ Air Freight", pct: 2, color: "bg-red-400", desc: "Reserved for urgent, lightweight items" },
              ].map((mode) => (
                <div key={mode.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{mode.label}</span>
                    <span className="font-semibold">{mode.pct}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full ${mode.color} rounded-full`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${mode.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{mode.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-ekda-green-900 to-ekda-dark text-white rounded-3xl p-8">
            <TreePine className="h-10 w-10 text-ekda-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-2">Carbon Offset Program</h3>
            <p className="text-white/70 text-sm mb-6">
              Add carbon offset to any shipment for as little as ₦2,000.
              We partner with verified reforestation projects across West Africa.
            </p>
            <div className="space-y-2 mb-6">
              {[
                "10 trees planted per offsetted shipment",
                "Certificates emailed instantly",
                "Partner: Green Africa Initiative",
                "Tracked on EKDA Impact Dashboard",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-white/70">
                  <Leaf className="h-3.5 w-3.5 text-ekda-green-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
            <Button className="bg-white text-ekda-dark hover:bg-white/90">
              Add Carbon Offset
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
