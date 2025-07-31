// components/PromoCarousel.tsx

import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import PromoBanner from './PromoBanner';
import { promoData } from './promoData';

const { width } = Dimensions.get('window');

const PromoCarousel = () => {
     const pagerRef = useRef<PagerView>(null);
     const [currentPage, setCurrentPage] = useState(0);
  return (
    <View style={styles.container}>
      <PagerView style={styles.pagerView} initialPage={0}>
        {promoData.map((item, index) => (
          <View key={index}>
            <PromoBanner
              title={item.title}
              discount={item.discount}
              buttonText={item.buttonText}
              image={item.image}
              onPress={() => console.log('Pressed:', item.title)}
              isActive={index === currentPage}
             index={index}
             total={promoData.length}
            />
          </View>
        ))}
      </PagerView>
  
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: 160,
  },
  pagerView: {
    flex: 1,
  },
   paginationContainer: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
  },
  activeDot: {
    backgroundColor: '#FF5722',
    width: 10,
    height: 10,
  },
});

export default PromoCarousel;
