import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/navigation';
import { createOrderApi } from '../../../Utility/orderService';

const CheckoutScreen = () => {
  type CheckoutDetailsRouteProp = RouteProp<RootStackParamList, 'CheckoutDetails'>;
  const route = useRoute<CheckoutDetailsRouteProp>();
  const navigation = useNavigation();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const couponCode = route.params?.couponCode || '';
  const deliveryType: 'COD' = 'COD';

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = 5;
  const grandTotal = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    const payload = {
      items: cartItems.map(item => ({
        productId: String(item.id),
        quantity: item.quantity,
      })),
      deliveryDate: date.toISOString(),
      deliveryType,
      couponCode: couponCode || undefined, // ✅ include couponCode if available
    };

    try {
      setIsPlacingOrder(true);
      const result = await createOrderApi(payload);
      if (result.success) {
        Alert.alert('Order Placed', `Order ID: ${result.data.orderId}`, [
          {
            text: 'OK',
            onPress: () => navigation.goBack(), // Navigate elsewhere if needed
          },
        ]);
      } else {
        Alert.alert('Failed', result.message || 'Something went wrong');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const renderCartItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <Text style={styles.cartItemText}>{item.name}</Text>
      <Text style={styles.cartItemText}>x{item.quantity}</Text>
      <Text style={styles.cartItemText}>${(item.price * item.quantity).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Checkout Details</Text>

      {/* Delivery Date */}
      <TouchableOpacity style={styles.row} onPress={() => setShowDatePicker(true)}>
        <View>
          <Text style={styles.label}>Delivery Date</Text>
          <Text style={styles.rowText}>
            {date.toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}{' '}
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* Delivery Address */}
      <TouchableOpacity style={styles.row}>
        <View>
          <Text style={styles.label}>Delivery Address</Text>
          <Text style={styles.rowText}>1234 Main St, City, Country</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* Cart Items */}
      <View style={{ marginTop: 20 }}>
        <Text style={styles.sectionTitle}>Cart Items</Text>
        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderCartItem}
          style={styles.cartList}
        />
      </View>

      {/* Pricing Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text>Subtotal</Text>
          <Text>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text>Delivery Fee</Text>
          <Text>${deliveryFee.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRowTotal}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${grandTotal.toFixed(2)}</Text>
        </View>
      </View>

      {/* Place Order Button */}
      <TouchableOpacity
        style={[styles.placeOrderButton, isPlacingOrder && { opacity: 0.6 }]}
        onPress={handlePlaceOrder}
        disabled={isPlacingOrder}
      >
        {isPlacingOrder ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
        )}
      </TouchableOpacity>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode={Platform.OS === 'ios' ? 'datetime' : 'date'}
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

export default CheckoutScreen;
const styles = StyleSheet.create({
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  rowText: {
    fontSize: 16,
    color: '#111',
    fontWeight: '500',
  },
  arrow: {
    fontSize: 20,
    color: '#ccc',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 10,
    color: '#333',
  },
  cartList: {
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  cartItemText: {
    fontSize: 15,
    color: '#333',
    flex: 1,
    textAlign: 'left',
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
    marginBottom: 10,
  },
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
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
