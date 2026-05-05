import { Search, X } from 'lucide-react';

const TaskFilters = ({ filters, onChange, projects = [] }) => {
  const set = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="relative flex-1 min-w-48">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input className="input pl-9 py-2.5 text-sm" placeholder="Search tasks..."
          value={filters.search || ''} onChange={e => set('search', e.target.value)} />
        {filters.search && (
          <button onClick={() => set('search', '')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <X size={13} />
          </button>
        )}
      </div>
      <select className="input py-2.5 text-sm w-40" value={filters.status || ''} onChange={e => set('status', e.target.value)}>
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <select className="input py-2.5 text-sm w-40" value={filters.priority || ''} onChange={e => set('priority', e.target.value)}>
        <option value="">All Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <select className="input py-2.5 text-sm w-44" value={filters.projectId || ''} onChange={e => set('projectId', e.target.value)}>
        <option value="">All Projects</option>
        {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
      </select>
    </div>
  );
};

export default TaskFilters;
