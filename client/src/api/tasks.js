import api from './axios';
export const getTasks = (params) => api.get('/api/tasks', { params });
export const getTaskById = (id) => api.get(`/api/tasks/${id}`);
export const createTask = (data) => api.post('/api/tasks', data);
export const updateTask = (id, data) => api.put(`/api/tasks/${id}`, data);
export const deleteTask = (id) => api.delete(`/api/tasks/${id}`);
export const getDashboardStats = () => api.get('/api/tasks/stats');
