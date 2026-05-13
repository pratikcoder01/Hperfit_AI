"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Dumbbell, Activity, Cpu, ShieldAlert, Zap } from "lucide-react";

export default function AIWorkoutEngine() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API Call to /api/v1/ai/generate/workout
    setTimeout(() => {
      setPlan({
        split_name: "Hypertrophy Push/Pull/Legs",
        current_phase: "Accumulation (Week 2/8)",
        today_workout: {
            day: "Legs",
            estimated_duration_mins: 60,
            warmup: ["5 min Assault Bike", "Dynamic Hip Mobility", "90/90 Stretches"],
            exercises: [
                { name: "Glute Bridges", sets: 3, reps: "10-12", rpe: 7 },
                { name: "Lying Leg Curls", sets: 3, reps: "10-12", rpe: 8 },
                { name: "Calf Raises", sets: 3, reps: "15-20", rpe: 8 }
            ]
        },
        ai_coach_note: "I've reviewed your memory file. Since you have a history of knee issues, I completely removed heavy barbell squats and lunges. We are focusing on posterior chain isolation."
      });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00F5D4] to-[#7B2CBF] flex items-center justify-center shadow-[0_0_20px_rgba(0,245,212,0.3)]">
          <Dumbbell className="w-6 h-6 text-[#0B0F19]" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-wider">A.I. <span className="text-[#00F5D4]">WORKOUT ENGINE</span></h1>
          <p className="text-slate-400 font-mono text-sm mt-1">BIOMECHANICALLY OPTIMIZED KINEMATICS</p>
        </div>
      </div>

      {!plan ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#020617] border border-[#00F5D4]/20 rounded-3xl p-8 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00F5D4] to-[#7B2CBF]" />
          
          <Cpu className="w-16 h-16 text-[#00F5D4] mx-auto mb-6 animate-pulse" />
          <h2 className="text-xl font-bold text-white mb-4">Initialize Generation Sequence</h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-8 font-light">
            The engine will scan your AI Memory vector database for past injuries, current goals, and available equipment to construct a mathematically perfect hypertrophic stimulus plan.
          </p>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-8 py-4 bg-gradient-to-r from-[#00F5D4] to-[#7B2CBF] text-[#0B0F19] rounded-full font-bold tracking-wider hover:scale-105 transition-all shadow-[0_0_30px_rgba(0,245,212,0.2)] disabled:opacity-50"
          >
            {isGenerating ? "SCANNING MEMORY VECTORS..." : "GENERATE PROTOCOL"}
          </button>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Coach Note / Memory Override Alert */}
          <div className="bg-rose-900/20 border border-rose-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
            <div className="flex gap-4">
              <ShieldAlert className="w-6 h-6 text-rose-500 flex-shrink-0" />
              <div>
                <h3 className="text-rose-500 font-mono font-bold text-sm mb-2 tracking-widest">MEMORY OVERRIDE TRIGGERED</h3>
                <p className="text-rose-200 text-sm leading-relaxed font-light italic">
                  "{plan.ai_coach_note}"
                </p>
              </div>
            </div>
          </div>

          {/* Protocol Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 bg-[#020617] border border-[#00F5D4]/20 rounded-2xl p-6">
              <h3 className="text-[#00F5D4] font-mono text-xs tracking-widest mb-4">PROTOCOL TELEMETRY</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-slate-500 text-xs">SPLIT NAME</p>
                  <p className="text-white font-bold">{plan.split_name}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">PHASE</p>
                  <p className="text-white font-bold">{plan.current_phase}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-xs">DURATION</p>
                  <p className="text-white font-bold">{plan.today_workout.estimated_duration_mins} MIN</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 bg-[#020617] border border-[#7B2CBF]/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-[#7B2CBF] font-mono text-xs tracking-widest">EXERCISE MATRIX: {plan.today_workout.day.toUpperCase()}</h3>
                <span className="px-3 py-1 bg-[#7B2CBF]/20 text-[#7B2CBF] rounded-full text-[10px] font-bold">READY</span>
              </div>
              
              <div className="space-y-3">
                {plan.today_workout.exercises.map((ex: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-[#0F172A] rounded-xl border border-slate-800 hover:border-[#00F5D4]/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#00F5D4]/10 flex items-center justify-center text-[#00F5D4] font-mono text-xs">
                        {idx + 1}
                      </div>
                      <p className="text-white font-bold">{ex.name}</p>
                    </div>
                    <div className="flex gap-4 text-sm font-mono">
                      <div className="text-slate-400">SETS: <span className="text-white">{ex.sets}</span></div>
                      <div className="text-slate-400">REPS: <span className="text-white">{ex.reps}</span></div>
                      <div className="text-rose-400">RPE: <span className="text-white">{ex.rpe}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
