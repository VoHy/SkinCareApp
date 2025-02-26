import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen() {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [favorites, setFavorites] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    // Fetch Data
    const fetchData = async () => {
        try {
            const response = await axios.get('https://6417c990cc5fd8ffb1768cd3.mockapi.io/products');
            setData(response.data);
            setFilteredData(response.data);
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
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    setData(parsedData);
                    setFilteredData(parsedData);
                } else {
                    fetchData();
                }
            } catch (error) {
                console.error("Error loading stored data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
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

    // Search & Filter Function
    useEffect(() => {
        let filtered = data;
        
        if (search) {
            filtered = filtered.filter(item => item.artName.toLowerCase().includes(search.toLowerCase()));
        }
        
        if (category) { 
            filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase());
        }

        setFilteredData(filtered);
    }, [search, category, data]);

    // Optimize `renderItem`
    const renderItem = useCallback(({ item }) => (
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
    ), [favorites]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image source={{ uri: 'https://your-logo-url.com/logo.png' }} style={styles.logo} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    value={search}
                    onChangeText={setSearch}
                />
                <TouchableOpacity onPress={() => setCategory(category ? '' : 'serum')}>
                    <Text style={[styles.filterButton, category && styles.activeFilter]}>Serum</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => String(item.id)}
                numColumns={2}
                renderItem={renderItem}
                initialNumToRender={6}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={loading ? <ActivityIndicator size="small" color="gray" /> : null}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 10 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    // Header styles
    header: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#f8f8f8', borderBottomWidth: 1, borderBottomColor: '#ddd' },
    logo: { width: 50, height: 50, marginRight: 10 },
    searchInput: { flex: 1, height: 40, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 10, borderWidth: 1, borderColor: '#ddd' },
    filterButton: { marginLeft: 10, paddingVertical: 5, paddingHorizontal: 10, backgroundColor: '#ddd', borderRadius: 5 },
    activeFilter: { backgroundColor: '#ff6347', color: 'white' },

    // Item styles
    itemContainer: { flex: 1, margin: 8, maxWidth: '48%', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 10, padding: 10 },
    item: { alignItems: 'center', justifyContent: 'center' },
    imageContainer: { position: 'relative', width: 150, height: 150 },
    image: { width: '100%', height: '100%', borderRadius: 10 },
    favoriteButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 5, borderRadius: 15 },
    artName: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
    price: { fontSize: 14, color: 'gray', marginTop: 4 },
});
