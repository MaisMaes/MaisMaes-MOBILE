import { ChatMessage } from "./ChatMessage";

export interface HistoricoMensagensResponse {
  mensagens: ChatMessage[];
  proximoCursor: string | null;
  proximaUrl: string | null;
  temMais: boolean;
}
