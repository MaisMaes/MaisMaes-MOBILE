import AppText from "../AppText";
import { Colors, GlobalFontSize } from "@/constants/GlobalStyles";
import UsuarioService from "@/service/UsuarioService";
import { CadastroRequest } from "@/service/model/CadastroRequest";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Input from "../input";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SENHA_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

function applyPhoneMask(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export default function Cadastro() {
  const [cadastrarData, setCadastrarData] = useState<CadastroRequest>({
    nome: "",
    email: "",
    senha: "",
    telefone: "",
  });
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};

    if (!cadastrarData.nome.trim())
      e.nome = "Nome é obrigatório.";

    if (!cadastrarData.email.trim())
      e.email = "Email é obrigatório.";
    else if (!EMAIL_REGEX.test(cadastrarData.email))
      e.email = "Informe um email válido. Ex: exemplo@dominio.com";

    if (!cadastrarData.senha)
      e.senha = "Senha é obrigatória.";
    else if (!SENHA_REGEX.test(cadastrarData.senha))
      e.senha = "Mín. 8 caracteres, 1 maiúsculo, 1 minúsculo, 1 número e 1 especial.";

    if (!confirmarSenha)
      e.confirmarSenha = "Confirme sua senha.";
    else if (confirmarSenha !== cadastrarData.senha)
      e.confirmarSenha = "As senhas não coincidem.";

    const digits = cadastrarData.telefone.replace(/\D/g, "");
    if (!digits)
      e.telefone = "Telefone é obrigatório.";
    else if (digits.length < 11)
      e.telefone = "Telefone inválido. Ex: (00) 90000-0000";

    return e;
  };

  const handleCadastro = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTimeout(() => setErrors({}), 5000);
      return;
    }
    try {
      const response = await UsuarioService.cadastrar(cadastrarData);
      console.log("Token:", response.token);
    } catch (error) {
      console.error("Erro no cadastro:", error);
    }
  };

  return (
    <View>
      <Input
        label="Nome"
        placeholder="Digite seu nome"
        required
        value={cadastrarData.nome}
        onChangeText={(text) => setCadastrarData({ ...cadastrarData, nome: text })}
        errorMessage={errors.nome}
      />
      <Input
        label="Email"
        placeholder="Digite seu email"
        required
        value={cadastrarData.email}
        onChangeText={(text) => setCadastrarData({ ...cadastrarData, email: text })}
        errorMessage={errors.email}
      />
      <Input
        label="Senha"
        placeholder="Digite sua senha"
        secureTextEntry
        required
        value={cadastrarData.senha}
        onChangeText={(text) => setCadastrarData({ ...cadastrarData, senha: text })}
        errorMessage={errors.senha}
      />
      <Input
        label="Confirmar senha"
        placeholder="Confirme sua senha"
        secureTextEntry
        required
        value={confirmarSenha}
        onChangeText={setConfirmarSenha}
        errorMessage={errors.confirmarSenha}
      />
      <Input
        label="Telefone"
        placeholder="DDD 90000-0000"
        required
        value={cadastrarData.telefone}
        onChangeText={(text) =>
          setCadastrarData({ ...cadastrarData, telefone: applyPhoneMask(text) })
        }
        errorMessage={errors.telefone}
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
