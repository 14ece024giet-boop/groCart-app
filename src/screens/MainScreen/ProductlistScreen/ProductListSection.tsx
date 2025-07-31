import React, { useState, useRef, useEffect, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { Product } from './Product';
import LongButton from '../../../components/LongButton';
import QuantityButton from '../../../components/QuantityButton';

interface Props {
  title: string;
  products: Product[];
  onSeeAllPress?: () => void;
  cardStyle?: ViewStyle;
  titleStyle?: TextStyle;
  badge?: boolean;
  animateImage?: boolean;
}

const ProductListSection = ({
  title,
  products,
  onSeeAllPress,
  cardStyle,
  badge,
  animateImage,
}: Props) => {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  // Ref to keep track of animated product IDs (won't trigger re-render)
  const animatedProductIdsRef = useRef<Set<number>>(new Set());

  // Ref to store scale Animated.Values per product ID to preserve animation state
  const scaleMapRef = useRef<{ [key: number]: Animated.Value }>({});

  // Functions to get or create scale Animated.Value per product ID
  const getScale = (id: number) => {
    if (!scaleMapRef.current[id]) {
      scaleMapRef.current[id] = new Animated.Value(0);
    }
    return scaleMapRef.current[id];
  };

  const increase = (id: number) => {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] || 1) + 1 }));
  };

  const decrease = (id: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 1;
      return current > 1 ? { ...prev, [id]: current - 1 } : { ...prev, [id]: 0 };
    });
  };

  const addToCart = (id: number) => {
    setQuantities((prev) => ({ ...prev, [id]: 1 }));
  };

  // Memoized AnimatedImage to prevent unnecessary re-renders
  const AnimatedImage = memo(({ source, id, index }: { source: any; id: number; index: number }) => {
    const scale = getScale(id);

    useEffect(() => {
      // Only animate if this product hasn't been animated before
      if (!animatedProductIdsRef.current.has(id)) {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          friction: 6,
          delay: index * 100,
        }).start(() => {
          animatedProductIdsRef.current.add(id);
          // No state update here to avoid re-renders
        });
      } else {
        scale.setValue(1); // If already animated, set scale immediately to 1
      }
    }, [id, index, scale]);

    return (
      <Animated.Image
        source={source}
        style={[
          styles.imagePlaceholder,
          {
            transform: [{ scale }],
          },
        ]}
      />
    );
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
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
            <View key={product.id} style={styles.card}>
              <View style={[styles.imagePlaceholder, cardStyle]}>
                {animateImage ? (
                  <AnimatedImage source={product.image} id={product.id} index={index} />
                ) : (
                  <Image source={product.image} style={[styles.image]} />
                )}
                {badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Exclusive</Text>
                  </View>
                )}
              </View>
              <Text style={styles.quantity}>{product.quantity}</Text>
              <Text style={styles.productTitle}>{product.title}</Text>

              {quantity === 0 ? (
                <LongButton
                  title="Add"
                  onPress={() => addToCart(product.id)}
                  style={styles.addButton}
                />
              ) : (
                <View style={styles.counterContainer}>
                  <QuantityButton
                    title="−"
                    onPress={() => decrease(product.id)}
                    style={styles.counterButton}
                  />
                  <Text style={styles.counterText}>{quantity}</Text>
                  <QuantityButton
                    title="+"
                    onPress={() => increase(product.id)}
                    style={styles.counterButton}
                  />
                </View>
              )}

              <View style={styles.priceRow}>
                <Text style={styles.originalPrice}>${product.price}</Text>
                <Text style={styles.discountedPrice}>${product.discountPrice}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
  seeAll: {
    color: 'red',
    fontWeight: '600',
  },
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
  imagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 8,
  },
  badge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#FFD700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  badgeText: {
    color: '#333',
    fontSize: 10,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 12,
    color: 'red',
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  addButton: {
    backgroundColor: 'red',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  counterButton: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  counterText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  discountedPrice: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default ProductListSection;
