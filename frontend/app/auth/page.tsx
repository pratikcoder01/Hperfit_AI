"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, Mail, Lock, User, Phone, 
  ArrowRight, Sparkles, ShieldCheck, 
  Activity, Trophy, Brain
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";

export default function AuthPage() {
  const router = useRouter();
  const { login, register, isAuthenticated, isLoading, error, clearError } = useAuthStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard/user");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      if (isLogin) {
        await login({ email: formData.email, password: formData.password });
        // Success handled by useEffect redirect
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          full_name: formData.full_name,
          phone: formData.phone,
        });
        // On registration success, FastAPI returns a message.
        // We can either auto-login or show a success toast and switch to login.
        setIsLogin(true);
        // Optionally notify user
      }
    } catch (err) {
      console.error("Auth error:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Cinematic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7B2CBF]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00F5D4]/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* Left Side: Brand & Value Prop */}
        <motion.div 
          className="hidden lg:block space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00F5D4] to-[#7B2CBF] flex items-center justify-center shadow-[0_0_20px_rgba(0,245,212,0.3)]">
                <Zap className="w-6 h-6 text-[#0B0F19]" />
             </div>
             <h1 className="text-3xl font-black tracking-tight">Hyper<span className="text-[#00F5D4]">Fitness</span></h1>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-5xl font-black leading-[1.1]">
              The Future of <br />
              <span className="gradient-neon">Human Performance</span>
            </h2>
            <p className="text-[#94A3B8] text-lg max-w-md leading-relaxed">
              Experience the world's first AI-autonomous fitness ecosystem. 
              Real-time computer vision, predictive health modeling, and a global social community.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 pt-4">
             {[
               { icon: Brain, label: "Autonomous AI", sub: "Proactive Coaching" },
               { icon: Activity, label: "Live Biometrics", sub: "Wearable Sync" },
               { icon: Trophy, label: "Gamified XP", sub: "Global Rankings" },
               { icon: ShieldCheck, label: "Enterprise Security", sub: "Data Privacy" },
             ].map((feature, i) => (
               <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                     <feature.icon className="w-5 h-5 text-[#00F5D4]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{feature.label}</p>
                    <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest">{feature.sub}</p>
                  </div>
               </div>
             ))}
          </div>
        </motion.div>

        {/* Right Side: Auth Form */}
        <motion.div 
          className="glass-card p-8 lg:p-12 relative"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          {/* Form Header */}
          <div className="space-y-2 mb-8">
            <h3 className="text-2xl font-black text-white">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h3>
            <p className="text-[#94A3B8] text-sm font-medium">
              {isLogin 
                ? "Enter your credentials to access your AI dashboard." 
                : "Join the global fitness elite and start your transformation."}
            </p>
          </div>

          {error && (
            <motion.div 
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  className="grid grid-cols-1 gap-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                      <input 
                        type="text" name="full_name" required
                        placeholder="John Doe"
                        value={formData.full_name} onChange={handleInputChange}
                        className="w-full bg-[#0B0F19]/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:border-[#00F5D4]/50 focus:ring-1 focus:ring-[#00F5D4]/50 transition-all outline-none" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                      <input 
                        type="tel" name="phone" required
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone} onChange={handleInputChange}
                        className="w-full bg-[#0B0F19]/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:border-[#00F5D4]/50 focus:ring-1 focus:ring-[#00F5D4]/50 transition-all outline-none" 
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input 
                  type="email" name="email" required
                  placeholder="name@company.com"
                  value={formData.email} onChange={handleInputChange}
                  className="w-full bg-[#0B0F19]/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:border-[#00F5D4]/50 focus:ring-1 focus:ring-[#00F5D4]/50 transition-all outline-none" 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#94A3B8] ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <input 
                  type="password" name="password" required
                  placeholder="••••••••"
                  value={formData.password} onChange={handleInputChange}
                  className="w-full bg-[#0B0F19]/50 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:border-[#00F5D4]/50 focus:ring-1 focus:ring-[#00F5D4]/50 transition-all outline-none" 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-[#00F5D4] to-[#7B2CBF] text-[#0B0F19] font-black flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(0,245,212,0.4)] disabled:opacity-50 transition-all group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#0B0F19]/30 border-t-[#0B0F19] rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Initialize Account"}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Toggle */}
          <div className="mt-8 text-center">
            <p className="text-[#94A3B8] text-sm font-medium">
              {isLogin ? "Don't have an account?" : "Already a member?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-[#00F5D4] font-black hover:underline underline-offset-4"
              >
                {isLogin ? "Create Account" : "Sign In"}
              </button>
            </p>
          </div>

          {/* Real-time Indicator */}
          <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-4">
             <div className="flex items-center gap-1.5 text-[10px] font-black text-[#00F5D4] uppercase tracking-tighter">
                <span className="w-1.5 h-1.5 bg-[#00F5D4] rounded-full animate-pulse" />
                Real-time Sync Active
             </div>
             <div className="w-px h-3 bg-white/10" />
             <div className="flex items-center gap-1.5 text-[10px] font-black text-[#94A3B8] uppercase tracking-tighter">
                <Sparkles className="w-3 h-3" />
                AI Transformation Live
             </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
