import AppText from "@/components/AppText";
import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import { Pressable, StyleSheet, View } from "react-native";

const COR_ALERTA = "#F0384F";

type Props = {
  // espaço para acrescentar o chamado quando a pessoa segura o botão pelo tempo definido.
  onAtivar?: () => void;
  tempoMs?: number;
};

export default function BotaoEmergencia({ onAtivar, tempoMs = 3000 }: Props) {
  const segundos = Math.round(tempoMs / 1000);

  return (
    <View style={styles.wrapper}>
      <Pressable
        onLongPress={onAtivar}
        delayLongPress={tempoMs}
        accessibilityRole="button"
        accessibilityLabel={`Emergência. Pressione por ${segundos} segundos.`}
        style={({ pressed }) => [styles.circulo, pressed && styles.pressionado]}
      >
        <View style={styles.losango}>
          <AppText style={styles.exclamacao}>!</AppText>
        </View>
      </Pressable>

      <AppText style={styles.titulo}>Emergência</AppText>
      <AppText style={styles.subtitulo}>
        Pressione por {segundos} segundos
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },
  circulo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.branco,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: Colors.grafite,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  pressionado: {
    transform: [{ scale: 0.96 }],
  },
  losango: {
    width: 62,
    height: 62,
    borderWidth: 8,
    borderColor: COR_ALERTA,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "45deg" }],
  },
  exclamacao: {
    fontSize: 30,
    lineHeight: 36,
    fontFamily: Fonts.bold,
    color: COR_ALERTA,
    transform: [{ rotate: "-45deg" }],
  },
  titulo: {
    fontSize: GlobalFontSize.subtitle,
    fontFamily: Fonts.bold,
    color: Colors.grafite,
  },
  subtitulo: {
    fontSize: GlobalFontSize.text,
    color: Colors.cinzaClaro,
  },
});
