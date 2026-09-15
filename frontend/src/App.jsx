import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

import Dashboard from './pages/admin/Dashboard';
import DataIntegration from './pages/admin/DataIntegration';
import Maintenance from './pages/admin/Maintenance';
import CompletionVerification from './pages/admin/CompletionVerification';
import Corridors from './pages/admin/Corridors';
import TrainSchedule from './pages/admin/TrainSchedule';
import BlockRequests from './pages/admin/BlockRequests';
import BlockPlanning from './pages/admin/BlockPlanning';
import Conflicts from './pages/admin/Conflicts';
import WeeklyPlan from './pages/admin/WeeklyPlan';
import MonthlyPlan from './pages/admin/MonthlyPlan';
import Analytics from './pages/admin/Analytics';
import Reports from './pages/admin/Reports';
import ActivityLogs from './pages/admin/ActivityLogs';

import UserDashboard from './pages/user/UserDashboard';

function AdminLayout() {
  const location = useLocation();

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/admin/dashboard': return { title: 'Admin Executive Dashboard', subtitle: 'Real-time Maintenance KPIs & Coordinated Block Summary' };
      case '/admin/data-integration': return { title: 'Data Integration Hub', subtitle: 'Simulated TMS, SMMS, TDMS, COA, BDMS Sources & Batch CSV Upload' };
      case '/admin/maintenance': return { title: 'Maintenance Task Register', subtitle: 'Engineering, Traction & Signal Defect Records & Priority Analysis' };
      case '/admin/verification': return { title: 'Completion Verification', subtitle: 'Review Staff Inspection Notes & Uploaded Work Evidence Photos' };
      case '/admin/corridors': return { title: 'Corridor Availability Register', subtitle: 'Section Maintenance Windows & Traffic Density' };
      case '/admin/trains': return { title: 'Train Timetable Register', subtitle: 'Synthetic Passenger & Freight Train Schedules' };
      case '/admin/block-requests': return { title: 'Block Demand Management', subtitle: 'Departmental Requests for Maintenance Disconnections' };
      case '/admin/planning': return { title: 'Optimized Block Planning', subtitle: 'Multi-Department Coordinated Schedule Engine' };
      case '/admin/conflicts': return { title: 'Conflict Detection & Resolution', subtitle: 'Train Movement & Corridor Window Collision Audit' };
      case '/admin/weekly-plan': return { title: 'Weekly Maintenance Block Schedule', subtitle: 'Monday–Sunday Coordinated Block Matrix' };
      case '/admin/monthly-plan': return { title: 'Monthly Maintenance Calendar', subtitle: '30-Day Disconnection Schedule View' };
      case '/admin/analytics': return { title: 'Performance Analytics', subtitle: 'Department Breakdown & Block Utilization Metrics' };
      case '/admin/reports': return { title: 'Reports & Export Center', subtitle: 'Download CSV Schedules and Audit Logs' };
      case '/admin/activity-logs': return { title: 'System Audit Activity Trail', subtitle: 'Complete Log of System Registrations, Assignments & Approvals' };
      default: return { title: 'RAILOPT System', subtitle: 'Automatic Railway Maintenance Block Planning System' };
    }
  };

  const { title, subtitle } = getPageTitle(location.pathname);

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="data-integration" element={<DataIntegration />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="verification" element={<CompletionVerification />} />
            <Route path="corridors" element={<Corridors />} />
            <Route path="trains" element={<TrainSchedule />} />
            <Route path="block-requests" element={<BlockRequests />} />
            <Route path="planning" element={<BlockPlanning />} />
            <Route path="conflicts" element={<Conflicts />} />
            <Route path="weekly-plan" element={<WeeklyPlan />} />
            <Route path="monthly-plan" element={<MonthlyPlan />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="reports" element={<Reports />} />
            <Route path="activity-logs" element={<ActivityLogs />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function UserLayout() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header title="RAILOPT User Portal" subtitle="Field Maintenance Staff Task Execution Portal" />
      <main className="max-w-7xl mx-auto py-6">
        <Routes>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/user/*" element={<UserLayout />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
