import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import ProductDetailsComponent from './ProductDetailsComponent';
import ProductListSection from '../ProductListSection';
import QuantityButton from '../../../components/QuantityButton';

import { ProductDetails } from '../../../types/ProductDetails';
import { ProductListItemDto } from '../../../types/ProductListItemDto';

import {
  getProductDetailsApi,
  getBestSellingProductsApi,
  getExclusiveProductsApi,
} from '../../../Utility/HomeProductsApi';

import { addToCart } from '../../../store/slices/cartSlice';

const ProductDetailsScreen = () => {
  const route = useRoute();
  const dispatch = useDispatch();
  const { productId, sectionType } = route.params as {
    productId: number;
    sectionType: 'bestSelling' | 'exclusive';
  };

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => setQuantity((q) => q + 1);
  const handleDecrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleBuy = () => {
    if (!product) return;

    // Dispatch product to cart with quantity
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        // 1. Fetch product details
        const productRes = await getProductDetailsApi(productId);
        setProduct(productRes.data);

        // 2. Fetch related products based on sectionType
        let related: ProductListItemDto[] = [];

        if (sectionType === 'bestSelling') {
          const res = await getBestSellingProductsApi();
          related = res.data.filter((p: ProductListItemDto) => p.id !== productId);
        } else if (sectionType === 'exclusive') {
          const res = await getExclusiveProductsApi();
          related = res.data.filter((p: ProductListItemDto) => p.id !== productId);
        }

        setRelatedProducts(related);
      } catch (err) {
        console.error('Error fetching product or related items:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [productId, sectionType]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color="red" />
        ) : product ? (
          <>
            <ProductDetailsComponent product={product} />

            {relatedProducts.length > 0 && (
              <ProductListSection
                title={sectionType === 'bestSelling' ? 'Best Selling' : 'Exclusive'}
                products={relatedProducts}
                animateImage
                badge={sectionType === 'exclusive'}
                cardStyle={
                  sectionType === 'exclusive'
                    ? {
                        backgroundColor: '#fef9f1',
                        borderColor: '#f1e5c4',
                        borderWidth: 1,
                      }
                    : undefined
                }
                titleStyle={
                  sectionType === 'exclusive' ? { color: '#B8860B' } : undefined
                }
              />
            )}
          </>
        ) : (
          <View style={styles.centered}>
            <Text>Product not found</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Sticky Buy Bar */}
      {!loading && product && (
        <View style={styles.bottomBar}>
          <View style={styles.quantityWrapper}>
            <QuantityButton title="−" onPress={handleDecrease} style={styles.counterButton} />
            <Text style={styles.counterText}>{quantity}</Text>
            <QuantityButton title="+" onPress={handleIncrease} style={styles.counterButton} />
          </View>

          <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
            <Text style={styles.buyText}>Buy ${product.discountPrice * quantity}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 120,
    paddingHorizontal: 16,
  },
  centered: {
    padding: 20,
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  counterText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
  counterButton: {
    backgroundColor: 'red',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  buyButton: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: 'red',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ProductDetailsScreen;
