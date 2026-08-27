import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import CartItem from './CartItem';
import CouponInput from './CouponInput';
import CartSummary from './CartSummary';
import CheckoutButton from '../MainScreen/checkout/CheckoutButton';
import BottomTabBar from '../MainScreen/BottomTabNavigatorScreen/BottomTabBar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getProductsByIdsApi } from '../../Utility/HomeProductsApi';
import { updateCartItems } from '../../store/slices/cartSlice';
import { useNavigation } from '@react-navigation/native';

const CartScreen = () => {
  const navigation = useNavigation<any>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [couponCode, setCouponCode] = useState('');
  const dispatch = useDispatch();

  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const syncCart = async () => {
      const ids = cartItems.map((item) => item.id);
      if (ids.length === 0) return;

      try {
        const response = await getProductsByIdsApi(ids);
        if (response?.data) {
          dispatch(updateCartItems(response.data));
        }
      } catch (err) {
        console.error('Error syncing cart with server:', err);
      }
    };

    syncCart();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Shopping Cart</Text>

        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{totalItemCount} Items</Text>
        </View>
      </View>

      {/* Township Express Delivery Banner */}
      <View style={styles.expressBanner}>
        <Text style={styles.expressBannerIcon}>⚡</Text>
        <Text style={styles.expressBannerText}>
          10-15 MIN EXPRESS DELIVERY TO YOUR TOWNSHIP QUARTER
        </Text>
      </View>

      {cartItems.length === 0 ? (
        /* Executive Empty Cart State */
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptySub}>
            Explore 5,000+ township groceries, fresh dairy, and executive pantry items!
          </Text>
          <TouchableOpacity
            style={styles.shopNowBtn}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.85}
          >
            <Text style={styles.shopNowBtnText}>Explore HyperMarket →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Cart Item List */}
          <View style={styles.itemList}>
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </View>

          {/* Coupon Code Section */}
          <CouponInput value={couponCode} onChangeText={setCouponCode} />

          {/* Bill Summary Breakdown */}
          <CartSummary />

          {/* Checkout CTA */}
          <CheckoutButton couponCode={couponCode} />
        </ScrollView>
      )}

      {/* Persistent Bottom Navigation Tab Bar */}
      <BottomTabBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  backIcon: {
    fontSize: 18,
    color: '#0F172A',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  countBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  countBadgeText: {
    color: '#059669',
    fontSize: 11,
    fontWeight: '900',
  },
  expressBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  expressBannerIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  expressBannerText: {
    color: '#FACC15',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  shopNowBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  shopNowBtnText: {
    color: '#FACC15',
    fontSize: 14,
    fontWeight: '900',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 160,
  },
  itemList: {
    marginBottom: 4,
  },
});

export default CartScreen;
