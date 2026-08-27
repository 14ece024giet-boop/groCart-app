import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View, ScrollView, ActivityIndicator } from 'react-native';
import PromoBanner from './PromoBanner';
import { getActiveBannersApi } from '../../../Utility/bannerApi';
import { promoData as fallbackPromoData } from './promoData';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 32;

const PromoCarousel = () => {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await getActiveBannersApi();
        if (res?.success && res?.data && res.data.length > 0) {
          const mapped = res.data.map((b) => ({
            id: b.id.toString(),
            badge: b.badgeText,
            discount: b.discountText,
            title: b.title,
            buttonText: b.buttonText,
            bgGradient: [b.bgColor || '#0F172A', b.bgColor || '#1E293B'],
            accentColor: b.accentColor || '#FACC15',
            image: { uri: b.imageUrl },
          }));
          setBanners(mapped);
        } else {
          setBanners(fallbackPromoData);
        }
      } catch (err) {
        setBanners(fallbackPromoData);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / BANNER_WIDTH);
    setCurrentPage(index);
  };

  if (loading) {
    return <ActivityIndicator color="#0C831F" style={{ height: 168 }} />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {banners.map((item, index) => (
          <View key={item.id} style={{ width: BANNER_WIDTH }}>
            <PromoBanner
              badge={item.badge}
              title={item.title}
              discount={item.discount}
              buttonText={item.buttonText}
              image={item.image}
              bgGradient={item.bgGradient}
              accentColor={item.accentColor}
              onPress={() => console.log('Pressed offer:', item.title)}
              isActive={index === currentPage}
              index={index}
              total={banners.length}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: BANNER_WIDTH,
    height: 168,
    marginBottom: 10,
  },
  scrollContent: {},
});

export default PromoCarousel;
