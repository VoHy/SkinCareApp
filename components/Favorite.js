import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';

export default function Favorite() {
  const [favorites, setFavorites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          const storedFavorites = await AsyncStorage.getItem('favorites');
          setFavorites(storedFavorites ? Object.values(JSON.parse(storedFavorites)) : []);
        } catch (error) {
          console.error("Error loading favorites:", error);
        }
      };

      loadFavorites();
    }, [])
  );

  // Toggle favorite (Add or Remove)
  const toggleFavorite = async (item) => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      let updatedFavorites = storedFavorites ? JSON.parse(storedFavorites) : {};

      if (updatedFavorites[item.id]) {
        // Remove item if it's already a favorite
        delete updatedFavorites[item.id];
      } else {
        // Add item to favorites
        updatedFavorites[item.id] = item;
      }

      setFavorites(Object.values(updatedFavorites));
      await AsyncStorage.setItem('favorites', JSON.stringify(updatedFavorites)); // Save changes
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id ? String(item.id) : Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.artName}>{item.artName}</Text>
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
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  itemContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', borderRadius: 10, padding: 10, marginVertical: 5 },
  textContainer: { flex: 1, marginLeft: 10 },
  image: { width: 80, height: 80, borderRadius: 10 },
  artName: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 14, color: 'gray' },
  favoriteButton: { padding: 5 },
  emptyText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: 'gray' },
});
