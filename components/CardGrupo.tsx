import AppText from "@/components/AppText";
import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import GrupoTematicoService from "@/service/GrupoTematicoService";
import PopupService from "@/utils/PopupService";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface CardGrupoProps {
  id: number;
  titulo: string;
  descricao: string;
  bairros?: string[];
  isFavorito?: boolean;
  onPress?: () => void;
}

export default function CardGrupo({ 
  id,
  titulo, 
  descricao, 
  bairros, 
  isFavorito = false, 
  onPress
}: CardGrupoProps) {

  const onAddPress = async () => {
    try {
      await GrupoTematicoService.participar(id);
      PopupService.success("Você entrou no grupo com sucesso!");
    } catch (error: any) {
      const message = error?.response?.data?.error ?? "Erro ao tentar entrar no grupo. Tente novamente.";
      PopupService.error(message);
    }
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      
      <View style={styles.iconContainer}>
        <Ionicons name="chatbubble-outline" size={28} color={Colors.grafite} />
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
    justifyContent: 'center',
    overflow: 'hidden', // Evita que o texto saia do limite
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
    alignItems: 'center',
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