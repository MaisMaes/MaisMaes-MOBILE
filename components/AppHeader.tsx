import AppText from "@/components/AppText";
import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";

interface AppHeaderProps {
  titulo: string;
  showBack?: boolean;
  subtitulo?: string;
  logo?: boolean;
}

export default function AppHeader({ titulo, showBack, subtitulo, logo }: AppHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {logo && (
        <AppText style={styles.logo}>+Mães</AppText>
      )}
      {showBack && (
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.branco} />
        </TouchableOpacity>
      )}
      <View style={styles.textContainer}>
        <AppText style={styles.titulo}>{titulo}</AppText>
        {subtitulo ? (
          <AppText style={styles.subtitulo} numberOfLines={1}>
            {subtitulo}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: Colors.roxo,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingRight: 28,
  },
  logo: {
    fontFamily: Fonts.bold,
    fontSize: GlobalFontSize.title,
    color: Colors.branco,
    flex: 1,
  },
  backButton: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    alignItems: "flex-end",
  },
  titulo: {
    fontFamily: Fonts.regular,
    fontSize: GlobalFontSize.title,
    color: Colors.branco,
  },
  subtitulo: {
    fontFamily: Fonts.regular,
    fontSize: GlobalFontSize.text,
    color: Colors.branco,
    opacity: 0.85,
  },
});
