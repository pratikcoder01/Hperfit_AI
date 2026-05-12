// ─────────────────────────────────────────────
//  HyperFitness Phase 3 — Pose Analysis Engine
//  Joint angle calculation, form scoring, rep counting
// ─────────────────────────────────────────────

import type {
  PoseLandmark, PoseLandmarks, JointAngles,
  FormAnalysisResult, FormFeedback, ExerciseType,
  RepState,
} from "@/types/cv";
import { POSE_LANDMARKS as L } from "@/types/cv";

// ── Geometry Helpers ──────────────────────────
export function calculateAngle(
  a: PoseLandmark,
  b: PoseLandmark, // vertex
  c: PoseLandmark
): number {
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180) / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return Math.round(angle);
}

export function getDistance(a: PoseLandmark, b: PoseLandmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

export function getMidpoint(a: PoseLandmark, b: PoseLandmark): PoseLandmark {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, z: (a.z + b.z) / 2 };
}

// ── Extract All Joint Angles ──────────────────
export function extractJointAngles(lm: PoseLandmarks): JointAngles {
  if (!lm || lm.length < 33) return {};

  return {
    leftKnee: calculateAngle(lm[L.LEFT_HIP], lm[L.LEFT_KNEE], lm[L.LEFT_ANKLE]),
    rightKnee: calculateAngle(lm[L.RIGHT_HIP], lm[L.RIGHT_KNEE], lm[L.RIGHT_ANKLE]),
    leftElbow: calculateAngle(lm[L.LEFT_SHOULDER], lm[L.LEFT_ELBOW], lm[L.LEFT_WRIST]),
    rightElbow: calculateAngle(lm[L.RIGHT_SHOULDER], lm[L.RIGHT_ELBOW], lm[L.RIGHT_WRIST]),
    leftHip: calculateAngle(lm[L.LEFT_SHOULDER], lm[L.LEFT_HIP], lm[L.LEFT_KNEE]),
    rightHip: calculateAngle(lm[L.RIGHT_SHOULDER], lm[L.RIGHT_HIP], lm[L.RIGHT_KNEE]),
    leftShoulder: calculateAngle(lm[L.LEFT_ELBOW], lm[L.LEFT_SHOULDER], lm[L.LEFT_HIP]),
    rightShoulder: calculateAngle(lm[L.RIGHT_ELBOW], lm[L.RIGHT_SHOULDER], lm[L.RIGHT_HIP]),
    backAngle: calculateAngle(
      getMidpoint(lm[L.LEFT_SHOULDER], lm[L.RIGHT_SHOULDER]),
      getMidpoint(lm[L.LEFT_HIP], lm[L.RIGHT_HIP]),
      { x: getMidpoint(lm[L.LEFT_HIP], lm[L.RIGHT_HIP]).x, y: 0, z: 0 }
    ),
  };
}

// ── Exercise-specific Form Analyzers ──────────

function analyzeSquat(angles: JointAngles, lm: PoseLandmarks): FormFeedback[] {
  const feedbacks: FormFeedback[] = [];
  const kneeAngle = Math.min(angles.leftKnee ?? 180, angles.rightKnee ?? 180);
  const hipAngle = Math.min(angles.leftHip ?? 180, angles.rightHip ?? 180);

  // Depth check
  if (kneeAngle > 120) feedbacks.push({ type: "warning", message: "Go deeper — aim for 90° knee bend", joint: "knee" });
  else if (kneeAngle < 60) feedbacks.push({ type: "warning", message: "Parallel is enough — don't go too deep", joint: "knee" });
  else feedbacks.push({ type: "good", message: "Great squat depth!", joint: "knee" });

  // Knee cave check
  if (lm[L.LEFT_KNEE] && lm[L.LEFT_ANKLE]) {
    const kneeCave = lm[L.LEFT_KNEE].x - lm[L.LEFT_ANKLE].x;
    if (Math.abs(kneeCave) > 0.08) feedbacks.push({ type: "error", message: "Knees caving in — push knees out!", joint: "knee" });
  }

  // Back angle
  if ((angles.backAngle ?? 90) < 50) feedbacks.push({ type: "error", message: "Chest up! Keep spine neutral", joint: "back" });
  else if ((angles.backAngle ?? 90) < 70) feedbacks.push({ type: "warning", message: "Slight forward lean — keep chest tall", joint: "back" });

  return feedbacks;
}

function analyzePushup(angles: JointAngles, lm: PoseLandmarks): FormFeedback[] {
  const feedbacks: FormFeedback[] = [];
  const elbowAngle = Math.min(angles.leftElbow ?? 180, angles.rightElbow ?? 180);

  // Elbow depth
  if (elbowAngle > 120) feedbacks.push({ type: "warning", message: "Go lower — touch chest to floor", joint: "elbow" });
  else if (elbowAngle < 60) feedbacks.push({ type: "good", message: "Perfect depth!", joint: "elbow" });

  // Body alignment (hips)
  if (lm[L.LEFT_HIP] && lm[L.LEFT_SHOULDER]) {
    const hipDrop = lm[L.LEFT_HIP].y - lm[L.LEFT_SHOULDER].y;
    if (hipDrop > 0.05) feedbacks.push({ type: "error", message: "Hips sagging — engage your core!", joint: "hip" });
    else if (hipDrop < -0.05) feedbacks.push({ type: "warning", message: "Hips too high — keep body straight", joint: "hip" });
    else feedbacks.push({ type: "good", message: "Great body alignment!", joint: "hip" });
  }

  // Elbow flare
  const elbowFlare = Math.abs((angles.leftShoulder ?? 45) - 45);
  if (elbowFlare > 20) feedbacks.push({ type: "warning", message: "Keep elbows at 45° from body", joint: "shoulder" });

  return feedbacks;
}

function analyzeDeadlift(angles: JointAngles): FormFeedback[] {
  const feedbacks: FormFeedback[] = [];

  // Back neutrality
  if ((angles.backAngle ?? 90) < 40) feedbacks.push({ type: "error", message: "DANGER: Rounded back — stop immediately!", joint: "back" });
  else if ((angles.backAngle ?? 90) < 60) feedbacks.push({ type: "warning", message: "Keep spine neutral — slightly too rounded", joint: "back" });
  else feedbacks.push({ type: "good", message: "Good back position!", joint: "back" });

  // Hip hinge
  const hipAngle = Math.min(angles.leftHip ?? 180, angles.rightHip ?? 180);
  if (hipAngle > 150) feedbacks.push({ type: "warning", message: "Hinge more at the hips", joint: "hip" });

  // Knee angle
  const kneeAngle = Math.min(angles.leftKnee ?? 180, angles.rightKnee ?? 180);
  if (kneeAngle < 130) feedbacks.push({ type: "warning", message: "Don't squat too deep — this is a hinge pattern", joint: "knee" });

  return feedbacks;
}

function analyzeLunge(angles: JointAngles): FormFeedback[] {
  const feedbacks: FormFeedback[] = [];
  const frontKnee = Math.min(angles.leftKnee ?? 180, angles.rightKnee ?? 180);

  if (frontKnee > 110) feedbacks.push({ type: "warning", message: "Step forward more — deeper lunge needed", joint: "knee" });
  else if (frontKnee < 80) feedbacks.push({ type: "good", message: "Perfect lunge depth!", joint: "knee" });

  if ((angles.backAngle ?? 90) < 70) feedbacks.push({ type: "warning", message: "Torso upright — don't lean forward", joint: "back" });

  return feedbacks;
}

function analyzeShoulderPress(angles: JointAngles): FormFeedback[] {
  const feedbacks: FormFeedback[] = [];
  const elbowAngle = Math.max(angles.leftElbow ?? 0, angles.rightElbow ?? 0);

  if (elbowAngle < 140) feedbacks.push({ type: "warning", message: "Extend arms fully at the top", joint: "elbow" });
  else feedbacks.push({ type: "good", message: "Good extension!", joint: "elbow" });

  if ((angles.backAngle ?? 90) < 70) feedbacks.push({ type: "warning", message: "Don't lean back — keep core tight", joint: "back" });

  return feedbacks;
}

// ── Main Form Analyzer ────────────────────────
export function analyzeForm(
  exercise: ExerciseType,
  lm: PoseLandmarks
): FormAnalysisResult {
  const angles = extractJointAngles(lm);
  let feedbacks: FormFeedback[] = [];

  switch (exercise) {
    case "squat": feedbacks = analyzeSquat(angles, lm); break;
    case "pushup": feedbacks = analyzePushup(angles, lm); break;
    case "deadlift": feedbacks = analyzeDeadlift(angles); break;
    case "lunge": feedbacks = analyzeLunge(angles); break;
    case "shoulder_press": feedbacks = analyzeShoulderPress(angles); break;
    default: feedbacks = [{ type: "good", message: "Tracking active", joint: "body" }];
  }

  // Score calculation
  const errorCount = feedbacks.filter(f => f.type === "error").length;
  const warningCount = feedbacks.filter(f => f.type === "warning").length;
  const goodCount = feedbacks.filter(f => f.type === "good").length;
  const total = feedbacks.length || 1;

  const overallScore = Math.max(0, Math.round(
    (goodCount / total) * 100 - errorCount * 25 - warningCount * 10
  ));

  const formGrade =
    overallScore >= 90 ? "A"
    : overallScore >= 75 ? "B"
    : overallScore >= 60 ? "C"
    : overallScore >= 50 ? "D"
    : "F";

  const injuryRiskScore = Math.min(100, errorCount * 35 + warningCount * 15);
  const injuryRisk =
    injuryRiskScore >= 60 ? "high"
    : injuryRiskScore >= 30 ? "medium"
    : "low";

  return { overallScore, formGrade, feedbacks, jointAngles: angles, injuryRisk, injuryRiskScore };
}

// ── Rep Counter Engine ────────────────────────
export function getRepAngle(exercise: ExerciseType, angles: JointAngles): number {
  switch (exercise) {
    case "squat": return Math.min(angles.leftKnee ?? 180, angles.rightKnee ?? 180);
    case "pushup": return Math.min(angles.leftElbow ?? 180, angles.rightElbow ?? 180);
    case "deadlift": return Math.min(angles.leftHip ?? 180, angles.rightHip ?? 180);
    case "lunge": return Math.min(angles.leftKnee ?? 180, angles.rightKnee ?? 180);
    case "shoulder_press": return Math.max(angles.leftElbow ?? 0, angles.rightElbow ?? 0);
    case "bicep_curl": return Math.min(angles.leftElbow ?? 180, angles.rightElbow ?? 180);
    default: return Math.min(angles.leftKnee ?? 180, angles.rightKnee ?? 180);
  }
}

// Thresholds for each exercise [down_threshold, up_threshold]
const REP_THRESHOLDS: Record<ExerciseType, [number, number]> = {
  squat: [95, 160],
  pushup: [90, 160],
  deadlift: [110, 160],
  shoulder_press: [90, 160],
  lunge: [95, 160],
  bicep_curl: [50, 140],
  plank: [160, 180],
};

export function updateRepCounter(
  prevState: RepState,
  exercise: ExerciseType,
  angles: JointAngles,
  formScore: number
): RepState {
  const angle = getRepAngle(exercise, angles);
  const [downThresh, upThresh] = REP_THRESHOLDS[exercise];
  let { count, phase, goodReps, badReps } = prevState;

  let newPhase = phase;

  if (angle <= downThresh && phase !== "down") {
    newPhase = "down";
  } else if (angle >= upThresh && phase === "down") {
    newPhase = "up";
    count += 1;
    if (formScore >= 70) goodReps += 1;
    else badReps += 1;
  }

  return {
    ...prevState,
    count,
    phase: newPhase,
    currentAngle: angle,
    isInMotion: Math.abs(angle - prevState.currentAngle) > 3,
    lastRepQuality: newPhase === "up" ? formScore : prevState.lastRepQuality,
    totalReps: count,
    goodReps,
    badReps,
  };
}

// ── Skeleton Connection Pairs ─────────────────
export const SKELETON_CONNECTIONS: [number, number][] = [
  [L.LEFT_SHOULDER, L.RIGHT_SHOULDER],
  [L.LEFT_SHOULDER, L.LEFT_ELBOW],
  [L.LEFT_ELBOW, L.LEFT_WRIST],
  [L.RIGHT_SHOULDER, L.RIGHT_ELBOW],
  [L.RIGHT_ELBOW, L.RIGHT_WRIST],
  [L.LEFT_SHOULDER, L.LEFT_HIP],
  [L.RIGHT_SHOULDER, L.RIGHT_HIP],
  [L.LEFT_HIP, L.RIGHT_HIP],
  [L.LEFT_HIP, L.LEFT_KNEE],
  [L.LEFT_KNEE, L.LEFT_ANKLE],
  [L.RIGHT_HIP, L.RIGHT_KNEE],
  [L.RIGHT_KNEE, L.RIGHT_ANKLE],
  [L.LEFT_ANKLE, L.LEFT_HEEL],
  [L.RIGHT_ANKLE, L.RIGHT_HEEL],
];

// ── Canvas Drawing ────────────────────────────
export function drawSkeleton(
  ctx: CanvasRenderingContext2D,
  landmarks: PoseLandmarks,
  width: number,
  height: number,
  accentColor = "#00F5D4"
) {
  ctx.clearRect(0, 0, width, height);

  // Draw connections
  ctx.lineWidth = 3;
  ctx.lineCap = "round";

  for (const [i, j] of SKELETON_CONNECTIONS) {
    const a = landmarks[i];
    const b = landmarks[j];
    if (!a || !b || (a.visibility ?? 1) < 0.3 || (b.visibility ?? 1) < 0.3) continue;

    const gradient = ctx.createLinearGradient(a.x * width, a.y * height, b.x * width, b.y * height);
    gradient.addColorStop(0, `${accentColor}CC`);
    gradient.addColorStop(1, `${accentColor}66`);
    ctx.strokeStyle = gradient;

    ctx.beginPath();
    ctx.moveTo(a.x * width, a.y * height);
    ctx.lineTo(b.x * width, b.y * height);
    ctx.stroke();
  }

  // Draw joint dots
  const keyJoints = [
    L.LEFT_SHOULDER, L.RIGHT_SHOULDER,
    L.LEFT_ELBOW, L.RIGHT_ELBOW,
    L.LEFT_WRIST, L.RIGHT_WRIST,
    L.LEFT_HIP, L.RIGHT_HIP,
    L.LEFT_KNEE, L.RIGHT_KNEE,
    L.LEFT_ANKLE, L.RIGHT_ANKLE,
  ];

  for (const idx of keyJoints) {
    const lm = landmarks[idx];
    if (!lm || (lm.visibility ?? 1) < 0.3) continue;

    ctx.beginPath();
    ctx.arc(lm.x * width, lm.y * height, 6, 0, 2 * Math.PI);
    ctx.fillStyle = accentColor;
    ctx.fill();
    ctx.strokeStyle = "#0B0F19";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
