import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import CryptoJS from 'crypto-js';
import { DECRYPTION_IV, DECRYPTION_SECRET_KEY } from '../../../Utility/cryptoConfig';
import { RootStackParamList } from '../../../navigation/navigation';

type NavigationProp = StackNavigationProp<RootStackParamList, 'QRScanner'>;

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
      const key = CryptoJS.enc.Utf8.parse(DECRYPTION_SECRET_KEY);
      const iv = CryptoJS.enc.Utf8.parse(DECRYPTION_IV);
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
    setScanned(true);
    try {
      const decryptedOrderId = decryptOrderId(scanningResult.data);
      if (!decryptedOrderId || isNaN(Number(decryptedOrderId))) {
        throw new Error('Invalid QR code');
      }

      navigation.navigate('DeliveryOrderDetails', {
        orderId: Number(decryptedOrderId),
      });
    } catch (error: any) {
      Alert.alert('Scan Failed', error.message || 'Could not read the QR Code.', [
        { text: 'Scan Again', onPress: () => setScanned(false) },
      ]);
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
        onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
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
