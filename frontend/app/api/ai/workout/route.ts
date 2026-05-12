import { NextRequest, NextResponse } from "next/server";
import { callGeminiJSON } from "@/lib/gemini";
import { SYSTEM_PROMPTS, buildWorkoutPrompt } from "@/lib/ai-prompts";
import type { WorkoutGeneratorInput, AIWorkoutPlan } from "@/types/ai";

export async function POST(req: NextRequest) {
  try {
    const input: WorkoutGeneratorInput = await req.json();

    // Validate required fields
    if (!input.goal || !input.experience_level || !input.frequency_per_week) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: goal, experience_level, frequency_per_week" },
        { status: 400 }
      );
    }

    const prompt = buildWorkoutPrompt(input);

    const plan = await callGeminiJSON<AIWorkoutPlan>(
      [{ role: "user", parts: [{ text: prompt }] }],
      SYSTEM_PROMPTS.WORKOUT_GENERATOR
    );

    // Attach metadata
    plan.generated_at = new Date().toISOString();
    plan.id = `wp_${Date.now()}`;

    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    console.error("[AI Workout]", error);
    const message = error instanceof Error ? error.message : "Failed to generate workout plan";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
