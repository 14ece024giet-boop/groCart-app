import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/navigation';
import {
  DeliveryOrderDetails,
  fetchDeliveryOrderDetails,
  uploadDeliveryPhoto,
} from '../../../Utility/OrderDetailsApi';
import * as ImagePicker from 'expo-image-picker';
import {
  cancelOrderApi,
  resendOrderOtpApi,
  verifyOrderOtpApi,
} from '../../../Utility/DeliveryPointsApi';

type DeliveryOrderDetailsRouteProp = RouteProp<
  RootStackParamList,
  'DeliveryOrderDetails'
>;

const DeliveryOrderDetailsScreen = () => {
  const route = useRoute<DeliveryOrderDetailsRouteProp>();
  const orderId = route.params.orderId;

  const [orderDetails, setOrderDetails] = useState<DeliveryOrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [resendingOtp, setResendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [otpVerified, setOtpVerified] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [isDelivering, setIsDelivering] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const response = await fetchDeliveryOrderDetails({ orderId });
        if (response.success && response.data) {
          setOrderDetails(response.data);
        } else {
          Alert.alert('Error', response.message || 'Unable to fetch order details.');
        }
      } catch (error: any) {
        Alert.alert('Error', error.message);
      } finally {
        setLoading(false);
      }
    };

    getOrderDetails();
  }, [orderId]);

  // ⏲ Resend cooldown timer
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'Camera access is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  // ✅ OTP verification when 6 digits entered
  const verifyOtp = async (otpCode: string) => {
    if (otpVerified || verifyingOtp) return;

    setVerifyingOtp(true);
    try {
      const response = await verifyOrderOtpApi({ orderId, otpCode });

      if (response.success) {
        Alert.alert('Success', response.message || 'OTP verified');
        setOtpVerified(true);
      } else {
        Alert.alert('Failed', response.message || 'Invalid OTP');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'OTP verification failed');
    } finally {
      setVerifyingOtp(false);
    }
  };

 const handleDelivered = async () => {
  if (!photoUri) {
    Alert.alert('Missing Photo', 'Please upload a delivery photo.');
    return;
  }

  if (!otpVerified) {
    Alert.alert('OTP Not Verified', 'Please verify OTP before delivering.');
    return;
  }

  setIsDelivering(true);
  try {
    const result = await uploadDeliveryPhoto({ orderId, photoUri });

    if (result.success) {
      Alert.alert('Delivery Completed', 'Photo uploaded & delivery marked as completed.');
    } else {
      Alert.alert('Upload Failed', result.message || 'Could not upload image.');
    }
  } catch (error) {
    Alert.alert('Error', 'Something went wrong during delivery submission.');
  } finally {
    setIsDelivering(false);
  }
};

  const handleCancel = async () => {
    Alert.alert(
      'Confirm Cancellation',
      'Are you sure you want to cancel this delivery?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          onPress: async () => {
            setIsCancelling(true);
            try {
              const result = await cancelOrderApi({ orderId });
              if (result.success) {
                Alert.alert('Order Cancelled', 'The order has been successfully cancelled.');
                // Optionally navigate back or update UI
              } else {
                Alert.alert('Cancellation Failed', result.message || 'Could not cancel the order.');
              }
            } catch (error) {
              Alert.alert('Error', 'An unexpected error occurred while cancelling.');
            } finally {
              setIsCancelling(false);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleResendOtp = async () => {
    setResendingOtp(true);
    try {
      const result = await resendOrderOtpApi({ orderId });
      if (result.success) {
        Alert.alert('OTP Sent', 'A new OTP has been sent to the customer.');
        setResendCooldown(30);
      } else {
        Alert.alert('Failed', result.message || 'Could not resend OTP.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend OTP');
    } finally {
      setResendingOtp(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#f33" />
      </View>
    );
  }

  if (!orderDetails) {
    return (
      <View style={styles.centered}>
        <Text>Order details not found.</Text>
      </View>
    );
  }

  const { recipient, deliveryAddress, items, payment } = orderDetails;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Order #{orderDetails.orderId}</Text>
      <Text>Status: {orderDetails.orderStatus}</Text>
      <Text>Placed on: {new Date(orderDetails.orderDate).toLocaleString()}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recipient</Text>
        <Text>Name: {recipient.name}</Text>
        <Text>Contact: {recipient.contactNumber}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <Text>{deliveryAddress.addressLine1}</Text>
        <Text>Room: {deliveryAddress.roomNumber}</Text>
        {deliveryAddress.additionalInstructions && (
          <Text>Instructions: {deliveryAddress.additionalInstructions}</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items</Text>
        {items.map((item, idx) => (
          <View key={idx} style={styles.itemRow}>
            <Text>{item.name}</Text>
            <Text>Qty: {item.quantity}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment</Text>
        <Text>Type: {payment.deliveryType}</Text>
        <Text>Amount to Collect: ${payment.amountToCollect.toFixed(2)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upload Delivery Photo</Text>
        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Take Photo</Text>
        </TouchableOpacity>
        {photoUri && <Image source={{ uri: photoUri }} style={styles.uploadedImage} />}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Enter 6-digit OTP</Text>
        <TextInput
          style={styles.otpInput}
          placeholder="Enter OTP"
          keyboardType="numeric"
          value={otp}
          onChangeText={(text) => {
            const cleaned = text.replace(/[^0-9]/g, '');
            setOtp(cleaned);
            if (cleaned.length === 6) {
              verifyOtp(cleaned);
            }
          }}
          maxLength={6}
        />

        {verifyingOtp && (
          <ActivityIndicator size="small" color="#007BFF" style={{ marginTop: 10 }} />
        )}

        {otpVerified && (
          <Text style={{ color: 'green', marginTop: 10, textAlign: 'center' }}>
            ✅ OTP Verified
          </Text>
        )}
            {!otpVerified && (
        <TouchableOpacity
          onPress={handleResendOtp}
          disabled={resendingOtp || resendCooldown > 0}
        >
          <Text
            style={[
              styles.resendOtp,
              (resendingOtp || resendCooldown > 0) && styles.disabledText,
            ]}
          >
            {resendingOtp
              ? 'Resending...'
              : resendCooldown > 0
              ? `Resend OTP in ${resendCooldown}s`
              : 'Resend OTP'}
          </Text>
        </TouchableOpacity>
)}
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <TouchableOpacity
            style={[
              styles.deliveredButton,
              (!otpVerified || isCancelling) && styles.disabledButton,
            ]}
            onPress={handleDelivered}
            disabled={!otpVerified || isDelivering || isCancelling}
          >
            {isDelivering ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Delivered</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.button}>
          <TouchableOpacity
            style={[styles.cancelButton, isDelivering && styles.disabledButton]}
            onPress={handleCancel}
            disabled={isDelivering || isCancelling}
          >
            {isCancelling ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Cancel</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default DeliveryOrderDetailsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
  },
  section: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 10,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
    marginBottom: 40,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
  },
  deliveredButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  uploadButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  uploadedImage: {
    width: 200,
    height: 200,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 8,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    fontSize: 18,
    marginTop: 10,
    letterSpacing: 10,
    textAlign: 'center',
  },
  resendOtp: {
    marginTop: 10,
    color: '#007BFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  disabledText: {
    color: '#999',
  },
});
