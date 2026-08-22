import axios from 'axios';
import { ApiResponse, BASE_URL, getAuthHeaders } from './apiConfig';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  status: 'All' | 'Ongoing' | 'Waiting' | 'Completed';
  itemCount: number;
  amount: number;
  statusText: string;
  statusColor: string;
}

export interface GetOrdersResponse {
  orders: Order[];
  hasMore: boolean;
}

export const getMyOrdersApi = async (
  status: string,
  page: number
): Promise<ApiResponse<GetOrdersResponse>> => {
  // The backend probably expects 'all' in lowercase or no status for all
  const apiStatus = status === 'All' ? '' : status.toLowerCase();
  const endpoint = `${BASE_URL}/orders/my-orders?status=${apiStatus}&page=${page}`;
  const headers = await getAuthHeaders();

  try {
    const response = await axios.get<ApiResponse<GetOrdersResponse>>(endpoint, {
      headers,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching my orders:', error);
    // Simulate an empty response on error to avoid crashing
    throw new Error('Failed to connect to the server.');
  }
};