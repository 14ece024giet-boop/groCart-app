import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { addToCart, incrementQuantity, decrementQuantity } from '../../store/slices/cartSlice';
import { ProductListItemDto } from '../../types/ProductListItemDto';
import { getActiveFlashSaleApi } from '../../Utility/bannerApi';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FLASH_GAP = 10;
// 2.3 "Peek" Carousel inside Flash Sale Card
const FLASH_CARD_WIDTH = Math.floor((SCREEN_WIDTH - 64) * 0.43);

interface Props {
  flashProducts?: ProductListItemDto[];
}

const FlashDealsCard = ({ flashProducts = [] }: Props) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [saleTitle, setSaleTitle] = useState('Super Saver Deals');
  const [badgeText, setBadgeText] = useState('⚡ FLASH SALE');
  const [claimedPercent, setClaimedPercent] = useState(88);
  const [apiItems, setApiItems] = useState<ProductListItemDto[]>([]);

  // Live countdown timer (2h 45m 30s)
  const [timeLeft, setTimeLeft] = useState(2 * 3600 + 45 * 60 + 30);

  useEffect(() => {
    const fetchFlashSale = async () => {
      try {
        const res = await getActiveFlashSaleApi();
        if (res?.success && res?.data) {
          if (res.data.flashSale) {
            setSaleTitle(res.data.flashSale.title || 'Super Saver Deals');
            setBadgeText(res.data.flashSale.badgeText || '⚡ FLASH SALE');
            setClaimedPercent(res.data.flashSale.claimedPercentage || 88);
          }
          if (res.data.items && res.data.items.length > 0) {
            setApiItems(res.data.items);
          }
        }
      } catch (err) {}
    };

    fetchFlashSale();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  const getQuantity = (productId: number) =>
    cartItems.find((item) => item.id === productId)?.quantity || 0;

  // Use API items first, then props fallback
  const displayItems = (apiItems.length > 0 ? apiItems : flashProducts).slice(0, 8);

  return (
    <View style={styles.cardContainer}>
      {/* Top Banner Row */}
      <View style={styles.topHeader}>
        <View style={styles.titleBox}>
          <View style={styles.flashBadge}>
            <Text style={styles.flashBadgeText}>{badgeText}</Text>
          </View>
          <Text style={styles.mainTitle}>{saleTitle}</Text>
        </View>

        {/* Live Digital Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>ENDS IN</Text>
          <View style={styles.timerBoxes}>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{pad(hours)}</Text>
            </View>
            <Text style={styles.colon}>:</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{pad(minutes)}</Text>
            </View>
            <Text style={styles.colon}>:</Text>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>{pad(seconds)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Claim Progress Bar */}
      <View style={styles.claimSection}>
        <View style={styles.claimRow}>
          <Text style={styles.claimText}>🔥 {claimedPercent}% Claimed • Selling Fast</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Text style={styles.seeAllText}>See All Deals ›</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${claimedPercent}%` }]} />
        </View>
      </View>

      {/* Horizontal Flash Deal Items Carousel */}
      {displayItems.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.itemsScroll}
        >
          {displayItems.map((item) => {
            const quantity = getQuantity(item.id);
            const price = item.price;
            const discountPrice = item.discountPrice > 0 ? item.discountPrice : price;
            const hasDiscount = price > discountPrice;
            const discountPercent = hasDiscount
              ? Math.round(((price - discountPrice) / price) * 100)
              : 25;

            return (
              <View key={item.id} style={styles.itemCard}>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('ProductDetails', {
                      productId: item.id.toString(),
                    })
                  }
                  activeOpacity={0.9}
                  style={{ flex: 1 }}
                >
                  <View style={styles.itemImageBackdrop}>
                    {item.imageUrl ? (
                      <Image source={{ uri: item.imageUrl }} style={styles.itemImg} />
                    ) : null}
                    <View style={styles.itemDiscountPill}>
                      <Text style={styles.itemDiscountText}>⚡ {discountPercent}% OFF</Text>
                    </View>
                  </View>

                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.itemUnit}>{item.unitSize || '1 Unit'}</Text>

                    <View style={styles.itemPriceRow}>
                      <Text style={styles.itemPrice}>₹{discountPrice}</Text>
                      {hasDiscount && <Text style={styles.itemMrp}>₹{price}</Text>}
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Instant ADD / Counter (Isolated from Navigation) */}
                <View style={styles.itemAction}>
                  {quantity === 0 ? (
                    <TouchableOpacity
                      style={styles.addBtn}
                      onPress={() => dispatch(addToCart(item))}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.addBtnText}>ADD</Text>
                      <Text style={styles.addBtnPlus}>+</Text>
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.stepperContainer}>
                      <TouchableOpacity
                        onPress={() => dispatch(decrementQuantity(item.id))}
                        style={styles.stepperBtn}
                      >
                        <Text style={styles.stepperText}>−</Text>
                      </TouchableOpacity>
                      <Text style={styles.stepperCount}>{quantity}</Text>
                      <TouchableOpacity
                        onPress={() => dispatch(incrementQuantity(item.id))}
                        style={styles.stepperBtn}
                      >
                        <Text style={styles.stepperText}>+</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#334155',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleBox: {
    flex: 1,
  },
  flashBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 4,
  },
  flashBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  mainTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  timerContainer: {
    alignItems: 'flex-end',
  },
  timerLabel: {
    color: '#FACC15',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  timerBoxes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeBox: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#FACC15',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
    minWidth: 26,
    alignItems: 'center',
  },
  timeText: {
    color: '#FACC15',
    fontSize: 12,
    fontWeight: '900',
  },
  colon: {
    color: '#FACC15',
    fontWeight: '900',
    fontSize: 12,
    marginHorizontal: 2,
  },
  claimSection: {
    marginBottom: 12,
  },
  claimRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  claimText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
  },
  seeAllText: {
    color: '#FACC15',
    fontSize: 12,
    fontWeight: '800',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#1E293B',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  itemsScroll: {
    paddingTop: 4,
    paddingBottom: 2,
    paddingRight: 16,
  },
  itemCard: {
    width: FLASH_CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 8,
    marginRight: FLASH_GAP,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    justifyContent: 'space-between',
  },
  itemImageBackdrop: {
    position: 'relative',
    height: 85,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    padding: 4,
  },
  itemImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  itemDiscountPill: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#DC2626',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 5,
    zIndex: 2,
    elevation: 2,
  },
  itemDiscountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  itemContent: {
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  itemUnit: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '700',
    marginBottom: 2,
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    marginRight: 4,
  },
  itemMrp: {
    fontSize: 10.5,
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  itemAction: {
    paddingHorizontal: 2,
    marginTop: 6,
  },
  addBtn: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#0C831F',
    borderRadius: 8,
    height: 36,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addBtnText: {
    color: '#0C831F',
    fontSize: 13,
    fontWeight: '900',
  },
  addBtnPlus: {
    color: '#0C831F',
    fontSize: 17,
    fontWeight: '900',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0C831F',
    borderRadius: 8,
    height: 36,
    paddingHorizontal: 4,
  },
  stepperBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperText: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    lineHeight: 21,
  },
  stepperCount: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
    minWidth: 18,
  },
});

export default FlashDealsCard;
