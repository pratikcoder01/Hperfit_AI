"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Crown, TrendingUp, TrendingDown, Minus, Filter, Search, Award } from "lucide-react";
import type { LeaderboardEntry } from "@/types/gamification";

const MOCK_ENTRIES: LeaderboardEntry[] = [
  { userId: "u1", name: "Sarah Chen", avatarUrl: "", rank: 1, score: 12450, level: 42, trend: "same" },
  { userId: "u2", name: "Marcus Rodriguez", avatarUrl: "", rank: 2, score: 11800, level: 38, trend: "up" },
  { userId: "u3", name: "Elena Volkov", avatarUrl: "", rank: 3, score: 10200, level: 35, trend: "down" },
  { userId: "u4", name: "David Kim", avatarUrl: "", rank: 4, score: 9400, level: 31, trend: "up" },
  { userId: "u5", name: "Amara Okoro", avatarUrl: "", rank: 5, score: 8900, level: 29, trend: "same" },
  { userId: "u6", name: "James Wilson", avatarUrl: "", rank: 6, score: 7600, level: 25, trend: "down" },
  { userId: "u7", name: "You", avatarUrl: "", rank: 241, score: 2450, level: 12, trend: "up" },
];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"global" | "friends" | "gym">("global");
  const [activeCategory, setActiveCategory] = useState<"xp" | "form" | "workouts">("xp");

  const topThree = MOCK_ENTRIES.slice(0, 3);
  const others = MOCK_ENTRIES.slice(3, 6);
  const currentUser = MOCK_ENTRIES[6];

  return (
    <div className="space-y-8 pb-10">
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-white/5 rounded-xl p-1 border border-white/10 w-full md:w-auto">
          {["global", "friends", "gym"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 md:flex-none px-6 py-2 text-xs font-bold rounded-lg transition-all capitalize ${
                activeTab === tab ? "bg-[#7B2CBF] text-white shadow-lg shadow-[#7B2CBF]/20" : "text-[#94A3B8] hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input 
              type="text" 
              placeholder="Search athletes..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#7B2CBF]/50 transition-all"
            />
          </div>
          <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#94A3B8] hover:text-white transition-all">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Podium Section */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-4 pt-10">
        {/* Rank 2 */}
        <div className="order-2 md:order-1 flex flex-col items-center">
          <motion.div 
            className="w-24 h-24 rounded-full bg-white/5 border-2 border-slate-400 relative mb-4"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
          >
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-400 text-[#0B0F19] text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Silver</div>
             <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white/20">2</div>
          </motion.div>
          <div className="text-center">
            <p className="font-bold text-white text-sm">{topThree[1].name}</p>
            <p className="text-[#00F5D4] text-xs font-black">{topThree[1].score.toLocaleString()} XP</p>
          </div>
          <div className="h-24 w-28 bg-gradient-to-t from-slate-400/20 to-transparent mt-4 rounded-t-2xl border-t border-slate-400/30" />
        </div>

        {/* Rank 1 */}
        <div className="order-1 md:order-2 flex flex-col items-center z-10">
          <motion.div 
            className="w-32 h-32 rounded-full bg-white/5 border-4 border-[#F59E0B] relative mb-6 shadow-[0_0_40px_rgba(245,158,11,0.15)]"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          >
             <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <Crown className="w-8 h-8 text-[#F59E0B] fill-[#F59E0B]" />
             </div>
             <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white/20">1</div>
          </motion.div>
          <div className="text-center">
            <p className="font-black text-white text-lg">{topThree[0].name}</p>
            <p className="text-[#00F5D4] text-sm font-black">{topThree[0].score.toLocaleString()} XP</p>
          </div>
          <div className="h-32 w-32 bg-gradient-to-t from-[#F59E0B]/20 to-transparent mt-4 rounded-t-2xl border-t border-[#F59E0B]/40" />
        </div>

        {/* Rank 3 */}
        <div className="order-3 md:order-3 flex flex-col items-center">
          <motion.div 
            className="w-24 h-24 rounded-full bg-white/5 border-2 border-amber-700 relative mb-4"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          >
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-700 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">Bronze</div>
             <div className="w-full h-full flex items-center justify-center text-3xl font-black text-white/20">3</div>
          </motion.div>
          <div className="text-center">
            <p className="font-bold text-white text-sm">{topThree[2].name}</p>
            <p className="text-[#00F5D4] text-xs font-black">{topThree[2].score.toLocaleString()} XP</p>
          </div>
          <div className="h-16 w-28 bg-gradient-to-t from-amber-700/20 to-transparent mt-4 rounded-t-2xl border-t border-amber-700/30" />
        </div>
      </div>

      {/* Categories Bar */}
      <div className="flex gap-4 justify-center py-4 border-y border-white/5">
        {[
          { id: "xp", label: "XP Points", icon: Award },
          { id: "form", label: "Form Quality", icon: Medal },
          { id: "workouts", label: "Consistency", icon: Trophy },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === cat.id ? "text-white bg-white/10" : "text-[#94A3B8] hover:text-white"
            }`}
          >
            <cat.icon className={`w-4 h-4 ${activeCategory === cat.id ? "text-[#00F5D4]" : ""}`} />
            {cat.label}
          </button>
        ))}
      </div>

      {/* Table List */}
      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-[60px_1fr_100px_100px_60px] p-4 bg-white/5 text-[10px] font-black uppercase tracking-widest text-[#94A3B8] border-b border-white/5">
          <span>Rank</span>
          <span>Athlete</span>
          <span className="text-right">Level</span>
          <span className="text-right">Score</span>
          <span className="text-center">Trend</span>
        </div>

        <div className="divide-y divide-white/5">
          {others.map((entry, i) => (
            <motion.div 
              key={entry.userId} 
              className="grid grid-cols-[60px_1fr_100px_100px_60px] items-center p-4 hover:bg-white/5 transition-colors"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + (i * 0.05) }}
            >
              <span className="font-black text-white text-lg opacity-40">{entry.rank}</span>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">{entry.name[0]}</div>
                <span className="text-sm font-bold text-white">{entry.name}</span>
              </div>
              <span className="text-right text-xs font-bold text-[#7B2CBF]">Lvl {entry.level}</span>
              <span className="text-right text-sm font-black text-white">{entry.score.toLocaleString()}</span>
              <div className="flex justify-center">
                {entry.trend === "up" ? <TrendingUp className="w-4 h-4 text-[#00F5D4]" /> : entry.trend === "down" ? <TrendingDown className="w-4 h-4 text-[#EF4444]" /> : <Minus className="w-4 h-4 text-[#94A3B8]" />}
              </div>
            </motion.div>
          ))}

          {/* Current User Row - Pinned style */}
          <div className="grid grid-cols-[60px_1fr_100px_100px_60px] items-center p-4 bg-[#7B2CBF]/10 border-y-2 border-[#7B2CBF]/30 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-1 bg-[#7B2CBF] text-[8px] font-bold text-white rounded-bl-lg">YOU</div>
             <span className="font-black text-white text-lg">{currentUser.rank}</span>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7B2CBF] to-[#00F5D4] flex items-center justify-center font-bold text-xs text-[#0B0F19]">P</div>
                <span className="text-sm font-bold text-white">{currentUser.name}</span>
              </div>
              <span className="text-right text-xs font-bold text-[#7B2CBF]">Lvl {currentUser.level}</span>
              <span className="text-right text-sm font-black text-white">{currentUser.score.toLocaleString()}</span>
              <div className="flex justify-center">
                <TrendingUp className="w-4 h-4 text-[#00F5D4]" />
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
