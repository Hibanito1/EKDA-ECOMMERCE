import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { formatCurrency } from "@ekda/shared";
import { EXPORT_PRODUCTS } from "@ekda/demo";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 52) / 2;

// Products now from @ekda/demo

const CATEGORIES = ["All", "Groceries", "Dried Produce", "Frozen", "Agri Commodities"];

function ProductCard({ item }: { item: typeof PRODUCTS[0] }) {
  return (
    <TouchableOpacity style={[styles.card, { width: CARD_WIDTH }]}>
      <View style={styles.cardImage}>
        <Text style={styles.cardEmoji}>{item.emoji}</Text>
        {item.airRestricted && (
          <View style={styles.airRestrictedBadge}>
            <Text style={styles.airRestrictedText}>⚠️ Air Restricted</Text>
          </View>
        )}
        <View style={styles.cargoBadge}>
          <Text style={styles.cargoText}>{item.cargo === "sea" ? "🚢" : "✈️"}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.cardVendor}>{item.vendor}</Text>
        <View style={styles.hsRow}>
          <Text style={styles.hsLabel}>HS:</Text>
          <Text style={styles.hsCode}>{item.hs}</Text>
          <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>AI</Text></View>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.cardPrice}>{formatCurrency(item.price ?? 0, item.currency ?? "NGN")}</Text>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ExportTab() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={["#166534", "#14532d"]} style={styles.header}>
        <Text style={styles.headerBadge}>🌿 African Exports</Text>
        <Text style={styles.headerTitle}>Authentic African Products</Text>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search crayfish, garri, palm oil..."
            placeholderTextColor="rgba(255,255,255,0.5)"
          />
        </View>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((cat, i) => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryPill, i === 0 && styles.categoryPillActive]}
          >
            <Text style={[styles.categoryPillText, i === 0 && styles.categoryPillTextActive]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={EXPORT_PRODUCTS}
        renderItem={({ item }) => <ProductCard item={item} />}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.productGrid}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  headerBadge: {
    color: "#86efac",
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "rgba(34,197,94,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    alignSelf: "flex-start",
    marginBottom: 8,
    overflow: "hidden",
  },
  headerTitle: { color: "#fff", fontSize: 22, fontWeight: "800", marginBottom: 16 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
    gap: 10,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, color: "#fff", fontSize: 14 },
  categoriesScroll: { maxHeight: 52, backgroundColor: "#fff" },
  categoriesContent: { paddingHorizontal: 16, alignItems: "center", gap: 8 },
  categoryPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    backgroundColor: "#f3f4f6",
  },
  categoryPillActive: { backgroundColor: "#16a34a" },
  categoryPillText: { fontSize: 13, fontWeight: "600", color: "#6b7280" },
  categoryPillTextActive: { color: "#fff" },
  productGrid: { padding: 16, paddingBottom: 30 },
  columnWrapper: { gap: 12 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    height: 110,
    backgroundColor: "#f0fdf4",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cardEmoji: { fontSize: 50 },
  airRestrictedBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "#fef9c3",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  airRestrictedText: { fontSize: 8, fontWeight: "700", color: "#854d0e" },
  cargoBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0,0,0,0.1)",
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cargoText: { fontSize: 12 },
  cardContent: { padding: 10 },
  cardName: { fontSize: 13, fontWeight: "700", color: "#111827", marginBottom: 2 },
  cardVendor: { fontSize: 10, color: "#9ca3af", marginBottom: 6 },
  hsRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 8 },
  hsLabel: { fontSize: 10, color: "#9ca3af" },
  hsCode: { fontSize: 10, fontFamily: "monospace", color: "#374151", fontWeight: "600" },
  aiBadge: {
    backgroundColor: "#fef3c7",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  aiBadgeText: { fontSize: 8, fontWeight: "800", color: "#d97706" },
  cardFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardPrice: { fontSize: 13, fontWeight: "800", color: "#16a34a" },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: { color: "#fff", fontSize: 18, fontWeight: "700", lineHeight: 22 },
});
