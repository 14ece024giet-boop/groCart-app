import axios from 'axios';
import { ApiResponse, BASE_URL, getAuthHeaders } from './apiConfig';


export interface ItemDto {
  productId: string;
  name: string;
  quantity: number;
}

export interface PaymentDto {
  deliveryType: string;
  amountToCollect: number;
}

export interface DeliveryAddressDto {
  addressLine1: string;
  roomNumber: string;
  additionalInstructions?: string;
}

export interface RecipientDto {
  name: string;
  contactNumber: string;
}

export interface DeliveryOrderDetails {
  orderId: number;
  orderDate: string;
  orderStatus: string;
  recipient: RecipientDto;
  deliveryAddress: DeliveryAddressDto;
  items: ItemDto[];
  payment: PaymentDto;
  qrCodeData: string;
}

export interface UploadPhotoPayload {
  orderId: number;
  photoUri: string;
}



// --- DTO ---
export interface DeliveryOrderDetails {
  orderId: number;
  orderDate: string;
  orderStatus: string;
  recipient: {
    name: string;
    contactNumber: string;
  };
  deliveryAddress: {
    addressLine1: string;
    roomNumber: string;
    additionalInstructions?: string;
  };
  items: {
    productId: string;
    name: string;
    quantity: number;
  }[];
  payment: {
    deliveryType: string;
    amountToCollect: number;
  };
  qrCodeData: string;
}

// --- API Function ---
export const fetchDeliveryOrderDetails = async (
  payload: { orderId: number }
): Promise<ApiResponse<DeliveryOrderDetails>> => {
  const endpoint = `${BASE_URL}/Delivery/order-details`;
  console.log('Calling API:', endpoint, 'Payload:', payload); // ✅ Add this
  const headers = await getAuthHeaders();

  try {
    const response = await axios.post<ApiResponse<DeliveryOrderDetails>>(endpoint, payload , {headers});
    return response.data;
  } catch (error: any) {
    console.error('Error fetching order details:', error);
    throw new Error(
      error?.response?.data?.message || 'Failed to fetch order details. Please try again.'
    );
  }
};


export const uploadDeliveryPhoto = async ({
  orderId,
  photoUri,
}: UploadPhotoPayload): Promise<{ success: boolean; data?: string; message?: string }> => {
  const endpoint = `${BASE_URL}/Order/upload-photo`;
  const headers = await getAuthHeaders();

  const formData = new FormData();
  formData.append('orderId', String(orderId));

  formData.append('photo', {
    uri: photoUri,
    type: 'image/jpeg',
    name: `order_${orderId}.jpg`,
  } as any); // React Native FormData workaround

  try {
    const response = await axios.post(endpoint, formData, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error: any) {
    console.error('Image upload failed:', {
      message: error?.message,
      response: error?.response?.data,
    });
    return {
      success: false,
      message: error?.response?.data?.message || 'Image upload failed. Try again.',
    };
  }
};
