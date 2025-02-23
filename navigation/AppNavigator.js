import React, { useEffect, useState } from 'react';
import { LogBox, Linking } from 'react-native'; // Dùng Linking từ react-native
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector, useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './RootNavigation';
import { DrawerNavigator, IntroStackScreen } from './StoneNavigation';
// import { Logout } from '../reducers';
//Modalize
import { Host } from 'react-native-portalize';
//Deep Link
import { urlRedirect } from '../utils/Tools';

LogBox.ignoreLogs(['Setting a timer']);

export const AppNavigator = () => {
  const [value, setValue] = useState(null);
  const dispatch = useDispatch();
  const isFirstOpen = useSelector((state) => state.store.isFirstOpen);

  useEffect(() => {
    // Lắng nghe deep linking từ react-native thay vì expo-linking
    const handleDeepLink = (event) => {
      urlRedirect(event.url);
    };

    Linking.addEventListener('url', handleDeepLink);
    
    Linking.getInitialURL().then((url) => {
      if (url) {
        urlRedirect(url);
      }
    });

    return () => {
      Linking.removeEventListener('url', handleDeepLink);
    };
  }, []);

  useEffect(() => {
    const isFirstTime = async () => {
      const firstOpen = await AsyncStorage.getItem('isFirstTime');
      setValue(firstOpen);
    };
    isFirstTime();

    const autoLogout = async () => {
      const getUser = await AsyncStorage.getItem('user');
      if (getUser) {
        const user = JSON.parse(getUser);
        if (user.data.expireTime - Date.now() < 0) {
          dispatch(Logout());
        }
      }
    };
    autoLogout();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Host>
        {(isFirstOpen || value !== null) && <DrawerNavigator />}
        {!isFirstOpen && value === null && <IntroStackScreen />}
      </Host>
    </NavigationContainer>
  );
};
