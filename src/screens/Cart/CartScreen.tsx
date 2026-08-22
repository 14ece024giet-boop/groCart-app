// screens/CartScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CartItem from './CartItem';
import CouponInput from './CouponInput';
import CartSummary from './CartSummary';
import CheckoutButton from '../MainScreen/checkout/CheckoutButton';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getProductsByIdsApi } from '../../Utility/HomeProductsApi';
import { updateCartItems } from '../../store/slices/cartSlice';

const CartScreen = () => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [couponCode, setCouponCode] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
  const syncCart = async () => {
    const ids = cartItems.map((item) => item.id);
    if (ids.length === 0) return;

    try {
      const response = await getProductsByIdsApi(ids);
      dispatch(updateCartItems(response.data));
    } catch (err) {
      console.error('Error syncing cart with server:', err);
    }
  };

  syncCart();
}, []);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cart</Text>
        <Text style={styles.headerCount}>Total {cartItems.length}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
        <CouponInput value={couponCode} onChangeText={setCouponCode} />
        <CartSummary />
         <CheckoutButton couponCode={couponCode} />
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
