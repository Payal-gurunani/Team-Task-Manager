import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { STATUS_CONFIG, PRIORITY_CONFIG, formatDate, isOverdue } from '../../utils/helpers';
import Avatar from '../common/Avatar';

const RecentTasks = ({ tasks }) => (
  <div className="card">
    <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
      <h2 className="font-semibold text-gray-900">Recent Tasks</h2>
      <Link to="/tasks" className="text-xs text-brand-500 hover:text-brand-700 font-medium flex items-center gap-1">
        View all <ArrowRight size={12} />
      </Link>
    </div>
    <div className="divide-y divide-surface-50">
      {tasks.length === 0 ? (
        <div className="py-8 text-center text-sm text-gray-400">No tasks yet</div>
      ) : (
        tasks.map(task => {
          const st = STATUS_CONFIG[task.status];
          const pr = PRIORITY_CONFIG[task.priority];
          const overdue = isOverdue(task.dueDate, task.status);
          return (
            <div key={task._id} className="px-5 py-3.5 hover:bg-surface-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${st?.dot}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-gray-800 truncate">{task.title}</p>
                    <span className={`badge ${pr?.color} text-[10px] px-1.5 py-0.5`}>{pr?.icon} {pr?.label}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    {task.projectId && <span className="text-xs text-gray-400">{task.projectId.title}</span>}
                    {task.dueDate && (
                      <span className={`text-xs ${overdue ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
                        {overdue ? '⚠ ' : ''}{formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
                {task.assignedTo && <Avatar name={task.assignedTo.name} size="sm" />}
              </div>
            </div>
          );
        })
      )}
    </div>
  </div>
);

export default RecentTasks;
