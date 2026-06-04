import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { formatCurrency } from "@ekda/shared";
import { IMPORT_PRODUCTS } from "@ekda/demo";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

// Products now from @ekda/demo

function ImportCard({ item }: { item: typeof PRODUCTS[0] }) {
  return (
    <TouchableOpacity style={[styles.card, { width: CARD_WIDTH }]}>
      <LinearGradient colors={["#1e293b", "#0f172a"]} style={styles.cardHeader}>
        <Text style={styles.cardEmoji}>{item.emoji}</Text>
        <View>
          <View style={styles.importBadge}>
            <Text style={styles.importBadgeText}>🌍 Import</Text>
          </View>
          <Text style={styles.cardOrigin}>{item.origin}</Text>
        </View>
        <View style={styles.cargoBadge}>
          <Text style={styles.cargoText}>{item.cargo === "sea" ? "🚢 Sea" : "✈️ Air"}</Text>
        </View>
      </LinearGradient>
      <View style={styles.cardBody}>
        <Text style={styles.cardCategory}>{item.category}</Text>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardVendor}>by {item.vendor}</Text>
        <View style={styles.hsRow}>
          <Text style={styles.hsLabel}>HS Code:</Text>
          <Text style={styles.hsCode}>{item.hs}</Text>
          <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>🤖 AI</Text></View>
          <View style={styles.dutyBadge}><Text style={styles.dutyText}>Duty: {item.duty}</Text></View>
        </View>
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.cardPrice}>{formatCurrency(item.price ?? 0, item.currency ?? "NGN")}</Text>
            <Text style={styles.cardPriceSub}>+ shipping & duties</Text>
          </View>
          <TouchableOpacity style={styles.viewButton}>
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ImportTab() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={["#1e40af", "#1d4ed8"]} style={styles.header}>
        <Text style={styles.headerBadge}>🌍 Global Imports</Text>
        <Text style={styles.headerTitle}>Import Quality Goods{"\n"}to Nigeria</Text>
        <View style={styles.trustBadges}>
          {["🚢 Sea Freight", "🛡️ Escrow", "🤖 AI Verified"].map((b) => (
            <View key={b} style={styles.trustBadge}>
              <Text style={styles.trustBadgeText}>{b}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <FlatList
        data={IMPORT_PRODUCTS}
        renderItem={({ item }) => <ImportCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  headerBadge: {
    color: "#93c5fd",
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "rgba(59,130,246,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    alignSelf: "flex-start",
    marginBottom: 8,
    overflow: "hidden",
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "800", lineHeight: 28, marginBottom: 14 },
  trustBadges: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  trustBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
  trustBadgeText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  list: { padding: 20, paddingBottom: 30, gap: 14 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  cardEmoji: { fontSize: 40 },
  importBadge: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 4,
  },
  importBadgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  cardOrigin: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
  cargoBadge: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  cargoText: { color: "#fff", fontSize: 11, fontWeight: "600" },
  cardBody: { padding: 16 },
  cardCategory: { fontSize: 11, color: "#9ca3af", textTransform: "capitalize", marginBottom: 3 },
  cardName: { fontSize: 16, fontWeight: "800", color: "#111827", marginBottom: 3 },
  cardVendor: { fontSize: 12, color: "#6b7280", marginBottom: 10 },
  hsRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 12, flexWrap: "wrap" },
  hsLabel: { fontSize: 11, color: "#9ca3af" },
  hsCode: { fontSize: 11, fontFamily: "monospace", fontWeight: "700", color: "#374151" },
  aiBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  aiBadgeText: { fontSize: 10, fontWeight: "700", color: "#d97706" },
  dutyBadge: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  dutyText: { fontSize: 10, fontWeight: "700", color: "#dc2626" },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  cardPrice: { fontSize: 18, fontWeight: "800", color: "#111827" },
  cardPriceSub: { fontSize: 10, color: "#9ca3af", marginTop: 1 },
  viewButton: {
    backgroundColor: "#0f2044",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  viewButtonText: { color: "#fff", fontSize: 13, fontWeight: "700" },
});
