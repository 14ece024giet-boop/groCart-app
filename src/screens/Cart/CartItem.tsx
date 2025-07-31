// components/CartItem.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

const CartItem = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imagePlaceholder} />
      <View style={styles.details}>
        <Text style={styles.weight}>1 Ltr</Text>
        <Text style={styles.title}>Dummy Product title add will be here</Text>
        <View style={styles.controls}>
          <TouchableOpacity><Text style={styles.controlButton}>-</Text></TouchableOpacity>
          <Text style={styles.quantity}>1</Text>
          <TouchableOpacity><Text style={styles.controlButton}>+</Text></TouchableOpacity>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.oldPrice}>$15</Text>
          <Text style={styles.newPrice}>$12</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', marginBottom: 16, padding: 12 },
  imagePlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#ccc',
    borderRadius: 8,
  },
  details: { flex: 1, marginLeft: 12 },
  weight: { fontSize: 12, color: '#999' },
  title: { fontSize: 14, fontWeight: '600', marginVertical: 4 },
  controls: { flexDirection: 'row', alignItems: 'center', marginVertical: 6 },
  controlButton: {
    width: 24,
    height: 24,
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#ddd',
  },
  quantity: { marginHorizontal: 8 },
  priceRow: { flexDirection: 'row', alignItems: 'center' },
  oldPrice: { textDecorationLine: 'line-through', marginRight: 8, color: '#888' },
  newPrice: { color: '#FF5A4D', fontWeight: 'bold' },
});

export default CartItem;
