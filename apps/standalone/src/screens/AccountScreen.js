import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MOCK_ORDERS, MOCK_NOTIFICATIONS, LOYALTY_TIERS, formatCurrency } from '../data/mockData';

// ─── Orders Tab ───────────────────────────────────────────────────────────────

function OrdersTab({ user }) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statusColors = {
    in_transit: '#3b82f6',
    picked_up: '#f59e0b',
    delivered: '#16a34a',
    pending: '#9ca3af',
  };

  if (selectedOrder) {
    const order = MOCK_ORDERS.find(o => o.id === selectedOrder);
    return (
      <ScrollView style={styles.orderDetail} contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <TouchableOpacity onPress={() => setSelectedOrder(null)} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back to Orders</Text>
        </TouchableOpacity>

        <View style={styles.orderDetailCard}>
          <Text style={styles.orderDetailId}>{order.id}</Text>
          <Text style={styles.orderDetailProduct}>{order.product}</Text>
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Amount</Text>
            <Text style={styles.orderDetailVal}>{formatCurrency(order.amount)}</Text>
          </View>
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Carrier</Text>
            <Text style={styles.orderDetailVal}>{order.carrier}</Text>
          </View>
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Cargo</Text>
            <Text style={styles.orderDetailVal}>{order.cargo === 'sea' ? '🚢 Sea Freight' : order.cargo === 'air' ? '✈️ Air Freight' : '🚛 Road'}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Shipment Progress</Text>
            <Text style={styles.progressPct}>{order.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${order.progress}%` }]} />
          </View>
        </View>

        {/* Milestones */}
        <Text style={styles.milestonesTitle}>Tracking Milestones</Text>
        {order.milestones.map((m, i) => (
          <View key={i} style={styles.milestone}>
            <View style={[styles.milestoneDot, m.done && styles.milestoneDotDone]}>
              {m.done && <Text style={{ color: '#fff', fontSize: 10 }}>✓</Text>}
            </View>
            {i < order.milestones.length - 1 && <View style={[styles.milestoneLine, m.done && styles.milestoneLineDone]} />}
            <View style={styles.milestoneContent}>
              <Text style={[styles.milestoneLabel, !m.done && styles.milestoneLabelPending]}>{m.label}</Text>
              <Text style={styles.milestoneTime}>{m.time}</Text>
            </View>
          </View>
        ))}

        {/* Escrow */}
        <Text style={styles.milestonesTitle}>Escrow Breakdown</Text>
        <View style={styles.escrowCard}>
          {order.escrowStages.map((s, i) => (
            <View key={i} style={styles.escrowItem}>
              <Text style={styles.escrowItemLabel}>{s.label}</Text>
              <View style={styles.escrowItemRight}>
                <Text style={[styles.escrowItemAmt, s.released && { color: '#16a34a' }]}>{formatCurrency(s.amount)}</Text>
                <View style={[styles.escrowStatus, s.released ? styles.escrowReleased : styles.escrowHeld]}>
                  <Text style={[styles.escrowStatusText, s.released && { color: '#16a34a' }]}>{s.released ? '✅ Released' : '🔒 Held'}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
      {MOCK_ORDERS.map(order => (
        <TouchableOpacity key={order.id} style={styles.orderCard} onPress={() => setSelectedOrder(order.id)}>
          <View style={styles.orderCardHeader}>
            <Text style={styles.orderCardId}>{order.id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusColors[order.status] + '20' }]}>
              <Text style={[styles.statusText, { color: statusColors[order.status] }]}>
                {order.status.replace('_', ' ')}
              </Text>
            </View>
          </View>
          <Text style={styles.orderCardProduct} numberOfLines={1}>{order.product}</Text>
          <View style={styles.orderCardFooter}>
            <Text style={styles.orderCardAmt}>{formatCurrency(order.amount)}</Text>
            <View style={styles.progressMini}>
              <View style={[styles.progressMiniFill, { width: `${order.progress}%` }]} />
            </View>
            <Text style={styles.orderCardArrow}>›</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ─── Notifications Tab ────────────────────────────────────────────────────────

function NotificationsTab() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFICATIONS);
  const markRead = (id) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
      {unreadCount > 0 && (
        <TouchableOpacity style={styles.markAllRead} onPress={() => setNotifs(prev => prev.map(n => ({ ...n, read: true })))}>
          <Text style={styles.markAllReadText}>Mark all as read ({unreadCount})</Text>
        </TouchableOpacity>
      )}
      {notifs.map(notif => (
        <TouchableOpacity
          key={notif.id}
          style={[styles.notifCard, !notif.read && styles.notifCardUnread]}
          onPress={() => markRead(notif.id)}
        >
          <Text style={styles.notifEmoji}>{notif.emoji}</Text>
          <View style={styles.notifContent}>
            <Text style={styles.notifTitle}>{notif.title}</Text>
            <Text style={styles.notifMessage} numberOfLines={2}>{notif.message}</Text>
            <Text style={styles.notifTime}>{notif.time}</Text>
          </View>
          {!notif.read && <View style={styles.unreadDot} />}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// ─── Main Account Screen ──────────────────────────────────────────────────────

export default function AccountScreen({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('orders');
  const tier = user.loyaltyTier;
  const tierInfo = LOYALTY_TIERS[tier];

  const menuItems = [
    { icon: '📦', label: 'My Orders', tab: 'orders' },
    { icon: '🔔', label: 'Notifications', tab: 'notifications' },
    { icon: '⭐', label: 'Loyalty & Rewards', tab: 'loyalty' },
    { icon: '📋', label: 'AI HS Code Tool', tab: null, onPress: null },
    { icon: '🔒', label: 'Privacy Settings', tab: null },
    { icon: '❓', label: 'Help & Support', tab: null },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Profile Header */}
      <LinearGradient colors={['#0a1628', '#14532d']} style={styles.profileHeader}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.avatar}</Text>
          </View>
          <View style={styles.verifiedBadge}><Text style={{ color: '#fff', fontSize: 8 }}>✓</Text></View>
        </View>
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
        <View style={styles.profileRoleBadge}>
          <Text style={styles.profileRoleText}>
            {user.role === 'admin' ? '⚡' : user.role === 'vendor' ? '🏪' : '🛍️'} {user.role}
          </Text>
        </View>
      </LinearGradient>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Orders', value: user.orders },
          { label: 'Wallet', value: formatCurrency(user.wallet) },
          { label: 'Points', value: user.loyaltyPoints.toLocaleString() },
        ].map(stat => (
          <View key={stat.label} style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Loyalty Card */}
      <View style={styles.loyaltyCard}>
        <LinearGradient
          colors={tier === 'Gold' ? ['#92400e', '#d97706'] : tier === 'Silver' ? ['#374151', '#6b7280'] : tier === 'Platinum' ? ['#312e81', '#6366f1'] : ['#7c2d12', '#b45309']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.loyaltyGradient}
        >
          <View style={styles.loyaltyLeft}>
            <Text style={styles.loyaltyTier}>{tierInfo?.icon} {tier} Member</Text>
            <Text style={styles.loyaltyPoints}>{user.loyaltyPoints.toLocaleString()} pts</Text>
          </View>
          <View style={styles.loyaltyRight}>
            <Text style={styles.loyaltyMultiplier}>{tierInfo?.multiplier}x</Text>
            <Text style={styles.loyaltyMultiplierLabel}>points</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {['orders', 'notifications', 'loyalty'].map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'orders' ? '📦 Orders' : tab === 'notifications' ? '🔔 Alerts' : '⭐ Loyalty'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'orders' && <OrdersTab user={user} />}
      {activeTab === 'notifications' && <NotificationsTab />}
      {activeTab === 'loyalty' && (
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
          <Text style={styles.loyaltyHeader}>Your Tier Benefits</Text>
          {Object.entries(LOYALTY_TIERS).map(([name, info]) => (
            <View key={name} style={[styles.tierCard, tier === name && styles.tierCardActive]}>
              <Text style={styles.tierIcon}>{info.icon}</Text>
              <View style={styles.tierInfo}>
                <Text style={styles.tierName}>{name}</Text>
                <Text style={styles.tierMin}>{info.min.toLocaleString()}+ points</Text>
                <Text style={styles.tierMultiplier}>{info.multiplier}x point multiplier</Text>
              </View>
              {tier === name && <View style={styles.currentBadge}><Text style={styles.currentBadgeText}>Current</Text></View>}
            </View>
          ))}
          <TouchableOpacity style={styles.signOutBtn} onPress={onLogout}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  profileHeader: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, alignItems: 'center' },
  avatarWrap: { position: 'relative', marginBottom: 10 },
  avatar: { width: 64, height: 64, borderRadius: 20, backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)' },
  avatarText: { color: '#fff', fontSize: 22, fontWeight: '800' },
  verifiedBadge: { position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderRadius: 9, backgroundColor: '#22c55e', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#14532d' },
  profileName: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 2 },
  profileEmail: { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 8 },
  profileRoleBadge: { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 100, paddingHorizontal: 12, paddingVertical: 5 },
  profileRoleText: { color: '#fff', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' },
  statsRow: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  statItem: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  statValue: { fontSize: 15, fontWeight: '800', color: '#111827' },
  statLabel: { fontSize: 10, color: '#9ca3af', fontWeight: '500', marginTop: 1 },
  loyaltyCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
  loyaltyGradient: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  loyaltyLeft: {},
  loyaltyTier: { color: '#fff', fontSize: 15, fontWeight: '800', marginBottom: 3 },
  loyaltyPoints: { color: 'rgba(255,255,255,0.7)', fontSize: 12 },
  loyaltyRight: { alignItems: 'center' },
  loyaltyMultiplier: { color: '#fff', fontSize: 28, fontWeight: '800' },
  loyaltyMultiplierLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10 },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', marginTop: 8 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#16a34a' },
  tabText: { fontSize: 11, fontWeight: '600', color: '#9ca3af' },
  tabTextActive: { color: '#16a34a' },
  // Orders
  orderCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  orderCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  orderCardId: { fontFamily: 'monospace', fontSize: 12, color: '#16a34a', fontWeight: '700' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 100 },
  statusText: { fontSize: 10, fontWeight: '700', textTransform: 'capitalize' },
  orderCardProduct: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 10 },
  orderCardFooter: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  orderCardAmt: { fontSize: 14, fontWeight: '800', color: '#111827' },
  progressMini: { flex: 1, height: 4, backgroundColor: '#e5e7eb', borderRadius: 2 },
  progressMiniFill: { height: '100%', backgroundColor: '#16a34a', borderRadius: 2 },
  orderCardArrow: { fontSize: 20, color: '#9ca3af' },
  // Order Detail
  orderDetail: { flex: 1, backgroundColor: '#f8fafc' },
  backButton: { paddingVertical: 8, marginBottom: 12 },
  backButtonText: { color: '#16a34a', fontSize: 14, fontWeight: '600' },
  orderDetailCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  orderDetailId: { fontFamily: 'monospace', fontSize: 14, color: '#16a34a', fontWeight: '700', marginBottom: 4 },
  orderDetailProduct: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 12 },
  orderDetailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderDetailLabel: { fontSize: 13, color: '#9ca3af' },
  orderDetailVal: { fontSize: 13, fontWeight: '600', color: '#111827' },
  progressSection: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 13, fontWeight: '600', color: '#374151' },
  progressPct: { fontSize: 13, fontWeight: '700', color: '#16a34a' },
  progressBar: { height: 8, backgroundColor: '#e5e7eb', borderRadius: 4 },
  progressFill: { height: '100%', backgroundColor: '#16a34a', borderRadius: 4 },
  milestonesTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 12 },
  milestone: { flexDirection: 'row', marginBottom: 0, position: 'relative', paddingBottom: 20 },
  milestoneDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 },
  milestoneDotDone: { backgroundColor: '#16a34a' },
  milestoneLine: { position: 'absolute', left: 13, top: 28, width: 2, height: '100%', backgroundColor: '#e5e7eb' },
  milestoneLineDone: { backgroundColor: '#16a34a' },
  milestoneContent: { flex: 1, paddingLeft: 12, paddingTop: 4 },
  milestoneLabel: { fontSize: 13, fontWeight: '600', color: '#111827' },
  milestoneLabelPending: { color: '#9ca3af' },
  milestoneTime: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  escrowCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16 },
  escrowItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  escrowItemLabel: { fontSize: 12, color: '#6b7280', flex: 1 },
  escrowItemRight: { alignItems: 'flex-end' },
  escrowItemAmt: { fontSize: 13, fontWeight: '700', color: '#374151' },
  escrowStatus: { marginTop: 3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 100 },
  escrowReleased: { backgroundColor: '#dcfce7' },
  escrowHeld: { backgroundColor: '#f3f4f6' },
  escrowStatusText: { fontSize: 9, fontWeight: '700', color: '#6b7280' },
  // Notifications
  markAllRead: { backgroundColor: '#eff6ff', borderRadius: 10, padding: 10, marginBottom: 12, alignItems: 'center' },
  markAllReadText: { color: '#2563eb', fontSize: 13, fontWeight: '600' },
  notifCard: { backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10, flexDirection: 'row', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  notifCardUnread: { borderLeftWidth: 3, borderLeftColor: '#16a34a' },
  notifEmoji: { fontSize: 24, width: 32, textAlign: 'center' },
  notifContent: { flex: 1 },
  notifTitle: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 3 },
  notifMessage: { fontSize: 12, color: '#6b7280', lineHeight: 17 },
  notifTime: { fontSize: 10, color: '#9ca3af', marginTop: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#16a34a', marginTop: 6 },
  // Loyalty
  loyaltyHeader: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 12 },
  tierCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 2, borderColor: '#e5e7eb' },
  tierCardActive: { borderColor: '#16a34a', backgroundColor: '#f0fdf4' },
  tierIcon: { fontSize: 28 },
  tierInfo: { flex: 1 },
  tierName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  tierMin: { fontSize: 11, color: '#9ca3af' },
  tierMultiplier: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  currentBadge: { backgroundColor: '#16a34a', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 100 },
  currentBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  signOutBtn: { marginTop: 20, borderWidth: 1.5, borderColor: '#fee2e2', borderRadius: 14, padding: 16, alignItems: 'center' },
  signOutText: { color: '#ef4444', fontWeight: '700', fontSize: 15 },
});
