import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import CartIcon from '../screens/Cart/CartIcon';
import CartScreen from '../screens/Cart/CartScreen';
import MainScreen from '../screens/MainScreen/MainScreen';
import PromoBanner from '../screens/MainScreen/Promo/PromoBanner';
import PromoDetailsScreen from '../screens/MainScreen/Promo/PromoDetailsScreen';
import FavoritesScreen from '../screens/MainScreen/FavoritesScreen';
import SearchScreen from '../screens/MainScreen/Search/SearchScreen';
import ProfileScreen from '../screens/MainScreen/Profile/ProfileScreen';
import EditProfileScreen from '../screens/MainScreen/Profile/EditProfileScreen';
import MyOrdersScreen from '../screens/MainScreen/Profile/MyOrdersScreen';
import OrderTrackingScreen from '../screens/MainScreen/Profile/OrderTrackingScreen';
import { RootStackParamList } from './navigation';
import ProductDetailsScreen from '../screens/MainScreen/ProductDetials/ProductDetailsScreen';
import ProductScreen from '../screens/MainScreen/ProductDetials/ProductDetailsScreen';
import CreateAccountScreen from '../screens/MainScreen/Account/CreateAccountScreen';
import PhoneVerificationScreen from '../screens/MainScreen/Account/PhoneVerificationScreen';
import OtpVerificationScreen from '../screens/MainScreen/Account/OtpVerificationScreen';
import CheckoutScreen from '../screens/MainScreen/checkout/CheckoutDetails';
import DeliveryOrderDetailsScreen from '../screens/MainScreen/checkout/DeliveryOrderDetailsScreen';
import OrderConfirmationScreen from '../screens/MainScreen/checkout/OrderConfirmationScreen';
import TestQRScannerButtonScreen from '../screens/MainScreen/checkout/TestQRScannerButtonScreen';
import QRScannerScreen from '../screens/MainScreen/checkout/QRCodeScannerScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
       <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={PhoneVerificationScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
        <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />

        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />

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