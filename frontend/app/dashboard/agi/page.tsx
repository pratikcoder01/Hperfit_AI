"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Brain, Heart, Zap, Shield, Cpu, ActivitySquare } from "lucide-react";

export default function AGIDashboard() {
  const [agiStatus, setAgiStatus] = useState("Analyzing Biomarkers...");
  const [twinData, setTwinData] = useState({
    cnsFatigue: 42,
    muscleReadiness: 88,
    injuryRisk: 12,
    hrvScore: 65,
  });

  useEffect(() => {
    // Simulate real-time AGI thinking
    const statuses = [
      "Running Monte Carlo Workout Simulations",
      "Calibrating Nutrition Agent",
      "Analyzing HRV Trends",
      "Optimizing Human Performance",
      "System Primed for Hypertrophy",
    ];
    let i = 0;
    const interval = setInterval(() => {
      setAgiStatus(statuses[i % statuses.length]);
      i++;
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-cyan-500 font-mono p-8 overflow-hidden relative">
      {/* Dynamic Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[150px] pointer-events-none" />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-12 border-b border-cyan-500/30 pb-6"
      >
        <div className="flex items-center gap-4">
          <Brain className="w-10 h-10 text-cyan-400" />
          <div>
            <h1 className="text-3xl font-bold tracking-widest text-cyan-100 uppercase">HyperFitness AGI</h1>
            <p className="text-xs text-cyan-500 tracking-widest">Phase 6 // Human Optimization Protocol</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-cyan-950/50 px-4 py-2 rounded-full border border-cyan-500/20">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-sm tracking-widest">{agiStatus}</span>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Digital Twin Status */}
        <div className="space-y-8 lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-black/40 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-cyan-100 mb-6 flex items-center gap-2">
              <ActivitySquare className="w-5 h-5" /> Digital Twin State
            </h2>
            
            <div className="space-y-6">
              <MetricBar label="CNS Fatigue" value={twinData.cnsFatigue} color="bg-rose-500" />
              <MetricBar label="Muscle Readiness" value={twinData.muscleReadiness} color="bg-emerald-500" />
              <MetricBar label="Injury Probability" value={twinData.injuryRisk} color="bg-rose-500" />
              <MetricBar label="Autonomic Balance (HRV)" value={twinData.hrvScore} color="bg-cyan-500" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/40 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6"
          >
            <h2 className="text-xl font-semibold text-cyan-100 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" /> Active Agents
            </h2>
            <div className="space-y-3">
              <AgentStatus name="Workout Agent" status="ACTIVE" />
              <AgentStatus name="Nutrition Agent" status="CALIBRATING" />
              <AgentStatus name="Recovery Agent" status="MONITORING" />
            </div>
          </motion.div>
        </div>

        {/* Center Column: 3D Twin Visualization Placeholder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-1 h-[600px] border border-cyan-500/30 rounded-2xl relative flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-950/40 via-black to-black"
        >
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 bg-repeat" />
          {/* Wireframe Human Body Placeholder */}
          <div className="relative w-64 h-96 border border-cyan-500/20 rounded-t-full rounded-b-3xl flex items-center justify-center overflow-hidden">
             <div className="absolute top-1/4 w-full h-[1px] bg-cyan-500/30 shadow-[0_0_10px_#06b6d4] animate-scan" />
             <p className="text-cyan-500/50 text-sm tracking-widest text-center px-4">
               [ WebGL Digital Twin Render Pending ] <br/><br/> Subsystem: Active
             </p>
          </div>
          <p className="mt-8 text-cyan-300 tracking-widest text-sm">Target: Subject Alpha</p>
        </motion.div>

        {/* Right Column: Predictive Engine & Insights */}
        <div className="space-y-8 lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-black/40 backdrop-blur-md border border-cyan-500/20 rounded-2xl p-6 h-full flex flex-col"
          >
            <h2 className="text-xl font-semibold text-cyan-100 mb-6 flex items-center gap-2">
              <Cpu className="w-5 h-5" /> Live AGI Feed
            </h2>
            
            <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              <FeedItem 
                time="08:42" 
                agent="Recovery AGI" 
                msg="Detected 12% drop in deep sleep. Modifying today's workout to Zone 2 Cardio." 
                type="warning"
              />
              <FeedItem 
                time="08:40" 
                agent="Nutrition AGI" 
                msg="Macros adjusted for lower exertion. Caloric target reduced by 300kcal." 
                type="info"
              />
              <FeedItem 
                time="07:15" 
                agent="System" 
                msg="Morning biometrics synced via Apple Health." 
                type="success"
              />
            </div>
          </motion.div>
        </div>

      </div>

      <style jsx>{`
        .animate-scan {
          animation: scan 4s linear infinite;
        }
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #06b6d4;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}

function MetricBar({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1 tracking-wider text-cyan-300">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-cyan-950 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`h-full ${color} shadow-[0_0_8px_currentColor]`}
        />
      </div>
    </div>
  );
}

function AgentStatus({ name, status }: { name: string, status: string }) {
  const isAct = status === "ACTIVE";
  return (
    <div className="flex justify-between items-center text-sm border-b border-cyan-900 pb-2">
      <span className="text-cyan-300">{name}</span>
      <span className={`text-xs px-2 py-0.5 rounded border tracking-widest ${isAct ? 'border-emerald-500 text-emerald-400 bg-emerald-950/30' : 'border-amber-500 text-amber-400 bg-amber-950/30'}`}>
        {status}
      </span>
    </div>
  );
}

function FeedItem({ time, agent, msg, type }: { time: string, agent: string, msg: string, type: 'info'|'warning'|'success' }) {
  const colors = {
    info: 'text-cyan-400',
    warning: 'text-rose-400',
    success: 'text-emerald-400'
  };
  return (
    <div className="border-l border-cyan-800 pl-4 py-1 relative">
      <div className={`absolute -left-[5px] top-2 w-2 h-2 rounded-full ${type === 'warning' ? 'bg-rose-500' : type === 'success' ? 'bg-emerald-500' : 'bg-cyan-500'}`} />
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs text-cyan-600">{time}</span>
        <span className="text-xs font-semibold text-cyan-200">[{agent}]</span>
      </div>
      <p className={`text-sm ${colors[type]}`}>{msg}</p>
    </div>
  );
}
