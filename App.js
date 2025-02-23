import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MenuScreen from './components/MenuScreen';
import HomeScreen from './components/HomeScreen';

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
    <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: 'red' } }} >
      <Stack.Screen name="Top" component={MyBottomTabs} options={{ headerShown: false }}/>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  )
}

const MyBottomTabs = () => {
  const Tabs = createBottomTabNavigator();
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Menu" component={MenuScreen} />
    </Tabs.Navigator>
  )
}