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
    const loadFavorites = useCallback(async () => {
        try {
            const storedFavorites = await AsyncStorage.getItem("favorites");
            if (storedFavorites) {
                const parsedFavorites = JSON.parse(storedFavorites);
                if (Array.isArray(parsedFavorites)) {
                    setFavorites(parsedFavorites);
                } else {
                    setFavorites([]);
                }
            } else {
                setFavorites([]);
            }
        } catch (error) {
            console.error("Error loading favorites:", error);
        }
    }, []);

    useFocusEffect(loadFavorites);

    // Toggle Favorite
    const toggleFavorite = async (item) => {
        try {
            setFavorites((prevFavorites) => {
                const isFavorite = prevFavorites.some((fav) => fav.id === item.id);
                const updatedFavorites = isFavorite
                    ? prevFavorites.filter((fav) => fav.id !== item.id)
                    : [...prevFavorites, item];

                AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
                return updatedFavorites;
            });
        } catch (error) {
            console.error("Error saving favorites:", error);
        }
    };

    // Xử lý khi nhấn vào sản phẩm
    const handleProductPress = (item) => {
        navigation.navigate("DetailsScreen", { item });
    };

    // Xử lý tìm kiếm với useEffect
    useEffect(() => {
        setFilteredData(
            searchQuery.trim() === ""
                ? FakeData
                : FakeData.filter((item) =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
        );
    }, [searchQuery]);

    return (
        <View style={styles.container}>
            <Header onSearch={setSearchQuery} onFilterPress={() => { }} />

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id?.toString() ?? `item-${item.index}`}
                numColumns={2}
                renderItem={({ item }) => (
                    <ProductItem
                        item={item}
                        onPress={handleProductPress}
                        onFavorite={() => toggleFavorite(item)}
                        isFavorite={Array.isArray(favorites) && favorites.some((fav) => fav.id === item.id)} />
                )}
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
