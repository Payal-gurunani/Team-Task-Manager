import api from './axios';
export const getAllUsers = () => api.get('/api/users');
export const getNotifications = () => api.get('/api/users/notifications');
export const markNotificationRead = (id) => api.put(`/api/users/notifications/${id}/read`);
export const markAllNotificationsRead = () => api.put('/api/users/notifications/read-all');
