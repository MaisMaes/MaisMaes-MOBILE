export type ChatMessageType = "TEXT" | "AUDIO" | "FILE";

export interface ChatMessage {
  sender: string;
  content: string;
  type: ChatMessageType;
  timestamp: string;
  groupId: number;
}
