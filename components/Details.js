import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const Detail = ({ route }) => {
  const { item } = route.params;
  const [isFavorite, setIsFavorite] = useState(false);

  const hasDiscount = item.limitedTimeDeal && item.limitedTimeDeal < item.price;
  const discountPercent = hasDiscount
    ? Math.round(((item.price - item.limitedTimeDeal) / item.price) * 100)
    : 0;

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
      
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <Icon name={isFavorite ? "heart" : "heart-o"} size={30} color={isFavorite ? "red" : "gray"} />
        </TouchableOpacity>
      </View>

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

      <Text style={styles.description}>{item.description}</Text>

      {/* Display Feedback */}
      <Text style={styles.feedbackTitle}>Feedback</Text>
      {item.feedbacks && item.feedbacks.length > 0 ? (
        <FlatList
          data={item.feedbacks}
          keyExtractor={(feedback, index) => index.toString()}
          renderItem={({ item: feedback }) => (
            <View style={styles.feedbackItem}>
              <Text style={styles.feedbackAuthor}>{feedback.author}:</Text>
              <Text style={styles.feedbackComment}>{feedback.comment}</Text>
              <Text style={styles.feedbackRating}>⭐{feedback.rating}/5</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noFeedbackText}>Chưa có đánh giá nào.</Text>
      )}
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
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  priceStrikethrough: {
    fontSize: 18,
    textDecorationLine: 'line-through',
    color: 'gray',
    marginRight: 8,
  },
  limitedTimeDeal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'red',
    marginRight: 8,
  },
  discountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
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
  feedbackTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
  feedbackItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
  },
  feedbackAuthor: {
    fontWeight: 'bold',
  },
  feedbackComment: {
    fontSize: 16,
    marginVertical: 5,
  },
  feedbackRating: {
    fontSize: 14,
    color: 'goldenrod',
  },
  noFeedbackText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 10,
  },
});

export default Detail;
