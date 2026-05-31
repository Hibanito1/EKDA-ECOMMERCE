"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingCart,
  ArrowRight,
  Lock,
  Truck,
  Ship,
  Plane,
  AlertTriangle,
  Info,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, calculateOrderBreakdown } from "@ekda/shared";

const MOCK_CART_ITEMS = [
  {
    id: "1",
    product: {
      id: "1",
      name: "Premium Dried Crayfish",
      vendor: "Lagos Fresh Exports",
      image: "https://images.unsplash.com/photo-1571070083701-db30ea3b62f7?w=200&q=80",
      unit: "kg",
      cargo: "sea",
      hs_code: "0306.17",
      origin: "Nigeria",
    },
    price: 8500,
    quantity: 10,
  },
  {
    id: "2",
    product: {
      id: "2",
      name: "Palm Oil Pure Red",
      vendor: "Ogun Premium Oils",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200&q=80",
      unit: "litre",
      cargo: "sea",
      hs_code: "1511.10",
      origin: "Nigeria",
    },
    price: 6800,
    quantity: 5,
  },
  {
    id: "3",
    product: {
      id: "3",
      name: "Efirin Dried Basil",
      vendor: "Herb Haven",
      image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=200&q=80",
      unit: "100g",
      cargo: "air",
      hs_code: "0712.90",
      origin: "Nigeria",
    },
    price: 2500,
    quantity: 3,
  },
];

export default function CartPage() {
  const [items, setItems] = useState(MOCK_CART_ITEMS);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 45000; // estimated
  const breakdown = calculateOrderBreakdown(subtotal, shippingCost);

  const hasAirRestricted = items.some((item) => item.product.cargo === "sea" && item.id === "frozen");
  const hasSeaItems = items.some((item) => item.product.cargo === "sea");
  const hasAirItems = items.some((item) => item.product.cargo === "air");

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-8">
          Discover authentic African products and international imports
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/marketplace/export">
            <Button variant="premium">🌿 Shop African Exports</Button>
          </Link>
          <Link href="/marketplace/import">
            <Button variant="outline">🌍 Browse Imports</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">
        Shopping Cart{" "}
        <span className="text-muted-foreground font-normal text-xl">
          ({items.length} items)
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Mixed cargo warning */}
          {hasSeaItems && hasAirItems && (
            <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-800">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-sm text-yellow-800 dark:text-yellow-300 mb-1">
                  Mixed Cargo Types Detected
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-400">
                  Your cart contains items requiring both air and sea freight. Items will be shipped in separate shipments. Consider splitting your order for better rates.
                </p>
              </div>
            </div>
          )}

          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
            >
              <Card>
                <CardContent className="p-5">
                  <div className="flex gap-4">
                    <div
                      className="h-20 w-20 rounded-xl bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${item.product.image})` }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-sm">{item.product.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            by {item.product.vendor} · {item.product.origin}
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          {item.product.cargo === "sea" ? (
                            <><Ship className="h-3 w-3" /> Sea Freight</>
                          ) : (
                            <><Plane className="h-3 w-3" /> Air Freight</>
                          )}
                        </div>
                        <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                          HS: {item.product.hs_code}
                        </code>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="h-7 w-7 rounded-lg border border-border flex items-center justify-center hover:bg-muted"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="h-7 w-7 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <span className="text-xs text-muted-foreground">
                            {item.product.unit}
                          </span>
                        </div>
                        <span className="font-bold text-lg">
                          {formatCurrency(item.price * item.quantity, "NGN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {/* Promo Code */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPromoApplied(true)}
                  disabled={!promoCode}
                >
                  Apply
                </Button>
              </div>
              {promoApplied && (
                <p className="text-xs text-green-600 mt-2">
                  ✅ Promo code applied — 10% off shipping
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                <span className="font-medium">{formatCurrency(subtotal, "NGN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Shipping</span>
                <span className="font-medium">{formatCurrency(shippingCost, "NGN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  EKDA Commission
                  <Info className="h-3.5 w-3.5" />
                </span>
                <span className="font-medium">{formatCurrency(breakdown.ekdaCommission, "NGN")}</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(breakdown.total, "NGN")}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Duties and taxes calculated at checkout
                </p>
              </div>

              <div className="bg-ekda-green-50 dark:bg-ekda-green-900/20 rounded-xl p-3 border border-ekda-green-100 dark:border-ekda-green-800">
                <div className="flex items-start gap-2">
                  <Lock className="h-4 w-4 text-ekda-green-600 mt-0.5" />
                  <div>
                    <div className="text-sm font-semibold text-ekda-green-800 dark:text-ekda-green-300">
                      Escrow Protected
                    </div>
                    <p className="text-xs text-ekda-green-600 dark:text-ekda-green-400 mt-0.5">
                      100% held in escrow. 50% released at pickup, 50% at destination.
                    </p>
                  </div>
                </div>
              </div>

              <Link href="/checkout">
                <Button size="lg" variant="premium" className="w-full">
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              {/* Payment Methods */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <span className="text-xs text-muted-foreground">Pay with:</span>
                <div className="flex gap-2">
                  <div className="h-6 px-2 bg-muted rounded text-[10px] font-bold flex items-center">
                    Paystack
                  </div>
                  <div className="h-6 px-2 bg-muted rounded text-[10px] font-bold flex items-center">
                    Stripe
                  </div>
                  <div className="h-6 px-2 bg-muted rounded text-[10px] font-bold flex items-center">
                    Monnify
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
