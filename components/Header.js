import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function Header({ onSearch, onFilterPress }) {
    const [searchText, setSearchText] = useState("");

    const handleChangeText = (text) => {
        setSearchText(text);
        onSearch(text);
    };

    return (
        <View style={styles.header}>
            {/* Logo */}
            <Image source={require('../assets/Image/logo.png')} style={styles.logo} />

            {/* Thanh tìm kiếm */}
            <View style={styles.searchContainer}>
                <Icon name="search" size={18} color="#888" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchText}
                    onChangeText={handleChangeText}
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={() => handleChangeText("")}>
                        <Icon name="times-circle" size={18} color="#888" style={styles.clearIcon} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Nút bộ lọc */}
            <TouchableOpacity style={styles.filterButton} onPress={onFilterPress}>
                <Icon name="sliders" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FF6F61',
        padding: 10, 
        
    },
    logo: {
        width: 100,
        height: 40,
        resizeMode: 'contain',
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        alignItems: 'center',
        marginHorizontal: 10,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
    },
    clearIcon: {
        marginLeft: 8,
    },
    filterButton: {
        backgroundColor: '#444',
        padding: 10,
        borderRadius: 8,
    },
});
