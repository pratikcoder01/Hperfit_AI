"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({ email, password });

      // Redirect based on role
      const { user } = useAuthStore.getState();
      if (user?.role === "admin") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
      }
    } catch {
      // Error is handled in store
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex">
      {/* Left: Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* Bg effects */}
        <div className="absolute top-0 left-1/2 w-[400px] h-[400px] -translate-x-1/2 rounded-full bg-[#00F5D4]/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full bg-[#7B2CBF]/5 blur-[80px] pointer-events-none" />

        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F5D4] to-[#7B2CBF] flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#0B0F19]" />
            </div>
            <span className="font-bold text-lg">
              Hyper<span className="text-[#00F5D4]">Fitness</span>
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black mb-2">Welcome back</h1>
            <p className="text-[#94A3B8] text-sm">
              Sign in to your HyperFitness account
            </p>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="flex items-center gap-2 px-4 py-3 rounded-lg mb-6 text-sm"
                style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444" }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#94A3B8] mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-[#94A3B8]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#94A3B8] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white placeholder-[#94A3B8]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link href="#" className="text-xs text-[#00F5D4] hover:underline">
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              suppressHydrationWarning
              className="w-full flex items-center justify-center gap-2 bg-[#00F5D4] text-[#0B0F19] font-semibold py-3.5 rounded-xl text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              whileHover={{ boxShadow: "0 0 30px rgba(0,245,212,0.30)" }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                "Sign in"
              )}
            </motion.button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-xl" style={{ background: "rgba(0,245,212,0.05)", border: "1px solid rgba(0,245,212,0.10)" }}>
            <p className="text-xs text-[#94A3B8] font-medium mb-2">Demo Credentials</p>
            <div className="space-y-1 text-xs">
              <p className="text-[#94A3B8]">Admin: <span className="text-[#00F5D4]">admin@hyperfitness.io</span> / <span className="text-[#00F5D4]">admin123</span></p>
              <p className="text-[#94A3B8]">User: <span className="text-[#00F5D4]">user@hyperfitness.io</span> / <span className="text-[#00F5D4]">user123</span></p>
            </div>
          </div>

          {/* Register link */}
          <p className="text-center text-sm text-[#94A3B8] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-[#00F5D4] hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right: Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative"
        style={{ background: "linear-gradient(135deg, #0D1120 0%, #111827 100%)" }}
      >
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-[#00F5D4]/8 blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] rounded-full bg-[#7B2CBF]/10 blur-[60px]" />

        <motion.div
          className="relative text-center max-w-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Glowing orb */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#00F5D4] to-[#7B2CBF] mx-auto mb-8 flex items-center justify-center animate-float"
            style={{ boxShadow: "0 0 60px rgba(0,245,212,0.30), 0 0 120px rgba(0,245,212,0.10)" }}
          >
            <Zap className="w-10 h-10 text-[#0B0F19]" />
          </div>

          <h2 className="text-3xl font-black mb-4">
            Power your <span className="gradient-neon">fitness empire</span>
          </h2>
          <p className="text-[#94A3B8] text-sm leading-relaxed">
            Join hundreds of fitness centers using HyperFitness to manage members,
            track revenue, and scale their business.
          </p>

          {/* Floating stats */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { label: "Revenue Growth", value: "+127%" },
              { label: "Member Retention", value: "94%" },
              { label: "Time Saved", value: "8h/week" },
              { label: "Check-ins/day", value: "500+" },
            ].map((s) => (
              <div key={s.label} className="glass-card p-4 text-left">
                <div className="text-xl font-black gradient-neon">{s.value}</div>
                <div className="text-xs text-[#94A3B8] mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
