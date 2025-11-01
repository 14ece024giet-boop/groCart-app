export interface UserAddressDto {
  userName: string;
  phoneNumber: string;
  roomNumber: string;
  deliveryPointId: number;
}

import axios from 'axios';
import { ApiResponse, BASE_URL, getAuthHeaders } from './apiConfig';

export const getUserAddressApi = async (): Promise<ApiResponse<UserAddressDto>> => {
  const endpoint = `${BASE_URL}/User/GetUserAddress`;  // Backend POST endpoint
  const headers = await getAuthHeaders();

  try {
    // POST request with no body, just headers for auth
    const response = await axios.post<ApiResponse<UserAddressDto>>(endpoint, null, { headers });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user address:', error);
    throw new Error(
      error?.response?.data?.message || 'Failed to fetch user address. Please try again.'
    );
  }
};
