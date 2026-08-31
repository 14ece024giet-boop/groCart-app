import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigation';
import MultiTaskButton from '../../components/Components/shared/MultiTaskButton';
import { registerApi, sendOtpApi, verifyOtpApi } from '../../Utility/api';

type NavigationProp = StackNavigationProp<RootStackParamList, 'OtpVerification'>;
type OtpVerificationRouteProp = RouteProp<RootStackParamList, 'OtpVerification'>;

const OtpVerificationScreen = ({
  route,
}: {
  route: OtpVerificationRouteProp;
}) => {
  const navigation = useNavigation<NavigationProp>();
  const [code, setCode] = useState(new Array(6).fill(''));
  const [timer, setTimer] = useState(60);

  const inputs = useRef<Array<TextInput | null>>([]);
  const { phoneNumber, userData } = route?.params || {};
  const phone = phoneNumber || userData?.PhoneNumber || '';

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otp = code.join('');
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code.');
      return;
    }

    try {
      let response;
      if (userData) {
        response = await registerApi(userData, otp);
      } else {
        response = await verifyOtpApi(phone, otp);
      }

      if (response.success) {
        Alert.alert('Success', response.message || 'Verification successful!');
        navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
      } else {
        Alert.alert('Failed', response.message || 'Invalid OTP or user data.');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred during verification.');
    }
  };

  const handleResend = async () => {
    setTimer(60);
    setCode(new Array(6).fill(''));
    inputs.current[0]?.focus();
    try {
      await sendOtpApi(phone);
      Alert.alert('Success', 'A new OTP has been sent.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP.');
      console.error('Resend OTP error:', error);
    }
  };

  const fillOtp = (otpString: string) => {
    const otpArray = otpString.split('');
    const sliced = otpArray.slice(0, 6);
    setCode(sliced);
    sliced.forEach((digit, i) => {
      if (inputs.current[i]) {
        inputs.current[i]?.setNativeProps({ text: digit });
      }
    });
    inputs.current[5]?.focus();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Text style={styles.backArrow}>{'<'}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Verify Account</Text>
      <Text style={styles.subtitle}>
        Please type the verification code sent{'\n'}to +91 {phone}
      </Text>

      {/* ✅ Hidden input for autofill */}
      <TextInput
        style={{ height: 0, width: 0, opacity: 0, position: 'absolute' }}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        maxLength={6}
        onChangeText={(code) => {
          if (code.length === 6) {
            fillOtp(code);
          }
        }}
      />

      {/* ✅ Visible OTP inputs */}
      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={`otp-input-${index}`}
           ref={(el: TextInput | null) => {
            inputs.current[index] = el;
            }}
            style={styles.codeInput}
            value={digit}
            onChangeText={(text) => handleChange(text.replace(/[^0-9]/g, ''), index)}
            maxLength={1}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            returnKeyType="next"
            autoFocus={index === 0}
          />
        ))}
      </View>

      <MultiTaskButton
        title="VERIFY ACCOUNT"
        onPress={handleSubmit}
        disabled={code.some((digit) => digit === '')}
        style={[
          styles.verifyButton,
          { opacity: code.some((digit) => digit === '') ? 0.4 : 1 },
        ]}
      />

      <Text style={styles.timerText}>
        Resend Code in : 00:{timer < 10 ? `0${timer}` : timer}
      </Text>
      {timer === 0 && (
        <TouchableOpacity onPress={handleResend}>
          <Text style={styles.resendText}>Resend Code</Text>
        </TouchableOpacity>
      )}
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
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  codeInput: {
    width: 48,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  verifyButton: {
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
  timerText: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 13,
    color: '#999',
  },
  resendText: {
    color: '#FF5A4D',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default OtpVerificationScreen;
