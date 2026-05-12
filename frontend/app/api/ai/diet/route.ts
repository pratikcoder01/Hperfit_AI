import { NextRequest, NextResponse } from "next/server";
import { callGeminiJSON } from "@/lib/gemini";
import { SYSTEM_PROMPTS, buildDietPrompt } from "@/lib/ai-prompts";
import type { DietPlannerInput, AIDietPlan } from "@/types/ai";

export async function POST(req: NextRequest) {
  try {
    const input: DietPlannerInput = await req.json();

    if (!input.weight_kg || !input.height_cm || !input.goal || !input.dietary_preference) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const prompt = buildDietPrompt(input);

    const plan = await callGeminiJSON<AIDietPlan>(
      [{ role: "user", parts: [{ text: prompt }] }],
      SYSTEM_PROMPTS.DIET_PLANNER
    );

    plan.generated_at = new Date().toISOString();
    plan.id = `dp_${Date.now()}`;

    return NextResponse.json({ success: true, data: plan });
  } catch (error) {
    console.error("[AI Diet]", error);
    const message = error instanceof Error ? error.message : "Failed to generate diet plan";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
