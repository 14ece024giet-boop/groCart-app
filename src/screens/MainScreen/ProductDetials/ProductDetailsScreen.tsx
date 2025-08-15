import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Alert, ScrollView, Text } from 'react-native'; // ✅ Correct
``
import { useRoute } from '@react-navigation/native';
// import axios from 'axios'; // Uncomment when API is ready
import ProductDetailsComponent from './ProductDetailsComponent';
import ProductListSection from '../ProductListSection';
import { bestSellingProducts } from '../bestSellingData';
import { ProductDetails } from '../../../types/ProductDetails';

const hardcodedProduct: ProductDetails = {
  id: 1,
  title: 'Sample Product',
  image: require('../../../../assets/grocery-banner.png'),
  images: [
    require('../../../../assets/grocery-banner.png'),
    require('../../../../assets/grocery-banner.png'),
  ],
  description:
    'This is a sample product description used for testing. Replace with API data later.',
  price: 50,
  discountPrice: 35,
  weight: '500g',
  quantity: 20,
};

const ProductDetailsScreen = () => {
  const route = useRoute();
  const { productId } = route.params as { productId: number };

  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProductDetails = async () => {
    /*
    try {
      const response = await axios.get(`https://yourapi.com/products/${productId}`);
      setProduct(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load product details.');
    } finally {
      setLoading(false);
    }
    */

    // Simulate API delay
    setTimeout(() => {
      setProduct(hardcodedProduct);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6347" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <ScrollView>
          <View><Text>Product not found</Text></View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View>
    <ScrollView contentContainerStyle={styles.container}>
      <ProductDetailsComponent product={product} />
    </ScrollView>

     <ProductListSection
            title="Best Selling Items"
            products={bestSellingProducts}
            animateImage={true}
          />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
    flexGrow: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductDetailsScreen;
