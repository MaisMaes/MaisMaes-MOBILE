import TokenService from "@/service/TokenService";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import BottomBar from "@/components/BottomBar";
import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import PopupService from "@/utils/PopupService";

type Usuario = {
  nome: string;
  email: string;
  telefone: string;
};

export default function Profile() {

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [editando, setEditando] = useState(false);
  const [senha, setSenha] = useState("");
  const [usuarioOriginal, setUsuarioOriginal] = useState<Usuario | null>(null);

  async function buscarUsuario() {
    try {
      const token = await TokenService.getToken();

      const response = await axios.get("http://192.168.137.194:8080/usuario/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      setNome(data.nome);
      setEmail(data.email);
      setTelefone(data.telefone);
      setUsuarioOriginal(data);

    } catch (error) {
      console.log("Erro ao buscar usuário:", error);
    }
  }

  async function atualizarUsuario() {
    try {
      const token = await TokenService.getToken();

      await axios.patch(
        "http://192.168.137.194:8080/usuario/atualizar",
        {
          nome,
          email,
          telefone,
          senha,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  function cancelarEdicao() {
    if (usuarioOriginal) {
      setNome(usuarioOriginal.nome);
      setEmail(usuarioOriginal.email);
      setTelefone(usuarioOriginal.telefone);
    }

    setSenha(""); 
    setEditando(false);
  }

  const router = useRouter();
  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Perfil</Text>
      </View>
      <View style={styles.container}>
       
        <View style={styles.avatar} />
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

        </View>
        <BottomBar/>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.branco
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
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: "#c0c4cc",
    borderRadius: 20,
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
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
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
  header: {
    backgroundColor: '#B18CB1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
  },

  backIcon: {
    fontSize: 60,
    color: "#fff",
    fontWeight: 'bold'
  },
  title: {
    color: "#fff",
    fontSize: GlobalFontSize.title,
    fontWeight: "bold",
    fontFamily: Fonts.regular
  },
  headerTitle: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  }
});
