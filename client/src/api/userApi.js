import { api } from '../lib/api';

export const userApi = {
  me: () => api.get('/user/me').then((r) => r.data),

  // Service access requests (user side)
  requestAccess: (payload) => api.post('/user/access-requests', payload).then((r) => r.data),
  myRequests: () => api.get('/user/access-requests').then((r) => r.data),
  myGrants: () => api.get('/user/access-grants').then((r) => r.data),
};
