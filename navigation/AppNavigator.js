// navigation/AppNavigator.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, Image } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import Login from '../screens/Login';
import DetailsScreen from '../screens/DetailsScreen';
import CartScreen from '../screens/CartScreen';
import Icon from 'react-native-vector-icons/FontAwesome';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Màn hình Bottom Tabs
const BottomTabs = () => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="home" size={size} color={color} />
                    )
                }}
            />
            <Tab.Screen
                name="Favorites"
                component={FavoriteScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="heart" size={size} color={color} />
                    )
                }}
            />

            <Tab.Screen
                name="Cart"
                component={CartScreen}
                options={{
                    tabBarIcon: ({ color }) => (
                        <Icon name="shopping-cart" size={24} color={color} />
                    )
                }} />
            <Tab.Screen
                name="Login"
                component={Login}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Icon name="user" size={size} color={color} />
                    )
                }}
            />
        </Tab.Navigator>
    );
};

export default function AppNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Main" component={BottomTabs} options={{ headerShown: false }} />
            <Stack.Screen name="DetailsScreen" component={DetailsScreen} options={{ title: "Chi tiết sản phẩm" }} />
        </Stack.Navigator>
    );
}
