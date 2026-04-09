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
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import ProductDetailsComponent from './ProductDetailsComponent';
import ProductListSection from '../../ProductListSection';
import QuantityButton from '../../../../components/QuantityButton';

import { ProductDetails } from '../../../../types/ProductDetails';
import { ProductListItemDto } from '../../../../types/ProductListItemDto';

import {
  getProductDetailsApi,
  getBestSellingProductsApi,
  getExclusiveProductsApi,
} from '../../../../Utility/HomeProductsApi';

import { addToCart } from '../../../../store/slices/cartSlice';

const ProductDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
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

    const cartItem: ProductListItemDto = {
      id: product.id,
      title: product.title,
      discountPrice: product.discountPrice,
      name: product.name || '',
      imageUrl: product.imageUrl || '',
      price: product.price || 0,
      isBestSelling: false,
      isExclusive: false,
    };

    dispatch(addToCart(cartItem));
    alert('Added to cart!');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product details
        const productRes = await getProductDetailsApi(productId);
        setProduct(productRes.data);

        // Fetch related products
        let related: ProductListItemDto[] = [];

        if (sectionType === 'bestSelling') {
          const res = await getBestSellingProductsApi();
          related = res.data.filter((p: ProductListItemDto) => p.id !== productId).slice(0, 5);
        } else if (sectionType === 'exclusive') {
          const res = await getExclusiveProductsApi();
          related = res.data.filter((p: ProductListItemDto) => p.id !== productId).slice(0, 5);
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

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF5A4D" />
          <Text style={styles.loadingText}>Loading product details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
          />
        )}
      </ScrollView>

      {/* Bottom Sticky Buy Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.quantityWrapper}>
          <QuantityButton
            title="−"
            onPress={handleDecrease}
            style={styles.counterButton}
          />
          <Text style={styles.counterText}>{quantity}</Text>
          <QuantityButton
            title="+"
            onPress={handleIncrease}
            style={styles.counterButton}
          />
        </View>

        <TouchableOpacity style={styles.buyButton} onPress={handleBuy}>
          <Text style={styles.buyText}>
            Buy ${(product.discountPrice * quantity).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#FF5A4D',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#FF5A4D',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 120,
    paddingHorizontal: 16,
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
    backgroundColor: '#FF5A4D',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  buyButton: {
    flex: 1,
    marginLeft: 12,
    backgroundColor: '#FF5A4D',
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
