"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Calendar, Target, Flame, ChevronRight, Zap, Star } from "lucide-react";
import type { Challenge } from "@/types/gamification";

const MOCK_CHALLENGES: (Challenge & { progress: number })[] = [
  {
    id: "c1",
    title: "10k Pushup Month",
    description: "Build massive chest strength by hitting 10,000 pushups in 30 days. Form is monitored by AI.",
    type: "global",
    startDate: "2026-05-01",
    endDate: "2026-05-31",
    goalType: "reps",
    goalValue: 10000,
    rewardXP: 2500,
    participantCount: 4281,
    progress: 3450,
  },
  {
    id: "c2",
    title: "Consistency King",
    description: "Complete at least one workout every day for 21 days straight. No rest days allowed!",
    type: "community",
    startDate: "2026-05-10",
    endDate: "2026-05-31",
    goalType: "workouts",
    goalValue: 21,
    rewardXP: 1500,
    participantCount: 1250,
    progress: 3,
  },
  {
    id: "c3",
    title: "Fat Burner Sprint",
    description: "Burn 5,000 active calories through HIIT and Cardio sessions this week.",
    type: "private",
    startDate: "2026-05-12",
    endDate: "2026-05-19",
    goalType: "calories",
    goalValue: 5000,
    rewardXP: 1000,
    participantCount: 12,
    progress: 850,
  }
];

export default function ChallengesPage() {
  const [filter, setFilter] = useState<"all" | "global" | "private">("all");

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="glass-card p-5 border-l-4 border-[#F59E0B]">
          <div className="flex items-center gap-3 mb-2">
            <Trophy className="w-5 h-5 text-[#F59E0B]" />
            <span className="text-xs font-bold text-[#94A3B8] uppercase">Active Challenges</span>
          </div>
          <p className="text-2xl font-black text-white">3</p>
        </div>
        <div className="glass-card p-5 border-l-4 border-[#00F5D4]">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-[#00F5D4]" />
            <span className="text-xs font-bold text-[#94A3B8] uppercase">Potential XP</span>
          </div>
          <p className="text-2xl font-black text-white">5,000</p>
        </div>
        <div className="glass-card p-5 border-l-4 border-[#7B2CBF]">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-5 h-5 text-[#7B2CBF]" />
            <span className="text-xs font-bold text-[#94A3B8] uppercase">Global Rank</span>
          #241
          </div>
          <p className="text-2xl font-black text-white">Top 5%</p>
        </div>
      </div>

      {/* Challenge List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-[#EF4444]" />
            Current Missions
          </h3>
          <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
            {["all", "global", "private"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-3 py-1 text-xs font-bold rounded-md transition-all capitalize ${
                  filter === f ? "bg-[#7B2CBF] text-white" : "text-[#94A3B8] hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {MOCK_CHALLENGES.map((challenge, i) => {
          const pct = (challenge.progress / challenge.goalValue) * 100;
          return (
            <motion.div
              key={challenge.id}
              className="glass-card overflow-hidden group relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#7B2CBF]/10 to-transparent pointer-events-none" />

              <div className="p-5 flex flex-col md:flex-row gap-6 items-start">
                {/* Challenge Icon/Type */}
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  {challenge.type === "global" ? (
                    <Globe className="w-8 h-8 text-[#00F5D4]" />
                  ) : (
                    <Star className="w-8 h-8 text-[#F59E0B]" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-white text-xl">{challenge.title}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      challenge.type === "global" ? "bg-[#00F5D4]/10 text-[#00F5D4] border border-[#00F5D4]/20" : "bg-[#7B2CBF]/10 text-[#7B2CBF] border border-[#7B2CBF]/20"
                    }`}>
                      {challenge.type}
                    </span>
                  </div>
                  <p className="text-sm text-[#94A3B8] leading-relaxed max-w-2xl">{challenge.description}</p>
                  
                  <div className="flex flex-wrap gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-[#CBD5E1]">
                      <Users className="w-3.5 h-3.5 text-[#7B2CBF]" />
                      {challenge.participantCount.toLocaleString()} Participants
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#CBD5E1]">
                      <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
                      Ends {new Date(challenge.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#00F5D4]">
                      <Zap className="w-3.5 h-3.5" />
                      +{challenge.rewardXP} XP
                    </div>
                  </div>
                </div>

                {/* Progress Circle/Button */}
                <div className="w-full md:w-48 space-y-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#94A3B8]">Progress</span>
                    <span className="text-white font-bold">{Math.round(pct)}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#7B2CBF] to-[#00F5D4]"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-[10px] text-center text-[#94A3B8]">
                    {challenge.progress} / {challenge.goalValue} {challenge.goalType}
                  </p>
                  <button className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    View Details <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State / Call to Action */}
      <div className="p-8 rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-[#94A3B8]/20" />
        </div>
        <div>
          <h4 className="text-white font-bold">Create a Private Challenge</h4>
          <p className="text-sm text-[#94A3B8] mt-1 max-w-sm mx-auto">Invite your friends to a custom fitness showdown and track progress in real-time.</p>
        </div>
        <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#7B2CBF] to-[#6D28AA] text-white font-bold text-sm shadow-xl hover:shadow-[#7B2CBF]/20 transition-all">
          Start Private Challenge
        </button>
      </div>
    </div>
  );
}

// Missing import fix
function Globe(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
