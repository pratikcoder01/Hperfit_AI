"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Salad, Sparkles, RefreshCw, AlertCircle, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import type { DietPlannerInput, AIDietPlan, AIDietDay, DietaryPreference, FitnessGoal } from "@/types/ai";

const NEON = "#00F5D4";

const GOALS: { value: FitnessGoal; label: string; emoji: string }[] = [
  { value: "weight_loss", label: "Weight Loss", emoji: "🔥" },
  { value: "muscle_gain", label: "Muscle Gain", emoji: "💪" },
  { value: "strength", label: "Strength", emoji: "🏋️" },
  { value: "endurance", label: "Endurance", emoji: "🏃" },
  { value: "general_fitness", label: "Maintenance", emoji: "⚖️" },
];

const DIETS: { value: DietaryPreference; label: string; emoji: string }[] = [
  { value: "omnivore", label: "Non-Veg", emoji: "🍗" },
  { value: "vegetarian", label: "Vegetarian", emoji: "🥗" },
  { value: "vegan", label: "Vegan", emoji: "🌱" },
  { value: "eggetarian", label: "Eggetarian", emoji: "🥚" },
  { value: "keto", label: "Keto", emoji: "🥑" },
];

const REGIONS = [
  { value: "north_india", label: "North Indian" },
  { value: "south_india", label: "South Indian" },
  { value: "west_india", label: "West Indian" },
  { value: "east_india", label: "East Indian" },
  { value: "international", label: "International" },
];

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary", desc: "Desk job, little exercise" },
  { value: "light", label: "Light", desc: "1-3 days/week exercise" },
  { value: "moderate", label: "Moderate", desc: "3-5 days/week exercise" },
  { value: "active", label: "Active", desc: "6-7 days/week exercise" },
  { value: "very_active", label: "Very Active", desc: "Physical job + training" },
];

function MacroBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = Math.min((value / total) * 100, 100);
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[#94A3B8]">{label}</span>
        <span className="font-bold" style={{ color }}>{value}g</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
      </div>
    </div>
  );
}

function DayCard({ day, index }: { day: AIDietDay; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div className="rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
            style={{ background: `${NEON}15`, color: NEON, border: `1px solid ${NEON}25` }}>
            {index + 1}
          </div>
          <p className="font-bold text-white text-sm">{day.day}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold" style={{ color: NEON }}>{day.total_calories} kcal</span>
          <span className="text-xs text-[#94A3B8]">P: {day.total_protein_g}g · C: {day.total_carbs_g}g · F: {day.total_fat_g}g</span>
          {open ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <div className="px-5 pb-5 space-y-2 border-t border-white/5 pt-4">
              {day.meals.map((meal, i) => (
                <div key={i} className="p-4 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-white text-sm">{meal.name}</p>
                      <p className="text-xs text-[#94A3B8]">{meal.time} · {meal.portion_size}</p>
                    </div>
                    <span className="text-sm font-black" style={{ color: NEON }}>{meal.calories} kcal</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {[
                      { label: "Protein", val: `${meal.protein_g}g`, color: "#3B82F6" },
                      { label: "Carbs", val: `${meal.carbs_g}g`, color: "#F59E0B" },
                      { label: "Fat", val: `${meal.fat_g}g`, color: "#EF4444" },
                    ].map((m) => (
                      <div key={m.label} className="text-center p-2 rounded-lg"
                        style={{ background: `${m.color}10`, border: `1px solid ${m.color}20` }}>
                        <p className="text-xs font-bold" style={{ color: m.color }}>{m.val}</p>
                        <p className="text-[10px] text-[#94A3B8]">{m.label}</p>
                      </div>
                    ))}
                  </div>
                  {meal.ingredients.length > 0 && (
                    <p className="text-xs text-[#94A3B8]">
                      <span className="text-white font-medium">Ingredients: </span>
                      {meal.ingredients.join(", ")}
                    </p>
                  )}
                  {meal.preparation && (
                    <p className="text-xs text-[#94A3B8] mt-1">
                      <span className="text-white font-medium">Prep: </span>{meal.preparation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AIDietPage() {
  const [form, setForm] = useState<DietPlannerInput>({
    weight_kg: 70,
    height_cm: 170,
    age: 25,
    gender: "male",
    goal: "muscle_gain",
    activity_level: "moderate",
    dietary_preference: "vegetarian",
    budget: "medium",
    region: "north_india",
    allergies: "",
  });
  const [plan, setPlan] = useState<AIDietPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setPlan(null);
    try {
      const res = await fetch("/api/ai/diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setPlan(data.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none transition-all";
  const inputStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <motion.div className="flex items-center gap-2 mb-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Salad className="w-5 h-5 text-[#00F5D4]" />
          <span className="text-xs font-semibold text-[#00F5D4] uppercase tracking-wider">AI Powered</span>
        </motion.div>
        <motion.h1 className="text-2xl font-black" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          Diet <span className="gradient-neon">Planner</span>
        </motion.h1>
        <p className="text-[#94A3B8] text-sm mt-1">AI crafts your personalized Indian nutrition plan with macros</p>
      </div>

      <div className="grid lg:grid-cols-[360px_1fr] gap-6">
        {/* Form */}
        <motion.div className="glass-card p-6 space-y-5 h-fit"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>

          {/* Body metrics */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-3">Body Metrics</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Weight (kg)", key: "weight_kg", min: 30, max: 200 },
                { label: "Height (cm)", key: "height_cm", min: 100, max: 250 },
                { label: "Age", key: "age", min: 10, max: 80 },
              ].map((f) => (
                <div key={f.key} className={f.key === "age" ? "col-span-2" : ""}>
                  <label className="block text-xs text-[#94A3B8] mb-1">{f.label}</label>
                  <input type="number" min={f.min} max={f.max}
                    value={form[f.key as keyof DietPlannerInput] as number}
                    onChange={(e) => setForm({ ...form, [f.key]: Number(e.target.value) })}
                    className={inputClass} style={inputStyle} />
                </div>
              ))}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Gender</label>
            <div className="flex gap-2">
              {(["male", "female"] as const).map((g) => (
                <button key={g} type="button" onClick={() => setForm({ ...form, gender: g })}
                  className="flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all"
                  style={{
                    background: form.gender === g ? `${NEON}15` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${form.gender === g ? `${NEON}40` : "rgba(255,255,255,0.08)"}`,
                    color: form.gender === g ? NEON : "#94A3B8",
                  }}>{g}</button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Goal</label>
            <div className="flex flex-wrap gap-2">
              {GOALS.map((g) => (
                <button key={g.value} type="button" onClick={() => setForm({ ...form, goal: g.value })}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: form.goal === g.value ? `${NEON}15` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${form.goal === g.value ? `${NEON}40` : "rgba(255,255,255,0.08)"}`,
                    color: form.goal === g.value ? NEON : "#94A3B8",
                  }}>{g.emoji} {g.label}</button>
              ))}
            </div>
          </div>

          {/* Dietary Preference */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Diet Type</label>
            <div className="flex flex-wrap gap-2">
              {DIETS.map((d) => (
                <button key={d.value} type="button" onClick={() => setForm({ ...form, dietary_preference: d.value })}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={{
                    background: form.dietary_preference === d.value ? `${NEON}15` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${form.dietary_preference === d.value ? `${NEON}40` : "rgba(255,255,255,0.08)"}`,
                    color: form.dietary_preference === d.value ? NEON : "#94A3B8",
                  }}>{d.emoji} {d.label}</button>
              ))}
            </div>
          </div>

          {/* Region */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Regional Cuisine</label>
            <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value as DietPlannerInput["region"] })}
              className={inputClass} style={inputStyle}>
              {REGIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>

          {/* Activity Level */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Activity Level</label>
            <select value={form.activity_level} onChange={(e) => setForm({ ...form, activity_level: e.target.value as DietPlannerInput["activity_level"] })}
              className={inputClass} style={inputStyle}>
              {ACTIVITY_LEVELS.map((a) => <option key={a.value} value={a.value}>{a.label} — {a.desc}</option>)}
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Budget</label>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map((b) => (
                <button key={b} type="button" onClick={() => setForm({ ...form, budget: b })}
                  className="flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all"
                  style={{
                    background: form.budget === b ? `${NEON}15` : "rgba(255,255,255,0.04)",
                    border: `1px solid ${form.budget === b ? `${NEON}40` : "rgba(255,255,255,0.08)"}`,
                    color: form.budget === b ? NEON : "#94A3B8",
                  }}>{b}</button>
              ))}
            </div>
          </div>

          {/* Allergies */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Allergies</label>
            <input type="text" placeholder="e.g. nuts, lactose, gluten..."
              value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })}
              className={inputClass} style={inputStyle} />
          </div>

          <motion.button onClick={generate} disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-60"
            style={{ background: loading ? "rgba(0,245,212,0.15)" : NEON, color: loading ? NEON : "#0B0F19", border: loading ? `1px solid ${NEON}40` : "none" }}
            whileHover={!loading ? { boxShadow: "0 0 30px rgba(0,245,212,0.30)" } : {}}>
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> Generating...</> : <><Sparkles className="w-4 h-4" /> Generate My Diet Plan</>}
          </motion.button>
        </motion.div>

        {/* Results */}
        <div className="space-y-4">
          <AnimatePresence>
            {loading && (
              <motion.div className="glass-card p-12 text-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-[#00F5D4]/20 animate-ping" />
                  <div className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,245,212,0.10)", border: "1px solid rgba(0,245,212,0.25)" }}>
                    <Salad className="w-7 h-7 text-[#00F5D4] animate-pulse" />
                  </div>
                </div>
                <p className="text-white font-semibold">HyperAI is crafting your meal plan...</p>
                <p className="text-[#94A3B8] text-sm mt-1">Calculating macros, selecting regional meals, optimizing nutrition</p>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div className="glass-card p-5 flex items-start gap-3"
              style={{ border: "1px solid rgba(239,68,68,0.25)" }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AlertCircle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-[#EF4444]">Generation Failed</p>
                <p className="text-xs text-[#94A3B8] mt-1">{error}</p>
              </div>
            </motion.div>
          )}

          {!loading && !plan && !error && (
            <motion.div className="glass-card p-16 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Salad className="w-12 h-12 text-[#94A3B8]/40 mx-auto mb-4" />
              <p className="text-[#94A3B8] font-medium">Fill your details and generate a personalized Indian meal plan</p>
            </motion.div>
          )}

          {plan && (
            <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Plan Summary */}
              <div className="glass-card p-6" style={{ border: "1px solid rgba(0,245,212,0.15)" }}>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-4 h-4 text-[#00F5D4]" />
                  <span className="text-xs text-[#00F5D4] font-semibold">AI-Generated Diet Plan</span>
                </div>
                <h2 className="text-xl font-black text-white mb-1">{plan.title}</h2>
                <p className="text-sm text-[#94A3B8] mb-5">{plan.description}</p>

                <div className="grid grid-cols-4 gap-3 mb-5">
                  {[
                    { label: "Daily Calories", value: `${plan.daily_calorie_target}`, unit: "kcal", color: NEON },
                    { label: "Protein", value: `${plan.protein_target_g}`, unit: "g/day", color: "#3B82F6" },
                    { label: "Carbs", value: `${plan.carbs_target_g}`, unit: "g/day", color: "#F59E0B" },
                    { label: "Water", value: `${(plan.water_target_ml / 1000).toFixed(1)}`, unit: "L/day", color: "#06B6D4" },
                  ].map((s) => (
                    <div key={s.label} className="text-center p-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
                      <p className="text-[10px] text-[#94A3B8]">{s.unit}</p>
                      <p className="text-[10px] text-[#94A3B8]">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <MacroBar label="Protein" value={plan.protein_target_g} total={plan.daily_calorie_target / 4} color="#3B82F6" />
                  <MacroBar label="Carbohydrates" value={plan.carbs_target_g} total={plan.daily_calorie_target / 4} color="#F59E0B" />
                  <MacroBar label="Fat" value={plan.fat_target_g} total={plan.daily_calorie_target / 9} color="#EF4444" />
                </div>
              </div>

              {/* Weekly Plan */}
              <div className="space-y-3">
                {plan.weekly_plan.map((day, i) => <DayCard key={i} day={day} index={i} />)}
              </div>

              {/* Tips */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-5">
                  <h3 className="font-bold text-white text-sm mb-3">💊 Supplements</h3>
                  <ul className="space-y-1.5">
                    {plan.supplement_recommendations.map((s, i) => (
                      <li key={i} className="text-xs text-[#94A3B8] flex items-start gap-2">
                        <span className="text-[#00F5D4]">•</span>{s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="glass-card p-5">
                  <h3 className="font-bold text-white text-sm mb-3">🚫 Foods to Avoid</h3>
                  <ul className="space-y-1.5">
                    {plan.foods_to_avoid.map((f, i) => (
                      <li key={i} className="text-xs text-[#94A3B8] flex items-start gap-2">
                        <span className="text-[#EF4444]">•</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <motion.button onClick={generate}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm text-[#94A3B8] hover:text-white transition-all"
                style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
                whileHover={{ borderColor: "rgba(0,245,212,0.30)" }}>
                <RefreshCw className="w-4 h-4" /> Regenerate Plan
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
