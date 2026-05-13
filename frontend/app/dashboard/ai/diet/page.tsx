"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Salad, Flame, Droplets, HeartPulse, Sparkles, ChefHat } from "lucide-react";

export default function AIDietEngine() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [dietType, setDietType] = useState("indian_vegetarian");
  const [plan, setPlan] = useState<any>(null);

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate API Call to /api/v1/ai/generate/diet
    setTimeout(() => {
      setPlan({
        daily_targets: {
            target_calories: 2350,
            protein_g: 165,
            carbs_g: 250,
            fats_g: 68
        },
        meals: [
            { name: dietType === "indian_vegetarian" ? "High-Protein Poha & Soy Chunks" : "Eggs & Oatmeal", calories: 450, protein: 35, carbs: 50, fats: 12, time: "08:00 AM" },
            { name: dietType === "indian_vegetarian" ? "Paneer Tikka Salad & Lentils" : "Chicken Breast & Sweet Potato", calories: 600, protein: 50, carbs: 65, fats: 15, time: "01:30 PM" },
            { name: "Whey Protein & Banana", calories: 250, protein: 25, carbs: 30, fats: 3, time: "05:00 PM" },
            { name: dietType === "indian_vegetarian" ? "Tofu Curry & Brown Rice" : "Grilled Salmon & Asparagus", calories: 500, protein: 40, carbs: 45, fats: 18, time: "08:30 PM" }
        ],
        hydration_target_liters: 3.5,
        ai_coach_note: dietType === "indian_vegetarian" 
            ? "I've optimized this plan for your student budget. We are hitting 165g of protein purely through high-bioavailability vegetarian sources like Paneer and Soy."
            : "Clean, simple, effective. Stick to these macros and you will drop 0.5kg of fat this week."
      });
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-[#00F5D4] flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
          <Salad className="w-6 h-6 text-[#0B0F19]" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-white tracking-wider">A.I. <span className="text-emerald-400">DIET ENGINE</span></h1>
          <p className="text-slate-400 font-mono text-sm mt-1">DETERMINISTIC MACRO SOLVER</p>
        </div>
      </div>

      {!plan ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#020617] border border-emerald-500/20 rounded-3xl p-8 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-[#00F5D4]" />
          
          <ChefHat className="w-16 h-16 text-emerald-400 mx-auto mb-6 animate-pulse" />
          <h2 className="text-xl font-bold text-white mb-4">Metabolic Profiling</h2>
          <p className="text-slate-400 max-w-lg mx-auto mb-8 font-light">
            The AI uses the Mifflin-St Jeor equation to perfectly calculate your Basal Metabolic Rate, then mathematically forces the LLM to generate recipes that match your exact macros.
          </p>

          <div className="max-w-xs mx-auto mb-8 text-left">
            <label className="block text-emerald-400 font-mono text-xs mb-2">DIETARY PREFERENCE</label>
            <select 
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              className="w-full bg-[#0F172A] border border-emerald-500/30 rounded-lg p-3 text-white outline-none focus:border-emerald-400"
            >
              <option value="standard">Standard (Omnivore)</option>
              <option value="indian_vegetarian">Indian Vegetarian</option>
              <option value="vegan">Vegan</option>
            </select>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-8 py-4 bg-gradient-to-r from-emerald-400 to-[#00F5D4] text-[#0B0F19] rounded-full font-bold tracking-wider hover:scale-105 transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] disabled:opacity-50"
          >
            {isGenerating ? "CALCULATING TDEE..." : "GENERATE NUTRITION MATRIX"}
          </button>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Coach Note */}
          <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <div className="flex gap-4">
              <Sparkles className="w-6 h-6 text-emerald-400 flex-shrink-0" />
              <div>
                <h3 className="text-emerald-400 font-mono font-bold text-sm mb-2 tracking-widest">A.I. OPTIMIZATION NOTE</h3>
                <p className="text-emerald-100 text-sm leading-relaxed font-light italic">
                  "{plan.ai_coach_note}"
                </p>
              </div>
            </div>
          </div>

          {/* Macros Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#020617] border border-emerald-500/20 rounded-2xl p-4 text-center">
              <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{plan.daily_targets.target_calories}</p>
              <p className="text-xs text-slate-500 font-mono mt-1">KCAL</p>
            </div>
            <div className="bg-[#020617] border border-emerald-500/20 rounded-2xl p-4 text-center">
              <HeartPulse className="w-6 h-6 text-rose-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{plan.daily_targets.protein_g}g</p>
              <p className="text-xs text-slate-500 font-mono mt-1">PROTEIN</p>
            </div>
            <div className="bg-[#020617] border border-emerald-500/20 rounded-2xl p-4 text-center">
              <div className="w-6 h-6 text-yellow-500 mx-auto mb-2 font-bold font-serif">C</div>
              <p className="text-2xl font-black text-white">{plan.daily_targets.carbs_g}g</p>
              <p className="text-xs text-slate-500 font-mono mt-1">CARBS</p>
            </div>
            <div className="bg-[#020617] border border-emerald-500/20 rounded-2xl p-4 text-center">
              <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-black text-white">{plan.daily_targets.fats_g}g</p>
              <p className="text-xs text-slate-500 font-mono mt-1">FATS</p>
            </div>
          </div>

          {/* Meals List */}
          <div className="bg-[#020617] border border-emerald-500/30 rounded-2xl p-6">
            <h3 className="text-emerald-400 font-mono text-xs tracking-widest mb-6">DAILY MEAL MATRIX</h3>
            
            <div className="space-y-4">
              {plan.meals.map((meal: any, idx: number) => (
                <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-[#0F172A] rounded-xl border border-slate-800 hover:border-emerald-500/50 transition-colors gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-emerald-400 font-mono text-xs w-16">{meal.time}</span>
                    <p className="text-white font-bold">{meal.name}</p>
                  </div>
                  <div className="flex gap-4 text-sm font-mono text-slate-400">
                    <div><span className="text-white">{meal.calories}</span> KCAL</div>
                    <div><span className="text-rose-400">{meal.protein}g</span> P</div>
                    <div><span className="text-yellow-400">{meal.carbs}g</span> C</div>
                    <div><span className="text-blue-400">{meal.fats}g</span> F</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
