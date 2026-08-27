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
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { RootStackParamList } from '../../navigation/navigation';
import { useNavigation } from '@react-navigation/native';
import { sendOtpApi, verifyOtpApi } from '../../Utility/api';
import { useDispatch } from 'react-redux';
import { fetchAndHydrateServerCart, resetCartOnLogout } from '../../store/slices/cartSlice';
import { fetchAndHydrateServerWishlist } from '../../store/slices/favoritesSlice';
import { useToast } from '../../components/Toast/ToastContext';

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
  const { showToast } = useToast();

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
        const response = await verifyOtpApi(phone, '000000');
        if (response.success) {
          showToast('Welcome back! Signed in successfully.', 'success');
          dispatch(resetCartOnLogout());
          dispatch(fetchAndHydrateServerCart() as any);
          dispatch(fetchAndHydrateServerWishlist() as any);
          navigation.navigate('Main');
        } else {
          showToast(response.message || 'Unable to log in', 'error');
        }
      } catch (error: any) {
        const status = error?.response?.status;
        const serverMessage =
          error?.response?.data?.message ||
          error?.message ||
          'An error occurred during login.';

        if (
          status === 404 ||
          serverMessage.toLowerCase().includes('not found') ||
          serverMessage.toLowerCase().includes('create an account')
        ) {
          // Sleek Non-Blocking Floating Toast Notification
          showToast(
            `User not found. Please check your mobile number (+91 ${phone}) or create a new township account below.`,
            'warning',
            4500
          );
        } else {
          showToast(serverMessage, 'error');
        }
      } finally {
        setIsSendingOtp(false);
      }
    } else {
      showToast('Please enter a valid 10-digit mobile number.', 'warning');
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
          showToast('OTP verified! Access granted.', 'success');
          dispatch(resetCartOnLogout());
          dispatch(fetchAndHydrateServerCart() as any);
          dispatch(fetchAndHydrateServerWishlist() as any);
          navigation.navigate('Main');
        } else {
          showToast(response.message || 'Invalid OTP code', 'error');
        }
      } catch (error: any) {
        const serverMessage =
          error?.response?.data?.message ||
          error?.message ||
          'An error occurred during OTP verification.';
        showToast(serverMessage, 'error');
      } finally {
        setIsVerifyingOtp(false);
      }
    } else {
      showToast('Please enter the complete 6-digit verification code.', 'warning');
    }
  };

  const handleResend = async () => {
    setTimer(60);
    setOtp(new Array(6).fill(''));
    inputs.current[0]?.focus();
    try {
      await sendOtpApi(phone);
      showToast('A new verification code has been sent to your phone.', 'info');
    } catch (error) {
      showToast('Failed to resend verification code.', 'error');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Form Card */}
          <View style={styles.formCard}>
            {!showOtpInput ? (
              <>
                <Text style={styles.formTitle}>Resident Mobile Sign In</Text>
                <Text style={styles.formSubtitle}>
                  Enter your registered 10-digit mobile number to access your township account.
                </Text>

                {/* Country Code + Mobile Input */}
                <Text style={styles.inputLabel}>Mobile Phone Number *</Text>
                <View style={styles.phoneInputRow}>
                  <View style={styles.countryCodeBox}>
                    <Text style={styles.flagIcon}>🇮🇳</Text>
                    <Text style={styles.countryCodeText}>+91</Text>
                  </View>

                  <TextInput
                    style={styles.phoneInput}
                    placeholder="98765 43210"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ''))}
                  />

                  {phone.length === 10 && (
                    <View style={styles.checkBadge}>
                      <Text style={styles.checkBadgeIcon}>✓</Text>
                    </View>
                  )}
                </View>

                {/* Sign In CTA */}
                <TouchableOpacity
                  style={[styles.primaryBtn, isSendingOtp && { opacity: 0.7 }]}
                  onPress={handleNext}
                  disabled={isSendingOtp}
                  activeOpacity={0.9}
                >
                  {isSendingOtp ? (
                    <ActivityIndicator color="#FACC15" />
                  ) : (
                    <Text style={styles.primaryBtnText}>SIGN IN TO TOWNSHIP MALL →</Text>
                  )}
                </TouchableOpacity>

                {/* Prominent Eye-Catching Create Township Account Banner */}
                <TouchableOpacity
                  style={styles.createAccountCard}
                  onPress={() => navigation.navigate('CreateAccount')}
                  activeOpacity={0.85}
                >
                  <View style={styles.createAccountLeft}>
                    <View style={styles.createAccountIconBadge}>
                      <Text style={styles.createAccountIcon}>✨</Text>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.createAccountSub}>New Resident Registration</Text>
                      <Text style={styles.createAccountTitle}>Create Township Account →</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.formTitle}>Verify Security Code</Text>
                <Text style={styles.formSubtitle}>
                  Enter the 6-digit code sent via SMS to <Text style={{ color: '#0F172A', fontWeight: '800' }}>+91 {phone}</Text>
                </Text>

                {/* 6-Digit OTP Boxes */}
                <View style={styles.otpContainer}>
                  {[...Array(6)].map((_, idx) => (
                    <TextInput
                      key={idx}
                      ref={(el) => {
                        inputs.current[idx] = el;
                      }}
                      style={[
                        styles.otpInput,
                        otp[idx] ? styles.otpInputFilled : null,
                      ]}
                      value={otp[idx]}
                      onChangeText={(text) => handleOtpChange(text, idx)}
                      maxLength={1}
                      keyboardType="number-pad"
                      returnKeyType="done"
                      autoFocus={idx === 0}
                    />
                  ))}
                </View>

                {/* Verify CTA */}
                <TouchableOpacity
                  style={[
                    styles.primaryBtn,
                    { opacity: otp.some((d) => d === '') || isVerifyingOtp ? 0.6 : 1 },
                  ]}
                  disabled={otp.some((d) => d === '') || isVerifyingOtp}
                  onPress={handleVerify}
                  activeOpacity={0.9}
                >
                  {isVerifyingOtp ? (
                    <ActivityIndicator color="#FACC15" />
                  ) : (
                    <Text style={styles.primaryBtnText}>VERIFY & ACCESS ACCOUNT →</Text>
                  )}
                </TouchableOpacity>

                {/* Resend Timer */}
                <Text style={styles.timerText}>
                  Resend Security Code in 00:{timer < 10 ? `0${timer}` : timer}
                </Text>
                {timer === 0 && (
                  <TouchableOpacity onPress={handleResend} style={{ marginTop: 8 }}>
                    <Text style={styles.resendText}>Resend Security Code</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  formSubtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
    marginRight: 10,
  },
  flagIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  countryCodeText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 14,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  checkBadge: {
    position: 'absolute',
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadgeIcon: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  primaryBtn: {
    backgroundColor: '#0F172A',
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 16,
  },
  primaryBtnText: {
    color: '#FACC15',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  createAccountCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    marginTop: 4,
  },
  createAccountLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  createAccountIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  createAccountIcon: {
    fontSize: 16,
  },
  createAccountSub: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  createAccountTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 1,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    width: 44,
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#F8FAFC',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },
  otpInputFilled: {
    borderColor: '#059669',
    backgroundColor: '#ECFDF5',
  },
  timerText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '600',
  },
  resendText: {
    color: '#059669',
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 13,
  },
});

export default SignInScreen;
