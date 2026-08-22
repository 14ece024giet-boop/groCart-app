// screens/test/TestQRScannerButtonScreen.tsx
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/navigation';

type NavigationProp = StackNavigationProp<RootStackParamList, 'TestQRScannerButtonScreen'>;

const TestQRScannerButtonScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const goToQRScanner = () => {
    navigation.navigate('QRScanner');
      //  navigation.navigate('DeliveryOrderDetails', {
      //   orderId: Number(51),

      // })
  };

  return (
    <View style={styles.container}>
      <Button title="Open QR Scanner" onPress={goToQRScanner} />
    </View>
  );
};

export default TestQRScannerButtonScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
