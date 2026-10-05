import AppHeader from "@/components/AppHeader";
import AppText from "@/components/AppText";
import BottomBar from "@/components/BottomBar";
import MapaOSM from "@/components/MapaOSM";
import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import DelegaciaService from "@/service/DelegaciaService";
import { DelegaciaProximaDTO } from "@/service/model/DelegaciaProximaDTO";
import PopupService from "@/utils/PopupService";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Coord = { latitude: number; longitude: number };

function formatarDistancia(km: number) {
  return km < 1
    ? `${Math.round(km * 1000)} m`
    : `${km.toFixed(1).replace(".", ",")} km`;
}

export default function DelegaciasPage() {
  const [posicao, setPosicao] = useState<Coord | null>(null);
  const [delegacias, setDelegacias] = useState<DelegaciaProximaDTO[]>([]);
  const [foco, setFoco] = useState<Coord | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [semPermissao, setSemPermissao] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setSemPermissao(false);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setSemPermissao(true);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = loc.coords;
      setPosicao({ latitude, longitude });

      setDelegacias(await DelegaciaService.listarProximas(latitude, longitude));
    } catch {
      PopupService.error("Não foi possível buscar as delegacias próximas.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const focar = (d: DelegaciaProximaDTO) =>
    setFoco({ latitude: d.latitude, longitude: d.longitude });

  const comoChegar = (d: DelegaciaProximaDTO) => {
    Linking.openURL(
      `https://www.google.com/maps/dir/?api=1&destination=${d.latitude},${d.longitude}`,
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader titulo="Delegacias" showBack/>

      <View style={styles.content}>
        {carregando ? (
          <ActivityIndicator
            size="large"
            color={Colors.roxo}
            style={{ marginTop: 40 }}
          />
        ) : !posicao ? (
          <View style={styles.aviso}>
            <AppText style={styles.emptyText}>
              {semPermissao
                ? "Precisamos da sua localização para mostrar as delegacias mais próximas."
                : "Não foi possível obter sua localização."}
            </AppText>
            <TouchableOpacity style={styles.btn} onPress={carregar}>
              <AppText style={styles.btnText}>Tentar novamente</AppText>
            </TouchableOpacity>
            {semPermissao && (
              <TouchableOpacity onPress={() => Linking.openSettings()}>
                <AppText style={styles.link}>Abrir configurações</AppText>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            <MapaOSM centro={posicao} pontos={delegacias} foco={foco} />

            <ScrollView contentContainerStyle={styles.lista}>
              <AppText style={styles.sectionTitle}>Mais próximas</AppText>

              {delegacias.length === 0 ? (
                <AppText style={styles.emptyText}>
                  Nenhuma delegacia encontrada nas proximidades.
                </AppText>
              ) : (
                delegacias.map((d) => (
                  <TouchableOpacity
                    key={d.id}
                    style={styles.card}
                    activeOpacity={0.7}
                    onPress={() => focar(d)}
                  >
                    <View style={{ flex: 1 }}>
                      <AppText style={styles.cardTitulo}>{d.nome}</AppText>
                      {!!d.endereco && (
                        <AppText style={styles.cardTexto}>{d.endereco}</AppText>
                      )}
                      <AppText style={styles.cardDistancia}>
                        {formatarDistancia(d.distanciaKm)}
                      </AppText>
                    </View>
                    <Pressable onPress={() => comoChegar(d)} hitSlop={10}>
                      <Ionicons
                        name="navigate-circle-outline"
                        size={34}
                        color={Colors.roxo}
                      />
                    </Pressable>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </>
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
  content: {
    flex: 1,
    backgroundColor: Colors.branco,
  },
  lista: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 140, // espaço para a BottomBar flutuante
  },
  sectionTitle: {
    fontSize: GlobalFontSize.title,
    fontFamily: Fonts.bold,
    color: Colors.azulEscuro,
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: Colors.branco,
    borderWidth: 1.5,
    borderColor: Colors.cinzaClaro,
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
  },
  cardTitulo: {
    fontSize: GlobalFontSize.subtitle,
    fontFamily: Fonts.semiBold,
    color: Colors.grafite,
  },
  cardTexto: {
    fontSize: GlobalFontSize.text,
    color: Colors.cinzaClaro,
  },
  cardDistancia: {
    fontSize: GlobalFontSize.text,
    fontFamily: Fonts.semiBold,
    color: Colors.roxo,
    marginTop: 2,
  },
  aviso: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },
  emptyText: {
    fontSize: GlobalFontSize.text,
    color: Colors.cinzaClaro,
    textAlign: "center",
  },
  btn: {
    backgroundColor: Colors.roxo,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 15,
    marginTop: 16,
  },
  btnText: {
    color: Colors.branco,
    fontFamily: Fonts.semiBold,
  },
  link: {
    color: Colors.roxo,
    fontFamily: Fonts.semiBold,
    marginTop: 14,
  },
});
