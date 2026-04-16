import { Fonts } from "@/constants/GlobalStyles";
import { Text, TextProps } from "react-native";

export default function AppText({ style, ...props }: TextProps) {
  return (
    <Text
      style={[
        { fontFamily: Fonts.semiBold },
        ...(Array.isArray(style) ? style : style ? [style] : []),
      ]}
      {...props}
    />
  );
}
