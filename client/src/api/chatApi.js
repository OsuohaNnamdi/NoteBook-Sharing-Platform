import { api } from '../lib/api';

export const chatApi = {
  individuals: () => api.get('/services/chat/individuals').then((r) => r.data),
  conversation: (otherEmail, page = 0, size = 20) =>
    api.get('/services/chat/conversation', { params: { otherEmail, page, size } }).then((r) => r.data),
  sendText: (recipient, text) =>
    api.post('/services/chat/messages/text', { recipient, text }).then((r) => r.data),
  sendWithFile: (recipient, text, file) => {
    const form = new FormData();
    form.append('request', new Blob([JSON.stringify({ recipient, text })], { type: 'application/json' }));
    if (file) form.append('file', file);
    return api
      .post('/services/chat/messages', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  },
  unreadCount: () => api.get('/services/chat/unread-count').then((r) => r.data),
  markRead: (id) => api.patch(`/services/chat/messages/${id}/read`).then((r) => r.data),
  search: (q) => api.get('/services/chat/messages/search', { params: { q } }).then((r) => r.data),
  statistics: () => api.get('/services/chat/statistics').then((r) => r.data),
  remove: (id) => api.delete(`/services/chat/messages/${id}`).then((r) => r.data),
  archive: (id) => api.patch(`/services/chat/messages/${id}/archive`).then((r) => r.data),
};
