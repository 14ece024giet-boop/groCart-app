import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getDeliveryFeeConfigApi } from '../../Utility/deliveryFeeApi';

const CartSummary = () => {
  const items = useSelector((state: RootState) => state.cart.items);
  const [feeConfig, setFeeConfig] = useState({
    freeDeliveryThreshold: 499,
    standardDeliveryFee: 20,
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await getDeliveryFeeConfigApi();
        if (res?.success && res?.data) {
          setFeeConfig({
            freeDeliveryThreshold: res.data.freeDeliveryThreshold || 499,
            standardDeliveryFee: res.data.standardDeliveryFee || 20,
          });
        }
      } catch (e) {}
    };
    fetchConfig();
  }, []);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountedSubtotal = items.reduce(
    (sum, item) => sum + (item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity,
    0
  );
  const discountAmount = subtotal - discountedSubtotal;

  const isFreeDelivery = discountedSubtotal >= feeConfig.freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : feeConfig.standardDeliveryFee;
  const amountNeeded = Math.max(0, feeConfig.freeDeliveryThreshold - discountedSubtotal);
  const progressPercent = Math.min(
    100,
    Math.round((discountedSubtotal / feeConfig.freeDeliveryThreshold) * 100)
  );

  const grandTotal = discountedSubtotal + deliveryFee;

  return (
    <View style={styles.cardContainer}>
      {/* 🚚 Free Delivery Progress Bar or Unlocked Banner */}
      {!isFreeDelivery && items.length > 0 ? (
        <View style={styles.deliveryPromoBox}>
          <View style={styles.promoHeader}>
            <Text style={styles.promoIcon}>🚚</Text>
            <Text style={styles.promoText}>
              Add <Text style={styles.promoHighlight}>₹{amountNeeded.toFixed(2)}</Text> more for{' '}
              <Text style={styles.promoHighlight}>FREE Delivery</Text>
            </Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>
      ) : (
        items.length > 0 && (
          <View style={styles.unlockedBanner}>
            <Text style={styles.unlockedText}>
              ✨ <Text style={{ fontWeight: '900' }}>FREE Delivery Unlocked</Text> on this order!
            </Text>
          </View>
        )
      )}

      <Text style={styles.cardTitle}>Bill Summary</Text>

      {/* Item Subtotal */}
      <View style={styles.row}>
        <Text style={styles.label}>Items Subtotal</Text>
        <Text style={styles.value}>₹{subtotal.toFixed(2)}</Text>
      </View>

      {/* Product Discounts */}
      {discountAmount > 0 && (
        <View style={styles.row}>
          <Text style={styles.label}>Product Discount</Text>
          <Text style={styles.discountValue}>−₹{discountAmount.toFixed(2)}</Text>
        </View>
      )}

      {/* Express Township Delivery Fee */}
      <View style={styles.row}>
        <View style={styles.deliveryLabelRow}>
          <Text style={styles.label}>Express Campus Delivery</Text>
          <View style={styles.speedPill}>
            <Text style={styles.speedPillText}>⚡ 10-15 MIN</Text>
          </View>
        </View>
        <View style={styles.feeValueRow}>
          {isFreeDelivery ? (
            <>
              <Text style={styles.strikethroughFee}>₹{feeConfig.standardDeliveryFee.toFixed(2)}</Text>
              <Text style={styles.freeFeeText}>FREE</Text>
            </>
          ) : (
            <Text style={styles.value}>₹{deliveryFee.toFixed(2)}</Text>
          )}
        </View>
      </View>

      <View style={styles.separator} />

      {/* Grand Total */}
      <View style={styles.grandTotalRow}>
        <View>
          <Text style={styles.grandTotalLabel}>Grand Total</Text>
          <Text style={styles.taxInclusive}>Inclusive of all taxes</Text>
        </View>
        <Text style={styles.grandTotalValue}>₹{grandTotal.toFixed(2)}</Text>
      </View>

      {/* Total Savings Highlight Banner */}
      {(discountAmount > 0 || isFreeDelivery) && (
        <View style={styles.savingsBanner}>
          <Text style={styles.savingsBannerText}>
            🎉 You are saving ₹{(discountAmount + (isFreeDelivery ? feeConfig.standardDeliveryFee : 0)).toFixed(2)} on this order!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  deliveryPromoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  promoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  promoIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  promoText: {
    fontSize: 12.5,
    color: '#334155',
    fontWeight: '600',
  },
  promoHighlight: {
    color: '#059669',
    fontWeight: '900',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  unlockedBanner: {
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
  },
  unlockedText: {
    color: '#047857',
    fontSize: 12.5,
    fontWeight: '700',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  deliveryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feeValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  strikethroughFee: {
    fontSize: 12,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    marginRight: 6,
  },
  freeFeeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#059669',
  },
  speedPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  speedPillText: {
    color: '#059669',
    fontSize: 8,
    fontWeight: '900',
  },
  label: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  value: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },
  discountValue: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '800',
  },
  separator: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },
  taxInclusive: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
    marginTop: 2,
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },
  savingsBanner: {
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginTop: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  savingsBannerText: {
    color: '#047857',
    fontSize: 11.5,
    fontWeight: '900',
  },
});

export default CartSummary;
