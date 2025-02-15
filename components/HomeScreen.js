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