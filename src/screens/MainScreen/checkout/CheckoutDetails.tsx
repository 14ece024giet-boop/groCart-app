import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { RouteProp, useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/navigation';
import { createOrderApi } from '../../../Utility/orderService';
import { getUserAddressApi, UserAddressDto } from '../../../Utility/userAddressApi';
import { getDeliveryFeeConfigApi } from '../../../Utility/deliveryFeeApi';
import { StackNavigationProp } from '@react-navigation/stack';
import { clearCart } from '../../../store/slices/cartSlice';

type CheckoutDetailsRouteProp = RouteProp<RootStackParamList, 'CheckoutDetails'>;
type CheckoutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CheckoutDetails'>;

type OrderPayload = {
  items: { productId: string; quantity: number }[];
  deliveryType: 'COD';
  deliveryPointId: number;
  recipientName: string;
  roomNumber: string;
  additionalInfo: string;
  couponCode?: string;
};

const CheckoutScreen = () => {
  const route = useRoute<CheckoutDetailsRouteProp>();
  const navigation = useNavigation<any>();
  const dispatch = useDispatch();

  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);

  const [userAddress, setUserAddress] = useState<UserAddressDto | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [feeConfig, setFeeConfig] = useState({
    freeDeliveryThreshold: 499,
    standardDeliveryFee: 20,
  });

  const couponCode = route.params?.couponCode || '';
  const deliveryType: 'COD' = 'COD';

  // Calculate prices
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalAfterDiscount = cartItems.reduce(
    (acc, item) => acc + (item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity,
    0
  );
  const discountAmount = subtotal - totalAfterDiscount;
  const isFreeDelivery = totalAfterDiscount >= feeConfig.freeDeliveryThreshold;
  const deliveryFee = isFreeDelivery ? 0 : feeConfig.standardDeliveryFee;
  const grandTotal = totalAfterDiscount + deliveryFee;

  // Fetch fee config and saved profile delivery address
  const fetchAddressAndConfig = async () => {
    setIsLoadingAddress(true);
    try {
      const [addressRes, configRes] = await Promise.all([
        getUserAddressApi(),
        getDeliveryFeeConfigApi(),
      ]);

      if (addressRes?.success && addressRes?.data) {
        setUserAddress(addressRes.data);
      } else {
        setUserAddress(null);
      }

      if (configRes?.success && configRes?.data) {
        setFeeConfig({
          freeDeliveryThreshold: configRes.data.freeDeliveryThreshold || 499,
          standardDeliveryFee: configRes.data.standardDeliveryFee || 20,
        });
      }
    } catch (err: any) {
      console.error('Failed to load checkout config:', err.message);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAddressAndConfig();
    }, [])
  );

  const buildOrderPayload = (): OrderPayload => ({
    items: cartItems.map((item) => ({
      productId: String(item.id),
      quantity: item.quantity,
    })),
    deliveryType,
    deliveryPointId: Number(userAddress?.deliveryPointId || 0),
    recipientName: userAddress?.userName || '',
    roomNumber: userAddress?.roomNumber || '',
    additionalInfo: additionalInfo.trim(),
    ...(couponCode ? { couponCode } : {}),
  });

  const handlePlaceOrder = async () => {
    if (!userAddress || !userAddress.deliveryPointId) {
      Alert.alert(
        'Delivery Location Required',
        'Please select your township delivery point before placing an order.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Set Location', onPress: () => navigation.navigate('ManageAddress') },
        ]
      );
      return;
    }

    if (!userAddress.roomNumber?.trim()) {
      Alert.alert(
        'Quarter / Room Number Required',
        'Please specify your Quarter / Flat number in your address details.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Update Address', onPress: () => navigation.navigate('ManageAddress') },
        ]
      );
      return;
    }

    setIsPlacingOrder(true);
    try {
      const payload = buildOrderPayload();
      const result = await createOrderApi(payload);

      if (result.success) {
        dispatch(clearCart());
        navigation.replace('OrderConfirmation', {
          qrCodeUrl: result.data?.qrCodeUrl ?? result.data?.QRCodeUrl ?? '',
        });
      } else {
        Alert.alert('Order Failed', result.message || 'Something went wrong while placing your order.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Unexpected error occurred.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header Bar */}
        <View style={styles.topHeaderBar}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.headerBackIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Order Finalization</Text>

          <View style={styles.speedPill}>
            <Text style={styles.speedPillText}>⚡ 10-15 MIN</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          {/* Executive Delivery Address Card */}
          <Text style={styles.sectionHeading}>Delivery Address</Text>

          {isLoadingAddress ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="small" color="#059669" />
              <Text style={styles.loadingBoxText}>Loading saved delivery point...</Text>
            </View>
          ) : userAddress ? (
            <View style={styles.addressCard}>
              <View style={styles.addressCardHeader}>
                <View style={styles.addressTitleRow}>
                  <Text style={styles.locationIcon}>📍</Text>
                  <Text style={styles.addressCardTitle}>Township Delivery Point</Text>
                </View>

                <TouchableOpacity
                  onPress={() => navigation.navigate('ManageAddress')}
                  style={styles.changeButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.changeButtonText}>Change Location</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.deliveryPointName}>
                {userAddress.deliveryPointAddress || 'JSW Vijayanagar Township - Sector 4'}
              </Text>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Quarter / Room:</Text>
                <Text style={styles.infoValue}>
                  {userAddress.roomNumber ? `Qtr ${userAddress.roomNumber}` : 'Not specified'}
                </Text>
              </View>

              {userAddress.userName ? (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Recipient:</Text>
                  <Text style={styles.infoValue}>
                    {userAddress.userName}{' '}
                    {userAddress.phoneNumber ? `(${userAddress.phoneNumber})` : ''}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : (
            <View style={styles.emptyAddressCard}>
              <Text style={styles.emptyAddressTitle}>⚠️ No Saved Location</Text>
              <Text style={styles.emptyAddressDesc}>
                You have not selected a township delivery point yet. Please select your quarter location to proceed.
              </Text>
              <TouchableOpacity
                style={styles.addAddressButton}
                onPress={() => navigation.navigate('ManageAddress')}
                activeOpacity={0.85}
              >
                <Text style={styles.addAddressButtonText}>+ Set Delivery Address</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Delivery Instructions */}
          <View style={styles.notesSection}>
            <Text style={styles.sectionHeading}>Delivery Instructions (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="e.g. Leave at Quarter security gate / Call upon arrival"
              value={additionalInfo}
              onChangeText={setAdditionalInfo}
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={2}
            />
          </View>

          {/* Items Summary Compact List */}
          <Text style={styles.sectionHeading}>Order Summary ({cartItems.length} Items)</Text>
          <View style={styles.itemsCard}>
            {cartItems.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.name || item.title} <Text style={styles.itemQty}>x{item.quantity}</Text>
                </Text>
                <Text style={styles.itemPriceText}>
                  ₹{((item.discountPrice > 0 ? item.discountPrice : item.price) * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          {/* Financial Summary */}
          <Text style={styles.sectionHeading}>Payment Summary</Text>
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
            </View>

            {discountAmount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Product Savings</Text>
                <Text style={[styles.summaryValue, { color: '#059669', fontWeight: '800' }]}>
                  -₹{discountAmount.toFixed(2)}
                </Text>
              </View>
            )}

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Express Delivery Fee</Text>
              {isFreeDelivery ? (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: '#94A3B8', textDecorationLine: 'line-through', marginRight: 6 }}>
                    ₹{feeConfig.standardDeliveryFee.toFixed(2)}
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: '900', color: '#059669' }}>FREE</Text>
                </View>
              ) : (
                <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
              )}
            </View>

            <View style={styles.separator} />

            <View style={styles.summaryRowTotal}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.totalValue}>₹{grandTotal.toFixed(2)}</Text>
            </View>

            <View style={styles.codBadge}>
              <Text style={styles.codBadgeText}>💵 Pay via Cash / UPI on Delivery</Text>
            </View>
          </View>
        </ScrollView>

        {/* Sticky Place Order CTA Bar with Safe Insets */}
        <View style={styles.stickyCtaBar}>
          <TouchableOpacity
            style={[styles.placeOrderButton, isPlacingOrder && { opacity: 0.7 }]}
            onPress={handlePlaceOrder}
            disabled={isPlacingOrder}
            activeOpacity={0.9}
          >
            {isPlacingOrder ? (
              <ActivityIndicator color="#FACC15" />
            ) : (
              <Text style={styles.placeOrderButtonText}>
                PLACE ORDER • ₹{grandTotal.toFixed(2)}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  headerBackIcon: {
    fontSize: 18,
    color: '#0F172A',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  speedPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  speedPillText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '900',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 10,
    marginTop: 4,
    letterSpacing: -0.2,
  },
  loadingBox: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  loadingBoxText: {
    marginTop: 8,
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  addressCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#334155',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
    paddingBottom: 8,
  },
  addressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  addressCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#CBD5E1',
  },
  changeButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#1E293B',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#475569',
  },
  changeButtonText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FACC15',
  },
  deliveryPointName: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94A3B8',
    width: 100,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 12,
    color: '#F8FAFC',
    fontWeight: '800',
    flex: 1,
  },
  emptyAddressCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    alignItems: 'center',
  },
  emptyAddressTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#B45309',
    marginBottom: 6,
  },
  emptyAddressDesc: {
    fontSize: 12,
    color: '#78350F',
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 18,
  },
  addAddressButton: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addAddressButtonText: {
    color: '#FACC15',
    fontSize: 13,
    fontWeight: '900',
  },
  notesSection: {
    marginBottom: 16,
  },
  notesInput: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    minHeight: 50,
  },
  itemsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    flex: 1,
    marginRight: 10,
  },
  itemQty: {
    color: '#059669',
    fontWeight: '900',
  },
  itemPriceText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  summaryContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '800',
  },
  separator: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  summaryRowTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 4,
  },
  totalLabel: {
    fontWeight: '900',
    fontSize: 16,
    color: '#0F172A',
  },
  totalValue: {
    fontWeight: '900',
    fontSize: 20,
    color: '#0F172A',
  },
  codBadge: {
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    marginTop: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  codBadgeText: {
    color: '#047857',
    fontSize: 11,
    fontWeight: '900',
  },
  stickyCtaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 36,
    borderTopWidth: 1.5,
    borderColor: '#E2E8F0',
    elevation: 12,
  },
  placeOrderButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  placeOrderButtonText: {
    color: '#FACC15',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
