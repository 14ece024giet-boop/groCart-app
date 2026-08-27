import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getAuthTokens } from './tokenStorage';
import { BASE_URL } from './apiConfig';

/**
 * Generate a transaction correlation ID for tracing
 */
const generateCorrelationId = (): string => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `mob_${timestamp}_${randomStr}`;
};

/**
 * Centralized Axios client with automatic CorrelationId injection, 
 * Token Header, and transaction logging.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 45000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔹 Request Interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // 1. Attach Correlation ID
    const correlationId = generateCorrelationId();
    config.headers.set('X-Correlation-Id', correlationId);

    // 2. Attach Timestamp for duration measurement
    (config as any).metadata = { startTime: Date.now(), correlationId };

    // 3. Attach Auth Token from tokenStorage if available
    try {
      const tokens = await getAuthTokens();
      if (tokens?.accessToken && !config.headers.Authorization) {
        config.headers.set('Authorization', `Bearer ${tokens.accessToken}`);
      }
    } catch (err) {
      console.warn('[ApiClient] Failed to retrieve auth token:', err);
    }

    console.log(
      `🌐 [API REQ] [${correlationId}] ${config.method?.toUpperCase()} ${config.baseURL || ''}${config.url || ''}`
    );

    return config;
  },
  (error) => {
    console.error('❌ [API REQ ERROR]', error);
    return Promise.reject(error);
  }
);

// 🔹 Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    const metadata = (response.config as any)?.metadata;
    const duration = metadata ? Date.now() - metadata.startTime : 0;
    const correlationId = metadata?.correlationId || response.headers['x-correlation-id'] || 'unknown';

    console.log(
      `✅ [API RES] [${correlationId}] ${response.config.method?.toUpperCase()} ${response.config.url} | Status: ${response.status} (${duration}ms)`
    );

    return response;
  },
  (error: AxiosError) => {
    const metadata = (error.config as any)?.metadata;
    const duration = metadata ? Date.now() - metadata.startTime : 0;
    const correlationId = metadata?.correlationId || error.response?.headers?.['x-correlation-id'] || 'unknown';
    const status = error.response?.status || 'Network/Offline';
    const errorData: any = error.response?.data;
    const isServerError = typeof status === 'number' ? status >= 500 : true;

    if (isServerError) {
      console.error(
        `❌ [API SERVER ERR] [${correlationId}] ${error.config?.method?.toUpperCase()} ${error.config?.url} | Status: ${status} (${duration}ms)`,
        `\nMessage: ${errorData?.message || error.message}`
      );

      // 🚀 Only persist true server (5xx) / network crashes to Azure SQL database
      if (error.config?.url && !error.config.url.includes('/Log/client-error')) {
        axios
          .post(`${BASE_URL}/Log/client-error`, {
            CorrelationId: correlationId,
            HttpMethod: error.config?.method?.toUpperCase() || 'UNKNOWN',
            RequestPath: error.config?.url || 'UNKNOWN',
            StatusCode: typeof status === 'number' ? status : 0,
            RequestBody: error.config?.data ? (typeof error.config.data === 'string' ? error.config.data : JSON.stringify(error.config.data)) : null,
            ResponseBody: errorData ? JSON.stringify(errorData) : null,
            ExceptionType: error.name || 'AxiosError',
            ExceptionMessage: errorData?.message || error.message || 'Server Request Failed',
            StackTrace: error.stack || null,
          })
          .catch(() => {});
      }
    } else {
      // 4xx (400, 401, 404, 409) are expected business validations handled by the UI
      console.log(
        `⚠️ [API VALIDATION] [${correlationId}] ${error.config?.method?.toUpperCase()} ${error.config?.url} | Status: ${status} (${duration}ms) - ${errorData?.message || error.message}`
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
