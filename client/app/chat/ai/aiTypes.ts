export type ChatTone =
  | "playful"
  | "flirty"
  | "casual"
  | "serious"
  | "unknown";

export type MessageIntent =
  | "question"
  | "compliment"
  | "tease"
  | "planning"
  | "statement";

export type AiAnalysis = {
  tone: ChatTone;
  intent: MessageIntent;
  confidence: number; // 0 → 1
};
