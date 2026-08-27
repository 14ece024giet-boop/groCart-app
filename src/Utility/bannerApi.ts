import axios from 'axios';
import { BASE_URL } from './apiConfig';

export interface BannerDto {
  id: number;
  title: string;
  discountText: string;
  badgeText: string;
  buttonText: string;
  imageUrl: string;
  bgColor: string;
  accentColor: string;
  targetCategory?: string;
  isActive: boolean;
}

export interface FlashSaleDto {
  title: string;
  badgeText: string;
  endTime: string;
  claimedPercentage: number;
}

export const getActiveBannersApi = async () => {
  const response = await axios.get<{ success: boolean; data: BannerDto[] }>(`${BASE_URL}/Banner`);
  return response.data;
};

export const getActiveFlashSaleApi = async () => {
  const response = await axios.get<{
    success: boolean;
    data: { flashSale: FlashSaleDto; items: any[] };
  }>(`${BASE_URL}/FlashSale`);
  return response.data;
};
