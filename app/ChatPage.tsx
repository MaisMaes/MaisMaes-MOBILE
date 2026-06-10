import AppText from "@/components/AppText";
import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import ChatService from "@/service/ChatService";
import GrupoTematicoService from "@/service/GrupoTematicoService";
import TokenService from "@/service/TokenService";
import { ChatMessage } from "@/service/model/ChatMessage";
import PopupService from "@/utils/PopupService";
import { Ionicons } from "@expo/vector-icons";
import { Audio, ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Linking,
  ListRenderItemInfo,
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
  const quantidadeHistorico = 30;

  const [mensagens, setMensagens] = useState<ChatMessage[]>([]);
  const [texto, setTexto] = useState("");
  const [statusConexao, setStatusConexao] = useState("Conectando ao chat...");
  const [meuNome, setMeuNome] = useState("");
  const [cursorHistorico, setCursorHistorico] = useState<string | null>(null);
  const [temMaisHistorico, setTemMaisHistorico] = useState(false);
  const [carregandoHistorico, setCarregandoHistorico] = useState(false);
  const [carregandoMaisHistorico, setCarregandoMaisHistorico] = useState(false);
  const deveAutoScrollRef = useRef(false);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const soundRef = useRef<Audio.Sound | null>(null);

  const [permissoesGrupo, setPermissoesGrupo] = useState({
    video: false,
    audio: false,
    imagem: false,
    documento: false,
  });
  const [mostrarPickerOpcoes, setMostrarPickerOpcoes] = useState(false);
  const [enviandoArquivo, setEnviandoArquivo] = useState(false);
  const [gravandoAudio, setGravandoAudio] = useState(false);
  const [audioPlayingId, setAudioPlayingId] = useState<string | null>(null);

  useLayoutEffect(() => {
    if (!deveAutoScrollRef.current || mensagens.length === 0) return;
    deveAutoScrollRef.current = false;
    const id = setTimeout(
      () => listaRef.current?.scrollToEnd({ animated: false }),
      1,
    );
    return () => clearTimeout(id);
  }, [mensagens]);

  const criarMensagemChave = (mensagem: ChatMessage) => {
    if (mensagem.fileId) return `file:${mensagem.fileId}`;
    if (mensagem.id) return mensagem.id;
    return `${mensagem.timestamp}-${mensagem.sender}-${mensagem.content}-${mensagem.groupId}`;
  };

  const mesclarMensagens = (
    mensagensExistentes: ChatMessage[],
    novasMensagens: ChatMessage[],
    direcao: "append" | "prepend" = "append",
  ) => {
    const mensagensCombinadas =
      direcao === "append"
        ? [...mensagensExistentes, ...novasMensagens]
        : [...novasMensagens, ...mensagensExistentes];
    const mensagensUnicas: ChatMessage[] = [];
    const chavesVistas = new Set<string>();

    for (const mensagem of mensagensCombinadas) {
      const chave = criarMensagemChave(mensagem);
      if (chavesVistas.has(chave)) continue;

      chavesVistas.add(chave);
      mensagensUnicas.push(mensagem);
    }

    return mensagensUnicas;
  };

  const carregarHistorico = async (antes?: string, prepend = false) => {
    if (Number.isNaN(grupoIdNumerico)) return;

    if (prepend) {
      setCarregandoMaisHistorico(true);
    } else {
      setCarregandoHistorico(true);
    }

    try {
      const resposta = await ChatService.buscarHistorico(
        grupoIdNumerico,
        antes,
        quantidadeHistorico,
      );

      deveAutoScrollRef.current = !prepend;

      setMensagens((prev) =>
        prepend
          ? mesclarMensagens(prev, resposta.mensagens, "prepend")
          : mesclarMensagens([], resposta.mensagens),
      );
      setCursorHistorico(resposta.proximoCursor);
      setTemMaisHistorico(resposta.temMais);
    } catch (error) {
      PopupService.error("Falha ao carregar histórico.");
      setStatusConexao("Falha ao carregar histórico.");
    } finally {
      if (prepend) {
        setCarregandoMaisHistorico(false);
      } else {
        setCarregandoHistorico(false);
      }
    }
  };

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
        PopupService.error("Erro ao identificar usuário.");
      }
    }

    carregarNomeUsuario();
  }, []);

  useEffect(() => {
    if (Number.isNaN(grupoIdNumerico)) return;

    GrupoTematicoService.buscarDetalhes(grupoIdNumerico)
      .then((grupo) => {
        setPermissoesGrupo({
          video: grupo.video,
          audio: grupo.audio,
          imagem: grupo.imagem,
          documento: grupo.documento,
        });
      })
      .catch((error) => {
        PopupService.error("Erro ao carregar permissões do grupo.");
      });
  }, [grupoIdNumerico]);

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync().catch(() => {});
      recordingRef.current?.stopAndUnloadAsync().catch(() => {});
    };
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

    let ativo = true;

    const iniciarChat = async () => {
      setStatusConexao("Carregando histórico...");
      await carregarHistorico();

      if (!ativo) return;

      setStatusConexao("Conectando ao chat...");
      ChatService.conectar(
        grupoIdNumerico,
        (mensagem) => {
          deveAutoScrollRef.current = true;
          setMensagens((prev) => mesclarMensagens(prev, [mensagem]));
          setStatusConexao("Conectado");
        },
        (message) => setStatusConexao(message),
      );
    };

    iniciarChat();

    return () => {
      ativo = false;
      ChatService.desconectar();
    };
  }, [groupId, grupoIdNumerico, meuNome]);

  const carregarMaisHistorico = async () => {
    if (!temMaisHistorico || carregandoMaisHistorico || !cursorHistorico)
      return;

    await carregarHistorico(cursorHistorico, true);
  };

  const uploadESendArquivo = async (
    uri: string,
    nome: string,
    mimeType: string,
    type: "FILE" | "AUDIO",
  ) => {
    if (!meuNome || Number.isNaN(grupoIdNumerico)) return;
    setEnviandoArquivo(true);
    try {
      const fileId = await ChatService.uploadArquivo(uri, nome, mimeType);
      const mensagem: ChatMessage = {
        sender: meuNome,
        content: nome,
        type,
        timestamp: new Date().toISOString(),
        groupId: grupoIdNumerico,
        fileId,
        fileName: nome,
        mimeType,
      };
      setMensagens((prev) => mesclarMensagens(prev, [mensagem]));
      deveAutoScrollRef.current = true;
      ChatService.enviarMensagem(mensagem);
    } catch (error) {
      PopupService.error("Erro ao enviar arquivo.");
    } finally {
      setEnviandoArquivo(false);
    }
  };

  const pickImagem = async () => {
    setMostrarPickerOpcoes(false);
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images" as any,
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    const nome = asset.fileName ?? `imagem_${Date.now()}.jpg`;
    await uploadESendArquivo(
      asset.uri,
      nome,
      asset.mimeType ?? "image/jpeg",
      "FILE",
    );
  };

  const pickVideo = async () => {
    setMostrarPickerOpcoes(false);
    const result = await DocumentPicker.getDocumentAsync({
      type: "video/*",
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    await uploadESendArquivo(
      asset.uri,
      asset.name,
      asset.mimeType ?? "video/mp4",
      "FILE",
    );
  };

  const pickDocumento = async () => {
    setMostrarPickerOpcoes(false);
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    await uploadESendArquivo(
      asset.uri,
      asset.name,
      asset.mimeType ?? "application/octet-stream",
      "FILE",
    );
  };

  const toggleGravacao = async () => {
    if (gravandoAudio && recordingRef.current) {
      try {
        setGravandoAudio(false);
        await recordingRef.current.stopAndUnloadAsync();
        const uri = recordingRef.current.getURI();
        recordingRef.current = null;
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
        if (uri) {
          await uploadESendArquivo(
            uri,
            `audio_${Date.now()}.m4a`,
            "audio/m4a",
            "AUDIO",
          );
        }
      } catch (error) {
        PopupService.error("Erro ao parar gravação.");
        setGravandoAudio(false);
      }
      return;
    }

    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) return;
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );
      recordingRef.current = recording;
      setGravandoAudio(true);
    } catch (error) {
      PopupService.error("Erro ao iniciar gravação.");
    }
  };

  const playAudio = async (fileId: string) => {
    if (audioPlayingId === fileId) {
      await soundRef.current?.pauseAsync();
      setAudioPlayingId(null);
      return;
    }
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setAudioPlayingId(fileId);
      const url = ChatService.urlArquivo(fileId);
      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true },
      );
      soundRef.current = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setAudioPlayingId(null);
          sound.unloadAsync().catch(() => {});
          soundRef.current = null;
        }
      });
    } catch (error) {
      PopupService.error("Erro ao reproduzir áudio.");
      setAudioPlayingId(null);
    }
  };

  const renderConteudoMensagem = (item: ChatMessage, isMine: boolean) => {
    const textStyle = isMine ? styles.mineText : undefined;

    if (item.type === "AUDIO" && item.fileId) {
      const isPlaying = audioPlayingId === item.fileId;
      return (
        <TouchableOpacity
          style={styles.audioBubble}
          onPress={() => playAudio(item.fileId!)}
          activeOpacity={0.8}
        >
          <Ionicons
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={32}
            color={isMine ? Colors.branco : Colors.roxo}
          />
          <AppText style={[styles.audioLabel, textStyle]}>
            {isPlaying ? "Reproduzindo..." : "Áudio"}
          </AppText>
        </TouchableOpacity>
      );
    }

    if (item.type === "FILE" && item.fileId) {
      const mime = item.mimeType ?? "";
      const url = ChatService.urlArquivo(item.fileId);

      if (mime.startsWith("image/")) {
        return (
          <TouchableOpacity
            onPress={() => Linking.openURL(url)}
            activeOpacity={0.9}
          >
            <Image
              source={{ uri: url }}
              style={styles.imagemMensagem}
              contentFit="cover"
            />
          </TouchableOpacity>
        );
      }

      if (mime.startsWith("video/")) {
        return (
          <Video
            source={{ uri: url }}
            style={styles.videoMensagem}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping={false}
          />
        );
      }

      return (
        <TouchableOpacity
          style={styles.arquivoBubble}
          onPress={() => Linking.openURL(url)}
          activeOpacity={0.8}
        >
          <Ionicons
            name="document-outline"
            size={28}
            color={isMine ? Colors.branco : Colors.azulEscuro}
          />
          <AppText style={[styles.arquivoLabel, textStyle]} numberOfLines={2}>
            {item.fileName ?? item.content}
          </AppText>
        </TouchableOpacity>
      );
    }

    return (
      <AppText style={[styles.messageText, textStyle]}>{item.content}</AppText>
    );
  };

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

  const renderMessage = ({ item }: ListRenderItemInfo<ChatMessage>) => {
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

          {renderConteudoMensagem(item, isMine)}

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
            item.id ?? `${item.timestamp}-${item.sender}-${index}`
          }
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            temMaisHistorico ? (
              <TouchableOpacity
                style={styles.loadMoreButton}
                onPress={carregarMaisHistorico}
                activeOpacity={0.8}
                disabled={carregandoMaisHistorico}
              >
                <AppText style={styles.loadMoreText}>
                  {carregandoMaisHistorico
                    ? "Carregando mensagens antigas..."
                    : "Carregar mensagens antigas"}
                </AppText>
              </TouchableOpacity>
            ) : null
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

        {mostrarPickerOpcoes && (
          <View style={styles.pickerOpcoes}>
            {permissoesGrupo.imagem && (
              <TouchableOpacity
                style={styles.pickerOpcaoItem}
                onPress={pickImagem}
              >
                <View
                  style={[
                    styles.pickerOpcaoIcone,
                    { backgroundColor: "#E8F5E9" },
                  ]}
                >
                  <Ionicons name="image-outline" size={26} color="#2E7D32" />
                </View>
                <AppText style={styles.pickerOpcaoLabel}>Imagem</AppText>
              </TouchableOpacity>
            )}
            {permissoesGrupo.video && (
              <TouchableOpacity
                style={styles.pickerOpcaoItem}
                onPress={pickVideo}
              >
                <View
                  style={[
                    styles.pickerOpcaoIcone,
                    { backgroundColor: "#FFF3E0" },
                  ]}
                >
                  <Ionicons name="videocam-outline" size={26} color="#E65100" />
                </View>
                <AppText style={styles.pickerOpcaoLabel}>Vídeo</AppText>
              </TouchableOpacity>
            )}
            {permissoesGrupo.documento && (
              <TouchableOpacity
                style={styles.pickerOpcaoItem}
                onPress={pickDocumento}
              >
                <View
                  style={[
                    styles.pickerOpcaoIcone,
                    { backgroundColor: "#E3F2FD" },
                  ]}
                >
                  <Ionicons name="document-outline" size={26} color="#1565C0" />
                </View>
                <AppText style={styles.pickerOpcaoLabel}>Documento</AppText>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={styles.inputBar}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={texto}
              onChangeText={(t) => {
                setTexto(t);
                if (t.trim()) setMostrarPickerOpcoes(false);
              }}
              placeholder="Digite uma mensagem..."
              placeholderTextColor={Colors.cinzaClaro}
              multiline
              editable={Boolean(meuNome) && !enviandoArquivo}
            />
            <TouchableOpacity
              style={styles.clipButton}
              onPress={() => setMostrarPickerOpcoes((v) => !v)}
              activeOpacity={0.7}
              disabled={enviandoArquivo}
            >
              <Ionicons
                name="attach-outline"
                size={22}
                color={Colors.cinzaClaro}
              />
            </TouchableOpacity>
          </View>

          {enviandoArquivo ? (
            <View style={styles.sendButton}>
              <ActivityIndicator color={Colors.branco} size="small" />
            </View>
          ) : gravandoAudio ? (
            <TouchableOpacity
              style={[styles.sendButton, styles.recordingActiveButton]}
              onPress={toggleGravacao}
              activeOpacity={0.8}
            >
              <Ionicons name="stop" size={20} color={Colors.branco} />
            </TouchableOpacity>
          ) : !texto.trim() && permissoesGrupo.audio ? (
            <TouchableOpacity
              style={styles.sendButton}
              onPress={toggleGravacao}
              activeOpacity={0.8}
            >
              <Ionicons name="mic-outline" size={20} color={Colors.branco} />
            </TouchableOpacity>
          ) : (
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
          )}
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
  loadMoreButton: {
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#EDF2FF",
    borderWidth: 1,
    borderColor: "#D7E1FF",
    marginBottom: 12,
  },
  loadMoreText: {
    color: Colors.azulEscuro,
    fontSize: 12,
    fontFamily: Fonts.semiBold,
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
  inputWrapper: {
    flex: 1,
    position: "relative",
    marginRight: 10,
  },
  input: {
    minHeight: 50,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#D8DDE6",
    borderRadius: 18,
    paddingLeft: 14,
    paddingRight: 42,
    paddingVertical: 12,
    fontFamily: Fonts.regular,
    fontSize: GlobalFontSize.text,
    color: Colors.grafite,
    backgroundColor: "#FAFBFD",
  },
  clipButton: {
    position: "absolute",
    right: 10,
    bottom: 11,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.roxo,
    alignItems: "center",
    justifyContent: "center",
  },
  recordingActiveButton: {
    backgroundColor: Colors.rosa,
  },
  sendButtonDisabled: {
    opacity: 0.55,
  },
  pickerOpcoes: {
    flexDirection: "row",
    backgroundColor: Colors.branco,
    borderTopWidth: 1,
    borderTopColor: "#E4E7EC",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 20,
  },
  pickerOpcaoItem: {
    alignItems: "center",
    gap: 6,
  },
  pickerOpcaoIcone: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  pickerOpcaoLabel: {
    color: Colors.grafite,
    fontSize: 11,
    fontFamily: Fonts.semiBold,
  },
  audioBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
    minWidth: 120,
  },
  audioLabel: {
    color: Colors.grafite,
    fontSize: GlobalFontSize.text,
    fontFamily: Fonts.regular,
    flexShrink: 1,
  },
  imagemMensagem: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginVertical: 4,
  },
  videoMensagem: {
    width: 220,
    height: 160,
    borderRadius: 12,
    marginVertical: 4,
    backgroundColor: "#000",
  },
  arquivoBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
    minWidth: 120,
  },
  arquivoLabel: {
    color: Colors.grafite,
    fontSize: GlobalFontSize.text,
    fontFamily: Fonts.regular,
    flexShrink: 1,
  },
});
