import AppText from "@/components/AppText";
import BottomBar from "@/components/BottomBar";
import CardGrupo from "@/components/CardGrupo";
import { Colors, GlobalFontSize } from "@/constants/GlobalStyles";
import GrupoTematicoService from "@/service/GrupoTematicoService";
import { ListarGrupoTematicoDTO } from "@/service/model/ListarGrupoTematicoDTO";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatsPage() {
  const [meusGrupos, setMeusGrupos] = useState<ListarGrupoTematicoDTO[]>([]);

  const carregarMeusGrupos = async () => {
    try {
      const data = await GrupoTematicoService.listarMeusGrupos();
      setMeusGrupos(data);
    } catch (e) {
      console.log("Erro ao buscar meus grupos:", e);
    }
  };

  useEffect(() => {
      carregarMeusGrupos();
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.content}>
        <View style={{flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20}}>
            <AppText style={{fontSize: GlobalFontSize.title, color: Colors.azulEscuro}}>Grupos</AppText>
            <AppText style={{fontSize: GlobalFontSize.subtitle, color: Colors.cinzaClaro}}>Ver mais</AppText>
        </View>
        <View>
            {meusGrupos.map((item) => (
              <CardGrupo
                key={item.id}
                id={item.id}
                titulo={item.titulo}
                descricao={item.descricao}
                bairros={item.bairros}
              />
            ))}
        </View>
      </View>
      <BottomBar/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.roxo,
  },
  content:{
    backgroundColor: Colors.branco,
    paddingHorizontal: 20,
    paddingTop: 15,
    flex: 1
  }
});
