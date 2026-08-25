import AppText from "@/components/AppText";
import { Colors, GlobalFontSize } from "@/constants/GlobalStyles";
import AuthService from "@/service/AuthService";
import { LoginRequest } from "@/service/model/LoginRequest";
import PopupService from "@/utils/PopupService";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import AppButton from "../AppButton";
import Input from "../input";
import { AuthResponse, PerfilStatus } from "@/service/model/AuthResponse";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [loginData, setLoginData] = useState<LoginRequest>({
    email: "",
    senha: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useRouter();
  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};

    if (!loginData.email.trim()) e.email = "Email é obrigatório.";
    else if (!EMAIL_REGEX.test(loginData.email))
      e.email = "Informe um email válido. Ex: exemplo@dominio.com";

    if (!loginData.senha) e.senha = "Senha é obrigatória.";

    return e;
  };

  const handleLogin = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors({}), 5000);
      return;
    }
    try {
      const response:AuthResponse = await AuthService.login(loginData);
      PopupService.success("Login realizado com sucesso!");
      setTimeout(() => navigate.replace("/HomePage"), 2000);
    } catch (error:any) {
      const response:AuthResponse = error.response.data;
      switch (response.status) {
        case PerfilStatus.DESATIVADO:
          PopupService.error("Sua conta ainda não foi ativada. Verifique seu e-mail");
          break;
        case PerfilStatus.BANIDO:
          PopupService.error("Sua conta foi banida. Entre em contato com o suporte.");
          break;
        default:
          PopupService.error("Falha no login. Verifique suas credenciais.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Input
        label="Email"
        placeholder="Digite seu email"
        value={loginData.email}
        onChangeText={(text) => setLoginData({ ...loginData, email: text })}
        errorMessage={errors.email}
      />
      <Input
        label="Senha"
        placeholder="Digite sua senha"
        secureTextEntry
        value={loginData.senha}
        onChangeText={(text) => setLoginData({ ...loginData, senha: text })}
        errorMessage={errors.senha}
      />
      <AppText style={styles.forgotPassword}>
        <Link href="/EsqueciSenha">Esqueceu a senha?</Link>
      </AppText>
      <AppButton
        text="Login"
        backgroundColor={Colors.roxo}
        onPress={handleLogin}
        style={{ position: "absolute", bottom: 40 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  forgotPassword: {
    color: Colors.azulEscuro,
    fontSize: GlobalFontSize.text,
    marginTop: 10,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
});
