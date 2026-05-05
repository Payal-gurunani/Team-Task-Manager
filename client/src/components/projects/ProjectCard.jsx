import { Trash2, Users, CheckSquare, Edit2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../common/Avatar';

const ProjectCard = ({ project, onDelete, onEdit, onClick }) => {
  const { isAdmin } = useAuth();
  const progress = project.taskCount > 0 ? Math.round((project.completedCount / project.taskCount) * 100) : 0;

  return (
    <div className="card group hover:-translate-y-1 transition-all duration-200 cursor-pointer" onClick={onClick}>
      {/* Color bar */}
      <div className="h-1.5 rounded-t-2xl" style={{ backgroundColor: project.color || '#6366f1' }} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate text-base">{project.title}</h3>
            {project.description && (
              <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{project.description}</p>
            )}
          </div>
          {isAdmin && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
              <button onClick={e => { e.stopPropagation(); onEdit(project); }}
                className="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors">
                <Edit2 size={13} />
              </button>
              <button onClick={e => { e.stopPropagation(); onDelete(project._id); }}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>{project.completedCount}/{project.taskCount} tasks</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="h-1.5 bg-surface-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: project.color || '#6366f1' }} />
          </div>
        </div>

        {/* Team */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Users size={13} className="text-gray-400" />
            <div className="flex -space-x-2">
              {project.teamMembers?.slice(0, 4).map(m => (
                <Avatar key={m._id} name={m.name} size="sm" className="ring-2 ring-white" />
              ))}
              {project.teamMembers?.length > 4 && (
                <div className="w-7 h-7 rounded-full bg-surface-200 ring-2 ring-white flex items-center justify-center text-xs text-gray-500 font-medium">
                  +{project.teamMembers.length - 4}
                </div>
              )}
            </div>
          </div>
          <span className={`badge text-xs ${project.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
            {project.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
