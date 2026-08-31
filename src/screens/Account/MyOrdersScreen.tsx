import React, { useEffect, useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
  Image,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { RootStackParamList } from '../../navigation/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getMyOrdersApi, Order, OrderItemDto } from '../../Utility/myOrdersApi';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/slices/cartSlice';
import { resolveImageUrl } from '../../Utility/apiConfig';

const TABS = ['All', 'Ongoing', 'Delivered', 'Cancelled'];

type MyOrdersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Orders'>;

export default function MyOrdersScreen() {
  const navigation = useNavigation<MyOrdersScreenNavigationProp>();
  const dispatch = useDispatch();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [hasMore, setHasMore] = useState(true);

  // Selected Order for Detailed Receipt Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(
    async (pageNumber = 1, isRefreshing = false) => {
      if (loading && !isRefreshing) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getMyOrdersApi(activeTab, pageNumber, 10);
        if (response.success && response.data) {
          const { orders: newOrders, hasMore: newHasMore } = response.data;
          setOrders(isRefreshing ? newOrders : (prev) => [...prev, ...newOrders]);
          setHasMore(newHasMore);
          setPage(pageNumber);
        } else {
          setError(response.message || 'Failed to fetch orders.');
        }
      } catch (err: any) {
        setError(err?.message || 'Unable to connect to the server.');
      } finally {
        setLoading(false);
        if (isRefreshing) setRefreshing(false);
      }
    },
    [activeTab]
  );

  useEffect(() => {
    fetchOrders(1, true);
  }, [activeTab]);

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchOrders(page + 1);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders(1, true);
  };

  // Reorder (Buy Again): Adds all items from this order into the cart
  const handleReorder = (order: Order) => {
    if (!order.items || order.items.length === 0) {
      Alert.alert('Notice', 'No items found in this order to reorder.');
      return;
    }

    order.items.forEach((item: OrderItemDto) => {
      dispatch(
        addToCart({
          id: item.productId,
          name: item.productName,
          price: item.unitPrice,
          discountPrice: item.unitPrice,
          imageUrl: item.productImage || '',
          brandName: '',
          categoryName: '',
          unitSize: '',
          description: '',
          isBestSelling: false,
          isExclusive: false,
        })
      );
    });

    Alert.alert(
      'Items Added to Cart',
      `${order.items.length} ${order.items.length === 1 ? 'item' : 'items'} added to your cart.`,
      [
        { text: 'Keep Shopping', style: 'cancel' },
        { text: 'Go to Cart', onPress: () => navigation.navigate('Cart') },
      ]
    );
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const previewItems = item.items?.slice(0, 4) || [];
    const remainingCount = (item.items?.length || 0) - previewItems.length;

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => setSelectedOrder(item)}
        activeOpacity={0.9}
      >
        {/* Card Header: Order No, Date, Status Badge */}
        <View style={styles.orderCardHeader}>
          <View style={styles.orderNumWrapper}>
            <Text style={styles.orderNumber}>{item.orderNumber}</Text>
            <Text style={styles.dateTime}>
              {item.formattedDate} • {item.formattedTime}
            </Text>
          </View>

          <View
            style={[
              styles.statusPill,
              { backgroundColor: item.statusColor ? `${item.statusColor}18` : '#ECFDF5' },
            ]}
          >
            <Text style={[styles.statusText, { color: item.statusColor || '#059669' }]}>
              {item.statusText}
            </Text>
          </View>
        </View>

        {/* Thumbnail Preview Strip */}
        <View style={styles.previewStripContainer}>
          <View style={styles.thumbsRow}>
            {previewItems.map((prod, idx) => (
              <View key={idx} style={styles.thumbWrapper}>
                {prod.productImage ? (
                  <Image source={{ uri: resolveImageUrl(prod.productImage) }} style={styles.stripThumb} />
                ) : (
                  <View style={styles.stripThumbPlaceholder}>
                    <Text style={{ fontSize: 13 }}>🛒</Text>
                  </View>
                )}
                {prod.quantity > 1 && (
                  <View style={styles.qtyBadge}>
                    <Text style={styles.qtyBadgeText}>x{prod.quantity}</Text>
                  </View>
                )}
              </View>
            ))}

            {remainingCount > 0 && (
              <View style={styles.moreBadge}>
                <Text style={styles.moreBadgeText}>+{remainingCount}</Text>
              </View>
            )}
          </View>

          {item.itemsSummary ? (
            <Text style={styles.summaryCaptionText} numberOfLines={1}>
              {item.itemsSummary}
            </Text>
          ) : null}
        </View>

        {/* Delivery Address snippet */}
        {item.deliveryAddress ? (
          <View style={styles.addressBox}>
            <Text style={styles.addressIcon}>📍</Text>
            <Text style={styles.addressText} numberOfLines={1}>
              {item.deliveryAddress}
            </Text>
          </View>
        ) : null}

        <View style={styles.separator} />

        {/* Card Footer: Amount + Context-aware Action Buttons */}
        <View style={styles.orderCardFooter}>
          <View>
            <Text style={styles.itemCountLabel}>
              {item.itemCount} {item.itemCount === 1 ? 'Item' : 'Items'}
            </Text>
            <Text style={styles.amount}>₹{item.totalAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.actionsRow}>
            {/* View Details Button */}
            <TouchableOpacity
              style={styles.detailsBtn}
              onPress={() => setSelectedOrder(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.detailsBtnText}>View Items</Text>
            </TouchableOpacity>

            {/* Reorder Button */}
            <TouchableOpacity
              style={styles.reorderBtn}
              onPress={() => handleReorder(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.reorderBtnText}>🔄 Reorder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Bar */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.headerBackIcon}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Orders & History</Text>

        <View style={{ width: 36 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Error View */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => fetchOrders(page, true)} style={styles.retryBtn}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Order List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading && !refreshing ? (
            <ActivityIndicator size="small" color="#059669" style={{ marginVertical: 16 }} />
          ) : null
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#059669']} />
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>No Orders Found</Text>
              <Text style={styles.emptySub}>
                {activeTab === 'All'
                  ? "You haven't placed any grocery orders yet."
                  : `No ${activeTab.toLowerCase()} orders found.`}
              </Text>
              <TouchableOpacity
                style={styles.startShoppingBtn}
                onPress={() => navigation.navigate('Main')}
                activeOpacity={0.85}
              >
                <Text style={styles.startShoppingText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />

      {/* 🧾 Order Receipt / Details Modal */}
      <Modal
        visible={!!selectedOrder}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedOrder(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedOrder && (
              <>
                <View style={styles.modalHeader}>
                  <View>
                    <Text style={styles.modalTitle}>Order Receipt</Text>
                    <Text style={styles.modalSub}>{selectedOrder.orderNumber}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelectedOrder(null)}
                    style={styles.closeBtn}
                  >
                    <Text style={styles.closeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} style={styles.modalScroll}>
                  {/* Status & Date */}
                  <View style={styles.modalStatusRow}>
                    <Text style={styles.modalDate}>
                      {selectedOrder.formattedDate} at {selectedOrder.formattedTime}
                    </Text>
                    <View
                      style={[
                        styles.statusPill,
                        {
                          backgroundColor: selectedOrder.statusColor
                            ? `${selectedOrder.statusColor}18`
                            : '#ECFDF5',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: selectedOrder.statusColor || '#059669' },
                        ]}
                      >
                        {selectedOrder.statusText}
                      </Text>
                    </View>
                  </View>

                  {/* Delivery Address */}
                  {selectedOrder.deliveryAddress ? (
                    <View style={styles.modalSection}>
                      <Text style={styles.modalSectionTitle}>Delivery Address</Text>
                      <Text style={styles.modalAddressText}>{selectedOrder.deliveryAddress}</Text>
                    </View>
                  ) : null}

                  {/* Itemized List */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Items ({selectedOrder.itemCount})</Text>
                    {selectedOrder.items?.map((item, idx) => (
                      <View key={idx} style={styles.itemRow}>
                        {item.productImage ? (
                          <Image source={{ uri: resolveImageUrl(item.productImage) }} style={styles.itemThumb} />
                        ) : (
                          <View style={styles.itemThumbPlaceholder}>
                            <Text>🥦</Text>
                          </View>
                        )}
                        <View style={styles.itemInfo}>
                          <Text style={styles.itemName} numberOfLines={1}>
                            {item.productName}
                          </Text>
                          <Text style={styles.itemQtyPrice}>
                            {item.quantity} x ₹{item.unitPrice.toFixed(2)}
                          </Text>
                        </View>
                        <Text style={styles.itemTotalPrice}>₹{item.totalPrice.toFixed(2)}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Price Breakdown */}
                  <View style={styles.modalSection}>
                    <Text style={styles.modalSectionTitle}>Payment Summary</Text>
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Subtotal</Text>
                      <Text style={styles.summaryValue}>₹{selectedOrder.subtotal.toFixed(2)}</Text>
                    </View>
                    {selectedOrder.discount > 0 && (
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Discount</Text>
                        <Text style={[styles.summaryValue, { color: '#059669' }]}>
                          - ₹{selectedOrder.discount.toFixed(2)}
                        </Text>
                      </View>
                    )}
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Delivery Fee</Text>
                      <Text style={styles.summaryValue}>
                        {selectedOrder.deliveryFee === 0
                          ? 'FREE'
                          : `₹${selectedOrder.deliveryFee.toFixed(2)}`}
                      </Text>
                    </View>
                    <View style={[styles.summaryRow, styles.totalRow]}>
                      <Text style={styles.totalLabel}>Total Paid</Text>
                      <Text style={styles.totalValue}>
                        ₹{selectedOrder.totalAmount.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </ScrollView>

                {/* Modal Footer Actions */}
                <View style={styles.modalFooter}>
                  <TouchableOpacity
                    style={styles.modalReorderBtn}
                    onPress={() => {
                      const order = selectedOrder;
                      setSelectedOrder(null);
                      handleReorder(order);
                    }}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.modalReorderBtnText}>
                      🔄 Reorder All ({selectedOrder.itemCount} Items)
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  tab: {
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeTab: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  tabText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '700',
  },
  activeTabText: {
    color: '#FACC15',
    fontWeight: '900',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderNumWrapper: {
    flex: 1,
  },
  orderNumber: {
    fontWeight: '900',
    fontSize: 15,
    color: '#0F172A',
  },
  dateTime: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
    fontWeight: '500',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontWeight: '800',
    fontSize: 11,
  },
  previewStripContainer: {
    marginTop: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  thumbsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  thumbWrapper: {
    position: 'relative',
  },
  stripThumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stripThumbPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBadge: {
    position: 'absolute',
    bottom: -3,
    right: -3,
    backgroundColor: '#0F172A',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  qtyBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  moreBadge: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#EEF2F6',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreBadgeText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '800',
  },
  summaryCaptionText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 6,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 2,
  },
  addressIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  addressText: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  orderCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCountLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  amount: {
    color: '#0F172A',
    fontWeight: '900',
    fontSize: 16,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailsBtn: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  detailsBtnText: {
    color: '#334155',
    fontSize: 12,
    fontWeight: '700',
  },
  reorderBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: '#059669',
  },
  reorderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    marginBottom: 8,
    fontWeight: '700',
  },
  retryBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  retryText: {
    color: '#FACC15',
    fontWeight: '800',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 52,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  startShoppingBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  startShoppingText: {
    color: '#FACC15',
    fontSize: 13,
    fontWeight: '900',
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },
  modalSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    fontWeight: '600',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '700',
  },
  modalScroll: {
    marginTop: 12,
  },
  modalStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalDate: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  modalSection: {
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalSectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalAddressText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
  },
  itemThumb: {
    width: 38,
    height: 38,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: '#F8FAFC',
  },
  itemThumbPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 6,
    marginRight: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemQtyPrice: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  itemTotalPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#059669',
  },
  modalFooter: {
    marginTop: 10,
  },
  modalReorderBtn: {
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalReorderBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
});

