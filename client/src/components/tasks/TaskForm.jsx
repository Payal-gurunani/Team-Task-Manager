import { useState, useEffect } from 'react';
import * as projectApi from '../../api/projects';
import * as userApi from '../../api/users';
import { useAuth } from '../../context/AuthContext';

const TaskForm = ({ onSubmit, onCancel, initial = {}, preSelectedProject = null }) => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    projectId: initial.projectId?._id || initial.projectId || preSelectedProject || '',
    assignedTo: initial.assignedTo?._id || initial.assignedTo || '',
    status: initial.status || 'pending',
    priority: initial.priority || 'medium',
    dueDate: initial.dueDate ? new Date(initial.dueDate).toISOString().split('T')[0] : '',
    tags: initial.tags?.join(', ') || '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    projectApi.getProjects().then(({ data }) => setProjects(data.projects));
    if (isAdmin) userApi.getAllUsers().then(({ data }) => setUsers(data.users));
  }, [isAdmin]);

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.projectId) return;
    setLoading(true);
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
      if (!payload.dueDate) delete payload.dueDate;
      if (!payload.assignedTo) delete payload.assignedTo;
      await onSubmit(payload);
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Task Title *</label>
        <input className="input" placeholder="What needs to be done?" value={form.title}
          onChange={e => set('title', e.target.value)} required />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input resize-none" rows={2} placeholder="Optional details..."
          value={form.description} onChange={e => set('description', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Project *</label>
          <select className="input" value={form.projectId} onChange={e => set('projectId', e.target.value)} required>
            <option value="">Select project</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
          </select>
        </div>
        {isAdmin && (
          <div>
            <label className="label">Assign To</label>
            <select className="input" value={form.assignedTo} onChange={e => set('assignedTo', e.target.value)}>
              <option value="">Unassigned</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
            </select>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Priority</label>
          <select className="input" value={form.priority} onChange={e => set('priority', e.target.value)}>
            <option value="low">↓ Low</option>
            <option value="medium">→ Medium</option>
            <option value="high">↑ High</option>
          </select>
        </div>
        <div>
          <label className="label">Status</label>
          <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Due Date</label>
          <input type="date" className="input" value={form.dueDate} onChange={e => set('dueDate', e.target.value)} />
        </div>
        <div>
          <label className="label">Tags (comma separated)</label>
          <input className="input" placeholder="design, frontend..." value={form.tags}
            onChange={e => set('tags', e.target.value)} />
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
          {loading ? 'Saving...' : (initial._id ? 'Update Task' : 'Create Task')}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
};

export default TaskForm;
