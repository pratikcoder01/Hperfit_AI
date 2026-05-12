import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(
  amount: number,
  currency = "INR",
  locale = "en-IN"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format number with K/M abbreviations
export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

// Format date
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", options).format(d);
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}

// Format duration in minutes to human-readable
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Calculate days remaining
export function daysRemaining(endDate: string): number {
  const end = new Date(endDate);
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// Get initials from full name
export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

// Generate avatar color from name
export function getAvatarColor(name: string): string {
  const colors = [
    "#00F5D4","#7B2CBF","#3B82F6","#F59E0B",
    "#EF4444","#10B981","#8B5CF6","#EC4899",
  ];
  const index =
    name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) %
    colors.length;
  return colors[index];
}

// Membership status badge variant
export function getMembershipStatusColor(status: string) {
  switch (status) {
    case "active":
      return { bg: "rgba(0,245,212,0.10)", text: "#00F5D4", border: "rgba(0,245,212,0.25)" };
    case "expired":
      return { bg: "rgba(239,68,68,0.10)", text: "#EF4444", border: "rgba(239,68,68,0.25)" };
    case "cancelled":
      return { bg: "rgba(148,163,184,0.10)", text: "#94A3B8", border: "rgba(148,163,184,0.25)" };
    case "pending":
      return { bg: "rgba(245,158,11,0.10)", text: "#F59E0B", border: "rgba(245,158,11,0.25)" };
    default:
      return { bg: "rgba(148,163,184,0.10)", text: "#94A3B8", border: "rgba(148,163,184,0.25)" };
  }
}

// Payment status color
export function getPaymentStatusColor(status: string) {
  switch (status) {
    case "completed":
      return { bg: "rgba(0,245,212,0.10)", text: "#00F5D4", border: "rgba(0,245,212,0.25)" };
    case "pending":
      return { bg: "rgba(245,158,11,0.10)", text: "#F59E0B", border: "rgba(245,158,11,0.25)" };
    case "failed":
      return { bg: "rgba(239,68,68,0.10)", text: "#EF4444", border: "rgba(239,68,68,0.25)" };
    case "refunded":
      return { bg: "rgba(123,44,191,0.10)", text: "#7B2CBF", border: "rgba(123,44,191,0.25)" };
    default:
      return { bg: "rgba(148,163,184,0.10)", text: "#94A3B8", border: "rgba(148,163,184,0.25)" };
  }
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Sleep utility
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
