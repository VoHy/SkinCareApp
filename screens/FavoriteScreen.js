import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useIsFocused } from '@react-navigation/native';

export default function FavoriteScreen() {
    const [favorites, setFavorites] = useState([]);
    const isFocused = useIsFocused(); // Kiểm tra màn hình có đang được hiển thị

    // Load danh sách sản phẩm yêu thích khi màn hình được focus
    useEffect(() => {
        if (isFocused) {
            loadFavorites();
        }
    }, [isFocused]);

    const loadFavorites = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : [];
            setFavorites(Array.isArray(parsedFavorites) ? parsedFavorites : []);
        } catch (error) {
            console.error('Error loading favorites:', error);
            setFavorites([]);
        }
    };

    const removeFavorite = async (id) => {
        const updatedFavorites = favorites.filter(item => item.id !== id);
        setFavorites(updatedFavorites);
        await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sản phẩm yêu thích</Text>
            {favorites.length === 0 ? (
                <Text style={styles.emptyText}>Chưa có sản phẩm yêu thích</Text>
            ) : (
                <FlatList
                    data={favorites}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <View style={styles.info}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.price}>{item.price}đ</Text>
                            </View>
                            <TouchableOpacity onPress={() => removeFavorite(item.id)}>
                                <Icon name="trash" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    emptyText: { textAlign: 'center', fontSize: 16, color: 'gray' },
    itemContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
    image: { width: 50, height: 50, borderRadius: 10, marginRight: 10 },
    info: { flex: 1 },
    name: { fontSize: 16, fontWeight: 'bold' },
    price: { fontSize: 14, color: 'gray' },
});
