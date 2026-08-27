import axios from 'axios';
import { getAuthTokens } from './tokenStorage';
import Constants from 'expo-constants';

// Multi-environment API Resolver (Dev, UAT, Production)
const getApiBaseUrl = (): string => {
  // 1. Check Expo Public Environment Variable (EAS Build / .env)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Check app.json extra config
  const extraApiUrl = Constants.expoConfig?.extra?.apiUrl;
  if (extraApiUrl) {
    return extraApiUrl;
  }

  // 3. Default fallback for Local Dev
  return 'http://10.90.245.207:5000/api';
};

export const BASE_URL = getApiBaseUrl();

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getAuthHeaders = async () => {
  const headers: { 'Content-Type': string; Authorization?: string } = {
    'Content-Type': 'application/json',
  };

  try {
    const tokens = await getAuthTokens();
    if (tokens?.accessToken) {
      headers.Authorization = `Bearer ${tokens.accessToken}`;
    }
  } catch (error) {
    console.error('Error getting auth tokens:', error);
  }

  return headers;
};