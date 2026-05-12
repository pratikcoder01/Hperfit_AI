"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dumbbell, Sparkles, RefreshCw, ChevronDown, ChevronUp,
  Clock, Flame, Target, AlertCircle, CheckCircle2, Download
} from "lucide-react";
import type {
  WorkoutGeneratorInput, AIWorkoutPlan, AIWorkoutDay,
  FitnessGoal, BodyType, ExperienceLevel, TrainingStyle, Equipment
} from "@/types/ai";

// ─────────────────────────────────────────────
//  Form Config
// ─────────────────────────────────────────────
const GOALS: { value: FitnessGoal; label: string; emoji: string }[] = [
  { value: "weight_loss", label: "Weight Loss", emoji: "🔥" },
  { value: "muscle_gain", label: "Muscle Gain", emoji: "💪" },
  { value: "strength", label: "Strength", emoji: "🏋️" },
  { value: "endurance", label: "Endurance", emoji: "🏃" },
  { value: "flexibility", label: "Flexibility", emoji: "🧘" },
  { value: "general_fitness", label: "General Fitness", emoji: "⚡" },
];

const BODY_TYPES: { value: BodyType; label: string; desc: string }[] = [
  { value: "ectomorph", label: "Ectomorph", desc: "Naturally lean & slim" },
  { value: "mesomorph", label: "Mesomorph", desc: "Athletic build" },
  { value: "endomorph", label: "Endomorph", desc: "Naturally bulky" },
];

const EXPERIENCE: { value: ExperienceLevel; label: string }[] = [
  { value: "beginner", label: "Beginner (< 1 year)" },
  { value: "intermediate", label: "Intermediate (1–3 years)" },
  { value: "advanced", label: "Advanced (3+ years)" },
];

const EQUIPMENT: { value: Equipment; label: string }[] = [
  { value: "full_gym", label: "Full Gym" },
  { value: "dumbbells_only", label: "Dumbbells Only" },
  { value: "bodyweight", label: "Bodyweight" },
  { value: "home_gym", label: "Home Gym" },
  { value: "resistance_bands", label: "Resistance Bands" },
];

const TRAINING_STYLES: { value: TrainingStyle; label: string }[] = [
  { value: "hypertrophy", label: "Hypertrophy (Muscle Size)" },
  { value: "strength", label: "Strength (Heavy Compound)" },
  { value: "circuit", label: "Circuit Training" },
  { value: "hiit", label: "HIIT" },
  { value: "functional", label: "Functional Fitness" },
];

const NEON = "#00F5D4";
const VIOLET = "#7B2CBF";

// ─────────────────────────────────────────────
//  Sub-Components
// ─────────────────────────────────────────────
function SelectChip<T extends string>({
  options, value, onChange, label,
}: {
  options: { value: T; label: string; emoji?: string; desc?: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="px-3 py-2 rounded-lg text-sm font-medium transition-all text-left"
            style={{
              background: value === opt.value ? `${NEON}15` : "rgba(255,255,255,0.04)",
              border: `1px solid ${value === opt.value ? `${NEON}40` : "rgba(255,255,255,0.08)"}`,
              color: value === opt.value ? NEON : "#94A3B8",
            }}
          >
            {opt.emoji && <span className="mr-1">{opt.emoji}</span>}
            {opt.label}
            {opt.desc && <span className="block text-[10px] opacity-70 mt-0.5">{opt.desc}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function WorkoutDayCard({ day, index }: { day: AIWorkoutDay; index: number }) {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/3 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black"
            style={{ background: `${NEON}15`, color: NEON, border: `1px solid ${NEON}25` }}>
            {index + 1}
          </div>
          <div className="text-left">
            <p className="font-bold text-white text-sm">{day.day}</p>
            <p className="text-xs text-[#94A3B8]">{day.focus}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#94A3B8] flex items-center gap-1">
            <Clock className="w-3 h-3" />{day.estimated_duration}min
          </span>
          <span className="text-xs text-[#94A3B8] flex items-center gap-1">
            <Dumbbell className="w-3 h-3" />{day.exercises.length} exercises
          </span>
          {open ? <ChevronUp className="w-4 h-4 text-[#94A3B8]" /> : <ChevronDown className="w-4 h-4 text-[#94A3B8]" />}
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3 border-t border-white/5">
              <div className="grid grid-cols-2 gap-3 pt-4">
                <div className="p-3 rounded-lg text-xs" style={{ background: "rgba(0,245,212,0.06)", border: "1px solid rgba(0,245,212,0.12)" }}>
                  <p className="text-[#94A3B8] mb-1">Warm Up</p>
                  <p className="text-white">{day.warm_up}</p>
                </div>
                <div className="p-3 rounded-lg text-xs" style={{ background: "rgba(123,44,191,0.06)", border: "1px solid rgba(123,44,191,0.12)" }}>
                  <p className="text-[#94A3B8] mb-1">Cool Down</p>
                  <p className="text-white">{day.cool_down}</p>
                </div>
              </div>

              <div className="space-y-2 mt-2">
                {day.exercises.map((ex, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div>
                      <p className="text-sm font-medium text-white">{ex.name}</p>
                      <p className="text-xs text-[#94A3B8]">{ex.muscle_group}{ex.equipment && ` · ${ex.equipment}`}</p>
                      {ex.notes && <p className="text-xs text-[#94A3B8]/70 mt-0.5 italic">{ex.notes}</p>}
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="text-sm font-black" style={{ color: NEON }}>{ex.sets} × {ex.reps}</p>
                      <p className="text-xs text-[#94A3B8]">{ex.rest_seconds}s rest</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
//  Main Page
// ─────────────────────────────────────────────
export default function AIWorkoutPage() {
  const [form, setForm] = useState<WorkoutGeneratorInput>({
    goal: "muscle_gain",
    body_type: "mesomorph",
    experience_level: "intermediate",
    frequency_per_week: 4,
    equipment: "full_gym",
    injuries: "",
    training_style: "hypertrophy",
    session_duration_minutes: 60,
  });
  const [plan, setPlan] = useState<AIWorkoutPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setPlan(null);

    try {
      const res = await fetch("/api/ai/workout", {
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

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <motion.div className="flex items-center gap-2 mb-1"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Sparkles className="w-5 h-5 text-[#00F5D4]" />
            <span className="text-xs font-semibold text-[#00F5D4] uppercase tracking-wider">AI Powered</span>
          </motion.div>
          <motion.h1 className="text-2xl font-black"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            Workout <span className="gradient-neon">Generator</span>
          </motion.h1>
          <p className="text-[#94A3B8] text-sm mt-1">AI creates your personalized training plan in seconds</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[380px_1fr] gap-6">
        {/* ── Form Panel ── */}
        <motion.div className="glass-card p-6 space-y-6 h-fit"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>

          <SelectChip options={GOALS} value={form.goal} onChange={(v) => setForm({ ...form, goal: v })} label="Fitness Goal" />
          <SelectChip options={BODY_TYPES} value={form.body_type} onChange={(v) => setForm({ ...form, body_type: v })} label="Body Type" />
          <SelectChip options={EXPERIENCE} value={form.experience_level} onChange={(v) => setForm({ ...form, experience_level: v })} label="Experience Level" />
          <SelectChip options={EQUIPMENT} value={form.equipment} onChange={(v) => setForm({ ...form, equipment: v })} label="Equipment" />
          <SelectChip options={TRAINING_STYLES} value={form.training_style} onChange={(v) => setForm({ ...form, training_style: v })} label="Training Style" />

          {/* Frequency */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
              Days Per Week: <span style={{ color: NEON }}>{form.frequency_per_week}</span>
            </label>
            <input type="range" min={2} max={6} value={form.frequency_per_week}
              onChange={(e) => setForm({ ...form, frequency_per_week: Number(e.target.value) })}
              className="w-full accent-[#00F5D4]" />
            <div className="flex justify-between text-xs text-[#94A3B8] mt-1">
              <span>2 days</span><span>6 days</span>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">
              Session Duration: <span style={{ color: NEON }}>{form.session_duration_minutes}min</span>
            </label>
            <input type="range" min={30} max={120} step={15} value={form.session_duration_minutes}
              onChange={(e) => setForm({ ...form, session_duration_minutes: Number(e.target.value) })}
              className="w-full accent-[#00F5D4]" />
          </div>

          {/* Injuries */}
          <div>
            <label className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Injuries / Limitations</label>
            <input type="text" placeholder="e.g. bad knees, shoulder pain..."
              value={form.injuries}
              onChange={(e) => setForm({ ...form, injuries: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-[#94A3B8] outline-none"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
            />
          </div>

          {/* Generate Button */}
          <motion.button
            onClick={generate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-60"
            style={{ background: loading ? "rgba(0,245,212,0.15)" : NEON, color: loading ? NEON : "#0B0F19", border: loading ? `1px solid ${NEON}40` : "none" }}
            whileHover={!loading ? { boxShadow: "0 0 30px rgba(0,245,212,0.30)" } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
          >
            {loading ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Generating Plan...</>
            ) : (
              <><Sparkles className="w-4 h-4" /> Generate My Plan</>
            )}
          </motion.button>
        </motion.div>

        {/* ── Results Panel ── */}
        <div className="space-y-4">
          {/* Loading state */}
          <AnimatePresence>
            {loading && (
              <motion.div className="glass-card p-12 text-center"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="relative w-16 h-16 mx-auto mb-4">
                  <div className="absolute inset-0 rounded-full border-2 border-[#00F5D4]/20 animate-ping" />
                  <div className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,245,212,0.10)", border: "1px solid rgba(0,245,212,0.25)" }}>
                    <Sparkles className="w-7 h-7 text-[#00F5D4] animate-pulse" />
                  </div>
                </div>
                <p className="text-white font-semibold">HyperAI is building your plan...</p>
                <p className="text-[#94A3B8] text-sm mt-1">Analyzing your profile and creating a personalized program</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error state */}
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

          {/* Empty state */}
          {!loading && !plan && !error && (
            <motion.div className="glass-card p-16 text-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Dumbbell className="w-12 h-12 text-[#94A3B8]/40 mx-auto mb-4" />
              <p className="text-[#94A3B8] font-medium">Configure your profile and click Generate</p>
              <p className="text-[#94A3B8]/60 text-sm mt-1">AI will create a complete weekly program just for you</p>
            </motion.div>
          )}

          {/* Plan Results */}
          {plan && (
            <motion.div className="space-y-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Plan Overview */}
              <div className="glass-card p-6" style={{ border: "1px solid rgba(0,245,212,0.15)" }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-[#00F5D4]" />
                      <span className="text-xs text-[#00F5D4] font-semibold">AI-Generated Plan</span>
                    </div>
                    <h2 className="text-xl font-black text-white">{plan.title}</h2>
                    <p className="text-sm text-[#94A3B8] mt-1">{plan.description}</p>
                  </div>
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}>
                    <Download className="w-3.5 h-3.5" /> Export
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Duration", value: `${plan.duration_weeks} Weeks`, icon: Target },
                    { label: "Frequency", value: `${plan.days_per_week}x / Week`, icon: Clock },
                    { label: "Level", value: plan.difficulty, icon: Flame },
                    { label: "Goal", value: plan.goal.replace("_", " "), icon: Sparkles },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-3 rounded-xl"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <stat.icon className="w-4 h-4 mx-auto mb-1 text-[#00F5D4]" />
                      <p className="text-xs text-[#94A3B8]">{stat.label}</p>
                      <p className="text-sm font-bold text-white capitalize">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workout Days */}
              <div className="space-y-3">
                {plan.schedule.map((day, i) => (
                  <WorkoutDayCard key={i} day={day} index={i} />
                ))}
              </div>

              {/* Progression & Recovery */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card p-5">
                  <h3 className="font-bold text-white text-sm mb-3 flex items-center gap-2">
                    <TrendingUpIcon /> Progression Plan
                  </h3>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">{plan.progression_notes}</p>
                </div>
                <div className="glass-card p-5">
                  <h3 className="font-bold text-white text-sm mb-3">💤 Recovery Tips</h3>
                  <ul className="space-y-1.5">
                    {plan.recovery_tips.map((tip, i) => (
                      <li key={i} className="text-xs text-[#94A3B8] flex items-start gap-2">
                        <span className="text-[#00F5D4] mt-0.5">•</span>{tip}
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

function TrendingUpIcon() {
  return (
    <svg className="w-4 h-4 text-[#00F5D4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}
