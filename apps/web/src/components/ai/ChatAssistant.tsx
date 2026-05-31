"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Sparkles,
  ShoppingCart,
  Loader2,
  RotateCcw,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@ekda/shared";
import { useAIChatStore } from "@/store";
import { cn } from "@/lib/utils";

const SUGGESTED_PROMPTS = [
  "Find me dried crayfish under ₦10,000/kg",
  "What's the cheapest way to ship 50kg to London?",
  "Show me Halal certified products",
  "How do I clear customs for electronics?",
  "Recommend a gift bundle for Eid",
  "Compare Toyota vs Mercedes import costs",
];

export function AIChatAssistant() {
  const { isOpen, messages, isLoading, toggleChat, sendMessage, clearMessages } = useAIChatStore();
  const [input, setInput] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleChat}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-2xl bg-gradient-to-br from-ekda-green-600 to-ekda-green-800 text-white shadow-2xl shadow-ekda-green-600/40 flex items-center justify-center"
          >
            <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-ekda-gold-400 border-2 border-white flex items-center justify-center">
              <Sparkles className="h-2.5 w-2.5 text-white" />
            </div>
            <Bot className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[600px] flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-black/20 border border-border bg-background"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-ekda-green-800 to-ekda-dark px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-white/10 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div>
                  <div className="text-white text-sm font-semibold flex items-center gap-1.5">
                    EKDA AI Assistant
                    <Badge className="text-[9px] px-1 py-0 bg-ekda-gold-500/20 text-ekda-gold-300 border-ekda-gold-500/30">
                      <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                      AI
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-white/50 text-[10px]">Online · Powered by Groq</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-7 w-7 rounded-lg text-white/60 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <ChevronDown className={cn("h-4 w-4 transition-transform", isMinimized && "rotate-180")} />
                </button>
                <button
                  onClick={clearMessages}
                  className="h-7 w-7 rounded-lg text-white/60 hover:bg-white/10 flex items-center justify-center transition-colors"
                  title="Clear chat"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={toggleChat}
                  className="h-7 w-7 rounded-lg text-white/60 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="flex flex-col flex-1 overflow-hidden"
                >
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[380px] scrollbar-thin bg-muted/20">
                    {messages.length === 0 ? (
                      <div className="py-4">
                        <div className="text-center mb-5">
                          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-ekda-green-600 to-ekda-green-800 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-ekda-green-600/25">
                            <Sparkles className="h-6 w-6 text-white" />
                          </div>
                          <p className="font-semibold text-sm">Hi! I&apos;m EKDA AI</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Your smart shopping & trade assistant
                          </p>
                        </div>
                        <p className="text-xs font-medium text-muted-foreground mb-2 text-center">
                          Try asking:
                        </p>
                        <div className="grid grid-cols-1 gap-1.5">
                          {SUGGESTED_PROMPTS.map((prompt) => (
                            <button
                              key={prompt}
                              onClick={() => {
                                setInput(prompt);
                                sendMessage(prompt);
                              }}
                              className="text-left text-xs bg-background hover:bg-primary/5 hover:text-primary border border-border hover:border-primary/30 rounded-xl px-3 py-2 transition-all"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={cn("flex gap-2.5", message.role === "user" ? "flex-row-reverse" : "")}
                        >
                          {message.role === "assistant" && (
                            <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-ekda-green-600 to-ekda-green-800 flex items-center justify-center flex-shrink-0">
                              <Bot className="h-3.5 w-3.5 text-white" />
                            </div>
                          )}
                          <div
                            className={cn(
                              "max-w-[80%] rounded-2xl px-3 py-2.5 text-sm leading-relaxed",
                              message.role === "user"
                                ? "bg-primary text-white rounded-tr-sm"
                                : "bg-background border border-border text-foreground rounded-tl-sm"
                            )}
                          >
                            <p className="whitespace-pre-wrap">{message.content}</p>

                            {/* Product suggestions */}
                            {message.products && message.products.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {message.products.map((p) => (
                                  <div key={p.id} className="flex items-center gap-2 bg-muted/50 rounded-xl p-2">
                                    <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-base flex-shrink-0">
                                      {p.category === "groceries" ? "🌿" :
                                       p.category === "dried_produce" ? "🌾" :
                                       p.category === "electronics" ? "📱" : "📦"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs font-semibold truncate">{p.name}</div>
                                      <div className="text-[10px] text-muted-foreground">
                                        {formatCurrency(p.price || 0, p.currency as any)}/{p.unit}
                                      </div>
                                    </div>
                                    <button className="h-6 w-6 rounded-lg bg-primary text-white flex items-center justify-center">
                                      <ShoppingCart className="h-3 w-3" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Quick reply suggestions */}
                            {message.suggestions && message.suggestions.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {message.suggestions.map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => sendMessage(s)}
                                    className="text-[10px] bg-muted hover:bg-primary/10 hover:text-primary px-2 py-1 rounded-full border border-border transition-colors"
                                  >
                                    {s}
                                  </button>
                                ))}
                              </div>
                            )}

                            <div className={cn("text-[10px] mt-1.5 opacity-60", message.role === "user" ? "text-right text-white/70" : "text-muted-foreground")}>
                              {message.timestamp.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                            </div>
                          </div>
                        </div>
                      ))
                    )}

                    {isLoading && (
                      <div className="flex gap-2.5">
                        <div className="h-7 w-7 rounded-xl bg-gradient-to-br from-ekda-green-600 to-ekda-green-800 flex items-center justify-center">
                          <Bot className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div className="bg-background border border-border rounded-2xl rounded-tl-sm px-4 py-3">
                          <div className="flex gap-1">
                            {[0, 0.2, 0.4].map((delay) => (
                              <div
                                key={delay}
                                className="h-1.5 w-1.5 rounded-full bg-muted-foreground animate-bounce"
                                style={{ animationDelay: `${delay}s` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-3 border-t border-border bg-background">
                    <div className="flex gap-2 items-end">
                      <div className="flex-1 flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2.5 border border-border focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/30 transition-all">
                        <input
                          ref={inputRef}
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Ask about products, shipping, customs..."
                          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                          disabled={isLoading}
                        />
                      </div>
                      <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 active:scale-95 transition-all flex-shrink-0"
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center mt-1.5">
                      Powered by Groq · Your personal EKDA trade advisor
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
