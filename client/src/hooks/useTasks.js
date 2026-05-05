import { useState, useEffect, useCallback } from 'react';
import * as taskApi from '../api/tasks';
import toast from 'react-hot-toast';

export const useTasks = (filters = {}) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await taskApi.getTasks(filters);
      setTasks(data.tasks);
      setTotal(data.total);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = async (taskData) => {
    const { data } = await taskApi.createTask(taskData);
    setTasks(prev => [data.task, ...prev]);
    toast.success('Task created!');
    return data.task;
  };

  const updateTask = async (id, taskData) => {
    const { data } = await taskApi.updateTask(id, taskData);
    setTasks(prev => prev.map(t => t._id === id ? data.task : t));
    toast.success('Task updated!');
    return data.task;
  };

  const deleteTask = async (id) => {
    await taskApi.deleteTask(id);
    setTasks(prev => prev.filter(t => t._id !== id));
    toast.success('Task deleted');
  };

  return { tasks, loading, error, total, fetchTasks, createTask, updateTask, deleteTask };
};
