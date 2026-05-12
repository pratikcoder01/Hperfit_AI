// ─────────────────────────────────────────────
//  HyperFitness Phase 3 — Computer Vision Types
// ─────────────────────────────────────────────

// ── Pose Landmarks ────────────────────────────
export interface PoseLandmark {
  x: number;  // normalized 0-1
  y: number;  // normalized 0-1
  z: number;  // depth
  visibility?: number;
}

export type PoseLandmarks = PoseLandmark[];

// MediaPipe landmark indices
export const POSE_LANDMARKS = {
  NOSE: 0,
  LEFT_EYE: 1, RIGHT_EYE: 2,
  LEFT_EAR: 3, RIGHT_EAR: 4,
  LEFT_SHOULDER: 11, RIGHT_SHOULDER: 12,
  LEFT_ELBOW: 13, RIGHT_ELBOW: 14,
  LEFT_WRIST: 15, RIGHT_WRIST: 16,
  LEFT_HIP: 23, RIGHT_HIP: 24,
  LEFT_KNEE: 25, RIGHT_KNEE: 26,
  LEFT_ANKLE: 27, RIGHT_ANKLE: 28,
  LEFT_HEEL: 29, RIGHT_HEEL: 30,
  LEFT_FOOT_INDEX: 31, RIGHT_FOOT_INDEX: 32,
} as const;

// ── Exercise Types ────────────────────────────
export type ExerciseType =
  | "squat"
  | "pushup"
  | "deadlift"
  | "shoulder_press"
  | "lunge"
  | "bicep_curl"
  | "plank";

export interface ExerciseConfig {
  name: string;
  icon: string;
  primaryJoints: string[];
  targetAngle: { min: number; max: number };
  description: string;
}

// ── Joint Angles ──────────────────────────────
export interface JointAngles {
  leftKnee?: number;
  rightKnee?: number;
  leftElbow?: number;
  rightElbow?: number;
  leftHip?: number;
  rightHip?: number;
  leftShoulder?: number;
  rightShoulder?: number;
  backAngle?: number;
  hipAlignment?: number;
}

// ── Form Analysis ─────────────────────────────
export type FormFeedbackType = "good" | "warning" | "error";

export interface FormFeedback {
  type: FormFeedbackType;
  message: string;
  joint?: string;
}

export interface FormAnalysisResult {
  overallScore: number;       // 0-100
  formGrade: "A" | "B" | "C" | "D" | "F";
  feedbacks: FormFeedback[];
  jointAngles: JointAngles;
  injuryRisk: "low" | "medium" | "high";
  injuryRiskScore: number;    // 0-100
}

// ── Rep Counter ───────────────────────────────
export type RepPhase = "up" | "down" | "neutral";

export interface RepState {
  count: number;
  phase: RepPhase;
  isInMotion: boolean;
  currentAngle: number;
  lastRepQuality: number;   // 0-100 score for last rep
  totalReps: number;
  goodReps: number;
  badReps: number;
}

// ── Session Tracking ──────────────────────────
export interface WorkoutSet {
  exercise: ExerciseType;
  reps: number;
  formScore: number;
  duration_seconds: number;
  timestamp: string;
}

export interface CVSession {
  id: string;
  exercise: ExerciseType;
  sets: WorkoutSet[];
  totalReps: number;
  avgFormScore: number;
  injuryWarnings: string[];
  startTime: string;
  endTime?: string;
  isActive: boolean;
}

// ── Transformation Simulator ──────────────────
export interface TransformationInput {
  currentWeight: number;
  targetWeight: number;
  bodyFatPercentage: number;
  targetBodyFat: number;
  weeklyWorkouts: number;
  dailyCalories: number;
  goal: "cut" | "bulk" | "recomp";
  timelineWeeks: number;
}

export interface TransformationMilestone {
  week: number;
  predictedWeight: number;
  predictedBodyFat: number;
  muscleMass: number;
  fatMass: number;
  event?: string;
}

export interface TransformationPrediction {
  milestones: TransformationMilestone[];
  estimatedCompletion: string;
  successProbability: number;
  weeklyWeightChange: number;
  caloriesToBurn: number;
  insights: string[];
}

// ── ML Analytics ──────────────────────────────
export interface FitnessScore {
  category: string;
  score: number;
  trend: "up" | "down" | "stable";
  lastWeek: number;
}

export interface InjuryRiskData {
  bodyPart: string;
  riskLevel: number;
  confidence: number;
  recommendation: string;
}

export interface MLDashboardData {
  fitnessScores: FitnessScore[];
  injuryRisks: InjuryRiskData[];
  weeklyFormTrend: { week: string; score: number }[];
  repAccuracy: number;
  totalCVSessions: number;
  streakDays: number;
}
