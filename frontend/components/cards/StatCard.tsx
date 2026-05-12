"use client";

import { motion } from "framer-motion";
import { type LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  prefix?: string;
  suffix?: string;
  delay?: number;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel = "vs last month",
  icon: Icon,
  iconColor = "#00F5D4",
  prefix,
  suffix,
  delay = 0,
  className,
}: StatCardProps) {
  const isPositive = change !== undefined && change > 0;
  const isNegative = change !== undefined && change < 0;
  const isNeutral = change === undefined || change === 0;

  const formattedValue =
    typeof value === "number" ? formatNumber(value) : value;

  return (
    <motion.div
      className={cn(
        "glass-card p-6 group hover:border-opacity-20 transition-all duration-300 relative overflow-hidden",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      style={{ borderColor: `${iconColor}18` }}
    >
      {/* Background gradient */}
      <div
        className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `${iconColor}08`, transform: "translate(30%, -30%)" }}
      />

      {/* Top row */}
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
          style={{
            background: `${iconColor}15`,
            border: `1px solid ${iconColor}25`,
          }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>

        {change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
              isPositive && "bg-[#00F5D4]/10 text-[#00F5D4]",
              isNegative && "bg-[#EF4444]/10 text-[#EF4444]",
              isNeutral && "bg-[#94A3B8]/10 text-[#94A3B8]"
            )}
          >
            {isPositive && <TrendingUp className="w-3 h-3" />}
            {isNegative && <TrendingDown className="w-3 h-3" />}
            {isNeutral && <Minus className="w-3 h-3" />}
            {change > 0 ? "+" : ""}{change}%
          </div>
        )}
      </div>

      {/* Value */}
      <motion.div
        className="text-3xl font-black text-white mb-1 tracking-tight"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: delay + 0.1 }}
      >
        {prefix && <span className="text-lg text-[#94A3B8] font-normal">{prefix}</span>}
        {formattedValue}
        {suffix && <span className="text-lg text-[#94A3B8] font-normal">{suffix}</span>}
      </motion.div>

      {/* Label */}
      <p className="text-sm text-[#94A3B8]">{title}</p>

      {/* Change label */}
      {change !== undefined && (
        <p className="text-xs text-[#94A3B8]/60 mt-1">{changeLabel}</p>
      )}

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${iconColor}40, transparent)` }}
      />
    </motion.div>
  );
}

// ── Loading Skeleton ──────────────────────────
export function StatCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl shimmer" />
        <div className="w-16 h-6 rounded-full shimmer" />
      </div>
      <div className="w-24 h-8 rounded shimmer mb-2" />
      <div className="w-32 h-4 rounded shimmer" />
    </motion.div>
  );
}
