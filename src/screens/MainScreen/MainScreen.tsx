import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

import PromoCarousel from './Promo/PromoCarousel';
import ProductListSection from './ProductListSection';
import FlashDealsCard from './FlashDealsCard';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store';
import BottomTabBar from './BottomTabNavigatorScreen/BottomTabBar';
import { ProductListItemDto } from '../../types/ProductListItemDto';
import { getHomeProductsApi } from '../../Utility/HomeProductsApi';
import { getUserAddressApi, UserAddressDto } from '../../Utility/userAddressApi';

type NavigationProp = StackNavigationProp<RootStackParamList>;

// Executive Campus Department Categories
const VISUAL_CATEGORIES = [
  { id: 'dairy', label: 'Dairy & Bakery', icon: '🥛', bg: '#EFF6FF' },
  { id: 'snacks', label: 'Snacks & Drinks', icon: '🍿', bg: '#FFF7ED' },
  { id: 'staples', label: 'Atta & Staples', icon: '🌾', bg: '#FEFCE8' },
  { id: 'pantry', label: 'Office Pantry', icon: '☕', bg: '#F0FDF4' },
  { id: 'instant', label: 'Instant Food', icon: '🍜', bg: '#FEE2E2' },
  { id: 'personal', label: 'Personal Care', icon: '🧼', bg: '#F3E8FF' },
  { id: 'cleaning', label: 'Home Cleaning', icon: '🧹', bg: '#E0F2FE' },
  { id: 'family', label: 'Family & Baby', icon: '👶', bg: '#FCE7F3' },
];

// Featured Corporate FMCG Brands
const FEATURED_BRANDS = [
  { id: 'amul', name: 'Amul', icon: '🧈' },
  { id: 'tata', name: 'Tata Sampann', icon: '🍃' },
  { id: 'britannia', name: 'Britannia', icon: '🍞' },
  { id: 'nestle', name: 'Nestle', icon: '🍫' },
  { id: 'lays', name: 'Lays', icon: '🥔' },
  { id: 'aashirvaad', name: 'Aashirvaad', icon: '🌾' },
  { id: 'cocacola', name: 'Coca-Cola', icon: '🥤' },
  { id: 'dettol', name: 'Dettol', icon: '🛡️' },
];

const MainScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [bestSelling, setBestSelling] = useState<ProductListItemDto[]>([]);
  const [exclusive, setExclusive] = useState<ProductListItemDto[]>([]);
  const [dairy, setDairy] = useState<ProductListItemDto[]>([]);
  const [snacks, setSnacks] = useState<ProductListItemDto[]>([]);
  const [staples, setStaples] = useState<ProductListItemDto[]>([]);
  const [instant, setInstant] = useState<ProductListItemDto[]>([]);

  const [loading, setLoading] = useState(true);
  const [userAddress, setUserAddress] = useState<UserAddressDto | null>(null);

  // Redux Cart state
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cartItems.reduce(
    (sum, item) => sum + (item.discountPrice || item.price) * item.quantity,
    0
  );

  // Fetch home products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getHomeProductsApi();
        setBestSelling(response.data?.bestSellingItems || []);
        setExclusive(response.data?.exclusiveItems || []);
        setDairy(response.data?.dairyItems || []);
        setSnacks(response.data?.snackItems || []);
        setStaples(response.data?.stapleItems || []);
        setInstant(response.data?.instantItems || []);
      } catch (err) {
        console.error('Failed to load home products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Refresh address on focus
  const fetchAddress = async () => {
    try {
      const response = await getUserAddressApi();
      if (response?.success && response?.data) {
        setUserAddress(response.data);
      }
    } catch (err) {}
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddress();
    }, [])
  );

  return (
    <SafeAreaView style={styles.screen}>
      {/* 📌 1. Amazon-Style FIXED TOP HEADER */}
      <View style={styles.fixedHeaderContainer}>
        {/* Executive Location Row */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.locationBox}
            onPress={() => navigation.navigate('ManageAddress')}
            activeOpacity={0.8}
          >
            <Text style={styles.speedTag}>⚡ 10-15 MIN CAMPUS EXPRESS DELIVERY</Text>
            <View style={styles.addressRow}>
              <Text style={styles.addressText} numberOfLines={1}>
                📍 {userAddress?.deliveryPointAddress || 'JSW Vijayanagar Township - Sector 4'}
                {userAddress?.roomNumber ? ` (${userAddress.roomNumber})` : ' (Qtr B-202)'}
              </Text>
              <Text style={styles.downArrow}>▼</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar Shortcut */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
          activeOpacity={0.9}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Search 5,000+ groceries, dairy, pantry items...</Text>
          <View style={styles.micBadge}>
            <Text style={styles.micIcon}>🎙️</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* 📜 2. SCROLLABLE MIDDLE BODY (Sandwiched cleanly between top and bottom) */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <View style={styles.contentContainer}>
          {/* ⚡ Live Executive Flash Deals Component */}
          <FlashDealsCard flashProducts={bestSelling} />

          {/* Corporate Offer Carousel */}
          <PromoCarousel />

          {/* 📱 Executive Category Grid */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Township Departments</Text>
          </View>

          <View style={styles.categoryGrid}>
            {VISUAL_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.categoryCard, { backgroundColor: cat.bg }]}
                onPress={() => navigation.navigate('Search')}
                activeOpacity={0.85}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={styles.categoryLabel}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* 🏷️ Corporate Brand Spotlight */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Enterprise Preferred Brands</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.brandsScroll}
          >
            {FEATURED_BRANDS.map((brand) => (
              <TouchableOpacity
                key={brand.id}
                style={styles.brandPill}
                onPress={() => navigation.navigate('Search')}
                activeOpacity={0.85}
              >
                <Text style={styles.brandIcon}>{brand.icon}</Text>
                <Text style={styles.brandName}>{brand.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* 🛍️ Dynamic Product Sections */}
          {loading ? (
            <ActivityIndicator size="large" color="#0C831F" style={{ marginVertical: 30 }} />
          ) : (
            <>
              {/* Section 1: Best Selling */}
              <ProductListSection
                title="🔥 Campus Most Popular"
                products={bestSelling}
                animateImage={true}
                sectionType="bestSelling"
              />

              {/* Section 2: Dairy & Bakery */}
              {dairy.length > 0 && (
                <ProductListSection
                  title="🥛 Milk, Paneer & Fresh Bakery"
                  products={dairy}
                  animateImage={true}
                  sectionType="bestSelling"
                />
              )}

              {/* Section 3: Exclusive Campus Collection */}
              <ProductListSection
                title="🌟 Corporate Executive Selection"
                products={exclusive}
                animateImage={true}
                sectionType="exclusive"
              />

              {/* Section 4: Snacks & Beverages */}
              {snacks.length > 0 && (
                <ProductListSection
                  title="🍿 Snacks, Crisps & Beverages"
                  products={snacks}
                  animateImage={true}
                  sectionType="bestSelling"
                />
              )}

              {/* Section 5: Staples & Cooking Oils */}
              {staples.length > 0 && (
                <ProductListSection
                  title="🌾 Atta, Rice, Ghee & Cooking Oils"
                  products={staples}
                  animateImage={true}
                  sectionType="bestSelling"
                />
              )}

              {/* Section 6: Instant Meals */}
              {instant.length > 0 && (
                <ProductListSection
                  title="🍜 Instant Meals & Pantry Cereals"
                  products={instant}
                  animateImage={true}
                  sectionType="bestSelling"
                />
              )}
            </>
          )}
        </View>
      </ScrollView>

      {/* 📌 3. Amazon-Style FIXED BOTTOM DOCK (Cart Summary Bar + Tab Bar Footer) */}
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
  screen: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  fixedHeaderContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 10,
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
    marginBottom: 10,
  },
  locationBox: {
    flex: 1,
    marginRight: 12,
  },
  speedTag: {
    fontSize: 10,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    maxWidth: '90%',
  },
  downArrow: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 4,
  },
  profileBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  profileIcon: {
    fontSize: 17,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  micBadge: {
    paddingLeft: 8,
  },
  micIcon: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingTop: 12,
    paddingBottom: 24,
  },
  contentContainer: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    marginTop: 18,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryCard: {
    width: '23.5%',
    aspectRatio: 1,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#334155',
    textAlign: 'center',
  },
  brandsScroll: {
    paddingBottom: 16,
  },
  brandPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 10,
  },
  brandIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  brandName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },

  // Fixed Bottom Dock Wrapper
  fixedFooterDock: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  floatingCartBar: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,
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

export default MainScreen;
