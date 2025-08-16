// components/CartIcon.tsx

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';


const CartIcon = ({onPress }) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const count = cartItems.reduce((total, item) => total + item.quantity, 0);
  return (
    <TouchableOpacity 
    style={styles.container} 
    onPress={onPress}
    accessibilityLabel="Cart"
      accessibilityHint="Navigates to cart screen"
      accessibilityRole="button"
      >
      <Icon name="cart-outline" size={28} color="#333" />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    marginRight: 16,
  },
  badge: {
    position: 'absolute',
    right: 4,
    top: 4,
    backgroundColor: '#FF5A4D',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    minWidth: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default CartIcon;
