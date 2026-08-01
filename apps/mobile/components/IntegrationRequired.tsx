import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

interface IntegrationRequiredProps {
  title: string;
  badge: string;
  description: string;
  requirements: string[];
}

export function IntegrationRequired({
  title,
  badge,
  description,
  requirements,
}: IntegrationRequiredProps) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={["#0a1628", "#14532d"]} style={styles.header}>
        <Text style={styles.badge}>{badge}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Real integration required</Text>
        {requirements.map((item) => (
          <View key={item} style={styles.requirementRow}>
            <Text style={styles.bullet}>-</Text>
            <Text style={styles.requirementText}>{item}</Text>
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  badge: {
    alignSelf: "flex-start",
    color: "#86efac",
    fontSize: 12,
    fontWeight: "700",
    backgroundColor: "rgba(34,197,94,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    overflow: "hidden",
    marginBottom: 12,
  },
  title: { color: "#fff", fontSize: 24, fontWeight: "800", marginBottom: 10 },
  description: { color: "rgba(255,255,255,0.72)", fontSize: 14, lineHeight: 21 },
  card: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTitle: { color: "#111827", fontSize: 17, fontWeight: "800", marginBottom: 12 },
  requirementRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  bullet: { color: "#16a34a", fontSize: 14, fontWeight: "800" },
  requirementText: { flex: 1, color: "#4b5563", fontSize: 13, lineHeight: 19 },
});
