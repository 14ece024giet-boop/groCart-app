import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';

const STEPS = ['Pending', 'Confirmed', 'Picked', 'Shipped', 'Delivered'];

const TIMELINE = [
  { time: '08 May 09:43 AM', text: 'Order no. #876543 was confirmed, please check your account' },
  { time: '09 May 10:00 AM', text: 'Order no. #876543 was picked, please check your State' },
  { time: '09 May 10:34 AM', text: 'Order no. #876543 was shipped in your nearest delivery area.' },
  { time: '10 May 08:21 AM', text: 'Package has been delivered.' },
];

export default function OrderTrackingScreen() {
  const currentStep = 4; // 0-based index for "Delivered"

  // Horizontal stepper render
  const renderStep = (step: string, index: number) => {
    const isActive = index < currentStep;
    const isCurrent = index === currentStep;

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
                index < currentStep - 1 ? styles.activeLine : styles.inactiveLine,
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
  const renderTimelineItem = ({ item, index }: { item: typeof TIMELINE[0]; index: number }) => {
    const isLastItem = index === TIMELINE.length - 1;
    const isActiveStep = index < currentStep;

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
                index < currentStep - 1 ? styles.timelineLineActive : styles.timelineLineInactive,
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Horizontal Stepper */}
      <View style={styles.stepperContainer}>
        {STEPS.map((step, idx) => renderStep(step, idx))}
      </View>

      {/* Order Process Header */}
      <Text style={styles.orderProcessHeader}>Order Process</Text>

      {/* Vertical Timeline */}
      <FlatList
        data={TIMELINE}
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
