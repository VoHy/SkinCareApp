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
    const [searchBrand, setSearchBrand] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.get('https://6417c990cc5fd8ffb1768cd3.mockapi.io/art');
            setData(response.data);
            setFilteredData(response.data);
            await AsyncStorage.setItem('artData', JSON.stringify(response.data));
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

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

    useEffect(() => {
        const loadData = async () => {
            try {
                const storedData = await AsyncStorage.getItem('artData');
                if (storedData) {
                    setData(JSON.parse(storedData));
                    setFilteredData(JSON.parse(storedData));
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

    const toggleFavorite = async (item) => {
        const updatedFavorites = { ...favorites };

        if (updatedFavorites[item.id]) {
            delete updatedFavorites[item.id];
        } else {
            updatedFavorites[item.id] = item;
        }

        setFavorites(updatedFavorites);

        try {
            await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        } catch (error) {
            console.error("Error saving favorites:", error);
        }
    };

    const handleSearch = (text) => {
        setSearchBrand(text);
        if (text) {
            const filtered = data.filter((item) =>
                item.brand?.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredData(filtered);
        } else {
            setFilteredData(data);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder={"Tìm kiếm theo thương hiệu..."}
                value={searchBrand}
                onChangeText={handleSearch}
            />

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => String(item.id)}
                    numColumns={2}
                    renderItem={({ item }) => {
                        const hasDiscount = item.limitedTimeDeal && item.limitedTimeDeal < item.price;
                        const discountPercent = hasDiscount
                            ? Math.round(((item.price - item.limitedTimeDeal) / item.price) * 100)
                            : 0;

                        return (
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

                                    <Text style={[styles.price, hasDiscount && styles.priceStrikethrough]}>
                                        {item.price}$
                                    </Text>

                                    {hasDiscount && (
                                        <View style={styles.discountContainer}>
                                            <Text style={styles.limitedTimeDeal}>{item.limitedTimeDeal}$</Text>
                                            <Text style={styles.discountText}>-{discountPercent}%</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </View>
                        );
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 10 },
    searchInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    itemContainer: {
        flex: 1, margin: 8, maxWidth: '48%', alignItems: 'center',
        backgroundColor: '#f9f9f9', borderRadius: 10, padding: 10
    },
    item: { alignItems: 'center', justifyContent: 'center' },
    imageContainer: { position: 'relative', width: 150, height: 150 },
    image: { width: '100%', height: '100%', borderRadius: 10 },
    favoriteButton: {
        position: 'absolute', top: 8, right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 5, borderRadius: 15
    },
    artName: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
    price: { fontSize: 16, color: 'black', marginTop: 4 },
    priceStrikethrough: { textDecorationLine: 'line-through', color: 'gray' },
    discountContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
    limitedTimeDeal: { fontSize: 16, fontWeight: 'bold', color: 'red', marginRight: 5 },
    discountText: { fontSize: 14, fontWeight: 'bold', color: 'green' },
});

