import AppHeader from "@/components/AppHeader";
import BottomBar from "@/components/BottomBar";
import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import TokenService from "@/service/TokenService";
import UsuarioService, { UsuarioMe } from "@/service/UsuarioService";
import PopupService from "@/utils/PopupService";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import {
    StyleSheet,
    Alert,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Usuario = UsuarioMe;

export default function Profile() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [editando, setEditando] = useState(false);
  const [senha, setSenha] = useState("");
  const [usuarioOriginal, setUsuarioOriginal] = useState<Usuario | null>(null);
  const [foto, setFoto] = useState<string | null>(null);
  const [enviandoFoto, setEnviandoFoto] = useState(false);

async function buscarUsuario() {
  try {
    const data = await UsuarioService.me();

    setNome(data.nome);
    setEmail(data.email);
    setTelefone(data.telefone);
    setUsuarioOriginal(data);

    const urlFoto = await UsuarioService.buscarFoto();

    console.log("URL DA FOTO:", urlFoto);
    console.log("TIPO:", typeof urlFoto);

    setFoto(urlFoto);
  } catch (error) {
    console.log("Erro ao buscar usuário:", error);
  }
}

  async function atualizarUsuario() {
    try {
      await UsuarioService.atualizar({ nome, email, telefone, senha });
      PopupService.success("Perfil atualizado com sucesso!");
      setEditando(false);
    } catch (error) {
      console.log(error);
      PopupService.error("Erro ao atualizar perfil. Tente novamente.");
    }
  }

  useEffect(() => {
    buscarUsuario();
  }, []);

  async function sair() {
    await TokenService.removeToken();
    router.replace("/");
  }

  function cancelarEdicao() {
    if (usuarioOriginal) {
      setNome(usuarioOriginal.nome);
      setEmail(usuarioOriginal.email);
      setTelefone(usuarioOriginal.telefone);
    }

    setSenha("");
    setEditando(false);
  }

  async function alterarFoto() {
  try {
    const permissao =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissao.granted) {
      Alert.alert(
        "Permissão necessária",
        "Precisamos de acesso à galeria para escolher uma foto."
      );

      return;
    }

    const resultado =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

    if (resultado.canceled) {
      return;
    }

    const imagemSelecionada = resultado.assets[0];

    if (!usuarioOriginal) {
      PopupService.error(
        "Não foi possível identificar o usuário."
      );

      return;
    }

    setEnviandoFoto(true);

    await UsuarioService.atualizarFoto(
      usuarioOriginal.id,
      imagemSelecionada.uri
    );

    const novaFoto = await UsuarioService.buscarFoto();

    setFoto(novaFoto);

    PopupService.success(
      "Foto atualizada com sucesso!"
    );
  } catch (error) {
    console.log("Erro ao alterar foto:", error);

    PopupService.error(
      "Não foi possível atualizar a foto."
    );
  } finally {
    setEnviandoFoto(false);
  }
}

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader titulo="Perfil" logo />

      <View style={styles.content}>
        <View style={styles.profileImageContainer}>
         {foto ? (
        <Image
          source={{ uri: foto }}
          style={styles.profileImage}
        />
      ) : (
        <View style={styles.profileImagePlaceholder}>
          <Text style={styles.profileImagePlaceholderText}>
            {nome
              ? nome.charAt(0).toUpperCase()
              : "..."}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.editPhotoButton}
        onPress={alterarFoto}
        disabled={enviandoFoto}
      >
        <Text style={styles.editPhotoText}>
          {enviandoFoto ? "..." : "✎"}
        </Text>
      </TouchableOpacity>
    </View>
        <Text style={styles.greeting}>Olá, {nome}</Text>
        <TextInput
          style={styles.input}
          value={nome}
          editable={editando}
          onChangeText={setNome}
        />

        <TextInput
          style={styles.input}
          value={email}
          editable={editando}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="********"
          secureTextEntry
          editable={editando}
          onChangeText={setSenha}
        />

        <TextInput
          style={styles.input}
          value={telefone}
          editable={editando}
          onChangeText={setTelefone}
        />

        <View style={styles.buttonContainer}>
          {editando && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={cancelarEdicao}
            >
              <Text style={styles.saveText}>Cancelar</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => {
              if (editando) {
                atualizarUsuario();
              } else {
                setEditando(true);
              }
            }}
          >
            <Text style={styles.saveText}>
              {editando ? "Salvar" : "Editar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={sair}>
            <Text style={styles.saveText}>Sair</Text>
          </TouchableOpacity>
        </View>
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.branco,
  },
  cancelButton: {
    height: 45,
    width: 120,
    marginRight: 10,
    backgroundColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.roxo,
    marginBottom: 30,
  },
  input: {
    width: "80%",
    height: 45,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "80%",
    height: 50,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  logoutButton: {
    height: 45,
    width: 100,
    marginLeft: 10,
    backgroundColor: "#d9534f",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
    alignItems: "center",
  },
  deleteButton: {
    width: 60,
    height: 45,
    backgroundColor: "#999",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginRight: 15,
  },
  saveButton: {
    height: 45,
    width: 140,
    paddingHorizontal: 20,
    backgroundColor: Colors.roxo,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
  },
  backIcon: {
    fontSize: 60,
    color: "#fff",
    fontWeight: "bold",
  },
  title: {
    color: "#fff",
    fontSize: GlobalFontSize.title,
    fontWeight: "bold",
    fontFamily: Fonts.regular,
  },
  headerTitle: {
    fontSize: GlobalFontSize.subtitle,
    fontFamily: Fonts.bold,
    color: Colors.branco,
  },
  profileImageContainer: {
  position: "relative",
  marginBottom: 20,
},

profileImage: {
  width: 120,
  height: 120,
  borderRadius: 60,
  borderWidth: 3,
  borderColor: Colors.roxo,
},

profileImagePlaceholder: {
  width: 120,
  height: 120,
  borderRadius: 60,
  backgroundColor: Colors.roxo,
  justifyContent: "center",
  alignItems: "center",
},

profileImagePlaceholderText: {
  color: Colors.branco,
  fontSize: 45,
  fontWeight: "bold",
},

editPhotoButton: {
  position: "absolute",
  right: -5,
  bottom: 0,
  width: 38,
  height: 38,
  borderRadius: 19,
  backgroundColor: Colors.roxo,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 3,
  borderColor: Colors.branco,
},

editPhotoText: {
  color: Colors.branco,
  fontSize: 20,
  fontWeight: "bold",
},
});


