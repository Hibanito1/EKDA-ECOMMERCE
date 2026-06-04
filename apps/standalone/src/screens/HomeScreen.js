import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EXPORT_PRODUCTS, IMPORT_PRODUCTS, MOCK_ORDERS, formatCurrency } from '../data/mockData';

const { width } = Dimensions.get('window');

const FEATURED_EXPORT = EXPORT_PRODUCTS.slice(0, 4);
const FEATURED_IMPORT = IMPORT_PRODUCTS.slice(0, 3);

function SmallCard({ product, onAdd, inCart }) {
  return (
    <View style={styles.smallCard}>
      <View style={[styles.smallCardImg, { backgroundColor: product.cargo === 'sea' ? '#f0fdf4' : '#eff6ff' }]}>
        <Text style={styles.smallCardEmoji}>{product.emoji}</Text>
        <View style={[styles.typeBadge, { backgroundColor: product.airRestricted ? '#fef3c7' : '#dcfce7' }]}>
          <Text style={styles.typeBadgeText}>{product.cargo === 'sea' ? '🚢' : '✈️'}</Text>
        </View>
      </View>
      <View style={styles.smallCardBody}>
        <Text style={styles.smallCardName} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.smallCardPrice}>{formatCurrency(product.price)}/{product.unit}</Text>
        <TouchableOpacity
          style={[styles.smallAddBtn, inCart && styles.smallAddBtnActive]}
          onPress={() => onAdd(product)}
        >
          <Text style={styles.smallAddBtnText}>{inCart ? `${inCart} ✓` : '+ Add'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function HomeScreen({ user, cart, onCartUpdate, onNavigate }) {
  const cartTotal = Object.values(cart).reduce((s, v) => s + v, 0);
  const allProducts = [...EXPORT_PRODUCTS, ...IMPORT_PRODUCTS];

  const addToCart = (product) => {
    onCartUpdate({ ...cart, [product.id]: (cart[product.id] || 0) + 1 });
  };

  const recentOrder = MOCK_ORDERS[0];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      {/* Welcome Header */}
      <LinearGradient colors={['#0a1628', '#0f2044', '#14532d']} style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good day 👋</Text>
            <Text style={styles.username}>{user.name}</Text>
          </View>
          <TouchableOpacity onPress={() => onNavigate('cart')} style={styles.cartBtn}>
            <Text style={styles.cartBtnEmoji}>🛒</Text>
            {cartTotal > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartTotal}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Search hint */}
        <TouchableOpacity style={styles.searchHint} onPress={() => onNavigate('exports')}>
          <Text style={styles.searchHintIcon}>🔍</Text>
          <Text style={styles.searchHintText}>Search crayfish, garri, cars, phones...</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Demo Mode Badge */}
      <View style={styles.demoBanner}>
        <Text style={styles.demoBannerIcon}>🎭</Text>
        <Text style={styles.demoBannerText}>Demo Mode — All data is simulated, no real payments</Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsRow}>
        {[
          { emoji: '📦', label: 'Active Orders', value: MOCK_ORDERS.filter(o => o.status !== 'delivered').length },
          { emoji: '💰', label: 'Wallet', value: formatCurrency(user.wallet) },
          { emoji: '⭐', label: 'Loyalty Pts', value: user.loyaltyPoints.toLocaleString() },
        ].map(stat => (
          <View key={stat.label} style={styles.statCard}>
            <Text style={styles.statEmoji}>{stat.emoji}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Two Marketplaces */}
      <Text style={styles.sectionTitle}>Two-Way Marketplace</Text>
      <View style={styles.marketRow}>
        <TouchableOpacity style={styles.marketCard} onPress={() => onNavigate('exports')}>
          <LinearGradient colors={['#166534', '#14532d']} style={styles.marketGradient}>
            <Text style={styles.marketEmoji}>🌿</Text>
            <Text style={styles.marketTitle}>African Exports</Text>
            <Text style={styles.marketSub}>Groceries, dried produce, agri commodities</Text>
            <Text style={styles.marketCount}>{EXPORT_PRODUCTS.length}+ products</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.marketCard} onPress={() => onNavigate('imports')}>
          <LinearGradient colors={['#1e3a5f', '#1e40af']} style={styles.marketGradient}>
            <Text style={styles.marketEmoji}>🌍</Text>
            <Text style={styles.marketTitle}>Global Imports</Text>
            <Text style={styles.marketSub}>Cars, electronics, machinery to Nigeria</Text>
            <Text style={styles.marketCount}>{IMPORT_PRODUCTS.length}+ listings</Text>
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
                <Text style={styles.trackStatusText}>{recentOrder.cargo === 'sea' ? '🚢' : '✈️'} {recentOrder.status.replace('_', ' ')}</Text>
              </View>
            </View>
            <Text style={styles.trackProduct}>{recentOrder.product}</Text>
            <View style={styles.trackProgress}>
              <View style={styles.trackProgressBar}>
                <View style={[styles.trackProgressFill, { width: `${recentOrder.progress}%` }]} />
              </View>
              <Text style={styles.trackProgressText}>{recentOrder.progress}%</Text>
            </View>
            <Text style={styles.trackCarrier}>Carrier: {recentOrder.carrier}</Text>
          </View>
        </>
      )}

      {/* Featured African Exports */}
      <Text style={styles.sectionTitle}>🌿 African Exports — Featured</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
        {FEATURED_EXPORT.map(p => (
          <SmallCard key={p.id} product={p} onAdd={addToCart} inCart={cart[p.id] || 0} />
        ))}
        <TouchableOpacity style={styles.seeMoreCard} onPress={() => onNavigate('exports')}>
          <Text style={styles.seeMoreText}>See All{'\n'}→</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Featured Imports */}
      <Text style={styles.sectionTitle}>🌍 Global Imports — Featured</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
        {FEATURED_IMPORT.map(p => (
          <SmallCard key={p.id} product={p} onAdd={addToCart} inCart={cart[p.id] || 0} />
        ))}
        <TouchableOpacity style={styles.seeMoreCard} onPress={() => onNavigate('imports')}>
          <Text style={styles.seeMoreText}>See All{'\n'}→</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Escrow Explanation */}
      <View style={styles.escrowBanner}>
        <Text style={styles.escrowBannerTitle}>🔒 100% Escrow Protected</Text>
        <Text style={styles.escrowBannerText}>
          Your payment is held safely by EKDA.{'\n'}
          Released in 2 stages as your shipment progresses.
        </Text>
        <View style={styles.escrowSteps}>
          {['Pay → Escrow held 🔒', 'Carrier picks up → 50% released 💸', 'Delivered → Final 50% released ✅'].map((s, i) => (
            <Text key={i} style={styles.escrowStep}>{s}</Text>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const CARD_W = (width - 44) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  greeting: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  username: { color: '#fff', fontSize: 20, fontWeight: '800' },
  cartBtn: { position: 'relative', width: 44, height: 44, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  cartBtnEmoji: { fontSize: 20 },
  cartBadge: { position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center' },
  cartBadgeText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  searchHint: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 12, paddingHorizontal: 14, height: 44 },
  searchHintIcon: { fontSize: 16 },
  searchHintText: { color: 'rgba(255,255,255,0.45)', fontSize: 14 },
  demoBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#4c1d95', paddingHorizontal: 16, paddingVertical: 8 },
  demoBannerIcon: { fontSize: 14 },
  demoBannerText: { color: 'rgba(255,255,255,0.8)', fontSize: 11, flex: 1 },
  statsRow: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 4, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 10 },
  statEmoji: { fontSize: 18, marginBottom: 2 },
  statValue: { fontSize: 13, fontWeight: '800', color: '#111827' },
  statLabel: { fontSize: 9, color: '#9ca3af', fontWeight: '500' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827', paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10 },
  marketRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 16 },
  marketCard: { flex: 1, borderRadius: 18, overflow: 'hidden' },
  marketGradient: { padding: 16 },
  marketEmoji: { fontSize: 28, marginBottom: 8 },
  marketTitle: { color: '#fff', fontSize: 14, fontWeight: '800', marginBottom: 4 },
  marketSub: { color: 'rgba(255,255,255,0.65)', fontSize: 10, lineHeight: 14, marginBottom: 8 },
  marketCount: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },
  trackCard: { marginHorizontal: 16, backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  trackHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  trackId: { fontFamily: 'monospace', fontSize: 12, color: '#16a34a', fontWeight: '700' },
  trackStatusBadge: { backgroundColor: '#dbeafe', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100 },
  trackStatusText: { fontSize: 10, fontWeight: '700', color: '#1d4ed8', textTransform: 'capitalize' },
  trackProduct: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 10 },
  trackProgress: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  trackProgressBar: { flex: 1, height: 6, backgroundColor: '#e5e7eb', borderRadius: 3 },
  trackProgressFill: { height: '100%', backgroundColor: '#16a34a', borderRadius: 3 },
  trackProgressText: { fontSize: 11, fontWeight: '700', color: '#16a34a' },
  trackCarrier: { fontSize: 11, color: '#9ca3af' },
  featuredScroll: { marginBottom: 4 },
  smallCard: { width: 150, backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2 },
  smallCardImg: { height: 90, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  smallCardEmoji: { fontSize: 38 },
  typeBadge: { position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  typeBadgeText: { fontSize: 11 },
  smallCardBody: { padding: 10 },
  smallCardName: { fontSize: 11, fontWeight: '700', color: '#111827', marginBottom: 4 },
  smallCardPrice: { fontSize: 12, fontWeight: '800', color: '#16a34a', marginBottom: 7 },
  smallAddBtn: { backgroundColor: '#16a34a', borderRadius: 8, paddingVertical: 6, alignItems: 'center' },
  smallAddBtnActive: { backgroundColor: '#0f2044' },
  smallAddBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  seeMoreCard: { width: 80, backgroundColor: '#f3f4f6', borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  seeMoreText: { color: '#16a34a', fontSize: 13, fontWeight: '700', textAlign: 'center' },
  escrowBanner: { margin: 16, backgroundColor: '#f0fdf4', borderRadius: 18, padding: 18, borderWidth: 1, borderColor: '#bbf7d0' },
  escrowBannerTitle: { fontSize: 15, fontWeight: '800', color: '#14532d', marginBottom: 6 },
  escrowBannerText: { fontSize: 12, color: '#15803d', lineHeight: 18, marginBottom: 12 },
  escrowSteps: { gap: 6 },
  escrowStep: { fontSize: 12, color: '#166534', lineHeight: 18 },
});
