import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigation';

type WelcomeScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Welcome'
>;

type Props = {
  navigation: WelcomeScreenNavigationProp;
};

const { width } = Dimensions.get('window');

const SETUP_STEPS = [
  '⚡ Connecting to Central Township Store...',
  '🌾 Initializing 5,000+ Groceries & Dairy...',
  '🚚 Configuring 10-15 Min Express Delivery...',
  '✅ Campus HyperMarket Ready!',
];

const DROPPING_ITEMS = [
  { emoji: '🌾', label: 'Atta & Grains', dropDelay: 300 },
  { emoji: '🥛', label: 'Fresh Dairy', dropDelay: 1200 },
  { emoji: '🍿', label: 'Snacks & Munchies', dropDelay: 2100 },
  { emoji: '🥤', label: 'Cold Beverages', dropDelay: 3000 },
  { emoji: '🍎', label: 'Fresh Fruits', dropDelay: 3900 },
];

export default function WelcomeScreen({ navigation }: Props) {
  // Progress Bar Animation (0 to 100%)
  const progressAnim = useRef(new Animated.Value(0)).current;
  const [progressPercent, setProgressPercent] = useState(0);
  const [setupTextIndex, setSetupTextIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // Ready Content Fade & Slide Anim (Reveals title & button at 100%)
  const readyFadeAnim = useRef(new Animated.Value(0)).current;
  const readySlideAnim = useRef(new Animated.Value(20)).current;

  // Cart & Items Animations
  const cartScale = useRef(new Animated.Value(0.8)).current;
  const cartBounce = useRef(new Animated.Value(0)).current;

  // Individual Dropping Item Animated Y-Positions
  const itemDropAnims = useRef(
    DROPPING_ITEMS.map(() => new Animated.Value(-120))
  ).current;

  const itemOpacityAnims = useRef(
    DROPPING_ITEMS.map(() => new Animated.Value(0))
  ).current;

  // Button Pulse Animation
  const btnPulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Progress Bar Fill (0% to 100% over 4.5 seconds)
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 4500,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start(() => {
      setIsReady(true);
      // Reveal Welcome Title & Continue Button with smooth fade & slide!
      Animated.parallel([
        Animated.timing(readyFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(readySlideAnim, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
      ]).start();
    });

    // Sync numeric percentage state & setup text
    const listenerId = progressAnim.addListener(({ value }) => {
      const pct = Math.round(value * 100);
      setProgressPercent(pct);

      if (pct < 30) setSetupTextIndex(0);
      else if (pct < 65) setSetupTextIndex(1);
      else if (pct < 95) setSetupTextIndex(2);
      else setSetupTextIndex(3);
    });

    // 2. Sequential Dropping Grocery Items into Shopping Cart Animation
    DROPPING_ITEMS.forEach((_, idx) => {
      setTimeout(() => {
        // Item drops down into cart
        Animated.parallel([
          Animated.timing(itemOpacityAnims[idx], {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.spring(itemDropAnims[idx], {
            toValue: 0,
            friction: 6,
            tension: 50,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Trigger cart bounce impact when item lands inside cart!
          Animated.sequence([
            Animated.timing(cartBounce, {
              toValue: 6,
              duration: 100,
              useNativeDriver: true,
            }),
            Animated.timing(cartBounce, {
              toValue: 0,
              duration: 120,
              useNativeDriver: true,
            }),
          ]).start();
        });
      }, DROPPING_ITEMS[idx].dropDelay);
    });

    // 3. CTA Button Pulse Loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(btnPulse, {
          toValue: 1.03,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(btnPulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      progressAnim.removeListener(listenerId);
    };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Decorative Rings */}
      <View style={styles.circlesContainer}>
        <View style={[styles.ring, styles.ring1]} />
        <View style={[styles.ring, styles.ring2]} />
      </View>

      <View style={styles.content}>
        {/* Top Header Tag */}
        <View style={styles.headerTag}>
          <Text style={styles.headerTagIcon}>⚡</Text>
          <Text style={styles.headerTagText}>HYPERMARKET INITIALIZATION</Text>
        </View>

        {/* 3D-Style Metallic Shopping Cart Fill Stage */}
        <View style={styles.cartStage}>
          {/* Dropping Grocery Items Stack inside Cart */}
          <View style={styles.itemsBasketArea}>
            {DROPPING_ITEMS.map((item, idx) => (
              <Animated.View
                key={idx}
                style={[
                  styles.droppedItemPill,
                  {
                    opacity: itemOpacityAnims[idx],
                    transform: [{ translateY: itemDropAnims[idx] }],
                  },
                ]}
              >
                <Text style={styles.droppedEmoji}>{item.emoji}</Text>
                <Text style={styles.droppedLabel}>{item.label}</Text>
              </Animated.View>
            ))}
          </View>

          {/* Central Hero Shopping Cart */}
          <Animated.View
            style={[
              styles.cartCircle,
              {
                transform: [
                  { scale: cartScale },
                  { translateY: cartBounce },
                ],
              },
            ]}
          >
            <Text style={styles.cartIcon}>🛒</Text>
            {isReady && (
              <View style={styles.readyBadge}>
                <Text style={styles.readyBadgeText}>✓</Text>
              </View>
            )}
          </Animated.View>
        </View>

        {/* Setup Progress Bar Section */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>
              {isReady ? 'Setup Complete!' : 'Loading Campus HyperMarket...'}
            </Text>
            <Text style={styles.progressPercentText}>{progressPercent}%</Text>
          </View>

          {/* Animated Progress Bar */}
          <View style={styles.progressBarTrack}>
            <Animated.View
              style={[
                styles.progressBarFill,
                { width: progressWidth },
              ]}
            />
          </View>

          {/* Dynamic Setup Status Step Text */}
          <Text style={styles.setupStatusText}>{SETUP_STEPS[setupTextIndex]}</Text>
        </View>

        {/* Revealed ONLY when Setup Reaches 100% */}
        {isReady && (
          <Animated.View
            style={[
              styles.readyContentArea,
              {
                opacity: readyFadeAnim,
                transform: [{ translateY: readySlideAnim }],
              },
            ]}
          >
            <Text style={styles.title}>Welcome to groCart</Text>

            <Animated.View style={{ width: '100%', transform: [{ scale: btnPulse }] }}>
              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => navigation.navigate('SignIn')}
                activeOpacity={0.9}
              >
                <Text style={styles.primaryBtnText}>
                  CONTINUE WITH MOBILE NUMBER →
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circlesContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#1E293B',
  },
  ring1: {
    width: width * 0.85,
    height: width * 0.85,
  },
  ring2: {
    width: width * 1.35,
    height: width * 1.35,
  },
  content: {
    zIndex: 10,
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  headerTagIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  headerTagText: {
    color: '#FACC15',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },

  // --- Cart Fill Stage ---
  cartStage: {
    width: '100%',
    height: 190,
    backgroundColor: '#1E293B',
    borderRadius: 22,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  itemsBasketArea: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  droppedItemPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
    margin: 3,
  },
  droppedEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  droppedLabel: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '800',
  },
  cartCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#0F172A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FACC15',
    shadowColor: '#FACC15',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 8,
  },
  cartIcon: {
    fontSize: 44,
  },
  readyBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#0F172A',
  },
  readyBadgeText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
  },

  // --- Progress Card ---
  progressCard: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  progressPercentText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FACC15',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#0F172A',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#059669',
    borderRadius: 4,
  },
  setupStatusText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },

  // --- Ready Area ---
  readyContentArea: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 18,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  primaryBtn: {
    width: '100%',
    backgroundColor: '#FACC15',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#FACC15',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryBtnText: {
    color: '#0F172A',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});