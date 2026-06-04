/**
 * apps/mobile/app/(tabs)/ai-chat.tsx
 * Uses @ekda/demo for all chat responses and HS code examples.
 * getAIChatResponse() replaces inline keyword matching.
 * ChatResponse.text is a string, so we read .text directly.
 */

import {
  CHAT_RESPONSES,
  HS_CODE_EXAMPLES,
  getAIChatResponse,
  classifyHSCode,
} from "@ekda/demo";
import type { ChatResponse, HSCodeExample } from "@ekda/demo";
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

// Quick prompts use shared HS_CODE_EXAMPLES for variety
const QUICK_PROMPTS = [
  "Show me dried crayfish",
  "How to import a car to Nigeria?",
  "Calculate shipping to UK for 20kg",
  "How does escrow work?",
  "What's the HS code for garri?",
];

interface Message {
  id: string;
  text: string;
  suggestions?: string[];
  isBot: boolean;
  timestamp: Date;
}

function initialMessages(): Message[] {
  const greeting = CHAT_RESPONSES.greeting!;
  return [
    {
      id: "1",
      text: greeting.text,
      suggestions: greeting.suggestions,
      isBot: true,
      timestamp: new Date(),
    },
  ];
}

export default function AIChatScreen() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 1000));

    // Use shared getAIChatResponse from @ekda/demo
    const response: ChatResponse = getAIChatResponse(text);
    const botMsg: Message = {
      id: (Date.now() + 1).toString(),
      text: response.text,
      suggestions: response.suggestions,
      isBot: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);

    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={["#0a1628", "#0f2044"]}
        style={styles.header}
      >
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
          <View
            key={msg.id}
            style={[styles.messageRow, !msg.isBot && styles.userRow]}
          >
            {msg.isBot && (
              <View style={styles.msgAvatar}>
                <Text style={styles.msgAvatarText}>🤖</Text>
              </View>
            )}
            <View style={styles.bubbleWrapper}>
              <View
                style={[
                  styles.bubble,
                  msg.isBot ? styles.botBubble : styles.userBubble,
                ]}
              >
                <Text
                  style={[
                    styles.bubbleText,
                    !msg.isBot && styles.userBubbleText,
                  ]}
                >
                  {msg.text}
                </Text>
                <Text
                  style={[
                    styles.timeText,
                    !msg.isBot && styles.userTimeText,
                  ]}
                >
                  {msg.timestamp.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
              {/* Quick replies from shared suggestions */}
              {msg.isBot && msg.suggestions && msg.suggestions.length > 0 && (
                <View style={styles.suggestionsRow}>
                  {msg.suggestions.map((s) => (
                    <TouchableOpacity
                      key={s}
                      style={styles.suggestionChip}
                      onPress={() => sendMessage(s)}
                    >
                      <Text style={styles.suggestionText}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
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
                  <View
                    key={i}
                    style={[styles.dot, { opacity: 0.4 + i * 0.2 }]}
                  />
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Prompts */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickPrompts}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
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

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
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
            style={[
              styles.sendButton,
              !input.trim() && styles.sendButtonDisabled,
            ]}
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
  messageRow: { flexDirection: "row", gap: 8, maxWidth: "90%" },
  userRow: { alignSelf: "flex-end", flexDirection: "row-reverse" },
  msgAvatar: { width: 28, height: 28, borderRadius: 10, backgroundColor: "#e0f2fe", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  msgAvatarText: { fontSize: 14 },
  bubbleWrapper: { flex: 1 },
  bubble: { borderRadius: 18, paddingHorizontal: 12, paddingVertical: 10 },
  botBubble: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#e5e7eb", borderTopLeftRadius: 4 },
  userBubble: { backgroundColor: "#16a34a", borderTopRightRadius: 4 },
  bubbleText: { fontSize: 13, color: "#111827", lineHeight: 20 },
  userBubbleText: { color: "#fff" },
  timeText: { fontSize: 10, color: "#9ca3af", marginTop: 4 },
  userTimeText: { color: "rgba(255,255,255,0.6)", textAlign: "right" },
  suggestionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  suggestionChip: { backgroundColor: "#f0fdf4", borderWidth: 1, borderColor: "#bbf7d0", borderRadius: 100, paddingHorizontal: 10, paddingVertical: 5 },
  suggestionText: { fontSize: 11, color: "#16a34a", fontWeight: "600" },
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
