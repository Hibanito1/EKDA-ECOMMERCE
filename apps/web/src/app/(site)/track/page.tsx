"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Ship,
  Plane,
  AlertCircle,
  ArrowRight,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@ekda/shared";
import { cn } from "@/lib/utils";

const MOCK_ORDER = {
  id: "EKDA-MK3X2F",
  status: "in_transit",
  escrow_status: "partial_released",
  total: 196500,
  currency: "NGN",
  cargo_type: "sea",
  carrier: "Maersk Line",
  vessel: "Maersk Enfield",
  origin: "Apapa Port, Lagos, Nigeria",
  destination: "Tilbury Port, London, UK",
  estimated_delivery: "2025-07-12",
  created_at: "2025-06-01",
  items: [
    { name: "Premium Dried Crayfish", qty: "10 kg", price: 85000 },
    { name: "Efirin Dried Basil", qty: "3 × 100g", price: 7500 },
  ],
  milestones: [
    {
      status: "payment_confirmed",
      title: "Payment Confirmed",
      description: "₦196,500 secured in EKDA escrow",
      timestamp: "2025-06-01T14:30:00Z",
      completed: true,
      icon: Shield,
    },
    {
      status: "processing",
      title: "Order Processing",
      description: "Vendor preparing your order",
      timestamp: "2025-06-02T09:00:00Z",
      completed: true,
      icon: Package,
    },
    {
      status: "carrier_assigned",
      title: "Carrier Assigned",
      description: "Maersk Line assigned as your carrier",
      timestamp: "2025-06-03T10:00:00Z",
      completed: true,
      icon: Truck,
    },
    {
      status: "picked_up",
      title: "Cargo Picked Up",
      description: "Carrier confirmed pickup. 50% released to vendor from escrow.",
      timestamp: "2025-06-04T16:00:00Z",
      completed: true,
      icon: CheckCircle2,
      escrowEvent: "50% Released (₦90,000)",
    },
    {
      status: "in_transit",
      title: "In Transit — Sea Freight",
      description: "Vessel: Maersk Enfield. Currently in the Atlantic Ocean",
      timestamp: "2025-06-05T08:00:00Z",
      completed: true,
      icon: Ship,
      isActive: true,
    },
    {
      status: "arrived_at_port",
      title: "Arrived at Destination Port",
      description: "Expected at Tilbury Port, London",
      timestamp: null,
      completed: false,
      icon: MapPin,
      escrowEvent: "50% Released (₦90,000)",
    },
    {
      status: "customs_clearance",
      title: "Customs Clearance",
      description: "UK HMRC customs processing",
      timestamp: null,
      completed: false,
      icon: Clock,
    },
    {
      status: "delivered",
      title: "Delivered",
      description: "Your order will be delivered to your address",
      timestamp: null,
      completed: false,
      icon: CheckCircle2,
    },
  ],
};

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState("");
  const [showOrder, setShowOrder] = useState(true); // Show mock order by default

  const completedCount = MOCK_ORDER.milestones.filter((m) => m.completed).length;
  const progress = (completedCount / MOCK_ORDER.milestones.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-ekda-dark to-ekda-navy text-white py-16">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h1 className="text-4xl font-bold mb-3">Track Your Shipment</h1>
          <p className="text-white/70 mb-8">
            Real-time updates on your order status, carrier milestones, and escrow releases
          </p>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. EKDA-MK3X2F)"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 text-base"
              />
            </div>
            <Button
              size="lg"
              className="h-14 px-6 rounded-2xl"
              onClick={() => setShowOrder(true)}
            >
              Track
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {showOrder && (
        <div className="container mx-auto px-4 py-10 max-w-4xl">
          {/* Order Summary */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-primary font-bold text-lg">
                      {MOCK_ORDER.id}
                    </span>
                    <Badge variant="blue">In Transit</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Placed {formatDate(MOCK_ORDER.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-lg">{formatCurrency(MOCK_ORDER.total, "NGN")}</div>
                    <div className="text-muted-foreground">Order Total</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg text-blue-600 flex items-center gap-1">
                      <Ship className="h-4 w-4" />
                      Sea
                    </div>
                    <div className="text-muted-foreground">Cargo Type</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{formatDate(MOCK_ORDER.estimated_delivery)}</div>
                    <div className="text-muted-foreground">Est. Delivery</div>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Progress: {completedCount}/{MOCK_ORDER.milestones.length} milestones</span>
                  <span>{Math.round(progress)}% complete</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-ekda-green-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>

              {/* Route */}
              <div className="flex items-center gap-3 mt-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-ekda-green-600" />
                  <span className="font-medium">{MOCK_ORDER.origin}</span>
                </div>
                <div className="flex-1 flex items-center gap-1 text-muted-foreground">
                  <div className="flex-1 border-t border-dashed border-border" />
                  <Ship className="h-4 w-4" />
                  <div className="flex-1 border-t border-dashed border-border" />
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="font-medium">{MOCK_ORDER.destination}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Timeline */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Shipment Timeline</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="p-6 space-y-0">
                    {MOCK_ORDER.milestones.map((milestone, i) => (
                      <motion.div
                        key={milestone.status}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex gap-4 relative"
                      >
                        {/* Line */}
                        {i < MOCK_ORDER.milestones.length - 1 && (
                          <div
                            className={cn(
                              "absolute left-4 top-10 bottom-0 w-0.5",
                              milestone.completed ? "bg-primary" : "bg-muted"
                            )}
                          />
                        )}

                        {/* Icon */}
                        <div
                          className={cn(
                            "h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 z-10",
                            milestone.completed
                              ? milestone.isActive
                                ? "bg-primary text-white ring-4 ring-primary/20"
                                : "bg-primary text-white"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {milestone.isActive ? (
                            <div className="h-3 w-3 rounded-full bg-white animate-pulse" />
                          ) : milestone.completed ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <milestone.icon className="h-4 w-4" />
                          )}
                        </div>

                        {/* Content */}
                        <div className={cn("pb-8 flex-1", !milestone.completed && "opacity-40")}>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm">{milestone.title}</span>
                            {milestone.isActive && (
                              <Badge variant="blue" className="text-[10px] px-1.5">
                                Current
                              </Badge>
                            )}
                            {(milestone as any).escrowEvent && milestone.completed && (
                              <Badge variant="gold" className="text-[10px] px-1.5">
                                💰 {(milestone as any).escrowEvent}
                              </Badge>
                            )}
                            {(milestone as any).escrowEvent && !milestone.completed && (
                              <Badge variant="outline" className="text-[10px] px-1.5">
                                🔒 {(milestone as any).escrowEvent} (pending)
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {milestone.description}
                          </p>
                          {milestone.timestamp && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(milestone.timestamp).toLocaleString("en-GB", {
                                dateStyle: "medium",
                                timeStyle: "short",
                              })}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Escrow Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Escrow Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-1">
                      {formatCurrency(MOCK_ORDER.total, "NGN")}
                    </div>
                    <div className="text-xs text-muted-foreground">Total in Escrow</div>
                  </div>

                  <div className="space-y-2">
                    {[
                      { label: "Carrier Pickup (50%)", amount: 90000, released: true },
                      { label: "Destination Arrival (50%)", amount: 90000, released: false },
                      { label: "EKDA Commission (10%)", amount: 16500, released: true },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1.5">
                          {item.released ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                          ) : (
                            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                          <span className="text-xs text-muted-foreground">{item.label}</span>
                        </div>
                        <span className={cn("font-semibold text-xs", item.released ? "text-green-600" : "text-muted-foreground")}>
                          {item.released ? "Released" : "Pending"}: {formatCurrency(item.amount, "NGN")}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {MOCK_ORDER.items.map((item) => (
                    <div key={item.name} className="flex justify-between text-sm">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">{item.qty}</div>
                      </div>
                      <span className="font-semibold">
                        {formatCurrency(item.price, "NGN")}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Button variant="outline" className="w-full">
                <AlertCircle className="h-4 w-4" />
                Open Dispute
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
