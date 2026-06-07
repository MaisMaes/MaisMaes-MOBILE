import AppText from "@/components/AppText";
import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import ChatService from "@/service/ChatService";
import TokenService from "@/service/TokenService";
import { ChatMessage } from "@/service/model/ChatMessage";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatPage() {
  const router = useRouter();
  const { groupId } = useLocalSearchParams<{ groupId?: string }>();
  const listaRef = useRef<FlatList<ChatMessage>>(null);

  const grupoIdNumerico = useMemo(() => Number(groupId), [groupId]);

  const [mensagens, setMensagens] = useState<ChatMessage[]>([]);
  const [texto, setTexto] = useState("");
  const [statusConexao, setStatusConexao] = useState("Conectando ao chat...");
  const [meuNome, setMeuNome] = useState("");

  useEffect(() => {
    async function carregarNomeUsuario() {
      try {
        const tokenPayload = await TokenService.decode();
        const nome = tokenPayload?.nome?.trim() ?? "";

        setMeuNome(nome);

        if (nome) {
          console.log("[ChatPage] Usuário logado identificado", nome);
        } else {
          console.warn(
            "[ChatPage] Não foi possível identificar o nome do usuário logado",
          );
        }
      } catch (error) {
        console.error("[ChatPage] Erro ao decodificar token", error);
      }
    }

    carregarNomeUsuario();
  }, []);

  useEffect(() => {
    if (!groupId || Number.isNaN(grupoIdNumerico)) {
      setStatusConexao("Grupo inválido.");
      return;
    }

    if (!meuNome) {
      setStatusConexao("Identificando usuário...");
      return;
    }

    setStatusConexao("Conectando ao chat...");
    ChatService.conectar(
      grupoIdNumerico,
      (mensagem) => {
        setMensagens((prev) => [...prev, mensagem]);
        setStatusConexao("Conectado");
      },
      (message) => setStatusConexao(message),
    );

    return () => {
      ChatService.desconectar();
    };
  }, [groupId, grupoIdNumerico, meuNome]);

  const handleSend = () => {
    const conteudo = texto.trim();

    if (!conteudo || Number.isNaN(grupoIdNumerico) || !meuNome) return;

    const mensagem: ChatMessage = {
      sender: meuNome,
      content: conteudo,
      type: "TEXT",
      timestamp: new Date().toISOString(),
      groupId: grupoIdNumerico,
    };

    ChatService.enviarMensagem(mensagem);
    setTexto("");
  };

  const formatarHorario = (timestamp: string) => {
    const data = new Date(timestamp);
    if (Number.isNaN(data.getTime())) return "--:--";

    return data.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isMine = meuNome.length > 0 && item.sender.trim() === meuNome.trim();
    const senderLabel = isMine ? "Você" : item.sender;

    return (
      <View
        style={[styles.messageRow, isMine ? styles.mineRow : styles.otherRow]}
      >
        <View
          style={[
            styles.messageBubble,
            isMine ? styles.mineBubble : styles.otherBubble,
          ]}
        >
          <AppText
            style={[styles.sender, isMine && styles.mineText]}
            numberOfLines={1}
          >
            {senderLabel}
          </AppText>

          <AppText style={[styles.messageText, isMine && styles.mineText]}>
            {item.content}
          </AppText>

          <AppText style={[styles.timeText, isMine && styles.mineTime]}>
            {formatarHorario(item.timestamp)}
          </AppText>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.branco} />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <AppText style={styles.headerTitle}>Chat do grupo</AppText>
            <AppText style={styles.headerSubtitle} numberOfLines={1}>
              Grupo #{groupId ?? "?"}
            </AppText>
          </View>
        </View>

        <View style={styles.statusBar}>
          <AppText style={styles.statusText}>{statusConexao}</AppText>
        </View>

        <FlatList
          ref={listaRef}
          data={mensagens}
          keyExtractor={(item, index) =>
            `${item.timestamp}-${item.sender}-${index}`
          }
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            listaRef.current?.scrollToEnd({ animated: true })
          }
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <AppText style={styles.emptyTitle}>
                Nenhuma mensagem ainda
              </AppText>
              <AppText style={styles.emptySubtitle}>
                Envie a primeira mensagem para iniciar a conversa.
              </AppText>
            </View>
          }
        />

        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={texto}
            onChangeText={setTexto}
            placeholder="Digite uma mensagem..."
            placeholderTextColor={Colors.cinzaClaro}
            multiline
            editable={Boolean(meuNome)}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              !texto.trim() && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            activeOpacity={0.8}
            disabled={!texto.trim()}
          >
            <Ionicons name="send" size={20} color={Colors.branco} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.roxo,
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: Colors.branco,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.roxo,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: Colors.branco,
    fontSize: GlobalFontSize.subtitle,
    fontFamily: Fonts.bold,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    fontFamily: Fonts.regular,
    marginTop: 2,
  },
  statusBar: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: Colors.azulClaro,
    borderBottomWidth: 1,
    borderBottomColor: "#dcebf7",
  },
  statusText: {
    color: Colors.azulEscuro,
    fontSize: 12,
    fontFamily: Fonts.semiBold,
  },
  messagesList: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#F7F8FB",
  },
  emptyState: {
    flex: 1,
    minHeight: 240,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: Colors.grafite,
    fontSize: GlobalFontSize.subtitle,
    fontFamily: Fonts.bold,
    textAlign: "center",
  },
  emptySubtitle: {
    color: Colors.cinzaClaro,
    fontSize: GlobalFontSize.text,
    fontFamily: Fonts.regular,
    textAlign: "center",
    marginTop: 8,
  },
  messageRow: {
    marginBottom: 12,
    flexDirection: "row",
  },
  mineRow: {
    justifyContent: "flex-end",
  },
  otherRow: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "82%",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
  },
  mineBubble: {
    backgroundColor: Colors.azulEscuro,
    borderColor: Colors.azulEscuro,
    borderBottomRightRadius: 6,
  },
  otherBubble: {
    backgroundColor: Colors.branco,
    borderColor: "#E4E7EC",
    borderBottomLeftRadius: 6,
  },
  sender: {
    color: Colors.grafite,
    fontSize: 13,
    fontFamily: Fonts.bold,
    marginBottom: 4,
    textAlign: "left",
  },
  messageText: {
    color: Colors.grafite,
    fontSize: GlobalFontSize.text,
    fontFamily: Fonts.regular,
    lineHeight: 20,
  },
  timeText: {
    color: Colors.cinzaClaro,
    fontSize: 11,
    fontFamily: Fonts.semiBold,
    marginTop: 8,
    alignSelf: "flex-end",
  },
  mineText: {
    color: Colors.branco,
  },
  mineTime: {
    color: "rgba(255,255,255,0.8)",
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.branco,
    borderTopWidth: 1,
    borderTopColor: "#E4E7EC",
  },
  input: {
    flex: 1,
    minHeight: 50,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#D8DDE6",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginRight: 10,
    fontFamily: Fonts.regular,
    fontSize: GlobalFontSize.text,
    color: Colors.grafite,
    backgroundColor: "#FAFBFD",
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.roxo,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.55,
  },
});
