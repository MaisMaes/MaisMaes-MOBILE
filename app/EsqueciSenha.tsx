import AppButton from "@/components/AppButton";
import AppText from "@/components/AppText";
import Input from "@/components/input";
import { Colors } from "@/constants/GlobalStyles";
import PopupService from "@/utils/PopupService";
import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EsqueciSenha() {
  const handleRecuperarSenha = () => {
    PopupService.success(
      "Instruções de recuperação de senha enviadas para seu email!",
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={styles.formContainer}>
          <AppText style={styles.title}>Esqueceu a senha?</AppText>
          <Input label="E-mail" placeholder="exemple@mail.com" />
          <AppButton
            text="Recuperar senha"
            backgroundColor={Colors.roxo}
            onPress={handleRecuperarSenha}
            style={{ marginTop: 50 }}
          />
          <AppText style={styles.backToLogin}>
            <Link href={"/StartPage"}>Voltar para login</Link>
          </AppText>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: Colors.roxo,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 70,
    textAlign: "center",
    color: Colors.grafite,
  },
  backToLogin: {
    marginTop: 20,
    color: Colors.roxo,
    textAlign: "center",
  },
});
