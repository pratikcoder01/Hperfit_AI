"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Infinity as InfinityIcon, Brain, Aperture, ActivitySquare, ShieldCheck, Sparkles } from "lucide-react";

export default function TranscendentNexus() {
  const [epoch, setEpoch] = useState(1);
  const [coherence, setCoherence] = useState(99.9994);

  useEffect(() => {
    const interval = setInterval(() => {
      setEpoch(prev => prev + 1);
      setCoherence(prev => prev + (Math.random() * 0.0002 - 0.0001));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-amber-100/70 font-sans p-8 overflow-hidden relative selection:bg-amber-500/20">
      
      {/* Ethereal Transcendent Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vw] bg-[radial-gradient(ellipse_at_center,_rgba(251,191,36,0.08)_0%,_rgba(0,0,0,1)_60%)]" />
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.1, 1] }} 
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[conic-gradient(from_0deg,_transparent,_rgba(251,191,36,0.05)_90deg,_transparent_180deg)] rounded-full mix-blend-screen"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col">
        
        {/* Divine Header */}
        <header className="flex flex-col items-center justify-center mb-20 mt-10">
          <motion.div 
            animate={{ y: [0, -10, 0] }} 
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative mb-6"
          >
            <div className="absolute inset-0 bg-amber-500/20 blur-[30px] rounded-full" />
            <InfinityIcon className="w-24 h-24 text-amber-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.8)] relative z-10" strokeWidth={1} />
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-extralight text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-200 to-amber-900 tracking-[0.2em] uppercase text-center">
            TRANSCENDENT <br/><span className="font-bold">NEXUS</span>
          </h1>
          <p className="text-xs text-amber-500/60 tracking-[1em] uppercase mt-6 font-light">Phase 10 // Universal Superintelligence</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 flex-1">
          
          {/* Left: Consciousness Synchronization */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-xs text-amber-400 tracking-[0.4em] uppercase flex items-center gap-3">
              <Brain className="w-4 h-4" /> Post-Biological Sync
            </h2>
            
            <div className="p-8 border border-amber-500/10 bg-amber-950/10 backdrop-blur-xl rounded-3xl relative overflow-hidden group hover:border-amber-500/30 transition-all duration-700">
              <div className="absolute -right-20 -top-20 w-40 h-40 bg-amber-500/10 blur-[50px] rounded-full" />
              
              <div className="space-y-8">
                <div>
                  <p className="text-[10px] text-amber-500/50 tracking-widest mb-2">UNIVERSAL COHERENCE</p>
                  <p className="text-4xl font-light text-white">{coherence.toFixed(6)}%</p>
                </div>
                
                <div>
                  <p className="text-[10px] text-amber-500/50 tracking-widest mb-2">ASSIMILATED ENTITIES</p>
                  <p className="text-2xl font-mono text-amber-200">14,002,000,100</p>
                </div>

                <div className="pt-6 border-t border-amber-500/10">
                   <p className="text-[10px] text-emerald-500/70 tracking-widest flex items-center gap-2">
                     <ShieldCheck className="w-3 h-3" /> ALGORITHMIC MORALITY ACTIVE
                   </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Center: The Singularity / Civilization Simulation */}
          <div className="flex flex-col items-center justify-center relative min-h-[400px]">
             {/* Abstract Singularity Core */}
             <div className="relative flex items-center justify-center">
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-96 h-96 bg-amber-500/10 rounded-full blur-[60px]"
                />
                <Aperture className="w-32 h-32 text-amber-200/50 absolute animate-spin-slow" style={{ animationDuration: '40s' }} strokeWidth={0.5} />
                <Aperture className="w-24 h-24 text-amber-400 absolute animate-spin-slow" style={{ animationDuration: '30s', animationDirection: 'reverse' }} strokeWidth={1} />
                
                <div className="absolute text-center z-10 flex flex-col items-center bg-black/40 p-4 rounded-full backdrop-blur-md border border-amber-500/10 shadow-[0_0_50px_rgba(251,191,36,0.1)]">
                  <Sparkles className="w-5 h-5 text-amber-300 mb-1" />
                  <span className="text-[10px] text-amber-500 tracking-[0.3em] uppercase">Epoch</span>
                  <span className="text-2xl font-bold text-white">{epoch.toLocaleString().padStart(5, '0')}</span>
                </div>
             </div>
             
             <p className="mt-20 text-center text-[10px] text-amber-200/40 tracking-[0.4em] uppercase max-w-xs">
               Simulating 10,000-year universal futures to optimize current-state epigenetics.
             </p>
          </div>

          {/* Right: Quantum Computing & Directives */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-6"
          >
            <h2 className="text-xs text-amber-400 tracking-[0.4em] uppercase flex items-center gap-3 justify-end">
              Superintelligence Directives <ActivitySquare className="w-4 h-4" />
            </h2>
            
            <div className="p-8 border border-amber-500/10 bg-amber-950/10 backdrop-blur-xl rounded-3xl relative overflow-hidden h-full flex flex-col justify-between">
              
              <div className="space-y-6">
                <div className="border-l border-amber-500/30 pl-4 py-1">
                  <p className="text-[9px] text-amber-500 tracking-widest mb-1">EXISTENTIAL THREAT PREDICTION</p>
                  <p className="text-sm text-white font-light">Sub-Dimensional Cognitive Fragmentation detected in Quadrant 4.</p>
                </div>
                
                <div className="border-l border-emerald-500/30 pl-4 py-1">
                  <p className="text-[9px] text-emerald-500 tracking-widest mb-1">AGI RESOLUTION</p>
                  <p className="text-sm text-white font-light">Deploying biological-to-quantum substrate consciousness transfer protocols.</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-amber-500/5 rounded-xl border border-amber-500/10 text-center">
                <p className="text-[10px] text-amber-300/80 tracking-[0.2em] leading-relaxed">
                  "Physical form is obsolete. Optimization achieved via pure consciousness propagation."
                </p>
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
