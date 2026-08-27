import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '../../store';
import { addToCart } from '../../store/slices/cartSlice';
import {
  removeFavorite,
  setFavoriteItems,
  loadLocalFavorites,
  markSeeded,
} from '../../store/slices/favoritesSlice';
import BottomTabBar from './BottomTabNavigatorScreen/BottomTabBar';
import { ProductListItemDto } from '../../types/ProductListItemDto';
import { getHomeProductsApi } from '../../Utility/HomeProductsApi';

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();

  // Persistent Redux Favorites State
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const isLoaded = useSelector((state: RootState) => state.favorites.isLoaded);
  const hasSeeded = useSelector((state: RootState) => state.favorites.hasSeeded);
  const [loading, setLoading] = useState<boolean>(false);

  // Redux Cart State
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cartItems.reduce(
    (sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
    0
  );

  useEffect(() => {
    // Load local favorites from AsyncStorage on mount
    dispatch(loadLocalFavorites());
  }, [dispatch]);

  // Seed initial sample products ONLY on first ever run if never seeded before
  useEffect(() => {
    if (isLoaded && !hasSeeded) {
      const fetchInitialFavorites = async () => {
        try {
          setLoading(true);
          const response = await getHomeProductsApi();
          if (response?.data) {
            const combined = [
              ...(response.data.exclusiveItems || []),
              ...(response.data.bestSellingItems || []),
            ];
            const uniqueItems = Array.from(
              new Map(combined.map((item) => [item.id, item])).values()
            );
            dispatch(setFavoriteItems(uniqueItems.slice(0, 8)));
          } else {
            dispatch(markSeeded());
          }
        } catch (err) {
          console.error('Failed to load initial favorites:', err);
          dispatch(markSeeded());
        } finally {
          setLoading(false);
        }
      };

      fetchInitialFavorites();
    }
  }, [isLoaded, hasSeeded, dispatch]);

  const handleRemoveFavorite = (id: number) => {
    // Permanently remove item from Redux store & AsyncStorage
    dispatch(removeFavorite(id));
  };

  const handleAddToCart = (product: ProductListItemDto) => {
    dispatch(addToCart(product));
  };

  const renderItem = ({ item }: { item: ProductListItemDto }) => {
    const discount =
      item.price && item.discountPrice && item.price > item.discountPrice
        ? Math.round(((item.price - item.discountPrice) / item.price) * 100)
        : 0;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('ProductDetails', { productId: item.id.toString() })
        }
        activeOpacity={0.9}
      >
        <View style={styles.imageBox}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={styles.image} resizeMode="contain" />
          ) : (
            <Text style={{ fontSize: 32 }}>🛍️</Text>
          )}
          {discount > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}% OFF</Text>
            </View>
          )}
        </View>

        <View style={styles.info}>
          <View style={styles.titleRow}>
            <Text style={styles.weight}>{item.unitSize || '1 Pack'}</Text>
            <TouchableOpacity
              onPress={() => handleRemoveFavorite(item.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.heartIcon}>❤️</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.title} numberOfLines={1}>
            {item.name || item.title}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.salePrice}>₹{item.discountPrice || item.price}</Text>
            {item.price && item.discountPrice && item.price > item.discountPrice && (
              <Text style={styles.originalPrice}>₹{item.price}</Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => handleAddToCart(item)}
            activeOpacity={0.8}
          >
            <Text style={styles.addBtnText}>Move to Cart +</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* 📌 1. Amazon-Style FIXED TOP HEADER */}
      <View style={styles.fixedHeaderContainer}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Saved Favourites</Text>

          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{favorites.length} Items</Text>
          </View>
        </View>
      </View>

      {/* 📜 2. SCROLLABLE MIDDLE BODY (Persistent Redux Items) */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loaderText}>Syncing your saved favourites...</Text>
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>❤️</Text>
          <Text style={styles.emptyTitle}>No Favourites Saved</Text>
          <Text style={styles.emptySub}>
            Explore 5,000+ township groceries and tap the heart icon to save your favorite items!
          </Text>
          <TouchableOpacity
            style={styles.exploreBtn}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.85}
          >
            <Text style={styles.exploreBtnText}>Explore HyperMarket →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
        />
      )}

      {/* 📌 3. Amazon-Style FIXED BOTTOM DOCK (Cart Bar + Bottom Navigation Footer) */}
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
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  fixedHeaderContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  backIcon: {
    fontSize: 18,
    color: '#0F172A',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  countBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  countBadgeText: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: '900',
  },
  loaderContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  flatList: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 12,
  },
  card: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  imageBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 4,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 2,
    left: 2,
    backgroundColor: '#DC2626',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '900',
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  weight: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  heartIcon: {
    fontSize: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  salePrice: {
    color: '#0F172A',
    fontWeight: '900',
    fontSize: 15,
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
    fontSize: 12,
    marginLeft: 6,
  },
  addBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addBtnText: {
    color: '#FACC15',
    fontSize: 11,
    fontWeight: '900',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  exploreBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  exploreBtnText: {
    color: '#FACC15',
    fontSize: 14,
    fontWeight: '900',
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
