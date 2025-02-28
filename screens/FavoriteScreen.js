import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";

export default function FavoriteScreen() {
    const [favorites, setFavorites] = useState([]);

    // Load favorites khi màn hình được focus
    useFocusEffect(
        useCallback(() => {
            const loadFavorites = async () => {
                try {
                    const storedFavorites = await AsyncStorage.getItem("favorites");
                    setFavorites(storedFavorites ? JSON.parse(storedFavorites) : []);
                } catch (error) {
                    console.error("Error loading favorites:", error);
                }
            };
            loadFavorites();
        }, [])
    );

    // Toggle Favorite (Xóa khỏi danh sách yêu thích)
    const toggleFavorite = async (item) => {
        setFavorites((prevFavorites) => {
            let updatedFavorites = prevFavorites.filter((fav) => fav.id !== item.id);
            AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={favorites}
                keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Image source={item.image} style={styles.image} />
                        <View style={styles.textContainer}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.price}>{item.price}$</Text>
                        </View>
                        <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.favoriteButton}>
                            <Icon name="heart" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No favorites yet!</Text>}
            />
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
