import apiClient from './apiClient';
import { ApiResponse } from './apiConfig';

export interface UserProfileDto {
  name: string;
  email: string;
  phoneNumber: string;
  // profilePictureUrl?: string;
}

export const getUserProfileApi = async (): Promise<ApiResponse<UserProfileDto>> => {
  const endpoint = `/user/profile`;
  try {
    const response = await apiClient.get<ApiResponse<UserProfileDto>>(endpoint);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfileApi = async (
  profileData: UserProfileDto
): Promise<ApiResponse<null>> => {
  const endpoint = `/user/profile`;
  try {
    const response = await apiClient.put<ApiResponse<null>>(endpoint, profileData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};