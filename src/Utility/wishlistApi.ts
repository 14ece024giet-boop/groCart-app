import apiClient from './apiClient';
import { ApiResponse } from './apiConfig';
import { ProductListItemDto } from '../types/ProductListItemDto';

/**
 * Fetch authenticated user's saved wishlist from SQL Server database.
 */
export const getWishlistApi = async (): Promise<ApiResponse<ProductListItemDto[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<ProductListItemDto[]>>('/Wishlist');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch wishlist.',
    };
  }
};

/**
 * Toggle favorite item status in SQL Server database.
 */
export const toggleWishlistApi = async (productId: number): Promise<ApiResponse<any>> => {
  try {
    const response = await apiClient.post<ApiResponse<any>>(`/Wishlist/${productId}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to toggle wishlist item.',
    };
  }
};

/**
 * Remove an item from SQL Server database wishlist.
 */
export const removeFromWishlistApi = async (productId: number): Promise<ApiResponse<string>> => {
  try {
    const response = await apiClient.delete<ApiResponse<string>>(`/Wishlist/${productId}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to remove wishlist item.',
    };
  }
};

