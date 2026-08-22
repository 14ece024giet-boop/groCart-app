import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RootStackParamList } from '../../navigation/navigation';
import { useNavigation } from '@react-navigation/native';
import { sendOtpApi, verifyOtpApi } from '../../Utility/api';
import { useDispatch } from 'react-redux';
import { fetchAndHydrateServerCart } from '../../store/slices/cartSlice';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const SignInScreen = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [timer, setTimer] = useState(60);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const inputs = useRef<Array<TextInput | null>>([]);
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (showOtpInput && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpInput, timer]);

  const handleNext = async () => {
    if (phone.length === 10) {
      setIsSendingOtp(true);
      try {
        // OTP bypassed for testing — directly login with dummy OTP
        const response = await verifyOtpApi(phone, '000000');
        if (response.success) {
          dispatch(fetchAndHydrateServerCart() as any);
          navigation.navigate('Main');
        } else {
          Alert.alert('Error', response.message || 'Login failed');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred during login.');
        console.error(error);
      } finally {
        setIsSendingOtp(false);
      }
    } else {
      Alert.alert('Invalid Input', 'Please enter a valid 10-digit phone number.');
    }
  };

  const handleOtpChange = (text: string, index: number) => {
    const newDigit = text.length > 1 ? text.slice(-1) : text;

    if (/^\d*$/.test(newDigit)) {
      const newOtp = [...otp];
      newOtp[index] = newDigit;
      setOtp(newOtp);

      if (newDigit && index < 5) {
        inputs.current[index + 1]?.focus();
      }
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length === 6) {
      setIsVerifyingOtp(true);
      try {
        const response = await verifyOtpApi(phone, enteredOtp);
        if (response.success) {
          dispatch(fetchAndHydrateServerCart() as any);
          navigation.navigate('Main');
        } else {
          Alert.alert('Verification Failed', response.message || 'Invalid OTP');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred during OTP verification.');
        console.error(error);
      } finally {
        setIsVerifyingOtp(false);
      }
    } else {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP.');
    }
  };

  const handleResend = async () => {
    setTimer(60);
    setOtp(new Array(6).fill(''));
    inputs.current[0]?.focus();
    try {
      await sendOtpApi(phone);
      Alert.alert('Success', 'A new OTP has been sent.');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend OTP.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {!showOtpInput ? (
        <>
          <Text style={styles.title}>Your Mobile Number</Text>
          <Text style={styles.subtitle}>
            We will send an SMS with a confirmation code to this number
          </Text>
          <TextInput
            style={styles.phoneInput}
            placeholder="+91 99999XXXXX"
            keyboardType="phone-pad"
            maxLength={10}
            value={phone}
            onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
            autoFocus
          />
          <TouchableOpacity style={styles.nextButton} onPress={handleNext} disabled={isSendingOtp}>
            {isSendingOtp ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.nextButtonText}>NEXT</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.signUpContainer}
            onPress={() => navigation.navigate('CreateAccount')}
          >
            <Text style={styles.signUpText}>
              Don't have an account? <Text style={styles.signUpLink}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.title}>Verify Account</Text>
          <Text style={styles.subtitle}>
            Please type the verification code sent to +91 {phone}
          </Text>
          <View style={styles.otpContainer}>
            {[...Array(6)].map((_, idx) => (
              <TextInput
                key={idx}
                ref={(el) => {
                  inputs.current[idx] = el;
                }}
                style={styles.otpInput}
                value={otp[idx]}
                onChangeText={(text) => handleOtpChange(text, idx)}
                maxLength={1}
                keyboardType="number-pad"
                returnKeyType="done"
                autoFocus={idx === 0}
              />
            ))}
          </View>
          <TouchableOpacity
            style={[
              styles.verifyButton,
              { opacity: otp.some((d) => d === '') || isVerifyingOtp ? 0.5 : 1 },
            ]}
            disabled={otp.some((d) => d === '') || isVerifyingOtp}
            onPress={handleVerify}
          >
            {isVerifyingOtp ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.verifyButtonText}>VERIFY ACCOUNT</Text>
            )}
          </TouchableOpacity>
          <Text style={styles.timerText}>
            Resend Code in : 00:{timer < 10 ? `0${timer}` : timer}
          </Text>
          {timer === 0 && (
            <TouchableOpacity onPress={handleResend}>
              <Text style={styles.resendText}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </>
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
  phoneInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 18,
    marginBottom: 32,
    color: '#222',
  },
  nextButton: {
    backgroundColor: '#FF5A4D',
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpInput: {
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
    marginBottom: 16,
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timerText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  resendText: {
    color: '#FF5A4D',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 8,
  },
  signUpContainer: {
    marginTop: 32,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#222',
  },
  signUpLink: {
    color: '#FF5A4D',
    fontWeight: 'bold',
  },
});

export default SignInScreen;
