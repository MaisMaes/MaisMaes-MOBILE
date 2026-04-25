import AppButton from "@/components/AppButton";
import AppText from "@/components/AppText";
import Input from "@/components/input";
import { Colors } from "@/constants/GlobalStyles";
import AuthService from "@/service/AuthService";
import { RedefineSenhaRequest } from "@/service/model/RedefineSenhaRequest";
import PopupService from "@/utils/PopupService";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EsqueciSenha() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [redefinirSenhaData, setRedefinirSenhaData] = useState(
    {} as RedefineSenhaRequest,
  );
  const [isRedefinirSenha, setIsRedefinirSenha] = useState(false);

  const handleRecuperarSenha = async () => {
    try {
      await AuthService.recuperarSenha({ email });
      PopupService.success(
        "Instruções de recuperação de senha enviadas para seu email!",
      );
      setIsRedefinirSenha(true);
    } catch (error) {
      PopupService.error("Erro ao tentar recuperar a senha. Tente novamente.");
    }
  };

  const handleRedefinirSenha = async () => {
    try {
      await AuthService.redefinirSenha(redefinirSenhaData);
      PopupService.success(
        "Senha redefinida com sucesso! Voltando para tela de login...",
      );
      setTimeout(() => router.replace("/StartPage"), 2000);
    } catch (error) {
      PopupService.error("Erro ao tentar redefinir a senha. Tente novamente.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={styles.formContainer}>
          <AppText style={styles.title}>
            {isRedefinirSenha ? "Redefinição de senha" : "Esqueceu a senha?"}
          </AppText>
          {!isRedefinirSenha ? (
            <Input
              label="E-mail"
              placeholder="exemple@mail.com"
              value={email}
              onChangeText={setEmail}
            />
          ) : (
            <>
              <Input
                label="Código"
                placeholder="Digite o código recebido"
                value={redefinirSenhaData.codigo}
                onChangeText={(codigo) =>
                  setRedefinirSenhaData({ ...redefinirSenhaData, codigo })
                }
              />
              <Input
                label="Nova senha"
                placeholder="Digite sua nova senha"
                value={redefinirSenhaData.novaSenha}
                onChangeText={(novaSenha) =>
                  setRedefinirSenhaData({ ...redefinirSenhaData, novaSenha })
                }
              />
            </>
          )}
          {!isRedefinirSenha ? (
            <AppButton
              text="Recuperar senha"
              backgroundColor={Colors.roxo}
              onPress={handleRecuperarSenha}
              style={{ marginTop: 50 }}
            />
          ) : (
            <AppButton
              text="Redefinir senha"
              backgroundColor={Colors.roxo}
              onPress={handleRedefinirSenha}
              style={{ marginTop: 50 }}
            />
          )}
          {!isRedefinirSenha ? (
            <AppText style={styles.backToLogin}>
              <Link href={"/StartPage"}>Voltar para login</Link>
            </AppText>
          ) : (
            <AppText
              style={styles.backToLogin}
              onPress={() => setIsRedefinirSenha(false)}
            >
              Voltar
            </AppText>
          )}
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
    width: "90%",
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
