import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Animated, ViewStyle, TextStyle } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import LongButton from '../../components/LongButton';
import QuantityButton from '../../components/QuantityButton';
import type { RootStackParamList } from '../../navigation/navigation';
import type { Product } from './Product';

type NavProp = NavigationProp<RootStackParamList, 'ProductScreen'>;

interface Props {
  title: string;
  products: Product[];
  onSeeAllPress?: () => void;
  cardStyle?: ViewStyle;
  titleStyle?: TextStyle;
  badge?: boolean;
  animateImage?: boolean;
}

const ProductListSection = ({ title, products, onSeeAllPress, cardStyle, badge, animateImage }: Props) => {
  const navigation = useNavigation<NavProp>();
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const increase = (id: number) =>
    setQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  const decrease = (id: number) =>
    setQuantities(prev => {
      const current = prev[id] || 1;
      return current > 1 ? { ...prev, [id]: current - 1 } : { ...prev, [id]: 0 };
    });
  const addToCart = (id: number) => setQuantities(prev => ({ ...prev, [id]: 1 }));

  const AnimatedImage = ({ source, index }: { source: any; index: number }) => {
    const scale = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        friction: 6,
        delay: index * 100,
      }).start();
    }, []);
    return (
      <Animated.Image
        source={source}
        style={[styles.imagePlaceholder, { transform: [{ scale }] }]}
      />
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={[styles.title]}>{title}</Text>
        {onSeeAllPress && (
          <TouchableOpacity onPress={onSeeAllPress}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {products.map((product, index) => {
          const quantity = quantities[product.id] || 0;
          return (
            <TouchableOpacity
              key={product.id}
              onPress={() =>
                navigation.navigate('ProductScreen', { productId: product.id })
              }
              style={[styles.card, cardStyle]}>
              <View style={styles.imageWrapper}>
                {animateImage ? (
                  <AnimatedImage source={product.image} index={index} />
                ) : (
                  <Image source={product.image} style={styles.image} />
                )}
                {badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Exclusive</Text>
                  </View>
                )}
              </View>

              <Text style={styles.quantityLabel}>{product.quantity}</Text>
              <Text style={styles.productTitle}>{product.title}</Text>

              {quantity === 0 ? (
                <LongButton title="Add" onPress={() => addToCart(product.id)} style={styles.addButton} />
              ) : (
                <View style={styles.counterContainer}>
                  <QuantityButton title="−" onPress={() => decrease(product.id)} style={styles.counterButton} />
                  <Text style={styles.counterText}>{quantity}</Text>
                  <QuantityButton title="+" onPress={() => increase(product.id)} style={styles.counterButton} />
                </View>
              )}

              <View style={styles.priceRow}>
                <Text style={styles.originalPrice}>${product.price}</Text>
                <Text style={styles.discountedPrice}>${product.discountPrice}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { marginBottom: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4, marginBottom: 12 },
  title: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  seeAll: { color: 'red', fontWeight: '600' },
  card: {
    width: 160,
    backgroundColor: '#fff',
    marginRight: 12,
    padding: 10,
    borderRadius: 12,
    borderColor: '#FFD700',
    borderWidth: 1,
    shadowColor: '#FFD700',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 4,
  },
  imageWrapper: { position: 'relative', marginBottom: 8 },
  imagePlaceholder: { width: '100%', height: 100, backgroundColor: '#ccc', borderRadius: 8 },
  image: { width: '100%', height: 100, resizeMode: 'contain', borderRadius: 8 },
  badge: { position: 'absolute', top: 6, left: 6, backgroundColor: '#FFD700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, zIndex: 1 },
  badgeText: { color: '#333', fontSize: 10, fontWeight: 'bold' },
  quantityLabel: { fontSize: 12, color: 'red', marginBottom: 4 },
  productTitle: { fontSize: 13, fontWeight: '500', marginBottom: 8 },
  addButton: { backgroundColor: 'red', paddingVertical: 6, borderRadius: 6, alignItems: 'center' },
  counterContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 6 },
  counterButton: { backgroundColor: 'red', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
  counterText: { marginHorizontal: 10, fontSize: 16, fontWeight: 'bold' },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  originalPrice: { textDecorationLine: 'line-through', color: '#999' },
  discountedPrice: { color: 'red', fontWeight: 'bold' },
});

export default ProductListSection;
