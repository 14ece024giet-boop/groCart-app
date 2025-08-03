import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/MainScreen/Account/SignInScreen';
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

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator id={undefined} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="PromoDetails" component={PromoDetailsScreen} />
        <Stack.Screen name="Favorites" component={FavoritesScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="Orders" component={MyOrdersScreen} />
        <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
        <Stack.Screen name="OtpVerification" component={OtpVerificationScreen
          
        } />





      </Stack.Navigator>
    </NavigationContainer>
  );
}