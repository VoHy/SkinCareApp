import React, { useCallback } from 'react';
import { Alert, TouchableOpacity, Linking } from 'react-native';
import * as RootNavigation from '../navigation/RootNavigation';
import Colors from './Colors';
//Upload Image
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { STRIPE_PUBLISHABLE_KEY } from './Config';

export const OpenURL = ({ url, children }) => {
  const handlePress = useCallback(async () => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(`Can't open this URL: ${url}`);
    }
  }, [url]);
  return <TouchableOpacity onPress={handlePress}>{children}</TouchableOpacity>;
};

//Handle Deep Link
export const urlRedirect = (url) => {
  if (!url) return;
  let path = url.split('//')[1]; // Xử lý URL đơn giản
  if (path) {
    RootNavigation.navigate(path);
  }
};

//Handle Fetching timeout
export const timeoutPromise = (url) => {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('Timeout, Server is not responding'));
    }, 50 * 1000);
    url.then(
      (res) => {
        clearTimeout(timeoutId);
        resolve(res);
      },
      (err) => {
        clearTimeout(timeoutId);
        reject(err);
      },
    );
  });
};

export const _pickImage = async (action) => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }
    const type =
      action === 'library'
        ? await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
          })
        : await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
          });

    return type;
  } catch (E) {
    console.log(E);
  }
};

export const colorCheck = (colorCode) => {
  switch (colorCode) {
    case 'yellow':
      return Colors.yellow;
    case 'green':
      return Colors.green;
    case 'purple':
      return Colors.purple;
    case 'blue':
      return Colors.water;
    case 'pink':
      return Colors.straw;
    default:
      return Colors.lighter_green;
  }
};

//Get token from Stripe Server
export const getCreditCardToken = (creditCardData) => {
  const card = {
    'card[number]': creditCardData.values.number.replace(/ /g, ''),
    'card[exp_month]': creditCardData.values.expiry.split('/')[0],
    'card[exp_year]': creditCardData.values.expiry.split('/')[1],
    'card[cvc]': creditCardData.values.cvc,
  };
  return fetch('https://api.stripe.com/v1/tokens', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${STRIPE_PUBLISHABLE_KEY}`,
    },
    method: 'post',
    body: Object.keys(card)
      .map((key) => key + '=' + card[key])
      .join('&'),
  })
    .then((response) => response.json())
    .catch((error) => console.log(error));
};
