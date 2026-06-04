import { MOCK_ORDERS, MOCK_NOTIFICATIONS, LOYALTY_TIERS, getLoyaltyTier } from "@ekda/demo";
import { formatCurrency } from "@ekda/shared";
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
import { LinearGradient } from "expo-linear-gradient";

const MENU_ITEMS = [
  { icon: "📦", label: "My Orders", href: "/orders", count: "3 active" },
  { icon: "🚢", label: "Track Shipments", href: "/track", count: null },
  { icon: "❤️", label: "Wishlist", href: "/wishlist", count: "12 items" },
  { icon: "📍", label: "Saved Addresses", href: "/addresses", count: null },
  { icon: "💰", label: "Wallet", href: "/wallet", count: "₦42,000" },
  { icon: "🔔", label: "Notifications", href: "/notifications", count: "5 new" },
  { icon: "📄", label: "Documents", href: "/documents", count: null },
  { icon: "⭐", label: "Reviews & Ratings", href: "/reviews", count: null },
  { icon: "🎯", label: "Dispute Center", href: "/disputes", count: null },
  { icon: "⚙️", label: "Settings", href: "/settings", count: null },
];

export default function AccountTab() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Profile Header */}
        <LinearGradient colors={["#0a1628", "#14532d"]} style={styles.profileHeader}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AO</Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          </View>
          <Text style={styles.profileName}>Adaeze Okonkwo</Text>
          <Text style={styles.profileEmail}>adaeze@example.com</Text>
          <View style={styles.profileBadge}>
            <Text style={styles.profileBadgeText}>🛍️ Customer</Text>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: "Orders", value: "24" },
            { label: "Reviews", value: "18" },
            { label: "Saved", value: "12" },
          ].map((stat) => (
            <View key={stat.label} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Wallet Card */}
        <TouchableOpacity style={styles.walletCard}>
          <LinearGradient
            colors={["#f59e0b", "#d97706"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.walletGradient}
          >
            <View>
              <Text style={styles.walletLabel}>EKDA Wallet</Text>
              <Text style={styles.walletBalance}>₦42,000</Text>
              <Text style={styles.walletSub}>Available Balance</Text>
            </View>
            <Text style={styles.walletIcon}>💳</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Menu */}
        <View style={styles.menu}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity key={item.label} style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuItemIcon}>{item.icon}</Text>
                <Text style={styles.menuItemLabel}>{item.label}</Text>
              </View>
              <View style={styles.menuItemRight}>
                {item.count && (
                  <Text style={styles.menuItemCount}>{item.count}</Text>
                )}
                <Text style={styles.menuItemArrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={() => router.replace("/(auth)/welcome")}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  profileHeader: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 28, alignItems: "center" },
  avatarWrapper: { position: "relative", marginBottom: 12 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  avatarText: { color: "#fff", fontSize: 24, fontWeight: "800" },
  verifiedBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#22c55e",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#14532d",
  },
  verifiedText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  profileName: { color: "#fff", fontSize: 20, fontWeight: "800", marginBottom: 3 },
  profileEmail: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 12 },
  profileBadge: {
    backgroundColor: "rgba(255,255,255,0.15)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 100,
  },
  profileBadgeText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 16 },
  statValue: { fontSize: 20, fontWeight: "800", color: "#111827" },
  statLabel: { fontSize: 11, color: "#9ca3af", fontWeight: "500" },
  walletCard: { margin: 16, borderRadius: 16, overflow: "hidden" },
  walletGradient: { padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  walletLabel: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginBottom: 4 },
  walletBalance: { color: "#fff", fontSize: 26, fontWeight: "800" },
  walletSub: { color: "rgba(255,255,255,0.6)", fontSize: 11, marginTop: 2 },
  walletIcon: { fontSize: 40 },
  menu: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f9fafb",
  },
  menuItemLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuItemIcon: { fontSize: 20, width: 28, textAlign: "center" },
  menuItemLabel: { fontSize: 15, fontWeight: "500", color: "#111827" },
  menuItemRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  menuItemCount: { fontSize: 12, color: "#16a34a", fontWeight: "600" },
  menuItemArrow: { fontSize: 20, color: "#d1d5db", fontWeight: "300" },
  signOutButton: {
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fee2e2",
  },
  signOutText: { color: "#ef4444", fontSize: 15, fontWeight: "700" },
});
