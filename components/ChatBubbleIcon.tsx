import { Colors } from "@/constants/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function ChatBubbleIcon() {
  return (
    <TouchableOpacity style={styles.BubbleContainer}>
        <Ionicons name="chatbubble-outline" size={24} color={Colors.roxo} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  BubbleContainer: {
    borderRadius: 50,
    backgroundColor: Colors.branco,
    width: 55,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: '20%',
    right: '5%',
    borderWidth: 1.5,
    borderColor: Colors.roxo,
    shadowColor: Colors.grafite,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 3
  }
});