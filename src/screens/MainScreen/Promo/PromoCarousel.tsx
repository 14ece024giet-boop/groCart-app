// components/PromoCarousel.tsx

import React from 'react';
import { Dimensions } from 'react-native';
import PromoBanner from './PromoBanner';
import { promoData } from './promoData';

const { width } = Dimensions.get('window');

const PromoCarousel = () => {
  return (
    // <Carousel
    //   width={width}
    //   height={160}
    //   loop
    //   autoPlay
    //   data={promoData}
    //   scrollAnimationDuration={1000}
    //   renderItem={({ item }) => (
    //     <PromoBanner onPress={() => console.log('Pressed:', item.title)} title={''} discount={''} buttonText={''} image={undefined} />
    //   )}
    // />
    <view></view>
  );
};

export default PromoCarousel;
