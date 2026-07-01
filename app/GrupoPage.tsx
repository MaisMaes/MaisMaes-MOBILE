import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "@/components/AppHeader";
import AppText from "@/components/AppText";
import BottomBar from "@/components/BottomBar";
import CardGrupo from "@/components/CardGrupo";
import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import GrupoTematicoService from "@/service/GrupoTematicoService";
import { ListarGrupoTematicoDTO } from "@/service/model/ListarGrupoTematicoDTO";

const CATEGORIAS = [
  "SAUDE",
  "EDUCACAO",
  "LAZER",
  "ALIMENTACAO",
  "FINANCAS",
  "TRABALHO",
  "OUTROS",
];

export default function GrupoPage() {
  const router = useRouter();

  const [grupos, setGrupos] = useState<ListarGrupoTematicoDTO[]>([]);
  const [meusGrupos, setMeusGrupos] = useState<ListarGrupoTematicoDTO[]>([]);
  const [favoritos, setFavoritos] = useState<ListarGrupoTematicoDTO[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [carregandoMeus, setCarregandoMeus] = useState(true);
  const [carregandoFavoritos, setCarregandoFavoritos] = useState(true);

  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("");

  const carregarDados = async (termo = "") => {
    try {
      setCarregando(true);

      const data = termo
        ? await GrupoTematicoService.pesquisar(termo)
        : await GrupoTematicoService.listar();

      setGrupos(data.filter((g) => !g.banido));
    } catch (e) {
      console.log("Erro ao buscar grupos:", e);
    } finally {
      setCarregando(false);
    }
  };

  const carregarMeusGrupos = async () => {
    try {
      setCarregandoMeus(true);

      const data = await GrupoTematicoService.listarMeusGrupos();

      setMeusGrupos(data.filter((g) => !g.banido));
    } catch (e) {
      console.log("Erro ao buscar meus grupos:", e);
    } finally {
      setCarregandoMeus(false);
    }
  };

  const carregarFavoritos = async () => {
    try {
      setCarregandoFavoritos(true);

      const data = await GrupoTematicoService.listarFavoritos();

      setFavoritos(data.filter((g) => !g.banido));
    } catch (e) {
      console.log("Erro ao buscar favoritos:", e);
    } finally {
      setCarregandoFavoritos(false);
    }
  };

  useEffect(() => {
    carregarDados();
    carregarMeusGrupos();
    carregarFavoritos();
  }, []);

  useFocusEffect(
    useCallback(() => {
      carregarDados(busca);
      carregarMeusGrupos();
      carregarFavoritos();
    }, []),
  );

  const atualizarTudo = async () => {
    await carregarDados(busca);
    await carregarFavoritos();
    await carregarMeusGrupos();
  };

  const handleCategoriaPress = (cat: string) => {
    const novaCat = categoriaAtiva === cat ? "" : cat;

    setCategoriaAtiva(novaCat);

    carregarDados(novaCat);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, backgroundColor: Colors.branco }}>
        <AppHeader titulo="Grupos" logo />

        <View style={styles.searchSection}>
          <View style={styles.searchRow}>
            <TouchableOpacity onPress={() => router.push("/CriarGrupoPage")}>
              <Ionicons name="add-circle" size={50} color={Colors.azulEscuro} />
            </TouchableOpacity>

            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Pesquisar..."
                value={busca}
                onChangeText={setBusca}
                onSubmitEditing={() => carregarDados(busca)}
              />

              <TouchableOpacity
                onPress={() => carregarDados(busca)}
                style={styles.searchButton}
              >
                <Ionicons name="search" size={20} color={Colors.branco} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {CATEGORIAS.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryPill,
                    categoriaAtiva === cat && styles.categoryPillActive,
                  ]}
                  onPress={() => handleCategoriaPress(cat)}
                >
                  <AppText
                    style={[
                      styles.categoryText,
                      categoriaAtiva === cat && styles.categoryTextActive,
                    ]}
                  >
                    {cat}
                  </AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {carregando && carregandoMeus && carregandoFavoritos ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={Colors.roxo} />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            <AppText style={styles.sectionTitle}>Estou participando</AppText>

            {carregandoMeus ? (
              <ActivityIndicator size="small" color={Colors.roxo} />
            ) : meusGrupos.length === 0 ? (
              <AppText style={styles.emptyText}>
                Você ainda não participa de nenhum grupo.
              </AppText>
            ) : (
              meusGrupos.map((item) => (
                <CardGrupo
                  key={item.id}
                  id={item.id}
                  titulo={item.titulo}
                  descricao={item.descricao}
                  bairros={item.bairros}
                  isFavorito={favoritos.some((f) => f.id === item.id)}
                  onFavoritoAlterado={atualizarTudo}
                />
              ))
            )}

            <AppText style={[styles.sectionTitle, { marginTop: 20 }]}>
              Favoritos
            </AppText>

            {carregandoFavoritos ? (
              <ActivityIndicator size="small" color={Colors.roxo} />
            ) : favoritos.length === 0 ? (
              <AppText style={styles.emptyText}>
                Nenhum grupo favoritado.
              </AppText>
            ) : (
              favoritos.map((item) => (
                <CardGrupo
                  key={item.id}
                  id={item.id}
                  titulo={item.titulo}
                  descricao={item.descricao}
                  bairros={item.bairros}
                  isFavorito={true}
                  onFavoritoAlterado={atualizarTudo}
                />
              ))
            )}

            <AppText style={[styles.sectionTitle, { marginTop: 20 }]}>
              Outros grupos
            </AppText>

            {carregando ? (
              <ActivityIndicator size="small" color={Colors.roxo} />
            ) : grupos.filter(
                (g) =>
                  !meusGrupos.some((m) => m.id === g.id) &&
                  !favoritos.some((f) => f.id === g.id),
              ).length === 0 ? (
              <AppText style={styles.emptyText}>
                Nenhum grupo encontrado.
              </AppText>
            ) : (
              grupos
                .filter(
                  (g) =>
                    !meusGrupos.some((m) => m.id === g.id) &&
                    !favoritos.some((f) => f.id === g.id),
                )
                .map((item) => (
                  <CardGrupo
                    key={item.id}
                    id={item.id}
                    titulo={item.titulo}
                    descricao={item.descricao}
                    bairros={item.bairros}
                    isFavorito={false}
                    onParticipar={carregarMeusGrupos}
                    onFavoritoAlterado={atualizarTudo}
                  />
                ))
            )}
          </ScrollView>
        )}
      </View>
      <BottomBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.roxo,
  },
  header: {
    height: "10%",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "flex-end",
    backgroundColor: Colors.roxo,
    paddingRight: 30,
  },
  headerTitle: {
    fontSize: GlobalFontSize.subtitle,
    fontFamily: Fonts.bold,
    color: Colors.branco,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 15,
    backgroundColor: Colors.branco,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.azulEscuro,
    borderRadius: 25,
    height: 48,
    marginLeft: 10,
    paddingLeft: 15,
    paddingRight: 5,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: Colors.azulEscuro,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  categoriesContainer: {
    marginBottom: 10,
  },
  categoryPill: {
    backgroundColor: Colors.azulClaro,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryPillActive: {
    backgroundColor: Colors.azulEscuro,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: Colors.azulEscuro,
  },
  categoryTextActive: {
    color: Colors.branco,
  },
  list: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: Colors.branco,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: GlobalFontSize.subtitle,
    color: Colors.grafite,
    marginBottom: 12,
  },
  emptyText: {
    fontFamily: Fonts.regular,
    fontSize: GlobalFontSize.text,
    color: Colors.cinzaClaro,
    marginBottom: 10,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
