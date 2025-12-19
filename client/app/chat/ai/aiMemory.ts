import { AiAnalysis } from "./aiTypes";

const memory = new Map<string, AiAnalysis[]>();

export function storeAnalysis(chatId: string, analysis: AiAnalysis) {
  if (!memory.has(chatId)) {
    memory.set(chatId, []);
  }
  memory.get(chatId)?.push(analysis);
}

export function getChatContext(chatId: string) {
  return memory.get(chatId) ?? [];
}
