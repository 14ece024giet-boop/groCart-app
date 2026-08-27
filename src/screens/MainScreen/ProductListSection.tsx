import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../navigation/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
} from '../../store/slices/cartSlice';
import { ProductListItemDto } from '../../types/ProductListItemDto';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
// 2.3 "Peek" Carousel: 2 full cards + ~30% peek of 3rd card inviting swipe
const CARD_WIDTH = Math.floor((SCREEN_WIDTH - 32) * 0.43);

type NavProp = NavigationProp<RootStackParamList, 'ProductDetails'>;

interface Props {
  title: string;
  products: ProductListItemDto[];
  onSeeAllPress?: () => void;
  cardStyle?: ViewStyle;
  titleStyle?: TextStyle;
  badge?: boolean;
  animateImage?: boolean;
  sectionType?: 'bestSelling' | 'exclusive';
}

const ProductListSection = ({
  title,
  products,
  onSeeAllPress,
  cardStyle,
  titleStyle,
  badge,
  sectionType = 'bestSelling',
}: Props) => {
  const navigation = useNavigation<NavProp>();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const getQuantity = (productId: number) =>
    cartItems.find((item) => item.id === productId)?.quantity || 0;

  const handleAdd = (product: ProductListItemDto) => {
    dispatch(addToCart(product));
  };

  const handleIncrease = (id: number) => {
    dispatch(incrementQuantity(id));
  };

  const handleDecrease = (id: number) => {
    dispatch(decrementQuantity(id));
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
        </View>
        {onSeeAllPress && (
          <TouchableOpacity onPress={onSeeAllPress} activeOpacity={0.7}>
            <Text style={styles.seeAll}>See All ›</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {products.map((product) => {
          const quantity = getQuantity(product.id);
          const price = product.price;
          const discountPrice = product.discountPrice > 0 ? product.discountPrice : price;
          const hasDiscount = price > discountPrice;
          const discountAmount = price - discountPrice;
          const discountPercent = hasDiscount
            ? Math.round((discountAmount / price) * 100)
            : 0;

          return (
            <View key={product.id} style={[styles.card, cardStyle]}>
              {/* Tappable Area for Product Details */}
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ProductDetails', {
                    productId: product.id.toString(),
                    sectionType,
                  })
                }
                activeOpacity={0.9}
                style={styles.clickableArea}
              >
                {/* Product Image & Badges Box */}
                <View style={styles.imageBackdrop}>
                  {product.imageUrl ? (
                    <Image source={{ uri: product.imageUrl }} style={styles.image} />
                  ) : null}

                  {/* Discount Badge */}
                  {discountPercent > 0 && (
                    <View style={styles.discountPill}>
                      <Text style={styles.discountPillText}>⚡ {discountPercent}% OFF</Text>
                    </View>
                  )}

                  {/* Exclusive Tag */}
                  {badge && (
                    <View style={styles.exclusivePill}>
                      <Text style={styles.exclusivePillText}>★ Exclusive</Text>
                    </View>
                  )}
                </View>

                {/* Product Info */}
                <View style={styles.infoContainer}>
                  <Text style={styles.unitSizeText} numberOfLines={1}>
                    {product.unitSize || '1 Unit'}
                  </Text>

                  <Text style={styles.productTitle} numberOfLines={2}>
                    {product.name}
                  </Text>

                  {/* Price & Savings */}
                  <View style={styles.priceContainer}>
                    <View style={styles.priceRow}>
                      <Text style={styles.currentPrice}>₹{discountPrice}</Text>
                      {hasDiscount && (
                        <Text style={styles.mrpPrice}>₹{price}</Text>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Add Button / Counter Stepper (Isolated from Navigation) */}
              <View style={styles.actionRow}>
                {quantity === 0 ? (
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => handleAdd(product)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.addBtnText}>ADD</Text>
                    <Text style={styles.addBtnPlus}>+</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.stepperContainer}>
                    <TouchableOpacity
                      onPress={() => handleDecrease(product.id)}
                      style={styles.stepperBtn}
                    >
                      <Text style={styles.stepperBtnText}>−</Text>
                    </TouchableOpacity>

                    <Text style={styles.stepperCount}>{quantity}</Text>

                    <TouchableOpacity
                      onPress={() => handleIncrease(product.id)}
                      style={styles.stepperBtn}
                    >
                      <Text style={styles.stepperBtnText}>+</Text>
                    </TouchableOpacity>
                  </View>
                )}
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
    marginBottom: 28,
    overflow: 'visible',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
    marginBottom: 14,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
    fontSize: 19,
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  seeAll: {
    color: '#0C831F',
    fontWeight: '700',
    fontSize: 14,
  },
  scrollContainer: {
    paddingLeft: 0,
    paddingRight: 20,
    paddingBottom: 14,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    marginRight: CARD_GAP,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
    justifyContent: 'space-between',
    paddingBottom: 14,
  },
  clickableArea: {
    flex: 1,
  },
  imageBackdrop: {
    position: 'relative',
    height: 110,
    width: '100%',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  discountPill: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#0C831F',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 6,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
    elevation: 3,
  },
  discountPillText: {
    color: '#FFFFFF',
    fontSize: 11.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  exclusivePill: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    backgroundColor: '#D97706',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    zIndex: 2,
    elevation: 2,
  },
  exclusivePillText: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '900',
  },
  infoContainer: {
    paddingHorizontal: 10,
    paddingTop: 8,
  },
  unitSizeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  productTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    minHeight: 34,
    lineHeight: 17,
  },
  priceContainer: {
    marginTop: 4,
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  currentPrice: {
    color: '#0F172A',
    fontWeight: '900',
    fontSize: 15,
    marginRight: 6,
  },
  mrpPrice: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
    fontSize: 11.5,
    fontWeight: '600',
  },
  actionRow: {
    paddingHorizontal: 8,
    marginTop: 8,
    marginBottom: 2,
  },
  addBtn: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#0C831F',
    height: 38,
    paddingHorizontal: 12,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addBtnText: {
    color: '#0C831F',
    fontWeight: '900',
    fontSize: 13.5,
    letterSpacing: 0.5,
  },
  addBtnPlus: {
    color: '#0C831F',
    fontWeight: '900',
    fontSize: 18,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0C831F',
    borderRadius: 9,
    height: 38,
    paddingHorizontal: 4,
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
  stepperCount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    textAlign: 'center',
    minWidth: 20,
  },
});

export default ProductListSection;
