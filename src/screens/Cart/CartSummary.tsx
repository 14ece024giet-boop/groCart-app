// components/CartSummary.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';


const CartSummary = () => {
   const items = useSelector((state: RootState) => state.cart.items);
   const deliveryFee = 5;
   const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
   const discountedPrice = items.reduce((sum, item) => sum + item.discountPrice * item.quantity, 0);
    const discount = totalPrice - discountedPrice;
    const grandTotal = discountedPrice + deliveryFee;

 return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text>Delivery Fees</Text>
        <Text>${deliveryFee.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text>Discount</Text>
        <Text>-${discount.toFixed(2)}</Text>
      </View>
      <View style={styles.row}>
        <Text>Total Price</Text>
        <Text>${totalPrice.toFixed(2)}</Text>
      </View>
      <View style={styles.rowBold}>
        <Text>Grand Total</Text>
        <Text style={styles.grandTotal}>${grandTotal.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 12, paddingHorizontal: 8 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowBold: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  grandTotal: {
    color: '#FF5A4D',
    fontWeight: 'bold',
  },
});

export default CartSummary;
