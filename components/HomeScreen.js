import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image, StyleSheet, TextInput } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import DropDownPicker from 'react-native-dropdown-picker';

export default function HomeScreen() {
    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [favorites, setFavorites] = useState({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState(null);
    
    // Dropdown State
    const [open, setOpen] = useState(false);
    const [categories, setCategories] = useState([
        { label: 'Tất cả', value: '' },
        { label: 'Serum', value: 'serum' },
        { label: 'Kem dưỡng', value: 'cream' },
        { label: 'Mặt nạ', value: 'mask' },
        { label: 'Nước hoa', value: 'perfume' },
    ]);

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

    useEffect(() => {
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
                    placeholder="Tìm kiếm sản phẩm..."
                    value={search}
                    onChangeText={setSearch}
                />
            </View>

            {/* Dropdown Picker */}
            <View style={styles.dropdownContainer}>
                <DropDownPicker
                    open={open}
                    value={category}
                    items={categories}
                    setOpen={setOpen}
                    setValue={setCategory}
                    setItems={setCategories}
                    placeholder="Chọn danh mục"
                    containerStyle={{ width: '100%' }}
                    style={styles.dropdown}
                    dropDownStyle={{ backgroundColor: '#fafafa' }}
                />
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

    // Dropdown styles
    dropdownContainer: { marginVertical: 10 },
    dropdown: { backgroundColor: '#fafafa', borderWidth: 1, borderColor: '#ddd' },

    // Item styles
    itemContainer: { flex: 1, margin: 8, maxWidth: '48%', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 10, padding: 10 },
    item: { alignItems: 'center', justifyContent: 'center' },
    imageContainer: { position: 'relative', width: 150, height: 150 },
    image: { width: '100%', height: '100%', borderRadius: 10 },
    favoriteButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: 5, borderRadius: 15 },
    artName: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
    price: { fontSize: 14, color: 'gray', marginTop: 4 },
});
