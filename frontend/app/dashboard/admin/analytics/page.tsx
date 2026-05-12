"use client";

import { motion } from "framer-motion";
import {
  BarChart3, TrendingUp, Users, Calendar,
  CreditCard, Activity, ArrowUpRight
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from "recharts";
import { StatCard } from "@/components/cards/StatCard";
import { formatCurrency } from "@/lib/utils";

const monthlyRevenue = [
  { month: "Jan", revenue: 142000, members: 85, churn: 5 },
  { month: "Feb", revenue: 156000, members: 92, churn: 3 },
  { month: "Mar", revenue: 131000, members: 88, churn: 7 },
  { month: "Apr", revenue: 178000, members: 105, churn: 2 },
  { month: "May", revenue: 195000, members: 118, churn: 4 },
  { month: "Jun", revenue: 210000, members: 127, churn: 3 },
  { month: "Jul", revenue: 198000, members: 122, churn: 6 },
  { month: "Aug", revenue: 235000, members: 141, churn: 2 },
  { month: "Sep", revenue: 248000, members: 156, churn: 1 },
  { month: "Oct", revenue: 261000, members: 168, churn: 3 },
  { month: "Nov", revenue: 279000, members: 181, churn: 2 },
  { month: "Dec", revenue: 312000, members: 200, churn: 4 },
];

const hourlyTraffic = [
  { hour: "6AM", avg: 12 }, { hour: "7AM", avg: 28 }, { hour: "8AM", avg: 45 },
  { hour: "9AM", avg: 38 }, { hour: "10AM", avg: 22 }, { hour: "11AM", avg: 15 },
  { hour: "12PM", avg: 20 }, { hour: "1PM", avg: 18 }, { hour: "2PM", avg: 14 },
  { hour: "3PM", avg: 17 }, { hour: "4PM", avg: 35 }, { hour: "5PM", avg: 58 },
  { hour: "6PM", avg: 72 }, { hour: "7PM", avg: 65 }, { hour: "8PM", avg: 48 },
  { hour: "9PM", avg: 22 }, { hour: "10PM", avg: 8 },
];

export default function AnalyticsPage() {
  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const totalNewMembers = monthlyRevenue.reduce((s, m) => s + m.members, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <motion.h1 className="text-2xl font-black"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          Analytics <span className="gradient-neon">Hub</span>
        </motion.h1>
        <p className="text-[#94A3B8] text-sm mt-1">Full business intelligence — FY 2025</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Annual Revenue" value={formatCurrency(totalRevenue)} change={23.4} icon={TrendingUp} iconColor="#00F5D4" delay={0} />
        <StatCard title="New Members" value={totalNewMembers} change={18.7} icon={Users} iconColor="#7B2CBF" delay={0.08} />
        <StatCard title="Avg Retention" value="94%" change={2.1} icon={Activity} iconColor="#3B82F6" delay={0.16} />
        <StatCard title="Avg LTV" value={formatCurrency(28400)} change={11.5} icon={CreditCard} iconColor="#F59E0B" delay={0.24} />
      </div>

      {/* Revenue + Members Chart */}
      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-white">Revenue Growth</h3>
              <p className="text-xs text-[#94A3B8]">Monthly revenue — FY 2025</p>
            </div>
            <button className="flex items-center gap-1 text-xs text-[#00F5D4] hover:underline">
              Export <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyRevenue}>
              <defs>
                <linearGradient id="analyticsRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00F5D4" stopOpacity={0.20} />
                  <stop offset="95%" stopColor="#00F5D4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#94A3B8" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} width={45} />
              <Tooltip
                contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
                formatter={(v) => [formatCurrency(Number(v ?? 0)), "Revenue"]}
              />
              <Area type="monotone" dataKey="revenue" stroke="#00F5D4" strokeWidth={2} fill="url(#analyticsRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h3 className="font-bold text-white mb-1">Member Acquisition</h3>
          <p className="text-xs text-[#94A3B8] mb-4">New members vs churn per month</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyRevenue} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" stroke="#94A3B8" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip
                contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
              />
              <Bar dataKey="members" fill="#7B2CBF" opacity={0.8} radius={[3, 3, 0, 0]} name="New" />
              <Bar dataKey="churn" fill="#EF4444" opacity={0.7} radius={[3, 3, 0, 0]} name="Churn" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Hourly Traffic */}
      <motion.div className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-white">Peak Hours Analysis</h3>
            <p className="text-xs text-[#94A3B8]">Average check-ins per hour of day</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs"
            style={{ background: "rgba(0,245,212,0.08)", border: "1px solid rgba(0,245,212,0.15)", color: "#00F5D4" }}>
            Peak: 6PM–7PM
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={hourlyTraffic} barSize={18}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="hour" stroke="#94A3B8" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
              formatter={(v) => [Number(v ?? 0), "Avg check-ins"]}
            />
            <Bar dataKey="avg" radius={[4, 4, 0, 0]}
              fill="#00F5D4" opacity={0.75} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* KPI Breakdown Table */}
      <motion.div className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <h3 className="font-bold text-white mb-4">Monthly Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["Month", "Revenue", "New Members", "Churn", "Net Growth", "MoM Growth"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {monthlyRevenue.map((row, i) => {
                const prev = monthlyRevenue[i - 1];
                const growth = prev ? (((row.revenue - prev.revenue) / prev.revenue) * 100).toFixed(1) : "—";
                const isPositive = prev && row.revenue > prev.revenue;

                return (
                  <motion.tr
                    key={row.month}
                    className="border-b border-white/3 hover:bg-white/2 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + i * 0.03 }}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-white">{row.month}</td>
                    <td className="px-4 py-3 text-sm font-bold text-[#00F5D4]">{formatCurrency(row.revenue)}</td>
                    <td className="px-4 py-3 text-sm text-white">{row.members}</td>
                    <td className="px-4 py-3 text-sm text-[#EF4444]">{row.churn}</td>
                    <td className="px-4 py-3 text-sm font-medium text-[#00F5D4]">+{row.members - row.churn}</td>
                    <td className="px-4 py-3 text-sm">
                      {growth === "—" ? (
                        <span className="text-[#94A3B8]">—</span>
                      ) : (
                        <span className={isPositive ? "text-[#00F5D4]" : "text-[#EF4444]"}>
                          {isPositive ? "+" : ""}{growth}%
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
