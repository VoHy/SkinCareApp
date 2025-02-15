<<<<<<< HEAD
import { View, Text } from "react-native";
import React from "react";

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Text>Home Screen</Text>
    </View>
  );
}
=======
import { View, Text } from 'react-native'
import React from 'react'
import MenuScreen from './MenuScreen';

export default function HomeScreen() {
    return (
        // style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        <View>
            <Text onPress={() => navigation.navigate(Menu)}>Menu</Text>
        </View>
    );
}
>>>>>>> e0690e2a97264a0b3d3d09cfffa1010119dca400
