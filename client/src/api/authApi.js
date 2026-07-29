import { api } from '../lib/api';

export const authApi = {
  register: (payload) => api.post('/auth/register', payload).then((r) => r.data),
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }).then((r) => r.data),
};
