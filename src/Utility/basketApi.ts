import apiClient from './apiClient';
import { ApiResponse } from './apiConfig';
import { CartItem } from '../store/slices/cartSlice';

export interface BasketItemDto {
  id: number;
  name: string;
  price: number;
  discountPrice: number;
  imageUrl: string;
  quantity: number;
  unitSize?: string;
  brandName?: string;
  categoryName?: string;
}

/**
 * Fetch authenticated user's saved basket from backend Azure SQL database.
 */
export const getBasketApi = async (): Promise<ApiResponse<CartItem[]>> => {
  try {
    const response = await apiClient.get<ApiResponse<CartItem[]>>('/basket');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to fetch basket.',
    };
  }
};

/**
 * Add or update an item's quantity in backend basket database.
 */
export const addItemToBasketApi = async (
  productId: number,
  quantity: number
): Promise<ApiResponse<string>> => {
  try {
    const response = await apiClient.post<ApiResponse<string>>('/basket/items', {
      productId,
      quantity,
    });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to update basket item.',
    };
  }
};

/**
 * Remove an item from backend basket database.
 */
export const removeItemFromBasketApi = async (
  productId: number
): Promise<ApiResponse<string>> => {
  try {
    const response = await apiClient.delete<ApiResponse<string>>(`/basket/items/${productId}`);
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to remove basket item.',
    };
  }
};

/**
 * Clear user's entire basket in backend database.
 */
export const clearBasketApi = async (): Promise<ApiResponse<string>> => {
  try {
    const response = await apiClient.delete<ApiResponse<string>>('/basket');
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to clear basket.',
    };
  }
};

