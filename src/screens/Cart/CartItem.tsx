import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../store';
import { decrementQuantity, incrementQuantity } from '../../store/slices/cartSlice';
import { ProductDetails } from '../../types/ProductDetails';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigation';
import { resolveImageUrl } from '../../Utility/apiConfig';

interface Props {
  item: ProductDetails;
}

type ProductScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetails'>;

const CartItem = ({ item }: Props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<ProductScreenNavigationProp>();

  const quantity = useSelector((state: RootState) => {
    const cartItem = state.cart.items.find((p) => p.id === item.id);
    return cartItem ? cartItem.quantity : 1;
  });

  const unitPrice = item.discountPrice > 0 ? item.discountPrice : item.price;
  const hasDiscount = item.price > unitPrice;
  const totalItemPrice = unitPrice * quantity;

  const handlePress = () => {
    navigation.navigate('ProductDetails', { productId: item.id.toString() });
  };

  return (
    <View style={styles.cardContainer}>
      {/* Clickable Image + Info */}
      <TouchableOpacity style={styles.leftSection} onPress={handlePress} activeOpacity={0.85}>
        <View style={styles.imageBackdrop}>
          {item.imageUrl ? (
            <Image source={{ uri: resolveImageUrl(item.imageUrl) }} style={styles.image} resizeMode="contain" />
          ) : null}
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {item.name || item.title}
          </Text>
          <Text style={styles.unitSize}>{item.unitSize || '1 Unit'}</Text>

          {/* Unit Price */}
          <View style={styles.priceRow}>
            <Text style={styles.unitPriceText}>₹{unitPrice}</Text>
            {hasDiscount && (
              <Text style={styles.mrpText}>₹{item.price}</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Right Stepper & Line Total */}
      <View style={styles.rightSection}>
        <View style={styles.stepperContainer}>
          <TouchableOpacity
            onPress={() => dispatch(decrementQuantity(item.id))}
            style={styles.stepperBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.stepperBtnText}>−</Text>
          </TouchableOpacity>

          <Text style={styles.quantityText}>{quantity}</Text>

          <TouchableOpacity
            onPress={() => dispatch(incrementQuantity(item.id))}
            style={styles.stepperBtn}
            activeOpacity={0.8}
          >
            <Text style={styles.stepperBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.lineTotalText}>₹{totalItemPrice.toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  imageBackdrop: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  unitSize: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 4,
  },
  unitPriceText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginRight: 6,
  },
  mrpText: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C831F',
    borderRadius: 9,
    height: 38,
    paddingHorizontal: 4,
    marginBottom: 6,
  },
  stepperBtn: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 22,
  },
  quantityText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    marginHorizontal: 8,
  },
  lineTotalText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#059669',
  },
});

export default CartItem;
