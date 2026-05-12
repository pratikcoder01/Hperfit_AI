"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Zap, Shield, BarChart3, Users, Calendar, CreditCard,
  Dumbbell, ArrowRight, CheckCircle2, Star, ChevronRight,
  Activity, TrendingUp, Target
} from "lucide-react";

// ─────────────────────────────────────────────
//  Animation variants
// ─────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.1,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

// ─────────────────────────────────────────────
//  Data
// ─────────────────────────────────────────────
const features = [
  {
    icon: Users,
    title: "Member Management",
    description: "Full member lifecycle — onboarding, profiles, RBAC roles, and smart segmentation.",
    color: "#00F5D4",
  },
  {
    icon: CreditCard,
    title: "Payment Engine",
    description: "Track payments, generate invoices, manage plans with multi-currency support.",
    color: "#7B2CBF",
  },
  {
    icon: Calendar,
    title: "Smart Attendance",
    description: "Real-time check-in/out tracking with streak analytics and visual heatmaps.",
    color: "#3B82F6",
  },
  {
    icon: Dumbbell,
    title: "Workout Builder",
    description: "Assign custom workouts with exercise libraries, progress tracking, and templates.",
    color: "#F59E0B",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Revenue trends, member growth, retention rates — visualized in real time.",
    color: "#00F5D4",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "JWT auth, bcrypt hashing, RBAC, rate limiting — production-grade from day one.",
    color: "#7B2CBF",
  },
];

const stats = [
  { label: "Active Members", value: "10K+", icon: Users },
  { label: "Revenue Tracked", value: "₹50M+", icon: TrendingUp },
  { label: "Workouts Logged", value: "500K+", icon: Activity },
  { label: "Gyms Powered", value: "200+", icon: Target },
];

const plans = [
  {
    name: "Starter",
    price: "₹2,999",
    interval: "/month",
    description: "Perfect for small gyms starting their digital journey.",
    features: ["Up to 100 members", "Basic analytics", "Attendance tracking", "Payment management", "Email support"],
    color: "#94A3B8",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹7,999",
    interval: "/month",
    description: "For growing fitness centers that need more power.",
    features: ["Up to 500 members", "Advanced analytics", "Workout builder", "Custom membership plans", "Priority support", "API access"],
    color: "#00F5D4",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    interval: "",
    description: "For large-scale fitness chains and franchises.",
    features: ["Unlimited members", "Multi-location", "White labeling", "Custom integrations", "Dedicated account manager", "SLA guarantees"],
    color: "#7B2CBF",
    highlight: false,
  },
];

// ─────────────────────────────────────────────
//  Component
// ─────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-white overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 bg-grid opacity-100 pointer-events-none" />

      {/* Gradient orbs */}
      <div className="fixed top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-[#00F5D4]/5 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 left-0 w-[500px] h-[500px] rounded-full bg-[#7B2CBF]/8 blur-[100px] pointer-events-none" />

      {/* ── Navbar ──────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 glass border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00F5D4] to-[#7B2CBF] flex items-center justify-center">
            <Zap className="w-4 h-4 text-[#0B0F19]" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Hyper<span className="text-[#00F5D4]">Fitness</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm text-[#94A3B8]">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#stats" className="hover:text-white transition-colors">About</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm text-[#94A3B8] hover:text-white transition-colors px-4 py-2"
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="text-sm font-medium bg-[#00F5D4] text-[#0B0F19] px-4 py-2 rounded-lg hover:bg-[#00F5D4]/90 transition-all hover:shadow-[0_0_20px_rgba(0,245,212,0.30)]"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
        <motion.div
          className="max-w-5xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-[#00F5D4]/20 text-[#00F5D4] text-xs font-medium mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] animate-pulse" />
            Now in Beta — Join 200+ fitness centers
            <ChevronRight className="w-3 h-3" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[0.95]"
          >
            The Future{" "}
            <span className="block gradient-neon">Operating System</span>
            for Modern Fitness
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={fadeUp}
            className="text-lg md:text-xl text-[#94A3B8] max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Enterprise-grade fitness management. Member analytics, smart attendance,
            payment tracking, and workout systems — unified in one futuristic platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="group flex items-center gap-2 bg-[#00F5D4] text-[#0B0F19] font-semibold px-8 py-4 rounded-xl hover:bg-[#00F5D4]/90 transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,245,212,0.30)] text-sm"
            >
              Start for Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/auth/login"
              className="flex items-center gap-2 glass border border-white/10 text-white font-semibold px-8 py-4 rounded-xl hover:border-[#00F5D4]/30 transition-all duration-300 text-sm"
            >
              View Demo Dashboard
            </Link>
          </motion.div>

          {/* Trust badge */}
          <motion.div variants={fadeUp} className="mt-12 flex items-center justify-center gap-6 text-xs text-[#94A3B8]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00F5D4]" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00F5D4]" />
              Free 14-day trial
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00F5D4]" />
              Cancel anytime
            </span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats ───────────────────────────── */}
      <section id="stats" className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="glass-card p-6 text-center group hover:border-[#00F5D4]/20 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <stat.icon className="w-5 h-5 text-[#00F5D4] mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <div className="text-3xl font-black gradient-neon mb-1">{stat.value}</div>
              <div className="text-xs text-[#94A3B8]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Everything you need to{" "}
              <span className="gradient-neon">scale your gym</span>
            </h2>
            <p className="text-[#94A3B8] text-lg max-w-2xl mx-auto">
              A complete operating system for modern fitness businesses — built for scale from day one.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="glass-card p-6 group hover:border-opacity-30 transition-all duration-300 cursor-default"
                style={{ "--hover-color": feature.color } as React.CSSProperties}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ y: -4 }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-all duration-300"
                  style={{ backgroundColor: `${feature.color}15`, border: `1px solid ${feature.color}25` }}
                >
                  <feature.icon className="w-5 h-5" style={{ color: feature.color }} />
                </div>
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────── */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Simple, <span className="gradient-neon">transparent pricing</span>
            </h2>
            <p className="text-[#94A3B8] text-lg">
              No hidden fees. Scale as you grow.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                className="relative glass-card p-8 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={plan.highlight ? {
                  border: `1px solid rgba(0,245,212,0.30)`,
                  boxShadow: "0 0 40px rgba(0,245,212,0.08)"
                } : {}}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 bg-[#00F5D4] text-[#0B0F19] text-xs font-bold px-3 py-1 rounded-full">
                      <Star className="w-3 h-3" /> Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-1" style={{ color: plan.color }}>{plan.name}</h3>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-[#94A3B8] text-sm mb-1">{plan.interval}</span>
                  </div>
                  <p className="text-sm text-[#94A3B8]">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#94A3B8]">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/register"
                  className="block text-center py-3 px-6 rounded-lg font-semibold text-sm transition-all duration-300"
                  style={plan.highlight ? {
                    background: "#00F5D4",
                    color: "#0B0F19",
                  } : {
                    background: `${plan.color}15`,
                    color: plan.color,
                    border: `1px solid ${plan.color}30`,
                  }}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────── */}
      <section className="py-20 px-6">
        <motion.div
          className="max-w-4xl mx-auto text-center glass-card p-16 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#00F5D4]/5 to-[#7B2CBF]/5" />
          <div className="relative">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Ready to <span className="gradient-neon">transform</span> your gym?
            </h2>
            <p className="text-[#94A3B8] text-lg mb-8">
              Join 200+ fitness centers already using HyperFitness to streamline their operations.
            </p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 bg-[#00F5D4] text-[#0B0F19] font-bold px-10 py-4 rounded-xl hover:bg-[#00F5D4]/90 transition-all duration-300 hover:shadow-[0_0_50px_rgba(0,245,212,0.30)]"
            >
              Start Your Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────── */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#00F5D4] to-[#7B2CBF] flex items-center justify-center">
              <Zap className="w-3 h-3 text-[#0B0F19]" />
            </div>
            <span className="font-bold text-sm">Hyper<span className="text-[#00F5D4]">Fitness</span></span>
          </div>
          <p className="text-xs text-[#94A3B8]">
            © 2025 HyperFitness. The Future Operating System for Modern Fitness.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
