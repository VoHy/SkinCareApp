import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../components/Header";
import ProductItem from "../components/ProductItem";
import FakeData from "../utils/FakeData";

export default function HomeScreen({ navigation }) {
    const [favorites, setFavorites] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);

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

    // Cập nhật danh sách sản phẩm khi searchQuery thay đổi
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredData(FakeData);
        } else {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const filtered = FakeData.filter((item) =>
                item.name.toLowerCase().includes(lowerCaseQuery)
            );
            setFilteredData(filtered);
        }
    }, [searchQuery]);

    // Toggle trạng thái yêu thích
    const toggleFavorite = async (item) => {
        try {
            setFavorites((prevFavorites) => {
                const updatedFavorites = { ...prevFavorites };

                if (updatedFavorites[item.id]) {
                    delete updatedFavorites[item.id]; // Bỏ khỏi danh sách yêu thích
                } else {
                    updatedFavorites[item.id] = item; // Thêm vào danh sách yêu thích
                }

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

    return (
        <View style={styles.container}>
            <Header onSearch={setSearchQuery} onFilterPress={() => { }} />

            <FlatList
                data={filteredData}
                keyExtractor={(item, index) => item.id?.toString() ?? `item-${index}`}
                numColumns={2}
                renderItem={({ item }) => (
                    <ProductItem
                        item={item}
                        onPress={handleProductPress}
                        onFavorite={() => toggleFavorite(item)}
                        isFavorite={!!favorites[item.id]}
                    />
                )}
                showsVerticalScrollIndicator={false}
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
