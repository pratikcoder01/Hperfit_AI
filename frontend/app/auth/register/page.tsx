"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    clearError();
    setLocalError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (form.password !== form.confirm_password) {
      setLocalError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setLocalError("Password must be at least 8 characters.");
      return;
    }

    try {
      await register({
        email: form.email,
        password: form.password,
        full_name: form.full_name,
        phone: form.phone,
      });
      setSuccess(true);
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch {
      // Handled in store
    }
  };

  const displayError = localError || error;

  const passwordStrength = () => {
    const p = form.password;
    if (p.length === 0) return null;
    if (p.length < 6) return { label: "Weak", color: "#EF4444", width: "25%" };
    if (p.length < 8) return { label: "Fair", color: "#F59E0B", width: "50%" };
    if (p.length < 12 || !/[A-Z]/.test(p) || !/[0-9]/.test(p))
      return { label: "Good", color: "#3B82F6", width: "75%" };
    return { label: "Strong", color: "#00F5D4", width: "100%" };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center px-6 py-12 relative">
      {/* Bg effects */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-[#00F5D4]/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full bg-[#7B2CBF]/5 blur-[80px] pointer-events-none" />
      <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />

      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F5D4] to-[#7B2CBF] flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#0B0F19]" />
          </div>
          <span className="font-bold text-lg">
            Hyper<span className="text-[#00F5D4]">Fitness</span>
          </span>
        </Link>

        {/* Card */}
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black mb-2">Create account</h1>
            <p className="text-[#94A3B8] text-sm">
              Join HyperFitness — it&apos;s free to start
            </p>
          </div>

          {/* Success state */}
          <AnimatePresence>
            {success && (
              <motion.div
                className="flex items-center gap-2 px-4 py-3 rounded-lg mb-6 text-sm"
                style={{ background: "rgba(0,245,212,0.10)", border: "1px solid rgba(0,245,212,0.25)", color: "#00F5D4" }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                Account created! Redirecting to login...
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {displayError && (
              <motion.div
                className="flex items-center gap-2 px-4 py-3 rounded-lg mb-6 text-sm"
                style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444" }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {displayError}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  name="full_name"
                  type="text"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-[#94A3B8]"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-[#94A3B8]"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Phone <span className="text-[#94A3B8]/50">(optional)</span></label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-[#94A3B8]"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-sm text-white placeholder-[#94A3B8]"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength */}
              {strength && (
                <div className="mt-2">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-[#94A3B8]">Strength</span>
                    <span className="text-xs font-medium" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: strength.width, background: strength.color }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input
                  name="confirm_password"
                  type="password"
                  value={form.confirm_password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-[#94A3B8]"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${
                      form.confirm_password && form.confirm_password !== form.password
                        ? "rgba(239,68,68,0.40)"
                        : "rgba(255,255,255,0.08)"
                    }`,
                  }}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading || success}
              suppressHydrationWarning
              className="w-full flex items-center justify-center gap-2 bg-[#00F5D4] text-[#0B0F19] font-semibold py-3.5 rounded-xl text-sm transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              whileHover={{ boxShadow: "0 0 30px rgba(0,245,212,0.30)" }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-[#94A3B8] mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#00F5D4] hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
