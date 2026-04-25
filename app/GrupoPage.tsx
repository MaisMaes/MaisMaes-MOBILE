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
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import AppText from "@/components/AppText";
import CardGrupo from "@/components/CardGrupo";
import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import GrupoTematicoService from "@/service/GrupoTematicoService";
import { ListarGrupoTematicoDTO } from "@/service/model/ListarGrupoTematicoDTO";
import BottomBar from "@/components/BottomBar";

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
  const [carregando, setCarregando] = useState(true);
  const [carregandoMeus, setCarregandoMeus] = useState(true);

  const [busca, setBusca] = useState("");
  const [categoriaAtiva, setCategoriaAtiva] = useState("");

  const carregarDados = async (termo = "") => {
    try {
      setCarregando(true);
      const data = termo
        ? await GrupoTematicoService.pesquisar(termo)
        : await GrupoTematicoService.listar();
      setGrupos(data);
    } catch (e) {
      console.log("Erro ao buscar dados:", e);
    } finally {
      setCarregando(false);
    }
  };

  const carregarMeusGrupos = async () => {
    try {
      setCarregandoMeus(true);
      const data = await GrupoTematicoService.listarMeusGrupos();
      setMeusGrupos(data);
    } catch (e) {
      console.log("Erro ao buscar meus grupos:", e);
    } finally {
      setCarregandoMeus(false);
    }
  };

  useEffect(() => {
    carregarDados();
    carregarMeusGrupos();
  }, []);

  const handleCategoriaPress = (cat: string) => {
    const novaCat = categoriaAtiva === cat ? "" : cat;
    setCategoriaAtiva(novaCat);
    carregarDados(novaCat);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>Grupos</AppText>
      </View>

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

      {carregando && carregandoMeus ? (
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
              />
            ))
          )}

          <AppText style={[styles.sectionTitle, { marginTop: 20 }]}>
            Outros grupos
          </AppText>
          {carregando ? (
            <ActivityIndicator size="small" color={Colors.roxo} />
          ) : grupos.length === 0 ? (
            <AppText style={styles.emptyText}>Nenhum grupo encontrado.</AppText>
          ) : (
            grupos.map((item) => (
              <CardGrupo
                key={item.id}
                id={item.id}
                titulo={item.titulo}
                descricao={item.descricao}
                bairros={item.bairros}
              />
            ))
          )}
        </ScrollView>
      )}
      <BottomBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.branco
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
    fontSize: GlobalFontSize.title,
    fontFamily: Fonts.bold,
    color: Colors.branco,
  },

  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 15,
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
  // FIM ESTILOS BUSCA
  list: {
    padding: 20,
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
