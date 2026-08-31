import axios from 'axios';
import { getAuthTokens } from './tokenStorage';
import Constants from 'expo-constants';

import { Platform } from 'react-native';

// Multi-environment API Resolver (Dev, UAT, Production)
export function getApiBaseUrl(): string {
  // 1. Explicit override in .env
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // 2. Check app.json extra config
  const extraApiUrl = Constants.expoConfig?.extra?.apiUrl;
  if (extraApiUrl) {
    return extraApiUrl;
  }

  // 3. Dynamic Local Development Resolver (Physical Device + Emulator)
  if (__DEV__) {
    // Automatically extract your PC's IP from the active Metro bundler connection
    const hostUri =
      Constants.expoConfig?.hostUri ||
      (Constants as any).manifest?.debuggerHost ||
      (Constants as any).manifest2?.extra?.expoClient?.hostUri;

    if (hostUri) {
      const hostIp = hostUri.split(':')[0];
      return `http://${hostIp}:5000/api`;
    }

    return Platform.OS === 'android'
      ? 'http://10.0.2.2:5000/api'
      : 'http://localhost:5000/api';
  }

  // 4. Default fallback to Live Cloud API for release builds
  return 'https://grocartapi.onrender.com/api';
};

export const BASE_URL = getApiBaseUrl();
console.log(`[API Config] Active Base URL: ${BASE_URL}`);

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