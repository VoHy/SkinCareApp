import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import MenuScreen from "./components/MenuScreen";
import HomeScreen from "./components/HomeScreen";

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const MyStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Menu" component={MenuScreen} />
    </Stack.Navigator>
  );
};
