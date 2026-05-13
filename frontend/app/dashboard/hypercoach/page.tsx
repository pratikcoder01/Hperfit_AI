"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, Send, Camera, Activity, Zap, Watch, Volume2 } from "lucide-react";

export default function HyperCoachInterface() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "I see your HRV is at 42ms today and you didn't sleep well. I've overridden your heavy deadlifts. We're doing active recovery. Ready?", type: "adaptive" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", text: input, type: "text" }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    // Simulate AI LangGraph Routing Delay
    setTimeout(() => {
      let aiResponse = "I'm analyzing your biometrics...";
      let type = "text";
      if (input.toLowerCase().includes("tired")) {
        aiResponse = "Listen to me. I know you're tired. But we didn't start this journey to quit when it gets hard. Put your shoes on. 10 minutes. That's all I'm asking for.";
        type = "motivation";
      } else if (input.toLowerCase().includes("food")) {
        aiResponse = "I'm calculating your macros based on your current glycogen depletion. I'm adding 30g of protein to your next meal. Scanning your pantry...";
        type = "nutrition";
      }
      
      setMessages([...newMessages, { role: "ai", text: aiResponse, type }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-2rem)] bg-[#020617] rounded-3xl border border-[#00F5D4]/20 flex flex-col overflow-hidden relative shadow-[0_0_50px_rgba(0,245,212,0.05)]">
      
      {/* Top Bar - Live Telemetry */}
      <div className="h-16 border-b border-[#00F5D4]/20 bg-[#020617]/80 backdrop-blur-md flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00F5D4] to-[#7B2CBF] flex items-center justify-center relative">
            <Zap className="w-5 h-5 text-[#0B0F19]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F5D4] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00F5D4]"></span>
            </span>
          </div>
          <div>
            <h2 className="text-white font-bold tracking-wider">HYPER<span className="text-[#00F5D4]">COACH</span></h2>
            <p className="text-[10px] text-[#00F5D4] font-mono tracking-widest flex items-center gap-1">
              <Volume2 className="w-3 h-3 animate-pulse" /> LIVE VOICE SYNC
            </p>
          </div>
        </div>

        {/* Wearable Sync Indicators */}
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#00F5D4]/10 rounded-full border border-[#00F5D4]/20">
            <Activity className="w-3 h-3 text-[#00F5D4]" />
            <span className="text-xs text-[#00F5D4] font-mono">HRV: 42ms</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-[#7B2CBF]/10 rounded-full border border-[#7B2CBF]/20">
            <Watch className="w-3 h-3 text-[#7B2CBF]" />
            <span className="text-xs text-[#7B2CBF] font-mono">APPLE WATCH SYNCED</span>
          </div>
        </div>
      </div>

      {/* Holographic Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(0,245,212,0.05)_0%,_rgba(2,6,23,1)_70%)]" />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10 scrollbar-hide">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] p-4 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-r from-[#00F5D4]/20 to-[#00F5D4]/10 border border-[#00F5D4]/30 text-white rounded-br-none' 
                  : msg.type === 'motivation' 
                    ? 'bg-gradient-to-r from-rose-500/20 to-orange-500/10 border border-rose-500/30 text-rose-100 rounded-bl-none shadow-[0_0_20px_rgba(244,63,94,0.1)]'
                    : 'bg-[#0F172A]/80 border border-[#7B2CBF]/30 text-blue-50 rounded-bl-none backdrop-blur-md'
              }`}>
                {msg.role === 'ai' && (
                  <p className="text-[10px] uppercase tracking-widest text-[#7B2CBF] mb-2 font-mono flex items-center gap-1">
                    {msg.type === 'adaptive' && <Activity className="w-3 h-3" />}
                    {msg.type === 'motivation' && <Zap className="w-3 h-3 text-rose-500" />}
                    {msg.type === 'adaptive' ? 'WORKOUT AGENT OVERRIDE' : msg.type === 'motivation' ? 'MOTIVATION ENGINE' : 'COACH RESPONSE'}
                  </p>
                )}
                <p className="text-sm leading-relaxed font-light">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          {isTyping && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
               <div className="bg-[#0F172A]/80 border border-[#7B2CBF]/30 p-4 rounded-2xl rounded-bl-none w-24 flex justify-center gap-1">
                 <div className="w-2 h-2 rounded-full bg-[#00F5D4] animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-2 h-2 rounded-full bg-[#00F5D4] animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-2 h-2 rounded-full bg-[#00F5D4] animate-bounce" style={{ animationDelay: '300ms' }} />
               </div>
             </motion.div>
          )}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 bg-[#020617]/80 backdrop-blur-md border-t border-[#00F5D4]/20 z-20">
        <div className="relative flex items-center">
          <button className="absolute left-4 text-[#00F5D4]/60 hover:text-[#00F5D4] transition-colors">
            <Camera className="w-5 h-5" />
          </button>
          
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Tell me how you feel, log a meal, or ask for form check..."
            className="w-full bg-[#0F172A] border border-[#00F5D4]/30 rounded-full py-4 pl-12 pr-24 text-sm text-white placeholder-blue-200/30 focus:outline-none focus:border-[#00F5D4] focus:shadow-[0_0_15px_rgba(0,245,212,0.2)] transition-all"
          />
          
          <div className="absolute right-2 flex items-center gap-2">
            <button className="w-10 h-10 rounded-full bg-[#7B2CBF]/20 text-[#7B2CBF] flex items-center justify-center hover:bg-[#7B2CBF]/40 transition-colors">
              <Mic className="w-4 h-4" />
            </button>
            <button 
              onClick={handleSend}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00F5D4] to-[#7B2CBF] text-[#0B0F19] flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Send className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] text-blue-200/30 mt-3 font-mono tracking-widest">
          AI AGENT ORCHESTRATOR ONLINE // MULTI-MODAL SENSORS ACTIVE
        </p>
      </div>

    </div>
  );
}
