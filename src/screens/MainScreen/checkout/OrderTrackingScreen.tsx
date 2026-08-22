import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/navigation';
import { getOrderTimelineApi, OrderTimeline, TimelineEvent } from '../../../Utility/orderTrackingApi';

const STEPS = ['Pending', 'Confirmed', 'Picked', 'Shipped', 'Delivered'];

type OrderTrackingRouteProp = RouteProp<RootStackParamList, 'OrderTracking'>;

export default function OrderTrackingScreen() {
  const route = useRoute<OrderTrackingRouteProp>();
  const { orderId } = route.params;

  const [timelineData, setTimelineData] = useState<OrderTimeline | null>(null);
  const [loading, setLoading] = useState(true);

  const currentStepIndex = timelineData ? STEPS.indexOf(timelineData.currentStatus) : -1;

  // Horizontal stepper render
  const renderStep = (step: string, index: number) => {
    const isActive = index < currentStepIndex;
    const isCurrent = index === currentStepIndex;

    return (
      <View key={step} style={styles.stepWrapper}>
        <View style={styles.stepCircleWrapper}>
          <View
            style={[
              styles.stepCircle,
              isActive ? styles.activeCircle : styles.inactiveCircle,
              isCurrent && styles.currentCircle,
            ]}
          />
          {/* Line to next step */}
          {index !== STEPS.length - 1 && (
            <View
              style={[
                styles.stepLine,
                index < currentStepIndex - 1 ? styles.activeLine : styles.inactiveLine,
              ]}
            />
          )}
        </View>
        <Text style={[styles.stepLabel, isActive && styles.activeStepLabel]}>
          {step}
        </Text>
      </View>
    );
  };

  // Vertical timeline render
  const renderTimelineItem = ({ item, index }: { item: TimelineEvent; index: number }) => {
    const isLastItem = index === (timelineData?.timeline.length ?? 0) - 1;
    const isActiveStep = index < currentStepIndex;

    return (
      <View style={styles.timelineItem}>
        <View style={styles.timelineMarkerContainer}>
          <View
            style={[
              styles.timelineCircle,
              isActiveStep ? styles.timelineCircleActive : styles.timelineCircleInactive,
            ]}
          />
          {!isLastItem && (
            <View
              style={[
                styles.timelineLine,
                index < currentStepIndex - 1 ? styles.timelineLineActive : styles.timelineLineInactive,
              ]}
            />
          )}
        </View>
        <View style={styles.timelineTextContainer}>
          <Text style={styles.timelineTime}>{item.time}</Text>
          <Text style={styles.timelineText}>{item.text}</Text>
        </View>
      </View>
    );
  };

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const response = await getOrderTimelineApi(orderId);
        if (response.success) {
          setTimelineData(response.data);
        } else {
          Alert.alert('Error', response.message || 'Could not fetch order timeline.');
        }
      } catch (error) {
        Alert.alert('Error', 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, [orderId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={activeColor} />
      </View>
    );
  }

  if (!timelineData) {
    return (
      <View style={styles.centered}>
        <Text>Could not load order details.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Horizontal Stepper */}
      <View style={styles.stepperContainer}>
        {STEPS.map(renderStep)}
      </View>

      {/* Order Process Header */}
      <Text style={styles.orderProcessHeader}>Order Process</Text>

      {/* Vertical Timeline */}
      <FlatList
        data={timelineData.timeline}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={renderTimelineItem}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, styles.cancelButton]}>
          <Text style={styles.cancelButtonText}>CANCELLED</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.notificationButton]}>
          <Text style={styles.notificationButtonText}>NOTIFICATION ACTIVE</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const circleSize = 16;
const activeColor = '#FF6347'; // tomato red

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16, paddingTop: 20 },
  stepperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  stepWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  stepCircleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  stepCircle: {
    width: circleSize,
    height: circleSize,
    borderRadius: circleSize / 2,
    borderWidth: 3,
    backgroundColor: '#fff',
  },
  activeCircle: {
    borderColor: activeColor,
    backgroundColor: activeColor,
  },
  inactiveCircle: {
    borderColor: '#ccc',
  },
  currentCircle: {
    backgroundColor: '#fff',
    borderColor: activeColor,
  },
  stepLabel: {
    marginTop: 6,
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  activeStepLabel: {
    color: activeColor,
    fontWeight: '700',
  },
  stepLine: {
    flex: 1,
    height: 3,
    marginLeft: 8,
    borderRadius: 1.5,
    backgroundColor: '#ccc',
  },
  activeLine: {
    backgroundColor: activeColor,
  },
  inactiveLine: {
    backgroundColor: '#ccc',
  },

  orderProcessHeader: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 12,
  },

  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  timelineMarkerContainer: {
    width: 30,
    alignItems: 'center',
  },
  timelineCircle: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    backgroundColor: '#fff',
    marginBottom: 2,
  },
  timelineCircleActive: {
    borderColor: activeColor,
  },
  timelineCircleInactive: {
    borderColor: '#ccc',
  },
  timelineLine: {
    flex: 1,
    width: 3,
    marginTop: 2,
    backgroundColor: '#ccc',
  },
  timelineLineActive: {
    backgroundColor: activeColor,
  },
  timelineLineInactive: {
    backgroundColor: '#ccc',
  },
  timelineTextContainer: {
    flex: 1,
  },
  timelineTime: {
    color: '#999',
    fontSize: 12,
    marginBottom: 4,
  },
  timelineText: {
    fontWeight: '700',
    fontSize: 14,
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginBottom: 30,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: activeColor,
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    color: activeColor,
    fontWeight: '700',
  },
  notificationButton: {
    backgroundColor: activeColor,
  },
  notificationButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
