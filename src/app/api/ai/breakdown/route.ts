import { NextRequest, NextResponse } from "next/server";
import { askGeminiApi } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { taskTitle, taskDescription, type = "task_breakdown", apiKey } = body;

    let prompt = "";
    if (type === "task_breakdown") {
      prompt = `Given the hardware hackathon engineering task titled "${taskTitle}" with details: "${taskDescription}", break it down into 4 to 6 concise, concrete hardware/firmware execution checklist items. 
Return ONLY a JSON array of strings, e.g.:
["Step 1: Check pinout compatibility in datasheet", "Step 2: Solder bypass capacitor on 3.3V rail", "Step 3: Flash test firmware with debug baud rate 115200"]`;
    } else if (type === "experiment_hypothesis") {
      prompt = `For a hardware test on "${taskTitle}", generate:
1. Clear Hypothesis (scientific statement)
2. Benchtop Setup Recommendation
3. Expected vs Failure Condition
Keep it concise and formatted for an engineering test log.`;
    } else if (type === "idea_review") {
      prompt = `Review this hardware hackathon idea: "${taskTitle}". Details: "${taskDescription}".
Highlight:
1. Top Technical Advantage
2. Biggest Risk / Failure Point
3. Recommended Component or Architecture Fix`;
    } else {
      prompt = `Provide an actionable hardware engineering recommendation for: "${taskTitle}"`;
    }

    const reply = await askGeminiApi(prompt, [], apiKey);
    return NextResponse.json({ result: reply });
  } catch (error: any) {
    console.error("Error in /api/ai/breakdown:", error);
    return NextResponse.json(
      { error: error.message || "Failed to decompose task" },
      { status: 500 }
    );
  }
}
