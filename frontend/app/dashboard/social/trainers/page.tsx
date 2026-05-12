"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Users, Briefcase, ChevronRight, Filter, ShieldCheck, Zap, Heart } from "lucide-react";
import type { TrainerProfile } from "@/types/social";

const MOCK_TRAINERS: Partial<TrainerProfile>[] = [
  {
    id: "t1",
    name: "Vikram Singh",
    username: "@vikram_pro",
    bio: "Ex-Olympic strength coach. Specializing in hypertrophy and powerlifting with AI-driven form correction.",
    specialties: ["Strength", "Hypertrophy", "Powerlifting"],
    rating: 4.9,
    clientCount: 124,
    isVerified: true,
    level: 85,
  },
  {
    id: "t2",
    name: "Sarah Miller",
    username: "@sarah_fit_ai",
    bio: "Transformation specialist. Focused on sustainable fat loss and functional movement patterns.",
    specialties: ["Fat Loss", "Functional", "Yoga"],
    rating: 4.8,
    clientCount: 210,
    isVerified: true,
    level: 72,
  },
  {
    id: "t3",
    name: "David Chen",
    username: "@chen_hiit",
    bio: "Master of HIIT. High-intensity coaching for busy professionals. 15-minute effective burns.",
    specialties: ["HIIT", "Cardio", "Weight Loss"],
    rating: 5.0,
    clientCount: 85,
    isVerified: false,
    level: 64,
  }
];

export default function TrainerMarketplacePage() {
  const [filter, setFilter] = useState("All");

  return (
    <div className="space-y-8">
      {/* Search & Hero */}
      <div className="relative p-8 rounded-3xl overflow-hidden border border-[#7B2CBF]/20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7B2CBF]/10 via-transparent to-[#00F5D4]/5 pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl font-black text-white leading-tight">Connect with <span className="gradient-neon">Expert Coaches</span></h2>
          <p className="text-[#94A3B8] text-sm mt-2">Get personalized guidance, custom AI-assisted workout plans, and real-time form feedback from the world's best trainers.</p>
          
          <div className="flex gap-3 mt-6">
            <input 
              type="text" 
              placeholder="Search by specialty (e.g. HIIT, Strength)..." 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#7B2CBF]/50"
            />
            <button className="px-6 py-3 bg-[#7B2CBF] hover:bg-[#6D28AA] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#7B2CBF]/20">
              Find Trainer
            </button>
          </div>
        </div>
      </div>

      {/* Specialty Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["All", "Strength", "HIIT", "Yoga", "Cardio", "Fat Loss", "Athletics"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
              filter === s ? "bg-white text-[#0B0F19] border-white" : "text-[#94A3B8] border-white/10 hover:border-white/30"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Trainer Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_TRAINERS.map((trainer, i) => (
          <motion.div
            key={trainer.id}
            className="glass-card overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center font-black text-2xl text-white relative">
                   {trainer.name?.[0]}
                   <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#7B2CBF] border-2 border-[#0B0F19] flex items-center justify-center">
                     <span className="text-[10px] font-bold">L{trainer.level}</span>
                   </div>
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1 text-[#F59E0B]">
                     <Star className="w-4 h-4 fill-current" />
                     <span className="text-sm font-black">{trainer.rating}</span>
                   </div>
                   <button className="p-2 text-[#94A3B8] hover:text-[#EF4444] transition-colors">
                     <Heart className="w-4 h-4" />
                   </button>
                </div>
              </div>

              {/* Bio */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <h4 className="font-bold text-white">{trainer.name}</h4>
                  {trainer.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-[#00F5D4]" />}
                </div>
                <p className="text-[#94A3B8] text-xs font-medium">{trainer.username}</p>
                <p className="text-[#CBD5E1] text-[11px] mt-2 leading-relaxed line-clamp-2">{trainer.bio}</p>
              </div>

              {/* Specialties */}
              <div className="flex flex-wrap gap-2">
                {trainer.specialties?.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-[#7B2CBF]/10 text-[#7B2CBF] text-[9px] font-bold border border-[#7B2CBF]/20">
                    {s}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-2 py-3 border-y border-white/5">
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-[#00F5D4]" />
                  <div>
                    <p className="text-white font-bold text-[10px]">{trainer.clientCount}</p>
                    <p className="text-[#94A3B8] text-[8px] uppercase">Clients</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
                  <div>
                    <p className="text-white font-bold text-[10px]">AI-Assisted</p>
                    <p className="text-[#94A3B8] text-[8px] uppercase">Method</p>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button className="w-full py-2.5 rounded-xl bg-white text-[#0B0F19] font-bold text-xs hover:bg-[#00F5D4] transition-all flex items-center justify-center gap-2">
                View Programs <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA Footer */}
      <div className="glass-card p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#00F5D4]/10 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-[#00F5D4]" />
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">Are you a Professional Trainer?</h4>
            <p className="text-[#94A3B8] text-xs">Join our ecosystem, manage clients with AI, and scale your business.</p>
          </div>
        </div>
        <button className="px-5 py-2.5 rounded-xl border border-[#00F5D4]/30 text-[#00F5D4] font-bold text-xs hover:bg-[#00F5D4]/10 transition-all">
          Apply as Trainer
        </button>
      </div>
    </div>
  );
}
