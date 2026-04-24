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
  required?: boolean;
  errorMessage?: string;
}

export default function Input({
  placeholder,
  secureTextEntry = false,
  label,
  value,
  onChangeText,
  required = false,
  errorMessage,
}: InputProps) {
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <AppText style={styles.label}>{label}</AppText>
        {required && <AppText style={styles.required}>*</AppText>}
      </View>
      <View style={[styles.inputContainer, !!errorMessage && styles.inputError]}>
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
      {!!errorMessage && (
        <AppText style={styles.errorMessage}>{errorMessage}</AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  label: {
    color: Colors.grafite,
    fontSize: GlobalFontSize.subtitle,
    fontWeight: "600",
    marginBottom: 0,
    marginLeft: 4,
    textAlign: "left",
  },
  required: {
    color: "red",
    fontSize: GlobalFontSize.subtitle,
    fontWeight: "600",
    marginLeft: 2,
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
  inputError: {
    borderColor: "red",
  },
  errorMessage: {
    color: "red",
    fontSize: 10,
    marginLeft: 6,
    marginTop: 0,
  },
  input: {
    flex: 1,
    height: 40,
    color: Colors.grafite,
    fontSize: GlobalFontSize.text,
  },
});
