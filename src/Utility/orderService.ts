import axios from 'axios';
import { ApiResponse, BASE_URL, getAuthHeaders } from './apiConfig';

// --- Types ---
export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  deliveryType: 'COD';
  couponCode?: string;

  // ✅ Add these
  deliveryPointId: number;
  recipientName: string;
  roomNumber: string;
  additionalInfo: string;
}


export interface OrderResponse {
  qrCodeUrl :string
}



// --- API Function ---
export const createOrderApi = async (
  payload: CreateOrderPayload
): Promise<ApiResponse<OrderResponse>> => {
  const endpoint = `${BASE_URL}/Order/place-order`;

 const headers = await getAuthHeaders();

console.log('Order Payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await axios.post<ApiResponse<OrderResponse>>(endpoint, payload, { headers });
    return response.data;
  } catch (error: any) {
    // Optionally, you could normalize the error shape here
    console.error('Error placing order:', error);
    throw new Error(
      error?.response?.data?.message || 'Failed to place order. Please try again.'
    );
  }
};
