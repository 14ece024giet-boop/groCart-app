// api/deliveryPointApi.ts

export interface DeliveryPointAddress {
  id: number;
  name: string;
  address: string;
}

export interface VerifyOrderOtpRequest {
  orderId: number;
  otpCode: string;
}



import axios from 'axios';
import { ApiResponse, BASE_URL } from './apiConfig';

export const getDeliveryPointsApi = async (): Promise<ApiResponse<DeliveryPointAddress[]>> => {
  const endpoint = `${BASE_URL}/DeliveryPoint/get-all`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post<ApiResponse<DeliveryPointAddress[]>>(endpoint, null, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching delivery points:', error);
    throw error;
  }
};

export const verifyOrderOtpApi = async (
  payload: VerifyOrderOtpRequest
): Promise<ApiResponse<string>> => {
  const endpoint = `${BASE_URL}/Order/verify-order-otp`;

  try {
    const response = await axios.post<ApiResponse<string>>(endpoint, payload, {
      headers: { 'Content-Type': 'application/json' },
    });

    return response.data;
  } catch (error: any) {
    console.error('Error verifying OTP:', error);
    throw new Error(
      error?.response?.data?.message || 'OTP verification failed.'
    );
  }
};