import axios from 'axios';
import { tokenStore } from './tokenStore';

const baseURL =  'https://bundle-api-bqfx.onrender.com/api';

export const api = axios.create({ baseURL });

// Attach the access token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Single-flight refresh: if several requests 401 at once, only one refresh
// call is made and the rest wait on the same promise.
let refreshPromise = null;

async function refreshSession() {
  const refreshToken = tokenStore.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token');
  const { data } = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
  tokenStore.setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken, user: data.user ?? tokenStore.getUser() });
  return data.accessToken;
}

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const { config, response } = error;
    const isAuthCall = config?.url?.includes('/auth/');

    if (response?.status === 401 && !config._retried && !isAuthCall) {
      config._retried = true;
      try {
        if (!refreshPromise) refreshPromise = refreshSession().finally(() => (refreshPromise = null));
        const newToken = await refreshPromise;
        config.headers.Authorization = `Bearer ${newToken}`;
        return api(config);
      } catch (refreshError) {
        tokenStore.clear();
        window.location.hash = '#/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Normalizes the backend's ErrorResponse shape into a plain message string
// so components don't need to know about {status, error, message, fieldErrors}.
export function extractErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data;
  if (!data) return error?.message || fallback;
  if (data.fieldErrors && Object.keys(data.fieldErrors).length) {
    return Object.values(data.fieldErrors).join(' · ');
  }
  return data.message || fallback;
}
