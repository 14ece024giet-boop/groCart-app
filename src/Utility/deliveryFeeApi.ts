import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

export interface DeliveryFeeConfigDto {
  freeDeliveryThreshold: number;
  standardDeliveryFee: number;
  isActive: boolean;
}

export const getDeliveryFeeConfigApi = async (): Promise<{ success: boolean; data: DeliveryFeeConfigDto }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/Delivery/fee-config`, { timeout: 3000 });
    if (response.data && response.data.data) {
      return { success: true, data: response.data.data };
    }
    return { success: true, data: { freeDeliveryThreshold: 499, standardDeliveryFee: 20, isActive: true } };
  } catch (error) {
    return { success: true, data: { freeDeliveryThreshold: 499, standardDeliveryFee: 20, isActive: true } };
  }
};
