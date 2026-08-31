import apiClient from './apiClient';
import { ApiResponse } from './apiConfig';

export interface OrderItemDto {
  productId: number;
  productName: string;
  productImage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  orderDate: string;
  formattedDate: string;
  formattedTime: string;
  status: number;
  statusText: string;
  statusColor: string;
  deliveryType: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  totalAmount: number;
  itemCount: number;
  itemsSummary: string;
  deliveryAddress?: string;
  orderQRCode?: string;
  items: OrderItemDto[];
}

export interface PaginatedOrdersDto {
  orders: Order[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export const getMyOrdersApi = async (
  status: string = 'all',
  page: number = 1,
  pageSize: number = 10
): Promise<ApiResponse<PaginatedOrdersDto>> => {
  const normStatus = status.toLowerCase();
  const endpoint = `/Order/my-orders?status=${normStatus}&page=${page}&pageSize=${pageSize}`;

  try {
    const response = await apiClient.get<ApiResponse<PaginatedOrdersDto>>(endpoint);
    return response.data;
  } catch (error: any) {
    console.error('[myOrdersApi] Error fetching orders:', error);
    throw error?.response?.data || new Error(error.message || 'Failed to fetch orders.');
  }
};