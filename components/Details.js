import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const Detail = ({ route }) => {
  const { item } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  // Load favorite status from AsyncStorage
  useEffect(() => {
    const loadFavoriteStatus = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem('favorites');
        const favorites = storedFavorites ? JSON.parse(storedFavorites) : {};
        setIsFavorite(favorites[item.id] || false);
      } catch (error) {
        console.error("Error loading favorites:", error);
      }
    };

    loadFavoriteStatus();
  }, [item.id]);

  // Toggle favorite status
  const toggleFavorite = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      let favorites = storedFavorites ? JSON.parse(storedFavorites) : {};

      if (favorites[item.id]) {
        delete favorites[item.id]; // Remove from favorites
        setIsFavorite(false);
      } else {
        favorites[item.id] = true; // Add to favorites
        setIsFavorite(true);
      }

      await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{item.artName}</Text>

      {/* Image Container with Favorite Icon */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <Icon name={isFavorite ? "heart" : "heart-o"} size={30} color={isFavorite ? "red" : "gray"} />
        </TouchableOpacity>
      </View>

      <Text style={styles.price}>{item.price}$</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    width: 300,
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 5,
  },
});

export default Detail;
