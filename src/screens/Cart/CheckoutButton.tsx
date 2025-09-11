// components/CheckoutButton.tsx
import { useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { RootStackParamList } from '../../navigation/navigation';

type CheckoutButtonNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CheckoutDetails'>;

const CheckoutButton = () => {
   const navigation = useNavigation<CheckoutButtonNavigationProp>();
  const handleCheckout = () => {
    navigation.navigate('CheckoutDetails');
  };
  return (
   <TouchableOpacity style={styles.button} onPress={handleCheckout}>
      <Text style={styles.buttonText}>CHECKOUT</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FF5A4D',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CheckoutButton;
