import AppText from "@/components/AppText";
import BottomBar from "@/components/BottomBar";
import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import InfoCardService from "@/service/InfoCardService";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { router, useLocalSearchParams } from "expo-router";
// import * as Sharing from "expo-sharing";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Share,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";

export default function DetalheNoticiaPage() {
  const { id } = useLocalSearchParams();

  const [noticia, setNoticia] = useState<any>();
  const [loading, setLoading] = useState(true);

  async function carregarNoticia() {
    try {
      const response = await InfoCardService.buscarPorId(
        id as string
      );

      setNoticia(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  async function abrirLink() {
    if (!noticia?.link) return;

    await Linking.openURL(noticia.link);
  }

  useEffect(() => {
    carregarNoticia();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={Colors.roxo}
        />
      </View>
    );
  }

  const dataFormatada = new Date(
    noticia.dataCriacao
  ).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

    const compartilhar = async () => {
    await Share.share({
        title: noticia.titulo,
        message: `${noticia.titulo}\n\n${noticia.link}`,
    });
    };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={28}
            color={Colors.branco}
          />
        </TouchableOpacity>

        <AppText style={styles.headerTitle}>
          Notícia
        </AppText>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
      >
        <AppText style={styles.titulo}>
          {noticia.titulo}
        </AppText>

        <View style={styles.actions}>
          <AppText style={styles.data}>
            {dataFormatada}
          </AppText>

        <TouchableOpacity onPress={compartilhar}>
        <Ionicons
            name="share-social-outline"
            size={24}
            color={Colors.azulEscuro}
        />
        </TouchableOpacity>
        </View>

        {!!noticia.imagem && (
          <Image
            source={{ uri: noticia.imagem }}
            style={styles.imagem}
            resizeMode="cover"
          />
        )}

        <AppText style={styles.descricao}>
          {noticia.descricao}
        </AppText>

        {!!noticia.link && (
          <TouchableOpacity
            style={styles.botaoLink}
            onPress={abrirLink}
          >
            <Ionicons
              name="open-outline"
              size={18}
              color={Colors.branco}
            />

            <AppText style={styles.textoBotao}>
              Abrir fonte
            </AppText>
          </TouchableOpacity>
        )}
      </ScrollView>

      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.branco,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    height: 80,
    backgroundColor: Colors.roxo,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },

  headerTitle: {
    color: Colors.branco,
    fontFamily: Fonts.bold,
    fontSize: GlobalFontSize.title,
  },

  content: {
    padding: 20,
    paddingBottom: 150,
  },

  titulo: {
    fontSize: 26,
    fontFamily: Fonts.bold,
    color: Colors.azulEscuro,
    marginBottom: 12,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },

  data: {
    color: Colors.cinzaClaro,
    fontFamily: Fonts.regular,
  },

  imagem: {
    width: "100%",
    height: 220,
    borderRadius: 20,
    marginBottom: 20,
  },

  descricao: {
    fontSize: GlobalFontSize.text,
    fontFamily: Fonts.regular,
    color: Colors.grafite,
    lineHeight: 24,
  },

  botaoLink: {
    backgroundColor: Colors.azulEscuro,
    marginTop: 24,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },

  textoBotao: {
    color: Colors.branco,
    fontFamily: Fonts.semiBold,
  },
});