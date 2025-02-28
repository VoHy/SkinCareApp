import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Header from '../components/Header';
import ProductItem from '../components/ProductItem';
import FakeData from '../utils/FakeData';

export default function HomeScreen({ navigation }) {
    const [products, setProducts] = useState(FakeData);

    // Xử lý khi nhấn vào sản phẩm
    const handleProductPress = (item) => {
        navigation.navigate("ProductDetails", { item });
    };

    // Xử lý yêu thích sản phẩm
    const handleFavorite = (item) => {
        const updatedProducts = products.map((product) =>
            product.id === item.id ? { ...product, isFavorite: !product.isFavorite } : product
        );
        setProducts(updatedProducts);
    };

    return (
        <View style={styles.container}>
            <Header onSearch={() => {}} onFilterPress={() => {}} />
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <ProductItem item={item} onPress={handleProductPress} onFavorite={handleFavorite} />
                )}
                numColumns={2}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
});
