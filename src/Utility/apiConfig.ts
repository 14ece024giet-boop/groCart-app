export const BASE_URL = 'http://10.216.7.207:5000/api';


export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


// export const BASE_URL = 'http://192.168.1.3:5081/api';
// http://10.216.7.207:5000/api/auth/send-otp