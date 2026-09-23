import AppText from "@/components/AppText";
import TermosUsoModal from "@/components/TermosUsoModal";
import { Colors, GlobalFontSize } from "@/constants/GlobalStyles";
import UsuarioService from "@/service/UsuarioService";
import { CadastroRequest } from "@/service/model/CadastroRequest";
import PopupService from "@/utils/PopupService";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import AppButton from "../AppButton";
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
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [modalTermosVisivel, setModalTermosVisivel] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};

    if (!cadastrarData.nome.trim()) e.nome = "Nome é obrigatório.";

    if (!cadastrarData.email.trim()) e.email = "Email é obrigatório.";
    else if (!EMAIL_REGEX.test(cadastrarData.email))
      e.email = "Informe um email válido. Ex: exemplo@dominio.com";

    if (!cadastrarData.senha) e.senha = "Senha é obrigatória.";
    else if (!SENHA_REGEX.test(cadastrarData.senha))
      e.senha =
        "Mín. 8 caracteres, 1 maiúsculo, 1 minúsculo, 1 número e 1 especial.";

    if (!confirmarSenha) e.confirmarSenha = "Confirme sua senha.";
    else if (confirmarSenha !== cadastrarData.senha)
      e.confirmarSenha = "As senhas não coincidem.";

    const digits = cadastrarData.telefone.replace(/\D/g, "");
    if (!digits) e.telefone = "Telefone é obrigatório.";
    else if (digits.length < 11)
      e.telefone = "Telefone inválido. Ex: (00) 90000-0000";

    if (!aceitouTermos) e.termos = "Você precisa aceitar os termos de uso.";

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
      await UsuarioService.cadastrar(cadastrarData);
      PopupService.success(
        "Cadastro realizado com sucesso! Uma mensagem de ativação foi enviada para o seu email.",
      );
      setTimeout(() => router.replace("/StartPage"), 2000);
    } catch (error: any) {
      const message =
        error?.response?.data?.error ?? "Falha no cadastro. Tente novamente.";
      PopupService.error(message);
    }
  };

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
        errorMessage={errors.nome}
      />
      <Input
        label="Email"
        placeholder="Digite seu email"
        required
        value={cadastrarData.email}
        onChangeText={(text) =>
          setCadastrarData({ ...cadastrarData, email: text })
        }
        errorMessage={errors.email}
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
      <View style={styles.termosContainer}>
        <TouchableOpacity
          style={styles.radio}
          onPress={() => setAceitouTermos(!aceitouTermos)}
          accessibilityRole="radio"
          accessibilityState={{ checked: aceitouTermos }}
        >
          {aceitouTermos && <View style={styles.radioSelecionado} />}
        </TouchableOpacity>
        <AppText style={styles.termosTexto}>
          Eu li e concordo com os{" "}
          <AppText
            style={styles.termosLink}
            onPress={() => setModalTermosVisivel(true)}
          >
            termos
          </AppText>{" "}
          de uso
        </AppText>
      </View>
      {errors.termos && <AppText style={styles.erro}>{errors.termos}</AppText>}
      <AppButton
        text="Enviar"
        backgroundColor={Colors.roxo}
        onPress={handleCadastro}
        style={{ marginTop: 20 }}
      />
      <TermosUsoModal
        visible={modalTermosVisivel}
        onClose={() => setModalTermosVisivel(false)}
        onConfirm={() => {
          setAceitouTermos(true);
          setModalTermosVisivel(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  termosContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.roxo,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioSelecionado: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.roxo,
  },
  termosTexto: {
    fontSize: GlobalFontSize.text,
    color: Colors.grafite,
    flexShrink: 1,
  },
  termosLink: {
    color: Colors.roxo,
    textDecorationLine: "underline",
  },
  erro: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
});
