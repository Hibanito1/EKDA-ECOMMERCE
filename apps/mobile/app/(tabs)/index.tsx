/**
 * apps/mobile/app/(tabs)/index.tsx
 *
 * Home screen — now uses @ekda/shared and @ekda/demo for all data.
 * No more inline mock arrays.
 */

import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  Dimensions, TextInput,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

// ─── Shared packages ──────────────────────────────────────────────────────────
import { PRODUCT_CATEGORIES, formatCurrency } from "@ekda/shared";
import { FEATURED_PRODUCTS, MOCK_ORDERS } from "@ekda/demo";
import { EMPTY_STATES } from "@ekda/ui";

const { width } = Dimensions.get("window");

export default function HomeTab({ user, cart, onCartUpdate, onNavigate }: {
  user?: { name: string; wallet: number; loyaltyPoints: number };
  cart?: Record<string, number>;
  onCartUpdate?: (c: Record<string, number>) => void;
  onNavigate?: (tab: string) => void;
}) {
  const cartTotal = Object.values(cart ?? {}).reduce((s, v) => s + v, 0);
  const recentOrder = MOCK_ORDERS[0];

  // Build category list from the shared PRODUCT_CATEGORIES constant
  const CATEGORIES = Object.entries(PRODUCT_CATEGORIES).map(([id, cat]) => ({
    id,
    icon: cat.icon,
    label: cat.label,
    href: cat.marketplaceType === "export" ? "/(tabs)/export" : "/(tabs)/import",
  }));

  const addToCart = (productId: string) => {
    if (onCartUpdate && cart !== undefined) {
      onCartUpdate({ ...cart, [productId]: (cart[productId] ?? 0) + 1 });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        {/* Header */}
        <LinearGradient colors={["#0a1628", "#0f2044", "#14532d"]} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good day 👋</Text>
              <Text style={styles.username}>{user?.name ?? "Welcome"}</Text>
            </View>
            <TouchableOpacity
              onPress={() => onNavigate?.("cart") ?? router.push("/(tabs)/cart" as any)}
              style={styles.cartBtn}
            >
              <Text style={styles.cartBtnEmoji}>🛒</Text>
              {cartTotal > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cartTotal}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.searchHint}
            onPress={() => onNavigate?.("exports") ?? router.push("/(tabs)/export" as any)}
          >
            <Text style={styles.searchHintIcon}>🔍</Text>
            <Text style={styles.searchHintText}>Search crayfish, garri, cars, phones...</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Demo Mode Badge */}
        <View style={styles.demoBanner}>
          <Text style={styles.demoBannerIcon}>🎭</Text>
          <Text style={styles.demoBannerText}>Demo Mode — All data is simulated</Text>
        </View>

        {/* Quick Stats */}
        {user && (
          <View style={styles.statsRow}>
            {[
              { emoji: "📦", label: "Active Orders", value: MOCK_ORDERS.filter(o => o.status !== "delivered").length },
              { emoji: "💰", label: "Wallet", value: formatCurrency(user.wallet, "NGN") },
              { emoji: "⭐", label: "Loyalty Pts", value: user.loyaltyPoints.toLocaleString() },
            ].map(stat => (
              <View key={stat.label} style={styles.statCard}>
                <Text style={styles.statEmoji}>{stat.emoji}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Two Marketplaces */}
        <Text style={styles.sectionTitle}>Two-Way Marketplace</Text>
        <View style={styles.marketRow}>
          <TouchableOpacity
            style={styles.marketCard}
            onPress={() => onNavigate?.("exports") ?? router.push("/(tabs)/export" as any)}
          >
            <LinearGradient colors={["#166534", "#14532d"]} style={styles.marketGradient}>
              <Text style={styles.marketEmoji}>🌿</Text>
              <Text style={styles.marketTitle}>African Exports</Text>
              <Text style={styles.marketSub}>Groceries, dried produce, agri commodities</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.marketCard}
            onPress={() => onNavigate?.("imports") ?? router.push("/(tabs)/import" as any)}
          >
            <LinearGradient colors={["#1e3a5f", "#1e40af"]} style={styles.marketGradient}>
              <Text style={styles.marketEmoji}>🌍</Text>
              <Text style={styles.marketTitle}>Global Imports</Text>
              <Text style={styles.marketSub}>Cars, electronics, machinery to Nigeria</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Active Order Tracker */}
        {recentOrder && (
          <>
            <Text style={styles.sectionTitle}>Track Latest Order</Text>
            <View style={styles.trackCard}>
              <View style={styles.trackHeader}>
                <Text style={styles.trackId}>{recentOrder.id}</Text>
                <View style={styles.trackStatusBadge}>
                  <Text style={styles.trackStatusText}>
                    {recentOrder.cargo === "sea" ? "🚢" : "✈️"} {recentOrder.status.replace("_", " ")}
                  </Text>
                </View>
              </View>
              <Text style={styles.trackProduct}>{recentOrder.product}</Text>
              <View style={styles.trackProgress}>
                <View style={styles.trackProgressBar}>
                  <View style={[styles.trackProgressFill, { width: `${recentOrder.progress}%` as any }]} />
                </View>
                <Text style={styles.trackProgressText}>{recentOrder.progress}%</Text>
              </View>
              <Text style={styles.trackCarrier}>Carrier: {recentOrder.carrier}</Text>
            </View>
          </>
        )}

        {/* Featured Products from @ekda/demo */}
        <Text style={styles.sectionTitle}>🌟 Featured Products</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.featuredScroll}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        >
          {FEATURED_PRODUCTS.map(p => (
            <TouchableOpacity key={p.id} style={styles.smallCard}>
              <View style={[styles.smallCardImg, { backgroundColor: p.airRestricted ? "#fff7ed" : "#f0fdf4" }]}>
                <Text style={styles.smallCardEmoji}>{p.emoji}</Text>
              </View>
              <View style={styles.smallCardBody}>
                <Text style={styles.smallCardName} numberOfLines={2}>{p.name}</Text>
                <Text style={styles.smallCardPrice}>
                  {formatCurrency(p.price, p.currency)}/{p.unit}
                </Text>
                <TouchableOpacity
                  style={styles.smallAddBtn}
                  onPress={() => addToCart(p.id)}
                >
                  <Text style={styles.smallAddBtnText}>+ Add</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Categories from @ekda/shared */}
        <Text style={styles.sectionTitle}>Browse Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
        >
          {CATEGORIES.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={styles.categoryItem}
              onPress={() => {
                const tab = cat.href.includes("export") ? "exports" : "imports";
                onNavigate?.(tab) ?? router.push(cat.href as any);
              }}
            >
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryEmoji}>{cat.icon}</Text>
              </View>
              <Text style={styles.categoryLabel} numberOfLines={2}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Escrow explanation */}
        <View style={styles.escrowBanner}>
          <Text style={styles.escrowBannerTitle}>🔒 100% Escrow Protected</Text>
          <Text style={styles.escrowBannerText}>
            Your payment is held safely by EKDA.{"\n"}
            Released in 2 stages as your shipment progresses.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scroll: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 },
  greeting: { color: "rgba(255,255,255,0.6)", fontSize: 13 },
  username: { color: "#fff", fontSize: 20, fontWeight: "800" },
  cartBtn: { position: "relative", width: 44, height: 44, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  cartBtnEmoji: { fontSize: 20 },
  cartBadge: { position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: "#ef4444", alignItems: "center", justifyContent: "center" },
  cartBadgeText: { color: "#fff", fontSize: 9, fontWeight: "800" },
  searchHint: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "rgba(255,255,255,0.12)", borderRadius: 12, paddingHorizontal: 14, height: 44 },
  searchHintIcon: { fontSize: 16 },
  searchHintText: { color: "rgba(255,255,255,0.45)", fontSize: 14 },
  demoBanner: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#4c1d95", paddingHorizontal: 16, paddingVertical: 8 },
  demoBannerIcon: { fontSize: 14 },
  demoBannerText: { color: "rgba(255,255,255,0.8)", fontSize: 11, flex: 1 },
  statsRow: { flexDirection: "row", backgroundColor: "#fff", paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: "#f1f5f9" },
  statCard: { flex: 1, alignItems: "center", paddingVertical: 10 },
  statEmoji: { fontSize: 18, marginBottom: 2 },
  statValue: { fontSize: 13, fontWeight: "800", color: "#111827" },
  statLabel: { fontSize: 9, color: "#9ca3af", fontWeight: "500" },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#111827", paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 },
  marketRow: { flexDirection: "row", gap: 12, paddingHorizontal: 16 },
  marketCard: { flex: 1, borderRadius: 18, overflow: "hidden" },
  marketGradient: { padding: 16 },
  marketEmoji: { fontSize: 28, marginBottom: 8 },
  marketTitle: { color: "#fff", fontSize: 14, fontWeight: "800", marginBottom: 4 },
  marketSub: { color: "rgba(255,255,255,0.65)", fontSize: 10, lineHeight: 14 },
  trackCard: { marginHorizontal: 16, backgroundColor: "#fff", borderRadius: 16, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  trackHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  trackId: { fontFamily: "monospace", fontSize: 12, color: "#16a34a", fontWeight: "700" },
  trackStatusBadge: { backgroundColor: "#dbeafe", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100 },
  trackStatusText: { fontSize: 10, fontWeight: "700", color: "#1d4ed8", textTransform: "capitalize" },
  trackProduct: { fontSize: 13, fontWeight: "600", color: "#374151", marginBottom: 10 },
  trackProgress: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  trackProgressBar: { flex: 1, height: 6, backgroundColor: "#e5e7eb", borderRadius: 3 },
  trackProgressFill: { height: "100%", backgroundColor: "#16a34a", borderRadius: 3 },
  trackProgressText: { fontSize: 11, fontWeight: "700", color: "#16a34a" },
  trackCarrier: { fontSize: 11, color: "#9ca3af" },
  featuredScroll: { marginBottom: 4 },
  smallCard: { width: 150, backgroundColor: "#fff", borderRadius: 14, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2 },
  smallCardImg: { height: 90, alignItems: "center", justifyContent: "center" },
  smallCardEmoji: { fontSize: 38 },
  smallCardBody: { padding: 10 },
  smallCardName: { fontSize: 11, fontWeight: "700", color: "#111827", marginBottom: 4 },
  smallCardPrice: { fontSize: 12, fontWeight: "800", color: "#16a34a", marginBottom: 7 },
  smallAddBtn: { backgroundColor: "#16a34a", borderRadius: 8, paddingVertical: 6, alignItems: "center" },
  smallAddBtnText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  categoriesScroll: { marginBottom: 4 },
  categoryItem: { alignItems: "center", width: 70 },
  categoryIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: "#fff", alignItems: "center", justifyContent: "center", marginBottom: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  categoryEmoji: { fontSize: 26 },
  categoryLabel: { fontSize: 10, color: "#6b7280", fontWeight: "500", textAlign: "center" },
  escrowBanner: { margin: 16, backgroundColor: "#f0fdf4", borderRadius: 18, padding: 18, borderWidth: 1, borderColor: "#bbf7d0" },
  escrowBannerTitle: { fontSize: 15, fontWeight: "800", color: "#14532d", marginBottom: 6 },
  escrowBannerText: { fontSize: 12, color: "#15803d", lineHeight: 18 },
});
