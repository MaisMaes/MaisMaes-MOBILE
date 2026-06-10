import { Colors } from "@/constants/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    ActivityIndicator,
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from "react-native";

interface ChatBubbleIconProps {
  groupId?: number;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function ChatBubbleIcon({
  groupId,
  compact = false,
  style,
  onPress,
  loading = false,
  disabled = false,
}: ChatBubbleIconProps) {
  const router = useRouter();

  const handlePress = () => {
    if (loading || disabled) return;

    if (onPress) {
      onPress();
      return;
    }

    if (groupId === undefined) return;

    router.push({
      pathname: "/ChatPage" as never,
      params: { groupId: groupId.toString() },
    });
  };

  return (
    <TouchableOpacity
      style={[
        styles.bubbleContainer,
        compact && styles.compact,
        disabled && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={loading || disabled || (!onPress && groupId === undefined)}
    >
      {loading ? (
        <ActivityIndicator size="small" color={Colors.roxo} />
      ) : (
        <Ionicons
          name="chatbubble-outline"
          size={compact ? 22 : 24}
          color={disabled ? Colors.cinzaClaro : Colors.roxo}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bubbleContainer: {
    borderRadius: 50,
    backgroundColor: Colors.branco,
    width: 55,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: "20%",
    right: "5%",
    borderWidth: 1.5,
    borderColor: Colors.roxo,
    shadowColor: Colors.grafite,
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 3,
  },
  compact: {
    position: "relative",
    bottom: 0,
    right: 0,
    width: 42,
    height: 42,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  disabled: {
    borderColor: Colors.cinzaClaro,
    opacity: 0.5,
  },
});
