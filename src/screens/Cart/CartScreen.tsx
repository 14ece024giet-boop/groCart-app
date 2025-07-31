// screens/CartScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CartItem from './CartItem';
import CouponInput from './CouponInput';
import CartSummary from './CartSummary';
import CheckoutButton from './CheckoutButton';

const CartScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart</Text>
        <Text style={styles.headerCount}>Total 4</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <CartItem />
        <CartItem />
        <CouponInput />
        <CartSummary />
        <CheckoutButton />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerCount: {
    fontSize: 14,
    color: '#888',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default CartScreen;
