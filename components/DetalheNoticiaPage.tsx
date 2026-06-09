import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";

import AppText from "../components/AppText";
import BottomBar from "../components/BottomBar";
import { Colors, Fonts, GlobalFontSize } from "../constants/GlobalStyles";
import InfoCardService, { InfoCard } from "../service/InfoCardService";

export default function DetalheNoticiaPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [noticia, setNoticia] = useState<InfoCard | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function carregarNoticia() {
      if (!id) {
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        const resultado = await InfoCardService.buscarPorId(id);
        setNoticia(resultado);
      } catch (error) {
        console.error("Erro ao carregar notícia:", error);
      } finally {
        setCarregando(false);
      }
    }

    carregarNoticia();
  }, [id]);

  const dataFormatada = noticia?.dataCriacao
    ? new Date(noticia.dataCriacao).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  async function abrirLinkExterno() {
    if (!noticia?.link) return;

    await Linking.openURL(noticia.link);
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {carregando ? (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color={Colors.rosa}
          />
        ) : noticia ? (
          <View>
            <AppText style={styles.titulo}>{noticia.titulo}</AppText>

            <AppText style={styles.data}>{dataFormatada}</AppText>

            {noticia.imagem ? (
              <Image source={{ uri: noticia.imagem }} style={styles.imagem} />
            ) : null}

            <AppText style={styles.descricao}>{noticia.descricao}</AppText>

            {noticia.link ? (
              <Pressable style={styles.botaoLink} onPress={abrirLinkExterno}>
                <AppText style={styles.textoBotaoLink}>
                  Acessar notícia
                </AppText>
              </Pressable>
            ) : null}
          </View>
        ) : (
          <AppText style={styles.mensagem}>Notícia não encontrada.</AppText>
        )}
      </ScrollView>

      <BottomBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.azulClaro,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  loading: {
    marginTop: 32,
  },
  titulo: {
    fontFamily: Fonts.bold,
    fontSize: GlobalFontSize.title,
    color: Colors.grafite,
    marginBottom: 8,
  },
  data: {
    fontFamily: Fonts.regular,
    fontSize: GlobalFontSize.text,
    color: Colors.cinzaClaro,
    marginBottom: 16,
  },
  imagem: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
    resizeMode: "cover",
    backgroundColor: Colors.branco,
  },
  descricao: {
    fontFamily: Fonts.regular,
    fontSize: GlobalFontSize.text,
    color: Colors.grafite,
    lineHeight: 22,
  },
  botaoLink: {
    backgroundColor: Colors.rosa,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 24,
    alignItems: "center",
  },
  textoBotaoLink: {
    fontFamily: Fonts.semiBold,
    fontSize: GlobalFontSize.text,
    color: Colors.branco,
  },
  mensagem: {
    fontFamily: Fonts.regular,
    fontSize: GlobalFontSize.text,
    color: Colors.grafite,
    textAlign: "center",
    marginTop: 32,
  },
});