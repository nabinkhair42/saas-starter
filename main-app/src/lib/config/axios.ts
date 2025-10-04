import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const storage: Storage | null = typeof window !== 'undefined' ? window.localStorage : null;

type RefreshTokenResponse = {
  data: {
    accessToken: string;
    refreshToken: string;
  };
};

const getItem = (key: string): string | null => storage?.getItem(key) ?? null;
const setItem = (key: string, value: string) => storage?.setItem(key, value);
const removeItem = (key: string) => storage?.removeItem(key);

// Create axios instance
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management utilities
export const tokenManager = {
  getAccessToken: () => getItem('accessToken'),
  getRefreshToken: () => getItem('refreshToken'),
  getSessionId: () => getItem('sessionId'),
  setTokens: (accessToken: string, refreshToken: string, sessionId?: string) => {
    setItem('accessToken', accessToken);
    setItem('refreshToken', refreshToken);
    if (sessionId) {
      setItem('sessionId', sessionId);
    }
  },
  clearTokens: () => {
    removeItem('accessToken');
    removeItem('refreshToken');
    removeItem('user');
    removeItem('sessionId');
  },
};

const redirectToLogin = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/log-in';
  }
};

const AUTH_ENDPOINT_PREFIXES = [
  '/log-in',
  '/create-account',
  '/email-verification',
  '/forgot-password',
  '/reset-password',
];

const isAuthEndpoint = (url: string | undefined) => {
  if (!url) return false;
  return AUTH_ENDPOINT_PREFIXES.some(prefix => url.includes(prefix));
};

const handleSessionInvalid = (error: unknown) => {
  tokenManager.clearTokens();
  redirectToLogin();
  return Promise.reject(error);
};

const refreshAccessToken = async (
  originalRequest: InternalAxiosRequestConfig & { _retry?: boolean }
) => {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) {
    return handleSessionInvalid(new Error('Missing refresh token'));
  }

  const sessionId = tokenManager.getSessionId();
  const headers = sessionId ? { 'X-Session-Id': sessionId } : undefined;

  const { data } = await axios.post<RefreshTokenResponse>(
    '/api/auth/refresh-token',
    { refreshToken },
    { headers }
  );

  const { accessToken, refreshToken: newRefreshToken } = data.data;
  tokenManager.setTokens(accessToken, newRefreshToken, sessionId ?? undefined);

  if (originalRequest.headers) {
    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
  }

  return api(originalRequest);
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const sessionId = tokenManager.getSessionId();
    if (sessionId && config.headers) {
      config.headers['X-Session-Id'] = sessionId;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    const responseStatus = error.response?.status;
    const serverMessage = (error.response?.data as { message?: string } | undefined)?.message;

    if (responseStatus === 401) {
      const normalizedMessage = serverMessage?.toLowerCase() ?? '';
      if (
        normalizedMessage.includes('session revoked') ||
        normalizedMessage.includes('session context missing')
      ) {
        return handleSessionInvalid(error);
      }
    }

    if (responseStatus === 401 && !originalRequest._retry && !isAuthEndpoint(originalRequest.url)) {
      originalRequest._retry = true;
      try {
        return await refreshAccessToken(originalRequest);
      } catch (refreshError) {
        return handleSessionInvalid(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
