import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../store';
import { decrementQuantity, incrementQuantity } from '../../store/slices/cartSlice';
import { ProductDetails } from '../../types/ProductDetails';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigation'; // adjust import path if needed

interface Props {
  item: ProductDetails;
}

type ProductScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetails'>;

const CartItem = ({ item }: Props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<ProductScreenNavigationProp>();

  // ✅ Get quantity for this item from Redux
  const quantity = useSelector((state: RootState) => {
    const cartItem = state.cart.items.find((p) => p.id === item.id);
    return cartItem ? cartItem.quantity : 1;
  });

  // ✅ Calculate totals
  const totalOriginal = item.price * quantity;
  const totalDiscounted = item.discountPrice ? item.discountPrice * quantity : totalOriginal;

  // 🛒 Navigate to Product Details
  const handlePress = () => {
    navigation.navigate('ProductDetails', { productId: item.id.toString() });
  };

  return (
    <View style={styles.container}>
      {/* Clickable Section (Image + Info) */}
      <TouchableOpacity style={styles.leftSection} onPress={handlePress} activeOpacity={0.8}>
        <Image source={{ uri: item.imageUrl }} style={styles.imagePlaceholder} />
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.weight}>{item.unitSize || '1 Unit'}</Text>

              {/* Per Unit Price */}
        <View style={styles.priceRow}>
          {item.discountPrice && item.discountPrice < item.price ? (
            <>
              <Text style={styles.oldPrice}>{item.price.toFixed(2)}</Text>
              <Text style={styles.newPrice}>{(item.price-item.discountPrice).toFixed(2)}</Text>
            </>
          ) : (
            <Text style={styles.newPrice}>${item.price.toFixed(2)}</Text>
          )}
        </View>
      
        </View>
      </TouchableOpacity>

      {/* Quantity Controls */}
      <View style={styles.rightContainer}>
        <View style={styles.controls}>
          <TouchableOpacity
            onPress={() => dispatch(decrementQuantity(item.id))}
            style={styles.controlButton}
          >
            <Text style={styles.controlText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.quantity}>{quantity}</Text>

          <TouchableOpacity
            onPress={() => dispatch(incrementQuantity(item.id))}
            style={styles.controlButton}
          >
            <Text style={styles.controlText}>＋</Text>
          </TouchableOpacity>
        </View>

         {/* Total Row (side by side) */}
          <View style={styles.totalRow}>
            {totalOriginal !== totalDiscounted && (
              <Text style={styles.oldTotal}>{totalOriginal.toFixed(2)}</Text>
            )}
            <Text style={styles.newTotal}>{(totalOriginal-totalDiscounted).toFixed(2)}</Text>
          </View>
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 70,
    height: 70,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  weight: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },

  // 💰 Total Row
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  oldTotal: {
    textDecorationLine: 'line-through',
    color: '#e81010ff',
    fontSize: 13,
  },
  newTotal: {
    color: '#13730aff',
    fontWeight: '700',
    fontSize: 14,
  },

  // ➕ Quantity Controls
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 70,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  controlButton: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlText: {
    fontSize: 16,
    color: '#333',
  },
  quantity: {
    marginHorizontal: 8,
    fontSize: 14,
    fontWeight: '500',
  },

  // 💲Per-unit Price
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#e01111ff',
    fontSize: 12,
  },
  newPrice: {
    color: '#13730aff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
