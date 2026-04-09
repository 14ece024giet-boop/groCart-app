import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';
import * as Keychain from 'react-native-keychain';
export const BASE_URL = 'http://10.247.255.207:5000/api';

export const SECRET_KEY = CryptoJS.enc.Utf8.parse('your-32-char-long-secret-key!!!!');
export const IV = CryptoJS.enc.Utf8.parse('1234567890ABCDEF');


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


export const getAuthHeaders = async () => {
  try {
    const tokenData = await AsyncStorage.getItem('authTokens');
    if (tokenData) {
      const { accessToken } = JSON.parse(tokenData);
      return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      };
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
  }

  return {
    'Content-Type': 'application/json',
  };
};

// export const BASE_URL = 'http://192.168.1.3:5081/api';
// http://10.216.7.207:5000/api/auth/send-otp