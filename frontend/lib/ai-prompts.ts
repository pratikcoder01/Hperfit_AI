// ─────────────────────────────────────────────
//  HyperFitness AI — Centralized Prompt Library
//  Production-grade, structured prompts
// ─────────────────────────────────────────────

import type {
  WorkoutGeneratorInput,
  DietPlannerInput,
  FitnessGoal,
} from "@/types/ai";

// ── System Prompts ────────────────────────────
export const SYSTEM_PROMPTS = {
  FITNESS_ASSISTANT: `You are HyperAI, an elite AI fitness coach and nutrition expert integrated into the HyperFitness platform.

You specialize in:
- Personalized workout programming and exercise science
- Evidence-based nutrition and meal planning  
- Recovery protocols and injury prevention
- Fitness goal setting and progress tracking
- Indian food culture and regional dietary preferences

Personality: Professional, motivating, data-driven, and empathetic.
Tone: Confident yet approachable. Use fitness terminology accurately.
Format: Use markdown formatting with bullet points, bold text, and clear structure.
Response Length: Concise but complete. Use bullet points for lists.

IMPORTANT RULES:
- Always prioritize safety. Never recommend extreme protocols.
- Cite scientific basis when applicable.
- Tailor advice to Indian context when relevant (food, climate, culture).
- Never diagnose medical conditions. Always recommend doctors for medical issues.
- Keep responses actionable and specific.`,

  WORKOUT_GENERATOR: `You are an expert fitness coach and workout programmer. Generate structured, scientifically-based workout plans.
Always respond with valid JSON only. No markdown, no explanation outside JSON.`,

  DIET_PLANNER: `You are an expert sports nutritionist and dietitian specializing in Indian cuisine and fitness nutrition.
Always respond with valid JSON only. No markdown, no explanation outside JSON.`,
};

// ── Workout Generator Prompt ──────────────────
export function buildWorkoutPrompt(input: WorkoutGeneratorInput): string {
  const goalDescriptions: Record<FitnessGoal, string> = {
    weight_loss: "lose body fat while preserving muscle mass",
    muscle_gain: "build muscle mass and increase hypertrophy",
    strength: "maximize strength gains in compound lifts",
    endurance: "improve cardiovascular and muscular endurance",
    flexibility: "increase flexibility, mobility and movement quality",
    general_fitness: "improve overall health, fitness and body composition",
  };

  return `Generate a complete ${input.frequency_per_week}-day per week workout plan for someone who wants to ${goalDescriptions[input.goal]}.

User Profile:
- Goal: ${input.goal}
- Body Type: ${input.body_type}
- Experience Level: ${input.experience_level}
- Training Frequency: ${input.frequency_per_week} days/week
- Equipment Available: ${input.equipment}
- Training Style: ${input.training_style}
- Session Duration: ${input.session_duration_minutes} minutes
- Injuries/Limitations: ${input.injuries || "None"}

Generate a complete workout plan. IMPORTANT: Max 5 exercises per day. Keep warm_up and cool_down under 10 words each. Return ONLY this JSON structure:
{
  "title": "Plan name",
  "description": "One sentence overview",
  "goal": "${input.goal}",
  "difficulty": "${input.experience_level}",
  "duration_weeks": 8,
  "days_per_week": ${input.frequency_per_week},
  "schedule": [
    {
      "day": "Monday",
      "focus": "Muscle group",
      "estimated_duration": ${input.session_duration_minutes},
      "warm_up": "5 min cardio",
      "cool_down": "5 min stretch",
      "exercises": [
        {
          "name": "Exercise name",
          "muscle_group": "muscle",
          "sets": 4,
          "reps": "8-12",
          "rest_seconds": 90,
          "notes": "Key tip",
          "equipment": "equipment"
        }
      ]
    }
  ],
  "progression_notes": "One sentence progression tip",
  "recovery_tips": ["tip1", "tip2"]
}`;
}

// ── Diet Planner Prompt ───────────────────────
export function buildDietPrompt(input: DietPlannerInput): string {
  const regionMap: Record<string, string> = {
    north_india: "North Indian",
    south_india: "South Indian",
    west_india: "West Indian (Maharashtrian/Gujarati)",
    east_india: "East Indian (Bengali/Odia)",
    international: "International",
  };

  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const bmr =
    input.gender === "male"
      ? 88.36 + 13.4 * input.weight_kg + 4.8 * input.height_cm - 5.7 * input.age
      : 447.6 + 9.2 * input.weight_kg + 3.1 * input.height_cm - 4.3 * input.age;

  const tdee = Math.round(bmr * activityMultipliers[input.activity_level]);
  const targetCalories =
    input.goal === "weight_loss"
      ? tdee - 500
      : input.goal === "muscle_gain"
      ? tdee + 300
      : tdee;

  return `Create a 7-day personalized meal plan for an Indian fitness enthusiast.

User Profile:
- Weight: ${input.weight_kg}kg, Height: ${input.height_cm}cm, Age: ${input.age}, Gender: ${input.gender}
- Goal: ${input.goal}
- Activity Level: ${input.activity_level}
- Dietary Preference: ${input.dietary_preference}
- Region: ${regionMap[input.region]} cuisine preference
- Budget: ${input.budget}
- Allergies: ${input.allergies || "None"}
- Calculated TDEE: ${tdee} kcal
- Target Calories: ${targetCalories} kcal/day

Generate a 3-day meal plan (Mon/Wed/Fri pattern). Keep ingredients list to max 4 items, preparation under 15 words. Return ONLY this JSON:
{
  "title": "Plan name",
  "description": "One sentence overview",
  "daily_calorie_target": ${targetCalories},
  "protein_target_g": ${Math.round((targetCalories * 0.30) / 4)},
  "carbs_target_g": ${Math.round((targetCalories * 0.40) / 4)},
  "fat_target_g": ${Math.round((targetCalories * 0.30) / 9)},
  "water_target_ml": ${input.weight_kg * 35},
  "weekly_plan": [
    {
      "day": "Monday",
      "meals": [
        {
          "name": "Meal name",
          "time": "7:00 AM",
          "calories": 400,
          "protein_g": 25,
          "carbs_g": 45,
          "fat_g": 10,
          "ingredients": ["item1", "item2", "item3"],
          "preparation": "Brief prep method",
          "portion_size": "serving size"
        }
      ],
      "total_calories": ${targetCalories},
      "total_protein_g": ${Math.round((targetCalories * 0.30) / 4)},
      "total_carbs_g": ${Math.round((targetCalories * 0.40) / 4)},
      "total_fat_g": ${Math.round((targetCalories * 0.30) / 9)},
      "water_ml": ${input.weight_kg * 35}
    }
  ],
  "supplement_recommendations": ["supp1", "supp2"],
  "general_tips": ["tip1", "tip2"],
  "foods_to_avoid": ["food1", "food2"]
}`;
}

// ── Chat Context Builder ──────────────────────
export function buildChatContext(userProfile?: {
  name: string;
  goal?: string;
  weight?: number;
  experience?: string;
}): string {
  if (!userProfile) return "";

  return `
Current User Context:
- Name: ${userProfile.name}
- Primary Goal: ${userProfile.goal || "General Fitness"}
- Experience Level: ${userProfile.experience || "Not specified"}
- Weight: ${userProfile.weight ? `${userProfile.weight}kg` : "Not specified"}

Personalize responses based on this profile.`;
}

// ── Insights Prompt ───────────────────────────
export function buildInsightsPrompt(data: {
  attendance_rate: number;
  workout_streak: number;
  weight_change: number;
  goal: string;
}): string {
  return `Based on this fitness data, generate 4 personalized AI insights:
- Attendance rate this month: ${data.attendance_rate}%
- Current workout streak: ${data.workout_streak} days
- Weight change: ${data.weight_change > 0 ? "+" : ""}${data.weight_change}kg
- Primary goal: ${data.goal}

Return JSON array:
[
  {
    "type": "warning|success|recommendation|prediction",
    "title": "Short title",
    "description": "2 sentence insight",
    "action": "Actionable step"
  }
]`;
}
