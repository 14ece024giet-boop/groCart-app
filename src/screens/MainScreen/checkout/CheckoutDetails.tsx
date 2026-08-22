// screens/CheckoutScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { RouteProp, useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/navigation';
import { createOrderApi } from '../../../Utility/orderService';
import { getUserAddressApi, UserAddressDto } from '../../../Utility/userAddressApi';
import { StackNavigationProp } from '@react-navigation/stack';
import { clearCart } from '../../../store/slices/cartSlice';

type CheckoutDetailsRouteProp = RouteProp<RootStackParamList, 'CheckoutDetails'>;
type CheckoutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CheckoutDetails'>;

type OrderPayload = {
  items: { productId: string; quantity: number }[];
  deliveryType: 'COD';
  deliveryPointId: number;
  recipientName: string;
  roomNumber: string;
  additionalInfo: string;
  couponCode?: string;
};

const CheckoutScreen = () => {
  const route = useRoute<CheckoutDetailsRouteProp>();
  const navigation = useNavigation<CheckoutScreenNavigationProp>();
  const dispatch = useDispatch();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);

  const [userAddress, setUserAddress] = useState<UserAddressDto | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const couponCode = route.params?.couponCode || '';
  const deliveryType: 'COD' = 'COD';
  const deliveryFee = 5;

  // Calculate prices
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalAfterDiscount = cartItems.reduce(
    (acc, item) => acc + item.discountPrice * item.quantity,
    0
  );
  const discountAmount = subtotal - totalAfterDiscount;
  const grandTotal = totalAfterDiscount + deliveryFee;

  // Fetch saved profile delivery address (refresh when screen comes into focus)
  const fetchAddress = async () => {
    setIsLoadingAddress(true);
    try {
      const response = await getUserAddressApi();
      if (response?.success && response?.data) {
        setUserAddress(response.data);
      } else {
        setUserAddress(null);
      }
    } catch (err: any) {
      console.error('Failed to load user address:', err.message);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddress();
    }, [])
  );

  const buildOrderPayload = (): OrderPayload => ({
    items: cartItems.map((item) => ({
      productId: String(item.id),
      quantity: item.quantity,
    })),
    deliveryType,
    deliveryPointId: Number(userAddress?.deliveryPointId || 0),
    recipientName: userAddress?.userName || '',
    roomNumber: userAddress?.roomNumber || '',
    additionalInfo: additionalInfo.trim(),
    ...(couponCode ? { couponCode } : {}),
  });

  const withLoading = async (callback: () => Promise<void>) => {
    setIsPlacingOrder(true);
    try {
      await callback();
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Unexpected error occurred.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!userAddress || !userAddress.deliveryPointId) {
      Alert.alert(
        'Address Required',
        'Please configure your delivery address before placing an order.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Set Address', onPress: () => navigation.navigate('ManageAddress') },
        ]
      );
      return;
    }

    if (!userAddress.roomNumber?.trim()) {
      Alert.alert(
        'Room Number Required',
        'Please enter your room / flat number in your profile address.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Update Address', onPress: () => navigation.navigate('ManageAddress') },
        ]
      );
      return;
    }

    await withLoading(async () => {
      const payload = buildOrderPayload();
      const result = await createOrderApi(payload);

      if (result.success) {
        // Clear cart after successful order
        dispatch(clearCart());

        // Navigate to order confirmation screen
        navigation.navigate('OrderConfirmation', {
          qrCodeUrl: result.data?.qrCodeUrl ?? '',
        });
      } else {
        Alert.alert('Failed', result.message || 'Something went wrong while placing your order.');
      }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.heading}>Checkout Details</Text>

          {/* User's Profile Delivery Address Card */}
          {isLoadingAddress ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color="#FF5A4D" />
              <Text style={styles.loadingBoxText}>Loading delivery address...</Text>
            </View>
          ) : userAddress ? (
            <View style={styles.addressCard}>
              <View style={styles.addressCardHeader}>
                <View style={styles.addressTitleRow}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={styles.addressCardTitle}>Delivery Address</Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('ManageAddress')}
                  style={styles.changeButton}
                >
                  <Text style={styles.changeButtonText}>Change</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.addressDetails}>
                <Text style={styles.deliveryPointName}>
                  {userAddress.deliveryPointAddress || 'Authorized Delivery Point'}
                </Text>

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Room / Flat:</Text>
                  <Text style={styles.infoValue}>{userAddress.roomNumber || 'Not specified'}</Text>
                </View>

                {userAddress.userName ? (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Contact:</Text>
                    <Text style={styles.infoValue}>
                      {userAddress.userName}{' '}
                      {userAddress.phoneNumber ? `(${userAddress.phoneNumber})` : ''}
                    </Text>
                  </View>
                ) : null}
              </View>
            </View>
          ) : (
            <View style={styles.emptyAddressCard}>
              <Text style={styles.emptyAddressTitle}>⚠️ No Saved Address</Text>
              <Text style={styles.emptyAddressDesc}>
                You have not configured a delivery point yet. Please select an authorized delivery point to proceed.
              </Text>
              <TouchableOpacity
                style={styles.addAddressButton}
                onPress={() => navigation.navigate('ManageAddress')}
              >
                <Text style={styles.addAddressButtonText}>+ Set Delivery Address</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Optional Additional Instructions */}
          <View style={styles.notesSection}>
            <Text style={styles.notesLabel}>Delivery Instructions (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="e.g. Call upon arriving at lobby desk"
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
              placeholderTextColor="#999"
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Pricing Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, { color: '#00A86B' }]}>
                -₹{discountAmount.toFixed(2)}
              </Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRowTotal}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>₹{grandTotal.toFixed(2)}</Text>
            </View>
          </View>

          {/* Place Order Button */}
          <TouchableOpacity
            style={[styles.placeOrderButton, isPlacingOrder && { opacity: 0.7 }]}
            onPress={handlePlaceOrder}
            disabled={isPlacingOrder}
            activeOpacity={0.85}
          >
            {isPlacingOrder ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.placeOrderButtonText}>Place Order (COD)</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 54,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#111',
  },
  loadingBox: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 16,
  },
  loadingBoxText: {
    marginTop: 8,
    fontSize: 13,
    color: '#666',
  },
  addressCard: {
    backgroundColor: '#FFF8F7',
    borderWidth: 1.5,
    borderColor: '#FFD6D1',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  addressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE5E1',
    paddingBottom: 8,
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  addressCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
  },
  changeButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#FF5A4D',
    borderRadius: 6,
  },
  changeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },
  addressDetails: {
    marginTop: 2,
  },
  deliveryPointName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF5A4D',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 13,
    color: '#777',
    width: 90,
  },
  infoValue: {
    fontSize: 13,
    color: '#222',
    fontWeight: '600',
    flex: 1,
  },
  emptyAddressCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    alignItems: 'center',
  },
  emptyAddressTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#B45309',
    marginBottom: 6,
  },
  emptyAddressDesc: {
    fontSize: 13,
    color: '#78350F',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 18,
  },
  addAddressButton: {
    backgroundColor: '#FF5A4D',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addAddressButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  notesSection: {
    marginBottom: 16,
  },
  notesLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 6,
  },
  notesInput: {
    borderWidth: 1.5,
    borderColor: '#E8E8E8',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#FAFAFA',
    minHeight: 50,
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#222',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 10,
  },
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#111',
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#FF5A4D',
  },
  placeOrderButton: {
    backgroundColor: '#FF5A4D',
    paddingVertical: 16,
    borderRadius: 10,
    marginTop: 24,
    alignItems: 'center',
    shadowColor: '#FF5A4D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  placeOrderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});
