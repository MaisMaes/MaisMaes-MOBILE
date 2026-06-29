import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/AppText";
import ChatBubbleIcon from "@/components/ChatBubbleIcon";
import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import GrupoTematicoService from "@/service/GrupoTematicoService";
import { DetalheGrupoResponseDTO } from "@/service/model/DetalheGrupoResponseDTO";
import { PedidoEntradaResponseDTO } from "@/service/model/PedidoEntradaResponseDTO";
import PopupService from "@/utils/PopupService";

const CATEGORIAS = [
  "SAUDE",
  "EDUCACAO",
  "LAZER",
  "ALIMENTACAO",
  "FINANCAS",
  "TRABALHO",
  "OUTROS",
];

const LISTA_BAIRROS = [
  "BARRA_DE_JANGADA",
  "CANDEIAS",
  "PIEDADE",
  "JARDIM_PIEDADE",
  "PRAZERES",
  "CAJUEIRO_SECO",
  "COMPORTAS",
  "GUARARAPES",
  "JARDIM_JORDAO",
  "CAVALEIRO",
  "DOIS_CARNEIROS",
  "SUCUPIRA",
  "ZUMBI_DO_PACHECO",
  "CURADO_I",
  "CURADO_II",
  "CURADO_III",
  "CURADO_IV",
  "MURIBECA",
  "MARCOS_FREIRE",
  "CENTRO",
  "VILA_RICA",
  "VISTA_ALEGRE",
  "SOCORRO",
  "SANTO_ALEIXO",
  "ENGENHO_VELHO",
  "MANASSU",
  "FLORIANO",
  "SANTANA",
  "VARGEM_FRIA",
];

export default function DetalheGrupoPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [grupo, setGrupo] = useState<DetalheGrupoResponseDTO | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  // Estados de edição
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [bairros, setBairros] = useState<string[]>([]);
  const [privado, setPrivado] = useState(false);
  const [numeroParticipantes, setNumeroParticipantes] = useState("");
  const [tempoMensagens, setTempoMensagens] = useState("");
  const [video, setVideo] = useState(false);
  const [audio, setAudio] = useState(false);
  const [imagem, setImagem] = useState(false);
  const [documento, setDocumento] = useState(false);
  const [showBairros, setShowBairros] = useState(false);
  const [verificandoChat, setVerificandoChat] = useState(false);
  const [eParticipante, setEParticipante] = useState<boolean | null>(null);

  //Denunciar grupo
  const [showDenunciaModal, setShowDenunciaModal] = useState(false);
  const [descricaoDenuncia, setDescricaoDenuncia] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  // Pedidos de entrada
  const [pedidosEntrada, setPedidosEntrada] = useState<PedidoEntradaResponseDTO[]>([]);
  const [respondendoPedido, setRespondendoPedido] = useState<number | null>(null);

  const carregarDetalhes = async () => {
    try {
      setCarregando(true);
      const data = await GrupoTematicoService.buscarDetalhes(Number(id));
      setGrupo(data);
      setEParticipante(data.usuarioLogadoEParticipante);

      const podeVerPedidos =
        data.usuarioLogadoRole === "CRIADORA" ||
        data.usuarioLogadoRole === "MODERADORA";
      if (podeVerPedidos) {
        try {
          const pedidos = await GrupoTematicoService.listarPedidosEntrada(Number(id));
          setPedidosEntrada(pedidos);
        } catch {
          // silencia: usuário pode não ter permissão ainda
        }
      }
    } catch {
      PopupService.error("Erro ao carregar detalhes do grupo.");
      router.back();
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarDetalhes();
  }, []);

  const iniciarEdicao = () => {
    if (!grupo) return;
    setTitulo(grupo.titulo);
    setDescricao(grupo.descricao);
    setCategoria(grupo.categoria);
    setBairros(grupo.bairros);
    setPrivado(grupo.privado);
    setNumeroParticipantes(String(grupo.numeroParticipantes));
    setTempoMensagens(String(grupo.tempoEntreMensagens));
    setVideo(grupo.video);
    setAudio(grupo.audio);
    setImagem(grupo.imagem);
    setDocumento(grupo.documento);
    setEditando(true);
  };

  const cancelarEdicao = () => {
    setEditando(false);
    setShowBairros(false);
  };

  const handleSalvar = async () => {
    if (!titulo.trim() || !descricao.trim() || bairros.length === 0) {
      PopupService.info(
        "Preencha o título, descrição e selecione ao menos um bairro.",
      );
      return;
    }
    try {
      setSalvando(true);
      await GrupoTematicoService.editar(Number(id), {
        titulo,
        descricao,
        categorias: categoria,
        bairros,
        privado,
        numeroParticipantes: Number(numeroParticipantes),
        tempoEntreMensagens: Number(tempoMensagens),
        video,
        audio,
        imagem,
        documento,
      });
      PopupService.success("Grupo atualizado com sucesso!");
      setEditando(false);
      setShowBairros(false);
      carregarDetalhes();
    } catch (error: any) {
      const message =
        error?.response?.data?.error ?? "Erro ao atualizar o grupo.";
      PopupService.error(message);
    } finally {
      setSalvando(false);
    }
  };

  const handleExcluir = () => {
    Alert.alert(
      "Excluir grupo",
      "Tem certeza que deseja excluir este grupo? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await GrupoTematicoService.excluir(Number(id));
              PopupService.success("Grupo excluído com sucesso!");
              router.back();
            } catch (error: any) {
              const message =
                error?.response?.data?.error ?? "Erro ao excluir o grupo.";
              PopupService.error(message);
            }
          },
        },
      ],
    );
  };

  const handleAbrirChat = async () => {
    if (eParticipante === false) {
      PopupService.info(
        "Você precisa participar do grupo para acessar o chat.",
      );
      return;
    }

    if (eParticipante === null) {
      setVerificandoChat(true);
      try {
        const status = await GrupoTematicoService.verificarParticipacao(
          Number(id),
        );
        setEParticipante(status.participante);
        if (!status.participante) {
          PopupService.info(
            "Você precisa participar do grupo para acessar o chat.",
          );
          return;
        }
      } catch {
        PopupService.error("Erro ao verificar participação.");
        return;
      } finally {
        setVerificandoChat(false);
      }
    }

    router.push({
      pathname: "/ChatPage" as never,
      params: { groupId: id },
    });
  };

  const toggleBairro = (bairro: string) => {
    setBairros((prev) =>
      prev.includes(bairro)
        ? prev.filter((b) => b !== bairro)
        : [...prev, bairro],
    );
  };

  const handleDenunciar = async () => {
    if (!descricaoDenuncia.trim()) {
      PopupService.info("Informe o motivo da denúncia.");
      return;
    }

    try {
      await GrupoTematicoService.denunciar(
        Number(id),
        descricaoDenuncia.trim(),
      );
      PopupService.success("Denúncia enviada com sucesso!");
      setDescricaoDenuncia("");
      setShowDenunciaModal(false);
    } catch (error: any) {
      const message =
        error?.response?.data?.error ?? "Erro ao enviar denúncia.";
      PopupService.error(message);
    }
  };

  const handleResponderPedido = async (pedidoId: number, aprovado: boolean) => {
    setRespondendoPedido(pedidoId);
    try {
      await GrupoTematicoService.responderPedidoEntrada(Number(id), pedidoId, aprovado);
      PopupService.success(aprovado ? "Pedido aprovado!" : "Pedido rejeitado.");
      setPedidosEntrada((prev) => prev.filter((p) => p.pedidoId !== pedidoId));
    } catch (error: any) {
      const message =
        error?.response?.data?.error ?? "Erro ao responder pedido.";
      PopupService.error(message);
    } finally {
      setRespondendoPedido(null);
    }
  };

  if (carregando) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={Colors.roxo} />
        </View>
      </SafeAreaView>
    );
  }

  if (!grupo) return null;

  const podeEditar =
    grupo.usuarioLogadoRole === "MODERADORA" ||
    grupo.usuarioLogadoRole === "CRIADORA";
  const podeDeletar = grupo.usuarioLogadoRole === "CRIADORA";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.ContainerContent}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerBtn}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.branco} />
          </TouchableOpacity>

          <AppText style={styles.headerTitle} numberOfLines={1}>
            {grupo.titulo}
          </AppText>

          <View style={styles.headerActions}>
            {podeEditar && !editando && (
              <TouchableOpacity
                onPress={iniciarEdicao}
                style={styles.headerBtn}
              >
                <Ionicons name="pencil" size={22} color={Colors.branco} />
              </TouchableOpacity>
            )}
            {podeDeletar && !editando && (
              <TouchableOpacity
                onPress={handleExcluir}
                style={styles.headerBtn}
              >
                <Ionicons
                  name="trash-outline"
                  size={22}
                  color={Colors.branco}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {!editando ? (
            <>
              <AppText style={styles.titulo}>{grupo.titulo}</AppText>
              <AppText style={styles.descricao}>{grupo.descricao}</AppText>

              <View style={styles.pillsRow}>
                <View style={styles.pill}>
                  <AppText style={styles.pillText}>{grupo.categoria}</AppText>
                </View>
                {grupo.privado && (
                  <View style={[styles.pill, { backgroundColor: Colors.roxo }]}>
                    <AppText
                      style={[styles.pillText, { color: Colors.branco }]}
                    >
                      Privado
                    </AppText>
                  </View>
                )}
              </View>

              {/* Banner: aguardando aprovação */}
              {grupo.usuarioLogadoAguardandoAprovacao && (
                <View style={styles.bannerPendente}>
                  <Ionicons name="time-outline" size={18} color={Colors.azulEscuro} />
                  <AppText style={styles.bannerPendenteText}>
                    Seu pedido de entrada está aguardando aprovação da criadora.
                  </AppText>
                </View>
              )}

              <AppText style={styles.sectionTitle}>Bairros</AppText>
              <View style={styles.tagsContainer}>
                {grupo.bairros.map((b, i) => (
                  <View key={`bairro-view-${b}-${i}`} style={styles.tag}>
                    <AppText style={styles.tagText}>
                      {b.replace(/_/g, " ")}
                    </AppText>
                  </View>
                ))}
              </View>

              <View style={styles.participantesHeader}>
                <AppText style={styles.sectionTitle}>
                  Participantes ({grupo.participantes.length}/
                  {grupo.numeroParticipantes})
                </AppText>

                {grupo.usuarioLogadoEParticipante && (
                  <View style={{ position: "relative" }}>
                    <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
                      <Ionicons
                        name="ellipsis-vertical"
                        size={22}
                        color={Colors.grafite}
                      />
                    </TouchableOpacity>

                    {showMenu && (
                      <View style={styles.dropdownMenu}>
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            setShowMenu(false);
                            setShowDenunciaModal(true);
                          }}
                        >
                          <AppText style={styles.dropdownText}>
                            Denunciar grupo
                          </AppText>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}
              </View>
              <Modal
                visible={showDenunciaModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowDenunciaModal(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalBox}>
                    <AppText style={styles.sectionTitle}>
                      Denunciar grupo
                    </AppText>

                    <AppText style={{ marginBottom: 10 }}>
                      Informe o motivo da denúncia:
                    </AppText>

                    <TextInput
                      value={descricaoDenuncia}
                      onChangeText={setDescricaoDenuncia}
                      multiline
                      placeholder="Descreva o motivo da denúncia..."
                      style={[styles.input, styles.textArea]}
                    />

                    <View style={styles.modalActions}>
                      <TouchableOpacity
                        style={styles.btnCancelar}
                        onPress={() => {
                          setDescricaoDenuncia("");
                          setShowDenunciaModal(false);
                        }}
                      >
                        <AppText style={styles.btnCancelarText}>
                          Cancelar
                        </AppText>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.btnSalvar}
                        onPress={handleDenunciar}
                      >
                        <AppText style={styles.btnSalvarText}>Enviar</AppText>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

              {grupo.participantes.length === 0 ? (
                <AppText style={styles.emptyText}>
                  Nenhum participante ainda.
                </AppText>
              ) : (
                <View>
                  {grupo.participantes.map((p, i) => (
                    <View
                      key={p.id ?? `part-${i}`}
                      style={styles.participanteItem}
                    >
                      <Ionicons
                        name="person-circle-outline"
                        size={28}
                        color={Colors.roxo}
                      />
                      <AppText style={styles.participanteNome}>
                        {p.nome}
                      </AppText>
                    </View>
                  ))}
                </View>
              )}

              {/* Seção de pedidos de entrada pendentes (criadora/moderadora) */}
              {(grupo.usuarioLogadoRole === "CRIADORA" ||
                grupo.usuarioLogadoRole === "MODERADORA") &&
                pedidosEntrada.length > 0 && (
                  <>
                    <AppText style={[styles.sectionTitle, { marginTop: 20 }]}>
                      Pedidos de entrada ({pedidosEntrada.length})
                    </AppText>
                    {pedidosEntrada.map((pedido) => (
                      <View key={pedido.pedidoId} style={styles.pedidoItem}>
                        <View style={styles.pedidoInfo}>
                          <Ionicons
                            name="person-add-outline"
                            size={24}
                            color={Colors.roxo}
                          />
                          <AppText style={styles.pedidoNome}>
                            {pedido.nomeUsuario}
                          </AppText>
                        </View>
                        <View style={styles.pedidoAcoes}>
                          <TouchableOpacity
                            style={styles.btnRejeitar}
                            disabled={respondendoPedido === pedido.pedidoId}
                            onPress={() =>
                              handleResponderPedido(pedido.pedidoId, false)
                            }
                          >
                            {respondendoPedido === pedido.pedidoId ? (
                              <ActivityIndicator size="small" color={Colors.rosa} />
                            ) : (
                              <Ionicons name="close" size={18} color={Colors.rosa} />
                            )}
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={styles.btnAprovar}
                            disabled={respondendoPedido === pedido.pedidoId}
                            onPress={() =>
                              handleResponderPedido(pedido.pedidoId, true)
                            }
                          >
                            {respondendoPedido === pedido.pedidoId ? (
                              <ActivityIndicator size="small" color={Colors.branco} />
                            ) : (
                              <Ionicons name="checkmark" size={18} color={Colors.branco} />
                            )}
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </>
                )}
            </>
          ) : (
            // ── MODO EDIÇÃO ────────────────────────────────────────────
            <>
              <AppText style={styles.sectionTitle}>Título</AppText>
              <TextInput
                value={titulo}
                onChangeText={setTitulo}
                style={styles.input}
                placeholderTextColor={Colors.cinzaClaro}
              />

              <AppText style={styles.sectionTitle}>Descrição</AppText>
              <TextInput
                value={descricao}
                onChangeText={setDescricao}
                style={[styles.input, styles.textArea]}
                multiline
                placeholderTextColor={Colors.cinzaClaro}
              />

              <View style={styles.selectorBox}>
                <AppText style={styles.label}>Grupo Privado</AppText>
                <Switch
                  value={privado}
                  onValueChange={setPrivado}
                  trackColor={{
                    false: Colors.cinzaClaro,
                    true: Colors.roxo + "77",
                  }}
                  thumbColor={privado ? Colors.roxo : Colors.branco}
                />
              </View>

              {/* Bairros */}
              <TouchableOpacity
                style={styles.selectorBox}
                onPress={() => setShowBairros(!showBairros)}
                activeOpacity={0.7}
              >
                <AppText style={styles.label}>
                  {bairros.length > 0
                    ? `${bairros.length} bairro(s) selecionado(s)`
                    : "Selecione os bairros"}
                </AppText>
                <Ionicons
                  name={
                    showBairros
                      ? "chevron-up-circle-outline"
                      : "chevron-down-circle-outline"
                  }
                  size={24}
                  color={Colors.roxo}
                />
              </TouchableOpacity>

              {showBairros && (
                <View style={styles.dropdown}>
                  <ScrollView nestedScrollEnabled style={{ maxHeight: 200 }}>
                    {LISTA_BAIRROS.map((b, i) => (
                      <TouchableOpacity
                        key={`lista-${b}-${i}`}
                        style={styles.dropOption}
                        onPress={() => toggleBairro(b)}
                      >
                        <Ionicons
                          name={
                            bairros.includes(b) ? "checkbox" : "square-outline"
                          }
                          size={20}
                          color={Colors.roxo}
                        />
                        <AppText style={styles.dropText}>
                          {b.replace(/_/g, " ")}
                        </AppText>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Categoria */}
              <AppText style={styles.sectionTitle}>Categoria</AppText>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.catScroll}
              >
                {CATEGORIAS.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => setCategoria(cat)}
                    style={[
                      styles.catPill,
                      categoria === cat && styles.catPillActive,
                    ]}
                  >
                    <AppText
                      style={[
                        styles.catText,
                        categoria === cat && { color: Colors.branco },
                      ]}
                    >
                      {cat}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Mídias */}
              <AppText style={styles.sectionTitle}>Mídias permitidas</AppText>
              <View style={styles.mediaGrid}>
                {(
                  [
                    { label: "Vídeo", value: video, setter: setVideo },
                    { label: "Áudio", value: audio, setter: setAudio },
                    { label: "Imagem", value: imagem, setter: setImagem },
                    {
                      label: "Documento",
                      value: documento,
                      setter: setDocumento,
                    },
                  ] as const
                ).map(({ label, value, setter }) => (
                  <View key={label} style={styles.mediaItem}>
                    <AppText style={styles.mediaLabel}>{label}</AppText>
                    <Switch value={value} onValueChange={setter} />
                  </View>
                ))}
              </View>

              {/* Limites numéricos */}
              <View style={styles.inputGroupRow}>
                <View style={styles.inputHalf}>
                  <AppText style={styles.labelSmall}>
                    Máx. participantes:
                  </AppText>
                  <TextInput
                    value={numeroParticipantes}
                    onChangeText={setNumeroParticipantes}
                    keyboardType="numeric"
                    style={styles.inputSmall}
                  />
                </View>
                <View style={styles.inputHalf}>
                  <AppText style={styles.labelSmall}>Tempo msgs (min):</AppText>
                  <TextInput
                    value={tempoMensagens}
                    onChangeText={setTempoMensagens}
                    keyboardType="numeric"
                    style={styles.inputSmall}
                  />
                </View>
              </View>

              {/* Botões Salvar / Cancelar */}
              <View style={styles.editActions}>
                <TouchableOpacity
                  style={styles.btnCancelar}
                  onPress={cancelarEdicao}
                >
                  <AppText style={styles.btnCancelarText}>Cancelar</AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnSalvar, salvando && { opacity: 0.6 }]}
                  onPress={handleSalvar}
                  disabled={salvando}
                >
                  {salvando ? (
                    <ActivityIndicator size="small" color={Colors.branco} />
                  ) : (
                    <AppText style={styles.btnSalvarText}>Salvar</AppText>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </View>
      <ChatBubbleIcon
        groupId={Number(id)}
        onPress={handleAbrirChat}
        loading={verificandoChat}
        disabled={eParticipante === false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.roxo,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  ContainerContent: {
    flex: 1,
    backgroundColor: Colors.branco,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.roxo,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  headerTitle: {
    flex: 1,
    fontFamily: Fonts.semiBold,
    fontSize: GlobalFontSize.subtitle,
    color: Colors.branco,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerBtn: {
    padding: 4,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  titulo: {
    fontFamily: Fonts.bold,
    fontSize: 26,
    color: Colors.grafite,
    marginBottom: 8,
  },
  descricao: {
    fontFamily: Fonts.regular,
    fontSize: GlobalFontSize.text,
    color: Colors.grafite,
    marginBottom: 16,
    lineHeight: 22,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
  },
  pill: {
    backgroundColor: Colors.azulClaro,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  pillText: {
    fontFamily: Fonts.semiBold,
    fontSize: 12,
    color: Colors.azulEscuro,
  },
  sectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: GlobalFontSize.subtitle,
    color: Colors.grafite,
    marginBottom: 10,
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  tag: {
    backgroundColor: Colors.azulClaro,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.azulEscuro,
    textTransform: "capitalize",
  },
  participanteItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.cinzaClaro,
    gap: 10,
  },
  participanteNome: {
    fontFamily: Fonts.regular,
    fontSize: GlobalFontSize.text,
    color: Colors.grafite,
  },
  emptyText: {
    fontFamily: Fonts.regular,
    fontSize: GlobalFontSize.text,
    color: Colors.cinzaClaro,
  },
  // Formulário de edição
  input: {
    borderWidth: 1.5,
    borderColor: Colors.cinzaClaro,
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    backgroundColor: Colors.branco,
    fontFamily: Fonts.regular,
    color: Colors.grafite,
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  selectorBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.cinzaClaro,
    borderRadius: 25,
    padding: 12,
    marginBottom: 15,
    backgroundColor: Colors.branco,
  },
  label: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.grafite,
  },
  dropdown: {
    backgroundColor: Colors.branco,
    borderWidth: 1.5,
    borderColor: Colors.cinzaClaro,
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
  },
  dropOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.azulClaro,
  },
  dropText: {
    marginLeft: 10,
    fontSize: 13,
    fontFamily: Fonts.regular,
    textTransform: "capitalize",
  },
  catScroll: {
    marginBottom: 20,
  },
  catPill: {
    backgroundColor: Colors.branco,
    borderWidth: 1,
    borderColor: Colors.cinzaClaro,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginRight: 8,
    height: 35,
    justifyContent: "center",
  },
  catPillActive: {
    backgroundColor: Colors.roxo,
    borderColor: Colors.roxo,
  },
  catText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: Colors.grafite,
  },
  mediaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  mediaItem: {
    width: "48%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.azulClaro,
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
  mediaLabel: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.grafite,
  },
  inputGroupRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
  },
  inputHalf: {
    width: "48%",
  },
  labelSmall: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    marginBottom: 5,
    color: Colors.grafite,
  },
  inputSmall: {
    borderWidth: 1.5,
    borderColor: Colors.cinzaClaro,
    borderRadius: 15,
    padding: 8,
    textAlign: "center",
    backgroundColor: Colors.branco,
    fontFamily: Fonts.regular,
    color: Colors.grafite,
  },
  editActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 10,
  },
  btnCancelar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.cinzaClaro,
  },
  btnCancelarText: {
    fontFamily: Fonts.semiBold,
    fontSize: GlobalFontSize.subtitle,
    color: Colors.grafite,
  },
  btnSalvar: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: "center",
    backgroundColor: Colors.roxo,
  },
  btnSalvarText: {
    fontFamily: Fonts.semiBold,
    fontSize: GlobalFontSize.subtitle,
    color: Colors.branco,
  },
  participantesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 9999,
  },
  menuBox: {
    position: "absolute",
    right: 20,
    top: 5,
    backgroundColor: Colors.branco,
    borderRadius: 8,
    padding: 10,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 8,
  },
  menuText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.grafite,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#00000088",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "85%",
    backgroundColor: Colors.branco,
    borderRadius: 15,
    padding: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  dropdownMenu: {
    position: "absolute",
    top: 35,
    right: 0,
    backgroundColor: Colors.branco,
    borderRadius: 10,
    minWidth: 160,
    zIndex: 99999,
    elevation: 999,
    borderWidth: 1,
    borderColor: Colors.cinzaClaro,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  dropdownItem: {
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dropdownText: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    color: Colors.rosa,
  },
  bannerPendente: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: Colors.azulClaro,
    borderLeftWidth: 4,
    borderLeftColor: Colors.azulEscuro,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  bannerPendenteText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: Colors.azulEscuro,
    lineHeight: 18,
  },
  pedidoItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.cinzaClaro,
  },
  pedidoInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  pedidoNome: {
    fontFamily: Fonts.regular,
    fontSize: GlobalFontSize.text,
    color: Colors.grafite,
  },
  pedidoAcoes: {
    flexDirection: "row",
    gap: 8,
  },
  btnAprovar: {
    backgroundColor: Colors.roxo,
    borderRadius: 20,
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
  btnRejeitar: {
    borderWidth: 1.5,
    borderColor: Colors.rosa,
    borderRadius: 20,
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
  },
});
