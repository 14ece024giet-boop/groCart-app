// screens/MainScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import CartIcon from '../Cart/CartIcon';
import { RootStackParamList } from '../../types/navigation'; 
import { StackNavigationProp } from '@react-navigation/stack';
import PromoBanner from './Promo/PromoBanner';
import PromoCarousel from './Promo/PromoCarousel';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const MainScreen = () => {
    const navigation = useNavigation<NavigationProp>();

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Text style={styles.location}>New York City</Text>
        <CartIcon count={2} onPress={() => navigation.navigate('Cart')} />
      </View>

      {/* Scrollable content */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Placeholder: we'll replace these one-by-one */}
        <View style={styles.section}>
          {/* <Text style={styles.sectionTitle}>🔥 Best Deals</Text> */}
          {/* <PromoBanner onPress={() => navigation.navigate('PromoDetails')} /> */}
          {/* <PromoCarousel></PromoCarousel> */}
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛒 Best Selling Items</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🌟 Exclusive</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧂 Spices</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 48,
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
});

export default MainScreen;
