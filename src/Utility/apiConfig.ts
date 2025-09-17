import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
export const BASE_URL = 'http://192.168.1.3:5000/api';


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