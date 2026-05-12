"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Brain, Activity, Zap, Shield,
  Target, Flame, Calendar, ArrowUpRight, Sparkles
} from "lucide-react";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis,
} from "recharts";
import type { TransformationInput, TransformationMilestone } from "@/types/cv";

const NEON = "#00F5D4";
const VIOLET = "#7B2CBF";

// ── Transformation Calculation Engine ─────────
function calculateTransformation(input: TransformationInput): TransformationMilestone[] {
  const milestones: TransformationMilestone[] = [];

  const weeklyCalorieDeficit =
    input.goal === "cut" ? -500 * 7
    : input.goal === "bulk" ? 300 * 7
    : -100 * 7;

  const weeklyFatChange = weeklyCalorieDeficit / 7700; // kg per week
  const weeklyMuscleGain = input.goal === "bulk"
    ? 0.15 * (input.weeklyWorkouts / 4)
    : input.goal === "recomp"
    ? 0.05 * (input.weeklyWorkouts / 4)
    : 0;

  let currentWeight = input.currentWeight;
  let currentBodyFat = input.bodyFatPercentage;

  for (let week = 0; week <= input.timelineWeeks; week++) {
    const fatMass = currentWeight * (currentBodyFat / 100);
    const muscleMass = currentWeight - fatMass;

    milestones.push({
      week,
      predictedWeight: Math.round(currentWeight * 10) / 10,
      predictedBodyFat: Math.round(currentBodyFat * 10) / 10,
      muscleMass: Math.round(muscleMass * 10) / 10,
      fatMass: Math.round(fatMass * 10) / 10,
      event: week === 4 ? "Month 1 Check-in"
        : week === 8 ? "Mid-point Review"
        : week === 12 ? "Quarter Complete"
        : undefined,
    });

    currentWeight = Math.max(input.targetWeight - 5,
      currentWeight + weeklyFatChange + weeklyMuscleGain
    );
    currentBodyFat = Math.max(
      input.targetBodyFat,
      currentBodyFat + (weeklyFatChange / currentWeight) * 100 * 0.7
    );
  }

  return milestones;
}

function calculateSuccessProbability(input: TransformationInput): number {
  let score = 60;
  if (input.weeklyWorkouts >= 4) score += 15;
  else if (input.weeklyWorkouts >= 3) score += 10;
  if (Math.abs(input.currentWeight - input.targetWeight) < 10) score += 10;
  if (input.timelineWeeks >= 12) score += 5;
  if (input.dailyCalories > 1200 && input.dailyCalories < 3500) score += 10;
  return Math.min(95, score);
}

// ── Gauge Component ───────────────────────────
function CircularGauge({ value, max, label, color, unit = "" }: {
  value: number; max: number; label: string; color: string; unit?: string;
}) {
  const pct = Math.min(value / max, 1);
  const r = 36;
  const circumference = 2 * Math.PI * r;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <svg width={88} height={88} className="-rotate-90">
          <circle cx={44} cy={44} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={7} />
          <motion.circle cx={44} cy={44} r={r} fill="none" stroke={color}
            strokeWidth={7} strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - pct) }}
            transition={{ duration: 1.2, ease: "easeOut" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm font-black text-white">{value}{unit}</span>
        </div>
      </div>
      <p className="text-[10px] text-[#94A3B8] mt-1 text-center">{label}</p>
    </div>
  );
}

// ── Input Slider ──────────────────────────────
function InputSlider({ label, value, min, max, step = 1, unit, onChange, color = NEON }: {
  label: string; value: number; min: number; max: number;
  step?: number; unit: string; onChange: (v: number) => void; color?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <label className="text-xs text-[#94A3B8]">{label}</label>
        <span className="text-sm font-bold" style={{ color }}>{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${color} ${pct}%, rgba(255,255,255,0.08) ${pct}%)`,
        }} />
    </div>
  );
}

// ── Main Page ─────────────────────────────────
export default function MLDashboardPage() {
  const [input, setInput] = useState<TransformationInput>({
    currentWeight: 80,
    targetWeight: 70,
    bodyFatPercentage: 22,
    targetBodyFat: 14,
    weeklyWorkouts: 4,
    dailyCalories: 2000,
    goal: "cut",
    timelineWeeks: 16,
  });

  const milestones = useMemo(() => calculateTransformation(input), [input]);
  const successProbability = useMemo(() => calculateSuccessProbability(input), [input]);

  const weeklyChange = input.goal === "bulk" ? "+0.3kg" : "-0.5kg";
  const totalChange = (input.currentWeight - input.targetWeight).toFixed(1);

  const fitnessMetrics = [
    { metric: "Strength", score: 72 },
    { metric: "Cardio", score: 55 },
    { metric: "Flexibility", score: 48 },
    { metric: "Consistency", score: 80 },
    { metric: "Nutrition", score: 68 },
    { metric: "Recovery", score: 60 },
  ];

  const injuryRisks = [
    { bodyPart: "Lower Back", risk: 42, color: "#F59E0B" },
    { bodyPart: "Knees", risk: 28, color: NEON },
    { bodyPart: "Shoulders", risk: 65, color: "#EF4444" },
    { bodyPart: "Ankles", risk: 18, color: NEON },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-5 h-5 text-[#7B2CBF]" />
          <span className="text-xs font-semibold text-[#7B2CBF] uppercase tracking-wider">ML Intelligence</span>
        </div>
        <motion.h1 className="text-2xl font-black"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          ML <span className="gradient-neon">Analytics</span>
        </motion.h1>
        <p className="text-[#94A3B8] text-sm mt-1">AI transformation simulator and fitness intelligence engine</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Sessions Analyzed", value: "47", icon: Activity, color: NEON, trend: "+8%" },
          { label: "Avg Form Score", value: "78%", icon: Target, color: "#3B82F6", trend: "+5%" },
          { label: "Total Reps Tracked", value: "2,841", icon: Zap, color: VIOLET, trend: "+12%" },
          { label: "Injury Prevented", value: "3", icon: Shield, color: "#F59E0B", trend: "alerts" },
        ].map((s, i) => (
          <motion.div key={s.label} className="glass-card p-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="flex justify-between items-start mb-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <span className="text-xs font-bold" style={{ color: s.color }}>{s.trend}</span>
            </div>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-xs text-[#94A3B8]">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* AI Transformation Simulator */}
        <motion.div className="glass-card p-6 space-y-5"
          style={{ border: "1px solid rgba(0,245,212,0.12)" }}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-[#00F5D4]" />
              <h3 className="font-bold text-white">AI Transformation Simulator</h3>
            </div>
            <p className="text-xs text-[#94A3B8]">ML-powered body composition prediction</p>
          </div>

          {/* Goal selector */}
          <div className="flex gap-2">
            {(["cut", "bulk", "recomp"] as const).map((g) => (
              <button key={g} onClick={() => setInput({ ...input, goal: g })}
                className="flex-1 py-2 rounded-lg text-xs font-bold uppercase capitalize transition-all"
                style={{
                  background: input.goal === g ? `${NEON}15` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${input.goal === g ? `${NEON}40` : "rgba(255,255,255,0.08)"}`,
                  color: input.goal === g ? NEON : "#94A3B8",
                }}>{g}</button>
            ))}
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <InputSlider label="Current Weight" value={input.currentWeight} min={40} max={150} unit="kg"
              onChange={v => setInput({ ...input, currentWeight: v })} />
            <InputSlider label="Target Weight" value={input.targetWeight} min={40} max={150} unit="kg"
              onChange={v => setInput({ ...input, targetWeight: v })} color="#3B82F6" />
            <InputSlider label="Current Body Fat" value={input.bodyFatPercentage} min={5} max={50} unit="%"
              onChange={v => setInput({ ...input, bodyFatPercentage: v })} color="#F59E0B" />
            <InputSlider label="Weekly Workouts" value={input.weeklyWorkouts} min={1} max={7} unit=" days"
              onChange={v => setInput({ ...input, weeklyWorkouts: v })} color={VIOLET} />
            <InputSlider label="Timeline" value={input.timelineWeeks} min={4} max={52} unit=" weeks"
              onChange={v => setInput({ ...input, timelineWeeks: v })} color="#EF4444" />
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl" style={{ background: "rgba(0,245,212,0.06)", border: "1px solid rgba(0,245,212,0.12)" }}>
              <p className="text-lg font-black" style={{ color: NEON }}>{successProbability}%</p>
              <p className="text-[10px] text-[#94A3B8]">Success Rate</p>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-lg font-black text-white">{weeklyChange}</p>
              <p className="text-[10px] text-[#94A3B8]">Weekly Change</p>
            </div>
            <div className="text-center p-3 rounded-xl" style={{ background: "rgba(123,44,191,0.08)", border: "1px solid rgba(123,44,191,0.15)" }}>
              <p className="text-lg font-black" style={{ color: VIOLET }}>{totalChange}kg</p>
              <p className="text-[10px] text-[#94A3B8]">Total Goal</p>
            </div>
          </div>
        </motion.div>

        {/* Transformation Chart */}
        <motion.div className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-[#00F5D4]" />
            <h3 className="font-bold text-white">Body Composition Timeline</h3>
          </div>
          <p className="text-xs text-[#94A3B8] mb-4">AI predicted weight & body fat over {input.timelineWeeks} weeks</p>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={milestones} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={NEON} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={NEON} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="fatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" stroke="#94A3B8" tick={{ fontSize: 10 }} tickFormatter={v => `W${v}`}
                axisLine={false} tickLine={false} interval={Math.floor(input.timelineWeeks / 5)} />
              <YAxis stroke="#94A3B8" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 11 }}
                formatter={(v: number, name: string) => [`${v}${name.includes("Fat") ? "%" : "kg"}`, name]} />
              <Area type="monotone" dataKey="predictedWeight" stroke={NEON} strokeWidth={2}
                fill="url(#weightGrad)" name="Weight" />
              <Area type="monotone" dataKey="predictedBodyFat" stroke="#F59E0B" strokeWidth={2}
                fill="url(#fatGrad)" name="Body Fat %" />
            </AreaChart>
          </ResponsiveContainer>

          {/* Milestone markers */}
          <div className="mt-3 flex gap-2 flex-wrap">
            {milestones.filter(m => m.event).map((m) => (
              <div key={m.week} className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg"
                style={{ background: "rgba(123,44,191,0.10)", border: "1px solid rgba(123,44,191,0.20)" }}>
                <Calendar className="w-3 h-3 text-[#7B2CBF]" />
                <span className="text-[#94A3B8]">W{m.week}:</span>
                <span className="text-white font-medium">{m.predictedWeight}kg</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row: Fitness Radar + Injury Risk */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Fitness Profile Radar */}
        <motion.div className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-[#00F5D4]" />
            <h3 className="font-bold text-white">AI Fitness Profile</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={fitnessMetrics} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <Radar dataKey="score" stroke={NEON} fill={NEON} fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {fitnessMetrics.map((m) => (
              <div key={m.metric} className="text-center">
                <p className="text-xs font-bold"
                  style={{ color: m.score >= 70 ? NEON : m.score >= 50 ? "#F59E0B" : "#EF4444" }}>
                  {m.score}
                </p>
                <p className="text-[10px] text-[#94A3B8]">{m.metric}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Injury Risk Dashboard */}
        <motion.div className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-4 h-4 text-[#F59E0B]" />
            <h3 className="font-bold text-white">AI Injury Prevention</h3>
            <span className="ml-auto text-xs text-[#94A3B8]">Body scan</span>
          </div>

          <div className="space-y-4">
            {injuryRisks.map((r, i) => (
              <motion.div key={r.bodyPart}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 + i * 0.06 }}>
                <div className="flex justify-between items-center mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                    <span className="text-sm text-white">{r.bodyPart}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold" style={{ color: r.color }}>{r.risk}%</span>
                    <span className="text-[10px] text-[#94A3B8]">
                      {r.risk >= 60 ? "⚠️ High" : r.risk >= 35 ? "⚡ Med" : "✅ Low"}
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-white/5">
                  <motion.div className="h-full rounded-full" style={{ backgroundColor: r.color }}
                    initial={{ width: 0 }} animate={{ width: `${r.risk}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.06 }} />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-5 p-4 rounded-xl"
            style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <p className="text-xs font-bold text-[#EF4444] mb-1">⚠️ AI Recommendation</p>
            <p className="text-xs text-[#94A3B8]">Shoulders are at elevated risk. Add rotator cuff warm-ups and reduce overhead press volume by 20% this week.</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <CircularGauge value={78} max={100} label="Form Score" color={NEON} unit="%" />
            <CircularGauge value={5} max={7} label="Workout Days" color={VIOLET} />
            <CircularGauge value={32} max={100} label="Fatigue" color="#F59E0B" unit="%" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
