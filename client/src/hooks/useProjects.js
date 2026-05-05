import { useState, useEffect, useCallback } from 'react';
import * as projectApi from '../api/projects';
import toast from 'react-hot-toast';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await projectApi.getProjects();
      setProjects(data.projects);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const createProject = async (projectData) => {
    const { data } = await projectApi.createProject(projectData);
    setProjects(prev => [data.project, ...prev]);
    toast.success('Project created!');
    return data.project;
  };

  const deleteProject = async (id) => {
    await projectApi.deleteProject(id);
    setProjects(prev => prev.filter(p => p._id !== id));
    toast.success('Project deleted');
  };

  const updateProject = async (id, projectData) => {
    const { data } = await projectApi.updateProject(id, projectData);
    setProjects(prev => prev.map(p => p._id === id ? data.project : p));
    toast.success('Project updated');
    return data.project;
  };

  const addMember = async (projectId, userId) => {
    const { data } = await projectApi.addMember(projectId, userId);
    setProjects(prev => prev.map(p => p._id === projectId ? data.project : p));
    toast.success('Member added!');
    return data.project;
  };

  const removeMember = async (projectId, userId) => {
    const { data } = await projectApi.removeMember(projectId, userId);
    setProjects(prev => prev.map(p => p._id === projectId ? data.project : p));
    toast.success('Member removed');
    return data.project;
  };

  return { projects, loading, error, fetchProjects, createProject, deleteProject, updateProject, addMember, removeMember };
};
