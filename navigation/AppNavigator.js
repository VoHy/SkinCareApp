import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../screens/HomeScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import LoginScreen from '../screens/Login';
import ProfileScreen from '../screens/ProfileScreen';
import DetailsScreen from '../screens/DetailsScreen';
import CartScreen from '../screens/CartScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const BottomTabs = ({ isLoggedIn, setIsLoggedIn }) => {
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
                }}
            />
            <Tab.Screen
                name="Account"
                children={() => isLoggedIn ? <ProfileScreen setIsLoggedIn={setIsLoggedIn} /> : <LoginScreen setIsLoggedIn={setIsLoggedIn} />}
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
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem('isLoggedIn').then(value => {
            if (value === 'true') setIsLoggedIn(true);
        });
    }, []);

    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Main" 
                children={() => <BottomTabs isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen name="DetailsScreen" component={DetailsScreen} options={{ title: "Chi tiết sản phẩm" }} />
        </Stack.Navigator>
    );
}
