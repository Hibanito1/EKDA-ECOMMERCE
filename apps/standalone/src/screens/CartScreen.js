import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Alert, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EXPORT_PRODUCTS, IMPORT_PRODUCTS, CARRIERS, formatCurrency } from '../data/mockData';

const STEP_LABELS = ['Delivery', 'Carrier', 'Payment', 'Confirm'];

const PAYMENT_OPTIONS = [
  { id: 'paystack', label: 'Paystack', desc: 'Debit/Credit Card, Bank Transfer (Nigeria)', emoji: '💳', badge: 'Nigeria' },
  { id: 'stripe', label: 'Stripe', desc: 'International cards, Apple/Google Pay', emoji: '🌍', badge: 'Global' },
  { id: 'crypto', label: 'USDT/USDC', desc: 'Crypto stablecoin for diaspora', emoji: '₮', badge: 'Crypto' },
];

export default function CartScreen({ cart, onCartUpdate, user }) {
  const [step, setStep] = useState(0);
  const [selectedCarrier, setSelectedCarrier] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [address, setAddress] = useState('');

  const allProducts = [...EXPORT_PRODUCTS, ...IMPORT_PRODUCTS];
  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const product = allProducts.find(p => p.id === id);
      return product ? { product, qty } : null;
    })
    .filter(Boolean);

  const subtotal = cartItems.reduce((sum, { product, qty }) => sum + product.price * qty, 0);
  const shippingCost = selectedCarrier ? CARRIERS.find(c => c.id === selectedCarrier)?.rate || 35000 : 35000;
  const commission = subtotal * 0.10;
  const total = subtotal + shippingCost + commission;

  const removeItem = (id) => {
    const newCart = { ...cart };
    delete newCart[id];
    onCartUpdate(newCart);
  };

  const updateQty = (id, delta) => {
    const newQty = Math.max(0, (cart[id] || 0) + delta);
    if (newQty === 0) {
      const newCart = { ...cart };
      delete newCart[id];
      onCartUpdate(newCart);
    } else {
      onCartUpdate({ ...cart, [id]: newQty });
    }
  };

  const placeOrder = async () => {
    if (!selectedPayment) {
      Alert.alert('Select Payment', 'Please choose a payment method.');
      return;
    }
    await new Promise(r => setTimeout(r, 1200));
    setOrderPlaced(true);
    onCartUpdate({});
  };

  if (orderPlaced) {
    return (
      <View style={styles.successContainer}>
        <LinearGradient colors={['#0a1628', '#14532d']} style={StyleSheet.absoluteFillObject} />
        <Text style={styles.successEmoji}>🎉</Text>
        <Text style={styles.successTitle}>Order Placed!</Text>
        <Text style={styles.successId}>EKDA-{Math.random().toString(36).slice(2,8).toUpperCase()}</Text>
        <Text style={styles.successDesc}>
          Your payment of {formatCurrency(total)} is secured in EKDA escrow.{'\n'}
          You'll receive updates at every milestone.
        </Text>
        <View style={styles.escrowSteps}>
          {['✅ Payment held in escrow', '🚢 Carrier picks up → 50% released', '🏁 Delivery confirmed → 50% released'].map((step, i) => (
            <View key={i} style={styles.escrowStep}>
              <Text style={styles.escrowStepText}>{step}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.successBtn} onPress={() => setOrderPlaced(false)}>
          <Text style={styles.successBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyDesc}>Browse African exports or global imports to add items</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Progress Steps */}
      <View style={styles.stepsRow}>
        {STEP_LABELS.map((label, i) => (
          <View key={label} style={styles.stepItem}>
            <View style={[styles.stepDot, step >= i && styles.stepDotActive, step === i && styles.stepDotCurrent]}>
              <Text style={styles.stepDotText}>{step > i ? '✓' : i + 1}</Text>
            </View>
            <Text style={[styles.stepLabel, step >= i && styles.stepLabelActive]}>{label}</Text>
            {i < STEP_LABELS.length - 1 && <View style={[styles.stepLine, step > i && styles.stepLineActive]} />}
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Step 0: Cart Items */}
        {step === 0 && (
          <>
            <Text style={styles.sectionTitle}>Your Items ({cartItems.length})</Text>
            {cartItems.map(({ product, qty }) => (
              <View key={product.id} style={styles.cartItem}>
                <Text style={styles.cartItemEmoji}>{product.emoji}</Text>
                <View style={styles.cartItemInfo}>
                  <Text style={styles.cartItemName} numberOfLines={2}>{product.name}</Text>
                  <Text style={styles.cartItemVendor}>{product.vendor} · {product.cargo === 'sea' ? '🚢 Sea' : '✈️ Air'}</Text>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQty(product.id, -1)}>
                      <Text style={styles.qtyBtnText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyVal}>{qty}</Text>
                    <TouchableOpacity style={[styles.qtyBtn, styles.qtyBtnAdd]} onPress={() => updateQty(product.id, 1)}>
                      <Text style={[styles.qtyBtnText, { color: '#fff' }]}>+</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyUnit}>{product.unit}</Text>
                  </View>
                </View>
                <View style={styles.cartItemRight}>
                  <Text style={styles.cartItemPrice}>{formatCurrency(product.price * qty)}</Text>
                  <TouchableOpacity onPress={() => removeItem(product.id)}>
                    <Text style={styles.removeBtn}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Delivery address */}
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TextInput
              style={styles.addressInput}
              placeholder="Enter delivery address or port name..."
              placeholderTextColor="#9ca3af"
              value={address}
              onChangeText={setAddress}
              multiline
            />

            <TouchableOpacity style={styles.nextBtn} onPress={() => setStep(1)}>
              <LinearGradient colors={['#16a34a', '#15803d']} style={styles.nextGradient}>
                <Text style={styles.nextBtnText}>Continue to Carrier →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}

        {/* Step 1: Carrier */}
        {step === 1 && (
          <>
            <Text style={styles.sectionTitle}>Select Carrier</Text>
            <Text style={styles.sectionSub}>AI recommends sea freight for your order</Text>
            {CARRIERS.map(carrier => (
              <TouchableOpacity
                key={carrier.id}
                style={[styles.carrierCard, selectedCarrier === carrier.id && styles.carrierCardActive]}
                onPress={() => setSelectedCarrier(carrier.id)}
              >
                <Text style={styles.carrierLogo}>{carrier.logo}</Text>
                <View style={styles.carrierInfo}>
                  <View style={styles.carrierNameRow}>
                    <Text style={styles.carrierName}>{carrier.name}</Text>
                    {carrier.tag && <View style={styles.carrierTagBadge}><Text style={styles.carrierTagText}>{carrier.tag}</Text></View>}
                    {carrier.includesDuties && <View style={[styles.carrierTagBadge, { backgroundColor: '#dcfce7' }]}><Text style={[styles.carrierTagText, { color: '#16a34a' }]}>Duties Included</Text></View>}
                  </View>
                  <Text style={styles.carrierDetails}>{carrier.type} · {carrier.days} days · ⭐ {carrier.rating}</Text>
                </View>
                <View style={styles.carrierRight}>
                  <Text style={styles.carrierRate}>{formatCurrency(carrier.rate)}</Text>
                  <View style={[styles.radioCircle, selectedCarrier === carrier.id && styles.radioCircleActive]} />
                </View>
              </TouchableOpacity>
            ))}
            <View style={styles.stepBtnRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(0)}>
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.nextBtn, { flex: 1 }]} onPress={() => setStep(2)} disabled={!selectedCarrier}>
                <LinearGradient colors={selectedCarrier ? ['#16a34a', '#15803d'] : ['#9ca3af', '#6b7280']} style={styles.nextGradient}>
                  <Text style={styles.nextBtnText}>Continue to Payment →</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Step 2: Payment */}
        {step === 2 && (
          <>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.escrowNotice}>
              <Text style={styles.escrowNoticeText}>🔒 Your payment is 100% secured in EKDA escrow. Released in verified stages — not until delivery is confirmed.</Text>
            </View>
            {PAYMENT_OPTIONS.map(method => (
              <TouchableOpacity
                key={method.id}
                style={[styles.paymentCard, selectedPayment === method.id && styles.paymentCardActive]}
                onPress={() => setSelectedPayment(method.id)}
              >
                <Text style={styles.paymentEmoji}>{method.emoji}</Text>
                <View style={styles.paymentInfo}>
                  <View style={styles.paymentNameRow}>
                    <Text style={styles.paymentName}>{method.label}</Text>
                    <View style={styles.paymentBadge}><Text style={styles.paymentBadgeText}>{method.badge}</Text></View>
                  </View>
                  <Text style={styles.paymentDesc}>{method.desc}</Text>
                </View>
                <View style={[styles.radioCircle, selectedPayment === method.id && styles.radioCircleActive]} />
              </TouchableOpacity>
            ))}
            <View style={styles.stepBtnRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.nextBtn, { flex: 1 }]} onPress={() => setStep(3)}>
                <LinearGradient colors={['#16a34a', '#15803d']} style={styles.nextGradient}>
                  <Text style={styles.nextBtnText}>Review Order →</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && (
          <>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal ({cartItems.length} items)</Text><Text style={styles.summaryVal}>{formatCurrency(subtotal)}</Text></View>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Shipping</Text><Text style={styles.summaryVal}>{formatCurrency(shippingCost)}</Text></View>
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>EKDA Commission (10%)</Text><Text style={styles.summaryVal}>{formatCurrency(commission)}</Text></View>
              <View style={[styles.summaryRow, styles.summaryTotalRow]}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalVal}>{formatCurrency(total)}</Text>
              </View>
            </View>
            <View style={styles.escrowBreakdown}>
              <Text style={styles.escrowTitle}>🔒 Escrow Protection</Text>
              {[
                { label: '1st release (carrier pickup)', amount: (subtotal - commission) * 0.5, released: false },
                { label: '2nd release (delivery)', amount: (subtotal - commission) * 0.5, released: false },
                { label: 'EKDA commission', amount: commission, released: true },
              ].map((item, i) => (
                <View key={i} style={styles.escrowRow}>
                  <Text style={styles.escrowRowLabel}>{item.label}</Text>
                  <Text style={styles.escrowRowAmt}>{formatCurrency(item.amount)}</Text>
                </View>
              ))}
            </View>
            <View style={styles.stepBtnRow}>
              <TouchableOpacity style={styles.backBtn} onPress={() => setStep(2)}>
                <Text style={styles.backBtnText}>← Back</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.nextBtn, { flex: 1 }]} onPress={placeOrder}>
                <LinearGradient colors={['#16a34a', '#15803d']} style={styles.nextGradient}>
                  <Text style={styles.nextBtnText}>🔒 Place Order — {formatCurrency(total)}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  stepsRow: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  stepItem: { flex: 1, alignItems: 'center', position: 'relative' },
  stepDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  stepDotActive: { backgroundColor: '#16a34a' },
  stepDotCurrent: { borderWidth: 2, borderColor: '#16a34a', backgroundColor: '#f0fdf4' },
  stepDotText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  stepLabel: { fontSize: 9, color: '#9ca3af', fontWeight: '500', textAlign: 'center' },
  stepLabelActive: { color: '#16a34a', fontWeight: '700' },
  stepLine: { position: 'absolute', top: 14, right: '-50%', width: '100%', height: 2, backgroundColor: '#e5e7eb' },
  stepLineActive: { backgroundColor: '#16a34a' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 4, marginTop: 8 },
  sectionSub: { fontSize: 12, color: '#9ca3af', marginBottom: 12 },
  cartItem: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cartItemEmoji: { fontSize: 36, width: 44, textAlign: 'center' },
  cartItemInfo: { flex: 1 },
  cartItemName: { fontSize: 13, fontWeight: '700', color: '#111827', marginBottom: 3 },
  cartItemVendor: { fontSize: 11, color: '#9ca3af', marginBottom: 8 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qtyBtn: { width: 28, height: 28, borderRadius: 8, borderWidth: 1.5, borderColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
  qtyBtnAdd: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  qtyBtnText: { fontSize: 16, fontWeight: '700', color: '#374151' },
  qtyVal: { fontSize: 14, fontWeight: '700', color: '#111827', minWidth: 20, textAlign: 'center' },
  qtyUnit: { fontSize: 11, color: '#9ca3af' },
  cartItemRight: { alignItems: 'flex-end', justifyContent: 'space-between', minHeight: 60 },
  cartItemPrice: { fontSize: 15, fontWeight: '800', color: '#111827' },
  removeBtn: { fontSize: 18 },
  addressInput: { borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 14, padding: 14, fontSize: 14, color: '#111827', backgroundColor: '#fff', minHeight: 80, marginBottom: 16 },
  carrierCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 2, borderColor: '#e5e7eb' },
  carrierCardActive: { borderColor: '#16a34a', backgroundColor: '#f0fdf4' },
  carrierLogo: { fontSize: 28, width: 40, textAlign: 'center' },
  carrierInfo: { flex: 1 },
  carrierNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  carrierName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  carrierTagBadge: { backgroundColor: '#fef3c7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 100 },
  carrierTagText: { fontSize: 9, fontWeight: '700', color: '#d97706' },
  carrierDetails: { fontSize: 11, color: '#9ca3af', marginTop: 3 },
  carrierRight: { alignItems: 'flex-end', gap: 6 },
  carrierRate: { fontSize: 14, fontWeight: '800', color: '#111827' },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: '#e5e7eb' },
  radioCircleActive: { borderColor: '#16a34a', backgroundColor: '#16a34a' },
  paymentCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 10, borderWidth: 2, borderColor: '#e5e7eb' },
  paymentCardActive: { borderColor: '#16a34a', backgroundColor: '#f0fdf4' },
  paymentEmoji: { fontSize: 24, width: 36, textAlign: 'center' },
  paymentInfo: { flex: 1 },
  paymentNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  paymentName: { fontSize: 14, fontWeight: '700', color: '#111827' },
  paymentBadge: { backgroundColor: '#f3f4f6', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  paymentBadgeText: { fontSize: 9, fontWeight: '600', color: '#6b7280' },
  paymentDesc: { fontSize: 11, color: '#9ca3af', marginTop: 2 },
  escrowNotice: { backgroundColor: '#f0fdf4', borderRadius: 14, padding: 12, marginBottom: 16, borderWidth: 1, borderColor: '#bbf7d0' },
  escrowNoticeText: { fontSize: 12, color: '#15803d', lineHeight: 18 },
  summaryCard: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  summaryLabel: { fontSize: 13, color: '#6b7280' },
  summaryVal: { fontSize: 13, fontWeight: '600', color: '#111827' },
  summaryTotalRow: { borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 10 },
  summaryTotalLabel: { fontSize: 16, fontWeight: '800', color: '#111827' },
  summaryTotalVal: { fontSize: 16, fontWeight: '800', color: '#16a34a' },
  escrowBreakdown: { backgroundColor: '#fff7ed', borderRadius: 14, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#fed7aa' },
  escrowTitle: { fontSize: 13, fontWeight: '700', color: '#9a3412', marginBottom: 8 },
  escrowRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  escrowRowLabel: { fontSize: 11, color: '#c2410c' },
  escrowRowAmt: { fontSize: 11, fontWeight: '700', color: '#9a3412' },
  stepBtnRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  backBtn: { paddingHorizontal: 18, paddingVertical: 14, borderRadius: 14, borderWidth: 1.5, borderColor: '#e5e7eb', justifyContent: 'center' },
  backBtnText: { color: '#374151', fontWeight: '600', fontSize: 14 },
  nextBtn: { borderRadius: 14, overflow: 'hidden' },
  nextGradient: { paddingVertical: 14, alignItems: 'center' },
  nextBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successEmoji: { fontSize: 64, marginBottom: 16 },
  successTitle: { fontSize: 28, fontWeight: '800', color: '#fff', marginBottom: 8 },
  successId: { fontSize: 14, color: 'rgba(255,255,255,0.6)', fontFamily: 'monospace', marginBottom: 16 },
  successDesc: { fontSize: 14, color: 'rgba(255,255,255,0.7)', textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  escrowSteps: { gap: 10, marginBottom: 32, width: '100%' },
  escrowStep: { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12 },
  escrowStepText: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  successBtn: { backgroundColor: '#16a34a', paddingHorizontal: 32, paddingVertical: 16, borderRadius: 14 },
  successBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  emptyEmoji: { fontSize: 60, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 20 },
});
