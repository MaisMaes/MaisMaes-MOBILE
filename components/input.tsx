import AppText from "@/components/AppText";
import { Colors, GlobalFontSize } from "@/constants/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

interface InputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  label: string;
  value?: string;
  onChangeText?: (text: string) => void;
}

export default function Input({
  placeholder,
  secureTextEntry = false,
  label,
  value,
  onChangeText,
}: InputProps) {
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      <AppText style={styles.label}>{label}</AppText>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.cinzaClaro}
          secureTextEntry={hidden}
          value={value}
          onChangeText={onChangeText}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setHidden((prev) => !prev)}>
            <Ionicons
              name={hidden ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={Colors.grafite}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 12,
  },
  label: {
    color: Colors.grafite,
    fontSize: GlobalFontSize.subtitle,
    fontWeight: "600",
    marginBottom: 6,
    marginLeft: 4,
    textAlign: "left",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.grafite,
    borderRadius: 16,
    paddingHorizontal: 10,
    backgroundColor: Colors.branco,
  },
  input: {
    flex: 1,
    height: 44,
    color: Colors.grafite,
    fontSize: GlobalFontSize.text,
  },
});
