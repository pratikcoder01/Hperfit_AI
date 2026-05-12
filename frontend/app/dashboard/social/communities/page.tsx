"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Plus, Hash, ShieldCheck, ChevronRight, MessageSquare, Search } from "lucide-react";

const MOCK_COMMUNITIES = [
  {
    id: "com1",
    name: "Calisthenics Crew",
    description: "Mastering bodyweight strength. Handstands, muscle-ups, and planche training.",
    memberCount: 4250,
    isPrivate: false,
    tag: "strength",
  },
  {
    id: "com2",
    name: "Early Bird HIIT",
    description: "Morning warriors crushing high-intensity intervals before the world wakes up.",
    memberCount: 1840,
    isPrivate: false,
    tag: "cardio",
  },
  {
    id: "com3",
    name: "Elite Iron",
    description: "Heavy lifting and bodybuilding for competitive athletes only.",
    memberCount: 520,
    isPrivate: true,
    tag: "hypertrophy",
  },
  {
    id: "com4",
    name: "Yoga Flow",
    description: "Daily mindfulness, mobility, and deep stretch sessions.",
    memberCount: 3100,
    isPrivate: false,
    tag: "wellness",
  }
];

export default function CommunitiesPage() {
  const [activeTab, setActiveTab] = useState<"explore" | "my_groups">("explore");

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input 
            type="text" 
            placeholder="Search for a community..." 
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white focus:outline-none focus:border-[#7B2CBF]/50"
          />
        </div>
        <button className="px-6 bg-[#7B2CBF] hover:bg-[#6D28AA] text-white font-bold rounded-2xl text-sm transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create Group
        </button>
      </div>

      {/* Toggle */}
      <div className="flex gap-4 border-b border-white/5">
        {["explore", "my_groups"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`pb-3 text-sm font-bold transition-all border-b-2 capitalize ${
              activeTab === tab ? "border-[#00F5D4] text-[#00F5D4]" : "border-transparent text-[#94A3B8] hover:text-white"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Community Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {MOCK_COMMUNITIES.map((community, i) => (
          <motion.div
            key={community.id}
            className="glass-card p-5 group cursor-pointer hover:border-[#00F5D4]/30 transition-all"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7B2CBF] to-[#00F5D4] flex items-center justify-center font-black text-2xl text-[#0B0F19]">
                {community.name[0]}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white">{community.name}</h4>
                    {community.isPrivate && <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />}
                  </div>
                  <span className="text-[10px] text-[#00F5D4] font-black uppercase tracking-wider">#{community.tag}</span>
                </div>
                <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">{community.description}</p>
                
                <div className="flex items-center gap-4 pt-3">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#CBD5E1] font-bold">
                    <Users className="w-3.5 h-3.5 text-[#7B2CBF]" />
                    {community.memberCount.toLocaleString()} Members
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#CBD5E1] font-bold">
                    <MessageSquare className="w-3.5 h-3.5 text-[#00F5D4]" />
                    24 New Posts
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <ChevronRight className="w-5 h-5 text-[#94A3B8] group-hover:text-white transition-colors" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Featured Community Banner */}
      <div className="p-8 rounded-3xl relative overflow-hidden bg-slate-900 border border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-10" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <Hash className="w-5 h-5 text-[#00F5D4]" />
               <span className="text-xs font-black text-[#00F5D4] uppercase tracking-widest">Featured Community</span>
            </div>
            <h3 className="text-2xl font-black text-white">Marathon Prep 2026</h3>
            <p className="text-[#94A3B8] text-sm max-w-md">The biggest running community on HyperFitness. Training for the Berlin & Tokyo majors. Free plans included.</p>
          </div>
          <button className="px-8 py-3 bg-[#00F5D4] text-[#0B0F19] font-black rounded-2xl transition-all shadow-lg shadow-[#00F5D4]/20 hover:scale-105 active:scale-95">
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
}
