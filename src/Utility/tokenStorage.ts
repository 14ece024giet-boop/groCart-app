import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';

const AUTH_TOKENS_KEY = 'auth_tokens_storage';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Safely saves auth tokens using Keychain (with automatic fallback to AsyncStorage)
 */
export const saveAuthTokens = async (tokens: AuthTokens): Promise<void> => {
  const tokenString = JSON.stringify(tokens);

  try {
    if (Keychain && typeof Keychain.setGenericPassword === 'function') {
      await Keychain.setGenericPassword('authTokens', tokenString);
    }
  } catch (err) {
    console.warn('[TokenStorage] Keychain setGenericPassword unavailable, falling back to AsyncStorage');
  }

  // Always sync with AsyncStorage as reliable backup
  try {
    await AsyncStorage.setItem(AUTH_TOKENS_KEY, tokenString);
  } catch (err) {
    console.error('[TokenStorage] Failed to save tokens to AsyncStorage:', err);
  }
};

/**
 * Safely retrieves auth tokens from Keychain or AsyncStorage
 */
export const getAuthTokens = async (): Promise<AuthTokens | null> => {
  try {
    if (Keychain && typeof Keychain.getGenericPassword === 'function') {
      const credentials = await Keychain.getGenericPassword();
      if (credentials && credentials.password) {
        return JSON.parse(credentials.password);
      }
    }
  } catch (err) {
    console.warn('[TokenStorage] Keychain getGenericPassword unavailable, checking AsyncStorage');
  }

  try {
    const raw = await AsyncStorage.getItem(AUTH_TOKENS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('[TokenStorage] Failed to get tokens from AsyncStorage:', err);
  }

  return null;
};

/**
 * Safely removes stored auth tokens
 */
export const clearAuthTokens = async (): Promise<void> => {
  try {
    if (Keychain && typeof Keychain.resetGenericPassword === 'function') {
      await Keychain.resetGenericPassword();
    }
  } catch (err) {
    // ignore
  }

  try {
    await AsyncStorage.removeItem(AUTH_TOKENS_KEY);
  } catch (err) {
    console.error('[TokenStorage] Failed to remove tokens from AsyncStorage:', err);
  }
};

