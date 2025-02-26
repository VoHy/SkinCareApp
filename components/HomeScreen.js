import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen() {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [favorites, setFavorites] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://6417c990cc5fd8ffb1768cd3.mockapi.io/art');
            setData(response.data);
            await AsyncStorage.setItem('artData', JSON.stringify(response.data));
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Load favorites when screen is focused
    useFocusEffect(
        useCallback(() => {
            const loadFavorites = async () => {
                try {
                    const storedFavorites = await AsyncStorage.getItem('favorites');
                    setFavorites(storedFavorites ? JSON.parse(storedFavorites) : {});
                } catch (error) {
                    console.error("Error loading favorites:", error);
                }
            };
            loadFavorites();
        }, [])
    );

    // Load initial data & favorites
    useEffect(() => {
        const loadData = async () => {
            try {
                const storedData = await AsyncStorage.getItem('artData');
                if (storedData) setData(JSON.parse(storedData));
            } catch (error) {
                console.error("Error loading stored data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
        fetchData();
    }, []);

    // Toggle Favorite
    const toggleFavorite = async (item) => {
        const updatedFavorites = { ...favorites };

        if (updatedFavorites[item.id]) {
            delete updatedFavorites[item.id];
        } else {
            updatedFavorites[item.id] = item;
        }

        setFavorites(updatedFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item) => String(item.id)}
                numColumns={2}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <TouchableOpacity 
                            onPress={() => navigation.navigate('Details', { item })} 
                            style={styles.item}
                        >
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: item.image }} style={styles.image} />
                                <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.favoriteButton}>
                                    <Icon 
                                        name={favorites[item.id] ? "heart" : "heart-o"} 
                                        size={24} 
                                        color={favorites[item.id] ? "red" : "white"} 
                                    />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.artName}>{item.artName}</Text>
                            <Text style={styles.price}>{item.price}$</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 10 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    itemContainer: { flex: 1, margin: 8, maxWidth: '48%', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 10, padding: 10 },
    item: { alignItems: 'center', justifyContent: 'center' },
    imageContainer: { position: 'relative', width: 150, height: 150 },
    image: { width: '100%', height: '100%', borderRadius: 10 },
    favoriteButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 5, borderRadius: 15 },
    artName: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
    price: { fontSize: 14, color: 'gray', marginTop: 4 },
});
