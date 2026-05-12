import { NextResponse } from "next/server";

export async function GET() {
  const key = process.env.GEMINI_API_KEY;

  if (!key || key === "your_gemini_api_key_here") {
    return NextResponse.json({ error: "No API key configured" }, { status: 400 });
  }

  // List all available models for this API key
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
    );
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({
        status: res.status,
        error: data?.error?.message || "API error",
        hint: "The Generative Language API may not be enabled for this project",
        fix: "Go to https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com and enable it",
      });
    }

    const models = (data.models || []).map((m: { name: string; supportedGenerationMethods?: string[] }) => ({
      name: m.name,
      methods: m.supportedGenerationMethods,
    }));

    return NextResponse.json({ key_prefix: key.slice(0, 10) + "...", models });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
