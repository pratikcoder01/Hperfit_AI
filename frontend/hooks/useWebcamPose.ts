"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { PoseLandmarks, ExerciseType, RepState, FormAnalysisResult } from "@/types/cv";
import { analyzeForm, updateRepCounter, drawSkeleton, extractJointAngles, getRepAngle } from "@/lib/pose-analysis";

interface UseWebcamPoseOptions {
  exercise: ExerciseType;
  enabled: boolean;
  onFrame?: (result: FrameResult) => void;
}

export interface FrameResult {
  landmarks: PoseLandmarks | null;
  formAnalysis: FormAnalysisResult | null;
  repState: RepState;
}

const INITIAL_REP_STATE: RepState = {
  count: 0,
  phase: "neutral",
  isInMotion: false,
  currentAngle: 180,
  lastRepQuality: 0,
  totalReps: 0,
  goodReps: 0,
  badReps: 0,
};

export function useWebcamPose({ exercise, enabled, onFrame }: UseWebcamPoseOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseLandmarkerRef = useRef<unknown>(null);
  const animFrameRef = useRef<number>(0);
  const repStateRef = useRef<RepState>(INITIAL_REP_STATE);

  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [repState, setRepState] = useState<RepState>(INITIAL_REP_STATE);
  const [formAnalysis, setFormAnalysis] = useState<FormAnalysisResult | null>(null);
  const [fps, setFps] = useState(0);

  // Initialize MediaPipe
  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    async function initMediaPipe() {
      setIsLoading(true);
      setError(null);
      try {
        const vision = await import("@mediapipe/tasks-vision");
        const { PoseLandmarker, FilesetResolver } = vision;

        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const landmarker = await PoseLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        if (!cancelled) {
          poseLandmarkerRef.current = landmarker;
          setIsLoading(false);
        }
      } catch (e) {
        if (!cancelled) {
          setError("Failed to load AI model. Check your internet connection.");
          setIsLoading(false);
        }
      }
    }

    initMediaPipe();
    return () => { cancelled = true; };
  }, [enabled]);

  // Start webcam
  const startCamera = useCallback(async () => {
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: "user" },
        audio: false,
      });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
    } catch {
      setError("Camera access denied. Please allow webcam permissions.");
    }
  }, []);

  // Stop webcam
  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    cancelAnimationFrame(animFrameRef.current);
    setIsDetecting(false);
  }, []);

  // Main detection loop
  const startDetection = useCallback(() => {
    if (!poseLandmarkerRef.current || !videoRef.current || !canvasRef.current) return;
    setIsDetecting(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const landmarker = poseLandmarkerRef.current as any;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;

    let lastTime = 0;
    let frameCount = 0;
    let fpsTimer = Date.now();

    function detect(timestamp: number) {
      if (!video || video.paused || video.ended) {
        animFrameRef.current = requestAnimationFrame(detect);
        return;
      }

      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      try {
        if (timestamp !== lastTime) {
          const result = landmarker.detectForVideo(video, timestamp);
          lastTime = timestamp;

          if (result.landmarks?.[0]) {
            const lm = result.landmarks[0];
            drawSkeleton(ctx, lm, canvas.width, canvas.height);

            // Form analysis
            const form = analyzeForm(exercise, lm);
            const angles = extractJointAngles(lm);
            const angle = getRepAngle(exercise, angles);

            // Rep counting
            const newRepState = updateRepCounter(repStateRef.current, exercise, angles, form.overallScore);
            repStateRef.current = newRepState;

            setFormAnalysis(form);
            setRepState({ ...newRepState });

            onFrame?.({ landmarks: lm, formAnalysis: form, repState: newRepState });
          } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
          }
        }
      } catch { /* skip frame */ }

      // FPS counter
      frameCount++;
      if (Date.now() - fpsTimer >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        fpsTimer = Date.now();
      }

      animFrameRef.current = requestAnimationFrame(detect);
    }

    animFrameRef.current = requestAnimationFrame(detect);
  }, [exercise, onFrame]);

  // Reset reps
  const resetReps = useCallback(() => {
    repStateRef.current = INITIAL_REP_STATE;
    setRepState(INITIAL_REP_STATE);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      stopCamera();
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [stopCamera]);

  return {
    videoRef,
    canvasRef,
    isLoading,
    isDetecting,
    error,
    repState,
    formAnalysis,
    fps,
    startCamera,
    stopCamera,
    startDetection,
    resetReps,
  };
}
