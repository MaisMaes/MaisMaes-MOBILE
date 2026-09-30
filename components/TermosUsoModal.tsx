import { Colors, Fonts, GlobalFontSize } from "@/constants/GlobalStyles";
import { useEffect, useState } from "react";
import {
    LayoutChangeEvent,
    Modal,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import AppButton from "./AppButton";
import AppText from "./AppText";

const TERMOS_TEXTO =
  "Ao se cadastrar na plataforma, você declara estar ciente e de acordo que, para oferecer uma experiência completa, o aplicativo poderá solicitar acesso ao microfone, à câmera e aos arquivos do seu dispositivo, sendo essas permissões utilizadas exclusivamente para funcionalidades de chat, envio de arquivos e interação segura entre usuárias. Você também compreende que, embora a plataforma se comprometa a proteger seus dados conforme a Política de Privacidade, é importante ter cuidado ao compartilhar informações pessoais em chats públicos ou em arquivos enviados, evitando divulgar dados sensíveis como endereço, documentos ou informações financeiras. O uso da plataforma deve respeitar os princípios de convivência segura e respeitosa, e ao prosseguir com o cadastro você consente com o uso das permissões mencionadas e reconhece sua responsabilidade sobre o conteúdo que decide compartilhar.";

// Margem para considerar que o scroll chegou ao fim
const SCROLL_THRESHOLD = 20;

interface TermosUsoModalProps {
  visible: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export default function TermosUsoModal({
  visible,
  onConfirm,
  onClose,
}: TermosUsoModalProps) {
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [chegouAoFim, setChegouAoFim] = useState(false);

  useEffect(() => {
    if (visible) setChegouAoFim(false);
  }, [visible]);

  const precisaScroll =
    layoutHeight > 0 && contentHeight > layoutHeight + SCROLL_THRESHOLD;
  const podeConfirmar = !precisaScroll || chegouAoFim;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - SCROLL_THRESHOLD
    ) {
      setChegouAoFim(true);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <AppText style={styles.title}>Termos de uso</AppText>
          <ScrollView
            style={styles.scroll}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            onLayout={(e: LayoutChangeEvent) =>
              setLayoutHeight(e.nativeEvent.layout.height)
            }
            onContentSizeChange={(_, h) => setContentHeight(h)}
          >
            <AppText style={styles.text}>{TERMOS_TEXTO}</AppText>
          </ScrollView>
          <AppButton
            text="Li e concordo"
            backgroundColor={Colors.roxo}
            onPress={onConfirm}
            disabled={!podeConfirmar}
            style={{ marginTop: 16 }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  container: {
    width: "100%",
    maxHeight: "70%",
    backgroundColor: Colors.branco,
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: GlobalFontSize.title,
    fontFamily: Fonts.bold,
    color: Colors.grafite,
    marginBottom: 12,
    textAlign: "center",
  },
  scroll: {
    flexGrow: 0,
  },
  text: {
    fontSize: GlobalFontSize.text,
    fontFamily: Fonts.regular,
    color: Colors.grafite,
    textAlign: "justify",
    lineHeight: 22,
  },
});
