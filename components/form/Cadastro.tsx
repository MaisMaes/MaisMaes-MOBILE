import { StyleSheet, TouchableOpacity, View } from "react-native";
import Input from "../input";
import { useState } from "react";
import AppText from "../AppText";
import { Colors, GlobalFontSize } from "@/constants/GlobalStyles";
import { CadastroRequest } from "@/service/model/CadastroRequest";

export default function Cadastro() {
  const [cadastrarData, setCadastrarData] = useState({} as CadastroRequest);

  const handleCadastro = async () => {
    console.log(cadastrarData);
  }

  return (
    <View>
      <Input
        label="Nome"
        placeholder="Digite seu nome"
        required
        value={cadastrarData.nome}
        onChangeText={(text) =>
          setCadastrarData({ ...cadastrarData, nome: text })
        }
      />
      <Input
        label="Email"
        placeholder="Digite seu email"
        required
        value={cadastrarData.email}
        onChangeText={(text) =>
          setCadastrarData({ ...cadastrarData, email: text })
        }
      />
      <Input
        label="Senha"
        placeholder="Digite sua senha"
        secureTextEntry
        required
        value={cadastrarData.senha}
        onChangeText={(text) =>
          setCadastrarData({ ...cadastrarData, senha: text })
        }
      />
      <Input
        label="Confirmar senha"
        placeholder="Digite sua senha"
        secureTextEntry
        required
        value={cadastrarData.senha}
        onChangeText={(text) =>
          setCadastrarData({ ...cadastrarData, senha: text })
        }
      />
      <Input
        label="Telefone"
        placeholder="Digite seu telefone"
        required
        value={cadastrarData.telefone}
        onChangeText={(text) =>
          setCadastrarData({ ...cadastrarData, telefone: text })
        }
      />
      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <AppText style={styles.buttonText}>Enviar</AppText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.roxo,
    paddingVertical: 15,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 10,
    width: "100%",
    alignSelf: "center",
  },
  buttonText: {
    color: Colors.branco,
    fontSize: GlobalFontSize.title,
    fontWeight: "bold",
  },
});
