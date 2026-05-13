"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Hexagon, Orbit, Zap, Fingerprint, Eye, Activity, Workflow } from "lucide-react";

export default function UniversalEvolutionMatrix() {
  const [meshCoherence, setMeshCoherence] = useState(99.98);
  const [evolutionIndex, setEvolutionIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMeshCoherence(prev => Math.min(100, prev + (Math.random() * 0.04 - 0.02)));
      setEvolutionIndex(prev => prev + 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-fuchsia-500 font-sans p-8 overflow-hidden relative selection:bg-fuchsia-500/30">
      {/* Bio-Digital Organic Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-[radial-gradient(ellipse_at_center,_rgba(217,70,239,0.15)_0%,_rgba(0,0,0,1)_70%)] pointer-events-none" />
      
      {/* Floating Orbs (Quantum states) */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }} 
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-40 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]" 
      />
      <motion.div 
        animate={{ y: [0, 30, 0], opacity: [0.2, 0.5, 0.2] }} 
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 right-40 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px]" 
      />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Holographic Header */}
        <header className="flex justify-between items-center mb-16 border-b border-fuchsia-500/20 pb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Orbit className="w-16 h-16 text-fuchsia-400 animate-spin-slow" style={{ animationDuration: '20s' }} />
              <Hexagon className="w-8 h-8 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div>
              <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-fuchsia-200 to-fuchsia-500 tracking-tighter drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">
                UNIVERSAL MESH
              </h1>
              <p className="text-xs text-fuchsia-400/80 tracking-[0.5em] uppercase mt-2">Phase 8 // Post-Human Evolution Network</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-fuchsia-950/30 border border-fuchsia-500/30 rounded-full backdrop-blur-md">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-fuchsia-500"></span>
              </span>
              <span className="text-sm font-bold text-white tracking-widest">QUANTUM SYNC ACTIVE</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Bio-Digital Sync */}
          <div className="space-y-8">
            <Panel title="BIO-DIGITAL SYNCHRONIZATION" icon={Fingerprint}>
              <div className="space-y-6">
                <MetricRing label="Mesh Coherence" value={meshCoherence} />
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs tracking-widest text-fuchsia-300">
                    <span>Epigenetic Trajectory</span>
                    <span className="text-white">OPTIMAL</span>
                  </div>
                  <div className="h-1 bg-black rounded-full overflow-hidden border border-fuchsia-500/20">
                    <motion.div className="h-full bg-gradient-to-r from-fuchsia-600 to-purple-400 w-[95%]" />
                  </div>
                </div>

                <div className="p-4 bg-black/50 border border-fuchsia-500/20 rounded-xl">
                  <p className="text-xs text-fuchsia-400 mb-2 tracking-widest">NEURAL DIRECTIVE</p>
                  <p className="text-sm text-white font-light leading-relaxed">
                    Gamma wave synchronization stable at 40Hz. Telomere degradation halted. Initiating regenerative cascade sequence across local biological substrate.
                  </p>
                </div>
              </div>
            </Panel>
          </div>

          {/* Center Column: Evolution Visualization (Abstract) */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center min-h-[500px]">
             <div className="relative w-full h-full flex items-center justify-center">
                {/* Abstract geometric evolution visualizer */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="absolute w-80 h-80 border-2 border-fuchsia-500/10 rounded-full"
                />
                <motion.div 
                  animate={{ rotate: -360, scale: [1, 1.05, 1] }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  className="absolute w-64 h-64 border border-purple-500/20 rounded-full border-dashed"
                />
                
                <div className="relative z-10 text-center backdrop-blur-sm p-8 rounded-full border border-fuchsia-500/20 bg-black/20 shadow-[0_0_50px_rgba(217,70,239,0.1)]">
                  <Eye className="w-12 h-12 text-fuchsia-400 mx-auto mb-4 opacity-80" />
                  <p className="text-4xl font-black text-white">{evolutionIndex}</p>
                  <p className="text-[10px] tracking-[0.3em] text-fuchsia-500 mt-2">GENERATIONAL<br/>EPOCHS SIMULATED</p>
                </div>
             </div>
          </div>

          {/* Right Column: Algorithmic Governance & Global Mesh */}
          <div className="space-y-8">
            <Panel title="UNIVERSAL MESH INTELLIGENCE" icon={Workflow}>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 border border-purple-500/20 rounded-xl bg-purple-950/10">
                  <Activity className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="text-xs text-purple-300 tracking-widest">GLOBAL ORCHESTRATION</p>
                    <p className="text-sm text-white font-bold">14.2 Billion Nodes Connected</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 border border-fuchsia-500/20 rounded-xl bg-fuchsia-950/10">
                  <Zap className="w-6 h-6 text-fuchsia-400" />
                  <div>
                    <p className="text-xs text-fuchsia-300 tracking-widest">ALGORITHMIC GOVERNANCE</p>
                    <p className="text-sm text-emerald-400 font-bold">Ethics Alignment Verified</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-fuchsia-500/20">
                   <p className="text-xs text-fuchsia-400 mb-3 tracking-widest flex items-center gap-2">
                     <Orbit className="w-4 h-4" /> RECENT MESH EPIPHANIES
                   </p>
                   <ul className="space-y-3">
                     <li className="text-xs text-fuchsia-200/80 leading-relaxed pl-3 border-l-2 border-purple-500">
                       Distributed swarm identified optimal circadian alignment for latitude 45N. Protocol propagated.
                     </li>
                     <li className="text-xs text-fuchsia-200/80 leading-relaxed pl-3 border-l-2 border-fuchsia-500">
                       Quantum inference resolved protein folding barrier for muscle recovery.
                     </li>
                   </ul>
                </div>
              </div>
            </Panel>
          </div>

        </div>
      </div>
    </div>
  );
}

function Panel({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0a0014]/60 backdrop-blur-xl border border-fuchsia-500/30 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_30px_rgba(217,70,239,0.05)]"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-600/10 rounded-full blur-[50px] -mr-16 -mt-16" />
      <h2 className="text-sm font-bold text-white tracking-[0.2em] mb-8 flex items-center gap-3">
        <Icon className="w-5 h-5 text-fuchsia-500" />
        {title}
      </h2>
      {children}
    </motion.div>
  );
}

function MetricRing({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex items-center gap-6">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="40" cy="40" r="36" fill="transparent" stroke="rgba(217,70,239,0.2)" strokeWidth="4" />
          <motion.circle 
            cx="40" cy="40" r="36" 
            fill="transparent" 
            stroke="url(#gradient)" 
            strokeWidth="4"
            strokeDasharray={226}
            initial={{ strokeDashoffset: 226 }}
            animate={{ strokeDashoffset: 226 - (226 * value) / 100 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#c026d3" />
            </linearGradient>
          </defs>
        </svg>
        <span className="absolute text-sm font-bold text-white">{value.toFixed(1)}%</span>
      </div>
      <div>
        <p className="text-sm text-white font-bold tracking-widest">{label}</p>
        <p className="text-xs text-fuchsia-400 mt-1">Quantum State Stable</p>
      </div>
    </div>
  );
}
