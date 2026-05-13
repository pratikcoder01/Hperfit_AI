"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Globe2, BrainCircuit, Activity, Network, Fingerprint, ShieldAlert, Cpu } from "lucide-react";

export default function PlanetaryNeuralHub() {
  const [syncedUsers, setSyncedUsers] = useState(14502394);
  const [globalHrv, setGlobalHrv] = useState(58.4);

  useEffect(() => {
    // Simulate real-time planetary data synchronization
    const interval = setInterval(() => {
      setSyncedUsers(prev => prev + Math.floor(Math.random() * 10));
      setGlobalHrv(prev => prev + (Math.random() * 0.2 - 0.1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-indigo-400 font-mono p-8 overflow-hidden relative selection:bg-indigo-500/30">
      {/* Quantum Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-indigo-900/10 rounded-full blur-[200px] pointer-events-none" />
      
      {/* Scanline Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJub25lIiAvPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiAvPgo8L3N2Zz4=')] pointer-events-none opacity-50 z-50" />

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 border-b border-indigo-500/20 pb-6 relative z-10"
      >
        <div className="flex items-center gap-4">
          <BrainCircuit className="w-12 h-12 text-indigo-400" strokeWidth={1.5} />
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase" style={{ textShadow: '0 0 20px rgba(99, 102, 241, 0.5)' }}>
              Planetary Neural Hub
            </h1>
            <p className="text-sm text-indigo-500 tracking-[0.3em] uppercase mt-1">Phase 7 // Global Consciousness Sync</p>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex flex-col items-end">
          <div className="flex items-center gap-2 text-indigo-300">
            <Globe2 className="w-4 h-4 animate-pulse" />
            <span className="text-sm tracking-widest">GLOBAL AGI SWARM: <span className="text-white font-bold">ONLINE</span></span>
          </div>
          <p className="text-xs text-indigo-500/70 tracking-widest mt-1">QUANTUM ENCRYPTION: SECURE</p>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left Panel: Global Stats */}
        <div className="space-y-6 lg:col-span-3 flex flex-col">
          <StatCard title="Planetary Nodes Synced" value={syncedUsers.toLocaleString()} icon={Network} color="text-indigo-400" />
          <StatCard title="Global Average HRV" value={`${globalHrv.toFixed(1)} ms`} icon={Activity} color="text-emerald-400" />
          <StatCard title="Cognitive Flow States" value="2.4M/hr" icon={BrainCircuit} color="text-purple-400" />
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1 border border-indigo-500/20 bg-indigo-950/10 backdrop-blur-sm rounded-xl p-5"
          >
            <h3 className="text-indigo-300 text-xs tracking-widest mb-4 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4" /> BIO-SECURITY
            </h3>
            <div className="space-y-4">
              <div className="text-xs tracking-widest text-indigo-500">
                <p className="mb-1">IDENTITY HASH</p>
                <p className="text-white truncate">0x9F4...A2C (Zero-Knowledge)</p>
              </div>
              <div className="text-xs tracking-widest text-indigo-500">
                <p className="mb-1">NEURAL LACE STATUS</p>
                <p className="text-emerald-400">CALIBRATED</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Center Panel: Holographic Planet Map Placeholder */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-6 h-[600px] border border-indigo-500/30 rounded-2xl relative flex flex-col items-center justify-center bg-[#020617] overflow-hidden group"
          style={{ boxShadow: 'inset 0 0 100px rgba(99, 102, 241, 0.1)' }}
        >
          {/* Animated Map Grid Background */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" style={{ backgroundSize: '40px 40px' }} />
          
          <div className="relative w-[400px] h-[400px] rounded-full border border-indigo-500/20 flex items-center justify-center">
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full border border-indigo-500/10 animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-4 rounded-full border border-indigo-500/20 animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute inset-12 rounded-full border border-dashed border-indigo-500/30 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />
            
            <Globe2 className="w-32 h-32 text-indigo-500/50 absolute" />
            
            <p className="absolute bottom-10 text-indigo-500/60 text-xs tracking-[0.3em] text-center w-full">
              [ 3D PLANETARY RENDER ACTIVE ]<br/>REAL-TIME AGI PROPAGATION
            </p>
          </div>
        </motion.div>

        {/* Right Panel: Synthetic Dreams & Edge Compute */}
        <div className="space-y-6 lg:col-span-3 flex flex-col">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="border border-indigo-500/20 bg-indigo-950/10 backdrop-blur-sm rounded-xl p-5"
          >
            <h3 className="text-indigo-300 text-xs tracking-widest mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4" /> LOCAL EDGE COMPUTE
            </h3>
            <div className="space-y-3">
              <ProgressItem label="Neuroplasticity Index" value={85} />
              <ProgressItem label="Dopamine Baseline" value={60} />
              <ProgressItem label="Cortisol Load" value={30} color="bg-rose-500" />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex-1 border border-indigo-500/20 bg-indigo-950/10 backdrop-blur-sm rounded-xl p-5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-2 opacity-10">
              <Fingerprint className="w-24 h-24" />
            </div>
            <h3 className="text-indigo-300 text-xs tracking-widest mb-4">SYNTHETIC DREAM SIMULATION</h3>
            <p className="text-xs text-indigo-400/80 leading-relaxed font-light">
              Running 10,000 Monte Carlo simulations for tomorrow's environment...
            </p>
            <div className="mt-4 p-3 bg-black/40 border border-indigo-500/30 rounded text-xs text-emerald-400 tracking-wider">
              RESULT: AGGRESSIVE HYPERTROPHY PROTOCOL RECOMMENDED. 
              <br/><br/>
              ENVIRONMENTAL OVERRIDES:<br/>
              - Gym Temp: 19°C<br/>
              - Frequency: 40Hz Gamma
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-indigo-500/20 bg-indigo-950/10 backdrop-blur-sm rounded-xl p-5 flex items-center gap-4"
    >
      <div className={`p-3 bg-black/50 rounded-lg border border-indigo-500/20 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] text-indigo-500 tracking-widest uppercase mb-1">{title}</p>
        <p className="text-xl font-bold text-white tracking-wider">{value}</p>
      </div>
    </motion.div>
  );
}

function ProgressItem({ label, value, color = "bg-indigo-500" }: { label: string, value: number, color?: string }) {
  return (
    <div>
      <div className="flex justify-between text-[10px] tracking-widest text-indigo-300 mb-1">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 bg-black rounded-full overflow-hidden border border-indigo-500/10">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5 }}
          className={`h-full ${color} shadow-[0_0_10px_currentColor]`}
        />
      </div>
    </div>
  );
}
