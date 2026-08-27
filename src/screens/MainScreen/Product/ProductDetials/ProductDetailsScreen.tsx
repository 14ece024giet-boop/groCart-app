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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { toggleFavorite } from '../../../../store/slices/favoritesSlice';
import { useToast } from '../../../../components/Toast/ToastContext';

import ProductDetailsComponent from './ProductDetailsComponent';
import FrequentlyBoughtTogether from './FrequentlyBoughtTogether';
import ProductListSection from '../../ProductListSection';
import BottomTabBar from '../../BottomTabNavigatorScreen/BottomTabBar';
import { ProductDetails } from '../../../../types/ProductDetails';
import { ProductListItemDto } from '../../../../types/ProductListItemDto';

import {
  getProductDetailsApi,
  getBestSellingProductsApi,
  getExclusiveProductsApi,
} from '../../../../Utility/HomeProductsApi';

const ProductDetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { showToast } = useToast();

  const routeParams = (route.params || {}) as {
    productId?: string | number;
    sectionType?: 'bestSelling' | 'exclusive';
  };

  const productId = routeParams.productId ? Number(routeParams.productId) : 1;
  const sectionType = routeParams.sectionType || 'bestSelling';

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductListItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  // Persistent Redux Favorites Check
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isFavorite = favorites.some((item) => item.id === productId);

  // Redux Cart state for Floating Cart Bar
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cartItems.reduce(
    (sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
    0
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productRes = await getProductDetailsApi(productId);
        if (productRes?.data) {
          setProduct(productRes.data);
        }

        let related: ProductListItemDto[] = [];
        if (sectionType === 'bestSelling') {
          const res = await getBestSellingProductsApi();
          related = (res.data || []).filter((p: ProductListItemDto) => p.id !== productId).slice(0, 6);
        } else {
          const res = await getExclusiveProductsApi();
          related = (res.data || []).filter((p: ProductListItemDto) => p.id !== productId).slice(0, 6);
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

  const handleToggleFavorite = () => {
    if (!product) return;

    const itemToSave: ProductListItemDto = {
      id: product.id,
      name: product.name || product.title || '',
      title: product.name || product.title || '',
      price: product.price || 0,
      discountPrice: product.discountPrice || product.price || 0,
      imageUrl: product.imageUrl || '',
      unitSize: product.unitSize || '1 Unit',
      isBestSelling: false,
      isExclusive: false,
    };

    dispatch(toggleFavorite(itemToSave));
    showToast(
      isFavorite ? 'Removed from Favourites' : 'Saved to Favourites ❤️',
      isFavorite ? 'info' : 'success'
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Product details not found</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header Bar */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.headerBackIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.name || 'Product Details'}
        </Text>

        <TouchableOpacity
          style={[styles.headerBtn, isFavorite && styles.headerFavBtnActive]}
          onPress={handleToggleFavorite}
          activeOpacity={0.8}
        >
          <Text style={styles.headerFavIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: totalCartCount > 0 ? 180 : 110, paddingHorizontal: 16 }}
      >
        {/* Main Product Details View with Integrated Stepper */}
        <ProductDetailsComponent product={product} />

        {/* 🍞 Smart Option A: Frequently Bought Together Combo */}
        <FrequentlyBoughtTogether productId={productId} />

        {/* Recommended Campus Essentials Carousel */}
        {relatedProducts.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <ProductListSection
              title="🌟 Recommended Campus Essentials"
              products={relatedProducts}
              animateImage={true}
              sectionType={sectionType}
            />
          </View>
        )}
      </ScrollView>

      {/* Fixed Bottom Dock Container */}
      <View style={styles.fixedFooterDock}>
        {totalCartCount > 0 && (
          <TouchableOpacity
            style={styles.floatingCartBar}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.9}
          >
            <View style={styles.floatingCartLeft}>
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalCartCount}</Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={styles.floatingCartTitle}>
                  {totalCartCount} {totalCartCount === 1 ? 'Item' : 'Items'} Selected
                </Text>
                <Text style={styles.floatingCartPrice}>₹{totalCartPrice.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.floatingCartRight}>
              <Text style={styles.viewCartText}>Proceed to Checkout</Text>
              <Text style={styles.viewCartArrow}>→</Text>
            </View>
          </TouchableOpacity>
        )}

        <BottomTabBar />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    zIndex: 10,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  headerFavBtnActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  headerBackIcon: {
    fontSize: 20,
    color: '#0F172A',
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginHorizontal: 10,
  },
  headerFavIcon: {
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    marginBottom: 16,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Fixed Bottom Dock Wrapper
  fixedFooterDock: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  floatingCartBar: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 6,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  floatingCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  floatingCartTitle: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  floatingCartPrice: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  floatingCartRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCartText: {
    color: '#FACC15',
    fontSize: 13,
    fontWeight: '900',
    marginRight: 4,
  },
  viewCartArrow: {
    color: '#FACC15',
    fontSize: 15,
    fontWeight: '900',
  },
});

export default ProductDetailsScreen;
