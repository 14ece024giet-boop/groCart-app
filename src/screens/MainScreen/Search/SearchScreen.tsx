import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { addToCart, incrementQuantity, decrementQuantity } from '../../../store/slices/cartSlice';
import { getHomeProductsApi, searchProductsApi } from '../../../Utility/HomeProductsApi';
import { ProductListItemDto } from '../../../types/ProductListItemDto';
import BottomTabBar from '../BottomTabNavigatorScreen/BottomTabBar';

const POPULAR_SEARCHES = ['Milk', 'Bread', 'Maggi', 'Butter', 'Eggs', 'Chips', 'Atta', 'Rice'];

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [allProducts, setAllProducts] = useState<ProductListItemDto[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductListItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cartItems.reduce(
    (sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
    0
  );

  const getQuantity = (productId: number) =>
    cartItems.find((item) => item.id === productId)?.quantity || 0;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getHomeProductsApi();
        const combined = [
          ...(response.data?.bestSellingItems || []),
          ...(response.data?.exclusiveItems || []),
        ];
        // Deduplicate by ID
        const unique = Array.from(new Map(combined.map((item) => [item.id, item])).values());
        setAllProducts(unique);
        setFilteredProducts(unique);
      } catch (err) {
        console.error('Failed to fetch search products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Debounced search that hits the backend Smart Synonym Search Engine
  useEffect(() => {
    if (!query.trim()) {
      setFilteredProducts(allProducts);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const response = await searchProductsApi(query.trim());
        if (response?.data) {
          setFilteredProducts(response.data);
        }
      } catch (err) {
        console.error('Search API error:', err);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, allProducts]);

  const handleSearch = (text: string) => {
    setQuery(text);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Search Bar Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search groceries, milk, snacks..."
            placeholderTextColor="#94A3B8"
            value={query}
            onChangeText={handleSearch}
            autoFocus
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')} style={styles.clearBtn}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Popular Search Pills (When query is empty) */}
      {query.length === 0 && (
        <View style={styles.popularSection}>
          <Text style={styles.popularTitle}>🔥 Trending Searches</Text>
          <View style={styles.pillsContainer}>
            {POPULAR_SEARCHES.map((term, index) => (
              <TouchableOpacity
                key={index}
                style={styles.pill}
                onPress={() => handleSearch(term)}
                activeOpacity={0.8}
              >
                <Text style={styles.pillText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Product Results */}
      {loading ? (
        <ActivityIndicator size="large" color="#059669" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={{
            paddingHorizontal: 12,
            paddingBottom: totalCartCount > 0 ? 180 : 110,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const quantity = getQuantity(item.id);
            const price = item.price;
            const discountPrice = item.discountPrice > 0 ? item.discountPrice : price;
            const hasDiscount = price > discountPrice;
            const discountPercent = hasDiscount
              ? Math.round(((price - discountPrice) / price) * 100)
              : 0;

            return (
              <View style={styles.card}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ProductDetails', {
                      productId: item.id.toString(),
                    })
                  }
                  activeOpacity={0.9}
                  style={{ flex: 1 }}
                >
                  <View style={styles.imageBackdrop}>
                    {item.imageUrl ? (
                      <Image source={{ uri: item.imageUrl }} style={styles.image} />
                    ) : null}
                    {discountPercent > 0 && (
                      <View style={styles.discountPill}>
                        <Text style={styles.discountPillText}>⚡ {discountPercent}% OFF</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.infoContainer}>
                    <Text style={styles.unitText}>{item.unitSize || '1 Unit'}</Text>
                    <Text style={styles.titleText} numberOfLines={2}>
                      {item.name}
                    </Text>

                    <View style={styles.priceRow}>
                      <Text style={styles.priceCurrent}>₹{discountPrice}</Text>
                      {hasDiscount && <Text style={styles.priceMrp}>₹{price}</Text>}
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Add / Counter Stepper (Isolated) */}
                <View style={{ paddingHorizontal: 8, paddingBottom: 8 }}>
                  {quantity === 0 ? (
                    <TouchableOpacity
                      style={styles.addBtn}
                      onPress={() => dispatch(addToCart(item))}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.addBtnText}>ADD +</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.stepperContainer}>
                      <TouchableOpacity
                        onPress={() => dispatch(decrementQuantity(item.id))}
                        style={styles.stepperBtn}
                      >
                        <Text style={styles.stepperBtnText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.stepperCount}>{quantity}</Text>
                      <TouchableOpacity
                        onPress={() => dispatch(incrementQuantity(item.id))}
                        style={styles.stepperBtn}
                      >
                        <Text style={styles.stepperBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No items found for "{query}"</Text>
              <Text style={styles.emptySub}>Try searching for milk, snacks, or bread</Text>
            </View>
          }
        />
      )}

      {/* Floating Dark Slate Cart Bar */}
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

      {/* Persistent Bottom Tab Bar */}
      <BottomTabBar />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  backArrow: {
    fontSize: 18,
    color: '#0F172A',
    fontWeight: 'bold',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  clearBtn: {
    paddingLeft: 8,
  },
  clearIcon: {
    fontSize: 14,
    color: '#64748B',
  },
  popularSection: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  popularTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pill: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  pillText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '700',
  },
  card: {
    flex: 0.5,
    margin: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2,
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  imageBackdrop: {
    height: 110,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    position: 'relative',
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
  infoContainer: {
    padding: 8,
  },
  unitText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
  },
  titleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    minHeight: 32,
    lineHeight: 16,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 4,
  },
  priceCurrent: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginRight: 4,
  },
  priceMrp: {
    fontSize: 11,
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  addBtn: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#0C831F',
    borderRadius: 9,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#0C831F',
    fontWeight: '900',
    fontSize: 13.5,
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
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  // Floating Cart Summary Bar
  floatingCartBar: {
    position: 'absolute',
    bottom: 102,
    left: 16,
    right: 16,
    backgroundColor: '#0F172A',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    zIndex: 99,
  },
  floatingCartLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 15,
  },
  floatingCartTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  floatingCartPrice: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
  floatingCartRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewCartText: {
    color: '#FACC15',
    fontSize: 14,
    fontWeight: '900',
    marginRight: 4,
  },
  viewCartArrow: {
    color: '#FACC15',
    fontSize: 16,
    fontWeight: '900',
  },
});
