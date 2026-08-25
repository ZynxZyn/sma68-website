import { apiFetch, buildQuery } from './client';

export const authApi = {
  login: (username, password) =>
    apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  logout: (refreshToken) =>
    apiFetch('/api/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
  me: () => apiFetch('/api/auth/me'),
};

export const newsApi = {
  list: (params = {}) => apiFetch(`/api/news${buildQuery(params)}`),
  get: (id) => apiFetch(`/api/news/${id}`),
  create: (data) => apiFetch('/api/news', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/news/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => apiFetch(`/api/news/${id}`, { method: 'DELETE' }),
};

export const announcementApi = {
  list: (params = {}) => apiFetch(`/api/announcements${buildQuery(params)}`),
  get: (id) => apiFetch(`/api/announcements/${id}`),
  create: (data) => apiFetch('/api/announcements', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/announcements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => apiFetch(`/api/announcements/${id}`, { method: 'DELETE' }),
};

export const agendaApi = {
  list: (params = {}) => apiFetch(`/api/agenda${buildQuery(params)}`),
  get: (id) => apiFetch(`/api/agenda/${id}`),
  create: (data) => apiFetch('/api/agenda', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/agenda/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => apiFetch(`/api/agenda/${id}`, { method: 'DELETE' }),
};

export const achievementApi = {
  list: (params = {}) => apiFetch(`/api/achievements${buildQuery(params)}`),
  get: (id) => apiFetch(`/api/achievements/${id}`),
  create: (data) => apiFetch('/api/achievements', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/achievements/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => apiFetch(`/api/achievements/${id}`, { method: 'DELETE' }),
};

export const galleryApi = {
  list: (params = {}) => apiFetch(`/api/gallery${buildQuery(params)}`),
  get: (id) => apiFetch(`/api/gallery/${id}`),
  create: (data) => apiFetch('/api/gallery', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => apiFetch(`/api/gallery/${id}`, { method: 'DELETE' }),
};

export const userApi = {
  list: (params = {}) => apiFetch(`/api/users${buildQuery(params)}`),
  get: (id) => apiFetch(`/api/users/${id}`),
  create: (data) => apiFetch('/api/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id, data) => apiFetch(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  remove: (id) => apiFetch(`/api/users/${id}`, { method: 'DELETE' }),
};

export const statsApi = {
  get: () => apiFetch('/api/stats'),
};