import AppText from "@/components/AppText";
import { Colors, GlobalFontSize } from "@/constants/GlobalStyles";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Input from "../input";
import { LoginRequest } from "@/service/model/LoginRequest";
import { useState } from "react";

export default function Login() {
  const [loginData, setLoginData] = useState({} as LoginRequest);

  const handleLogin = async () => {
    console.log(loginData);
  }

  return (
    <View style={styles.container}>
      <Input
        label="Email"
        placeholder="Digite seu email"
        value={loginData.email}
        onChangeText={(text) => setLoginData({ ...loginData, email: text })}
      />
      <Input
        label="Senha"
        placeholder="Digite sua senha"
        secureTextEntry
        value={loginData.senha}
        onChangeText={(text) => setLoginData({ ...loginData, senha: text })}
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
