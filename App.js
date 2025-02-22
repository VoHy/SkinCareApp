import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MenuScreen from './components/MenuScreen';
import HomeScreen from './components/HomeScreen';
import Login from './components/Login';

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}

const DetailScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Detail Screen</Text>
    </View>
  )
}

const MyStack = () => {
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator screenOptions={headerStyle = { backgroundColor: 'black' }} >

      <Stack.Screen name="Top" component={MyBottomTabs} />
      <Stack.Screen name="Details" component={DetailScreen} />
    </Stack.Navigator>

  )
}

const MyBottomTabs = () => {
  const Tabs = createBottomTabNavigator();
  return (
    <Tabs.Navigator>
      <Tabs.Screen name="Home" component={HomeScreen} options={{ headershown: false }} />
      <Tabs.Screen name="Menu" component={MenuScreen} />
      <Tabs.Screen name="Login" component={Login} />

    </Tabs.Navigator>
  )

}
