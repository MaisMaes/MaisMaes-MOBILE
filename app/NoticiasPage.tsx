import AppText from "@/components/AppText";
import BottomBar from "@/components/BottomBar";
import CardNoticia from "@/components/CardNoticia";
import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import InfoCardService, { InfoCard } from "@/service/InfoCardService";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<InfoCard[]>([]);
  const [pesquisa, setPesquisa] = useState("");
  const [carregando, setCarregando] = useState(false);

  const carregarNoticias = useCallback(async () => {
    try {
      setCarregando(true);

      const texto = pesquisa.trim();

      const resultado = texto
        ? await InfoCardService.buscarPorTitulo(texto)
        : await InfoCardService.listar();

      setNoticias(resultado);
    } catch (error) {
      console.error("Erro ao carregar notícias:", error);
    } finally {
      setCarregando(false);
    }
  }, [pesquisa]);

  useEffect(() => {
    carregarNoticias();
  }, [carregarNoticias]);

  function abrirDetalheNoticia(id: string) {
    router.push({
      pathname: "/DetalheNoticiaPage",
      params: { id },
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>Notícias</AppText>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar..."
            placeholderTextColor={Colors.grafite}
            value={pesquisa}
            onChangeText={setPesquisa}
            returnKeyType="search"
            onSubmitEditing={carregarNoticias}
          />

          <TouchableOpacity
            style={styles.searchButton}
            onPress={carregarNoticias}
          >
            <Ionicons name="search" size={20} color={Colors.branco} />
          </TouchableOpacity>
        </View>

        <AppText style={styles.sectionTitle}>Últimas notícias</AppText>

        {carregando ? (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color={Colors.roxo}
          />
        ) : (
          noticias.map((noticia) => (
            <CardNoticia
              key={noticia.id}
              noticia={noticia}
              onPress={() => abrirDetalheNoticia(noticia.id)}
            />
          ))
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
  header: {
    height: 80,
    backgroundColor: Colors.roxo,
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 28,
    paddingTop: 14,
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: GlobalFontSize.title,
    color: Colors.branco,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 150,
  },
  searchContainer: {
    height: 42,
    borderWidth: 2,
    borderColor: Colors.azulEscuro,
    borderRadius: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16,
    marginBottom: 28,
  },
  searchInput: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: GlobalFontSize.text,
    color: Colors.grafite,
    paddingVertical: 0,
  },
  searchButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.azulEscuro,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 3,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: GlobalFontSize.subtitle,
    color: Colors.grafite,
    marginBottom: 12,
  },
  loading: {
    marginTop: 32,
  },
});