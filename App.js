import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import MenuScreen from './components/MenuScreen';
import HomeScreen from './components/HomeScreen';
import Detail from './components/Details';
import Favorite from './components/Favorite';



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
      <Stack.Screen name="Top" component={MyBottomTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Details" component={Detail} />
    </Stack.Navigator>
  )
}

const MyBottomTabs = () => {
  const Tabs = createBottomTabNavigator();
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Menu') {
            iconName = 'menu';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tabs.Screen name="Menu" component={MenuScreen} />
      {/* <Tabs.Screen name="Favorite" component={Favorite} /> */}
    </Tabs.Navigator>
  )
}