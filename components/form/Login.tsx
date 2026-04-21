import AppText from "@/components/AppText";
import { Colors, GlobalFontSize } from "@/constants/GlobalStyles";
import AuthService from "@/service/AuthService";
import { LoginRequest } from "@/service/model/LoginRequest";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Input from "../input";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [loginData, setLoginData] = useState<LoginRequest>({
    email: "",
    senha: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      const response = await AuthService.login(loginData);
      console.log("Token:", response.token);
    } catch (error) {
      console.error("Erro no login:", error);
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
      <AppText style={styles.forgotPassword}>Esqueceu a senha?</AppText>
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <AppText style={styles.buttonText}>Login</AppText>
      </TouchableOpacity>
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
  button: {
    backgroundColor: Colors.roxo,
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: "center",
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignSelf: "center",
  },
  buttonText: {
    color: Colors.branco,
    fontSize: GlobalFontSize.title,
    fontWeight: "bold",
  },
});
