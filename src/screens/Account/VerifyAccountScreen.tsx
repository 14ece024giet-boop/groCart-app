// import React, { useRef, useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform,
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { StackNavigationProp } from '@react-navigation/stack';
// import { RootStackParamList } from '../../../types/navigation';
// import LongButton from '../../../components/LongButton';

// type NavigationProp = StackNavigationProp<RootStackParamList, 'OtpVerification'>;

// const VerifyAccountScreen = () => {
//   const navigation = useNavigation<NavigationProp>();
//   const [otp, setOtp] = useState(['', '', '', '']);
//   const [timer, setTimer] = useState(60);

//   const inputs = useRef<Array<TextInput | null>>([]);

//   useEffect(() => {
//     if (timer === 0) return;
//     const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
//     return () => clearInterval(interval);
//   }, [timer]);

//   const handleChange = (text: string, index: number) => {
//     if (/^\d?$/.test(text)) {
//       const newOtp = [...otp];
//       newOtp[index] = text;
//       setOtp(newOtp);

//       // Move to next input
//       if (text && index < 3) {
//         inputs.current[index + 1]?.focus();
//       }
//     }
//   };

//   const handleKeyPress = (e: any, index: number) => {
//     if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
//       inputs.current[index - 1]?.focus();
//     }
//   };

//   const isOtpComplete = otp.every((digit) => digit !== '');

//   const handleVerify = () => {
//     const code = otp.join('');
//     console.log('Verifying code:', code);

//     // TODO: Replace with real API call
//     navigation.navigate('Main'); // or any post-verification screen
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
//         <Text style={styles.backArrow}>{'<'}</Text>
//       </TouchableOpacity>

//       <Text style={styles.title}>Verify Account</Text>
//       <Text style={styles.subtitle}>
//         Please type the verification code sent{'\n'}to +91 99999XXXXX
//       </Text>

//       <View style={styles.otpContainer}>
//         {[0, 1, 2, 3].map((i) => (
//           <TextInput
//             key={i}
//             ref={(ref) => (inputs.current[i] = ref)}
//             style={styles.otpInput}
//             keyboardType="number-pad"
//             maxLength={1}
//             value={otp[i]}
//             onChangeText={(text) => handleChange(text, i)}
//             onKeyPress={(e) => handleKeyPress(e, i)}
//             autoFocus={i === 0}
//           />
//         ))}
//       </View>

//       <LongButton
//         title="VERIFY ACCOUNT"
//         onPress={handleVerify}
//         disabled={!isOtpComplete}
//         style={[styles.verifyButton, { opacity: isOtpComplete ? 1 : 0.4 }]}
//       />

//       <Text style={styles.timerText}>
//         Resend Code in : 00:{timer < 10 ? `0${timer}` : timer}s
//       </Text>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingHorizontal: 24,
//     paddingTop: 60,
//     alignItems: 'center',
//   },
//   backButton: {
//     position: 'absolute',
//     top: 48,
//     left: 16,
//   },
//   backArrow: {
//     fontSize: 28,
//     color: '#222',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#222',
//     marginBottom: 6,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: '#888',
//     textAlign: 'center',
//     marginBottom: 36,
//     lineHeight: 22,
//   },
//   otpContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     width: '80%',
//     marginBottom: 32,
//   },
//   otpInput: {
//     width: 50,
//     height: 60,
//     borderWidth: 1,
//     borderColor: '#eee',
//     textAlign: 'center',
//     fontSize: 24,
//     fontWeight: 'bold',
//     borderRadius: 8,
//     color: '#222',
//   },
//   verifyButton: {
//     backgroundColor: '#FF5A4D',
//     paddingVertical: 14,
//     borderRadius: 8,
//     width: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#FF5A4D',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//     marginBottom: 20,
//   },
//   timerText: {
//     fontSize: 13,
//     color: '#888',
//   },
// });

// export default VerifyAccountScreen;
