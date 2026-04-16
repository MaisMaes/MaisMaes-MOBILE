import AppText from "@/components/AppText";
import { Colors, GlobalFontSize } from "@/constants/GlobalStyles";
import { StyleSheet, View } from "react-native";
import Input from "../input";

export default function Login() {
  return (
    <View style={styles.container}>
      <Input label="Email" placeholder="Digite seu email" />
      <Input label="Senha" placeholder="Digite sua senha" secureTextEntry />
      <AppText style={styles.forgotPassword}>Esqueceu a senha?</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  forgotPassword: {
    color: Colors.azulEscuro,
    fontSize: GlobalFontSize.text,
    marginTop: 10,
    alignSelf: "flex-start",
    marginLeft: 10,
  },
});
