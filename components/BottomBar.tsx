import { Colors } from "@/constants/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import { Href, Link, usePathname } from "expo-router";
import { Pressable, Text, View } from "react-native";

type Item = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: Href;
};

const items: Item[] = [
  { label: "Chat", icon: "chatbubble-outline", href: "/#" },
  { label: "Explore", icon: "compass-outline", href: "/GrupoPage" },
  { label: "Message", icon: "notifications-outline", href: "/#" },
  { label: "Me", icon: "person-outline", href: "/profile" },
];

export default function BottomBar() {
  const pathname = usePathname();

  return (
    <View
      style={{
        borderColor: Colors.roxo,
        borderWidth: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        padding: 10,
        position: "absolute",
        bottom: 60,
        width: "90%",
        backgroundColor: Colors.branco,
        borderRadius: 50,
        alignSelf: "center",
        left: "5%",
        right: "5%",
        shadowColor: Colors.roxo,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
      }}
    >
      {items.map((item, index) => {
        const isActive = pathname === item.href;
        return (
          <Link key={index} href={item.href} asChild>
            <Pressable style={{ alignItems: "center" }}>
              <Ionicons
                name={item.icon}
                size={24}
                color={isActive ? Colors.roxo : "gray"}
              />
              <Text style={{ color: isActive ? Colors.roxo : "gray" }}>
                {item.label}
              </Text>
            </Pressable>
          </Link>
        );
      })}
    </View>
  );
}
