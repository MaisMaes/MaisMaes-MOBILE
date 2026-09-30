import SockJS from "sockjs-client";
import * as StompLib from "stompjs/lib/stomp";

import api, { BASE_URL } from "../api";

import { ChatMessage } from "./model/ChatMessage";
import { HistoricoMensagensResponse } from "./model/HistoricoMensagensResponse";

type MessageHandler = (message: ChatMessage) => void;

class ChatService {
  private readonly CHAT_URL = BASE_URL + "chat";
  private client: any = null;
  private subscription: any = null;

  async buscarHistorico(
    groupId: number,
    antes?: string,
    quantidade = 30,
  ): Promise<HistoricoMensagensResponse> {
    const response = await api.get<HistoricoMensagensResponse>(
      `chat/grupos/${groupId}/mensagens`,
      {
        params: {
          quantidade,
          ...(antes ? { antes } : {}),
        },
      },
    );

    return response.data;
  }

  async uploadArquivo(
    uri: string,
    nome: string,
    mimeType: string,
  ): Promise<string> {
    const formData = new FormData();
    formData.append("file", {
      uri,
      name: nome,
      type: mimeType,
    } as any);

    const response = await api.post<string>("arquivo/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  }

  urlArquivo(fileId: string): string {
    return `${BASE_URL}arquivo/${fileId}`;
  }

  conectar(
    groupId: number,
    onMessage: MessageHandler,
    onError?: (message: string) => void,
  ) {
    this.desconectar();

    console.log("[ChatService] Iniciando conexão SockJS", {
      url: this.CHAT_URL,
      groupId,
    });

    const socket = new SockJS(this.CHAT_URL);
    socket.onopen = () => {
      console.log("[ChatService] SockJS aberto");
    };
    socket.onerror = (event: any) => {
      console.log("[ChatService] SockJS erro", event);
      onError?.("Falha ao abrir a conexão SockJS.");
    };
    socket.onclose = (event: any) => {
      console.warn("[ChatService] SockJS fechado", event);
    };

    const client = StompLib.Stomp.over(socket);
    client.debug = (message: string) => {
      console.log("[ChatService][STOMP]", message);
    };

    client.connect(
      {},
      () => {
        console.log("[ChatService] STOMP conectado", { groupId });
        this.subscription = client.subscribe(
          `/topic/group/${groupId}`,
          (frame: any) => {
            console.log("[ChatService] Mensagem recebida", frame.body);
            try {
              const message = JSON.parse(frame.body) as ChatMessage;
              onMessage(message);
            } catch {
              console.log(
                "[ChatService] Falha ao processar mensagem recebida",
                frame.body,
              );
              onError?.("Não foi possível processar uma mensagem recebida.");
            }
          },
        );
        console.log(
          "[ChatService] Inscrito no tópico",
          `/topic/group/${groupId}`,
        );
      },
      (error: any) => {
        console.log("[ChatService] Erro STOMP", error);
        onError?.(error?.body ?? "Não foi possível conectar ao chat.");
      },
    );

    this.client = client;
  }

  enviarMensagem(message: ChatMessage) {
    if (!this.client) {
      console.warn(
        "[ChatService] envio ignorado: cliente STOMP inexistente",
        message,
      );
      return;
    }

    console.log("[ChatService] Enviando mensagem", message);

    this.client.send(
      `/app/sendMessage/${message.groupId}`,
      {},
      JSON.stringify(message),
    );
  }

  desconectar() {
    if (this.subscription) {
      console.log("[ChatService] Cancelando inscrição do tópico");
      this.subscription.unsubscribe();
      this.subscription = null;
    }

    if (this.client) {
      console.log("[ChatService] Desconectando cliente STOMP");
      this.client.disconnect(() => {});
      this.client = null;
    }
  }
}

export default new ChatService();
