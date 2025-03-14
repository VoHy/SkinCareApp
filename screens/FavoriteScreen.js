import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";

export default function FavoriteScreen() {
    const [favorites, setFavorites] = useState({});

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

    // Xóa sản phẩm khỏi danh sách yêu thích
    const removeFavorite = async (item) => {
        try {
            setFavorites((prevFavorites) => {
                const updatedFavorites = { ...prevFavorites };
                delete updatedFavorites[item.id]; // Xóa khỏi danh sách

                AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
                return updatedFavorites;
            });

            Alert.alert("Thông báo", "Đã xóa khỏi danh sách yêu thích!");
        } catch (error) {
            console.error("Error updating favorites:", error);
        }
    };

    // Hiển thị danh sách yêu thích (chuyển object thành array)
    const favoriteList = Object.values(favorites);

    return (
        <View style={styles.container}>
            {favoriteList.length === 0 ? (
                <Text style={styles.emptyText}>Chưa có sản phẩm yêu thích!</Text>
            ) : (
                <FlatList
                    data={favoriteList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.itemContainer}>
                            <Image source={item.image} style={styles.image} />
                            <View style={styles.textContainer}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.price}>{item.price}đ</Text>
                            </View>
                            <TouchableOpacity onPress={() => removeFavorite(item)} style={styles.favoriteButton}>
                                <Icon name="heart" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 10 },
    itemContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "#f9f9f9", borderRadius: 10, padding: 10, marginVertical: 5 },
    textContainer: { flex: 1, marginLeft: 10 },
    image: { width: 80, height: 80, borderRadius: 10 },
    name: { fontSize: 16, fontWeight: "bold" },
    price: { fontSize: 14, color: "gray" },
    favoriteButton: { padding: 5 },
    emptyText: { textAlign: "center", marginTop: 20, fontSize: 16, color: "gray" },
});
