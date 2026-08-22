import apiClient from "./apiClient";
import { ApiResponse } from "./apiConfig";
import { ProductDetails } from "../types/ProductDetails";
import { ProductListItemDto } from "../types/ProductListItemDto";

interface HomeProductsData {
  bestSellingItems: ProductListItemDto[];
  exclusiveItems: ProductListItemDto[];
}

export const getHomeProductsApi = async (): Promise<ApiResponse<HomeProductsData>> => {
  const endpoint = `/Product/home-screen`;

  try {
    const response = await apiClient.get<ApiResponse<HomeProductsData>>(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching home products:', error);
    throw error;
  }
};

export const getProductDetailsApi = async (
  productId: number
): Promise<ApiResponse<ProductDetails>> => {
  const endpoint = `/Product`;

  try {
    const response = await apiClient.get<ApiResponse<ProductDetails[]>>(endpoint, {
      params: { ids: [productId] },
    });
    return {
      success: response.data.success,
      message: response.data.message,
      data: (response.data.data && response.data.data.length > 0) ? (response.data.data[0] as any) : null,
    };
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export const getBestSellingProductsApi = async (): Promise<ApiResponse<ProductListItemDto[]>> => {
  const endpoint = `/Product`;

  try {
    const response = await apiClient.get<ApiResponse<ProductListItemDto[]>>(endpoint, {
      params: { isBestSelling: true },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching best selling products:', error);
    throw error;
  }
};

export const getExclusiveProductsApi = async (): Promise<ApiResponse<ProductListItemDto[]>> => {
  const endpoint = `/Product`;

  try {
    const response = await apiClient.get<ApiResponse<ProductListItemDto[]>>(endpoint, {
      params: { isExclusive: true },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching exclusive products:', error);
    throw error;
  }
};

export const getProductsByIdsApi = async (
  ids: number[]
): Promise<ApiResponse<ProductListItemDto[]>> => {
  const endpoint = `/Product`;

  try {
    const response = await apiClient.get<ApiResponse<ProductListItemDto[]>>(endpoint, {
      params: { ids },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products by IDs:', error);
    throw error;
  }
};