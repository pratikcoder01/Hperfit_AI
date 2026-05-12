import { create } from "zustand";
import type { UserXPData, Achievement } from "@/types/gamification";

interface GamificationState {
  xpData: UserXPData;
  recentAchievements: Achievement[];
  isLevelUpAnimationPlaying: boolean;
  
  // Actions
  addXP: (amount: number, reason: string) => void;
  unlockAchievement: (achievement: Achievement) => void;
  dismissAchievement: (id: string) => void;
  clearLevelUpAnimation: () => void;
}

const INITIAL_XP: UserXPData = {
  totalXP: 2450,
  level: 12,
  rankName: "Bronze Athlete",
  currentStreak: 5,
  longestStreak: 14,
  xpToNextLevel: 3000,
  progressPercentage: 81,
};

export const useGamificationStore = create<GamificationState>((set) => ({
  xpData: INITIAL_XP,
  recentAchievements: [],
  isLevelUpAnimationPlaying: false,

  addXP: (amount, reason) => set((state) => {
    const newTotal = state.xpData.totalXP + amount;
    let newLevel = state.xpData.level;
    let newProgress = ((newTotal % 1000) / 1000) * 100; // Simplified logic
    let leveledUp = false;

    if (newTotal >= state.xpData.xpToNextLevel) {
      newLevel += 1;
      leveledUp = true;
    }

    return {
      xpData: {
        ...state.xpData,
        totalXP: newTotal,
        level: newLevel,
        progressPercentage: newProgress,
      },
      isLevelUpAnimationPlaying: leveledUp,
    };
  }),

  unlockAchievement: (achievement) => set((state) => ({
    recentAchievements: [...state.recentAchievements, achievement],
  })),

  dismissAchievement: (id) => set((state) => ({
    recentAchievements: state.recentAchievements.filter((a) => a.id !== id),
  })),

  clearLevelUpAnimation: () => set({ isLevelUpAnimationPlaying: false }),
}));
