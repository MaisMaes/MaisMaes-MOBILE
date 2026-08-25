import AppHeader from "@/components/AppHeader";
import CriarGrupoForm from "@/components/form/CriarGrupoForm";
import { Colors } from "@/constants/GlobalStyles";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CriarGrupoPage() {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader titulo="Criar grupo" showBack />

      <View style={styles.formContainer}>
        <CriarGrupoForm />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.roxo,
  },
  formContainer: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: Colors.branco,
  },
});
