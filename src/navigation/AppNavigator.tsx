import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CartScreen from '../screens/Cart/CartScreen';
import MainScreen from '../screens/MainScreen/MainScreen';
import PromoDetailsScreen from '../screens/MainScreen/Promo/PromoDetailsScreen';
import FavoritesScreen from '../screens/MainScreen/FavoritesScreen';
import SearchScreen from '../screens/MainScreen/Search/SearchScreen';
import ProfileScreen from '../screens/Account/ProfileScreen';
import MyOrdersScreen from '../screens/Account/MyOrdersScreen';
import OrderTrackingScreen from '../screens/MainScreen/checkout/OrderTrackingScreen';
import { RootStackParamList } from './navigation';
import ProductDetailsScreen from '../screens/MainScreen/Product/ProductDetials/ProductDetailsScreen';
import CreateAccountScreen from '../screens/Account/CreateAccountScreen';
import PhoneVerificationScreen from '../screens/Account/PhoneVerificationScreen';
import OtpVerificationScreen from '../screens/Account/OtpVerificationScreen';
import CheckoutScreen from '../screens/MainScreen/checkout/CheckoutDetails';
import DeliveryOrderDetailsScreen from '../screens/MainScreen/checkout/DeliveryOrderDetailsScreen';
import OrderConfirmationScreen from '../screens/MainScreen/checkout/OrderConfirmationScreen';
import TestQRScannerButtonScreen from '../screens/MainScreen/checkout/TestQRScannerButtonScreen';
import QRScannerScreen from '../screens/MainScreen/checkout/QRCodeScannerScreen';
import WelcomeScreen from '../screens/Account/WelcomeScreen';
import SignInScreen from '../screens/Account/SignInScreen';
import EditProfileScreen from '../screens/Account/EditProfileScreen';
import ManageAddressScreen from '../screens/Account/ManageAddressScreen';

import { useDispatch } from 'react-redux';
import { loadLocalCart, fetchAndHydrateServerCart } from '../store/slices/cartSlice';
import { fetchAndHydrateServerWishlist } from '../store/slices/favoritesSlice';
import { getAuthTokens } from '../Utility/tokenStorage';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const dispatch = useDispatch();
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  useEffect(() => {
    async function checkAuthSession() {
      try {
        const tokens = await getAuthTokens();
        if (tokens?.accessToken) {
          // 🚀 Authenticated User: Land directly on Main Home Screen
          setInitialRoute('Main');
          dispatch(loadLocalCart() as any);
          dispatch(fetchAndHydrateServerCart() as any);
          dispatch(fetchAndHydrateServerWishlist() as any);
        } else {
          // 🔒 Unauthenticated: Show Welcome Screen
          setInitialRoute('Welcome');
        }
      } catch (err) {
        setInitialRoute('Welcome');
      }
    }

    checkAuthSession();
  }, [dispatch]);

  // Branded Splash Loader while checking persistent session
  if (!initialRoute) {
    return (
      <View style={{ flex: 1, backgroundColor: '#034833', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 36, fontWeight: '900', color: '#FFFFFF', letterSpacing: 1, marginBottom: 16 }}>
          Gro<Text style={{ color: '#FACC15' }}>Cart</Text>
        </Text>
        <ActivityIndicator size="large" color="#FACC15" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
        <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />

        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ManageAddress" component={ManageAddressScreen} />

        <Stack.Screen name="PromoDetails" component={PromoDetailsScreen} />
        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />

        <Stack.Screen name="Orders" component={MyOrdersScreen} />
        <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
        <Stack.Screen name="CheckoutDetails" component={CheckoutScreen} />
        <Stack.Screen name="DeliveryOrderDetails" component={DeliveryOrderDetailsScreen} />
        <Stack.Screen name="OrderConfirmation" component={OrderConfirmationScreen} />

        <Stack.Screen name="QRScanner" component={QRScannerScreen} />
        <Stack.Screen name="TestQRScannerButtonScreen" component={TestQRScannerButtonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}