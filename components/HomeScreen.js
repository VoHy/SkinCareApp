import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://6417c990cc5fd8ffb1768cd3.mockapi.io/art');
                setData(response.data);
                await AsyncStorage.setItem('artData', JSON.stringify(response.data));
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        const loadData = async () => {
            const storedData = await AsyncStorage.getItem('artData');
            if (storedData) {
                setData(JSON.parse(storedData));
                setLoading(false);
            } else {
                fetchData();
            }
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={{ padding: 10 }}>
                        <Text>{item.artName}</Text>
                        <Text>{item.image}</Text>
                    </View>
                )}
            />
            <Text onPress={() => navigation.navigate('Details')}>Press to Details</Text>
        </View>
    );
}