import axios from 'axios';
import { ApiResponse, BASE_URL, getAuthHeaders } from './apiConfig';

export interface TimelineEvent {
  time: string;
  text: string;
  status: string;
}

export interface OrderTimeline {
  orderId: string;
  currentStatus: string;
  timeline: TimelineEvent[];
}

export const getOrderTimelineApi = async (
  orderId: string
): Promise<ApiResponse<OrderTimeline>> => {
  const endpoint = `${BASE_URL}/orders/timeline/${orderId}`;
  const headers = await getAuthHeaders();

  try {
    const response = await axios.get<ApiResponse<OrderTimeline>>(endpoint, { headers });
    return response.data;
  } catch (error) {
    console.error('Error fetching order timeline:', error);
    throw error;
  }
};