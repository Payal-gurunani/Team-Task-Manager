import { useState, useEffect } from 'react';
import { CheckSquare, Clock, AlertCircle, ListTodo, FolderKanban, TrendingUp } from 'lucide-react';
import { getDashboardStats } from '../api/tasks';
import { getProjects } from '../api/projects';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/dashboard/StatsCard';
import RecentTasks from '../components/dashboard/RecentTasks';
import Spinner from '../components/common/Spinner';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsRes, projRes] = await Promise.all([getDashboardStats(), getProjects()]);
        setStats(statsRes.data.stats);
        setRecentTasks(statsRes.data.recentTasks);
        setProjects(projRes.data.projects);
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>
  );

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting}, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-gray-500 mt-1">Here's what's happening with your team today</p>
        </div>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link to="/projects" className="btn-primary">
              <FolderKanban size={16} /> New Project
            </Link>
          )}
          <Link to="/tasks" className="btn-secondary">
            <ListTodo size={16} /> View Tasks
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Tasks" value={stats?.total ?? 0} icon={ListTodo} color="brand" sub="All assigned tasks" />
        <StatsCard title="In Progress" value={stats?.inProgress ?? 0} icon={TrendingUp} color="blue" sub="Currently active" />
        <StatsCard title="Completed" value={stats?.completed ?? 0} icon={CheckSquare} color="emerald" sub="Successfully done" />
        <StatsCard title="Overdue" value={stats?.overdue ?? 0} icon={AlertCircle} color="red" sub="Need attention" />
      </div>

      {/* Progress bar */}
      {stats?.total > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Overall Progress</h3>
            <span className="text-sm text-brand-500 font-medium">
              {Math.round(((stats.completed) / stats.total) * 100)}% complete
            </span>
          </div>
          <div className="h-3 bg-surface-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-700"
              style={{ width: `${(stats.completed / stats.total) * 100}%` }} />
          </div>
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            {[
              { label: 'Pending', val: stats.pending, color: 'bg-amber-400' },
              { label: 'In Progress', val: stats.inProgress, color: 'bg-blue-400' },
              { label: 'Completed', val: stats.completed, color: 'bg-emerald-400' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                {item.label}: <strong>{item.val}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <RecentTasks tasks={recentTasks} />
        </div>

        {/* Projects Summary */}
        <div className="card">
          <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100">
            <h2 className="font-semibold text-gray-900">Projects</h2>
            <Link to="/projects" className="text-xs text-brand-500 font-medium">View all</Link>
          </div>
          <div className="p-4 space-y-3">
            {projects.slice(0, 5).map(p => (
              <div key={p._id} className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{p.title}</p>
                  <div className="h-1 bg-surface-100 rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full rounded-full transition-all"
                      style={{ width: `${p.taskCount ? (p.completedCount / p.taskCount) * 100 : 0}%`, backgroundColor: p.color }} />
                  </div>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{p.completedCount}/{p.taskCount}</span>
              </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No projects yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
