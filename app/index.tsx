import AppText from "@/components/AppText";
import { Colors, GlobalFontSize } from "@/constants/GlobalStyles";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function HomePage() {
  return (
    <LinearGradient colors={[Colors.rosa, Colors.azul]} style={styles.gradient}>
      <View style={styles.container}>
        <AppText style={styles.title}>+Mães</AppText>

        <Link href="/StartPage" style={styles.button}>
          Entrar
        </Link>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: GlobalFontSize.logoTitle,
    color: Colors.branco,
  },
  button: {
    backgroundColor: Colors.branco,
    paddingVertical: 18,
    borderRadius: 50,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 100,
    textAlign: "center",
    color: Colors.rosa,
    fontSize: GlobalFontSize.title,
    fontWeight: "bold",
  },
  buttonText: {},
});
