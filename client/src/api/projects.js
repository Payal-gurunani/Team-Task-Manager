import api from './axios';
export const getProjects = () => api.get('/api/projects');
export const getProjectById = (id) => api.get(`/api/projects/${id}`);
export const createProject = (data) => api.post('/api/projects', data);
export const updateProject = (id, data) => api.put(`/api/projects/${id}`, data);
export const deleteProject = (id) => api.delete(`/api/projects/${id}`);
export const addMember = (id, userId) => api.put(`/api/projects/${id}/add-member`, { userId });
export const removeMember = (id, userId) => api.put(`/api/projects/${id}/remove-member`, { userId });
