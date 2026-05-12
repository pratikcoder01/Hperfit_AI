"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Bell, Search, ChevronDown, LogOut, User, Settings, X } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { getInitials, getAvatarColor } from "@/lib/utils";
import Link from "next/link";

interface TopbarProps {
  onMenuToggle: () => void;
}

const notifications = [
  { id: "1", title: "New member joined", message: "Rahul Sharma signed up for Pro plan", time: "2m ago", type: "user" },
  { id: "2", title: "Payment received", message: "₹7,999 from Priya Patel", time: "15m ago", type: "payment" },
  { id: "3", title: "Membership expiring", message: "5 members expire this week", time: "1h ago", type: "warning" },
];

export function Topbar({ onMenuToggle }: TopbarProps) {
  const { user, logout } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const avatarColor = user ? getAvatarColor(user.full_name) : "#00F5D4";
  const unreadCount = notifications.length;

  return (
    <header
      className="h-16 flex items-center justify-between px-6 border-b border-white/5 sticky top-0 z-30"
      style={{ background: "rgba(11, 15, 25, 0.90)", backdropFilter: "blur(20px)" }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="text-[#94A3B8] hover:text-white transition-colors p-1"
          id="topbar-menu-toggle"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#94A3B8] transition-all"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", minWidth: 220 }}
        >
          <Search className="w-4 h-4 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search members, workouts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-white placeholder-[#94A3B8] text-sm w-full"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Mobile search */}
        <button
          className="md:hidden text-[#94A3B8] hover:text-white transition-colors p-2"
          onClick={() => setShowSearch(!showSearch)}
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <motion.button
            className="relative p-2 rounded-lg text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all"
            onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
            whileTap={{ scale: 0.95 }}
            id="topbar-notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#00F5D4]"
                style={{ boxShadow: "0 0 6px rgba(0,245,212,0.60)" }} />
            )}
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                className="absolute right-0 top-full mt-2 w-80 rounded-xl overflow-hidden"
                style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 60px rgba(0,0,0,0.50)" }}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                  <span className="text-sm font-semibold">Notifications</span>
                  <span className="text-xs text-[#00F5D4] font-medium">{unreadCount} new</span>
                </div>
                <div className="divide-y divide-white/5">
                  {notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-white/3 transition-colors cursor-pointer">
                      <p className="text-sm font-medium text-white mb-0.5">{n.title}</p>
                      <p className="text-xs text-[#94A3B8]">{n.message}</p>
                      <p className="text-xs text-[#94A3B8]/60 mt-1">{n.time}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-white/5">
                  <button className="text-xs text-[#00F5D4] hover:underline w-full text-center">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all"
            onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
            id="topbar-profile"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-[#0B0F19]"
              style={{ backgroundColor: avatarColor }}
            >
              {user ? getInitials(user.full_name) : "?"}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-medium text-white leading-tight">{user?.full_name}</p>
              <p className="text-[10px] text-[#94A3B8] leading-tight capitalize">{user?.role}</p>
            </div>
            <ChevronDown className="w-3 h-3 text-[#94A3B8] hidden md:block" />
          </button>

          <AnimatePresence>
            {showProfile && (
              <motion.div
                className="absolute right-0 top-full mt-2 w-52 rounded-xl overflow-hidden"
                style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 20px 60px rgba(0,0,0,0.50)" }}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <div className="px-4 py-3 border-b border-white/5">
                  <p className="text-sm font-semibold text-white">{user?.full_name}</p>
                  <p className="text-xs text-[#94A3B8]">{user?.email}</p>
                </div>
                <div className="p-1.5">
                  <Link href="/dashboard/settings"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all"
                    onClick={() => setShowProfile(false)}
                  >
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  <Link href="/dashboard/settings"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#94A3B8] hover:text-white hover:bg-white/5 transition-all"
                    onClick={() => setShowProfile(false)}
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </Link>
                  <button
                    onClick={() => { logout(); setShowProfile(false); }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#EF4444] hover:bg-red-500/10 transition-all w-full text-left"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
