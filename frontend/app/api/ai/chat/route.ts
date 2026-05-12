import { NextRequest, NextResponse } from "next/server";
import { SYSTEM_PROMPTS, buildChatContext } from "@/lib/ai-prompts";
import { streamGeminiToResponse } from "@/lib/gemini";
import type { GeminiMessage } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { messages, userProfile } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ success: false, error: "Messages are required" }, { status: 400 });
    }

    const systemPrompt =
      SYSTEM_PROMPTS.FITNESS_ASSISTANT + buildChatContext(userProfile);

    const geminiMessages: GeminiMessage[] = messages.map(
      (m: { role: string; content: string }) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })
    );

    // Get streaming response from Gemini (with model fallback)
    const geminiRes = await streamGeminiToResponse(geminiMessages, systemPrompt);

    // Proxy the SSE stream back to the client
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = geminiRes.body!.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

            for (const line of lines) {
              try {
                const jsonStr = line.replace("data: ", "").trim();
                if (!jsonStr || jsonStr === "[DONE]") continue;
                const parsed = JSON.parse(jsonStr);
                const text = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
                }
              } catch {
                // Skip malformed chunks
              }
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (err) {
          controller.error(err);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("[AI Chat]", error);
    const message = error instanceof Error ? error.message : "Chat service error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
