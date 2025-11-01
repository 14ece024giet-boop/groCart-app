import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/navigation';
import { StackNavigationProp } from '@react-navigation/stack';

type OrderConfirmationRouteProp = RouteProp<RootStackParamList, 'OrderConfirmation'>;
type OrderConfirmationNavProp = StackNavigationProp<RootStackParamList>;

const OrderConfirmationScreen = () => {
  const route = useRoute<OrderConfirmationRouteProp>();
  const navigation = useNavigation<OrderConfirmationNavProp>();
  const { qrCodeUrl } = route.params;

useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Main'); // 👈 change to your actual home screen name
    }, 5000); // 5 seconds

    return () => clearTimeout(timer); // cleanup on unmount
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 Order Confirmed!</Text>
      <Text style={styles.subtitle}>Scan this QR code to track your order:</Text>

      {qrCodeUrl ? (
        <Image
          source={{ uri: `data:image/png;base64,${qrCodeUrl}` }}
          style={styles.qrImage}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.errorText}>QR code not available</Text>
      )}
    </View>
  );
};

export default OrderConfirmationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  qrImage: {
    width: 250,
    height: 250,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});
