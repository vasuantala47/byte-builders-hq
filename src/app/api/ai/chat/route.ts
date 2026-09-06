import { NextRequest, NextResponse } from "next/server";
import { askGeminiApi } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, history, apiKey } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const reply = await askGeminiApi(prompt, history || [], apiKey);
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Error in /api/ai/chat:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process AI request" },
      { status: 500 }
    );
  }
}
