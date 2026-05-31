import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

const { width, height } = Dimensions.get("window");

const FEATURES = [
  { icon: "🛡️", text: "Escrow Protected Payments" },
  { icon: "🤖", text: "AI HS Code Automation" },
  { icon: "🚢", text: "Global Carrier Network" },
  { icon: "💱", text: "Multi-Currency Support" },
];

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#0a1628", "#0f2044", "#14532d"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Decorative elements */}
      <View style={[styles.circle, styles.circleTop]} />
      <View style={[styles.circle, styles.circleBottom]} />

      <SafeAreaView style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Text style={styles.logoLetter}>E</Text>
          </View>
          <Text style={styles.logoText}>EKDA</Text>
        </View>

        {/* Hero Text */}
        <View style={styles.heroSection}>
          <View style={styles.tagBadge}>
            <View style={styles.tagDot} />
            <Text style={styles.tagText}>Africa's #1 Cross-Border Marketplace</Text>
          </View>

          <Text style={styles.heroTitle}>
            Export African{"\n"}
            <Text style={styles.heroGreen}>Excellence.</Text>
            {"\n"}Import Global{"\n"}
            <Text style={styles.heroGold}>Innovation.</Text>
          </Text>

          <Text style={styles.heroSubtitle}>
            Shop African groceries, dried produce, and commodities worldwide.
            Import cars, electronics & machinery to Nigeria.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          {FEATURES.map((feature) => (
            <View key={feature.text} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>

        {/* CTA Buttons */}
        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/(auth)/register")}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#16a34a", "#15803d"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryGradient}
            >
              <Text style={styles.primaryButtonText}>Get Started Free</Text>
              <Text style={styles.primaryButtonArrow}>→</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push("/(auth)/login")}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryButtonText}>I already have an account</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>© 2025 EKDA Technologies Ltd.</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a1628",
  },
  circle: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.08,
  },
  circleTop: {
    width: 400,
    height: 400,
    backgroundColor: "#22c55e",
    top: -100,
    right: -100,
  },
  circleBottom: {
    width: 300,
    height: 300,
    backgroundColor: "#f59e0b",
    bottom: -50,
    left: -80,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 40,
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },
  logoText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  heroSection: {
    flex: 1,
    justifyContent: "center",
  },
  tagBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(34,197,94,0.15)",
    borderColor: "rgba(34,197,94,0.3)",
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4ade80",
  },
  tagText: {
    color: "#86efac",
    fontSize: 12,
    fontWeight: "600",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "800",
    lineHeight: 46,
    marginBottom: 16,
  },
  heroGreen: {
    color: "#4ade80",
  },
  heroGold: {
    color: "#fbbf24",
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 15,
    lineHeight: 22,
  },
  features: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.07)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
  },
  featureIcon: {
    fontSize: 14,
  },
  featureText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    fontWeight: "500",
  },
  ctaSection: {
    gap: 12,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  primaryButtonArrow: {
    color: "#fff",
    fontSize: 18,
  },
  secondaryButton: {
    alignItems: "center",
    paddingVertical: 16,
  },
  secondaryButtonText: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 15,
    fontWeight: "500",
  },
  footer: {
    color: "rgba(255,255,255,0.2)",
    fontSize: 11,
    textAlign: "center",
    marginTop: 16,
  },
});
