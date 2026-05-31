import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");

const CATEGORIES = [
  { icon: "🌿", label: "Groceries", href: "/(tabs)/export" },
  { icon: "🌾", label: "Dried Produce", href: "/(tabs)/export" },
  { icon: "🚗", label: "Vehicles", href: "/(tabs)/import" },
  { icon: "📱", label: "Electronics", href: "/(tabs)/import" },
  { icon: "⚙️", label: "Machinery", href: "/(tabs)/import" },
  { icon: "❄️", label: "Frozen", href: "/(tabs)/export" },
];

const FEATURED_PRODUCTS = [
  {
    id: "1",
    name: "Premium Dried Crayfish",
    vendor: "Lagos Fresh Exports",
    price: "₦8,500/kg",
    image: "🦐",
    type: "export",
    rating: 4.9,
  },
  {
    id: "2",
    name: "iPhone 15 Pro Max",
    vendor: "Dubai Electronics",
    price: "₦1,150,000",
    image: "📱",
    type: "import",
    rating: 4.9,
  },
  {
    id: "3",
    name: "Palm Oil — Pure Red",
    vendor: "Ogun Premium",
    price: "₦6,800/L",
    image: "🫙",
    type: "export",
    rating: 4.7,
  },
];

export default function HomeTab() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.username}>Welcome to EKDA</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.notifButton}>
              <Text style={styles.notifIcon}>🔔</Text>
              <View style={styles.notifBadge} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search products, vendors..."
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Hero Banner */}
        <LinearGradient
          colors={["#0a1628", "#14532d"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroBanner}
        >
          <View>
            <Text style={styles.heroBadge}>🌿 African Exports</Text>
            <Text style={styles.heroTitle}>
              Authentic African{"\n"}Goods Worldwide
            </Text>
            <TouchableOpacity
              style={styles.heroButton}
              onPress={() => router.push("/(tabs)/export")}
            >
              <Text style={styles.heroButtonText}>Shop Now →</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heroEmoji}>🌍</Text>
        </LinearGradient>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.label}
                style={styles.categoryItem}
                onPress={() => router.push(cat.href as any)}
              >
                <View style={styles.categoryIcon}>
                  <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                </View>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {FEATURED_PRODUCTS.map((product) => (
              <TouchableOpacity key={product.id} style={styles.productCard}>
                <View
                  style={[
                    styles.productImageBg,
                    {
                      backgroundColor:
                        product.type === "export" ? "#dcfce7" : "#dbeafe",
                    },
                  ]}
                >
                  <Text style={styles.productEmoji}>{product.image}</Text>
                  <View
                    style={[
                      styles.productTypeBadge,
                      {
                        backgroundColor:
                          product.type === "export" ? "#16a34a" : "#2563eb",
                      },
                    ]}
                  >
                    <Text style={styles.productTypeText}>
                      {product.type === "export" ? "Export" : "Import"}
                    </Text>
                  </View>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text style={styles.productVendor}>{product.vendor}</Text>
                  <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>{product.price}</Text>
                    <View style={styles.ratingRow}>
                      <Text style={styles.ratingStar}>⭐</Text>
                      <Text style={styles.ratingValue}>{product.rating}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Two Marketplace Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Two-Way Marketplace</Text>
          <View style={styles.marketplaceCards}>
            <TouchableOpacity
              style={styles.marketCard}
              onPress={() => router.push("/(tabs)/export")}
            >
              <LinearGradient
                colors={["#166534", "#14532d"]}
                style={styles.marketCardGradient}
              >
                <Text style={styles.marketCardEmoji}>🌿</Text>
                <Text style={styles.marketCardTitle}>African Exports</Text>
                <Text style={styles.marketCardSub}>
                  Groceries, dried produce, agri commodities
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.marketCard}
              onPress={() => router.push("/(tabs)/import")}
            >
              <LinearGradient
                colors={["#1e40af", "#1d4ed8"]}
                style={styles.marketCardGradient}
              >
                <Text style={styles.marketCardEmoji}>🌍</Text>
                <Text style={styles.marketCardTitle}>Global Imports</Text>
                <Text style={styles.marketCardSub}>
                  Cars, electronics, machinery to Nigeria
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Escrow Banner */}
        <View style={styles.escrowBanner}>
          <Text style={styles.escrowIcon}>🔒</Text>
          <View style={styles.escrowContent}>
            <Text style={styles.escrowTitle}>100% Escrow Protected</Text>
            <Text style={styles.escrowText}>
              Funds held safely. Released 50% at pickup, 50% at delivery.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scroll: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#fff",
  },
  headerLeft: {},
  headerRight: {},
  greeting: { fontSize: 13, color: "#6b7280" },
  username: { fontSize: 22, fontWeight: "800", color: "#111827" },
  notifButton: {
    position: "relative",
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
  },
  notifIcon: { fontSize: 18 },
  notifBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ef4444",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    gap: 10,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 14, color: "#111827" },
  heroBanner: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  heroBadge: {
    color: "#86efac",
    fontSize: 12,
    fontWeight: "600",
    backgroundColor: "rgba(34,197,94,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    alignSelf: "flex-start",
    marginBottom: 10,
    overflow: "hidden",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    lineHeight: 26,
    marginBottom: 16,
  },
  heroButton: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  heroButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  heroEmoji: { fontSize: 60 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  sectionTitle: { fontSize: 18, fontWeight: "800", color: "#111827", marginBottom: 14 },
  seeAll: { fontSize: 14, color: "#16a34a", fontWeight: "600" },
  categoriesScroll: { marginHorizontal: -20, paddingHorizontal: 20 },
  categoryItem: { alignItems: "center", marginRight: 14, width: 70 },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryEmoji: { fontSize: 26 },
  categoryLabel: { fontSize: 11, color: "#6b7280", fontWeight: "500", textAlign: "center" },
  productCard: {
    width: 160,
    marginRight: 14,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  productImageBg: { height: 110, alignItems: "center", justifyContent: "center", position: "relative" },
  productEmoji: { fontSize: 44 },
  productTypeBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 100,
  },
  productTypeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  productInfo: { padding: 10 },
  productName: { fontSize: 13, fontWeight: "700", color: "#111827", marginBottom: 2 },
  productVendor: { fontSize: 11, color: "#9ca3af", marginBottom: 8 },
  productFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  productPrice: { fontSize: 14, fontWeight: "800", color: "#16a34a" },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 2 },
  ratingStar: { fontSize: 10 },
  ratingValue: { fontSize: 11, fontWeight: "600", color: "#374151" },
  marketplaceCards: { flexDirection: "row", gap: 12 },
  marketCard: { flex: 1, borderRadius: 16, overflow: "hidden" },
  marketCardGradient: { padding: 18 },
  marketCardEmoji: { fontSize: 28, marginBottom: 8 },
  marketCardTitle: { color: "#fff", fontSize: 15, fontWeight: "800", marginBottom: 4 },
  marketCardSub: { color: "rgba(255,255,255,0.65)", fontSize: 11, lineHeight: 15 },
  escrowBanner: {
    marginHorizontal: 20,
    backgroundColor: "#f0fdf4",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  escrowIcon: { fontSize: 24, marginTop: 2 },
  escrowContent: { flex: 1 },
  escrowTitle: { fontSize: 14, fontWeight: "700", color: "#14532d", marginBottom: 3 },
  escrowText: { fontSize: 12, color: "#15803d", lineHeight: 17 },
});
