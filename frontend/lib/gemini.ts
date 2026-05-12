// ─────────────────────────────────────────────
//  HyperFitness AI — Gemini API Client
//  Free-tier fallback chain: tries models in order
// ─────────────────────────────────────────────

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BASE = "https://generativelanguage.googleapis.com";

// Models tried in order — confirmed available from ListModels API
const FREE_MODELS = [
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash",
  "gemini-2.5-flash",
  "gemini-flash-latest",
];

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

interface GeminiRequestBody {
  contents: GeminiMessage[];
  systemInstruction?: { parts: { text: string }[] };
  generationConfig?: {
    temperature?: number;
    topK?: number;
    topP?: number;
    maxOutputTokens?: number;
  };
}

// ── Try a single model ────────────────────────
async function tryModel(
  model: string,
  body: GeminiRequestBody
): Promise<string> {
  const url = `${BASE}/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(
      `${response.status}: ${err?.error?.message || response.statusText}`
    );
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response");
  return text;
}

// ── Core Gemini Call (with fallback) ──────────
export async function callGemini(
  messages: GeminiMessage[],
  systemInstruction?: string,
  options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key_here") {
    throw new Error(
      "GEMINI_API_KEY is not configured. Add it to frontend/.env.local and restart the server."
    );
  }

  const body: GeminiRequestBody = {
    contents: messages,
    generationConfig: {
      temperature: options?.temperature ?? 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: options?.maxTokens ?? 4096,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const errors: string[] = [];

  for (const model of FREE_MODELS) {
    try {
      const text = await tryModel(model, body);
      console.log(`[Gemini] Using model: ${model}`);
      return text;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      errors.push(`${model}: ${msg}`);
      // Only continue to next model on 404 or 429 (quota)
      if (!msg.startsWith("404") && !msg.startsWith("429") && !msg.includes("not found")) {
        break;
      }
    }
  }

  throw new Error(
    `All Gemini models failed. Please generate a NEW API key from https://aistudio.google.com/app/apikey\n\nDetails: ${errors.join(" | ")}`
  );
}

// ── JSON-safe Gemini Call ─────────────────────
export async function callGeminiJSON<T>(
  messages: GeminiMessage[],
  systemInstruction?: string
): Promise<T> {
  const rawText = await callGemini(messages, systemInstruction, {
    temperature: 0.4,
    maxTokens: 8192, // Large enough for workout/diet JSON
  });

  let cleaned = rawText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  // Repair truncated JSON by closing open brackets/braces
  if (!cleaned.endsWith("}") && !cleaned.endsWith("]")) {
    // Remove last incomplete key-value pair
    cleaned = cleaned.replace(/,?\s*"[^"]*":\s*[^,\n}\]]*$/, "");
    // Close any open arrays
    const openArr = (cleaned.match(/\[/g) || []).length;
    const closeArr = (cleaned.match(/\]/g) || []).length;
    for (let i = 0; i < openArr - closeArr; i++) cleaned += "]";
    // Close any open objects
    const openObj = (cleaned.match(/\{/g) || []).length;
    const closeObj = (cleaned.match(/\}/g) || []).length;
    for (let i = 0; i < openObj - closeObj; i++) cleaned += "}";
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error(
      "AI response was cut off — the plan is too large. Try fewer days/exercises or try again."
    );
  }
}


// ── Streaming (chat) with fallback ────────────
export async function streamGeminiToResponse(
  messages: GeminiMessage[],
  systemInstruction: string
): Promise<Response> {
  if (!GEMINI_API_KEY || GEMINI_API_KEY === "your_gemini_api_key_here") {
    throw new Error("GEMINI_API_KEY is not configured.");
  }

  const body = JSON.stringify({
    contents: messages,
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: { temperature: 0.8, maxOutputTokens: 2048, topP: 0.95 },
  });

  const errors: string[] = [];

  for (const model of FREE_MODELS) {
    try {
      const url = `${BASE}/v1beta/models/${model}:streamGenerateContent?key=${GEMINI_API_KEY}&alt=sse`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });

      if (res.ok && res.body) {
        console.log(`[Gemini Stream] Using model: ${model}`);
        return res; // Return raw response for caller to stream
      }

      const err = await res.json().catch(() => ({}));
      const msg = `${res.status}: ${err?.error?.message || res.statusText}`;
      errors.push(`${model}: ${msg}`);

      if (!String(res.status).startsWith("4")) break;
    } catch (e) {
      errors.push(`${model}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  throw new Error(
    `Stream failed. Get a new key at https://aistudio.google.com/app/apikey — Details: ${errors.join(" | ")}`
  );
}
