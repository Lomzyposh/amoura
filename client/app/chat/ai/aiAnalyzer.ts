import { AiAnalysis } from "./aiTypes";

/**
 * ⚠️ NO API CALLS YET
 * Lightweight heuristic analysis
 */
export function analyzeMessage(text: string): AiAnalysis {
  const lower = text.toLowerCase();

  let tone: AiAnalysis["tone"] = "unknown";
  let intent: AiAnalysis["intent"] = "statement";

  if (lower.includes("?")) intent = "question";
  if (lower.includes("love") || lower.includes("like")) intent = "compliment";
  if (lower.includes("😂") || lower.includes("😏")) tone = "playful";
  if (lower.includes("hey") || lower.includes("hi")) tone = "casual";
  if (lower.includes("miss") || lower.includes("cute")) tone = "flirty";

  return {
    tone,
    intent,
    confidence: 0.65,
  };
}
