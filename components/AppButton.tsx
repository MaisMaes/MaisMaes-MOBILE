import { Colors, GlobalFontSize } from "@/constants/GlobalStyles";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import AppText from "./AppText";

interface AppButtonProps {
  text: string;
  backgroundColor: any;
  onPress: () => void;
  width?: any;
  borderRadius?: number;
  textColor?: string;
  style?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
}

export default function AppButton({
  text,
  backgroundColor,
  onPress,
  width = "100%",
  borderRadius = 24,
  textColor = Colors.branco,
  style,
  disabled = false,
  loading = false,
}: AppButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor,
          width,
          borderRadius,
        },
        style,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityState={{ busy: loading, disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator color={textColor} style={styles.spinner} />
      ) : (
        <AppText style={[styles.buttonText, { color: textColor }]}>
          {text}
        </AppText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    alignItems: "center",
    alignSelf: "center",
  },
  buttonText: {
    fontSize: GlobalFontSize.title,
    fontWeight: "bold",
  },
  disabled: {
    opacity: 0.5,
  },
  spinner: {
    height: GlobalFontSize.title * 1.4,
  },
});
