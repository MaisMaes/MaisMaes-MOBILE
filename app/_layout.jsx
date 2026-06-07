import {
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    useFonts,
} from "@expo-google-fonts/poppins";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false, animation: "simple_push" }}>
        <Stack.Screen name="index" />
        <Stack.Screen
          name="StartPage"
          options={{ animation: "slide_from_bottom", gestureEnabled: true }}
        />{" "}
        <Stack.Screen
          name="EsqueciSenha"
          options={{ animation: "ios_from_right", gestureEnabled: true }}
        />
        <Stack.Screen
          name="criar-grupo"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="Grupos"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="DetalheGrupoPage"
          options={{ animation: "ios_from_right", gestureEnabled: true }}
        />
        <Stack.Screen
          name="ChatPage"
          options={{ animation: "ios_from_right", gestureEnabled: true }}
        />
      </Stack>
      <Toast />
    </>
  );
}
