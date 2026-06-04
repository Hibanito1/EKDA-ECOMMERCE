import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, FlatList, Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EXPORT_PRODUCTS, IMPORT_PRODUCTS, formatCurrency } from '../data/mockData';

const { width } = Dimensions.get('window');

const CATEGORIES_EXPORT = ['All', 'Groceries', 'Dried Produce', 'Frozen Produce', 'Agri Commodities'];
const CATEGORIES_IMPORT = ['All', 'Vehicles', 'Electronics', 'Machinery', 'General Goods'];

function ProductCard({ item, onAdd, cartCount }) {
  return (
    <View style={styles.card}>
      <View style={[styles.cardImg, item.airRestricted && styles.cardImgRestricted]}>
        <Text style={styles.cardEmoji}>{item.emoji}</Text>
        {item.airRestricted && (
          <View style={styles.restrictedBadge}>
            <Text style={styles.restrictedText}>⚠️ Sea Only</Text>
          </View>
        )}
        <View style={styles.cargoBadge}>
          <Text style={styles.cargoText}>{item.cargo === 'sea' ? '🚢' : '✈️'}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardCategory}>{item.category}</Text>
        <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.cardVendor}>{item.vendor}</Text>
        <View style={styles.hsRow}>
          <Text style={styles.hsLabel}>HS: </Text>
          <Text style={styles.hsCode}>{item.hsCode}</Text>
          <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>🤖 AI</Text></View>
        </View>
        <View style={styles.ratingRow}>
          <Text style={styles.star}>⭐</Text>
          <Text style={styles.ratingVal}>{item.rating}</Text>
          <Text style={styles.ratingCount}>({item.reviews.toLocaleString()})</Text>
        </View>
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.price}>{formatCurrency(item.price)}</Text>
            <Text style={styles.unit}>per {item.unit}</Text>
          </View>
          <TouchableOpacity
            style={[styles.addBtn, cartCount > 0 && styles.addBtnActive]}
            onPress={() => onAdd(item)}
          >
            <Text style={styles.addBtnText}>{cartCount > 0 ? `${cartCount} ✓` : '+ Add'}</Text>
          </TouchableOpacity>
        </View>
        {item.duty && (
          <Text style={styles.dutyBadge}>Import Duty: {item.duty}</Text>
        )}
      </View>
    </View>
  );
}

export default function MarketplaceScreen({ type = 'export', cart, onCartUpdate }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const isExport = type === 'export';
  const products = isExport ? EXPORT_PRODUCTS : IMPORT_PRODUCTS;
  const categories = isExport ? CATEGORIES_EXPORT : CATEGORIES_IMPORT;

  const filtered = products.filter(p => {
    const matchCat = category === 'All' || p.category === category;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.vendor.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const getCartCount = (id) => (cart[id] || 0);

  const handleAdd = (item) => {
    onCartUpdate({ ...cart, [item.id]: (cart[item.id] || 0) + 1 });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={isExport ? ['#166534', '#14532d'] : ['#1e3a5f', '#1e40af']}
        style={styles.header}
      >
        <Text style={styles.headerBadge}>{isExport ? '🌿 African Exports' : '🌍 Global Imports'}</Text>
        <Text style={styles.headerTitle}>{isExport ? 'Authentic African Products' : 'Import to Nigeria'}</Text>
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={isExport ? 'crayfish, garri, palm oil...' : 'Toyota, iPhone, crane...'}
            placeholderTextColor="rgba(255,255,255,0.45)"
            value={search}
            onChangeText={setSearch}
          />
          {search ? <TouchableOpacity onPress={() => setSearch('')}><Text style={{ color: '#fff', fontSize: 18 }}>×</Text></TouchableOpacity> : null}
        </View>
      </LinearGradient>

      {/* Category Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catContent}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.catPill, category === cat && styles.catPillActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.catText, category === cat && styles.catTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Count */}
      <Text style={styles.resultCount}>{filtered.length} products</Text>

      {/* Products */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onAdd={handleAdd}
            cartCount={getCartCount(item.id)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No products found</Text>
          </View>
        }
      />
    </View>
  );
}

const CARD_W = (width - 36) / 2;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },
  headerBadge: {
    color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600',
    backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 100, alignSelf: 'flex-start', marginBottom: 6, overflow: 'hidden',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '800', marginBottom: 12 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, paddingHorizontal: 12, height: 42,
  },
  searchIcon: { fontSize: 15 },
  searchInput: { flex: 1, color: '#fff', fontSize: 14 },
  catScroll: { backgroundColor: '#fff', maxHeight: 48, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  catContent: { paddingHorizontal: 12, alignItems: 'center', gap: 8 },
  catPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 100, backgroundColor: '#f3f4f6' },
  catPillActive: { backgroundColor: '#16a34a' },
  catText: { fontSize: 12, fontWeight: '600', color: '#6b7280' },
  catTextActive: { color: '#fff' },
  resultCount: { fontSize: 11, color: '#9ca3af', paddingHorizontal: 12, paddingTop: 8, paddingBottom: 4 },
  grid: { padding: 12, paddingBottom: 80 },
  row: { gap: 12 },
  card: {
    width: CARD_W, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden',
    marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  cardImg: { height: 100, backgroundColor: '#f0fdf4', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  cardImgRestricted: { backgroundColor: '#fff7ed' },
  cardEmoji: { fontSize: 44 },
  restrictedBadge: { position: 'absolute', top: 6, left: 6, backgroundColor: '#fef3c7', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 6 },
  restrictedText: { fontSize: 8, fontWeight: '700', color: '#92400e' },
  cargoBadge: { position: 'absolute', bottom: 6, right: 6, backgroundColor: 'rgba(0,0,0,0.1)', width: 24, height: 24, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  cargoText: { fontSize: 11 },
  cardBody: { padding: 10 },
  cardCategory: { fontSize: 9, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 2 },
  cardName: { fontSize: 12, fontWeight: '700', color: '#111827', marginBottom: 2 },
  cardVendor: { fontSize: 10, color: '#9ca3af', marginBottom: 5 },
  hsRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginBottom: 4 },
  hsLabel: { fontSize: 9, color: '#9ca3af' },
  hsCode: { fontSize: 9, fontWeight: '700', color: '#374151', fontFamily: 'monospace' },
  aiBadge: { backgroundColor: '#fef3c7', paddingHorizontal: 4, paddingVertical: 1, borderRadius: 4 },
  aiBadgeText: { fontSize: 8, fontWeight: '700', color: '#d97706' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2, marginBottom: 7 },
  star: { fontSize: 10 },
  ratingVal: { fontSize: 11, fontWeight: '700', color: '#111827' },
  ratingCount: { fontSize: 9, color: '#9ca3af' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  price: { fontSize: 13, fontWeight: '800', color: '#16a34a' },
  unit: { fontSize: 9, color: '#9ca3af' },
  addBtn: { backgroundColor: '#16a34a', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10 },
  addBtnActive: { backgroundColor: '#0f2044' },
  addBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  dutyBadge: { marginTop: 5, fontSize: 9, color: '#dc2626', fontWeight: '600', backgroundColor: '#fee2e2', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 5, alignSelf: 'flex-start' },
  empty: { alignItems: 'center', paddingTop: 40 },
  emptyEmoji: { fontSize: 40, marginBottom: 10 },
  emptyText: { color: '#9ca3af', fontSize: 14 },
});
