import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LongButton from '../../../components/LongButton';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/navigation';
import { Alert } from 'react-native';


type NavigationProp = StackNavigationProp<RootStackParamList, 'CreateAccount'>;

const { width } = Dimensions.get('window');

const CreateAccountScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isFormValid = 
  name.trim().length > 0 &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
  /^[0-9]{10,15}$/ &&
  password.length >= 6 &&
  password === confirmPassword;

  const validateForm = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10,15}$/;

  if (!name.trim()) {
    Alert.alert('Validation Error', 'Name is required.');
    return false;
  }
  if (!emailRegex.test(email)) {
    Alert.alert('Validation Error', 'Please enter a valid email address.');
    return false;
  }
  if (password.length < 6) {
    Alert.alert('Validation Error', 'Password must be at least 6 characters.');
    return false;
  }
  if (password !== confirmPassword) {
    Alert.alert('Validation Error', 'Passwords do not match.');
    return false;
  }
  return true;
};


  const handleSignUp = () => {

    //  if (!validateForm()) return;
    // TODO: Replace with actual API call
    const payload = {
      name,
      email,
      password,
    };

    console.log('Creating user with data:', payload);
 // Uncomment for real use:
  // try {
  //   const res = await axios.post('https://yourapi/signup', payload);
  //   navigation.navigate('Main');
  // } catch (err) {
  //   Alert.alert('Sign Up Failed', 'Please check your details');
  // }
    // Navigate or show feedback here
    navigation.navigate('PhoneVerification'); // Placeholder
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Create New Account</Text>
        <Text style={styles.subtitle}>Please all details to create new account</Text>

        {/* Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
            <View style={styles.inputRow}>
          <TextInput
              style={[styles.input, { fontWeight: 'bold' }]}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="Ajit"
              autoCapitalize="none"
            />
        </View>
        </View>

        {/* Email */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email ID</Text>
          <View style={styles.inputRow}>
            <TextInput
             style={[styles.input, { fontWeight: 'bold' }]}
              placeholder="email@example.com"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#999"
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {email.includes('@') && <Text style={styles.checkIcon}>✔️</Text>}
          </View>
        </View>

        {/* Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, { fontWeight: 'bold' }]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm Password */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputRow}>
            <TextInput
            style={[styles.input, { fontWeight: 'bold' }]}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Text style={styles.eyeIcon}>{showConfirmPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Up Button */}
            <LongButton
            title="SIGN UP"
            onPress={handleSignUp}
            style={[
                styles.signUpButton,
            ]}
            />


        {/* Already have account? */}
        <View style={styles.signInTextWrapper}>
          <Text style={styles.signInText}>
            Already have an account?{' '}
            <Text
              onPress={() => navigation.navigate('PhoneVerification')}
              style={styles.signInLink}
            >
              Sign In
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 16,
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
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    paddingVertical: 10,
    fontWeight: '500',
  },
  checkIcon: {
    fontSize: 18,
    color: '#FF5A4D',
    marginLeft: 8,
  },
  eyeIcon: {
    fontSize: 18,
    color: '#999',
    marginLeft: 8,
  },
  signUpButton: {
    backgroundColor: '#FF5A4D',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#FF5A4D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  signInTextWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
  signInText: {
    fontSize: 14,
    color: '#333',
  },
  signInLink: {
    color: '#FF5A4D',
    fontWeight: 'bold',
  },
});

export default CreateAccountScreen;
