"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  CreditCard,
  Truck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Lock,
  Ship,
  Plane,
  Package,
  Star,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, calculateOrderBreakdown } from "@ekda/shared";
import { NIGERIAN_SEAPORTS, NIGERIAN_AIRPORTS } from "@ekda/shared";
import toast from "react-hot-toast";

const STEPS = [
  { id: "delivery", label: "Delivery", icon: MapPin },
  { id: "carrier", label: "Carrier", icon: Truck },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "confirm", label: "Confirm", icon: CheckCircle2 },
];

const MOCK_CARRIERS = [
  {
    id: "c1",
    name: "DHL Express",
    logo: "🚛",
    type: "air",
    days: 5,
    rate: 85000,
    currency: "NGN",
    rating: 4.9,
    includes_duties: false,
    tag: "Fastest",
  },
  {
    id: "c2",
    name: "Maersk Line",
    logo: "🚢",
    type: "sea",
    days: 28,
    rate: 35000,
    currency: "NGN",
    rating: 4.7,
    includes_duties: false,
    tag: "Best Value",
  },
  {
    id: "c3",
    name: "Jumia Logistics",
    logo: "📦",
    type: "sea",
    days: 35,
    rate: 28000,
    currency: "NGN",
    rating: 4.5,
    includes_duties: false,
    tag: null,
  },
  {
    id: "c4",
    name: "Fedex International",
    logo: "✈️",
    type: "air",
    days: 4,
    rate: 120000,
    currency: "NGN",
    rating: 4.8,
    includes_duties: true,
    tag: "Door-to-Door",
  },
];

const PAYMENT_METHODS = [
  {
    id: "paystack",
    name: "Paystack",
    description: "Debit/Credit cards, Bank Transfer (Nigeria)",
    icon: "💳",
    badge: "Nigeria",
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "International cards, Apple/Google Pay",
    icon: "🌍",
    badge: "International",
  },
  {
    id: "monnify",
    name: "Monnify",
    description: "Bank Transfer, USSD, Card",
    icon: "🏦",
    badge: "Nigeria",
  },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [selectedCarrier, setSelectedCarrier] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [destinationType, setDestinationType] = useState<"address" | "port" | "airport">("address");
  const [loading, setLoading] = useState(false);

  const subtotal = 160000;
  const shippingCost = selectedCarrier
    ? MOCK_CARRIERS.find((c) => c.id === selectedCarrier)?.rate || 35000
    : 35000;
  const breakdown = calculateOrderBreakdown(subtotal, shippingCost);

  const handlePlaceOrder = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    toast.success("🎉 Order placed! Payment processing...");
    setStep(3);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="flex items-center mb-10">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 ${i < step ? "cursor-pointer" : "cursor-default"}`}
            >
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center transition-all ${
                  step > i
                    ? "bg-primary text-white"
                    : step === i
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {step > i ? <CheckCircle2 className="h-5 w-5" /> : <s.icon className="h-4 w-4" />}
              </div>
              <span
                className={`text-sm font-medium hidden md:block ${
                  step >= i ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 ${step > i ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {/* Step 0: Delivery */}
            {step === 0 && (
              <motion.div
                key="delivery"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      Delivery Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Destination type */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Delivery Destination</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "address", label: "Home/Office", icon: "🏠" },
                          { id: "port", label: "Seaport", icon: "⚓" },
                          { id: "airport", label: "Airport", icon: "✈️" },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setDestinationType(opt.id as any)}
                            className={`p-3 rounded-xl border-2 text-center text-sm transition-all ${
                              destinationType === opt.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/30"
                            }`}
                          >
                            <div className="text-xl mb-1">{opt.icon}</div>
                            <div className="font-medium text-xs">{opt.label}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {destinationType === "address" && (
                      <div className="grid grid-cols-2 gap-4">
                        <Input label="Full Name" placeholder="Adaeze Okonkwo" required />
                        <Input label="Phone Number" placeholder="+44 7911 123456" required />
                        <Input label="Address" placeholder="123 Brixton Road" className="col-span-2" required />
                        <Input label="City" placeholder="London" required />
                        <Input label="State/County" placeholder="Greater London" required />
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Country <span className="text-destructive">*</span></label>
                          <select className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                            <option>United Kingdom</option>
                            <option>United States</option>
                            <option>Nigeria</option>
                            <option>Canada</option>
                          </select>
                        </div>
                        <Input label="Postal Code" placeholder="SW9 8AA" />
                      </div>
                    )}

                    {destinationType === "port" && (
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Select Nigerian Seaport <span className="text-destructive">*</span></label>
                        <select className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                          {NIGERIAN_SEAPORTS.map((p) => (
                            <option key={p.code} value={p.code}>{p.name}</option>
                          ))}
                        </select>
                        <p className="text-xs text-muted-foreground">
                          Goods will be delivered to your chosen port. You are responsible for customs clearance.
                        </p>
                      </div>
                    )}

                    {destinationType === "airport" && (
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Select Nigerian Airport <span className="text-destructive">*</span></label>
                        <select className="w-full h-11 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                          {NIGERIAN_AIRPORTS.map((a) => (
                            <option key={a.code} value={a.code}>{a.name}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Button size="lg" variant="premium" className="w-full" onClick={() => setStep(1)}>
                  Continue to Carrier Selection
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}

            {/* Step 1: Carrier */}
            {step === 1 && (
              <motion.div
                key="carrier"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      Select Carrier
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred carrier. AI recommends sea freight for your items.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {MOCK_CARRIERS.map((carrier) => (
                      <button
                        key={carrier.id}
                        onClick={() => setSelectedCarrier(carrier.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                          selectedCarrier === carrier.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <span className="text-3xl">{carrier.logo}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-semibold">{carrier.name}</span>
                            {carrier.tag && (
                              <Badge variant="gold" className="text-[10px] px-1.5 py-0.5">
                                {carrier.tag}
                              </Badge>
                            )}
                            {carrier.includes_duties && (
                              <Badge variant="success" className="text-[10px] px-1.5 py-0.5">
                                Duties Included
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            {carrier.type === "sea" ? (
                              <span className="flex items-center gap-1">
                                <Ship className="h-3.5 w-3.5" /> Sea Freight
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Plane className="h-3.5 w-3.5" /> Air Freight
                              </span>
                            )}
                            <span>·</span>
                            <span>{carrier.days} days transit</span>
                            <span>·</span>
                            <span className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 fill-ekda-gold-400 text-ekda-gold-400" />
                              {carrier.rating}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">
                            {formatCurrency(carrier.rate, "NGN")}
                          </div>
                          <div className="text-xs text-muted-foreground">shipping</div>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button variant="outline" size="lg" onClick={() => setStep(0)}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="premium"
                    className="flex-1"
                    onClick={() => setStep(2)}
                    disabled={!selectedCarrier}
                  >
                    Continue to Payment
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Payment Method
                    </CardTitle>
                    <div className="flex items-start gap-2 p-3 bg-ekda-green-50 dark:bg-ekda-green-900/20 rounded-xl">
                      <Lock className="h-4 w-4 text-ekda-green-600 mt-0.5" />
                      <p className="text-xs text-ekda-green-700 dark:text-ekda-green-400">
                        Your payment is 100% secured in EKDA escrow. Funds are only released when delivery milestones are confirmed by the carrier.
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {PAYMENT_METHODS.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all ${
                          selectedPayment === method.id
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <span className="text-3xl">{method.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{method.name}</span>
                            <Badge variant="outline" className="text-[10px]">
                              {method.badge}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {method.description}
                          </p>
                        </div>
                        <div
                          className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${
                            selectedPayment === method.id ? "border-primary bg-primary" : "border-muted-foreground"
                          }`}
                        >
                          {selectedPayment === method.id && (
                            <div className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>

                <div className="flex gap-3">
                  <Button variant="outline" size="lg" onClick={() => setStep(1)}>
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="premium"
                    className="flex-1"
                    onClick={handlePlaceOrder}
                    disabled={!selectedPayment}
                    loading={loading}
                  >
                    <Lock className="h-4 w-4" />
                    Place Order — {formatCurrency(breakdown.total, "NGN")}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="h-20 w-20 rounded-full bg-ekda-green-100 dark:bg-ekda-green-900/30 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-10 w-10 text-ekda-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
                <p className="text-muted-foreground mb-2">Order #EKDA-MK8X9F</p>
                <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
                  Your payment is secured in escrow. You will receive email and SMS updates at every milestone.
                </p>
                <div className="bg-muted/50 rounded-2xl p-5 text-left mb-8 max-w-sm mx-auto">
                  <div className="text-sm font-semibold mb-3">What happens next:</div>
                  {[
                    { icon: "✅", text: "Payment held in EKDA escrow" },
                    { icon: "📦", text: "Vendor prepares your order" },
                    { icon: "🚢", text: "Carrier picks up — 50% released to vendor" },
                    { icon: "🏁", text: "Arrives at destination — remaining 50% released" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-center gap-2 mb-2 text-sm">
                      <span>{item.icon}</span>
                      <span className="text-muted-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
                <Button variant="premium" size="lg">
                  Track Your Order
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        {step < 3 && (
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal, "NGN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{formatCurrency(shippingCost, "NGN")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">EKDA Commission (10%)</span>
                  <span>{formatCurrency(breakdown.ekdaCommission, "NGN")}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{formatCurrency(breakdown.total, "NGN")}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Escrow release: 50% (pickup) + 50% (delivery)
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
