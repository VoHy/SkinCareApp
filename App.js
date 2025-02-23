import 'react-native-gesture-handler';
import React, { useState } from 'react';
// Redux
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReduxThunk from 'redux-thunk';

// Reducers
import {
  authReducer,
  cartReducer,
  favoriteReducer,
  orderReducer,
  productReducer,
} from './src/reducers';

// Navigator
import { AppNavigator } from './src/navigation';

import AppLoading from 'expo-app-loading';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';

import { StatusBar } from 'expo-status-bar';

// Notification
import LocalNotication from './components/Notification/LocalNotification';

// ✅ Tạo store
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  favorite: favoriteReducer,
  order: orderReducer,
  product: productReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

export default function App() {
  const [assetLoaded, setAssetLoaded] = useState(false);

  if (!assetLoaded) {
    return (
      <AppLoading
        startAsync={LoadAssets}
        onFinish={() => setAssetLoaded(true)}
        onError={console.warn}
      />
    );
  }

  return (
    <Provider store={store}>
      <StatusBar />
      <LocalNotication />
      <AppNavigator />
    </Provider>
  );
}
