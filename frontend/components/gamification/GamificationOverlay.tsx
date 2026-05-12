"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Zap, X, Flame } from "lucide-react";
import { useGamificationStore } from "@/store/gamificationStore";
import confetti from "canvas-confetti";

export function GamificationOverlay() {
  const { 
    recentAchievements, 
    isLevelUpAnimationPlaying, 
    xpData, 
    dismissAchievement, 
    clearLevelUpAnimation 
  } = useGamificationStore();

  // Trigger confetti on level up
  useEffect(() => {
    if (isLevelUpAnimationPlaying) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#7B2CBF", "#00F5D4", "#F59E0B"],
      });
      
      const timer = setTimeout(clearLevelUpAnimation, 5000);
      return () => clearTimeout(timer);
    }
  }, [isLevelUpAnimationPlaying, clearLevelUpAnimation]);

  return (
    <>
      {/* ── Level Up Cinematic ── */}
      <AnimatePresence>
        {isLevelUpAnimationPlaying && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0B0F19]/90 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="text-center space-y-6"
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <div className="relative inline-block">
                <motion.div 
                  className="w-32 h-32 rounded-full bg-gradient-to-br from-[#7B2CBF] to-[#00F5D4] flex items-center justify-center"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Star className="w-16 h-16 text-[#0B0F19] fill-[#0B0F19]" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic">Level Up!</h2>
                <p className="text-2xl font-bold gradient-neon">You reached Level {xpData.level}</p>
                <p className="text-[#94A3B8] max-w-xs mx-auto">New rewards and challenges have been unlocked in your dashboard.</p>
              </div>

              <div className="flex gap-4 justify-center">
                <div className="px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white font-bold text-sm">
                   Rank: {xpData.rankName}
                </div>
              </div>

              <button 
                onClick={clearLevelUpAnimation}
                className="px-8 py-3 rounded-2xl bg-white text-[#0B0F19] font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                Continue Mission
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Achievement Toasts ── */}
      <div className="fixed bottom-6 right-6 z-[90] space-y-3 pointer-events-none">
        <AnimatePresence>
          {recentAchievements.map((achievement) => (
            <motion.div
              key={achievement.id}
              className="w-80 glass-card p-4 flex gap-4 pointer-events-auto shadow-2xl border-l-4 border-[#F59E0B]"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
            >
              <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6 text-[#F59E0B]" />
              </div>
              <div className="flex-1 pr-6">
                <p className="text-[10px] font-black text-[#F59E0B] uppercase tracking-widest mb-0.5">Achievement Unlocked</p>
                <h4 className="font-bold text-white text-sm">{achievement.name}</h4>
                <p className="text-[11px] text-[#94A3B8] mt-1 leading-tight">{achievement.description}</p>
                <div className="mt-2 flex items-center gap-1 text-[10px] font-black text-[#00F5D4]">
                  <Zap className="w-3 h-3" /> +{achievement.xpReward} XP Earned
                </div>
              </div>
              <button 
                onClick={() => dismissAchievement(achievement.id)}
                className="absolute top-2 right-2 p-1 text-[#94A3B8] hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
