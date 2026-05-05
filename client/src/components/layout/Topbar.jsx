import { useState, useEffect, useRef } from 'react';
import { Bell, Search, X, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import * as userApi from '../../api/users';
import { formatRelative } from '../../utils/helpers';
import toast from 'react-hot-toast';

const Topbar = ({ title }) => {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const { data } = await userApi.getNotifications();
        setNotifications(data.notifications);
      } catch {}
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    try {
      await userApi.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch { toast.error('Failed to mark notifications as read'); }
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-surface-200 flex items-center justify-between px-6 sticky top-0 z-20">
      <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      <div className="flex items-center gap-2">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2.5 text-gray-500 hover:text-gray-800 hover:bg-surface-100 rounded-xl transition-colors">
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-surface-200 overflow-hidden animate-scale-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-surface-100">
                <h3 className="font-semibold text-sm text-gray-900">Notifications</h3>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-brand-500 hover:text-brand-700 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-brand-50 transition-colors">
                      <Check size={12} /> Mark all read
                    </button>
                  )}
                  <button onClick={() => setNotifOpen(false)} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg">
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-sm text-gray-400">No notifications</div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif._id} className={`px-4 py-3 border-b border-surface-50 hover:bg-surface-50 transition-colors ${!notif.read ? 'bg-brand-50/50' : ''}`}>
                      <p className="text-sm text-gray-700">{notif.message}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatRelative(notif.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
