import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './components/HomeScreen';
import Detail from './components/Details';
import Favorite from './components/Favorite';
import Icon from 'react-native-vector-icons/FontAwesome';

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
          } else if (route.name === 'Favorite') {
            iconName = 'heart';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { backgroundColor: 'white' },
      })}
    >
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Favorite" component={Favorite} />
    </Tabs.Navigator>
  );
}