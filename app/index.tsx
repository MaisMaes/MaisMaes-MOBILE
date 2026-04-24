import AppButton from "@/components/AppButton";
import AppText from "@/components/AppText";
import { Colors, GlobalFontSize } from "@/constants/GlobalStyles";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function HomePage() {
  const router = useRouter();

  return (
    <LinearGradient colors={[Colors.rosa, Colors.azul]} style={styles.gradient}>
      <View style={styles.container}>
        <AppText style={styles.title}>+Mães</AppText>

        <AppButton
          text="Entrar"
          backgroundColor={Colors.branco}
          textColor={Colors.rosa}
          onPress={() => router.push("/StartPage")}
          width="80%"
          borderRadius={50}
          style={styles.button}
        />
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
    position: "absolute",
    bottom: 100,
  },
});
