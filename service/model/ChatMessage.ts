export type ChatMessageType = "TEXT" | "AUDIO" | "FILE";

export interface ChatMessage {
  id?: string;
  sender: string;
  content: string;
  type: ChatMessageType;
  timestamp: string;
  groupId: number;
  fileId?: string;
  fileName?: string;
  mimeType?: string;
}
