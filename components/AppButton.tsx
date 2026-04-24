import { Colors, GlobalFontSize } from "@/constants/GlobalStyles";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import AppText from "./AppText";

interface AppButtonProps {
  text: string;
  backgroundColor: any;
  onPress: () => void;
  width?: any;
  borderRadius?: number;
  textColor?: string;
  style?: ViewStyle;
}

export default function AppButton({
  text,
  backgroundColor,
  onPress,
  width = "100%",
  borderRadius = 24,
  textColor = Colors.branco,
  style,
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
      ]}
      onPress={onPress}
    >
      <AppText style={[styles.buttonText, { color: textColor }]}>
        {text}
      </AppText>
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
});
