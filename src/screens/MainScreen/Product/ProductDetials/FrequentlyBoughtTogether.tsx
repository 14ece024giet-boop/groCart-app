import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useDispatch } from 'react-redux';
import {
  getFrequentlyBoughtBundleApi,
  FrequentlyBoughtBundleData,
} from '../../../../Utility/HomeProductsApi';
import { ProductListItemDto } from '../../../../types/ProductListItemDto';
import { addToCart } from '../../../../store/slices/cartSlice';

interface Props {
  productId: number;
}

export default function FrequentlyBoughtTogether({ productId }: Props) {
  const dispatch = useDispatch();
  const [bundleData, setBundleData] = useState<FrequentlyBoughtBundleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchBundle = async () => {
      try {
        setLoading(true);
        const res = await getFrequentlyBoughtBundleApi(productId);
        if (res?.success && res?.data) {
          setBundleData(res.data);
          // Default all items checked
          const allIds = [
            res.data.mainProduct.id,
            ...res.data.bundleItems.map((b) => b.id),
          ];
          setSelectedItemIds(allIds);
        }
      } catch (err) {
        console.error('Error fetching frequently bought bundle:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBundle();
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#059669" size="small" />
      </View>
    );
  }

  if (!bundleData || bundleData.bundleItems.length === 0) {
    return null;
  }

  const allItems = [bundleData.mainProduct, ...bundleData.bundleItems];

  const toggleSelect = (id: number) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedProducts = allItems.filter((item) =>
    selectedItemIds.includes(item.id)
  );

  const calculateTotal = () => {
    return selectedProducts
      .reduce((sum, item) => sum + (item.discountPrice > 0 ? item.discountPrice : item.price), 0)
      .toFixed(2);
  };

  const handleAddBundleToCart = () => {
    selectedProducts.forEach((product) => {
      dispatch(addToCart(product));
    });
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.titleBox}>
          <Text style={styles.headerTitle}>🍞 Frequently Bought Together</Text>
          <Text style={styles.headerSub}>Township Favorite Combo</Text>
        </View>

        <View style={styles.discountTag}>
          <Text style={styles.discountTagText}>⚡ BUNDLE SAVER</Text>
        </View>
      </View>

      {/* Visual Product Link Cluster */}
      <View style={styles.productsRow}>
        {allItems.map((item, index) => {
          const isSelected = selectedItemIds.includes(item.id);
          const price = item.discountPrice > 0 ? item.discountPrice : item.price;

          return (
            <React.Fragment key={item.id}>
              {index > 0 && <Text style={styles.plusSymbol}>+</Text>}

              <TouchableOpacity
                style={[styles.productMiniCard, !isSelected && styles.unselectedCard]}
                onPress={() => toggleSelect(item.id)}
                activeOpacity={0.8}
              >
                {/* Checkbox Indicator */}
                <View style={[styles.checkbox, isSelected && styles.checkedBox]}>
                  {isSelected && <Text style={styles.checkMark}>✓</Text>}
                </View>

                {/* Image */}
                <View style={styles.imageBox}>
                  {item.imageUrl ? (
                    <Image source={{ uri: item.imageUrl }} style={styles.img} resizeMode="contain" />
                  ) : null}
                </View>

                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.itemPrice}>₹{price}</Text>
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </View>

      {/* Action Footer */}
      <View style={styles.footerBox}>
        <View style={styles.priceSummary}>
          <Text style={styles.totalLabel}>
            Total for {selectedProducts.length} {selectedProducts.length === 1 ? 'Item' : 'Items'}:
          </Text>
          <View style={styles.priceFlex}>
            <Text style={styles.totalPrice}>₹{calculateTotal()}</Text>
            {selectedProducts.length === allItems.length && bundleData.totalSavings > 0 && (
              <Text style={styles.savingsText}>
                Save ₹{bundleData.totalSavings.toFixed(0)}
              </Text>
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.addBundleBtn,
            selectedProducts.length === 0 && styles.disabledBtn,
          ]}
          onPress={handleAddBundleToCart}
          disabled={selectedProducts.length === 0}
          activeOpacity={0.85}
        >
          <Text style={styles.addBundleBtnText}>
            Add {selectedProducts.length} Items to Cart • ₹{calculateTotal()}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginVertical: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  headerSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 2,
  },
  discountTag: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  discountTagText: {
    color: '#B45309',
    fontSize: 9,
    fontWeight: '900',
  },
  productsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  plusSymbol: {
    fontSize: 18,
    fontWeight: '900',
    color: '#64748B',
    marginHorizontal: 2,
  },
  productMiniCard: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    position: 'relative',
  },
  unselectedCard: {
    opacity: 0.4,
  },
  checkbox: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  checkedBox: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  imageBox: {
    width: 55,
    height: 55,
    marginBottom: 6,
    marginTop: 4,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '900',
    color: '#059669',
    marginTop: 2,
  },
  footerBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  priceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  priceFlex: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginRight: 6,
  },
  savingsText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  addBundleBtn: {
    backgroundColor: '#0C831F',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  disabledBtn: {
    backgroundColor: '#94A3B8',
  },
  addBundleBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },
});

