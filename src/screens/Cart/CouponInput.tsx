// components/CouponInput.tsx
import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const CouponInput = () => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Coupon Code"
        value="gro50get"
        style={styles.input}
      />
      <Text style={styles.applied}>✔</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'center',
    marginVertical: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  applied: {
    color: '#FF5A4D',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CouponInput;
