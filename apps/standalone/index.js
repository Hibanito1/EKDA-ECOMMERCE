import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MarketplaceScreen from './src/screens/MarketplaceScreen';
import CartScreen from './src/screens/CartScreen';
import AIScreen from './src/screens/AIScreen';
import AccountScreen from './src/screens/AccountScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ label, emoji, focused, badge }) {
  return (
    <View style={[tabStyles.icon, focused && tabStyles.iconActive]}>
      <Text style={tabStyles.emoji}>{emoji}</Text>
      <Text style={[tabStyles.label, focused && tabStyles.labelActive]}>{label}</Text>
      {badge > 0 && (
        <View style={tabStyles.badge}>
          <Text style={tabStyles.badgeText}>{badge}</Text>
        </View>
      )}
    </View>
  );
}

const tabStyles = StyleSheet.create({
  icon: { alignItems: 'center', gap: 1, paddingHorizontal: 6, paddingVertical: 3, borderRadius: 10, minWidth: 50, position: 'relative' },
  iconActive: { backgroundColor: 'rgba(22,163,74,0.1)' },
  emoji: { fontSize: 20 },
  label: { fontSize: 9, fontWeight: '600', color: '#9ca3af' },
  labelActive: { color: '#16a34a', fontWeight: '700' },
  badge: { position: 'absolute', top: -2, right: 4, width: 16, height: 16, borderRadius: 8, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#fff', fontSize: 8, fontWeight: '800' },
});

export default function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({});
  const [activeTab, setActiveTab] = useState('home');

  const cartCount = Object.values(cart).reduce((s, v) => s + v, 0);

  const handleLogin = useCallback((userData) => {
    setUser(userData);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setCart({});
  }, []);

  if (!user) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <LoginScreen onLogin={handleLogin} />
      </SafeAreaProvider>
    );
  }

  // Simple custom tab navigator (avoids React Navigation complexity)
  const screens = {
    home: <HomeScreen user={user} cart={cart} onCartUpdate={setCart} onNavigate={setActiveTab} />,
    exports: <MarketplaceScreen type="export" cart={cart} onCartUpdate={setCart} user={user} />,
    imports: <MarketplaceScreen type="import" cart={cart} onCartUpdate={setCart} user={user} />,
    cart: <CartScreen cart={cart} onCartUpdate={setCart} user={user} />,
    ai: <AIScreen />,
    account: <AccountScreen user={user} onLogout={handleLogout} />,
  };

  const tabs = [
    { key: 'home', label: 'Home', emoji: '🏠' },
    { key: 'exports', label: 'Exports', emoji: '🌿' },
    { key: 'imports', label: 'Imports', emoji: '🌍' },
    { key: 'cart', label: 'Cart', emoji: '🛒', badge: cartCount },
    { key: 'ai', label: 'AI', emoji: '🤖' },
    { key: 'account', label: 'Account', emoji: '👤' },
  ];

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }} edges={['top']}>
        {/* Screen Content */}
        <View style={{ flex: 1 }}>
          {screens[activeTab]}
        </View>

        {/* Bottom Tab Bar */}
        <View style={styles.tabBar}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabItem}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <TabIcon
                label={tab.label}
                emoji={tab.emoji}
                focused={activeTab === tab.key}
                badge={tab.badge || 0}
              />
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 24 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
