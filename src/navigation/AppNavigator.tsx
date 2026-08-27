import React, { useEffect } from 'react';
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

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 1. Load cart stored locally on device immediately
    dispatch(loadLocalCart() as any);
    // 2. Hydrate cart stored on Azure SQL server for authenticated account
    dispatch(fetchAndHydrateServerCart() as any);
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
        <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />

        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Home" component={MainScreen} />
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