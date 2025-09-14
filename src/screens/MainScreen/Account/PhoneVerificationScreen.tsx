import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/navigation';
import LongButton from '../../../components/LongButton';
import { Alert } from 'react-native/Libraries/Alert/Alert';
import { sendOtpApi } from '../../../Utility/api';

type NavigationProp = StackNavigationProp<RootStackParamList, 'PhoneVerification'>;

const PhoneVerificationScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [phone, setPhone] = useState('');

  const isValidPhone = phone.length === 10;

  const handleNext = async () => {
      if (phone.length === 10) {
         navigation.navigate('OtpVerification', { phoneNumber: phone });

         try {
        // const response = await sendOtpApi(phone);
        // if (response.success) {
        //  navigation.navigate('OtpVerification', { phoneNumber: phone });
        // } else {
        //   alert('Failed to send OTP');
        // }
      } catch (error) {
        alert('Error sending OTP');
        console.error(error);
      }
    } else {
      alert('Enter valid 10 digit phone number');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backArrow}>{'<'}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Your Mobile Number  IS </Text>
      <Text style={styles.subtitle}>
        We will send an SMS with a confirmation{'\n'}code to this number
      </Text>

      <Text style={styles.label}>Phone Number</Text>
      <View style={styles.inputRow}>
        <Text style={styles.countryCode}>+91</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          keyboardType="number-pad"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
          placeholderTextColor="#b0b0b0"
        />
      </View>

      <LongButton
        title="NEXT"
        onPress={handleNext}
        disabled={!isValidPhone}
        style={[
          styles.nextButton,
          { opacity: isValidPhone ? 1 : 0.4 },
        ]}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
  },
  backArrow: {
    fontSize: 28,
    color: '#222',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 40,
    lineHeight: 22,
  },
  label: {
    fontSize: 13,
    color: '#999',
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginBottom: 32,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    paddingVertical: 10,
  },
  nextButton: {
    backgroundColor: '#FF5A4D',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#FF5A4D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default PhoneVerificationScreen;
