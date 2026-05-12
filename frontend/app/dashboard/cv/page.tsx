"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, CameraOff, RefreshCw, Zap, Activity,
  AlertTriangle, CheckCircle2, Brain, RotateCcw,
  ChevronDown, Shield, Target, Cpu
} from "lucide-react";
import { useWebcamPose } from "@/hooks/useWebcamPose";
import type { ExerciseType, ExerciseConfig } from "@/types/cv";

const NEON = "#00F5D4";
const VIOLET = "#7B2CBF";
const RED = "#EF4444";
const AMBER = "#F59E0B";

const EXERCISES: Record<ExerciseType, ExerciseConfig> = {
  squat: { name: "Squat", icon: "🏋️", primaryJoints: ["Knee", "Hip"], targetAngle: { min: 85, max: 100 }, description: "Compound lower body" },
  pushup: { name: "Push-Up", icon: "💪", primaryJoints: ["Elbow", "Shoulder"], targetAngle: { min: 80, max: 100 }, description: "Upper body push" },
  deadlift: { name: "Deadlift", icon: "🔱", primaryJoints: ["Back", "Hip"], targetAngle: { min: 90, max: 110 }, description: "Full body compound" },
  lunge: { name: "Lunge", icon: "🦵", primaryJoints: ["Knee", "Hip"], targetAngle: { min: 85, max: 100 }, description: "Unilateral lower body" },
  shoulder_press: { name: "Shoulder Press", icon: "🤲", primaryJoints: ["Shoulder", "Elbow"], targetAngle: { min: 150, max: 180 }, description: "Overhead push" },
  bicep_curl: { name: "Bicep Curl", icon: "💪", primaryJoints: ["Elbow"], targetAngle: { min: 40, max: 60 }, description: "Arm isolation" },
  plank: { name: "Plank", icon: "🧘", primaryJoints: ["Core", "Shoulder"], targetAngle: { min: 160, max: 180 }, description: "Core stability" },
};

// ── Circular Score Ring ───────────────────────
function ScoreRing({ score, size = 80, color = NEON, label }: { score: number; size?: number; color?: string; label: string }) {
  const r = size / 2 - 8;
  const circumference = 2 * Math.PI * r;
  const dash = (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={6} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
          strokeWidth={6} strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - dash }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center" style={{ marginTop: -size / 2 - 10 }}>
        {/* inner text via absolute positioning on parent */}
      </div>
      <p className="text-xs text-[#94A3B8] text-center">{label}</p>
    </div>
  );
}

// ── Angle Gauge ───────────────────────────────
function AngleGauge({ label, angle, good }: { label: string; angle?: number; good: boolean }) {
  const val = angle ?? 0;
  const pct = Math.min(val / 180, 1);
  const color = good ? NEON : AMBER;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-[#94A3B8]">{label}</span>
        <span className="font-bold" style={{ color }}>{angle ? `${angle}°` : "—"}</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/5">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
          animate={{ width: `${pct * 100}%` }} transition={{ duration: 0.3 }} />
      </div>
    </div>
  );
}

// ── HUD Corner Decoration ─────────────────────
function HUDCorner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const style = {
    tl: "top-0 left-0 border-t-2 border-l-2",
    tr: "top-0 right-0 border-t-2 border-r-2",
    bl: "bottom-0 left-0 border-b-2 border-l-2",
    br: "bottom-0 right-0 border-b-2 border-r-2",
  }[pos];
  return (
    <div className={`absolute w-5 h-5 ${style}`} style={{ borderColor: `${NEON}60` }} />
  );
}

// ── Main Page ─────────────────────────────────
export default function CVDashboardPage() {
  const [selectedExercise, setSelectedExercise] = useState<ExerciseType>("squat");
  const [isActive, setIsActive] = useState(false);
  const [sessionReps, setSessionReps] = useState(0);
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  const {
    videoRef, canvasRef,
    isLoading, isDetecting, error,
    repState, formAnalysis, fps,
    startCamera, stopCamera, startDetection, resetReps,
  } = useWebcamPose({ exercise: selectedExercise, enabled: isActive });

  const exercise = EXERCISES[selectedExercise];

  const handleStart = async () => {
    setIsActive(true);
    await startCamera();
  };

  const handleStop = () => {
    stopCamera();
    setIsActive(false);
  };

  // Auto-start detection once camera is ready
  useEffect(() => {
    if (isActive && !isLoading && !isDetecting && !error) {
      const timer = setTimeout(startDetection, 500);
      return () => clearTimeout(timer);
    }
  }, [isActive, isLoading, isDetecting, error, startDetection]);

  const riskColor = formAnalysis?.injuryRisk === "high" ? RED
    : formAnalysis?.injuryRisk === "medium" ? AMBER : NEON;

  const gradeColor = formAnalysis?.formGrade === "A" ? NEON
    : formAnalysis?.formGrade === "B" ? "#3B82F6"
    : formAnalysis?.formGrade === "C" ? AMBER : RED;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Cpu className="w-5 h-5 text-[#00F5D4]" />
          <span className="text-xs font-semibold text-[#00F5D4] uppercase tracking-wider">Computer Vision</span>
          {isDetecting && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(0,245,212,0.10)", color: NEON, border: `1px solid ${NEON}25` }}>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] animate-pulse" />
              LIVE · {fps} FPS
            </span>
          )}
        </div>
        <motion.h1 className="text-2xl font-black"
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          AI Posture <span className="gradient-neon">Analyzer</span>
        </motion.h1>
        <p className="text-[#94A3B8] text-sm mt-1">Real-time exercise form analysis powered by MediaPipe</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        {/* Left: Camera Feed */}
        <div className="space-y-4">
          {/* Exercise Selector */}
          <div className="glass-card p-4">
            <div className="relative">
              <button onClick={() => setShowExercisePicker(!showExercisePicker)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{exercise.icon}</span>
                  <div className="text-left">
                    <p className="font-bold text-white text-sm">{exercise.name}</p>
                    <p className="text-xs text-[#94A3B8]">{exercise.description} · Joints: {exercise.primaryJoints.join(", ")}</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform ${showExercisePicker ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showExercisePicker && (
                  <motion.div className="absolute top-full mt-2 left-0 right-0 rounded-xl overflow-hidden z-20"
                    style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)" }}
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    {(Object.entries(EXERCISES) as [ExerciseType, ExerciseConfig][]).map(([key, ex]) => (
                      <button key={key} onClick={() => { setSelectedExercise(key); setShowExercisePicker(false); resetReps(); }}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <span className="text-xl">{ex.icon}</span>
                        <div>
                          <p className="text-sm font-medium text-white">{ex.name}</p>
                          <p className="text-xs text-[#94A3B8]">{ex.description}</p>
                        </div>
                        {key === selectedExercise && <CheckCircle2 className="w-4 h-4 text-[#00F5D4] ml-auto" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Camera View with HUD */}
          <div className="relative rounded-2xl overflow-hidden"
            style={{ background: "#080C18", border: "1px solid rgba(0,245,212,0.15)", aspectRatio: "4/3" }}>

            {/* HUD Corners */}
            <HUDCorner pos="tl" /><HUDCorner pos="tr" /><HUDCorner pos="bl" /><HUDCorner pos="br" />

            {/* Video element */}
            <video ref={videoRef} className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)", display: isActive ? "block" : "none" }}
              playsInline muted />

            {/* Skeleton canvas overlay */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"
              style={{ transform: "scaleX(-1)", pointerEvents: "none" }} />

            {/* Idle state */}
            {!isActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-[#00F5D4]/10 animate-ping" />
                  <div className="w-20 h-20 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(0,245,212,0.08)", border: "1px solid rgba(0,245,212,0.25)" }}>
                    <Camera className="w-9 h-9 text-[#00F5D4]" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-white font-bold">Position yourself in frame</p>
                  <p className="text-[#94A3B8] text-sm mt-1">Stand 2-3 meters from camera · Good lighting</p>
                </div>
              </div>
            )}

            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                style={{ background: "rgba(8,12,24,0.85)" }}>
                <div className="w-12 h-12 border-2 border-[#00F5D4]/20 border-t-[#00F5D4] rounded-full animate-spin" />
                <p className="text-[#00F5D4] text-sm font-semibold">Loading AI Model...</p>
                <p className="text-[#94A3B8] text-xs">Downloading MediaPipe PoseLandmarker (~5MB)</p>
              </div>
            )}

            {/* Error overlay */}
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center"
                style={{ background: "rgba(8,12,24,0.85)" }}>
                <AlertTriangle className="w-10 h-10 text-[#EF4444]" />
                <p className="text-white font-semibold">Error</p>
                <p className="text-[#94A3B8] text-sm">{error}</p>
                <button onClick={() => { setIsActive(false); }}
                  className="px-4 py-2 rounded-lg text-sm text-[#00F5D4]"
                  style={{ border: "1px solid rgba(0,245,212,0.30)" }}>
                  Try Again
                </button>
              </div>
            )}

            {/* Live grade badge */}
            {isDetecting && formAnalysis && (
              <div className="absolute top-4 left-4">
                <motion.div className="px-3 py-1.5 rounded-lg"
                  style={{ background: "rgba(8,12,24,0.85)", border: `1px solid ${gradeColor}40` }}
                  animate={{ borderColor: [`${gradeColor}40`, `${gradeColor}80`, `${gradeColor}40`] }}
                  transition={{ duration: 1.5, repeat: Infinity }}>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black" style={{ color: gradeColor }}>
                      {formAnalysis.formGrade}
                    </span>
                    <div>
                      <p className="text-[10px] text-[#94A3B8] leading-none">Form</p>
                      <p className="text-xs font-bold text-white">{formAnalysis.overallScore}%</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Injury risk badge */}
            {isDetecting && formAnalysis && (
              <div className="absolute top-4 right-4">
                <div className="px-3 py-1.5 rounded-lg flex items-center gap-1.5"
                  style={{ background: "rgba(8,12,24,0.85)", border: `1px solid ${riskColor}40` }}>
                  <Shield className="w-3.5 h-3.5" style={{ color: riskColor }} />
                  <p className="text-xs font-semibold capitalize" style={{ color: riskColor }}>
                    {formAnalysis.injuryRisk} risk
                  </p>
                </div>
              </div>
            )}

            {/* Scanning lines effect */}
            {isDetecting && (
              <motion.div className="absolute inset-0 pointer-events-none"
                style={{ background: `linear-gradient(transparent 45%, ${NEON}04 50%, transparent 55%)` }}
                animate={{ y: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            {!isActive ? (
              <motion.button onClick={handleStart}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm"
                style={{ background: NEON, color: "#0B0F19" }}
                whileHover={{ boxShadow: "0 0 30px rgba(0,245,212,0.35)" }}
                whileTap={{ scale: 0.97 }}>
                <Camera className="w-4 h-4" /> Start AI Analysis
              </motion.button>
            ) : (
              <motion.button onClick={handleStop}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-[#EF4444]"
                style={{ background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)" }}
                whileTap={{ scale: 0.97 }}>
                <CameraOff className="w-4 h-4" /> Stop
              </motion.button>
            )}
            <button onClick={resetReps}
              className="px-4 py-3.5 rounded-xl text-[#94A3B8] hover:text-white transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Metrics Panel */}
        <div className="space-y-4">
          {/* Rep Counter */}
          <motion.div className="glass-card p-5 text-center"
            style={{ border: "1px solid rgba(0,245,212,0.15)" }}>
            <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-2">Rep Counter</p>
            <motion.div className="text-6xl font-black"
              key={repState.count}
              initial={{ scale: 1.3, color: "#00F5D4" }}
              animate={{ scale: 1, color: "#FFFFFF" }}
              transition={{ duration: 0.3 }}>
              {repState.count}
            </motion.div>
            <div className="flex justify-center gap-4 mt-3 text-xs">
              <div>
                <p className="font-bold text-[#00F5D4]">{repState.goodReps}</p>
                <p className="text-[#94A3B8]">Good</p>
              </div>
              <div className="w-px bg-white/10" />
              <div>
                <p className="font-bold text-[#EF4444]">{repState.badReps}</p>
                <p className="text-[#94A3B8]">Poor</p>
              </div>
            </div>

            {/* Phase indicator */}
            <div className="flex justify-center gap-2 mt-3">
              {(["down", "neutral", "up"] as const).map((p) => (
                <div key={p} className="px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all"
                  style={{
                    background: repState.phase === p ? `${NEON}20` : "rgba(255,255,255,0.04)",
                    color: repState.phase === p ? NEON : "#94A3B8",
                    border: `1px solid ${repState.phase === p ? `${NEON}40` : "transparent"}`,
                  }}>
                  {p}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Score */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-[#00F5D4]" />
              <span className="text-sm font-bold text-white">Form Analysis</span>
            </div>
            {formAnalysis ? (
              <div className="space-y-3">
                {/* Overall score bar */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#94A3B8]">Overall Score</span>
                    <span className="font-black" style={{ color: gradeColor }}>{formAnalysis.overallScore}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: gradeColor }}
                      animate={{ width: `${formAnalysis.overallScore}%` }} transition={{ duration: 0.4 }} />
                  </div>
                </div>

                {/* Injury risk */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#94A3B8]">Injury Risk</span>
                    <span className="font-bold capitalize" style={{ color: riskColor }}>{formAnalysis.injuryRisk}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <motion.div className="h-full rounded-full" style={{ backgroundColor: riskColor }}
                      animate={{ width: `${formAnalysis.injuryRiskScore}%` }} transition={{ duration: 0.4 }} />
                  </div>
                </div>

                {/* Joint angles */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <p className="text-xs text-[#94A3B8] font-semibold">Joint Angles</p>
                  {formAnalysis.jointAngles.leftKnee !== undefined && (
                    <AngleGauge label="Knee" angle={formAnalysis.jointAngles.leftKnee}
                      good={formAnalysis.jointAngles.leftKnee < 100} />
                  )}
                  {formAnalysis.jointAngles.leftElbow !== undefined && (
                    <AngleGauge label="Elbow" angle={formAnalysis.jointAngles.leftElbow}
                      good={formAnalysis.jointAngles.leftElbow < 120} />
                  )}
                  {formAnalysis.jointAngles.backAngle !== undefined && (
                    <AngleGauge label="Back" angle={formAnalysis.jointAngles.backAngle}
                      good={formAnalysis.jointAngles.backAngle > 70} />
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Brain className="w-8 h-8 text-[#94A3B8]/30 mx-auto mb-2" />
                <p className="text-xs text-[#94A3B8]">Start analysis to see form data</p>
              </div>
            )}
          </div>

          {/* Live Feedback */}
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-[#F59E0B]" />
              <span className="text-sm font-bold text-white">Live Feedback</span>
            </div>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {formAnalysis?.feedbacks.slice(0, 4).map((fb, i) => (
                  <motion.div key={`${fb.message}-${i}`}
                    className="flex items-start gap-2 px-3 py-2 rounded-lg"
                    style={{
                      background: fb.type === "good" ? "rgba(0,245,212,0.06)"
                        : fb.type === "error" ? "rgba(239,68,68,0.06)"
                        : "rgba(245,158,11,0.06)",
                      border: `1px solid ${fb.type === "good" ? "rgba(0,245,212,0.15)"
                        : fb.type === "error" ? "rgba(239,68,68,0.15)"
                        : "rgba(245,158,11,0.15)"}`,
                    }}
                    initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }} layout>
                    {fb.type === "good"
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-[#00F5D4] flex-shrink-0 mt-0.5" />
                      : fb.type === "error"
                      ? <AlertTriangle className="w-3.5 h-3.5 text-[#EF4444] flex-shrink-0 mt-0.5" />
                      : <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B] flex-shrink-0 mt-0.5" />}
                    <p className="text-xs text-[#CBD5E1] leading-snug">{fb.message}</p>
                  </motion.div>
                )) || (
                  <p className="text-xs text-[#94A3B8] text-center py-4">Waiting for detection...</p>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Target angles */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-[#7B2CBF]" />
              <span className="text-sm font-bold text-white">Target Angles</span>
            </div>
            <p className="text-xs text-[#94A3B8] mb-2">{exercise.name} optimal range</p>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold" style={{ color: NEON }}>{exercise.targetAngle.min}°</span>
              <div className="flex-1 h-2 rounded-full bg-white/5 relative">
                <div className="absolute inset-y-0 rounded-full"
                  style={{
                    left: `${(exercise.targetAngle.min / 180) * 100}%`,
                    right: `${100 - (exercise.targetAngle.max / 180) * 100}%`,
                    background: `${NEON}30`,
                    border: `1px solid ${NEON}40`,
                  }} />
              </div>
              <span className="text-sm font-bold" style={{ color: NEON }}>{exercise.targetAngle.max}°</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
