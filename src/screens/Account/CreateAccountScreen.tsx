import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/navigation';
import { useToast } from '../../components/Toast/ToastContext';

type NavigationProp = StackNavigationProp<RootStackParamList, 'CreateAccount'>;

const CreateAccountScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isPasswordAlphanumeric = (pwd: string) => {
    const hasLetter = /[a-zA-Z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    return pwd.length >= 6 && hasLetter && hasNumber;
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!name.trim()) {
      showToast('Please enter your full name.', 'warning');
      return false;
    }
    if (!phoneRegex.test(phoneNumber.replace(/[^0-9]/g, ''))) {
      showToast('Please enter a valid 10-digit mobile number.', 'warning');
      return false;
    }
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.', 'warning');
      return false;
    }

    // Client-Side Alphanumeric Password Enforcement
    if (password.length < 6) {
      showToast('Password must be at least 6 characters long.', 'warning');
      return false;
    }

    if (!isPasswordAlphanumeric(password)) {
      showToast(
        'Password must contain both letters and numbers (e.g. Rahul123).',
        'warning',
        4000
      );
      return false;
    }

    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'warning');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { registerApi } = require('../../Utility/api');
      const response = await registerApi(
        {
          Name: name.trim(),
          Email: email.trim(),
          PhoneNumber: phoneNumber.replace(/[^0-9]/g, ''),
          Password: password,
        },
        '000000'
      );

      if (response.success) {
        showToast('Welcome to groCart! Your account has been created.', 'success');
        navigation.navigate('Main');
      } else {
        showToast(response.message || 'Registration failed.', 'error');
      }
    } catch (error: any) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.message ||
        'An error occurred during registration.';

      if (serverMessage.toLowerCase().includes('already exists')) {
        showToast('An account already exists with this phone. Please sign in.', 'warning', 4000);
      } else {
        showToast(serverMessage, 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        {/* Top Header Bar */}
        <View style={styles.topHeaderBar}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Text style={styles.headerBackIcon}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Create Resident Account</Text>

          <View style={styles.speedPill}>
            <Text style={styles.speedPillText}>⚡ 10-15 MIN</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>New Resident Registration</Text>
            <Text style={styles.formSubtitle}>
              Create your account to enjoy instant campus express delivery to your township quarter.
            </Text>

            {/* Name */}
            <Text style={styles.label}>Full Name *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChangeText={setName}
                placeholderTextColor="#94A3B8"
              />
              {name.trim().length > 2 && <Text style={styles.checkIcon}>✓</Text>}
            </View>

            {/* Mobile Phone */}
            <Text style={styles.label}>Mobile Phone Number *</Text>
            <View style={styles.phoneInputRow}>
              <View style={styles.countryCodeBox}>
                <Text style={styles.flagIcon}>🇮🇳</Text>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>

              <TextInput
                style={styles.phoneInput}
                placeholder="98765 43210"
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ''))}
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                maxLength={10}
              />

              {phoneNumber.length === 10 && (
                <View style={styles.checkBadge}>
                  <Text style={styles.checkBadgeIcon}>✓</Text>
                </View>
              )}
            </View>

            {/* Email */}
            <Text style={styles.label}>Corporate Email Address *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="resident@township.com"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#94A3B8"
                autoCapitalize="none"
                keyboardType="email-address"
              />
              {email.includes('@') && <Text style={styles.checkIcon}>✓</Text>}
            </View>

            {/* Password */}
            <Text style={styles.label}>Account Password * (Alphanumeric)</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Letters & numbers (e.g. Pass123)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#94A3B8"
              />
              {isPasswordAlphanumeric(password) && (
                <Text style={[styles.checkIcon, { marginRight: 6 }]}>✓</Text>
              )}
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <Text style={styles.label}>Confirm Password *</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Re-enter password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#94A3B8"
              />
              {confirmPassword.length >= 6 && confirmPassword === password && (
                <Text style={[styles.checkIcon, { marginRight: 6 }]}>✓</Text>
              )}
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Text style={styles.eyeIcon}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up CTA Button */}
            <TouchableOpacity
              style={[styles.primaryBtn, isLoading && { opacity: 0.7 }]}
              onPress={handleSignUp}
              disabled={isLoading}
              activeOpacity={0.9}
            >
              {isLoading ? (
                <ActivityIndicator color="#FACC15" />
              ) : (
                <Text style={styles.primaryBtnText}>CREATE RESIDENT ACCOUNT →</Text>
              )}
            </TouchableOpacity>

            {/* Already have account? */}
            <TouchableOpacity
              style={styles.signInTextWrapper}
              onPress={() => navigation.navigate('SignIn')}
              activeOpacity={0.8}
            >
              <Text style={styles.signInText}>
                Already have an account? <Text style={styles.signInLink}>Sign In →</Text>
              </Text>
            </TouchableOpacity>
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
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 45,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  headerBackIcon: {
    fontSize: 18,
    color: '#0F172A',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  speedPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  speedPillText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '900',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
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
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  checkIcon: {
    fontSize: 16,
    color: '#059669',
    fontWeight: '900',
  },
  eyeIcon: {
    fontSize: 16,
    color: '#64748B',
    paddingLeft: 6,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginRight: 10,
  },
  flagIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 14,
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
    marginTop: 8,
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
  signInTextWrapper: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  signInText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  signInLink: {
    color: '#0F172A',
    fontWeight: '900',
  },
});

export default CreateAccountScreen;
