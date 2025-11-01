import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import CryptoJS from 'crypto-js';
import { RootStackParamList } from '../../../navigation/navigation';

type NavigationProp = StackNavigationProp<RootStackParamList, 'QRScanner'>;

const SECRET_KEY = 'your-32-char-long-secret-key!!!!';
const IV = '1234567890ABCDEF';

const QRScannerScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const decryptOrderId = (encrypted: string): string => {
    try {
      const key = CryptoJS.enc.Utf8.parse(SECRET_KEY);
      const iv = CryptoJS.enc.Utf8.parse(IV);
      const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });
      const plaintext = decrypted.toString(CryptoJS.enc.Utf8);
      return plaintext;
    } catch (error) {
      console.error('Decryption failed:', error);
      return '';
    }
  };

  const handleBarcodeScanned = (scanningResult: { data: string }) => {
    if (scanned) return;

    try {
      setScanned(true);
      const decryptedOrderId = decryptOrderId(scanningResult.data);
      if (!decryptedOrderId || isNaN(Number(decryptedOrderId))) {
        throw new Error('Invalid QR code');
      }
      navigation.navigate('DeliveryOrderDetails', {
        orderId: Number(decryptedOrderId),
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to scan QR Code');
      setScanned(false);
    }
  };

  if (!permission) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text>No access to camera. Please allow permission.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView facing = "back"
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={handleBarcodeScanningResult => handleBarcodeScanned(handleBarcodeScanningResult)}
      />
      {scanned && (
        <View style={styles.overlay}>
          <ActivityIndicator color="#fff" size="large" />
          <Text style={styles.scanningText}>Processing...</Text>
        </View>
      )}
    </View>
  );
};

export default QRScannerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
});



export const decryptOrderId = (encrypted: string): string => {
  try {
    const decrypted = CryptoJS.AES.decrypt(encrypted, SECRET_KEY, {
      iv: IV,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

    return plaintext;
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};
