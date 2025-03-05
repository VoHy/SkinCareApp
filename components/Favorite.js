import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function Favorite() {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState({});

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          const storedFavorites = await AsyncStorage.getItem('favorites');
          setFavorites(storedFavorites ? JSON.parse(storedFavorites) : {});
        } catch (error) {
          console.error("Error loading favorites:", error);
        }
      };
      loadFavorites();
    }, [])
  );

  const toggleFavorite = async (item) => {
    const updatedFavorites = { ...favorites };

    if (updatedFavorites[item.id]) {
      delete updatedFavorites[item.id];
    } else {
      updatedFavorites[item.id] = item;
    }

    setFavorites(updatedFavorites);

    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
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
                    <TouchableOpacity onPress={() => toggleFavorite(item)} style={styles.favoriteButton}>
                      <Icon
                        name={favorites[item.id] ? "heart" : "heart-o"}
                        size={24}
                        color={favorites[item.id] ? "red" : "white"}
                      />
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

