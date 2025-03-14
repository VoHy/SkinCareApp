import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";

export default function DetailsScreen({ route }) {
    const { item } = route.params;
    const [favorites, setFavorites] = useState({});
    const [isAdded, setIsAdded] = useState(false);
    const isFavorite = !!favorites[item.id];

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

    const toggleFavorite = async () => {
        try {
            setFavorites((prevFavorites) => {
                const updatedFavorites = { ...prevFavorites };
                if (isFavorite) {
                    delete updatedFavorites[item.id];
                } else {
                    updatedFavorites[item.id] = item;
                }
                AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
                return updatedFavorites;
            });
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };

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
        <View style={styles.container}>
            {/* Danh sách thông tin sản phẩm và feedback */}
            <FlatList
                ListHeaderComponent={
                    <>
                        <Image source={item.image} style={styles.image} />
                        <View style={styles.header}>
                            <Text style={styles.name}>{item.name}</Text>
                            <TouchableOpacity onPress={toggleFavorite}>
                                <Icon name={isFavorite ? "heart" : "heart-o"} size={24} color={isFavorite ? "red" : "gray"} />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.originalPrice}>{item.price.toLocaleString()}đ</Text>
                        <Text style={styles.discountedPrice}>{item.finalPrice.toLocaleString()}đ</Text>
                        <Text style={styles.description}>{item.description}</Text>
                        <Text style={styles.feedbackTitle}>Đánh giá từ người dùng</Text>
                    </>
                }
                data={item.feedback}
                keyExtractor={(feedback) => feedback.id}
                renderItem={({ item }) => (
                    <View style={styles.feedbackItem}>
                        <Text style={styles.user}>{item.user}</Text>
                        <Text style={styles.comment}>{item.comment}</Text>
                    </View>
                )}
                contentContainerStyle={{ paddingBottom: 80 }} // Để tránh bị che bởi nút "Thêm vào giỏ hàng"
            />

            {/* Footer chứa nút "Thêm vào giỏ hàng" */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
                    <Text style={styles.buttonText}>{isAdded ? "Đã thêm" : "Thêm vào giỏ hàng"}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    image: { width: "100%", height: 300, borderRadius: 10 },
    header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingHorizontal: 16 },
    name: { fontSize: 22, fontWeight: "bold", flex: 1 },
    originalPrice: { fontSize: 16, textDecorationLine: "line-through", color: "#888", marginTop: 10, paddingHorizontal: 16 },
    discountedPrice: { fontSize: 20, fontWeight: "bold", color: "#ff5733", paddingHorizontal: 16 },
    description: { fontSize: 16, color: "#555", marginVertical: 10, paddingHorizontal: 16 },
    feedbackTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, paddingHorizontal: 16 },
    feedbackItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ddd", paddingHorizontal: 16 },
    user: { fontWeight: "bold" },
    comment: { color: "#555" },
    
    // Nút "Thêm vào giỏ hàng" cố định dưới màn hình
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: "#ddd",
    },
    addToCartButton: {
        backgroundColor: "#ff5733",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
