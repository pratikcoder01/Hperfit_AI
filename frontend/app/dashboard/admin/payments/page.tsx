"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard, Search, Filter, Download,
  ChevronLeft, ChevronRight, TrendingUp
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import { DataTable, StatusBadge } from "@/components/tables/DataTable";
import { StatCard } from "@/components/cards/StatCard";
import { formatCurrency, formatDate, getPaymentStatusColor } from "@/lib/utils";
import type { Payment } from "@/types";

// ─── Mock Data ────────────────────────────────
const mockPayments: Payment[] = Array.from({ length: 30 }, (_, i) => ({
  id: `pay-${i + 1}`,
  user_id: `member-${(i % 10) + 1}`,
  amount: [2999, 7999, 24999, 2999, 7999][i % 5],
  currency: "INR",
  status: (["completed", "completed", "completed", "pending", "failed"] as const)[i % 5],
  method: (["upi", "card", "cash", "bank_transfer"] as const)[i % 4],
  transaction_id: i % 5 !== 3 ? `TXN${100000 + i}` : undefined,
  paid_at: i % 5 !== 3 ? new Date(Date.now() - i * 3600000 * 12).toISOString() : undefined,
  created_at: new Date(Date.now() - i * 3600000 * 12).toISOString(),
  updated_at: new Date().toISOString(),
  user: {
    id: `member-${(i % 10) + 1}`,
    full_name: ["Arjun Sharma", "Priya Patel", "Rahul Singh", "Kavya Nair", "Vikram Iyer",
      "Ananya Gupta", "Rohit Verma", "Sneha Kumar", "Aditya Rao", "Pooja Joshi"][i % 10],
    email: `member${(i % 10) + 1}@example.com`,
    role: "user" as const,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
}));

const revenueTimeline = [
  { week: "W1 Apr", revenue: 58000 }, { week: "W2 Apr", revenue: 72000 },
  { week: "W3 Apr", revenue: 64000 }, { week: "W4 Apr", revenue: 85000 },
  { week: "W1 May", revenue: 71000 }, { week: "W2 May", revenue: 93000 },
  { week: "W3 May", revenue: 78000 }, { week: "W4 May", revenue: 101000 },
];

const PER_PAGE = 8;

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const filtered = mockPayments.filter((p) => {
    const matchesSearch =
      p.user?.full_name.toLowerCase().includes(search.toLowerCase()) ||
      p.transaction_id?.toLowerCase().includes(search.toLowerCase()) ||
      p.method.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalRevenue = mockPayments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1 className="text-2xl font-black"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            Payments <span className="gradient-neon">Tracker</span>
          </motion.h1>
          <p className="text-[#94A3B8] text-sm mt-1">{mockPayments.length} total transactions</p>
        </div>
        <motion.button
          className="flex items-center gap-2 glass border border-white/10 text-white font-medium px-4 py-2.5 rounded-xl text-sm hover:border-[#00F5D4]/30 transition-all"
          whileTap={{ scale: 0.97 }}
        >
          <Download className="w-4 h-4" />
          Export CSV
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} change={18.3} icon={TrendingUp} iconColor="#00F5D4" delay={0} />
        <StatCard title="This Month" value={formatCurrency(312000)} change={15.2} icon={CreditCard} iconColor="#7B2CBF" delay={0.08} />
        <StatCard title="Pending" value={mockPayments.filter(p => p.status === "pending").length} icon={CreditCard} iconColor="#F59E0B" delay={0.16} />
        <StatCard title="Failed" value={mockPayments.filter(p => p.status === "failed").length} change={-2} icon={CreditCard} iconColor="#EF4444" delay={0.24} />
      </div>

      {/* Revenue chart */}
      <motion.div
        className="glass-card p-6"
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      >
        <h3 className="font-bold text-white mb-4">Revenue Timeline</h3>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={revenueTimeline}>
            <defs>
              <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F5D4" stopOpacity={0.20} />
                <stop offset="95%" stopColor="#00F5D4" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="week" stroke="#94A3B8" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis stroke="#94A3B8" tick={{ fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`} width={45} />
            <Tooltip
              contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}
              formatter={(v: number) => [formatCurrency(v), "Revenue"]}
            />
            <Area type="monotone" dataKey="revenue" stroke="#00F5D4" strokeWidth={2} fill="url(#payGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
      >
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text" placeholder="Search transactions..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm text-white placeholder-[#94A3B8] outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#94A3B8]" />
          {["all", "completed", "pending", "failed", "refunded"].map((s) => (
            <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                statusFilter === s
                  ? "bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/30"
                  : "text-[#94A3B8] hover:text-white hover:bg-white/5"
              }`}>{s}</button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <DataTable
        columns={[
          {
            key: "user",
            label: "Member",
            render: (row) => (
              <div>
                <p className="font-medium text-white">{row.user?.full_name}</p>
                <p className="text-xs text-[#94A3B8]">{row.user?.email}</p>
              </div>
            ),
          },
          {
            key: "amount",
            label: "Amount",
            render: (row) => (
              <span className="font-black text-white text-base">{formatCurrency(row.amount)}</span>
            ),
          },
          {
            key: "method",
            label: "Method",
            render: (row) => (
              <span className="capitalize text-[#94A3B8] text-sm">{row.method.replace("_", " ")}</span>
            ),
          },
          {
            key: "transaction_id",
            label: "Transaction ID",
            render: (row) => (
              <span className="font-mono text-xs text-[#94A3B8]">{row.transaction_id || "—"}</span>
            ),
          },
          {
            key: "status",
            label: "Status",
            render: (row) => {
              const colors = getPaymentStatusColor(row.status);
              return <StatusBadge status={row.status} {...colors} />;
            },
          },
          {
            key: "created_at",
            label: "Date",
            render: (row) => (
              <span className="text-[#94A3B8] text-xs">
                {formatDate(row.created_at, { month: "short", day: "numeric", year: "numeric" })}
              </span>
            ),
          },
        ]}
        data={paginated}
        keyExtractor={(row) => row.id}
        emptyMessage="No transactions found"
        emptyIcon={<CreditCard className="w-12 h-12" />}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-[#94A3B8]">
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                  p === page ? "bg-[#00F5D4] text-[#0B0F19]" : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                }`}>{p}</button>
            ))}
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages}
              className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
