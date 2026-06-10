import AppText from "@/components/AppText";
import ChatBubbleIcon from "@/components/ChatBubbleIcon";
import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import GrupoTematicoService from "@/service/GrupoTematicoService";
import PopupService from "@/utils/PopupService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface CardGrupoProps {
  id: number;
  titulo: string;
  descricao: string;
  bairros?: string[];
  isFavorito?: boolean;
  onPress?: () => void;
  onParticipar?: () => void;
}

export default function CardGrupo({
  id,
  titulo,
  descricao,
  bairros,
  isFavorito = false,
  onPress,
  onParticipar,
}: CardGrupoProps) {
  const router = useRouter();
  const [verificandoChat, setVerificandoChat] = useState(false);
  const [eParticipante, setEParticipante] = useState<boolean | null>(null);

  const handleAbrirChat = async () => {
    if (eParticipante === false) {
      PopupService.info(
        "Você precisa participar do grupo para acessar o chat.",
      );
      return;
    }

    setVerificandoChat(true);
    try {
      const status = await GrupoTematicoService.verificarParticipacao(id);
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

    router.push({
      pathname: "/ChatPage" as never,
      params: { groupId: id.toString() },
    });
  };

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push({
        pathname: "/DetalheGrupoPage",
        params: { id: id.toString() },
      });
    }
  };

  const onAddPress = async () => {
    try {
      await GrupoTematicoService.participar(id);
      PopupService.success("Você entrou no grupo com sucesso!");
      onParticipar?.();
    } catch (error: any) {
      const message =
        error?.response?.data?.error ??
        "Erro ao tentar entrar no grupo. Tente novamente.";
      PopupService.error(message);
    }
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <ChatBubbleIcon
          compact
          onPress={handleAbrirChat}
          loading={verificandoChat}
          disabled={eParticipante === false}
        />
      </View>

      <View style={styles.infoContainer}>
        <AppText style={styles.titulo}>{titulo}</AppText>

        <AppText style={styles.descricao} numberOfLines={2}>
          {descricao}
        </AppText>

        {bairros && bairros.length > 0 && (
          <View style={styles.bairrosWrapper}>
            <AppText style={styles.bairroText} numberOfLines={1}>
              {bairros.slice(0, 3).join(", ")}
              {bairros.length > 3 ? "..." : ""}
            </AppText>
          </View>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity>
          <Ionicons
            name={isFavorito ? "heart" : "heart-outline"}
            size={26}
            color={isFavorito ? Colors.rosa : Colors.cinzaClaro}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
          <Ionicons name="add" size={26} color={Colors.branco} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: Colors.branco,
    borderWidth: 1.5,
    borderColor: Colors.grafite,
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    elevation: 2,
    shadowColor: Colors.grafite,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconContainer: {
    width: 65,
    height: 65,
    backgroundColor: Colors.azulClaro,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.grafite,
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: "center",
    overflow: "hidden", // Evita que o texto saia do limite
  },
  titulo: {
    fontFamily: Fonts.semiBold,
    fontSize: GlobalFontSize.subtitle,
    color: Colors.grafite,
  },
  descricao: {
    fontFamily: Fonts.regular,
    fontSize: GlobalFontSize.text,
    color: Colors.cinzaClaro,
    marginTop: 2,
  },
  bairroText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: Colors.azulEscuro,
    marginTop: 4,
    textTransform: "uppercase",
    flexShrink: 1, // Permite que o texto encolha se necessário
  },
  bairrosWrapper: {
    flexDirection: "row",
    marginTop: 4,
    alignItems: "center",
  },
  actionsContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    height: 65,
    paddingVertical: 2,
  },
  addButton: {
    backgroundColor: Colors.azulEscuro,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});
