import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import CartIcon from '../Cart/CartIcon';
import { RootStackParamList } from '../../navigation/navigation'; 
import { StackNavigationProp } from '@react-navigation/stack';

import PromoCarousel from './Promo/PromoCarousel';
import CategoryIcons from './CategoryIcons';
import ProductListSection from './ProductListSection';
import { Products } from './bestSellingData';
import { useDispatch, useSelector } from 'react-redux';
import  type {RootState} from '../../store';
import BottomTabBar from './BottomTabNavigatorScreen/BottomTabBar';
import { ProductListItemDto } from '../../types/ProductListItemDto';
import { getHomeProductsApi } from '../../Utility/HomeProductsApi';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const MainScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [bestSelling, setBestSelling] = useState<ProductListItemDto[]>([]);
  const [exclusive, setExclusive] = useState<ProductListItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getHomeProductsApi();
        setBestSelling(response.data.bestSellingItems || []);
        setExclusive(response.data.exclusiveItems || []);
      } catch (err) {
        console.error('Failed to load home products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
  return (
    

    <View style={styles.screen}>
      {/* Scrollable content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }} // extra space for BottomTabBar
      >

        
          
        <View style={styles.container}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <Text style={styles.location}>New York City</Text>
            <CartIcon onPress={() => navigation.navigate('Cart')} />
          </View>

          {/* Add the button here */}
        <View style={{ marginBottom: 16 }}>
  <Button
    title="Open QR Scanner"
    onPress={() =>
      navigation.navigate('DeliveryOrderDetails', {
        orderId: Number(51),
      })
    }
  />
</View>


          {/* Sections */}
          <PromoCarousel />
          <CategoryIcons />
          <ProductListSection
          title="Best Selling Items"
          products={bestSelling}
          animateImage={true}
          sectionType='bestSelling'
        />
          <ProductListSection
        title="🌟 Exclusive"
        products={exclusive}
        sectionType='exclusive'
        cardStyle={{
          backgroundColor: '#fef9f1',
          borderColor: '#f1e5c4',
          borderWidth: 1,
        }}
  titleStyle={{ color: '#B8860B' }}
  badge={true}
  animateImage={true}
/>
        </View>
      </ScrollView>

      {/* Bottom tab bar fixed at bottom */}
      <BottomTabBar />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  container: {
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
});

export default MainScreen;
