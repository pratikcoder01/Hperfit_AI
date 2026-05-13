"use client";

import { motion } from "framer-motion";
import { 
  Building2, Users, CreditCard, Activity, 
  Globe, ShieldCheck, Plus, Search, MoreHorizontal,
  Zap
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Cell, PieChart, Pie
} from "recharts";

const REVENUE_DATA = [
  { month: "Jan", revenue: 42000 },
  { month: "Feb", revenue: 48000 },
  { month: "Mar", revenue: 55000 },
  { month: "Apr", revenue: 62000 },
  { month: "May", revenue: 78000 },
];

const TENANTS = [
  { id: "1", name: "Gold's Gym Elite", members: 1240, status: "Active", tier: "Enterprise", revenue: "$4,200/mo" },
  { id: "2", name: "Anytime Fitness Pro", members: 850, status: "Active", tier: "Pro", revenue: "$2,800/mo" },
  { id: "3", name: "Crossfit Matrix", members: 320, status: "Pending", tier: "Starter", revenue: "$850/mo" },
  { id: "4", name: "Iron Temple", members: 450, status: "Active", tier: "Pro", revenue: "$1,500/mo" },
];

export default function SaaSManagementPage() {
  return (
    <div className="space-y-6 pb-10">
      {/* SaaS Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white">Global <span className="gradient-neon">SaaS Engine</span></h1>
          <p className="text-[#94A3B8] text-sm mt-1">Multi-tenant architecture and enterprise gym management.</p>
        </div>
        <button className="px-5 py-2.5 bg-[#7B2CBF] hover:bg-[#6D28AA] text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Gym Tenant
        </button>
      </div>

      {/* Global SaaS Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Gyms", value: "42", icon: Building2, color: "#7B2CBF" },
          { label: "Active Members", value: "12,481", icon: Users, color: "#00F5D4" },
          { label: "Total MRR", value: "$84,200", icon: CreditCard, color: "#F59E0B" },
          { label: "AI Usage Rate", value: "94%", icon: Zap, color: "#3B82F6" },
        ].map((s, i) => (
          <motion.div key={s.label} className="glass-card p-4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="p-2 rounded-lg bg-white/5 w-fit mb-3">
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div className="glass-card p-6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <h3 className="font-bold text-white text-sm mb-6 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#7B2CBF]" />
            Revenue Growth (Global)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#0B0F19", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }} />
                <Line type="monotone" dataKey="revenue" stroke="#7B2CBF" strokeWidth={3} dot={{ fill: "#7B2CBF", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="space-y-4">
           <div className="glass-card p-5">
              <h3 className="font-bold text-white text-sm mb-4">Enterprise Distribution</h3>
              <div className="space-y-4">
                {[
                  { tier: "Enterprise", count: 12, pct: 28, color: "#7B2CBF" },
                  { tier: "Pro", count: 18, pct: 42, color: "#00F5D4" },
                  { tier: "Starter", count: 12, pct: 30, color: "#94A3B8" },
                ].map((t) => (
                  <div key={t.tier} className="space-y-1">
                    <div className="flex justify-between text-xs font-bold">
                       <span className="text-white">{t.tier}</span>
                       <span className="text-[#94A3B8]">{t.count} Gyms</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                       <div className="h-full rounded-full" style={{ width: `${t.pct}%`, backgroundColor: t.color }} />
                    </div>
                  </div>
                ))}
              </div>
           </div>
           
           <div className="glass-card p-5 bg-[#00F5D4]/5 border border-[#00F5D4]/20">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-[#00F5D4] font-black text-xs uppercase tracking-widest">Global Status</h4>
                  <p className="text-white font-bold text-lg mt-1">Health: 99.98%</p>
                  <p className="text-[#94A3B8] text-[10px] mt-1">All tenants operating within performance SLA.</p>
                </div>
                <div className="p-2 rounded-lg bg-[#00F5D4]/10">
                   <ShieldCheck className="w-5 h-5 text-[#00F5D4]" />
                </div>
              </div>
           </div>
        </div>
      </div>

      {/* Tenant Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-bold text-white text-sm">Gym Tenants</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#94A3B8]" />
            <input type="text" placeholder="Search tenants..." className="bg-white/5 border border-white/10 rounded-lg py-1.5 pl-9 pr-4 text-xs text-white" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">
                <th className="px-6 py-4">Tenant Name</th>
                <th className="px-6 py-4">Members</th>
                <th className="px-6 py-4">Tier</th>
                <th className="px-6 py-4">Monthly Revenue</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {TENANTS.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center font-bold text-xs text-white">
                         {tenant.name[0]}
                       </div>
                       <span className="text-sm font-bold text-white">{tenant.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-[#94A3B8] font-bold">{tenant.members}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      tenant.tier === "Enterprise" ? "bg-[#7B2CBF]/10 text-[#7B2CBF]" : "bg-white/5 text-[#94A3B8]"
                    }`}>
                      {tenant.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-white">{tenant.revenue}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs">
                      <div className={`w-1.5 h-1.5 rounded-full ${tenant.status === "Active" ? "bg-[#00F5D4]" : "bg-[#F59E0B]"}`} />
                      <span className="text-white font-medium">{tenant.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg text-[#94A3B8] hover:text-white transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
