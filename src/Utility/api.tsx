import apiClient from './apiClient';
import { saveAuthTokens } from './tokenStorage';

type OtpResponse = {
  success: boolean;
  message: string;
  data?: {
    accessToken: string;
    refreshToken: string;
  };
};

export const sendOtpApi = async (phoneNumber: string): Promise<OtpResponse> => {
  const endpoint = `/auth/send-otp`;
  const payload = {
    PhoneNumber: phoneNumber,
  };

  try {
    const response = await apiClient.post<OtpResponse>(endpoint, payload);
    return response.data;
  } catch (error: any) {
    throw error;
  }
};

export const verifyOtpApi = async (
  phoneNumber: string,
  otp: string
): Promise<OtpResponse> => {
  const endpoint = `/auth/login-otp`;
  const payload = {
    PhoneNumber: phoneNumber,
    Otp: otp,
  };

  try {
    const response = await apiClient.post<any>(endpoint, payload);
    const rawData = response.data;

    // Handle both wrapped { success, data: { accessToken, ... } } and direct { accessToken, ... }
    const tokenData = rawData?.data?.accessToken ? rawData.data : (rawData?.accessToken ? rawData : null);

    if (tokenData?.accessToken) {
      const accessToken = tokenData.accessToken;
      const refreshToken = tokenData.refreshToken;

      // Store tokens securely (Keychain + AsyncStorage fallback)
      await saveAuthTokens({ accessToken, refreshToken });

      return {
        success: true,
        message: rawData?.message || 'Login successful',
        data: { accessToken, refreshToken },
      };
    }

    return {
      success: rawData?.success ?? false,
      message: rawData?.message || 'Failed to authenticate',
      data: rawData?.data,
    };
  } catch (error: any) {
    throw error;
  }
};

export type RegisterUserRequest = {
  Name: string;
  Email: string;
  PhoneNumber: string;
  Password?: string;
  Otp: string;
};

export const registerApi = async (
  userData: Omit<RegisterUserRequest, 'Otp'>,
  otp: string
): Promise<OtpResponse> => {
  const endpoint = `/auth/register`;
  const payload: RegisterUserRequest = {
    ...userData,
    Otp: otp,
  };

  try {
    const response = await apiClient.post<any>(endpoint, payload);
    const rawData = response.data;

    const tokenData = rawData?.data?.accessToken ? rawData.data : (rawData?.accessToken ? rawData : null);

    if (tokenData?.accessToken) {
      const accessToken = tokenData.accessToken;
      const refreshToken = tokenData.refreshToken;

      // Store tokens securely (Keychain + AsyncStorage fallback)
      await saveAuthTokens({ accessToken, refreshToken });

      return {
        success: true,
        message: rawData?.message || 'Registration successful',
        data: { accessToken, refreshToken },
      };
    }

    return {
      success: rawData?.success ?? false,
      message: rawData?.message || 'Registration failed',
      data: rawData?.data,
    };
  } catch (error: any) {
    throw error;
  }
};

