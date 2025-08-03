import React, { useEffect, useState, useCallback } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

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
import { RootStackParamList } from '../../../navigation/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  status: 'All' | 'Ongoing' | 'Waiting' | 'Completed';
  itemCount: number;
  amount: number;
  statusText: string;
  statusColor: string;
}

const TABS = ['All', 'Ongoing', 'Waiting', 'Completed'];

// Mock data for testing
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: '876543',
    date: '29 April',
    time: '01:21 PM',
    status: 'Ongoing',
    itemCount: 3,
    amount: 24,
    statusText: 'On the way',
    statusColor: '#00BFFF', // blue-ish
  },
  {
    id: '2',
    orderNumber: '876544',
    date: '27 April',
    time: '04:56 PM',
    status: 'Waiting',
    itemCount: 2,
    amount: 21,
    statusText: 'Pickup',
    statusColor: '#FFA500', // orange
  },
  {
    id: '3',
    orderNumber: '876545',
    date: '26 April',
    time: '04:21 PM',
    status: 'Completed',
    itemCount: 1,
    amount: 9,
    statusText: 'Cancelled',
    statusColor: '#FF6347', // red-ish
  },
  {
    id: '4',
    orderNumber: '876546',
    date: '22 April',
    time: '06:45 PM',
    status: 'Ongoing',
    itemCount: 3,
    amount: 24,
    statusText: 'On the way',
    statusColor: '#00BFFF',
  },
  {
    id: '5',
    orderNumber: '876547',
    date: '18 April',
    time: '01:16 PM',
    status: 'Completed',
    itemCount: 1,
    amount: 9,
    statusText: 'Cancelled',
    statusColor: '#FF6347',
  },
    {
        id: '6',
        orderNumber: '876548',
        date: '15 April',
        time: '03:30 PM',
        status: 'Waiting',
        itemCount: 2,
        amount: 21,
        statusText: 'Pickup',
        statusColor: '#FFA500',
    },
    {
    id: '7',
    orderNumber: '876547',
    date: '18 April',
    time: '01:16 PM',
    status: 'Completed',
    itemCount: 1,
    amount: 9,
    statusText: 'Cancelled',
    statusColor: '#FF6347',
  },
  {
    id: '8',
    orderNumber: '876547',
    date: '18 April',
    time: '01:16 PM',
    status: 'Completed',
    itemCount: 1,
    amount: 9,
    statusText: 'Completed',
    statusColor: '#FF6347',
  },
];

type MyOrdersScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Orders'>;

type MyOrdersScreenRouteProp = RouteProp<RootStackParamList, 'Orders'>;
export default function MyOrdersScreen() {
const navigation = useNavigation<MyOrdersScreenNavigationProp>();
  const route = useRoute<MyOrdersScreenRouteProp>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [hasMore, setHasMore] = useState(true);




  const fetchOrders = useCallback(
    async (pageNumber = 1, refreshing = false) => {
      setLoading(true);
      setError(null);

      try {
        // ----- Commented API call -----
        // const response = await fetch(
        //   `https://your-api-url.com/orders?page=${pageNumber}&status=${activeTab.toLowerCase()}`,
        //   {
        //     method: 'GET',
        //     headers: {
        //       'Content-Type': 'application/json',
        //       Authorization: 'Bearer YOUR_AUTH_TOKEN',
        //     },
        //   }
        // );

        // if (!response.ok) {
        //   throw new Error('Failed to fetch orders');
        // }

        // const data = await response.json();

        // Fake delay to simulate network request
        await new Promise(resolve => setTimeout(resolve, 700));

        // Filter mock data based on active tab
        const filteredData = activeTab === 'All'
          ? MOCK_ORDERS
          : MOCK_ORDERS.filter(order => order.status === activeTab);

        // Simulate pagination by slicing the mock array
        const pageSize = 3;
        const paginatedData = filteredData.slice(0, pageNumber * pageSize);

        if (refreshing) {
          setOrders(paginatedData);
        } else {
          setOrders(prev => [...prev, ...paginatedData.slice(prev.length)]);
        }

        setHasMore(paginatedData.length < filteredData.length);
        setPage(pageNumber);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
        if (refreshing) setRefreshing(false);
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
    onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}
  >
    <View style={styles.orderCard}>
      <View style={[styles.statusIndicator, { borderColor: item.statusColor }]} />
      <View style={{ flex: 1 }}>
        <Text style={styles.orderNumber}>Order no : {item.orderNumber}</Text>
        <Text style={styles.dateTime}>
          {item.date} - {item.time}
        </Text>
        <Text style={[styles.statusText, { color: item.statusColor }]}>{item.statusText}</Text>
      </View>
      <View style={styles.priceInfo}>
        <Text>
          Item x {item.itemCount} = <Text style={styles.amount}>${item.amount}</Text>
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);


  return (
    <SafeAreaView style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Error */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={() => fetchOrders(page, true)}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Order List */}
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={renderOrder}
        contentContainerStyle={{ paddingBottom: 50 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading && !refreshing ? <ActivityIndicator size="small" /> : null}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No orders found.</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 60,
    borderBottomWidth: 1,   
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  activeTab: {
    backgroundColor: '#FF6347', // tomato red
    borderColor: '#FF6347',
  },
  tabText: {
    color: '#333',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
  },
  orderCard: {
    flexDirection: 'row',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  statusIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 10,
    borderWidth: 3,
  },
  orderNumber: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 3,
  },
  dateTime: {
    color: '#999',
    fontSize: 13,
    marginBottom: 5,
  },
  statusText: {
    fontWeight: '600',
    fontSize: 14,
  },
  priceInfo: {
    justifyContent: 'center',
  },
  amount: {
    color: '#FF6347',
    fontWeight: '700',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 5,
  },
  retryText: {
    color: '#FF6347',
    fontWeight: '700',
  },
  emptyContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});
