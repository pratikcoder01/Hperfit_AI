"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, PhoneOff, Activity, ShieldAlert, Volume2 } from "lucide-react";

export default function VoiceInterface() {
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [status, setStatus] = useState("DISCONNECTED");
  const [volumeLevel, setVolumeLevel] = useState(0);

  // Simulate WebSocket connection and audio levels
  useEffect(() => {
    let interval: number;
    if (isActive && !isMuted) {
      setStatus("LISTENING...");
      interval = setInterval(() => {
        setVolumeLevel(Math.random() * 100);
      }, 100) as unknown as number;
    } else if (isActive && isMuted) {
      setStatus("MUTED");
      setVolumeLevel(0);
    } else {
      setStatus("DISCONNECTED");
      setVolumeLevel(0);
    }
    return () => clearInterval(interval);
  }, [isActive, isMuted]);

  const toggleCall = () => {
    if (!isActive) {
      setIsActive(true);
      setTranscript("");
      setAiReply("");
      
      // Simulate speaking after a few seconds
      setTimeout(() => {
        setStatus("ANALYZING...");
        setTranscript("I'm feeling really tired today.");
        
        setTimeout(() => {
          setStatus("AI SPEAKING...");
          setAiReply("I hear you. But exhaustion is just weakness leaving the body. Let's do 10 minutes of mobility.");
          
          setTimeout(() => {
            setStatus("LISTENING...");
          }, 4000);
        }, 1000);
      }, 3000);

    } else {
      setIsActive(false);
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] bg-[#020617] rounded-3xl border border-[#00F5D4]/20 flex flex-col items-center justify-center relative shadow-[0_0_50px_rgba(0,245,212,0.05)] overflow-hidden">
      
      {/* Background Pulse */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: isActive && status === "AI SPEAKING..." ? [1, 1.2, 1] : 1,
            opacity: isActive ? 0.8 : 0.2
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_center,_rgba(0,245,212,0.1)_0%,_rgba(2,6,23,1)_70%)] rounded-full" 
        />
      </div>

      {/* Header Info */}
      <div className="absolute top-8 left-8 z-20 flex flex-col gap-2">
        <h2 className="text-white font-bold tracking-wider flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-[#00F5D4]" /> HYPERCOACH <span className="text-[#00F5D4]">VOICE</span>
        </h2>
        <div className="flex items-center gap-2 px-3 py-1 bg-[#0F172A] rounded-full border border-slate-800">
          <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-[#00F5D4] animate-pulse' : 'bg-slate-600'}`} />
          <span className="text-xs font-mono text-slate-400">{status}</span>
        </div>
      </div>

      {/* Waveform Visualizer */}
      <div className="relative z-10 w-full max-w-2xl h-64 flex items-center justify-center gap-1 mb-12">
        {!isActive ? (
          <p className="text-slate-600 font-mono tracking-widest">INITIALIZE VOICE UPLINK TO BEGIN</p>
        ) : (
          [...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                height: status === "AI SPEAKING..." 
                  ? `${Math.max(10, Math.random() * 100)}%` 
                  : status === "LISTENING..." && !isMuted
                    ? `${Math.max(5, volumeLevel * (Math.random() * 1.5))}%`
                    : "4px"
              }}
              transition={{ duration: 0.1 }}
              className={`w-3 rounded-full ${status === "AI SPEAKING..." ? 'bg-gradient-to-t from-[#7B2CBF] to-[#00F5D4]' : 'bg-[#00F5D4]/40'}`}
            />
          ))
        )}
      </div>

      {/* Transcripts */}
      <div className="z-10 w-full max-w-xl text-center space-y-6 min-h-[120px]">
        <AnimatePresence mode="wait">
          {transcript && (
            <motion.div
              key={transcript}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-sm text-slate-400 font-mono italic">"{transcript}"</p>
            </motion.div>
          )}
          {aiReply && status === "AI SPEAKING..." && (
            <motion.div
              key={aiReply}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4"
            >
              <p className="text-xl md:text-3xl font-light text-white leading-tight">
                {aiReply}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="absolute bottom-12 z-20 flex items-center gap-6">
        {isActive && (
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-rose-500/20 text-rose-500 border border-rose-500/50' : 'bg-[#0F172A] text-white border border-slate-700 hover:bg-slate-800'}`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </button>
        )}
        
        <button 
          onClick={toggleCall}
          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-all ${isActive ? 'bg-rose-500 text-white hover:bg-rose-600 shadow-[0_0_30px_rgba(244,63,94,0.4)]' : 'bg-gradient-to-r from-[#00F5D4] to-[#7B2CBF] text-[#0B0F19] hover:scale-105 shadow-[0_0_30px_rgba(0,245,212,0.3)]'}`}
        >
          {isActive ? <PhoneOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
        </button>

        {isActive && (
          <button 
            className="w-14 h-14 rounded-full bg-[#0F172A] text-white border border-slate-700 hover:bg-slate-800 flex items-center justify-center"
          >
            <Activity className="w-6 h-6 text-[#00F5D4]" />
          </button>
        )}
      </div>

    </div>
  );
}
