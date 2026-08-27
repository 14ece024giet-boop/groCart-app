import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { RootStackParamList } from '../../../navigation/navigation';

type CheckoutButtonNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CheckoutDetails'>;

interface CheckoutButtonProps {
  couponCode: string;
}

const CheckoutButton: React.FC<CheckoutButtonProps> = ({ couponCode }) => {
  const navigation = useNavigation<CheckoutButtonNavigationProp>();

  const handleCheckout = () => {
    navigation.navigate('CheckoutDetails', { couponCode });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleCheckout} activeOpacity={0.9}>
      <Text style={styles.buttonText}>PROCEED TO CHECKOUT →</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 36,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: '#FACC15',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});

export default CheckoutButton;
