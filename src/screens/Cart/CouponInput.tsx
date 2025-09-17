// components/CouponInput.tsx
import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
}

const CouponInput: React.FC<Props> = ({ value, onChangeText }) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Coupon Code"
        value={value}
        onChangeText={onChangeText}
        style={styles.input}
      />
      {value ? <Text style={styles.applied}>✔</Text> : null}
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
