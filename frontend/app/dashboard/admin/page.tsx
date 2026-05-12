"use client";

import { motion } from "framer-motion";
import {
  Users, CreditCard, TrendingUp, UserCheck,
  Calendar, Dumbbell, AlertTriangle, ArrowUpRight,
  Activity, Zap
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  BarChart, Bar
} from "recharts";
import { StatCard, StatCardSkeleton } from "@/components/cards/StatCard";
import { DataTable, StatusBadge } from "@/components/tables/DataTable";
import { formatCurrency, formatDate, getMembershipStatusColor } from "@/lib/utils";
import type { User, Payment } from "@/types";

// ─────────────────────────────────────────────
//  Mock Data (replace with API calls)
// ─────────────────────────────────────────────
const revenueData = [
  { month: "Jan", revenue: 142000, target: 130000 },
  { month: "Feb", revenue: 156000, target: 145000 },
  { month: "Mar", revenue: 131000, target: 150000 },
  { month: "Apr", revenue: 178000, target: 160000 },
  { month: "May", revenue: 195000, target: 175000 },
  { month: "Jun", revenue: 210000, target: 190000 },
  { month: "Jul", revenue: 198000, target: 200000 },
  { month: "Aug", revenue: 235000, target: 210000 },
  { month: "Sep", revenue: 248000, target: 225000 },
  { month: "Oct", revenue: 261000, target: 240000 },
  { month: "Nov", revenue: 279000, target: 255000 },
  { month: "Dec", revenue: 312000, target: 270000 },
];

const attendanceData = [
  { day: "Mon", count: 87 }, { day: "Tue", count: 73 },
  { day: "Wed", count: 112 }, { day: "Thu", count: 95 },
  { day: "Fri", count: 128 }, { day: "Sat", count: 143 },
  { day: "Sun", count: 61 },
];

const membershipDist = [
  { name: "Monthly", value: 45, color: "#00F5D4" },
  { name: "Quarterly", value: 30, color: "#7B2CBF" },
  { name: "Yearly", value: 25, color: "#3B82F6" },
];

const recentMembers: Partial<User>[] = [
  { id: "1", full_name: "Arjun Sharma", email: "arjun@example.com", created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: "2", full_name: "Priya Patel", email: "priya@example.com", created_at: new Date(Date.now() - 7200000).toISOString() },
  { id: "3", full_name: "Rahul Singh", email: "rahul@example.com", created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: "4", full_name: "Kavya Nair", email: "kavya@example.com", created_at: new Date(Date.now() - 172800000).toISOString() },
  { id: "5", full_name: "Vikram Iyer", email: "vikram@example.com", created_at: new Date(Date.now() - 259200000).toISOString() },
];

const recentPayments: Partial<Payment>[] = [
  { id: "1", amount: 7999, status: "completed", method: "upi", created_at: new Date(Date.now() - 1800000).toISOString() },
  { id: "2", amount: 2999, status: "completed", method: "card", created_at: new Date(Date.now() - 5400000).toISOString() },
  { id: "3", amount: 7999, status: "pending", method: "bank_transfer", created_at: new Date(Date.now() - 9000000).toISOString() },
  { id: "4", amount: 2999, status: "completed", method: "cash", created_at: new Date(Date.now() - 18000000).toISOString() },
  { id: "5", amount: 24999, status: "completed", method: "card", created_at: new Date(Date.now() - 86400000).toISOString() },
];

const alerts = [
  { id: "1", type: "warning", message: "8 memberships expiring in the next 7 days" },
  { id: "2", type: "info", message: "3 pending payments require follow-up" },
  { id: "3", type: "success", message: "Monthly revenue target exceeded by 15%" },
];

// ─────────────────────────────────────────────
//  Custom Tooltip
// ─────────────────────────────────────────────
const RevenueTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 text-sm" style={{ border: "1px solid rgba(0,245,212,0.20)" }}>
        <p className="text-[#94A3B8] mb-1">{label}</p>
        <p className="text-[#00F5D4] font-bold">{formatCurrency(payload[0].value)}</p>
        {payload[1] && <p className="text-[#94A3B8] text-xs">Target: {formatCurrency(payload[1].value)}</p>}
      </div>
    );
  }
  return null;
};

// ─────────────────────────────────────────────
//  Admin Dashboard Page
// ─────────────────────────────────────────────
export default function AdminDashboard() {
  const isLoading = false; // Replace with real loading state

  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* ── Header ───────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            className="text-2xl font-black"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Admin <span className="gradient-neon">Overview</span>
          </motion.h1>
          <motion.p
            className="text-[#94A3B8] text-sm mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Welcome back — here&apos;s what&apos;s happening today
          </motion.p>
        </div>

        <motion.div
          className="flex items-center gap-2 px-3 py-2 rounded-xl glass border border-[#00F5D4]/15"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <span className="w-2 h-2 rounded-full bg-[#00F5D4] animate-pulse" />
          <span className="text-xs text-[#00F5D4] font-medium">Live Dashboard</span>
        </motion.div>
      </div>

      {/* ── Alerts ───────────────────────────── */}
      <div className="space-y-2">
        {alerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            style={{
              background: alert.type === "warning"
                ? "rgba(245,158,11,0.08)"
                : alert.type === "success"
                ? "rgba(0,245,212,0.08)"
                : "rgba(59,130,246,0.08)",
              border: `1px solid ${
                alert.type === "warning"
                  ? "rgba(245,158,11,0.20)"
                  : alert.type === "success"
                  ? "rgba(0,245,212,0.20)"
                  : "rgba(59,130,246,0.20)"
              }`,
            }}
          >
            <AlertTriangle
              className="w-4 h-4 flex-shrink-0"
              style={{
                color: alert.type === "warning" ? "#F59E0B"
                  : alert.type === "success" ? "#00F5D4" : "#3B82F6",
              }}
            />
            <span style={{
              color: alert.type === "warning" ? "#F59E0B"
                : alert.type === "success" ? "#00F5D4" : "#3B82F6",
            }}>
              {alert.message}
            </span>
          </motion.div>
        ))}
      </div>

      {/* ── KPI Stats ────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} delay={i * 0.05} />)
        ) : (
          <>
            <StatCard
              title="Total Members"
              value={1284}
              change={12.5}
              icon={Users}
              iconColor="#00F5D4"
              delay={0}
            />
            <StatCard
              title="Monthly Revenue"
              value="₹3.12L"
              change={18.3}
              icon={TrendingUp}
              iconColor="#7B2CBF"
              delay={0.08}
            />
            <StatCard
              title="Active Members"
              value={1041}
              change={5.2}
              icon={UserCheck}
              iconColor="#3B82F6"
              delay={0.16}
            />
            <StatCard
              title="Today's Check-ins"
              value={143}
              change={-3.1}
              icon={Calendar}
              iconColor="#F59E0B"
              delay={0.24}
            />
          </>
        )}
      </div>

      {/* ── Charts Row ───────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <motion.div
          className="lg:col-span-2 glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-white">Revenue Overview</h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">Monthly revenue vs target</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[#00F5D4] rounded-full" /> Revenue</span>
              <span className="flex items-center gap-1.5 text-[#94A3B8]"><span className="w-3 h-0.5 bg-white/20 rounded-full" /> Target</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F5D4" stopOpacity={0.20} />
                  <stop offset="95%" stopColor="#00F5D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#94A3B8" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<RevenueTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#00F5D4" strokeWidth={2}
                fill="url(#revenueGrad)" />
              <Area type="monotone" dataKey="target" stroke="rgba(255,255,255,0.20)" strokeWidth={1.5}
                fill="transparent" strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Membership Distribution */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <h3 className="font-bold text-white mb-1">Membership Plans</h3>
          <p className="text-xs text-[#94A3B8] mb-6">Distribution by plan type</p>
          <div className="flex justify-center mb-4">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={membershipDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {membershipDist.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {membershipDist.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[#94A3B8]">{item.name}</span>
                </div>
                <span className="font-semibold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Attendance + Secondary Stats ─────── */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Weekly Attendance */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="font-bold text-white mb-1">Weekly Attendance</h3>
          <p className="text-xs text-[#94A3B8] mb-4">Check-ins by day of week</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={attendanceData} barSize={28}>
              <XAxis dataKey="day" stroke="#94A3B8" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip
                contentStyle={{
                  background: "#111827",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  color: "#fff",
                }}
                cursor={{ fill: "rgba(255,255,255,0.04)" }}
              />
              <Bar dataKey="count" fill="#00F5D4" opacity={0.80} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="glass-card p-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <h3 className="font-bold text-white">Quick Stats</h3>
          {[
            { label: "Expiring this week", value: "8", icon: AlertTriangle, color: "#F59E0B" },
            { label: "Active workouts", value: "34", icon: Dumbbell, color: "#00F5D4" },
            { label: "Pending payments", value: "3", icon: CreditCard, color: "#EF4444" },
            { label: "Avg session", value: "58m", icon: Activity, color: "#7B2CBF" },
          ].map((s) => (
            <div key={s.label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${s.color}15`, border: `1px solid ${s.color}25` }}>
                  <s.icon className="w-4 h-4" style={{ color: s.color }} />
                </div>
                <span className="text-sm text-[#94A3B8]">{s.label}</span>
              </div>
              <span className="font-bold text-white">{s.value}</span>
            </div>
          ))}
        </motion.div>

        {/* Top Metrics */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="font-bold text-white mb-4">Performance</h3>
          {[
            { label: "Member Retention", value: 94, color: "#00F5D4" },
            { label: "Plan Conversion", value: 67, color: "#7B2CBF" },
            { label: "Revenue vs Target", value: 115, color: "#3B82F6" },
            { label: "Attendance Rate", value: 78, color: "#F59E0B" },
          ].map((m) => (
            <div key={m.label} className="mb-4 last:mb-0">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-[#94A3B8]">{m.label}</span>
                <span className="font-semibold text-white">{m.value}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/5">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: m.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(m.value, 100)}%` }}
                  transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── Recent Data Tables ────────────────── */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white">Recent Members</h3>
            <button className="text-xs text-[#00F5D4] hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <DataTable
            columns={[
              {
                key: "full_name",
                label: "Member",
                render: (row) => (
                  <div>
                    <p className="font-medium text-white">{row.full_name}</p>
                    <p className="text-xs text-[#94A3B8]">{row.email}</p>
                  </div>
                ),
              },
              {
                key: "created_at",
                label: "Joined",
                render: (row) => (
                  <span className="text-[#94A3B8] text-xs">
                    {row.created_at ? formatDate(row.created_at, { month: "short", day: "numeric" }) : "—"}
                  </span>
                ),
              },
              {
                key: "status",
                label: "Status",
                render: () => {
                  const colors = getMembershipStatusColor("active");
                  return <StatusBadge status="active" {...colors} />;
                },
              },
            ]}
            data={recentMembers}
            keyExtractor={(row) => row.id!}
          />
        </motion.div>

        {/* Recent Payments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-white">Recent Payments</h3>
            <button className="text-xs text-[#00F5D4] hover:underline flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <DataTable
            columns={[
              {
                key: "amount",
                label: "Amount",
                render: (row) => (
                  <span className="font-bold text-white">{formatCurrency(row.amount ?? 0)}</span>
                ),
              },
              {
                key: "method",
                label: "Method",
                render: (row) => (
                  <span className="text-[#94A3B8] text-xs capitalize">{row.method?.replace("_", " ")}</span>
                ),
              },
              {
                key: "status",
                label: "Status",
                render: (row) => {
                  const colors = {
                    completed: { bg: "rgba(0,245,212,0.10)", text: "#00F5D4", border: "rgba(0,245,212,0.25)" },
                    pending: { bg: "rgba(245,158,11,0.10)", text: "#F59E0B", border: "rgba(245,158,11,0.25)" },
                    failed: { bg: "rgba(239,68,68,0.10)", text: "#EF4444", border: "rgba(239,68,68,0.25)" },
                  }[row.status ?? "pending"] ?? { bg: "rgba(148,163,184,0.10)", text: "#94A3B8", border: "rgba(148,163,184,0.25)" };

                  return <StatusBadge status={row.status ?? ""} {...colors} />;
                },
              },
              {
                key: "created_at",
                label: "Date",
                render: (row) => (
                  <span className="text-[#94A3B8] text-xs">
                    {row.created_at ? formatDate(row.created_at, { month: "short", day: "numeric" }) : "—"}
                  </span>
                ),
              },
            ]}
            data={recentPayments}
            keyExtractor={(row) => row.id!}
          />
        </motion.div>
      </div>
    </div>
  );
}
