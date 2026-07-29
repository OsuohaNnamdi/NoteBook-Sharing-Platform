import { api } from '../lib/api';

export const adminApi = {
  // Users
  listUsers: (page = 0, size = 20) =>
    api.get('/admin/users', { params: { page, size, sort: 'createdAt,desc' } }).then((r) => r.data),
  getUser: (id) => api.get(`/admin/users/${id}`).then((r) => r.data),
  updateUser: (id, payload) => api.patch(`/admin/users/${id}`, payload).then((r) => r.data),

  // Access requests
  pendingRequests: (page = 0, size = 20) =>
    api.get('/admin/access-requests', { params: { page, size } }).then((r) => r.data),
  decideRequest: (id, decision) =>
    api.patch(`/admin/access-requests/${id}`, { decision }).then((r) => r.data),
};
