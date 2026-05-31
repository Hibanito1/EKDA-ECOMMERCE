import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    // Simulate auth
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    router.replace("/(tabs)");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar style="dark" />
      <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoRow}>
            <View style={styles.logoBox}>
              <Text style={styles.logoLetter}>E</Text>
            </View>
            <Text style={styles.logoText}>EKDA</Text>
          </View>

          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your EKDA account</Text>

          {/* Google Button */}
          <TouchableOpacity style={styles.googleButton} activeOpacity={0.8}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  placeholder="Your password"
                  placeholderTextColor="#9ca3af"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeText}>{showPassword ? "🙈" : "👁️"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.signInButton, loading && styles.loadingButton]}
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={loading}
          >
            <LinearGradient
              colors={["#16a34a", "#15803d"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.signInGradient}
            >
              <Text style={styles.signInText}>
                {loading ? "Signing in..." : "Sign In"}
              </Text>
              {!loading && <Text style={styles.signInArrow}>→</Text>}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Don&apos;t have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.registerLink}>Create account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { paddingHorizontal: 24, paddingVertical: 20 },
  backButton: { marginBottom: 24 },
  backButtonText: { color: "#6b7280", fontSize: 15 },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 32 },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#16a34a",
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  logoText: { color: "#0a1628", fontSize: 20, fontWeight: "bold" },
  title: { fontSize: 28, fontWeight: "800", color: "#111827", marginBottom: 6 },
  subtitle: { fontSize: 15, color: "#6b7280", marginBottom: 28 },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    paddingVertical: 14,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  googleIcon: { fontSize: 18, fontWeight: "bold", color: "#4285F4" },
  googleText: { fontSize: 15, fontWeight: "600", color: "#374151" },
  divider: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e5e7eb" },
  dividerText: { color: "#9ca3af", fontSize: 12, textTransform: "uppercase" },
  form: { gap: 16, marginBottom: 8 },
  inputGroup: { gap: 6 },
  label: { fontSize: 14, fontWeight: "600", color: "#374151" },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 15,
    color: "#111827",
    backgroundColor: "#f9fafb",
    marginBottom: 0,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    paddingRight: 12,
  },
  eyeButton: { padding: 8 },
  eyeText: { fontSize: 16 },
  forgotPassword: { alignSelf: "flex-end", marginBottom: 24 },
  forgotPasswordText: { color: "#16a34a", fontSize: 14, fontWeight: "500" },
  signInButton: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  loadingButton: { opacity: 0.7 },
  signInGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    gap: 8,
  },
  signInText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  signInArrow: { color: "#fff", fontSize: 16 },
  registerRow: { flexDirection: "row", justifyContent: "center" },
  registerText: { color: "#6b7280", fontSize: 14 },
  registerLink: { color: "#16a34a", fontSize: 14, fontWeight: "600" },
});
