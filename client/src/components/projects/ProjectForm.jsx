import { useState } from 'react';
import { PROJECT_COLORS } from '../../utils/helpers';

const ProjectForm = ({ onSubmit, onCancel, initial = {} }) => {
  const [form, setForm] = useState({
    title: initial.title || '',
    description: initial.description || '',
    color: initial.color || PROJECT_COLORS[0],
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setLoading(true);
    try { await onSubmit(form); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label">Project Name *</label>
        <input className="input" placeholder="e.g. Marketing Campaign" value={form.title}
          onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
      </div>
      <div>
        <label className="label">Description</label>
        <textarea className="input resize-none" rows={3} placeholder="What is this project about?"
          value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
      </div>
      <div>
        <label className="label">Color</label>
        <div className="flex gap-2 flex-wrap">
          {PROJECT_COLORS.map(color => (
            <button key={color} type="button" onClick={() => setForm(p => ({ ...p, color }))}
              className={`w-7 h-7 rounded-lg transition-all ${form.color === color ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'hover:scale-110'}`}
              style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
          {loading ? 'Saving...' : (initial._id ? 'Update Project' : 'Create Project')}
        </button>
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
      </div>
    </form>
  );
};

export default ProjectForm;
