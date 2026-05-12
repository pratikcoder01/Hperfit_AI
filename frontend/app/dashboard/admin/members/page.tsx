"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Search, Filter, UserPlus, MoreHorizontal,
  Mail, Phone, Calendar, ChevronLeft, ChevronRight
} from "lucide-react";
import { DataTable, StatusBadge } from "@/components/tables/DataTable";
import { getMembershipStatusColor, getInitials, getAvatarColor, formatDate } from "@/lib/utils";
import type { User } from "@/types";

// ─── Mock Data ────────────────────────────────
const mockMembers: User[] = Array.from({ length: 20 }, (_, i) => ({
  id: `member-${i + 1}`,
  full_name: ["Arjun Sharma", "Priya Patel", "Rahul Singh", "Kavya Nair", "Vikram Iyer",
    "Ananya Gupta", "Rohit Verma", "Sneha Kumar", "Aditya Rao", "Pooja Joshi"][i % 10],
  email: `member${i + 1}@example.com`,
  phone: `+91 9876${500000 + i * 1111}`,
  role: "user" as const,
  is_active: i % 5 !== 3,
  created_at: new Date(Date.now() - Math.random() * 1e10).toISOString(),
  updated_at: new Date().toISOString(),
  membership: {
    id: `mem-${i}`,
    user_id: `member-${i + 1}`,
    plan_id: "plan-1",
    status: (["active", "active", "active", "expired", "pending"] as const)[i % 5],
    start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + (60 - i * 3) * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    plan: {
      id: "plan-1",
      name: ["Monthly Pro", "Quarterly Elite", "Annual Premium"][i % 3],
      price: [2999, 7999, 24999][i % 3],
      interval: (["monthly", "quarterly", "yearly"] as const)[i % 3],
      features: [],
      is_active: true,
      created_at: new Date().toISOString(),
    },
  },
  attendance_count: Math.floor(Math.random() * 80),
  workout_count: Math.floor(Math.random() * 40),
}));

const PER_PAGE = 8;

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);

  const filtered = mockMembers.filter((m) => {
    const matchesSearch =
      m.full_name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      m.membership?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1 className="text-2xl font-black"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            Members <span className="gradient-neon">Management</span>
          </motion.h1>
          <p className="text-[#94A3B8] text-sm mt-1">{mockMembers.length} total members</p>
        </div>

        <motion.button
          className="flex items-center gap-2 bg-[#00F5D4] text-[#0B0F19] font-semibold px-4 py-2.5 rounded-xl text-sm transition-all"
          whileHover={{ boxShadow: "0 0 20px rgba(0,245,212,0.25)" }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </motion.button>
      </div>

      {/* Filters */}
      <motion.div
        className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      >
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm text-white placeholder-[#94A3B8] outline-none"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
        </div>

        {/* Status filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#94A3B8]" />
          {["all", "active", "expired", "pending", "cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                statusFilter === status
                  ? "bg-[#00F5D4]/15 text-[#00F5D4] border border-[#00F5D4]/30"
                  : "text-[#94A3B8] hover:text-white hover:bg-white/5"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
      >
        <DataTable
          columns={[
            {
              key: "full_name",
              label: "Member",
              render: (row) => (
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#0B0F19] flex-shrink-0"
                    style={{ backgroundColor: getAvatarColor(row.full_name) }}
                  >
                    {getInitials(row.full_name)}
                  </div>
                  <div>
                    <p className="font-medium text-white">{row.full_name}</p>
                    <p className="text-xs text-[#94A3B8] flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {row.email}
                    </p>
                  </div>
                </div>
              ),
            },
            {
              key: "phone",
              label: "Phone",
              render: (row) => (
                <span className="text-[#94A3B8] text-sm flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {row.phone || "—"}
                </span>
              ),
            },
            {
              key: "membership",
              label: "Plan",
              render: (row) => (
                <div>
                  <p className="text-white text-sm font-medium">{row.membership?.plan?.name || "No plan"}</p>
                  <p className="text-xs text-[#94A3B8]">
                    {row.membership?.end_date
                      ? `Expires ${formatDate(row.membership.end_date, { month: "short", day: "numeric", year: "numeric" })}`
                      : "—"}
                  </p>
                </div>
              ),
            },
            {
              key: "status",
              label: "Status",
              render: (row) => {
                const status = row.membership?.status || "pending";
                const colors = getMembershipStatusColor(status);
                return <StatusBadge status={status} {...colors} />;
              },
            },
            {
              key: "attendance_count",
              label: "Visits",
              render: (row) => (
                <span className="text-white font-semibold">{row.attendance_count}</span>
              ),
            },
            {
              key: "created_at",
              label: "Joined",
              render: (row) => (
                <span className="text-[#94A3B8] text-xs flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(row.created_at, { month: "short", day: "numeric", year: "numeric" })}
                </span>
              ),
            },
            {
              key: "actions",
              label: "",
              width: "50px",
              render: () => (
                <button className="p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              ),
            },
          ]}
          data={paginated}
          keyExtractor={(row) => row.id}
          emptyMessage="No members found matching your search"
          emptyIcon={<Users className="w-12 h-12" />}
        />
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        >
          <p className="text-sm text-[#94A3B8]">
            Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                  p === page
                    ? "bg-[#00F5D4] text-[#0B0F19]"
                    : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
