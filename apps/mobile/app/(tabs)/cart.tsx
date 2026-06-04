import { formatCurrency, calculateOrderBreakdown, EKDA_COMMISSION_RATE } from "@ekda/shared";
import { EXPORT_PRODUCTS, MOCK_ORDERS } from "@ekda/demo";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const MOCK_CART = [
  { id: "1", name: "Dried Crayfish", price: 8500, qty: 10, unit: "kg", cargo: "sea", emoji: "🦐" },
  { id: "2", name: "Palm Oil", price: 6800, qty: 5, unit: "L", cargo: "sea", emoji: "🫙" },
];

export default function CartTab() {
  const subtotal = MOCK_CART.reduce((s, i) => s + i.price * i.qty, 0);
  const shipping = 35000;
  const commission = subtotal * EKDA_COMMISSION_RATE; // from @ekda/shared
  const total = subtotal + shipping + commission;

  // Uses formatCurrency from @ekda/shared

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart ({MOCK_CART.length})</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 120 }}>
        {MOCK_CART.map((item) => (
          <View key={item.id} style={styles.cartItem}>
            <View style={styles.cartItemImage}>
              <Text style={styles.cartItemEmoji}>{item.emoji}</Text>
            </View>
            <View style={styles.cartItemInfo}>
              <Text style={styles.cartItemName}>{item.name}</Text>
              <Text style={styles.cartItemCargo}>
                {item.cargo === "sea" ? "🚢 Sea Freight" : "✈️ Air Freight"}
              </Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity style={styles.qtyBtn}>
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{item.qty}</Text>
                <TouchableOpacity style={[styles.qtyBtn, styles.qtyBtnAdd]}>
                  <Text style={[styles.qtyBtnText, { color: "#fff" }]}>+</Text>
                </TouchableOpacity>
                <Text style={styles.qtyUnit}>{item.unit}</Text>
              </View>
            </View>
            <Text style={styles.cartItemPrice}>{formatCurrency(item.price * item.qty, "NGN")}</Text>
          </View>
        ))}

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal, "NGN")}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping (Sea)</Text>
            <Text style={styles.summaryValue}>{formatCurrency(shipping, "NGN")}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>EKDA Commission (10%)</Text>
            <Text style={styles.summaryValue}>{formatCurrency(commission, "NGN")}</Text>
          </View>
          <View style={[styles.summaryRow, styles.summaryTotal]}>
            <Text style={styles.summaryTotalLabel}>Total</Text>
            <Text style={styles.summaryTotalValue}>{formatCurrency(total, "NGN")}</Text>
          </View>
        </View>

        <View style={styles.escrowNote}>
          <Text style={styles.escrowNoteText}>
            🔒 100% Escrow Protected — 50% released at pickup, 50% at destination
          </Text>
        </View>
      </ScrollView>

      <View style={styles.checkoutBar}>
        <View>
          <Text style={styles.checkoutTotal}>{formatCurrency(total, "NGN")}</Text>
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
  scroll: { flex: 1 },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    padding: 14,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cartItemImage: {
    width: 56,
    height: 56,
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cartItemEmoji: { fontSize: 30 },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 2 },
  cartItemCargo: { fontSize: 11, color: "#6b7280", marginBottom: 8 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnAdd: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
  qtyBtnText: { fontSize: 16, fontWeight: "700", color: "#374151" },
  qtyValue: { fontSize: 14, fontWeight: "700", color: "#111827", minWidth: 20, textAlign: "center" },
  qtyUnit: { fontSize: 11, color: "#9ca3af" },
  cartItemPrice: { fontSize: 15, fontWeight: "800", color: "#111827" },
  summary: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  summaryLabel: { fontSize: 13, color: "#6b7280" },
  summaryValue: { fontSize: 13, fontWeight: "600", color: "#111827" },
  summaryTotal: { borderTopWidth: 1, borderTopColor: "#f1f5f9", paddingTop: 10 },
  summaryTotalLabel: { fontSize: 16, fontWeight: "800", color: "#111827" },
  summaryTotalValue: { fontSize: 16, fontWeight: "800", color: "#111827" },
  escrowNote: {
    marginHorizontal: 16,
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  escrowNoteText: { fontSize: 12, color: "#15803d", textAlign: "center", lineHeight: 18 },
  checkoutBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    padding: 16,
    paddingBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
  },
  checkoutTotal: { fontSize: 20, fontWeight: "800", color: "#111827" },
  checkoutSub: { fontSize: 11, color: "#9ca3af" },
  checkoutButton: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
  },
  checkoutButtonText: { color: "#fff", fontSize: 14, fontWeight: "800" },
});
