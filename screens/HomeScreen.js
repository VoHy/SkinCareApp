import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header";
import ProductItem from "../components/ProductItem";
import FakeData from "../utils/FakeData";

export default function HomeScreen({ navigation }) {
    const [favorites, setFavorites] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState(FakeData);

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

    // Toggle Favorite
    const toggleFavorite = async (item) => {
        setFavorites((prevFavorites) => {
            let updatedFavorites;
            if (prevFavorites.some((fav) => fav.id === item.id)) {
                updatedFavorites = prevFavorites.filter((fav) => fav.id !== item.id);
            } else {
                updatedFavorites = [...prevFavorites, item];
            }

            AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
            return updatedFavorites;
        });
    };

    // Xử lý khi nhấn vào sản phẩm
    const handleProductPress = (item) => {
        navigation.navigate("DetailsScreen", { item });
    };

    // Xử lý tìm kiếm
    const handleSearch = (text) => {
        setSearchQuery(text);
        if (text.trim() === "") {
            setFilteredData(FakeData);
        } else {
            const filtered = FakeData.filter((item) =>
                item.name.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredData(filtered);
        }
    };

    return (
        <View style={styles.container}>
            <Header onSearch={handleSearch} onFilterPress={() => { }} />

            <FlatList
                data={filteredData}
                keyExtractor={(item) => (item.id ? item.id.toString() : Math.random().toString())}
                renderItem={({ item }) => (
                    <ProductItem
                        item={item}
                        onPress={handleProductPress}
                        onFavorite={() => toggleFavorite(item)}
                        isFavorite={favorites.some((fav) => fav.id === item.id)}
                    />
                )}
                numColumns={2}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        paddingHorizontal: 10,
        paddingTop: 10,
    },
});