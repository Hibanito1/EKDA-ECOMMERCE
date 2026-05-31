import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";

const QUICK_PROMPTS = [
  "Show me dried crayfish under ₦10K",
  "How to import a car to Nigeria?",
  "Calculate shipping to UK for 20kg",
  "Halal certified products",
  "What's my HS code?",
];

const BOT_RESPONSES: Record<string, string> = {
  default: "Hi! 👋 I'm EKDA AI. I can help you find products, calculate shipping costs, explain HS codes, and navigate import/export regulations. What can I help you with today?",
  crayfish: "🦐 Found great dried crayfish options!\n\n• Premium Badagry Creek: ₦8,500/kg\n• Sun-dried Variety: ₦7,200/kg\n• Bulk (10kg+): ₦7,800/kg avg\n\nSea freight to UK: ₦35,000 for 10kg (28 days)\nAir freight: ₦85,000 for 10kg (5 days)\n\nWould you like to add any to your cart? 🛒",
  car: "🚗 Importing a car to Nigeria:\n\n1. Find your car on our Import marketplace\n2. AI assigns HS Code (8703.xx)\n3. Pay via escrow (100% protected)\n4. We arrange sea freight (20-30 days)\n5. Clear customs at Apapa/Tin Can\n6. Delivery to your address\n\nImport duty: 35% + 7% port levy\nEstimated clearing: ₦80,000-120,000\n\nWant me to calculate full landed cost? 💰",
  shipping: "🚢 Shipping estimate for 20kg to UK:\n\n**Sea Freight (recommended)**\n• Transit: 28 days\n• Cost: ~₦47,000 (Maersk)\n• Cost: ~₦38,000 (MSC Economy)\n\n**Air Freight**\n• Transit: 5 days\n• Cost: ~₦98,000 (DHL Express)\n\nFor 20kg, sea freight saves ₦51,000+\n\nWant to compare more carriers? 🔍",
  halal: "☪️ Halal Certified Products on EKDA:\n\n• Smoked Fish (NAFDAC Halal cert)\n• Chicken (Certified Abattoir)\n• Dates from Kano\n• Pure Honey\n• Shea Butter\n\nAll halal products are verified by our compliance team. I can also show you our Eid gift bundles if you're shopping for the celebration! 🎁",
  hs: "📋 HS Code Help:\n\nOur AI classifier can identify your HS code from a product description. Here are some common ones:\n\n• Dried Crayfish: 0306.17\n• Palm Oil: 1511.10\n• Garri: 1903.00\n• Vehicles (<3000cc): 8703.23\n• Smartphones: 8517.13\n\nJust describe your product and I'll classify it! 🤖",
};

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export default function AIChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: BOT_RESPONSES.default!,
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), text, isBot: false, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1200));

    const lower = text.toLowerCase();
    let reply = BOT_RESPONSES.default!;
    if (lower.includes("crayfish") || lower.includes("dried")) reply = BOT_RESPONSES.crayfish!;
    else if (lower.includes("car") || lower.includes("vehicle") || lower.includes("import")) reply = BOT_RESPONSES.car!;
    else if (lower.includes("ship") || lower.includes("freight") || lower.includes("uk")) reply = BOT_RESPONSES.shipping!;
    else if (lower.includes("halal") || lower.includes("eid")) reply = BOT_RESPONSES.halal!;
    else if (lower.includes("hs") || lower.includes("code") || lower.includes("customs")) reply = BOT_RESPONSES.hs!;

    const botMsg: Message = { id: (Date.now() + 1).toString(), text: reply, isBot: true, timestamp: new Date() };
    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={["#0a1628", "#0f2044"]} style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.botAvatar}>
            <Text style={styles.botAvatarText}>🤖</Text>
          </View>
          <View>
            <Text style={styles.headerTitle}>EKDA AI Assistant</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Powered by Groq · Online</Text>
            </View>
          </View>
        </View>
        <View style={styles.aiBadge}>
          <Text style={styles.aiBadgeText}>✨ AI</Text>
        </View>
      </LinearGradient>

      <ScrollView
        ref={scrollRef}
        style={styles.messages}
        contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd()}
      >
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.messageRow, !msg.isBot && styles.userRow]}>
            {msg.isBot && (
              <View style={styles.msgAvatar}>
                <Text style={styles.msgAvatarText}>🤖</Text>
              </View>
            )}
            <View style={[styles.bubble, msg.isBot ? styles.botBubble : styles.userBubble]}>
              <Text style={[styles.bubbleText, !msg.isBot && styles.userBubbleText]}>
                {msg.text}
              </Text>
              <Text style={[styles.timeText, !msg.isBot && styles.userTimeText]}>
                {msg.timestamp.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              </Text>
            </View>
          </View>
        ))}

        {loading && (
          <View style={styles.messageRow}>
            <View style={styles.msgAvatar}>
              <Text style={styles.msgAvatarText}>🤖</Text>
            </View>
            <View style={styles.botBubble}>
              <View style={styles.typingDots}>
                {[0, 1, 2].map((i) => (
                  <View key={i} style={[styles.dot, { opacity: 0.4 + i * 0.2 }]} />
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Prompts */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickPrompts} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
        {QUICK_PROMPTS.map((prompt) => (
          <TouchableOpacity
            key={prompt}
            style={styles.promptChip}
            onPress={() => sendMessage(prompt)}
          >
            <Text style={styles.promptChipText}>{prompt}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask about products, shipping, HS codes..."
            placeholderTextColor="#9ca3af"
            multiline
            onSubmitEditing={() => sendMessage(input)}
          />
          <TouchableOpacity
            style={[styles.sendButton, !input.trim() && styles.sendButtonDisabled]}
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || loading}
          >
            <Text style={styles.sendButtonText}>→</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 14 },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  botAvatar: { width: 40, height: 40, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" },
  botAvatarText: { fontSize: 20 },
  headerTitle: { color: "#fff", fontSize: 15, fontWeight: "700" },
  onlineRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#4ade80" },
  onlineText: { color: "rgba(255,255,255,0.5)", fontSize: 11 },
  aiBadge: { backgroundColor: "rgba(245,158,11,0.2)", borderRadius: 100, paddingHorizontal: 10, paddingVertical: 4 },
  aiBadgeText: { color: "#fbbf24", fontSize: 11, fontWeight: "700" },
  messages: { flex: 1 },
  messageRow: { flexDirection: "row", gap: 8, maxWidth: "85%" },
  userRow: { alignSelf: "flex-end", flexDirection: "row-reverse" },
  msgAvatar: { width: 28, height: 28, borderRadius: 10, backgroundColor: "#e0f2fe", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  msgAvatarText: { fontSize: 14 },
  bubble: { flex: 1, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 10 },
  botBubble: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb", borderTopLeftRadius: 4 },
  userBubble: { backgroundColor: "#16a34a", borderTopRightRadius: 4 },
  bubbleText: { fontSize: 13, color: "#111827", lineHeight: 20 },
  userBubbleText: { color: "#fff" },
  timeText: { fontSize: 10, color: "#9ca3af", marginTop: 4 },
  userTimeText: { color: "rgba(255,255,255,0.6)", textAlign: "right" },
  typingDots: { flexDirection: "row", gap: 4, padding: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#6b7280" },
  quickPrompts: { maxHeight: 48, borderTopWidth: 1, borderTopColor: "#f1f5f9", backgroundColor: "#fff" },
  promptChip: { backgroundColor: "#f0fdf4", borderWidth: 1, borderColor: "#bbf7d0", borderRadius: 100, paddingHorizontal: 12, paddingVertical: 8, alignSelf: "flex-start" },
  promptChipText: { fontSize: 11, color: "#16a34a", fontWeight: "600" },
  inputBar: { flexDirection: "row", alignItems: "flex-end", gap: 8, padding: 12, backgroundColor: "#fff", borderTopWidth: 1, borderTopColor: "#f1f5f9" },
  input: { flex: 1, backgroundColor: "#f3f4f6", borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: "#111827", maxHeight: 80 },
  sendButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: "#16a34a", alignItems: "center", justifyContent: "center" },
  sendButtonDisabled: { backgroundColor: "#d1fae5" },
  sendButtonText: { color: "#fff", fontSize: 20, fontWeight: "700" },
});
