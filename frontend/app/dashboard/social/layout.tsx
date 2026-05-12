"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Globe, Trophy, Medal, Users, Flame } from "lucide-react";
import { useGamificationStore } from "@/store/gamificationStore";
import { useSocialSocket } from "@/hooks/useSocialSocket";

const TABS = [
  { name: "Social Feed", href: "/dashboard/social", icon: Globe },
  { name: "Challenges", href: "/dashboard/social/challenges", icon: Trophy },
  { name: "Leaderboard", href: "/dashboard/social/leaderboard", icon: Medal },
  { name: "Communities", href: "/dashboard/social/communities", icon: Users },
];

export default function SocialLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { xpData } = useGamificationStore();
  
  // Initialize real-time social events
  useSocialSocket();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Gamification Header Bar */}
      <motion.div className="glass-card p-4 flex flex-col md:flex-row items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        
        {/* User Rank Info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-xl"
              style={{ background: "linear-gradient(135deg, #00F5D4, #7B2CBF)", color: "#0B0F19" }}>
              {xpData.level}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0B0F19] rounded-full flex items-center justify-center border border-white/10">
              <span className="text-[10px]">⭐</span>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-white text-lg leading-tight">{xpData.rankName}</h2>
            <p className="text-xs text-[#00F5D4] font-semibold">{xpData.totalXP} XP Total</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 max-w-md w-full">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-[#94A3B8]">Level {xpData.level}</span>
            <span className="text-[#94A3B8]">Next Level: {xpData.xpToNextLevel} XP</span>
          </div>
          <div className="h-2.5 rounded-full bg-white/5 overflow-hidden">
            <motion.div className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #7B2CBF, #00F5D4)" }}
              initial={{ width: 0 }} animate={{ width: `${xpData.progressPercentage}%` }}
              transition={{ duration: 1, delay: 0.2 }} />
          </div>
        </div>

        {/* Streak */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <Flame className="w-5 h-5 text-[#F59E0B]" />
          <div>
            <p className="text-xs text-[#F59E0B] font-bold leading-tight">{xpData.currentStreak} Day</p>
            <p className="text-[10px] text-[#F59E0B]/70">Streak</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link key={tab.href} href={tab.href}>
              <button className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                isActive 
                  ? "bg-[#7B2CBF] text-white shadow-[0_0_20px_rgba(123,44,191,0.4)]" 
                  : "bg-white/5 text-[#94A3B8] hover:text-white hover:bg-white/10"
              }`}>
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            </Link>
          );
        })}
      </div>

      {/* Page Content */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
