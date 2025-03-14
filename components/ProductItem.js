import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ProductItem({ item, onPress, onFavorite, isFavorite }) {
    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
            {/* Hình ảnh sản phẩm */}
            <Image source={item.image} style={styles.image} />

            {/* Nội dung sản phẩm */}
            <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{item.price}đ</Text>
            </View>

            {/* Nút yêu thích */}
            <TouchableOpacity style={styles.favoriteButton} onPress={() => onFavorite(item)}>
                <Icon name={isFavorite ? "heart" : "heart-o"} size={20} color={isFavorite ? "red" : "#999"} />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        margin: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 10,
    },
    infoContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    price: {
        fontSize: 14,
        color: '#FF6F61',
        marginTop: 4,
    },
    favoriteButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});
