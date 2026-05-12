"use client";

import { motion } from "framer-motion";
import { 
  Users, BarChart3, TrendingUp, TrendingDown, 
  MessageSquare, Heart, Trophy, Share2, MousePointer2 
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar 
} from "recharts";

const ENGAGEMENT_DATA = [
  { name: "Mon", posts: 45, engagement: 2400 },
  { name: "Tue", posts: 52, engagement: 3100 },
  { name: "Wed", posts: 48, engagement: 2800 },
  { name: "Thu", posts: 61, engagement: 3900 },
  { name: "Fri", posts: 75, engagement: 4800 },
  { name: "Sat", posts: 92, engagement: 6200 },
  { name: "Sun", posts: 88, engagement: 5800 },
];

const CHURN_DATA = [
  { name: "New Users", value: 65, color: "#00F5D4" },
  { name: "Returning", value: 25, color: "#7B2CBF" },
  { name: "At Risk", value: 10, color: "#EF4444" },
];

export default function AdminSocialAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Startup <span className="gradient-neon">Growth Analytics</span></h1>
        <p className="text-[#94A3B8] text-sm mt-1">Real-time engagement, retention, and community growth metrics.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "DAU / MAU", value: "68%", icon: Users, color: "#00F5D4", trend: "+4.2%" },
          { label: "Avg. Engagement", value: "4.2m", icon: Heart, color: "#EF4444", trend: "+12.5%" },
          { label: "Post Velocity", value: "1.4k/hr", icon: MessageSquare, color: "#7B2CBF", trend: "+8.1%" },
          { label: "Viral K-Factor", value: "1.12", icon: Share2, color: "#F59E0B", trend: "+0.15" },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label} 
            className="glass-card p-4 border-b-2"
            style={{ borderBottomColor: stat.color + "40" }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 rounded-lg" style={{ backgroundColor: stat.color + "15" }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <span className="text-[10px] font-bold" style={{ color: stat.color }}>{stat.trend}</span>
            </div>
            <p className="text-2xl font-black text-white">{stat.value}</p>
            <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Engagement Trend */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#00F5D4]" />
              Community Engagement Trend
            </h3>
            <select className="bg-white/5 border border-white/10 rounded-lg text-[10px] px-2 py-1 text-white">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ENGAGEMENT_DATA}>
                <defs>
                  <linearGradient id="colorEngage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7B2CBF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7B2CBF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0B0F19", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px" }}
                  itemStyle={{ fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="engagement" stroke="#7B2CBF" fillOpacity={1} fill="url(#colorEngage)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* User Retention / Churn */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <h3 className="font-bold text-white text-sm flex items-center gap-2 mb-6">
            <MousePointer2 className="w-4 h-4 text-[#00F5D4]" />
            User Retention Segments
          </h3>
          <div className="grid grid-cols-[150px_1fr] gap-6 items-center">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CHURN_DATA}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {CHURN_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4">
              {CHURN_DATA.map((item) => (
                <div key={item.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#94A3B8]">{item.name}</span>
                    <span className="text-white font-bold">{item.value}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Social Features Health */}
      <div className="grid lg:grid-cols-3 gap-6">
        {[
          { label: "Challenge Participation", value: "84%", target: "90%", icon: Trophy, color: "#F59E0B" },
          { label: "Trainer Bookings", value: "2.4k", target: "3.0k", icon: Users, color: "#00F5D4" },
          { label: "Achievement Unlock Rate", value: "12/user", target: "15/user", icon: BarChart3, color: "#7B2CBF" },
        ].map((card, i) => (
          <div key={card.label} className="glass-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: card.color + "15" }}>
                <card.icon className="w-4 h-4" style={{ color: card.color }} />
              </div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{card.label}</h4>
            </div>
            <div className="flex items-end justify-between">
               <p className="text-3xl font-black text-white">{card.value}</p>
               <div className="text-right">
                 <p className="text-[10px] text-[#94A3B8]">Target</p>
                 <p className="text-xs font-bold text-white">{card.target}</p>
               </div>
            </div>
            <div className="h-1 rounded-full bg-white/5 mt-4 overflow-hidden">
               <motion.div 
                 className="h-full rounded-full" 
                 style={{ backgroundColor: card.color }}
                 initial={{ width: 0 }}
                 animate={{ width: card.value.includes("%") ? card.value : "75%" }}
               />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
