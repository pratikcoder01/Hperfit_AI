"use client";

import { motion } from "framer-motion";
import {
  Brain, TrendingUp, Target, Zap, AlertTriangle,
  CheckCircle2, Clock, Flame, Activity, BarChart3,
  ArrowUpRight, ArrowDownRight, Sparkles
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts";
import type { SmartRecommendation, GoalPrediction } from "@/types/ai";

const NEON = "#00F5D4";
const VIOLET = "#7B2CBF";

// ── Mock AI-generated data ─────────────────────
const insights = [
  { type: "warning", icon: AlertTriangle, color: "#F59E0B", title: "Declining Attendance", description: "Your gym visits dropped 32% this week. Missing sessions puts your muscle gain goal at risk.", action: "Schedule 3 sessions this week" },
  { type: "success", icon: CheckCircle2, color: NEON, title: "Protein Target Achieved", description: "You've hit your daily protein goal 6/7 days this week. Keep this momentum!", action: "Maintain current diet" },
  { type: "prediction", icon: Brain, color: VIOLET, title: "Goal Timeline Prediction", description: "At your current pace, you'll reach your muscle gain target in approximately 14 weeks.", action: "View full prediction" },
  { type: "recommendation", icon: Sparkles, color: "#3B82F6", title: "Add Creatine", description: "Based on your training style and goals, creatine supplementation could boost strength by 8-14%.", action: "Learn more" },
];

const prediction: GoalPrediction = {
  goal: "Muscle Gain",
  target_date: "August 2025",
  confidence_percentage: 74,
  current_progress: 42,
  predicted_completion: "September 2025",
  consistency_score: 68,
  weekly_sessions_needed: 4,
  estimated_calories_per_day: 2800,
  milestones: [
    { week: 4, target: "+1.5kg lean mass" },
    { week: 8, target: "+3kg lean mass" },
    { week: 12, target: "+5kg lean mass" },
    { week: 16, target: "Goal achieved" },
  ],
};

const recommendations: SmartRecommendation[] = [
  { id: "1", category: "workout", title: "Switch to 4-Day Split", description: "Your recovery data suggests you're ready for a PPL split. This will maximize muscle protein synthesis.", priority: "high", based_on: "Attendance patterns & recovery rate", action_label: "Generate Plan", action_href: "/dashboard/ai/workout" },
  { id: "2", category: "diet", title: "Increase Pre-Workout Carbs", description: "Adding 40-50g of fast carbs 30min before training can improve performance by up to 15%.", priority: "medium", based_on: "Workout intensity logs", action_label: "Update Diet", action_href: "/dashboard/ai/diet" },
  { id: "3", category: "recovery", title: "Add Active Recovery Day", description: "Your 5-day training frequency without active recovery may be limiting progress.", priority: "medium", based_on: "Training frequency analysis" },
  { id: "4", category: "goal", title: "Adjust Calorie Target", description: "Your weight has plateaued for 2 weeks. Increase daily calories by 200 to restart growth.", priority: "high", based_on: "Weight tracking data" },
];

const progressTrend = [
  { month: "Jan", weight: 68.0, muscle: 52, fat: 18 },
  { month: "Feb", weight: 68.8, muscle: 53.2, fat: 17.5 },
  { month: "Mar", weight: 69.5, muscle: 54.0, fat: 17.2 },
  { month: "Apr", weight: 70.2, muscle: 55.1, fat: 16.8 },
  { month: "May", weight: 70.9, muscle: 56.0, fat: 16.5 },
  { month: "Jun", weight: 71.5, muscle: 57.0, fat: 16.0 },
];

const fitnessRadar = [
  { metric: "Strength", score: 72 },
  { metric: "Endurance", score: 58 },
  { metric: "Flexibility", score: 45 },
  { metric: "Consistency", score: 68 },
  { metric: "Nutrition", score: 80 },
  { metric: "Recovery", score: 62 },
];

const priorityColors: Record<string, string> = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: NEON,
};

const categoryEmojis: Record<string, string> = {
  workout: "🏋️",
  diet: "🥗",
  recovery: "💤",
  goal: "🎯",
  membership: "⭐",
};

// ─────────────────────────────────────────────
//  Main Page
// ─────────────────────────────────────────────
export default function AIInsightsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Brain className="w-5 h-5 text-[#7B2CBF]" />
          <span className="text-xs font-semibold text-[#7B2CBF] uppercase tracking-wider">AI Intelligence</span>
        </div>
        <motion.h1 className="text-2xl font-black"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          AI <span className="gradient-neon">Insights</span>
        </motion.h1>
        <p className="text-[#94A3B8] text-sm mt-1">Personalized analytics and predictions powered by HyperAI</p>
      </div>

      {/* Smart Insights Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((ins, i) => (
          <motion.div key={i} className="glass-card p-5 group cursor-pointer"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            whileHover={{ y: -3 }}
            style={{ borderColor: `${ins.color}20` }}>
            <div className="flex items-start justify-between mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${ins.color}15`, border: `1px solid ${ins.color}25` }}>
                <ins.icon className="w-4 h-4" style={{ color: ins.color }} />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="font-bold text-white text-sm mb-1">{ins.title}</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed mb-3">{ins.description}</p>
            <button className="text-xs font-semibold" style={{ color: ins.color }}>{ins.action} →</button>
          </motion.div>
        ))}
      </div>

      {/* Middle Row: Goal Prediction + Fitness Radar */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Goal Prediction */}
        <motion.div className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ border: "1px solid rgba(123,44,191,0.20)" }}>
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-4 h-4 text-[#7B2CBF]" />
            <h3 className="font-bold text-white">Goal Prediction</h3>
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: "rgba(123,44,191,0.15)", color: "#7B2CBF" }}>
              {prediction.confidence_percentage}% confidence
            </span>
          </div>

          {/* Confidence ring */}
          <div className="flex items-center gap-6 mb-5">
            <div className="relative w-24 h-24 flex-shrink-0">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <motion.circle cx="48" cy="48" r="40" fill="none" stroke={VIOLET}
                  strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - prediction.confidence_percentage / 100) }}
                  transition={{ duration: 1.5, ease: "easeOut" }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-white">{prediction.confidence_percentage}%</span>
                <span className="text-[9px] text-[#94A3B8]">confidence</span>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              <div>
                <p className="text-xs text-[#94A3B8]">Goal</p>
                <p className="font-bold text-white">{prediction.goal}</p>
              </div>
              <div>
                <p className="text-xs text-[#94A3B8]">Current Progress</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex-1 h-1.5 rounded-full bg-white/5">
                    <motion.div className="h-full rounded-full" style={{ background: NEON }}
                      initial={{ width: 0 }} animate={{ width: `${prediction.current_progress}%` }}
                      transition={{ duration: 1, delay: 0.5 }} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: NEON }}>{prediction.current_progress}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { label: "Sessions/Week", value: prediction.weekly_sessions_needed, icon: Zap, color: NEON },
              { label: "Daily Calories", value: prediction.estimated_calories_per_day, icon: Flame, color: "#F59E0B" },
              { label: "Consistency", value: `${prediction.consistency_score}%`, icon: Activity, color: "#3B82F6" },
            ].map((m) => (
              <div key={m.label} className="text-center p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <m.icon className="w-3.5 h-3.5 mx-auto mb-1" style={{ color: m.color }} />
                <p className="text-sm font-black text-white">{m.value}</p>
                <p className="text-[10px] text-[#94A3B8]">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Milestones */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">Milestones</p>
            {prediction.milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                  style={{ borderColor: i === 0 ? NEON : "rgba(255,255,255,0.12)", color: i === 0 ? NEON : "#94A3B8" }}>
                  {m.week}
                </div>
                <div className="flex-1 h-px" style={{ background: i === 0 ? `${NEON}30` : "rgba(255,255,255,0.06)" }} />
                <p className="text-xs text-[#94A3B8]">{m.target}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Fitness Radar */}
        <motion.div className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-[#00F5D4]" />
            <h3 className="font-bold text-white">Fitness Profile</h3>
          </div>
          <p className="text-xs text-[#94A3B8] mb-4">AI-scored across 6 fitness dimensions</p>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={fitnessRadar} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="rgba(255,255,255,0.06)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#94A3B8", fontSize: 11 }} />
              <Radar name="Score" dataKey="score" stroke={NEON} fill={NEON} fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {fitnessRadar.map((f) => (
              <div key={f.metric} className="text-center">
                <p className="text-xs font-bold" style={{ color: f.score >= 70 ? NEON : f.score >= 55 ? "#F59E0B" : "#EF4444" }}>{f.score}</p>
                <p className="text-[10px] text-[#94A3B8]">{f.metric}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Progress Trend Chart */}
      <motion.div className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-white">Body Composition Trend</h3>
            <p className="text-xs text-[#94A3B8]">AI-tracked weight, muscle & fat — 6 months</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00F5D4]" />Muscle</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#EF4444]" />Fat %</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={progressTrend}>
            <defs>
              <linearGradient id="muscleGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={NEON} stopOpacity={0.2} />
                <stop offset="95%" stopColor={NEON} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fatGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" stroke="#94A3B8" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={35} />
            <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }} />
            <Area type="monotone" dataKey="muscle" stroke={NEON} strokeWidth={2} fill="url(#muscleGrad)" name="Muscle (kg)" />
            <Area type="monotone" dataKey="fat" stroke="#EF4444" strokeWidth={2} fill="url(#fatGrad)" name="Fat (%)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Smart Recommendations */}
      <motion.div className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-4 h-4 text-[#7B2CBF]" />
          <h3 className="font-bold text-white">Smart Recommendations</h3>
          <span className="ml-auto text-xs text-[#94A3B8]">Updated daily by AI</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {recommendations.map((rec, i) => (
            <motion.div key={rec.id}
              className="p-4 rounded-xl group cursor-pointer transition-all"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
              whileHover={{ borderColor: `${priorityColors[rec.priority]}30`, background: `${priorityColors[rec.priority]}05` }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.06 }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="text-xl">{categoryEmojis[rec.category]}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-white text-sm">{rec.title}</h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase"
                        style={{ background: `${priorityColors[rec.priority]}15`, color: priorityColors[rec.priority] }}>
                        {rec.priority}
                      </span>
                    </div>
                    <p className="text-xs text-[#94A3B8] leading-relaxed mb-2">{rec.description}</p>
                    <p className="text-[10px] text-[#94A3B8]/60">Based on: {rec.based_on}</p>
                  </div>
                </div>
                {rec.action_label && (
                  <a href={rec.action_href || "#"}
                    className="flex items-center gap-1 text-xs font-semibold flex-shrink-0 mt-1"
                    style={{ color: priorityColors[rec.priority] }}>
                    {rec.action_label} <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Weekly Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Workouts This Week", value: "3/4", change: +12, icon: Dumbbell, color: NEON },
          { label: "Avg Session", value: "52 min", change: +8, icon: Clock, color: "#3B82F6" },
          { label: "Calories Burned", value: "2,140", change: -5, icon: Flame, color: "#F59E0B" },
          { label: "Consistency Score", value: "68%", change: +3, icon: TrendingUp, color: VIOLET },
        ].map((stat, i) => (
          <motion.div key={stat.label} className="glass-card p-5"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 + i * 0.06 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}25` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-bold ${stat.change >= 0 ? "text-[#00F5D4]" : "text-[#EF4444]"}`}>
                {stat.change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {Math.abs(stat.change)}%
              </div>
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-xs text-[#94A3B8] mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Dumbbell({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <svg className={className} style={style} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 5v14M18 5v14M6 9h12M6 15h12" />
  </svg>;
}
