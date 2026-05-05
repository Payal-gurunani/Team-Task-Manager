import { useState, useEffect } from 'react';
import { UserPlus, X } from 'lucide-react';
import * as userApi from '../../api/users';
import Avatar from '../common/Avatar';
import toast from 'react-hot-toast';

const MemberManager = ({ project, onAddMember, onRemoveMember }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    userApi.getAllUsers().then(({ data }) => setAllUsers(data.users));
  }, []);

  const nonMembers = allUsers.filter(u =>
    !project.teamMembers.some(m => m._id === u._id) &&
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Current Members ({project.teamMembers.length})</p>
        <div className="space-y-2">
          {project.teamMembers.map(member => (
            <div key={member._id} className="flex items-center gap-3 p-2.5 bg-surface-50 rounded-xl">
              <Avatar name={member.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{member.name}</p>
                <p className="text-xs text-gray-400 capitalize">{member.role}</p>
              </div>
              <button onClick={() => onRemoveMember(member._id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Add Members</p>
        <input className="input mb-2" placeholder="Search users..." value={search}
          onChange={e => setSearch(e.target.value)} />
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {nonMembers.map(user => (
            <div key={user._id} className="flex items-center gap-3 p-2.5 hover:bg-surface-50 rounded-xl transition-colors">
              <Avatar name={user.name} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-400">{user.email}</p>
              </div>
              <button onClick={() => onAddMember(user._id)}
                className="p-1.5 text-brand-500 hover:bg-brand-50 rounded-lg transition-colors">
                <UserPlus size={14} />
              </button>
            </div>
          ))}
          {nonMembers.length === 0 && <p className="text-sm text-gray-400 text-center py-3">No users to add</p>}
        </div>
      </div>
    </div>
  );
};

export default MemberManager;
