import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function DetailsScreen({ route }) {
    const { item } = route.params;
    const [favorites, setFavorites] = useState({});
    const [isAdded, setIsAdded] = useState(false);
    const isFavorite = !!favorites[item.id];

    // Load danh sách yêu thích từ AsyncStorage khi màn hình focus
    useFocusEffect(
        useCallback(() => {
            const loadFavorites = async () => {
                try {
                    const storedFavorites = await AsyncStorage.getItem("favorites");
                    setFavorites(storedFavorites ? JSON.parse(storedFavorites) : {});
                } catch (error) {
                    console.error("Error loading favorites:", error);
                }
            };
            loadFavorites();
        }, [])
    );

    // Thêm/Xóa sản phẩm khỏi danh sách yêu thích
    const toggleFavorite = async () => {
        try {
            setFavorites((prevFavorites) => {
                const updatedFavorites = { ...prevFavorites };

                if (isFavorite) {
                    delete updatedFavorites[item.id]; // Xóa khỏi danh sách yêu thích
                } else {
                    updatedFavorites[item.id] = item; // Thêm vào danh sách yêu thích
                }

                AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
                return updatedFavorites;
            });
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };

    // Thêm/Xóa sản phẩm khỏi giỏ hàng
    const addToCart = async () => {
        try {
            const storedCart = await AsyncStorage.getItem("cart");
            let cart = storedCart ? JSON.parse(storedCart) : [];

            const existingIndex = cart.findIndex((cartItem) => cartItem.id === item.id);
            if (existingIndex !== -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push({ ...item, quantity: 1 });
            }

            await AsyncStorage.setItem("cart", JSON.stringify(cart));
            setIsAdded(true);
            Alert.alert("Thành công", "Sản phẩm đã được thêm vào giỏ hàng!");
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.header}>
                <Text style={styles.name}>{item.name}</Text>
                <TouchableOpacity onPress={toggleFavorite}>
                    <Icon name={isFavorite ? "heart" : "heart-o"} size={24} color={isFavorite ? "red" : "gray"} />
                </TouchableOpacity>
            </View>
            <Text style={styles.price}>{item.price}đ</Text>
            <Text style={styles.description}>{item.description}</Text>

            <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
                <Text style={styles.buttonText}>{isAdded ? "Đã thêm" : "Thêm vào giỏ hàng"}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 16 },
    image: { width: "100%", height: 300, borderRadius: 10 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
    name: { fontSize: 22, fontWeight: "bold", flex: 1 },
    price: { fontSize: 18, color: "#ff5733", marginVertical: 10 },
    description: { fontSize: 16, color: "#555", marginBottom: 20 },
    addToCartButton: { backgroundColor: "#ff5733", padding: 15, borderRadius: 8, alignItems: "center" },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
