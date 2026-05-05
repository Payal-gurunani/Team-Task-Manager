import { useState, useEffect } from 'react';
import { Plus, CheckSquare, LayoutGrid, List } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { getProjects } from '../api/projects';
import TaskCard from '../components/tasks/TaskCard';
import TaskForm from '../components/tasks/TaskForm';
import TaskFilters from '../components/tasks/TaskFilters';
import Modal from '../components/common/Modal';
import EmptyState from '../components/common/EmptyState';
import Spinner from '../components/common/Spinner';
import toast from 'react-hot-toast';

const Tasks = () => {
  const { isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({ projectId: searchParams.get('projectId') || '' });
  const [projects, setProjects] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const { tasks, loading, createTask, updateTask, deleteTask } = useTasks(filters);

  useEffect(() => {
    getProjects().then(({ data }) => setProjects(data.projects));
  }, []);

  const handleStatusChange = async (id, status) => {
    try { await updateTask(id, { status }); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try { await deleteTask(id); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed to delete'); }
  };

  const groupedTasks = {
    pending: tasks.filter(t => t.status === 'pending'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed'),
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500 mt-1">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowCreate(true)} className="btn-primary">
            <Plus size={16} /> New Task
          </button>
        )}
      </div>

      {/* Filters */}
      <TaskFilters filters={filters} onChange={setFilters} projects={projects} />

      {loading ? (
        <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
      ) : tasks.length === 0 ? (
        <EmptyState icon={CheckSquare} title="No tasks found" description="No tasks match your filters."
          action={isAdmin && <button onClick={() => setShowCreate(true)} className="btn-primary"><Plus size={16} /> Create Task</button>} />
      ) : (
        /* Kanban-style columns */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            { key: 'pending', label: 'Pending', color: 'bg-amber-400', tasks: groupedTasks.pending },
            { key: 'in_progress', label: 'In Progress', color: 'bg-blue-400', tasks: groupedTasks.in_progress },
            { key: 'completed', label: 'Completed', color: 'bg-emerald-400', tasks: groupedTasks.completed },
          ].map(col => (
            <div key={col.key} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                <h3 className="font-semibold text-gray-700 text-sm">{col.label}</h3>
                <span className="ml-auto text-xs bg-surface-100 text-gray-500 rounded-full px-2 py-0.5 font-medium">
                  {col.tasks.length}
                </span>
              </div>
              <div className="space-y-3">
                {col.tasks.map(task => (
                  <TaskCard key={task._id} task={task}
                    onEdit={setEditTask}
                    onDelete={handleDelete}
                    onStatusChange={handleStatusChange} />
                ))}
                {col.tasks.length === 0 && (
                  <div className="border-2 border-dashed border-surface-200 rounded-xl p-6 text-center text-sm text-gray-400">
                    No {col.label.toLowerCase()} tasks
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Task" size="lg">
        <TaskForm preSelectedProject={filters.projectId}
          onSubmit={async (d) => { await createTask(d); setShowCreate(false); }}
          onCancel={() => setShowCreate(false)} />
      </Modal>

      <Modal isOpen={!!editTask} onClose={() => setEditTask(null)} title="Edit Task" size="lg">
        {editTask && (
          <TaskForm initial={editTask}
            onSubmit={async (d) => { await updateTask(editTask._id, d); setEditTask(null); }}
            onCancel={() => setEditTask(null)} />
        )}
      </Modal>
    </div>
  );
};

export default Tasks;
