import axios from "axios";
import { ApiResponse, BASE_URL } from "./apiConfig";
import { ProductDetails } from "../types/ProductDetails";
import { ProductListItemDto } from "../types/ProductListItemDto";

interface HomeProductsData {
  bestSellingItems: ProductListItemDto[];
  exclusiveItems: ProductListItemDto[];
}

export const getHomeProductsApi = async (): Promise<ApiResponse<HomeProductsData>> => {
  const endpoint = `${BASE_URL}/Product/home-screen`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post<ApiResponse<HomeProductsData>>(endpoint, null, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching home products:', error);
    throw error;
  }
};

export const getProductDetailsApi = async (
  productId: number
): Promise<ApiResponse<ProductDetails>> => {
  const endpoint = `${BASE_URL}/Product/get-by-id`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post<ApiResponse<ProductDetails>>(endpoint, productId, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

export const getBestSellingProductsApi = async (): Promise<ApiResponse<ProductListItemDto[]>> => {
  const endpoint = `${BASE_URL}/Product/get-best-selling`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post<ApiResponse<ProductListItemDto[]>>(endpoint, null, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching best selling products:', error);
    throw error;
  }
};

export const getExclusiveProductsApi = async (): Promise<ApiResponse<ProductListItemDto[]>> => {
  const endpoint = `${BASE_URL}/Product/get-exclusive`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post<ApiResponse<ProductListItemDto[]>>(endpoint, null, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching exclusive products:', error);
    throw error;
  }
};

export const getProductsByIdsApi = async (
  ids: number[]
): Promise<ApiResponse<ProductListItemDto[]>> => {
  const endpoint = `${BASE_URL}/Product/get-by-ids`;
  const config = {
    headers: { 'Content-Type': 'application/json' },
  };

  try {
    const response = await axios.post<ApiResponse<ProductListItemDto[]>>(endpoint, {ids}, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by IDs:', error);
    throw error;
  }
};