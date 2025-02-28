import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function FavoriteScreen() {
    const [favorites, setFavorites] = useState([]);

    // Load danh sách sản phẩm yêu thích từ AsyncStorage
    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const storedFavorites = await AsyncStorage.getItem('favorites');
                if (storedFavorites) {
                    setFavorites(JSON.parse(storedFavorites));
                }
            } catch (error) {
                console.error('Error loading favorites:', error);
            }
        };
        loadFavorites();
    }, []);

    // Xóa sản phẩm khỏi danh sách yêu thích
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
                            <Image source={item.image} style={styles.image} />
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
