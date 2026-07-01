import AppHeader from "@/components/AppHeader";
import AppText from "@/components/AppText";
import BottomBar from "@/components/BottomBar";
import CardGrupo from "@/components/CardGrupo";
import CardNoticia from "@/components/CardNoticia";
import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import InfoCardService, { InfoCard } from "@/service/InfoCardService";
import GrupoTematicoService from "@/service/GrupoTematicoService";
import { ListarGrupoTematicoDTO } from "@/service/model/ListarGrupoTematicoDTO";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatsPage() {
  const router = useRouter();
  const [meusGrupos, setMeusGrupos] = useState<ListarGrupoTematicoDTO[]>([]);
  const [destaques, setDestaques] = useState<InfoCard[]>([]);
  const [carregandoDestaques, setCarregandoDestaques] = useState(true);

  const carregarMeusGrupos = async () => {
    try {
      const data = await GrupoTematicoService.listarMeusGrupos();
      setMeusGrupos(data.filter((g) => !g.banido));
    } catch (e) {
      console.log("Erro ao buscar meus grupos:", e);
    }
  };

  const carregarDestaques = async () => {
    try {
      setCarregandoDestaques(true);
      const data = await InfoCardService.listarDestaques();
      setDestaques(data);
    } catch (e) {
      console.log("Erro ao buscar destaques:", e);
    } finally {
      setCarregandoDestaques(false);
    }
  };

  useEffect(() => {
      carregarMeusGrupos();
      carregarDestaques();
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      <AppHeader titulo="Início" logo/>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <View style={styles.sectionHeader}>
          <AppText style={styles.sectionTitle}>Meus Grupos</AppText>
        </View>
        <View>
            {meusGrupos.length === 0 ? (
              <AppText style={styles.emptyText}>Você ainda não participa de nenhum grupo.</AppText>
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
        </View>

        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <AppText style={styles.sectionTitle}>Destaques</AppText>
        </View>

        {carregandoDestaques ? (
          <ActivityIndicator size="small" color={Colors.roxo} style={{ marginTop: 12 }} />
        ) : destaques.length === 0 ? (
          <AppText style={styles.emptyText}>Nenhum destaque no momento.</AppText>
        ) : (
          destaques.map((item) => (
            <CardNoticia
              key={item.id}
              noticia={item}
              onPress={() =>
                router.push({ pathname: "/DetalheNoticiaPage", params: { id: item.id } })
              }
            />
          ))
        )}
      </ScrollView>
      <BottomBar/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.roxo,
  },
  content: {
    backgroundColor: Colors.branco,
    flex: 1,
  },
  contentInner: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 100,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: GlobalFontSize.title,
    fontFamily: Fonts.bold,
    color: Colors.azulEscuro,
  },
  emptyText: {
    fontSize: GlobalFontSize.text,
    color: Colors.cinzaClaro,
    marginBottom: 10,
  },
});
