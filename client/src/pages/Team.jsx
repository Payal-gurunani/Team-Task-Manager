import { useState, useEffect } from 'react';
import { Users, Shield, User, Mail, Calendar } from 'lucide-react';
import * as userApi from '../api/users';
import Avatar from '../components/common/Avatar';
import Spinner from '../components/common/Spinner';
import { formatDate } from '../utils/helpers';

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    userApi.getAllUsers().then(({ data }) => { setUsers(data.users); setLoading(false); });
  }, []);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const admins = filtered.filter(u => u.role === 'admin');
  const members = filtered.filter(u => u.role === 'member');

  if (loading) return <div className="flex items-center justify-center h-64"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-500 mt-1">{users.length} team member{users.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-gray-500">
            <Shield size={14} className="text-brand-500" /> {admins.length} Admin{admins.length !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1.5 text-gray-500">
            <User size={14} className="text-gray-400" /> {members.length} Member{members.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Search */}
      <input className="input max-w-sm" placeholder="Search team members..."
        value={search} onChange={e => setSearch(e.target.value)} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: users.length, color: 'text-brand-600', bg: 'bg-brand-50 border-brand-100' },
          { label: 'Admins', value: admins.length, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-100' },
          { label: 'Members', value: members.length, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
          { label: 'Active Today', value: users.length, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
        ].map(stat => (
          <div key={stat.label} className={`card p-5 border ${stat.bg}`}>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Member Grid */}
      <div>
        {[{ label: 'Admins', items: admins }, { label: 'Members', items: members }].map(({ label, items }) => (
          items.length > 0 && (
            <div key={label} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">{label}</h2>
                <div className="flex-1 h-px bg-surface-200" />
                <span className="text-xs text-gray-400">{items.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map(user => (
                  <div key={user._id} className="card p-5 hover:-translate-y-0.5 transition-transform duration-200">
                    <div className="flex items-start gap-4">
                      <Avatar name={user.name} size="lg" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                          <span className={`badge text-xs flex-shrink-0 ${user.role === 'admin' ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-600'}`}>
                            {user.role === 'admin' ? <Shield size={10} /> : <User size={10} />}
                            {user.role}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate">
                          <Mail size={11} /> {user.email}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                          <Calendar size={11} /> Joined {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Team;
