import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import CartIcon from '../screens/Cart/CartIcon';
import CartScreen from '../screens/Cart/CartScreen';
import MainScreen from '../screens/MainScreen/MainScreen';
import PromoBanner from '../screens/MainScreen/Promo/PromoBanner';
import PromoDetailsScreen from '../screens/MainScreen/Promo/PromoDetailsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="PromoDetails" component={PromoDetailsScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}