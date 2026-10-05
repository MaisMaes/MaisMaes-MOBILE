import AppButton from "@/components/AppButton";
import AppHeader from "@/components/AppHeader";
import BotaoEmergencia from "@/components/BotaoEmergencia";
import BottomBar from "@/components/BottomBar";
import { Colors } from "@/constants/GlobalStyles";
import PopupService from "@/utils/PopupService";
import { useRouter } from "expo-router";
import { Linking, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AjudaPage() {
  const router = useRouter();

  const emBreve = () => PopupService.info("Funcionalidade em breve.");

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader titulo="Ajuda" logo/>

      <View style={styles.content}>
        <View style={styles.centro}>
          {/* Sem ação por enquanto. Quando estiver pronto: onAtivar={...} */}
          <BotaoEmergencia />
        </View>

        <View style={styles.acoes}>
          <AppButton
            text="Delegacias"
            backgroundColor={Colors.roxo}
            textColor={Colors.branco}
            width="100%"
            borderRadius={15}
            onPress={() => router.push("../DelegaciasPage")}
          />

          <View style={styles.linha}>
            <AppButton
              text="Abrir um B.O"
              backgroundColor={Colors.grafite}
              textColor={Colors.branco}
              width="48%"
              borderRadius={15}
              onPress={() => Linking.openURL("https://servicos.sds.pe.gov.br/delegacia/")}
            />
            <AppButton
              text="Histórico"
              backgroundColor={Colors.roxo}
              textColor={Colors.branco}
              width="48%"
              borderRadius={15}
              onPress={emBreve}
            />
          </View>
        </View>
      </View>

      <BottomBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.roxo,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.branco,
    paddingHorizontal: 20,
    paddingBottom: 140, // espaço para a BottomBar flutuante
  },
  centro: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  acoes: {
    gap: 10,
  },
  linha: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
