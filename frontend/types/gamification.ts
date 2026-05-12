// ─────────────────────────────────────────────
//  HyperFitness Phase 4 — Gamification Types
// ─────────────────────────────────────────────

export interface UserXPData {
  totalXP: number;
  level: number;
  rankName: string;
  currentStreak: number;
  longestStreak: number;
  xpToNextLevel: number;
  progressPercentage: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpReward: number;
  unlockedAt?: string;
  isUnlocked: boolean;
  progress?: {
    current: number;
    target: number;
  };
}

export type ChallengeType = "global" | "community" | "private";
export type ChallengeGoalType = "reps" | "workouts" | "distance" | "calories";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  startDate: string;
  endDate: string;
  goalType: ChallengeGoalType;
  goalValue: number;
  rewardXP: number;
  participantCount: number;
  thumbnailUrl?: string;
}

export interface LeaderboardEntry {
  userId: string;
  name: string;
  avatarUrl: string;
  rank: number;
  score: number;
  level: number;
  trend: "up" | "down" | "same";
}

export interface Leaderboard {
  id: string;
  title: string;
  period: "daily" | "weekly" | "all_time";
  entries: LeaderboardEntry[];
  currentUserEntry?: LeaderboardEntry;
}

export const RANKS = [
  { level: 1, name: "Iron Novice", color: "#94A3B8" },
  { level: 10, name: "Bronze Athlete", color: "#D97706" },
  { level: 25, name: "Silver Contender", color: "#9CA3AF" },
  { level: 50, name: "Gold Warrior", color: "#FBBF24" },
  { level: 75, name: "Platinum Elite", color: "#00F5D4" },
  { level: 100, name: "Diamond Master", color: "#7B2CBF" },
  { level: 150, name: "Hyper Beast", color: "#EF4444" },
];
