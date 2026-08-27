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
} from 'react-native';
import { RootStackParamList } from '../../navigation/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getMyOrdersApi, Order } from '../../Utility/myOrdersApi';

const TABS = ['All', 'Ongoing', 'Waiting', 'Completed'];

type MyOrdersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Orders'>;

export default function MyOrdersScreen() {
  const navigation = useNavigation<MyOrdersScreenNavigationProp>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = useCallback(
    async (pageNumber = 1, isRefreshing = false) => {
      if (loading && !isRefreshing) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getMyOrdersApi(activeTab, pageNumber);
        if (response.success && response.data) {
          const { orders: newOrders, hasMore: newHasMore } = response.data;
          setOrders(isRefreshing ? newOrders : (prev) => [...prev, ...newOrders]);
          setHasMore(newHasMore);
          setPage(pageNumber);
        } else {
          setError(response.message || 'Failed to fetch orders.');
        }
      } catch (err) {
        setError((err as Error).message || 'Something went wrong');
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

  const renderOrder = ({ item }: { item: Order }) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
      activeOpacity={0.85}
    >
      <View style={styles.orderCardHeader}>
        <View style={styles.orderNumWrapper}>
          <Text style={styles.orderNumber}>Order #{item.orderNumber}</Text>
          <Text style={styles.dateTime}>
            {item.date} • {item.time}
          </Text>
        </View>

        <View style={[styles.statusPill, { backgroundColor: item.statusColor ? `${item.statusColor}15` : '#ECFDF5' }]}>
          <Text style={[styles.statusText, { color: item.statusColor || '#059669' }]}>
            {item.statusText}
          </Text>
        </View>
      </View>

      <View style={styles.separator} />

      <View style={styles.orderCardFooter}>
        <Text style={styles.itemCountText}>
          {item.itemCount} {item.itemCount === 1 ? 'Item' : 'Items'}
        </Text>

        <View style={styles.priceTrackingRow}>
          <Text style={styles.amount}>₹{item.amount.toFixed(2)}</Text>
          <Text style={styles.trackArrow}>Track Order →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
            <Text style={styles.retryText}>Retry Loading</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Order List */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderOrder}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && !refreshing ? <ActivityIndicator size="small" color="#059669" style={{ marginVertical: 16 }} /> : null}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#059669']} />}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>No Orders Found</Text>
              <Text style={styles.emptySub}>
                You haven't placed any orders in this category yet.
              </Text>
            </View>
          ) : null
        }
      />
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
    paddingVertical: 6,
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
  itemCountText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  priceTrackingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    color: '#0F172A',
    fontWeight: '900',
    fontSize: 15,
    marginRight: 10,
  },
  trackArrow: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '900',
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
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
  },
});
