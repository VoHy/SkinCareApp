import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function Favorite() {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState({});

  useFocusEffect(
    React.useCallback(() => {
      const loadFavorites = async () => {
        try {
          const storedFavorites = await AsyncStorage.getItem('favorites');
          const parsedFavorites = storedFavorites ? JSON.parse(storedFavorites) : {};

          // Lọc bỏ dữ liệu không hợp lệ
          const validFavorites = Object.fromEntries(
            Object.entries(parsedFavorites).filter(([key, value]) => value && value.id)
          );

          setFavorites(validFavorites);
        } catch (error) {
          console.error("Error loading favorites:", error);
        }
      };

      loadFavorites();
    }, [])
  );

  const removeFavorite = async (itemId) => {
    if (!itemId) return;

    const updatedFavorites = { ...favorites };
    delete updatedFavorites[itemId];

    // Lưu lại danh sách mới vào AsyncStorage
    if (Object.keys(updatedFavorites).length > 0) {
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } else {
      await AsyncStorage.removeItem('favorites'); // Xóa nếu danh sách trống
    }

    setFavorites(updatedFavorites);
  };

  return (
    <View style={styles.container}>
      {Object.keys(favorites).length === 0 ? (
        <Text style={styles.emptyText}>Bạn chưa yêu thích sản phẩm nào</Text>
      ) : (
        <FlatList
          data={Object.values(favorites).filter(item => item && item.id)}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          renderItem={({ item }) => {
            const hasDiscount = item.limitedTimeDeal && item.limitedTimeDeal < item.price;
            const discountPercent = hasDiscount
              ? Math.round(((item.price - item.limitedTimeDeal) / item.price) * 100)
              : 0;

            return (
              <View style={styles.itemContainer}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Details', { item })}
                  style={styles.item}
                >
                  <View style={styles.imageContainer}>
                    <Image
                      source={item.image && typeof item.image === 'string'
                        ? { uri: item.image }
                        : require('../assets/favicon.png')}
                      style={styles.image}
                    />

                    <TouchableOpacity onPress={() => removeFavorite(item.id)} style={styles.favoriteButton}>
                      <Icon name="trash" size={24} color="red" />
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.artName}>{item.artName}</Text>

                  {/* Hiển thị giá */}
                  <View style={styles.priceContainer}>
                    {hasDiscount ? (
                      <>
                        <Text style={styles.priceStrikethrough}>{item.price}$</Text>
                        <Text style={styles.limitedTimeDeal}>{item.limitedTimeDeal}$</Text>
                        <Text style={styles.discountText}>-{discountPercent}%</Text>
                      </>
                    ) : (
                      <Text style={styles.price}>{item.price}$</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: 'gray' },
  itemContainer: { flex: 1, margin: 8, maxWidth: '48%', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 10, padding: 10 },
  item: { alignItems: 'center', justifyContent: 'center' },
  imageContainer: { position: 'relative', width: 150, height: 150 },
  image: { width: '100%', height: '100%', borderRadius: 10 },
  favoriteButton: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(255, 255, 255, 0.7)', padding: 5, borderRadius: 15 },
  artName: { fontSize: 16, fontWeight: 'bold', marginTop: 8 },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  price: { fontSize: 14, color: 'gray' },
  priceStrikethrough: { fontSize: 14, textDecorationLine: 'line-through', color: 'gray', marginRight: 5 },
  limitedTimeDeal: { fontSize: 14, fontWeight: 'bold', color: 'red', marginRight: 5 },
  discountText: { fontSize: 12, fontWeight: 'bold', color: 'green' },
});

