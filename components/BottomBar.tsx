import { Ionicons } from '@expo/vector-icons';
import { Href, Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';


type Item = {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: Href;
};

type Props = {
  items: Item[];
};

export default function BottomBar({ items }: Props) {
  const [active, setActive] = useState(0);

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>

      {items.map((item, index) => (
        <Link key={index} href={item.href} asChild>
          <Pressable onPress={() => setActive(index)} style={{ alignItems: 'center' }}>

            <Ionicons
              name={item.icon}
              size={24}
              color={active === index ? 'purple' : 'gray'}
            />

            <Text style={{ color: active === index ? 'purple' : 'gray' }}>
              {item.label}
            </Text>

          </Pressable>
        </Link>
      ))}

    </View>
  );
}