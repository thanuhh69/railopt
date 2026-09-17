import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldAlert, RefreshCw, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

export default function Header({ title, subtitle, onRefresh }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  const isUserPortal = location.pathname.startsWith('/user');

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data?.success) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [location.pathname]);

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-20 shadow-sm">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{title || 'RAILOPT System'}</h1>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            Prototype / Synthetic Simulation
          </span>
        </div>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5 font-medium">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Data
          </button>
        )}

        {/* Notification Bell Drawer */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) fetchNotifications();
            }}
            className="p-2 rounded-xl text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-xs font-black text-slate-900 uppercase">Operational Notifications</span>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {unreadCount} Unread
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 text-xs">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n._id || n.id}
                      onClick={() => handleMarkRead(n._id || n.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                        n.read ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-blue-50/70 border-blue-200 text-blue-950 font-semibold'
                      }`}
                    >
                      <div className="font-bold text-slate-900 text-xs">{n.title}</div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{n.message}</p>
                      <span className="text-[9px] font-mono text-slate-400 block mt-1">
                        {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-slate-400 text-xs font-medium">No new notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Info & Logout Button for User Portal */}
        {isUserPortal && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-900">{user?.fullName || user?.name || 'Field Staff User'}</div>
              <div className="text-[10px] font-semibold text-blue-600 uppercase">{user?.department || 'Engineering'} Staff</div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
