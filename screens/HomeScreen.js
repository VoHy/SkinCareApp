import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/Header";
import ProductItem from "../components/ProductItem";
import FakeData from "../utils/FakeData";

export default function HomeScreen({ navigation }) {
    const [products, setProducts] = useState(FakeData);
    const [favorites, setFavorites] = useState([]); // Đảm bảo favorites là mảng
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState(FakeData);

    // Load danh sách yêu thích từ AsyncStorage khi mở ứng dụng
    useEffect(() => {
        const loadFavorites = async () => {
            try {
                const storedFavorites = await AsyncStorage.getItem("favorites");
                if (storedFavorites) {
                    setFavorites(JSON.parse(storedFavorites));
                }
            } catch (error) {
                console.error("Error loading favorites:", error);
            }
        };
        loadFavorites();
    }, []);

    // Lưu danh sách yêu thích vào AsyncStorage khi thay đổi
    useEffect(() => {
        AsyncStorage.setItem("favorites", JSON.stringify(favorites));
    }, [favorites]);

    // Xử lý khi nhấn vào sản phẩm
    const handleProductPress = (item) => {
        navigation.navigate("DetailsScreen", { item });
    };

    // Xử lý yêu thích sản phẩm
    const handleFavorite = (item) => {
        setFavorites((prevFavorites) => {
            if (!Array.isArray(prevFavorites)) return []; // Đảm bảo prevFavorites là mảng hợp lệ

            const isFav = prevFavorites.find((fav) => fav.id === item.id);
            if (isFav) {
                return prevFavorites.filter((fav) => fav.id !== item.id); // Xóa nếu đã tồn tại
            } else {
                return [...prevFavorites, item]; // Thêm nếu chưa có
            }
        });
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
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ProductItem
                        item={item}
                        onPress={handleProductPress}
                        onFavorite={() => handleFavorite(item)}
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
