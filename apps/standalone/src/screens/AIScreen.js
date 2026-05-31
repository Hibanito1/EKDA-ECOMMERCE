import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CHAT_RESPONSES, HS_CODE_EXAMPLES } from '../data/mockData';

// ─── AI Chat Tab ──────────────────────────────────────────────────────────────

function AIChatTab() {
  const [messages, setMessages] = useState([
    { id: '0', role: 'bot', text: CHAT_RESPONSES.greeting.text, suggestions: CHAT_RESPONSES.greeting.suggestions }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = React.useRef(null);

  const getResponse = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('crayfish') || lower.includes('dried')) return CHAT_RESPONSES.crayfish;
    if (lower.includes('car') || lower.includes('vehicle') || lower.includes('toyota')) return CHAT_RESPONSES.car;
    if (lower.includes('escrow') || lower.includes('payment') || lower.includes('how')) return CHAT_RESPONSES.escrow;
    if (lower.includes('ship') || lower.includes('freight') || lower.includes('cost')) return CHAT_RESPONSES.shipping;
    return CHAT_RESPONSES.default;
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const response = getResponse(text);
    const botMsg = { id: (Date.now() + 1).toString(), role: 'bot', text: response.text, suggestions: response.suggestions };
    setMessages(prev => [...prev, botMsg]);
    setLoading(false);
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <View style={styles.chatContainer}>
      <LinearGradient colors={['#0a1628', '#1e3a5f']} style={styles.chatHeader}>
        <View style={styles.chatHeaderLeft}>
          <View style={styles.botAvatar}><Text style={styles.botAvatarText}>🤖</Text></View>
          <View>
            <Text style={styles.chatHeaderTitle}>EKDA AI Assistant</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Simulated · Instant replies</Text>
            </View>
          </View>
        </View>
        <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>✨ AI</Text></View>
      </LinearGradient>

      <ScrollView
        ref={scrollRef}
        style={styles.messagesList}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 8 }}
      >
        {messages.map(msg => (
          <View key={msg.id} style={[styles.msgRow, msg.role === 'user' && styles.msgRowUser]}>
            {msg.role === 'bot' && <View style={styles.msgAvatar}><Text>🤖</Text></View>}
            <View style={[styles.bubble, msg.role === 'user' ? styles.userBubble : styles.botBubble]}>
              <Text style={[styles.bubbleText, msg.role === 'user' && styles.userBubbleText]}>{msg.text}</Text>
              {msg.suggestions && (
                <View style={styles.suggestionsRow}>
                  {msg.suggestions.map(s => (
                    <TouchableOpacity key={s} style={styles.suggestionChip} onPress={() => sendMessage(s)}>
                      <Text style={styles.suggestionText}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        ))}
        {loading && (
          <View style={styles.msgRow}>
            <View style={styles.msgAvatar}><Text>🤖</Text></View>
            <View style={styles.botBubble}>
              <Text style={styles.typingText}>Thinking... ●●●</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.inputBar}>
        <TextInput
          style={styles.chatInput}
          value={input}
          onChangeText={setInput}
          placeholder="Ask about products, shipping, HS codes..."
          placeholderTextColor="#9ca3af"
          onSubmitEditing={() => sendMessage(input)}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]}
          onPress={() => sendMessage(input)}
          disabled={!input.trim() || loading}
        >
          <Text style={styles.sendBtnText}>→</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── HS Code Tool Tab ─────────────────────────────────────────────────────────

function HSCodeTab() {
  const [description, setDescription] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const classify = async () => {
    if (!description.trim()) return;
    setLoading(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 1800));
    const lower = description.toLowerCase();
    const match = HS_CODE_EXAMPLES.find(ex =>
      ex.prompt.toLowerCase().split(' ').some(word => lower.includes(word) && word.length > 3)
    ) || HS_CODE_EXAMPLES[0];
    setResult({ ...match, query: description });
    setLoading(false);
  };

  return (
    <ScrollView style={styles.hsContainer} contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
      <LinearGradient colors={['#78350f', '#d97706']} style={styles.hsHeader}>
        <Text style={styles.hsHeaderEmoji}>📋</Text>
        <Text style={styles.hsHeaderTitle}>AI HS Code Engine</Text>
        <Text style={styles.hsHeaderSub}>Auto-classify products for customs · 97% accuracy</Text>
      </LinearGradient>

      <View style={styles.hsInputCard}>
        <Text style={styles.hsInputLabel}>Product Description</Text>
        <TextInput
          style={styles.hsInput}
          value={description}
          onChangeText={setDescription}
          placeholder="e.g. Dried crayfish from Nigeria, used in soups..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={3}
        />
        <TouchableOpacity style={[styles.classifyBtn, loading && { opacity: 0.7 }]} onPress={classify} disabled={loading}>
          <LinearGradient colors={['#d97706', '#b45309']} style={styles.classifyGradient}>
            <Text style={styles.classifyBtnText}>{loading ? '🤖 Classifying...' : '✨ Classify with AI'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Quick examples */}
      <Text style={styles.examplesTitle}>Try an example:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {HS_CODE_EXAMPLES.slice(0, 5).map(ex => (
            <TouchableOpacity key={ex.code} style={styles.exampleChip} onPress={() => setDescription(ex.prompt)}>
              <Text style={styles.exampleChipText}>{ex.prompt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {result && (
        <View style={[styles.resultCard, result.restricted && styles.resultCardRestricted]}>
          <View style={styles.resultHeader}>
            <View>
              <Text style={styles.resultLabel}>AI Classification Result</Text>
              <Text style={styles.resultCode}>{result.code}</Text>
              <Text style={styles.resultDesc}>{result.desc}</Text>
            </View>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceVal}>{result.confidence}%</Text>
              <Text style={styles.confidenceLabel}>confidence</Text>
            </View>
          </View>

          <View style={styles.resultDivider} />

          {result.restricted ? (
            <View style={styles.restrictionAlert}>
              <Text style={styles.restrictionIcon}>✈️ ⚠️</Text>
              <Text style={styles.restrictionTitle}>Air Freight RESTRICTED</Text>
              <Text style={styles.restrictionDesc}>{result.reason}</Text>
              <View style={styles.seaRecommend}>
                <Text style={styles.seaRecommendText}>🚢 Sea freight strongly recommended</Text>
              </View>
            </View>
          ) : (
            <View style={styles.allowedRow}>
              <View style={styles.allowedBadge}><Text style={styles.allowedText}>✈️ Air freight OK</Text></View>
              <View style={[styles.allowedBadge, { backgroundColor: '#dbeafe' }]}><Text style={[styles.allowedText, { color: '#1d4ed8' }]}>🚢 Sea freight OK</Text></View>
            </View>
          )}

          <TouchableOpacity style={styles.copyBtn} onPress={() => {}}>
            <Text style={styles.copyBtnText}>📋 Copy HS Code: {result.code}</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

// ─── Main AI Screen ────────────────────────────────────────────────────────────

export default function AIScreen() {
  const [activeTab, setActiveTab] = useState('chat');

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={styles.tabBar}>
        {['chat', 'hscode'].map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.tabActive]} onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'chat' ? '🤖 AI Chat' : '📋 HS Code Tool'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {activeTab === 'chat' ? <AIChatTab /> : <HSCodeTab />}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  tab: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#16a34a' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#9ca3af' },
  tabTextActive: { color: '#16a34a' },

  // Chat
  chatContainer: { flex: 1, backgroundColor: '#f8fafc' },
  chatHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
  chatHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  botAvatar: { width: 36, height: 36, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  botAvatarText: { fontSize: 18 },
  chatHeaderTitle: { color: '#fff', fontSize: 14, fontWeight: '700' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ade80' },
  onlineText: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },
  aiBadge: { backgroundColor: 'rgba(245,158,11,0.2)', borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4 },
  aiBadgeText: { color: '#fbbf24', fontSize: 11, fontWeight: '700' },
  messagesList: { flex: 1 },
  msgRow: { flexDirection: 'row', gap: 8, maxWidth: '85%' },
  msgRowUser: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  msgAvatar: { width: 28, height: 28, borderRadius: 10, backgroundColor: '#e0f2fe', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  bubble: { flex: 1, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10 },
  botBubble: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderTopLeftRadius: 4 },
  userBubble: { backgroundColor: '#16a34a', borderTopRightRadius: 4 },
  bubbleText: { fontSize: 13, color: '#111827', lineHeight: 20 },
  userBubbleText: { color: '#fff' },
  typingText: { color: '#9ca3af', fontSize: 12 },
  suggestionsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 5, marginTop: 8 },
  suggestionChip: { backgroundColor: '#f0fdf4', borderWidth: 1, borderColor: '#bbf7d0', borderRadius: 100, paddingHorizontal: 10, paddingVertical: 5 },
  suggestionText: { fontSize: 11, color: '#16a34a', fontWeight: '600' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  chatInput: { flex: 1, backgroundColor: '#f3f4f6', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#111827', maxHeight: 80 },
  sendBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#16a34a', alignItems: 'center', justifyContent: 'center' },
  sendBtnDisabled: { backgroundColor: '#d1fae5' },
  sendBtnText: { color: '#fff', fontSize: 20, fontWeight: '700' },

  // HS Code
  hsContainer: { flex: 1, backgroundColor: '#f8fafc' },
  hsHeader: { margin: 16, borderRadius: 20, padding: 20, alignItems: 'center' },
  hsHeaderEmoji: { fontSize: 32, marginBottom: 6 },
  hsHeaderTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 4 },
  hsHeaderSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, textAlign: 'center' },
  hsInputCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, marginHorizontal: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  hsInputLabel: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 8 },
  hsInput: { borderWidth: 1.5, borderColor: '#e5e7eb', borderRadius: 12, padding: 12, fontSize: 14, color: '#111827', backgroundColor: '#f9fafb', minHeight: 80, marginBottom: 12 },
  classifyBtn: { borderRadius: 14, overflow: 'hidden' },
  classifyGradient: { paddingVertical: 14, alignItems: 'center' },
  classifyBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  examplesTitle: { fontSize: 12, fontWeight: '600', color: '#9ca3af', marginHorizontal: 16, marginBottom: 8 },
  exampleChip: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 100, paddingHorizontal: 12, paddingVertical: 7, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  exampleChipText: { fontSize: 11, color: '#374151' },
  resultCard: { backgroundColor: '#fff', borderRadius: 20, padding: 20, marginHorizontal: 16, borderLeftWidth: 4, borderLeftColor: '#16a34a', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  resultCardRestricted: { borderLeftColor: '#dc2626' },
  resultHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  resultLabel: { fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', marginBottom: 4 },
  resultCode: { fontSize: 28, fontWeight: '800', color: '#111827', fontFamily: 'monospace' },
  resultDesc: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  confidenceBadge: { backgroundColor: '#f0fdf4', borderRadius: 12, padding: 10, alignItems: 'center' },
  confidenceVal: { fontSize: 20, fontWeight: '800', color: '#16a34a' },
  confidenceLabel: { fontSize: 9, color: '#16a34a' },
  resultDivider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 14 },
  restrictionAlert: { backgroundColor: '#fee2e2', borderRadius: 14, padding: 14 },
  restrictionIcon: { fontSize: 20, marginBottom: 5 },
  restrictionTitle: { fontSize: 14, fontWeight: '700', color: '#dc2626', marginBottom: 4 },
  restrictionDesc: { fontSize: 12, color: '#b91c1c', marginBottom: 10 },
  seaRecommend: { backgroundColor: '#dbeafe', borderRadius: 10, padding: 8 },
  seaRecommendText: { fontSize: 12, color: '#1d4ed8', fontWeight: '600' },
  allowedRow: { flexDirection: 'row', gap: 8 },
  allowedBadge: { backgroundColor: '#dcfce7', borderRadius: 100, paddingHorizontal: 12, paddingVertical: 6 },
  allowedText: { fontSize: 11, fontWeight: '600', color: '#16a34a' },
  copyBtn: { marginTop: 14, backgroundColor: '#f3f4f6', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  copyBtnText: { fontSize: 13, fontWeight: '600', color: '#374151' },
});
