import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

type PromoBannerProps = {
  badge?: string;
  title: string;
  discount: string;
  buttonText: string;
  image: any;
  onPress: () => void;
  isActive: boolean;
  index: number;
  total: number;
  bgGradient?: string[];
  accentColor?: string;
};

const PromoBanner = ({
  badge = '🔥 MEGA MALL SALE',
  title,
  discount,
  buttonText,
  image,
  onPress,
  total,
  index,
  bgGradient = ['#0F172A', '#1E293B'],
  accentColor = '#FACC15',
}: PromoBannerProps) => {
  const bgColor = bgGradient[0] || '#0F172A';

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: bgColor }]}
      onPress={onPress}
      activeOpacity={0.92}
    >
      {/* Decorative Accent Glow */}
      <View style={[styles.decorCircle, { borderColor: accentColor }]} />

      {/* Left Content Area */}
      <View style={styles.textContainer}>
        <View style={styles.badgePill}>
          <Text style={styles.badgeText}>{badge}</Text>
        </View>

        <Text style={[styles.discountText, { color: accentColor }]}>{discount}</Text>
        <Text style={styles.headlineText} numberOfLines={2}>
          {title}
        </Text>

        <TouchableOpacity style={[styles.ctaButton, { backgroundColor: accentColor }]} onPress={onPress}>
          <Text style={styles.ctaButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>

      {/* Right Image Graphic */}
      <View style={styles.imageBackdrop}>
        <Image source={image} style={styles.image} resizeMode="contain" />
      </View>

      {/* Pagination Dots */}
      <View style={styles.paginationContainer}>
        {[...Array(total)].map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === index
                ? [styles.activeDot, { backgroundColor: accentColor }]
                : styles.inactiveDot,
            ]}
          />
        ))}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 18,
    flexDirection: 'row',
    padding: 16,
    marginVertical: 4,
    height: 155,
    width: width - 32,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#0F172A',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 8,
    elevation: 5,
  },
  decorCircle: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1.5,
    opacity: 0.15,
  },
  textContainer: {
    flex: 1.3,
    justifyContent: 'center',
    paddingRight: 8,
    zIndex: 2,
  },
  badgePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  discountText: {
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  headlineText: {
    fontSize: 12,
    color: '#E2E8F0',
    fontWeight: '600',
    marginVertical: 4,
    lineHeight: 16,
  },
  ctaButton: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  ctaButtonText: {
    color: '#0F172A',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 0.4,
  },
  imageBackdrop: {
    flex: 0.9,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  image: {
    width: 110,
    height: 110,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  dot: {
    height: 5,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  activeDot: {
    width: 18,
  },
});

export default PromoBanner;
