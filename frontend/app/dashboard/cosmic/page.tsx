"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Satellite, Globe, Triangle, Radio, GaugeCircle, ShieldAlert } from "lucide-react";

export default function CosmicObservationDeck() {
  const [activeNode, setActiveNode] = useState("EARTH_PRIME");

  const nodes = {
    EARTH_PRIME: { name: "Earth Prime", entities: "8.4B", gravity: "1.0G", latency: "12ms", status: "OPTIMAL" },
    MARS_ALPHA: { name: "Mars Colony Alpha", entities: "1.25M", gravity: "0.38G", latency: "14m 12s", status: "ADAPTING" },
    ORBITAL_ARES: { name: "Orbital Station Ares", entities: "45K", gravity: "0.0G", latency: "450ms", status: "CRITICAL BONE DENSITY" }
  };

  return (
    <div className="min-h-screen bg-[#050510] text-blue-400 font-sans p-8 overflow-hidden relative selection:bg-blue-500/30">
      {/* Deep Space Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(30,58,138,0.2)_0%,_rgba(5,5,16,1)_100%)] pointer-events-none" />
      
      {/* Starfield simulation */}
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 max-w-screen-2xl mx-auto h-full flex flex-col">
        
        {/* Holographic Header */}
        <header className="flex justify-between items-start mb-12 border-b border-blue-900/50 pb-6">
          <div className="flex gap-4">
            <Triangle className="w-12 h-12 text-blue-500 fill-blue-500/10 animate-pulse" style={{ animationDuration: '4s' }} />
            <div>
              <h1 className="text-4xl font-light text-white tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                INTERSTELLAR <span className="font-bold">OBSERVATION</span>
              </h1>
              <p className="text-[10px] text-blue-400/80 tracking-[0.5em] uppercase mt-2">Phase 9 // Cosmic AGI Infrastructure</p>
            </div>
          </div>
          
          <div className="flex gap-6 text-right">
            <div>
              <p className="text-[10px] text-blue-500 tracking-[0.2em] mb-1">UNIVERSAL NETWORK</p>
              <p className="text-sm text-white font-mono flex items-center gap-2 justify-end">
                <Radio className="w-3 h-3 text-emerald-400 animate-ping" /> SYNCHRONIZED
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1">
          
          {/* Left Column: Celestial Node Selector */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xs text-blue-300 tracking-[0.3em] uppercase mb-6 flex items-center gap-2">
              <Satellite className="w-4 h-4" /> Celestial Nodes
            </h2>
            
            {Object.entries(nodes).map(([key, data]) => (
              <motion.button
                key={key}
                onClick={() => setActiveNode(key)}
                whileHover={{ x: 5 }}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 ${
                  activeNode === key 
                    ? 'bg-blue-900/40 border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                    : 'bg-black/40 border-blue-900/40 hover:border-blue-700/60 text-blue-200/50'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-bold tracking-wider ${activeNode === key ? 'text-white' : ''}`}>
                    {data.name}
                  </span>
                  {key === 'EARTH_PRIME' ? <Globe className="w-4 h-4" /> : <Rocket className="w-4 h-4" />}
                </div>
                <div className="flex justify-between text-[10px] font-mono tracking-widest">
                  <span>{data.gravity}</span>
                  <span className={data.status.includes('CRITICAL') ? 'text-rose-400' : 'text-emerald-400'}>
                    {data.status}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          {/* Center/Right Area: Cosmic Telemetry & AGI Governance */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeNode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="col-span-1 md:col-span-2 bg-[#0a0f1c]/80 backdrop-blur-md border border-blue-500/20 rounded-2xl p-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[60px] -mr-20 -mt-20 pointer-events-none" />
                
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <h3 className="text-2xl font-light text-white tracking-widest mb-2">{nodes[activeNode as keyof typeof nodes].name}</h3>
                    <p className="text-xs text-blue-400 font-mono tracking-[0.2em]">ACTIVE ENTITIES: {nodes[activeNode as keyof typeof nodes].entities}</p>
                  </div>
                  <div className="text-right font-mono">
                    <p className="text-[10px] text-blue-500 tracking-widest mb-1">QUANTUM LATENCY</p>
                    <p className="text-xl text-white">{nodes[activeNode as keyof typeof nodes].latency}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Physiological Adaptations */}
                  <div className="space-y-6">
                    <h4 className="text-xs text-blue-300 tracking-[0.2em] flex items-center gap-2 border-b border-blue-900/50 pb-2">
                      <GaugeCircle className="w-4 h-4" /> PHYSIOLOGICAL OVERRIDES
                    </h4>
                    
                    {activeNode === 'EARTH_PRIME' && (
                      <div className="space-y-4">
                        <OverrideItem title="Epigenetic Drift" value="Standard" />
                        <OverrideItem title="Resistance Protocols" value="Free Weights / Magnetic" />
                        <p className="text-xs text-emerald-400 font-mono mt-4">AGI GOVERNANCE: Standard optimization parameters holding.</p>
                      </div>
                    )}
                    
                    {activeNode === 'MARS_ALPHA' && (
                      <div className="space-y-4">
                        <OverrideItem title="Bone Density Loss" value="-2.4% / yr" critical />
                        <OverrideItem title="Radiation Shielding" value="Nutrition Matrix +15%" />
                        <p className="text-xs text-amber-400 font-mono mt-4">AGI GOVERNANCE: High-Impact 1.5G exosuit simulations mandated daily.</p>
                      </div>
                    )}

                    {activeNode === 'ORBITAL_ARES' && (
                      <div className="space-y-4">
                        <OverrideItem title="Gravity Deficit" value="100%" critical />
                        <OverrideItem title="Muscle Atrophy Rate" value="Severe" critical />
                        <p className="text-xs text-rose-400 font-mono mt-4">AGI GOVERNANCE: Emergency Centrifugal Resistance activated. Artificial gravity spin deployed.</p>
                      </div>
                    )}
                  </div>

                  {/* Planet Visual Placeholder */}
                  <div className="flex items-center justify-center border border-blue-900/30 rounded-xl bg-black/40 relative h-64 overflow-hidden">
                     {/* Circular radar scan effect */}
                     <div className="absolute w-48 h-48 border border-blue-500/20 rounded-full" />
                     <div className="absolute w-32 h-32 border border-blue-400/30 rounded-full" />
                     <motion.div 
                       animate={{ rotate: 360 }} 
                       transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                       className="absolute w-48 h-48 border-t-2 border-blue-400 rounded-full opacity-50"
                     />
                     
                     {activeNode === 'EARTH_PRIME' && <Globe className="w-16 h-16 text-blue-500" />}
                     {activeNode === 'MARS_ALPHA' && <div className="w-16 h-16 rounded-full bg-red-900/50 border border-red-500/50 shadow-[0_0_30px_rgba(220,38,38,0.2)]" />}
                     {activeNode === 'ORBITAL_ARES' && <Satellite className="w-16 h-16 text-gray-400" />}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>
        </div>
      </div>
    </div>
  );
}

function OverrideItem({ title, value, critical = false }: { title: string, value: string, critical?: boolean }) {
  return (
    <div className="flex justify-between items-center text-sm border border-blue-900/30 p-3 rounded-lg bg-blue-950/10">
      <span className="text-blue-200/70">{title}</span>
      <span className={`font-mono ${critical ? 'text-rose-400' : 'text-white'}`}>{value}</span>
    </div>
  );
}
