// components/CartItem.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ProductDetails } from '../../types/ProductDetails';
import { useDispatch } from 'react-redux';
import { decrementQuantity, incrementQuantity } from '../../store/slices/cartSlice';

interface Props {
  item: ProductDetails;
}

const CartItem = ({ item }: Props) => {
  const dispatch = useDispatch();
return (
    <View style={styles.container}>
      <Image source={item.image} style={styles.imagePlaceholder} />
      <View style={styles.details}>
        <Text style={styles.weight}>{item.quantity || '1 Unit'}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <View style={styles.controls}>
          <TouchableOpacity onPress={() => dispatch(decrementQuantity(item.id))}>
            <Text style={styles.controlButton}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => dispatch(incrementQuantity(item.id))}>
            <Text style={styles.controlButton}>+</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.oldPrice}>${item.price}</Text>
          <Text style={styles.newPrice}>${item.discountPrice}</Text>
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
