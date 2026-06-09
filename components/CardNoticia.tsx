import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { Colors, Fonts, GlobalFontSize } from "../constants/GlobalStyles";
import { InfoCard } from "../service/InfoCardService";
import AppText from "./AppText";

interface CardNoticiaProps {
  noticia: InfoCard;
  onPress: () => void;
}

export default function CardNoticia({ noticia, onPress }: CardNoticiaProps) {
  const dataFormatada = new Date(noticia.dataCriacao).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View>
        <AppText style={styles.titulo}>{noticia.titulo}</AppText>

        <AppText style={styles.data}>{dataFormatada}</AppText>

        <AppText style={styles.descricao} numberOfLines={3}>
          {noticia.descricao}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.branco,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.grafite,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  titulo: {
    fontFamily: Fonts.semiBold,
    fontSize: GlobalFontSize.subtitle,
    color: Colors.grafite,
    marginBottom: 4,
  },
  data: {
    fontFamily: Fonts.regular,
    fontSize: 12,
    color: Colors.cinzaClaro,
    marginBottom: 8,
  },
  descricao: {
    fontFamily: Fonts.regular,
    fontSize: GlobalFontSize.text,
    color: Colors.grafite,
    lineHeight: 20,
  },
});