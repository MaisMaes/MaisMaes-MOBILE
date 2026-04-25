import AppText from "@/components/AppText";
import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const CATEGORIAS = [
  "SAUDE",
  "EDUCACAO",
  "LAZER",
  "ALIMENTACAO",
  "FINANCAS",
  "TRABALHO",
  "OUTROS",
];

export default function CriarGrupoForm() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [privado, setPrivado] = useState(false);
  const [bairro, setBairro] = useState("");
  const [categoria, setCategoria] = useState("");
  const [participantes, setParticipantes] = useState("100");

  const [video, setVideo] = useState(false);
  const [audio, setAudio] = useState(false);
  const [imagem, setImagem] = useState(false);
  const [documento, setDocumento] = useState(false);

  const handleCriar = async () => {
    const body = {
      titulo: nome,
      descricao,
      categorias: categoria,
      bairro,
      privado,
      numeroParticipantes: Number(participantes),
      video,
      audio,
      imagem,
      documento,
    };

    console.log(body);

    await fetch("http://SEU_IP:8080/grupo-tematico/criar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TextInput
          placeholder="Nome do grupo"
          placeholderTextColor={Colors.cinzaClaro}
          value={nome}
          onChangeText={setNome}
          style={styles.input}
        />

        <TextInput
          placeholder="Descrição do grupo"
          placeholderTextColor={Colors.cinzaClaro}
          value={descricao}
          onChangeText={setDescricao}
          style={[styles.input, styles.textArea]}
          multiline
        />

        <View style={styles.row}>
          <AppText style={styles.label}>Grupo Privado</AppText>
          <Switch value={privado} onValueChange={setPrivado} />
        </View>

        <View style={{ marginBottom: 15 }}>
          <AppText style={styles.label}>Categorias</AppText>

          <View style={styles.optionsContainer}>
            {CATEGORIAS.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.option,
                  categoria === item && styles.optionSelected,
                ]}
                onPress={() => setCategoria(item)}
              >
                <AppText style={styles.optionText}>{item}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TextInput
          placeholder="Bairro"
          placeholderTextColor={Colors.cinzaClaro}
          value={bairro}
          onChangeText={setBairro}
          style={styles.input}
        />

        <TextInput
          value={participantes}
          placeholder="Total de participantes permitidos (Max 100)"
          onChangeText={setParticipantes}
          keyboardType="numeric"
          style={styles.input}
        />


        <AppText style={styles.label}>Mídias permitidas</AppText>

        <View style={styles.row}>
          <AppText>Vídeo</AppText>
          <Switch value={video} onValueChange={setVideo} />
        </View>

        <View style={styles.row}>
          <AppText>Áudio</AppText>
          <Switch value={audio} onValueChange={setAudio} />
        </View>

        <View style={styles.row}>
          <AppText>Imagem</AppText>
          <Switch value={imagem} onValueChange={setImagem} />
        </View>

        <View style={styles.row}>
          <AppText>Documento</AppText>
          <Switch value={documento} onValueChange={setDocumento} />
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleCriar}>
        <AppText style={styles.buttonText}>Criar</AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.azulClaro,
    paddingHorizontal: 20,
    paddingTop: 20,
    justifyContent: "space-between",
  },

  input: {
    borderWidth: 1,
    borderColor: Colors.cinzaClaro,
    borderRadius: 16,
    padding: 12,
    marginBottom: 15,
    backgroundColor: Colors.branco,
    fontFamily: Fonts.regular,
    color: Colors.grafite,
  },

  textArea: {
    height: 100,
    textAlignVertical: "top",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  label: {
    fontSize: GlobalFontSize.subtitle,
    fontFamily: Fonts.semiBold,
    color: Colors.grafite,
  },

  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },

  option: {
    borderWidth: 1,
    borderColor: Colors.cinzaClaro,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: Colors.branco,
  },

  optionSelected: {
    backgroundColor: Colors.roxo + "33",
    borderColor: Colors.roxo,
  },

  optionText: {
    fontFamily: Fonts.regular,
  },

  button: {
    backgroundColor: Colors.roxo,
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: "center",
    marginVertical: 20,
  },

  buttonText: {
    color: Colors.branco,
    fontSize: GlobalFontSize.title,
    fontFamily: Fonts.semiBold,
  },
});