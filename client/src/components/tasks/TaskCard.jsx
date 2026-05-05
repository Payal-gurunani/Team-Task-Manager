import { Calendar, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import { STATUS_CONFIG, PRIORITY_CONFIG, formatDate, isOverdue, getDueDateLabel } from '../../utils/helpers';
import Avatar from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';

const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const { isAdmin } = useAuth();
  const st = STATUS_CONFIG[task.status];
  const pr = PRIORITY_CONFIG[task.priority];
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className={`card p-4 group hover:-translate-y-0.5 transition-all duration-200 ${overdue ? 'border-red-200 bg-red-50/30' : ''}`}>
      <div className="flex items-start gap-3">
        <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${st?.dot}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={`text-sm font-semibold text-gray-900 leading-tight ${task.status === 'completed' ? 'line-through text-gray-400' : ''}`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
              )}
            </div>
            {(isAdmin || true) && (
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => onEdit(task)} className="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors">
                  <Edit2 size={12} />
                </button>
                {isAdmin && (
                  <button onClick={() => onDelete(task._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {/* Project */}
            {task.projectId && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white"
                style={{ backgroundColor: task.projectId.color || '#6366f1' }}>
                {task.projectId.title}
              </span>
            )}
            {/* Priority */}
            <span className={`badge ${pr?.color} text-xs`}>{pr?.icon} {pr?.label}</span>
            {/* Status dropdown */}
            <select value={task.status} onChange={e => onStatusChange(task._id, e.target.value)}
              className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer outline-none ${st?.color}`}>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              {task.dueDate && (
                <div className={`flex items-center gap-1 text-xs ${overdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                  {overdue ? <AlertCircle size={11} /> : <Calendar size={11} />}
                  {getDueDateLabel(task.dueDate)}
                </div>
              )}
            </div>
            {task.assignedTo && <Avatar name={task.assignedTo.name} size="sm" />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
