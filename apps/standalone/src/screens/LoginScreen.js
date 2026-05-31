import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { DEMO_USERS } from '../data/mockData';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Fields', 'Please enter email and password.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const user = DEMO_USERS.find(u => u.email === email && u.password === password);
    setLoading(false);
    if (user) {
      onLogin(user);
    } else {
      Alert.alert('Invalid Credentials', 'Use a demo account below.\nPassword: Demo@12345');
    }
  };

  const quickLogin = (user) => {
    setEmail(user.email);
    setPassword(user.password);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar style="light" />
      <LinearGradient colors={['#0a1628', '#0f2044', '#14532d']} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Logo */}
          <View style={styles.logoSection}>
            <View style={styles.logoBox}>
              <Text style={styles.logoLetter}>E</Text>
            </View>
            <Text style={styles.logoTitle}>EKDA</Text>
            <Text style={styles.logoSubtitle}>Africa's Cross-Border Marketplace</Text>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Welcome Back</Text>
            <Text style={styles.formSubtitle}>Sign in to continue</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="your@email.com"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.passwordRow}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0 }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Demo@12345"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Text style={styles.eyeText}>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.loginBtn, loading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={loading}
            >
              <LinearGradient colors={['#16a34a', '#15803d']} style={styles.loginGradient}>
                <Text style={styles.loginBtnText}>{loading ? 'Signing in...' : 'Sign In →'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Quick Login */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>🎭 Demo Accounts (tap to fill)</Text>
            <Text style={styles.demoSubtitle}>Password: Demo@12345</Text>
            <View style={styles.demoGrid}>
              {DEMO_USERS.map(user => (
                <TouchableOpacity
                  key={user.id}
                  style={[styles.demoChip, email === user.email && styles.demoChipActive]}
                  onPress={() => quickLogin(user)}
                >
                  <Text style={styles.demoChipIcon}>
                    {user.role === 'admin' ? '⚡' : user.role === 'vendor' ? '🏪' : '🛍️'}
                  </Text>
                  <Text style={styles.demoChipText}>{user.role}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Text style={styles.disclaimer}>
            🔒 Demo mode — no real payments or data
          </Text>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  logoSection: { alignItems: 'center', marginBottom: 32 },
  logoBox: {
    width: 64, height: 64, borderRadius: 18,
    backgroundColor: '#16a34a',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12, shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  logoLetter: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  logoTitle: { color: '#fff', fontSize: 28, fontWeight: 'bold', letterSpacing: 2 },
  logoSubtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 13, marginTop: 4 },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24, padding: 24, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3, shadowRadius: 20, elevation: 10,
  },
  formTitle: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  formSubtitle: { fontSize: 14, color: '#6b7280', marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6 },
  input: {
    height: 48, borderWidth: 1.5, borderColor: '#e5e7eb',
    borderRadius: 12, paddingHorizontal: 14, fontSize: 15,
    color: '#111827', backgroundColor: '#f9fafb',
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, backgroundColor: '#f9fafb', paddingRight: 12 },
  eyeBtn: { padding: 8 },
  eyeText: { fontSize: 16 },
  loginBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 8, shadowColor: '#16a34a', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  loginGradient: { paddingVertical: 16, alignItems: 'center' },
  loginBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  demoSection: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20, padding: 16, marginBottom: 16,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  demoTitle: { color: '#fbbf24', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  demoSubtitle: { color: 'rgba(255,255,255,0.5)', fontSize: 11, marginBottom: 10 },
  demoGrid: { flexDirection: 'row', gap: 8 },
  demoChip: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10, paddingVertical: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  demoChipActive: { backgroundColor: 'rgba(22,163,74,0.3)', borderColor: '#16a34a' },
  demoChipIcon: { fontSize: 16 },
  demoChipText: { color: '#fff', fontSize: 11, fontWeight: '600', textTransform: 'capitalize' },
  disclaimer: { color: 'rgba(255,255,255,0.3)', textAlign: 'center', fontSize: 11 },
});
