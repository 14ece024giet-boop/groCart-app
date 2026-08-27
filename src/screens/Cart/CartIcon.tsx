import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface Props {
  onPress: () => void;
}

const CartIcon = ({ onPress }: Props) => {
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
      <Text style={styles.iconText}>🛒</Text>
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
    position: 'relative',
  },
  iconText: {
    fontSize: 22,
  },
  badge: {
    position: 'absolute',
    right: 4,
    top: 4,
    backgroundColor: '#0C831F',
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
