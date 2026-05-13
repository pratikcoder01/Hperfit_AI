"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Activity, AlertTriangle, CheckCircle2, ShieldAlert, Crosshair, Cpu } from "lucide-react";

// In a real application, we would use the official @mediapipe/tasks-vision package.
// For this advanced simulation/scaffold, we construct the robust architectural shell 
// that mimics the live WASM inference loop.

export default function AI_Body_Scanner() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isScanning, setIsScanning] = useState(false);
  const [exercise, setExercise] = useState("SQUAT");
  const [repCount, setRepCount] = useState(0);
  const [formScore, setFormScore] = useState(100);
  const [feedback, setFeedback] = useState("AWAITING POSITION...");
  const [jointAngle, setJointAngle] = useState(180);

  // Startup Camera
  useEffect(() => {
    async function setupCamera() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) return;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 1280, height: 720, facingMode: "user" } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera access denied:", err);
      }
    }
    setupCamera();

    return () => {
      // Cleanup
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Simulate MediaPipe WASM Loop
  useEffect(() => {
    if (!isScanning) return;
    
    let animationFrameId: number;
    let stage = "UP";
    let reps = repCount;
    
    const simulateInference = () => {
      if (!canvasRef.current || !videoRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // --- SIMULATED AI POSE LOGIC ---
      // In production, `poseLandmarker.detectForVideo(video, time)` replaces this math.
      const time = Date.now() / 1000;
      
      // Simulate user doing a squat based on a sine wave
      const simulatedKneeAngle = 90 + 90 * Math.sin(time * 2); 
      setJointAngle(Math.round(simulatedKneeAngle));

      // 1. Render Futuristic Iron Man HUD Grid
      ctx.strokeStyle = "rgba(0, 245, 212, 0.1)";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvasRef.current.width; i += 50) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvasRef.current.height); ctx.stroke();
      }
      for (let i = 0; i < canvasRef.current.height; i += 50) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvasRef.current.width, i); ctx.stroke();
      }

      // 2. Render Simulated Skeletal Joints
      const centerX = canvasRef.current.width / 2;
      const centerY = canvasRef.current.height / 2 + (180 - simulatedKneeAngle); // move down as angle decreases
      
      // Draw Hip -> Knee -> Ankle
      ctx.strokeStyle = simulatedKneeAngle < 100 ? "#00F5D4" : "#7B2CBF"; // Neon cyan when deep
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - 100); // Hip
      ctx.lineTo(centerX - 20, centerY);  // Knee
      ctx.lineTo(centerX, centerY + 150); // Ankle
      ctx.stroke();

      // Draw Joint Nodes
      [
        {x: centerX, y: centerY - 100},
        {x: centerX - 20, y: centerY},
        {x: centerX, y: centerY + 150}
      ].forEach(joint => {
        ctx.fillStyle = "#0B0F19";
        ctx.strokeStyle = "#00F5D4";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(joint.x, joint.y, 8, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      });

      // 3. Mathematical Rep Counting Heuristic
      if (simulatedKneeAngle > 160) {
        if (stage === "DOWN") {
          reps += 1;
          setRepCount(reps);
          setFeedback("PERFECT REP");
          setFormScore(100);
        }
        stage = "UP";
        if (stage === "UP" && simulatedKneeAngle > 175) setFeedback("READY");
      }
      if (simulatedKneeAngle < 100) {
        stage = "DOWN";
        setFeedback("PUSH UP!");
        
        // Simulate minor form decay
        if (Math.random() > 0.95) {
          setFormScore(prev => Math.max(70, prev - 2));
          setFeedback("KNEES CAVING IN - PUSH OUT");
        }
      }

      animationFrameId = requestAnimationFrame(simulateInference);
    };

    simulateInference();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isScanning]); // Intentionally not including repCount to prevent infinite loop resetting

  return (
    <div className="h-[calc(100vh-2rem)] bg-[#020617] rounded-3xl border border-[#00F5D4]/20 flex flex-col overflow-hidden relative shadow-[0_0_50px_rgba(0,245,212,0.05)]">
      
      {/* Top Telemetry Bar */}
      <div className="h-16 border-b border-[#00F5D4]/20 bg-[#020617]/80 backdrop-blur-md flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-3">
          <Crosshair className="w-6 h-6 text-[#00F5D4] animate-spin-slow" />
          <div>
            <h2 className="text-white font-bold tracking-wider">A.I. <span className="text-[#00F5D4]">VISION ENGINE</span></h2>
            <p className="text-[10px] text-[#00F5D4] font-mono tracking-widest flex items-center gap-1">
              <Activity className="w-3 h-3 animate-pulse" /> LATENCY: 24ms (EDGE INFERENCE)
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <select 
            value={exercise} 
            onChange={(e) => setExercise(e.target.value)}
            className="bg-[#0F172A] border border-[#00F5D4]/30 rounded-md text-xs text-[#00F5D4] font-mono px-3 outline-none"
          >
            <option value="SQUAT">BARBELL SQUAT</option>
            <option value="DEADLIFT">DEADLIFT</option>
            <option value="PUSHUP">PUSHUP</option>
          </select>

          <button 
            onClick={() => setIsScanning(!isScanning)}
            className={`px-6 py-2 rounded-md font-mono text-xs font-bold transition-all ${
              isScanning 
                ? 'bg-rose-500/20 text-rose-500 border border-rose-500/50 hover:bg-rose-500/30' 
                : 'bg-[#00F5D4]/20 text-[#00F5D4] border border-[#00F5D4]/50 hover:bg-[#00F5D4]/30'
            }`}
          >
            {isScanning ? 'HALT INFERENCE' : 'INITIALIZE SCAN'}
          </button>
        </div>
      </div>

      {/* Main Scanner Area */}
      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        
        {/* The Live Video Feed */}
        <video 
          ref={videoRef}
          autoPlay 
          playsInline 
          muted 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />

        {/* The Iron Man Overlay Canvas */}
        <canvas 
          ref={canvasRef}
          width={1280}
          height={720}
          className="absolute inset-0 w-full h-full object-cover z-10 mix-blend-screen"
        />

        {/* Center Reticle */}
        {!isScanning && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-20 flex flex-col items-center"
          >
            <Camera className="w-16 h-16 text-[#00F5D4]/50 mb-4" />
            <p className="text-white font-mono tracking-[0.3em] text-sm">AWAITING BIOMETRIC LOCK</p>
          </motion.div>
        )}

        {/* HUD Elements */}
        {isScanning && (
          <>
            {/* Left HUD: Reps & Form */}
            <div className="absolute left-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-6">
              <div className="p-4 bg-[#020617]/60 backdrop-blur-md border-l-4 border-[#00F5D4] rounded-r-xl">
                <p className="text-[10px] text-[#00F5D4] font-mono tracking-widest mb-1">REP COUNTER</p>
                <p className="text-6xl font-black text-white font-mono">{repCount.toString().padStart(2, '0')}</p>
              </div>
              
              <div className="p-4 bg-[#020617]/60 backdrop-blur-md border-l-4 border-[#7B2CBF] rounded-r-xl">
                <p className="text-[10px] text-[#7B2CBF] font-mono tracking-widest mb-1">FORM SCORE</p>
                <p className={`text-4xl font-black font-mono ${formScore < 80 ? 'text-rose-500' : 'text-emerald-400'}`}>
                  {formScore}%
                </p>
              </div>
            </div>

            {/* Right HUD: Telemetry Analytics */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-4 w-64">
              <div className="p-4 bg-[#020617]/60 backdrop-blur-md border border-[#00F5D4]/20 rounded-xl">
                <p className="text-[10px] text-blue-200/50 font-mono tracking-widest mb-2 flex items-center gap-2">
                  <Cpu className="w-3 h-3" /> KINEMATIC DATA
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-[#94A3B8]">KNEE ANGLE</span>
                    <span className="text-[#00F5D4]">{jointAngle}°</span>
                  </div>
                  <div className="w-full bg-black h-1 rounded-full overflow-hidden">
                    <div className="h-full bg-[#00F5D4]" style={{ width: `${(jointAngle / 180) * 100}%` }} />
                  </div>
                  
                  <div className="flex justify-between text-xs font-mono mt-3">
                    <span className="text-[#94A3B8]">HIP HINGE</span>
                    <span className="text-[#00F5D4]">OPTIMAL</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono mt-1">
                    <span className="text-[#94A3B8]">SPINAL LOAD</span>
                    <span className="text-emerald-400">SAFE</span>
                  </div>
                </div>
              </div>

              {/* Real-time Feedback Box */}
              <motion.div 
                key={feedback}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`p-4 backdrop-blur-md rounded-xl border ${
                  feedback.includes('PERFECT') || feedback.includes('READY')
                    ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400'
                    : 'bg-rose-900/30 border-rose-500/50 text-rose-400'
                }`}
              >
                <p className="text-[10px] font-mono tracking-widest mb-1">A.I. COACH FEEDBACK</p>
                <p className="text-sm font-bold tracking-wide">{feedback}</p>
              </motion.div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
