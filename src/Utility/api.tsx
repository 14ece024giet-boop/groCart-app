import axios from 'axios';
import { BASE_URL } from './apiConfig';

type OtpResponse = {
  success: boolean;
  message: string;
  token?:string;
};

export const sendOtpApi = async (phoneNumber: string): Promise<OtpResponse> =>{
  console.log('=== API function called ===');
const endpoint = `${BASE_URL}/auth/send-otp`;
console.log('Endpoint:', endpoint); 
  const payload = {
    phoneNumber,
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
      // Add auth token or custom headers here if needed
      // Authorization: `Bearer ${yourToken}`,
    },
  };

  try {
    const response = await axios.post<OtpResponse>(endpoint, payload, config);
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};


export const verifyOtpApi = async (
  phoneNumber: string,
  code: string
): Promise<OtpResponse> => {
  console.log('=== Verify OTP API called ===');
  const endpoint = `${BASE_URL}/auth/verify-otp`;
  console.log('Endpoint:', endpoint);

  const payload = {
    phoneNumber,
    code,
  };

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post<OtpResponse>(endpoint, payload, config);
    return response.data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};



