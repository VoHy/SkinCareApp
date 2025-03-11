import {
    View,
    Text,
    FlatList,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    Image,
    StyleSheet,
    ScrollView,
} from 'react-native';
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
    const [filter, setFilter] = useState('All');
    const [filteredData, setFilteredData] = useState([]);
    const [searchName, setSearchName] = useState('');

    const fetchData = async () => {
        try {
            const response = await axios.get(
                'https://6417c990cc5fd8ffb1768cd3.mockapi.io/art'
            );
            setData(response.data);
            setFilteredData(response.data);
            await AsyncStorage.setItem('artData', JSON.stringify(response.data));
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const filteredResults = data.filter((item) =>
            item.artName?.toLowerCase().includes(searchName.toLowerCase())
        );
        setFilteredData(filteredResults);
    }, [searchName, data]);

    const handleSearch = (text) => {
        setSearchName(text);
    };

    useFocusEffect(
        useCallback(() => {
            const loadFavorites = async () => {
                try {
                    const storedFavorites = await AsyncStorage.getItem('favorites');
                    setFavorites(storedFavorites ? JSON.parse(storedFavorites) : {});
                } catch (error) {
                    console.error('Error loading favorites:', error);
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
                } else {
                    fetchData();
                }
            } catch (error) {
                console.error('Error loading stored data:', error);
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
            console.error('Error saving favorites:', error);
        }
    };

    // Lọc danh mục sản phẩm
    const filteredArt = filteredData.filter(
        (item) =>
            filter === 'All' ||
            (item.brand && item.brand.toLowerCase() === filter.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder={'Tìm kiếm'}
                value={searchName}
                onChangeText={handleSearch}
            />
            {!loading && (
                <View style={styles.filterContainer}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                        {['All', 'Arteza', 'Color Splash', 'Edding', 'KingArt'].map(
                            (brand) => (
                                <TouchableOpacity
                                    key={String(brand)}
                                    style={[
                                        styles.filterButton,
                                        filter === brand && styles.selectedButton,
                                    ]}
                                    onPress={() => setFilter(brand)}>
                                    <Text style={styles.filterText}>{brand || 'Unknown'}</Text>
                                </TouchableOpacity>
                            )
                        )}
                    </ScrollView>
                </View>
            )}

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <FlatList
                    data={filteredArt}
                    keyExtractor={(item) => String(item.id)}
                    numColumns={2}
                    renderItem={({ item }) => {
                        const hasDiscount =
                            item.limitedTimeDeal > 0 && item.limitedTimeDeal < 1;
                        const discountPercent = hasDiscount
                            ? Math.round(item.limitedTimeDeal * 100)
                            : 0;
                        const discountedPrice = hasDiscount
                            ? (item.price * (1 - item.limitedTimeDeal)).toFixed(2)
                            : item.price;

                        return (
                            <View style={styles.itemContainer}>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Details', { item })}
                                    style={styles.item}>
                                    <View style={styles.imageContainer}>
                                        <Image source={{ uri: item.image }} style={styles.image} />
                                        <TouchableOpacity
                                            onPress={() => toggleFavorite(item)}
                                            style={styles.favoriteButton}>
                                            <Icon
                                                name={favorites[item.id] ? 'heart' : 'heart-o'}
                                                size={24}
                                                color={favorites[item.id] ? 'red' : 'white'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <Text style={styles.artName}>
                                        {item.artName || 'No Name'}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.price,
                                            hasDiscount && styles.priceStrikethrough,
                                        ]}>
                                        {`${item.price || 'N/A'}$`}
                                    </Text>

                                    {hasDiscount && (
                                        <View style={styles.discountContainer}>
                                            <Text style={styles.limitedTimeDeal}>
                                                {`${discountedPrice}$`}
                                            </Text>
                                            <Text style={styles.discountText}>
                                                -{discountPercent}%
                                            </Text>
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
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    filterContainer: { flexDirection: 'row', padding: 10 },
    filterButton: {
        padding: 10,
        borderRadius: 5,
        marginRight: 5,
        backgroundColor: '#ccc',
    },
    selectedButton: { backgroundColor: '#007bff' },
    filterText: { color: '#fff' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    itemContainer: {
        flex: 1,
        margin: 8,
        maxWidth: '48%',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        padding: 10,
    },
    imageContainer: { position: 'relative', width: 150, height: 150 },
    image: { width: '100%', height: '100%', borderRadius: 10 },
    favoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 5,
        borderRadius: 15,
    },
    artName: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
    price: { fontSize: 16, color: 'black', marginTop: 4 },
    priceStrikethrough: { textDecorationLine: 'line-through', color: 'gray' },
    discountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    limitedTimeDeal: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
        marginRight: 5,
    },
    discountText: { fontSize: 14, fontWeight: 'bold', color: 'green' },
});
