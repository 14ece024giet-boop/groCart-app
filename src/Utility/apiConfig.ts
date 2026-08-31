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
  return 'https://grocart-api-uat.onrender.com/api';
};

export const BASE_URL = getApiBaseUrl();
console.log(`[API Config] Active Base URL: ${BASE_URL}`);

export function resolveImageUrl(rawUrl?: string | null): string {
  if (!rawUrl) return '';
  if (rawUrl.includes('cloudinary.com') || rawUrl.includes('unsplash.com')) {
    return rawUrl;
  }
  let cleanUrl = rawUrl;
  // Always force HTTPS on Render domains (mobile OS blocks plain HTTP)
  if (cleanUrl.startsWith('http://grocart-api-uat.onrender.com')) {
    cleanUrl = cleanUrl.replace('http://grocart-api-uat.onrender.com', 'https://grocart-api-uat.onrender.com');
  }

  const baseUrlHost = BASE_URL.replace('/api', '').replace('http://grocart-api-uat.onrender.com', 'https://grocart-api-uat.onrender.com');
  const uploadsIdx = cleanUrl.indexOf('/uploads/');
  if (uploadsIdx >= 0) {
    return `${baseUrlHost}${cleanUrl.substring(uploadsIdx)}`;
  }
  if (cleanUrl.startsWith('http://10.') || cleanUrl.startsWith('http://localhost') || cleanUrl.startsWith('http://192.168.')) {
    const urlPath = cleanUrl.replace(/^https?:\/\/[^\/]+/, '');
    return `${baseUrlHost}${urlPath}`;
  }
  return cleanUrl;
}

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