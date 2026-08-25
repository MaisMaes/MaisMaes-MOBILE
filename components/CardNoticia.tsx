import AppText from "@/components/AppText";
import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import { InfoCard } from "@/service/InfoCardService";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface CardNoticiaProps {
  noticia: InfoCard;
  onPress: () => void;
}

export default function CardNoticia({
  noticia,
  onPress,
}: CardNoticiaProps) {
  const dataFormatada = new Date(
    noticia.dataCriacao
  ).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name="newspaper-outline"
          size={28}
          color={Colors.grafite}
        />
      </View>

      <View style={styles.infoContainer}>
        <AppText
          style={styles.titulo}
          numberOfLines={1}
        >
          {noticia.titulo}
        </AppText>

        <AppText style={styles.data}>
          {dataFormatada}
        </AppText>

        <AppText
          style={styles.descricao}
          numberOfLines={2}
        >
          {noticia.descricao}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column", 
    backgroundColor: Colors.branco,
    borderWidth: 1.5,
    borderColor: Colors.grafite,
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: Colors.grafite,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  iconContainer: {
    width: "100%",
    height: 60, 
    backgroundColor: Colors.azulClaro,
    borderRadius: 18,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderColor: Colors.grafite,
    marginTop: 6,
  },

  infoContainer: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: "center",
  },

  titulo: {
    marginTop: 20,
    fontFamily: Fonts.semiBold,
    fontSize: GlobalFontSize.subtitle,
    color: Colors.grafite,
  },

  data: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: Colors.cinzaClaro,
    textAlign: "right",
  },

  descricao: {
    fontFamily: Fonts.regular,
    fontSize: GlobalFontSize.text,
    color: Colors.cinzaClaro,
    marginTop: 4,
  },
});