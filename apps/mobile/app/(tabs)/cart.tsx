/**
 * apps/mobile/app/(tabs)/cart.tsx
 *
 * Cart items derive from EXPORT_PRODUCTS in @ekda/demo.
 * Calculations use EKDA_COMMISSION_RATE + calculateOrderBreakdown from @ekda/shared.
 * No inline hardcoded prices.
 */

import { useState } from "react";
import {
  formatCurrency,
  calculateOrderBreakdown,
  EKDA_COMMISSION_RATE,
} from "@ekda/shared";
import { EXPORT_PRODUCTS } from "@ekda/demo";
import { EMPTY_STATES } from "@ekda/ui";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

// Default demo cart: first two export products, from @ekda/demo
const DEMO_CART_ITEMS = [
  { product: EXPORT_PRODUCTS[0]!, qty: 10 }, // Crayfish
  { product: EXPORT_PRODUCTS[1]!, qty: 5 },  // Palm Oil
];

type CartItem = { product: (typeof EXPORT_PRODUCTS)[0]; qty: number };

export default function CartTab() {
  const [cartItems, setCartItems] = useState<CartItem[]>(DEMO_CART_ITEMS);

  const updateQty = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, qty: Math.max(0, item.qty + delta) }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const subtotal = cartItems.reduce(
    (sum, { product, qty }) => sum + product.price * qty,
    0
  );
  const shipping = 35000;
  const breakdown = calculateOrderBreakdown(subtotal, shipping);

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cart</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>{EMPTY_STATES.cart.emoji}</Text>
          <Text style={styles.emptyTitle}>{EMPTY_STATES.cart.title}</Text>
          <Text style={styles.emptyDesc}>{EMPTY_STATES.cart.description}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart ({cartItems.length})</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {cartItems.map(({ product, qty }) => (
          <View key={product.id} style={styles.cartItem}>
            <View style={styles.cartItemImage}>
              <Text style={styles.cartItemEmoji}>{product.emoji}</Text>
            </View>
            <View style={styles.cartItemInfo}>
              <Text style={styles.cartItemName}>{product.name}</Text>
              <Text style={styles.cartItemCargo}>
                {product.cargo === "sea" ? "🚢 Sea Freight" : "✈️ Air Freight"}
                {product.airRestricted ? " · Air Restricted" : ""}
              </Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => updateQty(product.id, -1)}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{qty}</Text>
                <TouchableOpacity
                  style={[styles.qtyBtn, styles.qtyBtnAdd]}
                  onPress={() => updateQty(product.id, 1)}
                >
                  <Text style={[styles.qtyBtnText, { color: "#fff" }]}>+</Text>
                </TouchableOpacity>
                <Text style={styles.qtyUnit}>{product.unit}</Text>
              </View>
            </View>
            <Text style={styles.cartItemPrice}>
              {formatCurrency(product.price * qty, product.currency)}
            </Text>
          </View>
        ))}

        {/* Summary — uses calculateOrderBreakdown from @ekda/shared */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(breakdown.subtotal, "NGN")}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping (Sea)</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(breakdown.shippingCost, "NGN")}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              EKDA Commission ({Math.round(EKDA_COMMISSION_RATE * 100)}%)
            </Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(breakdown.ekdaCommission, "NGN")}
            </Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>
              {formatCurrency(breakdown.total, "NGN")}
            </Text>
          </View>
        </View>

        <View style={styles.escrowNote}>
          <Text style={styles.escrowNoteText}>
            🔒 100% Escrow Protected — 50% released at pickup, 50% at
            destination
          </Text>
        </View>
      </ScrollView>

      <View style={styles.checkoutBar}>
        <View>
          <Text style={styles.checkoutTotal}>
            {formatCurrency(breakdown.total, "NGN")}
          </Text>
          <Text style={styles.checkoutSub}>Total amount</Text>
        </View>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Proceed to Checkout →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { padding: 20, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  headerTitle: { fontSize: 22, fontWeight: "800", color: "#111827" },
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: "700", color: "#111827", marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: "#6b7280", textAlign: "center" },
  scroll: { flex: 1 },
  cartItem: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", marginHorizontal: 16, marginTop: 12, borderRadius: 16, padding: 14, gap: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cartItemImage: { width: 56, height: 56, backgroundColor: "#f0fdf4", borderRadius: 12, alignItems: "center", justifyContent: "center" },
  cartItemEmoji: { fontSize: 30 },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 2 },
  cartItemCargo: { fontSize: 11, color: "#6b7280", marginBottom: 8 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyBtn: { width: 28, height: 28, borderRadius: 8, borderWidth: 1.5, borderColor: "#e5e7eb", alignItems: "center", justifyContent: "center" },
  qtyBtnAdd: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
  qtyBtnText: { fontSize: 16, fontWeight: "700", color: "#374151" },
  qtyValue: { fontSize: 14, fontWeight: "700", color: "#111827", minWidth: 20, textAlign: "center" },
  qtyUnit: { fontSize: 11, color: "#9ca3af" },
  cartItemPrice: { fontSize: 15, fontWeight: "800", color: "#111827" },
  summary: { backgroundColor: "#fff", margin: 16, borderRadius: 16, padding: 16, gap: 10 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { fontSize: 13, color: "#6b7280" },
  summaryValue: { fontSize: 13, fontWeight: "600", color: "#111827" },
  summaryTotal: { borderTopWidth: 1, borderTopColor: "#f1f5f9", paddingTop: 10 },
  summaryTotalLabel: { fontSize: 16, fontWeight: "800", color: "#111827" },
  summaryTotalValue: { fontSize: 16, fontWeight: "800", color: "#111827" },
  escrowNote: { marginHorizontal: 16, backgroundColor: "#f0fdf4", borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#bbf7d0" },
  escrowNoteText: { fontSize: 12, color: "#15803d", textAlign: "center", lineHeight: 18 },
  checkoutBar: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", padding: 16, paddingBottom: 24, flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTopWidth: 1, borderTopColor: "#f1f5f9", shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 10 },
  checkoutTotal: { fontSize: 20, fontWeight: "800", color: "#111827" },
  checkoutSub: { fontSize: 11, color: "#9ca3af" },
  checkoutButton: { backgroundColor: "#16a34a", paddingHorizontal: 20, paddingVertical: 14, borderRadius: 14 },
  checkoutButtonText: { color: "#fff", fontSize: 14, fontWeight: "800" },
});
