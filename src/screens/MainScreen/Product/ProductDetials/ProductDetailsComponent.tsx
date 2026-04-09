import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import { ProductDetails } from '../../../../types/ProductDetails';


interface Props {
  product: ProductDetails;
}

const { width } = Dimensions.get('window');

export default function ProductDetailsComponent({ product }: Props) {
  const images = Array.isArray(product.imageUrl) ? product.imageUrl : [product.imageUrl];
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewRef = React.useRef(({ changed }: any) => {
    if (changed[0]) {
      setActiveIndex(changed[0].index);
    }
  });

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
      />
      {/* Pagination Dots */}
      <View style={styles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Product Info */}
      <View style={styles.metaContainer}>
        <View style={styles.badges}>
          <Text style={styles.discountBadge}>
            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
          </Text>
          <Text style={styles.weightBadge}> {product.unitSize}</Text>
        </View>

        <Text style={styles.title}>{product.id} {product.title}</Text>
        <Text style={styles.subTitle}>{product.unitSize}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.oldPrice}>${product.price}</Text>
          <Text style={styles.newPrice}>${product.discountPrice}</Text>
        </View>

        <Text style={styles.sectionTitle}>Product Details</Text>
        <Text style={styles.description}>{product.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  image: {
    width: width - 32,
    height: 220,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#FF6347',
  },
  metaContainer: {
    marginTop: 10,
    marginBottom: 16,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  discountBadge: {
    backgroundColor: '#FF6347',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
  },
  weightBadge: {
    backgroundColor: '#eee',
    color: '#333',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  subTitle: {
    fontSize: 14,
    color: '#777',
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    marginRight: 8,
  },
  newPrice: {
    color: '#FF6347',
    fontWeight: '700',
    fontSize: 16,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});
