// ─────────────────────────────────────────────
//  HYPERFITNESS — Phase 2 AI Type Definitions
// ─────────────────────────────────────────────

// ── Workout Generator ─────────────────────────
export type FitnessGoal =
  | "weight_loss"
  | "muscle_gain"
  | "strength"
  | "endurance"
  | "flexibility"
  | "general_fitness";

export type BodyType = "ectomorph" | "mesomorph" | "endomorph";
export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type TrainingStyle = "hypertrophy" | "strength" | "circuit" | "hiit" | "functional";
export type Equipment = "full_gym" | "dumbbells_only" | "bodyweight" | "home_gym" | "resistance_bands";

export interface WorkoutGeneratorInput {
  goal: FitnessGoal;
  body_type: BodyType;
  experience_level: ExperienceLevel;
  frequency_per_week: number;
  equipment: Equipment;
  injuries?: string;
  training_style: TrainingStyle;
  session_duration_minutes: number;
}

export interface AIExercise {
  name: string;
  muscle_group: string;
  sets: number;
  reps: string; // e.g. "8-12" or "10"
  rest_seconds: number;
  notes?: string;
  equipment?: string;
}

export interface AIWorkoutDay {
  day: string; // e.g. "Monday"
  focus: string; // e.g. "Chest & Triceps"
  exercises: AIExercise[];
  estimated_duration: number; // minutes
  warm_up: string;
  cool_down: string;
}

export interface AIWorkoutPlan {
  id?: string;
  title: string;
  description: string;
  goal: FitnessGoal;
  difficulty: ExperienceLevel;
  duration_weeks: number;
  days_per_week: number;
  schedule: AIWorkoutDay[];
  progression_notes: string;
  recovery_tips: string[];
  generated_at?: string;
}

// ── Diet Planner ──────────────────────────────
export type DietaryPreference =
  | "omnivore"
  | "vegetarian"
  | "vegan"
  | "eggetarian"
  | "keto"
  | "paleo";

export interface DietPlannerInput {
  weight_kg: number;
  height_cm: number;
  age: number;
  gender: "male" | "female";
  goal: FitnessGoal;
  activity_level: "sedentary" | "light" | "moderate" | "active" | "very_active";
  dietary_preference: DietaryPreference;
  budget: "low" | "medium" | "high";
  region: "north_india" | "south_india" | "west_india" | "east_india" | "international";
  allergies?: string;
}

export interface AIMeal {
  name: string;
  time: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  ingredients: string[];
  preparation: string;
  portion_size: string;
}

export interface AIDietDay {
  day: string;
  meals: AIMeal[];
  total_calories: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  water_ml: number;
}

export interface AIDietPlan {
  id?: string;
  title: string;
  description: string;
  daily_calorie_target: number;
  protein_target_g: number;
  carbs_target_g: number;
  fat_target_g: number;
  water_target_ml: number;
  weekly_plan: AIDietDay[];
  supplement_recommendations: string[];
  general_tips: string[];
  foods_to_avoid: string[];
  generated_at?: string;
}

// ── AI Chat ───────────────────────────────────
export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  created_at: string;
  updated_at: string;
}

// ── AI Insights ───────────────────────────────
export interface AIInsight {
  id: string;
  type: "warning" | "success" | "recommendation" | "prediction";
  title: string;
  description: string;
  metric?: string;
  value?: number;
  change?: number;
  action?: string;
  confidence?: number; // 0-100
}

export interface GoalPrediction {
  goal: string;
  target_date: string;
  confidence_percentage: number;
  current_progress: number;
  predicted_completion: string;
  consistency_score: number;
  weekly_sessions_needed: number;
  estimated_calories_per_day: number;
  milestones: { week: number; target: string }[];
}

export interface SmartRecommendation {
  id: string;
  category: "workout" | "diet" | "recovery" | "membership" | "goal";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  based_on: string;
  action_label?: string;
  action_href?: string;
}

// ── API Responses ─────────────────────────────
export interface AIApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  model?: string;
  tokens_used?: number;
}
