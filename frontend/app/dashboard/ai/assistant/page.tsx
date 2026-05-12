"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Send, Trash2, Sparkles, User, Copy, CheckCheck, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import type { ChatMessage } from "@/types/ai";

const NEON = "#00F5D4";

const SUGGESTED_PROMPTS = [
  "Create a beginner chest workout for home",
  "What should I eat before a morning workout?",
  "How do I break a weight loss plateau?",
  "Best protein sources for vegetarians in India",
  "How many rest days do I need per week?",
  "Explain the benefits of creatine supplementation",
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 rounded-xl w-fit"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
      {[0, 1, 2].map((i) => (
        <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
      ))}
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple markdown-like renderer
  const renderContent = (text: string) => {
    return text
      .split("\n")
      .map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          return <p key={i} className="font-bold text-white mt-2">{line.slice(2, -2)}</p>;
        }
        if (line.startsWith("- ") || line.startsWith("• ")) {
          return (
            <p key={i} className="flex items-start gap-2 my-0.5">
              <span style={{ color: NEON }} className="mt-1 flex-shrink-0">•</span>
              <span>{line.slice(2)}</span>
            </p>
          );
        }
        if (line.trim() === "") return <div key={i} className="h-2" />;
        return <p key={i}>{line}</p>;
      });
  };

  return (
    <motion.div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}>
      {/* Avatar */}
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-1`}
        style={{
          background: isUser ? "rgba(123,44,191,0.25)" : "rgba(0,245,212,0.15)",
          border: `1px solid ${isUser ? "rgba(123,44,191,0.4)" : "rgba(0,245,212,0.3)"}`,
        }}>
        {isUser
          ? <User className="w-3.5 h-3.5 text-[#7B2CBF]" />
          : <Bot className="w-3.5 h-3.5 text-[#00F5D4]" />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[78%] group relative`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed`}
          style={isUser ? {
            background: "rgba(123,44,191,0.20)",
            border: "1px solid rgba(123,44,191,0.30)",
            color: "white",
          } : {
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#CBD5E1",
          }}>
          {msg.isStreaming ? (
            <span>{msg.content}<span className="inline-block w-0.5 h-4 bg-[#00F5D4] ml-0.5 animate-pulse align-middle" /></span>
          ) : (
            <div className="space-y-0.5">{renderContent(msg.content)}</div>
          )}
        </div>

        {/* Copy button */}
        {!isUser && !msg.isStreaming && (
          <button onClick={copy}
            className="absolute -bottom-5 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] text-[#94A3B8] hover:text-white">
            {copied ? <CheckCheck className="w-3 h-3 text-[#00F5D4]" /> : <Copy className="w-3 h-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        )}

        <p className={`text-[10px] text-[#94A3B8]/50 mt-1.5 ${isUser ? "text-right" : "text-left"}`}>
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </motion.div>
  );
}

export default function AIAssistantPage() {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hey${user?.full_name ? ` ${user.full_name.split(" ")[0]}` : ""}! 👋 I'm **HyperAI**, your personal fitness coach.\n\nI can help you with:\n- Personalized workout plans and form tips\n- Nutrition advice and Indian meal planning\n- Recovery protocols and injury prevention\n- Goal setting and progress strategies\n\nWhat would you like to work on today?`,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = useCallback(async (text?: string) => {
    const content = (text || input).trim();
    if (!content || isStreaming) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    const assistantId = `ai_${Date.now()}`;
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setIsStreaming(true);

    try {
      const history = [...messages, userMsg]
        .filter((m) => m.id !== "welcome")
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          userProfile: user
            ? { name: user.full_name, goal: "muscle_gain" }
            : undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to connect to AI");
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const raw = line.replace("data: ", "").trim();
          if (raw === "[DONE]") continue;
          try {
            const parsed = JSON.parse(raw);
            if (parsed.text) {
              accumulated += parsed.text;
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === assistantId
                    ? { ...m, content: accumulated, isStreaming: true }
                    : m
                )
              );
            }
          } catch { /* skip */ }
        }
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, isStreaming: false } : m
        )
      );
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : "Something went wrong";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: `⚠️ ${errMsg}\n\nMake sure your **GEMINI_API_KEY** is set in \`.env.local\`.`, isStreaming: false }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
    }
  }, [input, isStreaming, messages, user]);

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "Chat cleared! How can I help you today?",
      timestamp: new Date().toISOString(),
    }]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[#00F5D4] animate-pulse" />
            <span className="text-xs font-semibold text-[#00F5D4] uppercase tracking-wider">AI Online</span>
          </div>
          <h1 className="text-2xl font-black">
            HyperAI <span className="gradient-neon">Assistant</span>
          </h1>
          <p className="text-[#94A3B8] text-sm mt-0.5">Your personal AI fitness coach — powered by Gemini</p>
        </div>
        <button onClick={clearChat}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs text-[#94A3B8] hover:text-white transition-all"
          style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
          <Trash2 className="w-3.5 h-3.5" /> Clear
        </button>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto rounded-2xl p-5 space-y-5 mb-4"
        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>

        {messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)}
        {isStreaming && messages[messages.length - 1]?.role !== "assistant" && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Suggested Prompts */}
      <AnimatePresence>
        {messages.length <= 1 && (
          <motion.div className="flex gap-2 flex-wrap mb-3"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {SUGGESTED_PROMPTS.map((p, i) => (
              <button key={i} onClick={() => send(p)}
                className="text-xs px-3 py-1.5 rounded-lg text-[#94A3B8] hover:text-white transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {p}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className="relative flex-shrink-0 rounded-2xl overflow-hidden"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)" }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask anything about fitness, workouts, diet, recovery..."
          disabled={isStreaming}
          rows={1}
          className="w-full px-5 py-4 pr-14 bg-transparent text-white placeholder-[#94A3B8] text-sm outline-none resize-none leading-relaxed disabled:opacity-60"
          style={{ maxHeight: 120 }}
        />
        <div className="absolute right-3 bottom-3 flex items-center gap-2">
          {isStreaming && <Loader2 className="w-4 h-4 text-[#00F5D4] animate-spin" />}
          <motion.button
            onClick={() => send()}
            disabled={!input.trim() || isStreaming}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all disabled:opacity-40"
            style={{ background: input.trim() ? NEON : "rgba(255,255,255,0.08)" }}
            whileTap={{ scale: 0.92 }}>
            <Send className="w-4 h-4" style={{ color: input.trim() ? "#0B0F19" : "#94A3B8" }} />
          </motion.button>
        </div>
      </div>
      <p className="text-center text-[10px] text-[#94A3B8]/50 mt-2">
        HyperAI can make mistakes. Always consult a professional for medical advice.
      </p>
    </div>
  );
}
