// components/CartSummary.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CartSummary = () => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text>Delivery Fees</Text>
        <Text>$05</Text>
      </View>
      <View style={styles.row}>
        <Text>Discount</Text>
        <Text>-$06</Text>
      </View>
      <View style={styles.row}>
        <Text>Total Price</Text>
        <Text>$24</Text>
      </View>
      <View style={styles.rowBold}>
        <Text>Grand Total</Text>
        <Text style={styles.grandTotal}>$23</Text>
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
