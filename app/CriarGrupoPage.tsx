import AppText from "@/components/AppText";
import CriarGrupoForm from "@/components/form/CriarGrupoForm";
import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CriarGrupoPage() {
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <AppText style={styles.title}>Criar grupo</AppText>
      </View>


      <View style={styles.formContainer}>
        <CriarGrupoForm />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.azulClaro,
  },

  header: {
    height: "10%",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "flex-end",
    backgroundColor: Colors.roxo,
  },

  title: {
    fontSize: GlobalFontSize.title,
    fontFamily: Fonts.semiBold,
    color: Colors.branco,
  },

  formContainer: {
    flex: 1,
    paddingTop: 10,
  },
});