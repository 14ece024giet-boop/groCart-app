export interface DeliveryPointDto {
  id: number;
  name: string;
  address: string;
}

export interface UserAddressDto {
  userName?: string;
  phoneNumber?: string;
  roomNumber: string;
  deliveryPointId: number;
  deliveryPointAddress?: string;
}

export interface CreateUserAddressDto {
  deliveryPointId: number;
  roomNumber: string;
  recipientName?: string;
  phoneNumber?: string;
  additionalInfo?: string;
}

import apiClient from './apiClient';
import { ApiResponse } from './apiConfig';

/**
 * Fetch all system-defined allowed delivery points
 */
export const getAllDeliveryPointsApi = async (): Promise<ApiResponse<DeliveryPointDto[]>> => {
  const endpoint = `/DeliveryPoint/get-all`;
  try {
    const response = await apiClient.get<ApiResponse<DeliveryPointDto[]>>(endpoint);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching delivery points:', error);
    throw error;
  }
};

/**
 * Fetch the authenticated user's current saved address
 */
export const getUserAddressApi = async (): Promise<ApiResponse<UserAddressDto | null>> => {
  const endpoint = `/User/GetUserAddress`;

  try {
    const response = await apiClient.post<ApiResponse<UserAddressDto>>(endpoint, null);
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return {
        success: true,
        message: 'No address configured yet',
        data: null,
      };
    }
    console.warn('User address not configured or failed to fetch:', error?.message);
    return {
      success: false,
      message: error?.response?.data?.message || 'Failed to fetch user address.',
      data: null,
    };
  }
};

/**
 * Save / Update the authenticated user's address
 */
export const saveUserAddressApi = async (
  dto: CreateUserAddressDto
): Promise<ApiResponse<string>> => {
  const endpoint = `/User/save-address`;

  try {
    const response = await apiClient.post<ApiResponse<string>>(endpoint, dto);
    return response.data;
  } catch (error: any) {
    console.error('Error saving user address:', error);
    throw error;
  }
};

