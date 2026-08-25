import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import AppText from "@/components/AppText";
import { Colors, Fonts } from "@/constants/GlobalStyles";
import GrupoTematicoService from "@/service/GrupoTematicoService";
import PopupService from "@/utils/PopupService";

const CATEGORIAS = [
  "SAUDE",
  "EDUCACAO",
  "LAZER",
  "ALIMENTACAO",
  "FINANCAS",
  "TRABALHO",
  "OUTROS",
];

const LISTA_BAIRROS = [
  "BARRA_DE_JANGADA",
  "CANDEIAS",
  "PIEDADE",
  "JARDIM_PIEDADE",
  "PRAZERES",
  "CAJUEIRO_SECO",
  "COMPORTAS",
  "GUARARAPES",
  "JARDIM_JORDAO",
  "CAVALEIRO",
  "DOIS_CARNEIROS",
  "SUCUPIRA",
  "ZUMBI_DO_PACHECO",
  "CURADO_I",
  "CURADO_II",
  "CURADO_III",
  "CURADO_IV",
  "MURIBECA",
  "MARCOS_FREIRE",
  "CENTRO",
  "VILA_RICA",
  "VISTA_ALEGRE",
  "SOCORRO",
  "SANTO_ALEIXO",
  "ENGENHO_VELHO",
  "MANASSU",
  "FLORIANO",
  "SANTANA",
  "VARGEM_FRIA",
];

export default function CriarGrupoForm() {
  const router = useRouter();

  // Estados do Formulário
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [privado, setPrivado] = useState(false);
  const [categoria, setCategoria] = useState("OUTROS");
  const [bairrosSelecionados, setBairrosSelecionados] = useState<string[]>([]);
  const [participantes, setParticipantes] = useState("100");
  const [tempoMensagens, setTempoMensagens] = useState("0");

  // Controle de UI
  const [showBairros, setShowBairros] = useState(false);

  // Estados de Mídia
  const [video, setVideo] = useState(false);
  const [audio, setAudio] = useState(false);
  const [imagem, setImagem] = useState(false);
  const [documento, setDocumento] = useState(false);

  const toggleBairro = (bairro: string) => {
    setBairrosSelecionados((prev) =>
      prev.includes(bairro)
        ? prev.filter((b) => b !== bairro)
        : [...prev, bairro],
    );
  };

  const handleCriar = async () => {
    if (!nome || !descricao || bairrosSelecionados.length === 0) {
      PopupService.info(
        "Preencha o nome, descrição e selecione ao menos um bairro.",
      );
      return;
    }

    try {
      await GrupoTematicoService.criar({
        titulo: nome,
        descricao,
        categorias: categoria,
        bairros: bairrosSelecionados,
        privado,
        numeroParticipantes: Number(participantes),
        tempoEntreMensagens: Number(tempoMensagens),
        video,
        audio,
        imagem,
        documento,
      });
      PopupService.success("Grupo criado com sucesso!");
      router.back();
    } catch (error: any) {
      const message =
        error?.response?.data?.error ?? "Não foi possível criar o grupo.";
      PopupService.error(message);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Nome do Grupo */}
        <AppText style={styles.sectionTitle}>Nome do grupo</AppText>
        <TextInput
          placeholder="Digite o nome do grupo"
          placeholderTextColor={Colors.cinzaClaro}
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />

        {/* Descrição */}
        <AppText style={styles.sectionTitle}>Descrição</AppText>
        <TextInput
          placeholder="Descreva o objetivo do grupo"
          placeholderTextColor={Colors.cinzaClaro}
          value={descricao}
          onChangeText={setDescricao}
          style={[styles.input, styles.textArea]}
          multiline
        />

        <View style={styles.selectorBox}>
          <AppText style={styles.label}>Grupo Privado</AppText>
          <Switch
            value={privado}
            onValueChange={setPrivado}
            trackColor={{ false: Colors.cinzaClaro, true: Colors.roxo + "77" }}
            thumbColor={privado ? Colors.roxo : Colors.cinzaClaro}
          />
        </View>

        {/*Bairros */}
        <AppText style={styles.sectionTitle}>Bairros</AppText>
        <TouchableOpacity
          style={styles.selectorBox}
          onPress={() => setShowBairros(!showBairros)}
          activeOpacity={0.7}
        >
          <AppText style={styles.label}>
            {bairrosSelecionados.length > 0
              ? `${bairrosSelecionados.length} bairro(s) selecionado(s)`
              : "Selecione os bairros"}
          </AppText>
          <Ionicons
            name={
              showBairros
                ? "chevron-up-circle-outline"
                : "chevron-down-circle-outline"
            }
            size={24}
            color={Colors.roxo}
          />
        </TouchableOpacity>

        {showBairros && (
          <View style={styles.dropdown}>
            <ScrollView nestedScrollEnabled={true} style={{ maxHeight: 200 }}>
              {LISTA_BAIRROS.map((b) => (
                <TouchableOpacity
                  key={b}
                  style={styles.dropOption}
                  onPress={() => toggleBairro(b)}
                >
                  <Ionicons
                    name={
                      bairrosSelecionados.includes(b)
                        ? "checkbox"
                        : "square-outline"
                    }
                    size={20}
                    color={Colors.roxo}
                  />
                  <AppText style={styles.dropText}>
                    {b.replace(/_/g, " ")}
                  </AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Categoria */}
        <AppText style={styles.sectionTitle}>Selecione a categoria</AppText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catScroll}
        >
          {CATEGORIAS.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategoria(cat)}
              style={[
                styles.catPill,
                categoria === cat && styles.catPillActive,
              ]}
            >
              <AppText
                style={[
                  styles.catText,
                  categoria === cat && { color: Colors.branco },
                ]}
              >
                {cat}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <AppText style={styles.sectionTitle}>Mídias permitidas</AppText>
        <View style={styles.mediaGrid}>
          <View style={styles.mediaItem}>
            <AppText style={styles.mediaLabel}>Vídeo</AppText>
            <Switch value={video} onValueChange={setVideo} />
          </View>
          <View style={styles.mediaItem}>
            <AppText style={styles.mediaLabel}>Áudio</AppText>
            <Switch value={audio} onValueChange={setAudio} />
          </View>
          <View style={styles.mediaItem}>
            <AppText style={styles.mediaLabel}>Imagem</AppText>
            <Switch value={imagem} onValueChange={setImagem} />
          </View>
          <View style={styles.mediaItem}>
            <AppText style={styles.mediaLabel}>Documento</AppText>
            <Switch value={documento} onValueChange={setDocumento} />
          </View>
        </View>

        <View style={styles.inputGroupRow}>
          <View style={styles.inputHalf}>
            <AppText style={styles.labelSmall}>Máximo participantes:</AppText>
            <TextInput
              value={participantes}
              onChangeText={setParticipantes}
              keyboardType="numeric"
              style={styles.inputSmall}
            />
          </View>
          <View style={styles.inputHalf}>
            <AppText style={styles.labelSmall}>Tempo msgs (min):</AppText>
            <TextInput
              value={tempoMensagens}
              onChangeText={setTempoMensagens}
              keyboardType="numeric"
              style={styles.inputSmall}
            />
          </View>
        </View>
      </ScrollView>

      {/* Botão de Ação */}
      <TouchableOpacity style={styles.btnCriar} onPress={handleCriar}>
        <AppText style={styles.btnText}>Criar</AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1.5,
    borderColor: Colors.grafite,
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    backgroundColor: Colors.branco,
    fontFamily: Fonts.regular,
    color: Colors.grafite,
  },
  textArea: {
    height: 90,
    textAlignVertical: "top",
  },
  selectorBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: Colors.cinzaClaro,
    borderRadius: 25,
    padding: 12,
    marginBottom: 15,
    backgroundColor: Colors.branco,
  },
  label: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.grafite,
  },
  sectionTitle: {
    fontFamily: Fonts.semiBold,
    fontSize: 14,
    marginBottom: 10,
    marginTop: 5,
    color: Colors.grafite,
  },
  dropdown: {
    backgroundColor: Colors.branco,
    borderWidth: 1.5,
    borderColor: Colors.cinzaClaro,
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
  },
  dropOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.branco,
  },
  dropText: {
    marginLeft: 10,
    fontSize: 13,
    fontFamily: Fonts.regular,
    textTransform: "capitalize",
  },
  catScroll: {
    marginBottom: 20,
  },
  catPill: {
    backgroundColor: Colors.branco,
    borderWidth: 1,
    borderColor: Colors.cinzaClaro,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 6,
    marginRight: 8,
    height: 35,
    justifyContent: "center",
  },
  catPillActive: {
    backgroundColor: Colors.roxo,
    borderColor: Colors.roxo,
  },
  catText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
  },
  mediaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  mediaItem: {
    width: "48%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.branco,
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: Colors.cinzaClaro,
  },
  mediaLabel: {
    fontSize: 13,
    fontFamily: Fonts.regular,
  },
  inputGroupRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  inputHalf: {
    width: "48%",
  },
  labelSmall: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    marginBottom: 5,
    color: Colors.grafite,
  },
  inputSmall: {
    borderWidth: 1.5,
    borderColor: Colors.cinzaClaro,
    borderRadius: 15,
    padding: 8,
    textAlign: "center",
    backgroundColor: Colors.branco,
    fontFamily: Fonts.regular,
  },
  btnCriar: {
    backgroundColor: Colors.roxo,
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
  },
  btnText: {
    color: Colors.branco,
    fontSize: 20,
    fontFamily: Fonts.semiBold,
  },
});
