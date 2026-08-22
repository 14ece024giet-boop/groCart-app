import axios from 'axios';
import { getAuthTokens } from './tokenStorage';

// Backend API base URL
export const BASE_URL = 'http://10.90.245.207:5000/api';

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