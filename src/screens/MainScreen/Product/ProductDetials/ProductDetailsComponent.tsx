import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { addToCart, incrementQuantity, decrementQuantity } from '../../../../store/slices/cartSlice';
import { ProductDetails, ProductVariant } from '../../../../types/ProductDetails';
import { ProductListItemDto } from '../../../../types/ProductListItemDto';

interface Props {
  product: ProductDetails;
}

const { width } = Dimensions.get('window');

export default function ProductDetailsComponent({ product }: Props) {
  const dispatch = useDispatch();

  const variants = product.variants && product.variants.length > 0 ? product.variants : [
    {
      id: 1,
      unitSize: product.unitSize || '1 Unit',
      price: product.price || 0,
      discountPrice: product.discountPrice || product.price || 0,
      stockQuantity: product.stockQuantity ?? 100,
      isDefault: true,
    }
  ];

  const defaultVariant = variants.find((v) => v.isDefault) || variants[0];
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(defaultVariant);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItem = cartItems.find((item) => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const currentImage = selectedVariant.imageUrl || product.imageUrl;
  const images = Array.isArray(currentImage) ? currentImage : [currentImage];
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewRef = React.useRef(({ changed }: any) => {
    if (changed && changed[0]) {
      setActiveIndex(changed[0].index);
    }
  });

  const price = selectedVariant.price || 0;
  const discountPrice = selectedVariant.discountPrice > 0 ? selectedVariant.discountPrice : price;
  const hasDiscount = price > discountPrice;
  const discountAmount = price - discountPrice;
  const discountPercent = hasDiscount
    ? Math.round((discountAmount / price) * 100)
    : 0;

  const currentStock = selectedVariant.stockQuantity ?? product.stockQuantity ?? 100;
  const isOutOfStock = currentStock === 0;
  const isUrgentStock = currentStock > 0 && currentStock <= 3;

  const handleAdd = () => {
    if (isOutOfStock) return;
    const itemToAdd: ProductListItemDto = {
      id: product.id,
      name: `${product.name || product.title || ''}`,
      title: `${product.name || product.title || ''}`,
      price: selectedVariant.price,
      discountPrice,
      imageUrl: currentImage || '',
      unitSize: selectedVariant.unitSize,
      isBestSelling: false,
      isExclusive: false,
    };
    dispatch(addToCart(itemToAdd));
  };

  return (
    <View style={styles.container}>
      {/* Hero Image Slider */}
      <View style={styles.imageBackdrop}>
        <FlatList
          data={images}
          keyExtractor={(_, i) => i.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewRef.current}
          viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
          renderItem={({ item }) => (
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
            </View>
          )}
        />

        {/* Floating Top Badges */}
        {discountPercent > 0 && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountBadgeText}>⚡ {discountPercent}% OFF</Text>
          </View>
        )}

        {/* Pagination Dots */}
        {images.length > 1 && (
          <View style={styles.dotsContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  activeIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>
        )}
      </View>

      {/* Main Meta Info */}
      <View style={styles.metaContainer}>
        {/* Express Campus Delivery Tag */}
        <View style={styles.tagsRow}>
          <View style={styles.expressPill}>
            <Text style={styles.expressText}>⚡ 10-15 MIN EXPRESS DELIVERY</Text>
          </View>

          {/* 🔥 Urgent Stock Badge */}
          {isUrgentStock && (
            <View style={styles.urgencyPill}>
              <Text style={styles.urgencyText}>🔥 Only {currentStock} left in stock</Text>
            </View>
          )}
        </View>

        {/* Product Title */}
        <Text style={styles.title}>{product.name || product.title}</Text>

        {/* Selected Unit Size */}
        <Text style={styles.unitText}>{selectedVariant.unitSize}</Text>

        {/* 🌟 Interactive Volume / Size Variant Selector Chips */}
        {variants.length > 1 && (
          <View style={styles.variantsContainer}>
            <Text style={styles.variantsHeaderTitle}>SELECT VOLUME / SIZE</Text>
            <View style={styles.variantGrid}>
              {variants.map((v) => {
                const isSelected = selectedVariant.id === v.id;
                const vHasDiscount = v.price > v.discountPrice;
                const vOutOfStock = (v.stockQuantity ?? 100) === 0;

                return (
                  <TouchableOpacity
                    key={v.id}
                    disabled={vOutOfStock}
                    style={[
                      styles.variantChip,
                      isSelected && styles.selectedVariantChip,
                      vOutOfStock && styles.outOfStockVariantChip,
                    ]}
                    onPress={() => setSelectedVariant(v)}
                    activeOpacity={0.85}
                  >
                    {v.savingsBadge ? (
                      <View style={[styles.variantBadge, isSelected && styles.selectedVariantBadge]}>
                        <Text style={[styles.variantBadgeText, isSelected && styles.selectedVariantBadgeText]}>
                          {v.savingsBadge}
                        </Text>
                      </View>
                    ) : null}

                    <Text style={[
                      styles.variantUnitText,
                      isSelected && styles.selectedVariantUnitText,
                      vOutOfStock && styles.outOfStockText
                    ]}>
                      {v.unitSize}
                    </Text>

                    <View style={styles.variantPriceRow}>
                      <Text style={[
                        styles.variantDiscountPrice,
                        isSelected && styles.selectedVariantPrice,
                        vOutOfStock && styles.outOfStockText
                      ]}>
                        ₹{v.discountPrice}
                      </Text>
                      {vHasDiscount && (
                        <Text style={[styles.variantMrpPrice, isSelected && styles.selectedVariantMrp]}>
                          ₹{v.price}
                        </Text>
                      )}
                    </View>

                    {vOutOfStock && (
                      <Text style={styles.soldOutBadge}>Sold Out</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Pricing Card with Integrated Stepper */}
        <View style={styles.priceCard}>
          <View style={styles.priceCardHeader}>
            <View style={{ flex: 1 }}>
              <View style={styles.priceRow}>
                <Text style={styles.currentPrice}>₹{discountPrice}</Text>
                {hasDiscount && (
                  <>
                    <Text style={styles.mrpPrice}>₹{price}</Text>
                    <View style={styles.saveBadge}>
                      <Text style={styles.saveBadgeText}>SAVE ₹{discountAmount}</Text>
                    </View>
                  </>
                )}
              </View>
              <Text style={styles.taxInclusiveText}>Inclusive of all taxes</Text>
            </View>

            {/* In-Card Stepper Box */}
            <View style={styles.actionBox}>
              {isOutOfStock ? (
                <View style={styles.outOfStockBox}>
                  <Text style={styles.outOfStockBoxText}>OUT OF STOCK</Text>
                </View>
              ) : quantity === 0 ? (
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={handleAdd}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addBtnText}>ADD</Text>
                  <Text style={styles.addBtnPlus}>+</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.stepperContainer}>
                  <TouchableOpacity
                    onPress={() => dispatch(decrementQuantity(product.id))}
                    style={styles.stepperBtn}
                  >
                    <Text style={styles.stepperBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.stepperCount}>{quantity}</Text>
                  <TouchableOpacity
                    onPress={() => dispatch(incrementQuantity(product.id))}
                    style={styles.stepperBtn}
                  >
                    <Text style={styles.stepperBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Corporate Trust Guarantees */}
        <View style={styles.trustGrid}>
          <View style={styles.trustCard}>
            <Text style={styles.trustIcon}>🚚</Text>
            <Text style={styles.trustTitle}>Doorstep Delivery</Text>
            <Text style={styles.trustSub}>Direct to Room</Text>
          </View>

          <View style={styles.trustCard}>
            <Text style={styles.trustIcon}>🛡️</Text>
            <Text style={styles.trustTitle}>Fresh & Authentic</Text>
            <Text style={styles.trustSub}>Direct FMCG Sourcing</Text>
          </View>

          <View style={styles.trustCard}>
            <Text style={styles.trustIcon}>🔄</Text>
            <Text style={styles.trustTitle}>Easy Returns</Text>
            <Text style={styles.trustSub}>Instant Resolution</Text>
          </View>
        </View>

        {/* Product Specifications Section */}
        <View style={styles.specSection}>
          <Text style={styles.sectionHeaderTitle}>Product Overview</Text>
          <Text style={styles.descriptionText}>
            {product.description ||
              'Premium quality grocery essential, sourced directly from verified manufacturers to ensure peak freshness and corporate quality standards.'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  imageBackdrop: {
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    height: 250,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  imageWrapper: {
    width: width - 32,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  dotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: '#059669',
    width: 16,
  },
  metaContainer: {
    marginTop: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  expressPill: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  expressText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  urgencyPill: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgencyText: {
    color: '#DC2626',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    lineHeight: 26,
    letterSpacing: -0.3,
  },
  unitText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },

  // --- Variant Selector Chips ---
  variantsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  variantsHeaderTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#64748B',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  variantGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  variantChip: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  selectedVariantChip: {
    backgroundColor: '#0F172A',
    borderColor: '#059669',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  outOfStockVariantChip: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.6,
  },
  outOfStockText: {
    color: '#94A3B8',
  },
  soldOutBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#EF4444',
    marginTop: 2,
  },
  variantBadge: {
    position: 'absolute',
    top: -8,
    right: 8,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  selectedVariantBadge: {
    backgroundColor: '#059669',
    borderColor: '#34D399',
  },
  variantBadgeText: {
    color: '#B45309',
    fontSize: 9,
    fontWeight: '900',
  },
  selectedVariantBadgeText: {
    color: '#FFFFFF',
  },
  variantUnitText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  selectedVariantUnitText: {
    color: '#FFFFFF',
  },
  variantPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  variantDiscountPrice: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginRight: 6,
  },
  selectedVariantPrice: {
    color: '#FACC15',
  },
  variantMrpPrice: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  selectedVariantMrp: {
    color: '#64748B',
  },

  priceCard: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  priceCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
    marginRight: 8,
  },
  mrpPrice: {
    fontSize: 14,
    textDecorationLine: 'line-through',
    color: '#94A3B8',
    marginRight: 8,
  },
  saveBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  saveBadgeText: {
    color: '#B45309',
    fontSize: 9,
    fontWeight: '900',
  },
  taxInclusiveText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  actionBox: {
    marginLeft: 10,
  },
  outOfStockBox: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  outOfStockBoxText: {
    color: '#DC2626',
    fontWeight: '900',
    fontSize: 11,
  },
  addBtn: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#0C831F',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: 90,
  },
  addBtnText: {
    color: '#0C831F',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  addBtnPlus: {
    color: '#0C831F',
    fontWeight: '900',
    fontSize: 14,
    marginLeft: 6,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C831F',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 6,
    minWidth: 95,
    justifyContent: 'space-between',
  },
  stepperBtn: {
    paddingHorizontal: 8,
  },
  stepperBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  stepperCount: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  trustGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  trustCard: {
    width: '31.5%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  trustIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  trustTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  trustSub: {
    fontSize: 9,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },
  specSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
});
