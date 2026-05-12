"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DataTableProps<T> {
  columns: {
    key: string;
    label: string;
    width?: string;
    render?: (row: T) => React.ReactNode;
  }[];
  data: T[];
  keyExtractor: (row: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  className?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = "No data found",
  emptyIcon,
  className,
  onRowClick,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className={cn("glass-card overflow-hidden", className)}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider"
                    style={{ width: col.width }}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-white/3">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="h-4 rounded shimmer" style={{ width: `${Math.random() * 40 + 40}%` }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={cn("glass-card p-12 flex flex-col items-center justify-center text-center", className)}>
        {emptyIcon && (
          <div className="mb-4 text-[#94A3B8]/40">{emptyIcon}</div>
        )}
        <p className="text-[#94A3B8] text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("glass-card overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <motion.tr
                key={keyExtractor(row)}
                className={cn(
                  "border-b border-white/3 transition-colors duration-150",
                  onRowClick
                    ? "cursor-pointer hover:bg-white/3"
                    : "hover:bg-white/2"
                )}
                onClick={() => onRowClick?.(row)}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.3 }}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-sm">
                    {col.render
                      ? col.render(row)
                      : String((row as Record<string, unknown>)[col.key] ?? "—")}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Status Badge ──────────────────────────────
interface StatusBadgeProps {
  status: string;
  bg: string;
  text: string;
  border: string;
}

export function StatusBadge({ status, bg, text, border }: StatusBadgeProps) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize"
      style={{ backgroundColor: bg, color: text, border: `1px solid ${border}` }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: text }} />
      {status}
    </span>
  );
}
