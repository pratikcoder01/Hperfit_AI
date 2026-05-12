"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, CreditCard, Calendar, Dumbbell,
  BarChart3, Settings, Zap, ChevronLeft, ChevronRight,
  UserCircle, ShieldCheck, Bell, LogOut
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn, getInitials, getAvatarColor } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  adminOnly?: boolean;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard, adminOnly: true },
  { label: "Dashboard", href: "/dashboard/user", icon: LayoutDashboard },
  { label: "Members", href: "/dashboard/admin/members", icon: Users, adminOnly: true },
  { label: "Memberships", href: "/dashboard/admin/memberships", icon: ShieldCheck, adminOnly: true },
  { label: "Attendance", href: "/dashboard/admin/attendance", icon: Calendar, adminOnly: true },
  { label: "My Attendance", href: "/dashboard/user/attendance", icon: Calendar },
  { label: "Payments", href: "/dashboard/admin/payments", icon: CreditCard, adminOnly: true },
  { label: "Workouts", href: "/dashboard/admin/workouts", icon: Dumbbell, adminOnly: true },
  { label: "My Workouts", href: "/dashboard/user/workouts", icon: Dumbbell },
  { label: "Progress", href: "/dashboard/user/progress", icon: BarChart3 },
  { label: "Analytics", href: "/dashboard/admin/analytics", icon: BarChart3, adminOnly: true },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const isAdmin = user?.role === "admin";

  const visibleItems = navItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    // Hide user-specific items from admin
    if (!item.adminOnly && isAdmin && item.href.startsWith("/dashboard/user")) return false;
    return true;
  });

  const avatarColor = user ? getAvatarColor(user.full_name) : "#00F5D4";

  return (
    <motion.aside
      className="fixed top-0 left-0 h-full z-40 flex flex-col"
      style={{ background: "#0D1120", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      animate={{ width: isOpen ? 260 : 72 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-white/5 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F5D4] to-[#7B2CBF] flex items-center justify-center flex-shrink-0">
          <Zap className="w-4 h-4 text-[#0B0F19]" />
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.span
              className="ml-3 font-bold text-base whitespace-nowrap overflow-hidden"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              Hyper<span className="text-[#00F5D4]">Fitness</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {/* Role badge */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="px-3 py-2 mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: isAdmin ? "#00F5D4" : "#7B2CBF" }}
              >
                {isAdmin ? "Admin Panel" : "Member Portal"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {visibleItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard/admin" &&
              item.href !== "/dashboard/user" &&
              pathname.startsWith(item.href));

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative cursor-pointer",
                  isActive
                    ? "bg-[#00F5D4]/10 text-[#00F5D4]"
                    : "text-[#94A3B8] hover:text-white hover:bg-white/5"
                )}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.97 }}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-[#00F5D4]"
                    layoutId="sidebar-active"
                    transition={{ type: "spring", stiffness: 500, damping: 35 }}
                  />
                )}

                <item.icon
                  className={cn("w-4 h-4 flex-shrink-0 transition-transform", isActive && "scale-110")}
                />

                <AnimatePresence>
                  {isOpen && (
                    <motion.span
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {/* Tooltip for collapsed state */}
                {!isOpen && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-[#111827] border border-white/10 rounded-md text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50">
                    {item.label}
                  </div>
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="flex-shrink-0 border-t border-white/5 p-3">
        <div className={cn("flex items-center gap-3 px-2 py-2 rounded-lg", isOpen && "glass")}>
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 text-[#0B0F19]"
            style={{ backgroundColor: avatarColor }}
          >
            {user ? getInitials(user.full_name) : "?"}
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="flex-1 min-w-0"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
              >
                <p className="text-sm font-medium text-white truncate">{user?.full_name}</p>
                <p className="text-xs text-[#94A3B8] truncate">{user?.email}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isOpen && (
              <motion.button
                onClick={logout}
                className="text-[#94A3B8] hover:text-[#EF4444] transition-colors flex-shrink-0"
                title="Sign out"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <LogOut className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute top-4 -right-3 w-6 h-6 rounded-full bg-[#111827] border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-white hover:border-[#00F5D4]/30 transition-all z-10"
      >
        {isOpen ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      </button>
    </motion.aside>
  );
}
