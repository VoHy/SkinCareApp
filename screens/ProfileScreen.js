import React from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen({ setIsLoggedIn }) {
    const handleLogout = async () => {
        await AsyncStorage.removeItem('isLoggedIn');
        setIsLoggedIn(false);
    };

    return (
        <View>
            <Text>Profile Screen</Text>
            <Button title="Logout" onPress={handleLogout} />
        </View>
    );
}
