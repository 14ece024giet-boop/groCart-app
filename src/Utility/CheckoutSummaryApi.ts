import axios from 'axios';
import { ApiResponse, BASE_URL } from './apiConfig';

interface CheckoutSummaryRequest {
  cartItems: { productId: number; quantity: number }[];
  couponCode: string;
  deliveryType: string;
  deliveryDate: string;
}

interface CheckoutSummary {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  grandTotal: number;
}


export const getCheckoutSummaryApi = async (
  payload: CheckoutSummaryRequest
): Promise<ApiResponse<CheckoutSummary>> => {
  const endpoint = `${BASE_URL}/Checkout/summary`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const response = await axios.post<ApiResponse<CheckoutSummary>>(endpoint, payload, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching checkout summary:', error);
    throw error;
  }
};
