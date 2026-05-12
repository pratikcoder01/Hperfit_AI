"use client";

import { motion } from "framer-motion";
import {
  Calendar, Dumbbell, TrendingUp, Flame,
  Clock, Target, Award, ChevronRight, CheckCircle2,
  BarChart3, Zap
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadialBarChart, RadialBar
} from "recharts";
import { StatCard } from "@/components/cards/StatCard";
import { useAuthStore } from "@/store/authStore";
import { formatDate, daysRemaining } from "@/lib/utils";

// ─────────────────────────────────────────────
//  Mock Data
// ─────────────────────────────────────────────
const attendanceHistory = [
  { date: "May 1", sessions: 1 }, { date: "May 2", sessions: 0 },
  { date: "May 3", sessions: 1 }, { date: "May 4", sessions: 1 },
  { date: "May 5", sessions: 0 }, { date: "May 6", sessions: 1 },
  { date: "May 7", sessions: 1 }, { date: "May 8", sessions: 1 },
  { date: "May 9", sessions: 0 }, { date: "May 10", sessions: 1 },
  { date: "May 11", sessions: 1 }, { date: "May 12", sessions: 1 },
];

const weeklyWorkouts = [
  { day: "Mon", completed: 1 }, { day: "Tue", completed: 0 },
  { day: "Wed", completed: 1 }, { day: "Thu", completed: 1 },
  { day: "Fri", completed: 0 }, { day: "Sat", completed: 1 },
  { day: "Sun", completed: 0 },
];

const progressData = [
  { month: "Jan", weight: 82 }, { month: "Feb", weight: 80 },
  { month: "Mar", weight: 79 }, { month: "Apr", weight: 77 },
  { month: "May", weight: 75 }, { month: "Jun", weight: 74 },
];

const todayWorkout = {
  name: "Push Day — Chest & Shoulders",
  exercises: [
    { name: "Bench Press", sets: 4, reps: 10, done: true },
    { name: "Incline Dumbbell Press", sets: 3, reps: 12, done: true },
    { name: "Shoulder Press", sets: 4, reps: 8, done: false },
    { name: "Lateral Raises", sets: 3, reps: 15, done: false },
    { name: "Tricep Dips", sets: 3, reps: 12, done: false },
  ],
};

const membership = {
  plan: "Pro Plan",
  status: "active",
  end_date: "2025-07-15",
  features: ["Unlimited gym access", "Personal locker", "Group classes"],
};

const achievements = [
  { label: "30-Day Streak", icon: Flame, earned: true, color: "#F59E0B" },
  { label: "100 Check-ins", icon: Calendar, earned: true, color: "#00F5D4" },
  { label: "Weight Goal", icon: Target, earned: false, color: "#7B2CBF" },
  { label: "First Workout", icon: Dumbbell, earned: true, color: "#3B82F6" },
];

// ─────────────────────────────────────────────
//  Component
// ─────────────────────────────────────────────
export default function UserDashboard() {
  const { user } = useAuthStore();
  const daysLeft = daysRemaining(membership.end_date);
  const completedExercises = todayWorkout.exercises.filter((e) => e.done).length;
  const workoutProgress = (completedExercises / todayWorkout.exercises.length) * 100;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 max-w-[1400px]">
      {/* ── Header ───────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <motion.p
            className="text-[#94A3B8] text-sm mb-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {greeting} 👋
          </motion.p>
          <motion.h1
            className="text-2xl font-black"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {user?.full_name?.split(" ")[0]}&apos;s{" "}
            <span className="gradient-neon">Dashboard</span>
          </motion.h1>
        </div>

        {/* Streak indicator */}
        <motion.div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.20)" }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Flame className="w-5 h-5 text-[#F59E0B]" />
          <div>
            <p className="text-sm font-black text-[#F59E0B]">7 Day Streak</p>
            <p className="text-[10px] text-[#94A3B8]">Keep it up!</p>
          </div>
        </motion.div>
      </div>

      {/* ── KPI Stats ────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="This Month" value={18} suffix=" visits" change={20} icon={Calendar} iconColor="#00F5D4" delay={0} />
        <StatCard title="Workouts Done" value={12} change={33} icon={Dumbbell} iconColor="#7B2CBF" delay={0.08} />
        <StatCard title="Calories Burned" value="4.2K" change={15} icon={Flame} iconColor="#F59E0B" delay={0.16} />
        <StatCard title="Total Hours" value={24} suffix="h" change={8} icon={Clock} iconColor="#3B82F6" delay={0.24} />
      </div>

      {/* ── Main Grid ────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Today's Workout */}
        <motion.div
          className="lg:col-span-2 glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-white">Today&apos;s Workout</h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">{todayWorkout.name}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-black gradient-neon">{workoutProgress.toFixed(0)}%</p>
              <p className="text-xs text-[#94A3B8]">{completedExercises}/{todayWorkout.exercises.length} done</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-2 rounded-full bg-white/5 mb-6">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[#00F5D4] to-[#7B2CBF]"
              initial={{ width: 0 }}
              animate={{ width: `${workoutProgress}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            />
          </div>

          {/* Exercise list */}
          <div className="space-y-3">
            {todayWorkout.exercises.map((exercise, i) => (
              <motion.div
                key={exercise.name}
                className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                  exercise.done ? "opacity-60" : ""
                }`}
                style={{
                  background: exercise.done ? "rgba(0,245,212,0.05)" : "rgba(255,255,255,0.03)",
                  border: exercise.done ? "1px solid rgba(0,245,212,0.15)" : "1px solid rgba(255,255,255,0.06)",
                }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.06 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0`}
                    style={{
                      background: exercise.done ? "rgba(0,245,212,0.20)" : "rgba(255,255,255,0.06)",
                    }}
                  >
                    {exercise.done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#00F5D4]" />
                    ) : (
                      <span className="text-[10px] text-[#94A3B8]">{i + 1}</span>
                    )}
                  </div>
                  <span className={`text-sm font-medium ${exercise.done ? "text-[#94A3B8] line-through" : "text-white"}`}>
                    {exercise.name}
                  </span>
                </div>
                <span className="text-xs text-[#94A3B8]">
                  {exercise.sets}×{exercise.reps}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Membership + Achievements */}
        <div className="space-y-4">
          {/* Membership Card */}
          <motion.div
            className="glass-card p-5 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            style={{ border: "1px solid rgba(0,245,212,0.15)" }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[#00F5D4]/5 blur-2xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-[#00F5D4]" />
                <span className="text-xs font-semibold text-[#00F5D4]">ACTIVE MEMBERSHIP</span>
              </div>
              <h3 className="font-black text-xl text-white mb-1">{membership.plan}</h3>
              <p className="text-xs text-[#94A3B8] mb-4">
                Expires {formatDate(membership.end_date)} •{" "}
                <span className={daysLeft < 14 ? "text-[#F59E0B]" : "text-[#00F5D4]"}>
                  {daysLeft} days left
                </span>
              </p>

              {/* Progress */}
              <div className="mb-4">
                <div className="h-1.5 rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00F5D4] to-[#7B2CBF]"
                    style={{ width: `${Math.min((daysLeft / 30) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <ul className="space-y-1.5">
                {membership.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-[#94A3B8]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00F5D4]" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            className="glass-card p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Achievements</h3>
              <button className="text-xs text-[#00F5D4] flex items-center gap-1">
                All <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((a) => (
                <div
                  key={a.label}
                  className={`p-3 rounded-xl text-center transition-all ${
                    a.earned ? "" : "opacity-40 grayscale"
                  }`}
                  style={{
                    background: `${a.color}10`,
                    border: `1px solid ${a.color}${a.earned ? "30" : "15"}`,
                  }}
                >
                  <a.icon className="w-5 h-5 mx-auto mb-1.5" style={{ color: a.color }} />
                  <p className="text-xs text-[#94A3B8]">{a.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Progress Charts ───────────────────── */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Weight Progress */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white">Weight Progress</h3>
              <p className="text-xs text-[#94A3B8]">Last 6 months</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-[#00F5D4]">-8 kg</p>
              <p className="text-xs text-[#94A3B8]">Total lost</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={progressData}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7B2CBF" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#7B2CBF" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#94A3B8" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
                domain={["auto", "auto"]} tickFormatter={(v) => `${v}kg`} width={40} />
              <Tooltip
                contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
                labelStyle={{ color: "#94A3B8" }}
                itemStyle={{ color: "#7B2CBF" }}
              />
              <Area type="monotone" dataKey="weight" stroke="#7B2CBF" strokeWidth={2} fill="url(#weightGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Attendance Streak */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white">Attendance Calendar</h3>
              <p className="text-xs text-[#94A3B8]">May 2025</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#94A3B8]">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-[#00F5D4]/80" />Present
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-white/5" />Absent
              </span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div key={i} className="text-center text-[10px] text-[#94A3B8] font-medium pb-1">{d}</div>
            ))}
            {attendanceHistory.map((day, i) => (
              <motion.div
                key={i}
                className="aspect-square rounded-md flex items-center justify-center text-[10px]"
                style={{
                  background: day.sessions > 0 ? "rgba(0,245,212,0.25)" : "rgba(255,255,255,0.04)",
                  border: day.sessions > 0 ? "1px solid rgba(0,245,212,0.30)" : "1px solid rgba(255,255,255,0.05)",
                  color: day.sessions > 0 ? "#00F5D4" : "#94A3B8",
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.03 }}
                whileHover={{ scale: 1.15 }}
              >
                {i + 1}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
