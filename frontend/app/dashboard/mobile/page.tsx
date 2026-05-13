"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, Heart, Zap, Shield, Sparkles, 
  Activity, Moon, Brain, ChevronRight, Play,
  Bell, Settings, User as UserIcon, LayoutGrid,
  Trophy, Globe
} from "lucide-react";
import { useGamificationStore } from "@/store/gamificationStore";

// ── Mobile Components ──────────────────────────

function HealthRing({ value, max, label, color, icon: Icon }: { 
  value: number; 
  max: number; 
  label: string; 
  color: string; 
  icon: any 
}) {
  const r = 32;
  const c = 2 * Math.PI * r;
  const dash = (value / max) * c;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <svg width="80" height="80" className="-rotate-90">
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
          <motion.circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
            strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c - dash }}
            transition={{ duration: 1.5, ease: "easeOut" }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <div className="text-center">
        <p className="text-[10px] text-[#94A3B8] font-bold uppercase">{label}</p>
        <p className="text-sm font-black text-white">{value}%</p>
      </div>
    </div>
  );
}

// ── Main Mobile Dashboard ──────────────────────

export default function MobileSuperAppPage() {
  const { xpData } = useGamificationStore();
  const [isListening, setIsListening] = useState(false);
  const [coachMessage, setCoachMessage] = useState("Your recovery is at 85%. Today is a perfect day for a high-intensity session.");

  return (
    <div className="max-w-md mx-auto space-y-6 pb-24">
      
      {/* Mobile Top Bar */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B2CBF] to-[#00F5D4] p-[1px]">
            <div className="w-full h-full rounded-full bg-[#0B0F19] flex items-center justify-center font-bold text-white">
              {xpData.level}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-black text-white leading-none">HyperFitness Pro</h2>
            <p className="text-[10px] text-[#00F5D4] font-bold mt-1 uppercase tracking-widest">Global Citizen</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-white" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full" />
          </button>
          <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Autonomous Coach Insight Card */}
      <motion.div 
        className="relative overflow-hidden p-5 rounded-[32px] border border-[#00F5D4]/20"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00F5D4]/10 via-transparent to-[#7B2CBF]/10" />
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00F5D4]" />
            <span className="text-[10px] font-black text-[#00F5D4] uppercase tracking-widest">Autonomous Coach</span>
          </div>
          <p className="text-lg font-bold text-white leading-snug">"{coachMessage}"</p>
          <div className="flex gap-2">
            <button className="flex-1 py-3 rounded-2xl bg-[#00F5D4] text-[#0B0F19] font-black text-xs">Start Session</button>
            <button className="flex-1 py-3 rounded-2xl bg-white/5 text-white font-bold text-xs">View Insights</button>
          </div>
        </div>
      </motion.div>

      {/* Health Intelligence Rings */}
      <div className="grid grid-cols-3 gap-2">
        <HealthRing value={85} max={100} label="Recovery" color="#00F5D4" icon={Zap} />
        <HealthRing value={92} max={100} label="Sleep" color="#7B2CBF" icon={Moon} />
        <HealthRing value={64} max={100} label="Energy" color="#F59E0B" icon={Activity} />
      </div>

      {/* Mobile-First Action Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "My AI Twin", icon: Brain, color: "#7B2CBF", sub: "View Prediction" },
          { label: "Wearables", icon: Shield, color: "#3B82F6", sub: "Sync Active" },
          { label: "Global SaaS", icon: LayoutGrid, color: "#F59E0B", sub: "Select Gym" },
          { label: "Transformation", icon: Sparkles, color: "#00F5D4", sub: "3D Visualizer" },
        ].map((item, i) => (
          <motion.div 
            key={item.label}
            className="glass-card p-4 flex flex-col gap-3 group active:scale-95 transition-all"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: item.color + "15" }}>
              <item.icon className="w-5 h-5" style={{ color: item.color }} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">{item.label}</p>
              <p className="text-[10px] text-[#94A3B8] font-medium">{item.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Wearable Pulse Feed */}
      <div className="glass-card p-5 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white text-sm">Real-time Biometrics</h3>
          <span className="text-[10px] text-[#EF4444] font-black flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-pulse" />
            LIVE SYNC
          </span>
        </div>
        <div className="space-y-3">
          {[
            { label: "Heart Rate", value: "72 BPM", color: "#EF4444" },
            { label: "Active Calories", value: "342 kcal", color: "#F59E0B" },
            { label: "Steps Today", value: "8,421", color: "#00F5D4" },
          ].map((stat) => (
            <div key={stat.label} className="flex justify-between items-center">
               <span className="text-xs text-[#94A3B8]">{stat.label}</span>
               <span className="text-sm font-black text-white">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Floating AI Voice Assistant Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <motion.button 
          className="relative group"
          animate={isListening ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
          onClick={() => setIsListening(!isListening)}
        >
          {/* Animated Background Pulse */}
          <div className="absolute inset-0 rounded-full bg-[#00F5D4]/20 blur-xl group-hover:bg-[#00F5D4]/40 transition-all" />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#00F5D4] to-[#7B2CBF] flex items-center justify-center shadow-[0_0_30px_rgba(0,245,212,0.4)]">
            <AnimatePresence mode="wait">
              {isListening ? (
                <motion.div key="wave" className="flex gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {[1, 2, 3, 4].map(i => (
                    <motion.div key={i} className="w-1 h-6 bg-[#0B0F19] rounded-full" animate={{ scaleY: [1, 2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }} />
                  ))}
                </motion.div>
              ) : (
                <motion.div key="mic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Mic className="w-8 h-8 text-[#0B0F19]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {/* Label */}
          <div className="absolute top-0 -translate-y-12 left-1/2 -translate-x-1/2 bg-[#0B0F19] border border-white/10 px-3 py-1 rounded-full whitespace-nowrap">
            <span className="text-[10px] font-black text-white tracking-widest uppercase">Ask AI Assistant</span>
          </div>
        </motion.button>
      </div>

      {/* Bottom Nav Bar (Simulated Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-[#0B0F19]/80 backdrop-blur-xl border-t border-white/5 px-8 flex items-center justify-between z-40">
        <LayoutGrid className="w-6 h-6 text-[#00F5D4]" />
        <Activity className="w-6 h-6 text-[#94A3B8]" />
        <div className="w-6 h-6" /> {/* Spacer for Mic */}
        <Trophy className="w-6 h-6 text-[#94A3B8]" />
        <UserIcon className="w-6 h-6 text-[#94A3B8]" />
      </div>
    </div>
  );
}
