import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import Header from '../components/Header';
import ProductItem from '../components/ProductItem';
import FakeData from '../utils/FakeData';

export default function HomeScreen() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState(FakeData);

    // Xử lý tìm kiếm
    const handleSearch = (text) => {
        setSearchQuery(text);
        const filtered = FakeData.filter((item) =>
            item.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredData(filtered);
    };

    // Xử lý bộ lọc (chưa có API thật)
    const handleFilter = () => {
        console.log("Mở bộ lọc danh mục");
    };

    return (
        <View style={styles.container}>
            <Header onSearch={handleSearch} onFilterPress={handleFilter} />
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ProductItem item={item} />}
                numColumns={2}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
});
