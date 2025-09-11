import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getMockCheckoutData } from '../../../Services/searchService';

const CheckoutScreen = () => {
  const [checkoutData, setCheckoutData] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [deliveryType, setDeliveryType] = useState('Delivery');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMockCheckoutData();
      setCheckoutData(data);
      setDate(new Date(data.deliveryDate));
    };

    fetchData();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    if (event.type === 'set' && selectedDate) {
      setDate(selectedDate);
    }
    setShowDatePicker(false);
  };

  if (!checkoutData) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Checkout Details</Text>

      {/* Delivery Date */}
      <TouchableOpacity
        style={styles.row}
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.7}
      >
        <View>
          <Text style={styles.label}>Delivery Date</Text>
          <Text style={styles.rowText}>
            {date.toLocaleDateString(undefined, {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })},{' '}
            {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* Delivery Address */}
      <TouchableOpacity style={styles.row} activeOpacity={0.7}>
        <View>
          <Text style={styles.label}>Delivery Address</Text>
          <Text style={styles.rowText}>{checkoutData.address}</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* Delivery Type Buttons */}
      <View style={styles.deliveryOptions}>
        {['Online', 'Delivery'].map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.deliveryButton,
              deliveryType === type && styles.deliveryButtonSelected,
            ]}
            onPress={() => setDeliveryType(type)}
          >
            <Text
              style={[
                styles.deliveryButtonText,
                deliveryType === type && styles.deliveryButtonTextSelected,
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Coupon Input */}
      <View style={styles.couponRow}>
        <Text style={styles.label}>Coupon Code</Text>
        <View
          style={[
            styles.couponInputWrapper,
            couponCode && styles.couponActiveBorder,
          ]}
        >
          <TextInput
            value={couponCode}
            onChangeText={setCouponCode}
            placeholder="Enter code"
            style={styles.couponInput}
            placeholderTextColor="#aaa"
          />
          {couponCode.length > 0 && <Text style={styles.couponCheck}>✔</Text>}
        </View>
      </View>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode={Platform.OS === 'android' ? 'date' : 'datetime'}
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
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
  deliveryOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    marginBottom: 20,
  },
  deliveryButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  deliveryButtonSelected: {
    backgroundColor: '#f33',
    borderColor: '#f33',
  },
  deliveryButtonText: {
    color: '#555',
    fontWeight: '500',
    fontSize: 14,
  },
  deliveryButtonTextSelected: {
    color: '#fff',
  },
  couponRow: {
    marginTop: 10,
  },
  couponInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginTop: 4,
  },
  couponActiveBorder: {
    borderColor: '#f33',
  },
  couponInput: {
    flex: 1,
    fontSize: 16,
    color: '#111',
  },
  couponCheck: {
    fontSize: 18,
    color: '#f33',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
