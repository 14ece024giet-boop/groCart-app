import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
} from 'react-native';
import { useRoute } from '@react-navigation/native';

import ProductDetailsComponent from './ProductDetailsComponent';
import ProductListSection from '../ProductListSection';
import { Products } from '../bestSellingData';
import { ProductDetails } from '../../../types/ProductDetails';

const ProductDetailsScreen = () => {
  const route = useRoute();
  const { productId } = route.params as { productId: number };

  const product: ProductDetails | undefined = Products.find(
    (p) => p.id === productId
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {product ? (
        <ProductDetailsComponent product={product} />
      ) : (
        <View style={styles.centered}>
          <Text>Product not found</Text>
        </View>
      )}

      <ProductListSection
        title="Best Selling Items"
        products={Products}
        animateImage={true}
      />

      <ProductListSection
        title="🌟 Exclusive"
        products={Products.filter(
          (product) => product.productFeautre === 'Exclusive Product'
        )}
        cardStyle={{
          backgroundColor: '#fef9f1',
          borderColor: '#f1e5c4',
          borderWidth: 1,
        }}
        titleStyle={{ color: '#B8860B' }}
        badge={true}
        animateImage={true}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 60,
    paddingHorizontal: 16,
  },
  centered: {
    padding: 20,
    alignItems: 'center',
  },
});

export default ProductDetailsScreen;
