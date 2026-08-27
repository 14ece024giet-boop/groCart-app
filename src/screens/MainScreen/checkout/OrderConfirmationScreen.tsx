import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  BackHandler,
} from 'react-native';
import { RouteProp, useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/navigation';

type OrderConfirmationRouteProp = RouteProp<RootStackParamList, 'OrderConfirmation'>;

const OrderConfirmationScreen = () => {
  const route = useRoute<OrderConfirmationRouteProp>();
  const navigation = useNavigation<any>();
  const { qrCodeUrl } = route.params || {};

  const handleGoHome = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  }, [navigation]);

  // Intercept hardware/system back button to reset to Home Screen
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        handleGoHome();
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [handleGoHome])
  );

  const getQrImageUri = (code?: string) => {
    if (!code) {
      return 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=GROCART-ORDER-CONFIRMED&margin=10';
    }
    if (code.startsWith('http://') || code.startsWith('https://')) {
      return code;
    }
    if (code.startsWith('data:image')) {
      return code;
    }
    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(code)}&margin=10`;
  };

  const qrUri = getQrImageUri(qrCodeUrl);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Animated Badge */}
        <View style={styles.successBadgeContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <Text style={styles.checkMark}>✓</Text>
            </View>
          </View>
        </View>

        {/* Title & Subtitle */}
        <Text style={styles.title}>🎉 Order Placed Successfully!</Text>
        <Text style={styles.subtitle}>
          Your order has been dispatched via Campus Express Delivery.
        </Text>

        {/* Township Express Live Delivery Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <Text style={styles.statusHeaderIcon}>⚡</Text>
            <Text style={styles.statusHeaderTitle}>10-15 MIN CAMPUS EXPRESS</Text>
          </View>

          {/* Delivery Stepper */}
          <View style={styles.stepperContainer}>
            <View style={styles.stepRow}>
              <View style={[styles.stepDot, styles.activeStepDot]}>
                <Text style={styles.stepDotCheck}>✓</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>Order Received & Confirmed</Text>
                <Text style={styles.stepSub}>Items packed at Township Central Store</Text>
              </View>
            </View>

            <View style={styles.stepConnector} />

            <View style={styles.stepRow}>
              <View style={[styles.stepDot, styles.activeStepDot]}>
                <Text style={styles.stepDotCheck}>⚡</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>Out for Express Delivery</Text>
                <Text style={styles.stepSub}>Rider en-route to your Quarter / Flat</Text>
              </View>
            </View>

            <View style={styles.stepConnectorIncomplete} />

            <View style={styles.stepRow}>
              <View style={styles.stepDotIncomplete}>
                <Text style={styles.stepDotNumber}>3</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitleIncomplete}>Doorstep Delivery</Text>
                <Text style={styles.stepSub}>Show QR for instant handover</Text>
              </View>
            </View>
          </View>
        </View>

        {/* QR Code Verification Card */}
        <View style={styles.qrCard}>
          <Text style={styles.qrCardTitle}>Rider Verification QR Code</Text>
          <Text style={styles.qrCardSub}>
            Show this QR code to your township rider upon arrival for instant verification & UPI payment.
          </Text>

          <View style={styles.qrFrame}>
            <Image
              source={{ uri: qrUri }}
              style={styles.qrImage}
              resizeMode="contain"
            />
          </View>

          {/* Verification Code Display */}
          {qrCodeUrl ? (
            <View style={styles.tokenBox}>
              <Text style={styles.tokenLabel}>VERIFICATION TOKEN</Text>
              <Text style={styles.tokenText}>{qrCodeUrl}</Text>
            </View>
          ) : null}

          <View style={styles.qrBadge}>
            <Text style={styles.qrBadgeText}>🛡️ SECURED TOWNSHIP DELIVERY</Text>
          </View>
        </View>

        {/* Primary Action Buttons */}
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={handleGoHome}
          activeOpacity={0.9}
        >
          <Text style={styles.homeBtnText}>Back to Township HyperMarket →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 45,
    paddingBottom: 40,
    alignItems: 'center',
  },
  successBadgeContainer: {
    marginBottom: 16,
  },
  outerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  innerCircle: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  checkMark: {
    fontSize: 34,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  statusCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    marginBottom: 16,
  },
  statusHeaderIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  statusHeaderTitle: {
    color: '#FACC15',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  stepperContainer: {
    paddingLeft: 6,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeStepDot: {
    backgroundColor: '#059669',
  },
  stepDotCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  stepDotIncomplete: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotNumber: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '800',
  },
  stepInfo: {
    marginLeft: 12,
    flex: 1,
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  stepSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  stepTitleIncomplete: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
  },
  stepConnector: {
    width: 2,
    height: 20,
    backgroundColor: '#059669',
    marginLeft: 12,
    marginVertical: 2,
  },
  stepConnectorIncomplete: {
    width: 2,
    height: 20,
    backgroundColor: '#CBD5E1',
    marginLeft: 12,
    marginVertical: 2,
  },
  qrCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  qrCardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 4,
  },
  qrCardSub: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 14,
    paddingHorizontal: 10,
  },
  qrFrame: {
    width: 200,
    height: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderWidth: 2,
    borderColor: '#0F172A',
    marginBottom: 12,
  },
  qrImage: {
    width: '100%',
    height: '100%',
  },
  fallbackQrBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackQrIcon: {
    fontSize: 48,
    marginBottom: 6,
  },
  fallbackQrText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  tokenBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  tokenLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  tokenText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1,
    marginTop: 2,
  },
  qrBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  qrBadgeText: {
    color: '#047857',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  homeBtn: {
    width: '100%',
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  homeBtnText: {
    color: '#FACC15',
    fontWeight: '900',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});
