// screens/CheckoutScreen.tsx

import React, { useEffect, useState } from 'react';
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
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/navigation';
import { createOrderApi } from '../../../Utility/orderService';
import { getUserAddressApi, UserAddressDto } from '../../../Utility/userAddressApi';
import { StackNavigationProp } from '@react-navigation/stack';
import { clearCart } from '../../../store/slices/cartSlice'; // ✅ Import cart reset action

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

  const [userAddress, setUserAddress] = useState<UserAddressDto | null>(null);
  const [recipientName, setRecipientName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const couponCode = route.params?.couponCode || '';
  const deliveryType: 'COD' = 'COD';
  const deliveryFee = 5;

  // ✅ Calculate prices
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalAfterDiscount = cartItems.reduce(
    (acc, item) => acc + item.discountPrice * item.quantity,
    0
  );
  const discountAmount = totalAfterDiscount;
  const grandTotal = subtotal - totalAfterDiscount + deliveryFee;

  // ✅ Fetch user address once
  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const response = await getUserAddressApi();
        if (response.success && response.data) {
          const data = response.data;
          setUserAddress(data);
          setRecipientName(data.userName || '');
          setRoomNumber(data.roomNumber || '');
        }
      } catch (err: any) {
        console.error('Failed to load user address:', err.message);
      }
    };

    fetchUserAddress();
  }, []);

  const buildOrderPayload = (): OrderPayload => ({
    items: cartItems.map(item => ({
      productId: String(item.id),
      quantity: item.quantity,
    })),
    deliveryType,
    deliveryPointId: Number(userAddress!.deliveryPointId),
    recipientName,
    roomNumber: roomNumber || '',
    additionalInfo: additionalInfo || '',
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
    if (!userAddress?.deliveryPointId) {
      Alert.alert('Delivery point is missing from your profile.');
      return;
    }

    await withLoading(async () => {
      const payload = buildOrderPayload();
      const result = await createOrderApi(payload);

      if (result.success) {
        // ✅ Clear cart after successful order
        dispatch(clearCart());

        // ✅ Navigate to order confirmation screen
        navigation.navigate('OrderConfirmation', {
          qrCodeUrl: result.data?.qrCodeUrl ?? '',
        });
      } else {
        Alert.alert('Failed', result.message || 'Something went wrong while placing your order.');
      }
    });
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.heading}>Checkout Details</Text>

          {/* Address Details */}
          <View style={{ marginTop: 20 }}>
            <Text style={styles.label}>Recipient Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter recipient name"
              value={recipientName}
              onChangeText={setRecipientName}
            />

            <Text style={styles.label}>Room Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter room number"
              value={roomNumber}
              onChangeText={setRoomNumber}
            />

            <Text style={styles.label}>Additional Info</Text>
            <TextInput
              style={styles.input}
              placeholder="Additional instructions (optional)"
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
            />
          </View>

          {/* Pricing Summary */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text>Subtotal</Text>
              <Text>{subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text>Discount</Text>
              <Text style={{ color: '#0a0' }}>-{discountAmount.toFixed(2)}</Text>
            </View>

            <View style={styles.separator} />

            <View style={styles.summaryRow}>
              <Text>Delivery Fee</Text>
              <Text>{deliveryFee.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRowTotal}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>{grandTotal.toFixed(2)}</Text>
            </View>
          </View>

          {/* Place Order Button */}
          <TouchableOpacity
            style={[styles.placeOrderButton, isPlacingOrder && { opacity: 0.7 }]}
            onPress={handlePlaceOrder}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.placeOrderButtonText}>Place Order</Text>
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
    paddingTop: 60,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 30,
    color: '#111',
  },
  label: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  summaryContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  separator: {
    height: 1,
    backgroundColor: '#E6E6E6',
    marginVertical: 10,
  },
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#111',
  },
  totalValue: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#f33',
  },
  placeOrderButton: {
    backgroundColor: '#f33',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 30,
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
