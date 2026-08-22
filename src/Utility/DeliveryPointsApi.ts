import axios from 'axios';
import { ApiResponse, BASE_URL, getAuthHeaders } from './apiConfig';

// Verify OTP for an order
export const verifyOrderOtpApi = async ({
  orderId,
  otpCode,
}: {
  orderId: number;
  otpCode: string;
}): Promise<ApiResponse<null>> => {
  const endpoint = `${BASE_URL}/delivery/verify-otp`;
  const headers = await getAuthHeaders();
  try {
    const response = await axios.post<ApiResponse<null>>(
      endpoint,
      { orderId, otpCode },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error verifying order OTP:', error);
    throw error;
  }
};

// Resend OTP for an order
export const resendOrderOtpApi = async ({
  orderId,
}: {
  orderId: number;
}): Promise<ApiResponse<null>> => {
  const endpoint = `${BASE_URL}/delivery/resend-otp`;
  const headers = await getAuthHeaders();
  try {
    const response = await axios.post<ApiResponse<null>>(
      endpoint,
      { orderId },
      { headers }
    );
    return response.data;
  } catch (error) {
    console.error('Error resending order OTP:', error);
    throw error;
  }
};

// Cancel an order
export const cancelOrderApi = async ({
  orderId,
}: {
  orderId: number;
}): Promise<ApiResponse<null>> => {
  const endpoint = `${BASE_URL}/delivery/cancel-order`;
  const headers = await getAuthHeaders();
  try {
    const response = await axios.post<ApiResponse<null>>(endpoint, { orderId }, { headers });
    return response.data;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};