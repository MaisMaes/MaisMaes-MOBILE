import AppText from "@/components/AppText";
import Cadastro from "@/components/form/Cadastro";
import Login from "@/components/form/Login";
import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";

export default function StartPage() {
  const [isLogin, setIsLogin] = useState(true);

  const loginAnim = useRef(new Animated.Value(1)).current;
  const cadastroAnim = useRef(new Animated.Value(0)).current;

  const handleSwitch = (login: boolean) => {
    setIsLogin(login);
    Animated.parallel([
      Animated.timing(loginAnim, {
        toValue: login ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(cadastroAnim, {
        toValue: login ? 0 : 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient colors={[Colors.rosa, Colors.azul]} style={styles.header}>
        <AppText style={styles.title}><Link href="/profile">+Mães</Link></AppText>

        <View style={styles.labelsContainer}>
          <View style={{ width: "30%", alignItems: "center" }}>
            <AppText style={styles.labels} onPress={() => handleSwitch(true)}>
              Login
            </AppText>
            <Animated.View
              style={[styles.labelDecoration, { opacity: loginAnim }]}
            />
          </View>
          <View style={{ width: "25%", alignItems: "center" }}>
            <AppText style={styles.labels} onPress={() => handleSwitch(false)}>
              Cadastre-se
            </AppText>
            <Animated.View
              style={[styles.labelDecoration, { opacity: cadastroAnim }]}
            />
          </View>
        </View>
      </LinearGradient>

      <View style={styles.formContainer}>
        {isLogin ? <Login /> : <Cadastro/>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: "40%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: GlobalFontSize.logoTitle,
    fontFamily: Fonts.semiBold,
    color: Colors.grafite,
  },
  labelsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    gap: 70,
    position: "absolute",
    bottom: 0,
  },
  labels: {
    fontSize: GlobalFontSize.subtitle,
    marginBottom: 10,
    fontFamily: Fonts.semiBold,
  },
  formContainer: {
    flex: 1,
    backgroundColor: Colors.branco,
    paddingHorizontal: 40,
    paddingTop: 30,
  },
  button: {
    backgroundColor: Colors.roxo,
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 20,
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
  labelDecoration: {
    height: 3,
    width: "100%",
    backgroundColor: Colors.roxo,
    borderRadius: 2,
  },
});
