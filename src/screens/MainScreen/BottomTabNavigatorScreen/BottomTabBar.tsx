import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_CONFIG: { [key: string]: { icon: string; label: string } } = {
  Home: { icon: '🏠', label: 'Home' },
  Search: { icon: '🔍', label: 'Categories' },
  Cart: { icon: '🛒', label: 'Cart' },
  Favorites: { icon: '❤️', label: 'Saved' },
  Profile: { icon: '👤', label: 'Account' },
};

// Commercial Standard Tab Order: Home -> Categories -> Cart -> Saved -> Account
const tabs = ['Home', 'Search', 'Cart', 'Favorites', 'Profile'];

const BottomTabBar = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  // Redux Live Cart Quantity Counter
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const currentRouteName = route.name || 'Home';

  const onPressTab = (tabName: string) => {
    if (tabName === 'Home') {
      if (currentRouteName !== 'Home' && currentRouteName !== 'Main') {
        navigation.navigate('Main');
      }
    } else {
      if (currentRouteName !== tabName) {
        navigation.navigate(tabName);
      }
    }
  };

  // Safe bottom padding so system buttons never overlap icons/labels
  const safeBottomPadding = Math.max(insets.bottom, Platform.OS === 'ios' ? 20 : 10);

  return (
    <View style={[styles.fixedTabBarContainer, { paddingBottom: safeBottomPadding }]}>
      <View style={styles.tabBarRow}>
        {tabs.map((tab) => {
          const isSelected =
            currentRouteName === tab ||
            (tab === 'Home' && currentRouteName === 'Main');
          const config = TAB_CONFIG[tab];
          const isCart = tab === 'Cart';

          return (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabItem,
                isSelected && styles.selectedTabItem,
              ]}
              onPress={() => onPressTab(tab)}
              activeOpacity={0.8}
            >
              {/* Active Indicator Pill */}
              {isSelected && <View style={styles.activeTopIndicator} />}

              <View style={styles.iconContainer}>
                <Text style={[styles.iconText, isSelected && styles.activeIconText]}>
                  {config.icon}
                </Text>

                {/* 🛒 Live Cart Badge Counter */}
                {isCart && totalCartCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>
                      {totalCartCount > 99 ? '99+' : totalCartCount}
                    </Text>
                  </View>
                )}
              </View>

              <Text style={[styles.label, isSelected && styles.activeLabel]}>
                {config.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fixedTabBarContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1.5,
    borderTopColor: '#E2E8F0',
    paddingTop: 6,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 12,
  },
  tabBarRow: {
    width: '100%',
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
  },
  tabItem: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    position: 'relative',
    paddingVertical: 2,
  },
  selectedTabItem: {
    backgroundColor: '#ECFDF5',
  },
  activeTopIndicator: {
    position: 'absolute',
    top: 2,
    width: 20,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#059669',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 2,
  },
  iconText: {
    fontSize: 19,
    opacity: 0.6,
  },
  activeIconText: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  cartBadge: {
    position: 'absolute',
    top: -6,
    right: -10,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.2,
  },
  activeLabel: {
    color: '#059669',
    fontWeight: '900',
  },
});

export default BottomTabBar;
