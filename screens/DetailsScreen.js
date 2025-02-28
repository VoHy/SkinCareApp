import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function DetailsScreen({ route }) {
    const { item } = route.params; // Nhận dữ liệu sản phẩm từ HomeScreen
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        checkFavoriteStatus();
    }, []);

    // Kiểm tra xem sản phẩm có trong danh sách yêu thích không
    const checkFavoriteStatus = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            if (storedFavorites) {
                const favorites = JSON.parse(storedFavorites);
                setIsFavorite(favorites.some(fav => fav.id === item.id));
            }
        } catch (error) {
            console.error('Error checking favorites:', error);
        }
    };

    // Thêm/Xóa sản phẩm khỏi danh sách yêu thích
    const toggleFavorite = async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem('favorites');
            let favorites = storedFavorites ? JSON.parse(storedFavorites) : [];

            if (isFavorite) {
                favorites = favorites.filter(fav => fav.id !== item.id);
                Alert.alert('Thông báo', 'Đã xóa khỏi yêu thích');
            } else {
                favorites.push(item);
                Alert.alert('Thông báo', 'Đã thêm vào yêu thích');
            }

            await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Error updating favorites:', error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.header}>
                <Text style={styles.name}>{item.name}</Text>
                <TouchableOpacity onPress={toggleFavorite}>
                    <Icon name={isFavorite ? 'heart' : 'heart-o'} size={24} color={isFavorite ? 'red' : 'gray'} />
                </TouchableOpacity>
            </View>
            <Text style={styles.price}>{item.price}đ</Text>
            <Text style={styles.description}>{item.description}</Text>

            <TouchableOpacity style={styles.addToCartButton}>
                <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 16 },
    image: { width: '100%', height: 300, borderRadius: 10 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
    name: { fontSize: 22, fontWeight: 'bold', flex: 1 },
    price: { fontSize: 18, color: '#ff5733', marginVertical: 10 },
    description: { fontSize: 16, color: '#555', marginBottom: 20 },
    addToCartButton: { backgroundColor: '#ff5733', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
