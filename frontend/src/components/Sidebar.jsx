import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Wrench, 
  GitCommit, 
  Train, 
  Clock, 
  Layers, 
  AlertTriangle, 
  ShieldCheck,
  CalendarDays, 
  CalendarRange, 
  BarChart3, 
  FileSpreadsheet, 
  History,
  LogOut,
  TrainFront
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Data Integration', path: '/admin/data-integration', icon: Database },
    { name: 'Maintenance', path: '/admin/maintenance', icon: Wrench },
    { name: 'Verification', path: '/admin/verification', icon: ShieldCheck },
    { name: 'Corridors', path: '/admin/corridors', icon: GitCommit },
    { name: 'Train Schedule', path: '/admin/trains', icon: Train },
    { name: 'Block Requests', path: '/admin/block-requests', icon: Clock },
    { name: 'Block Planning', path: '/admin/planning', icon: Layers },
    { name: 'Conflicts', path: '/admin/conflicts', icon: AlertTriangle },
    { name: 'Weekly Plan', path: '/admin/weekly-plan', icon: CalendarDays },
    { name: 'Monthly Plan', path: '/admin/monthly-plan', icon: CalendarRange },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { name: 'Reports', path: '/admin/reports', icon: FileSpreadsheet },
    { name: 'Activity Logs', path: '/admin/activity-logs', icon: History }
  ];

  const userNavItems = [
    { name: 'Dashboard', path: '/user/dashboard', icon: LayoutDashboard },
    { name: 'My Work Orders', path: '/user/my-tasks', icon: Wrench },
    { name: 'Schedule Timeline', path: '/user/schedule', icon: CalendarDays },
    { name: 'My Employee Profile', path: '/user/profile', icon: Train }
  ];

  const isUser = (user?.role || '').toUpperCase() === 'USER';
  const navItems = isUser ? userNavItems : adminNavItems;

  return (
    <aside className="w-64 bg-[#0A192F] text-slate-200 flex flex-col h-screen sticky top-0 border-r border-slate-800 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30 font-bold">
          <TrainFront className="w-6 h-6" />
        </div>
        <div>
          <div className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
            RAILOPT
          </div>
          <p className="text-[11px] text-slate-400 font-medium tracking-wide uppercase">
            Block Planning System
          </p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600/90 text-white shadow-md shadow-blue-900/40'
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 text-slate-400 group-hover:text-white shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / User & Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
        <div className="px-3 py-2 mb-2 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="truncate">
            <div className="text-xs font-semibold text-slate-200 truncate">{user?.name || user?.fullName || 'Admin User'}</div>
            <div className="text-[10px] text-blue-400 font-medium uppercase">{user?.role || 'ADMIN'} Portal</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
