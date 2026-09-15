import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wrench, 
  AlertOctagon, 
  Clock, 
  GitCommit, 
  Layers, 
  AlertTriangle, 
  Play, 
  CheckCircle2, 
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import api from '../../utils/api';
import KPICard from '../../components/KPICard';
import SystemFlow from '../../components/SystemFlow';
import DetailModal from '../../components/DetailModal';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [demoRunning, setDemoRunning] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState('task');
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics');
      if (res.data?.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRunDemoScenario = async () => {
    try {
      setDemoRunning(true);
      const res = await api.post('/planning/demo-scenario');
      if (res.data?.success) {
        navigate('/admin/planning', { state: { demoSuccess: true, block: res.data.block } });
      }
    } catch (err) {
      console.error('Demo error:', err);
    } finally {
      setDemoRunning(false);
    }
  };

  const kpis = data?.kpis || {
    totalTasks: 1248,
    criticalTasks: 86,
    pendingRequests: 164,
    availableCorridors: 18,
    scheduledBlocks: 28,
    conflictsCount: 17
  };

  const deptStats = data?.deptStats || [
    { name: 'Engineering', count: 520, color: '#00529B' },
    { name: 'Traction Distribution', count: 380, color: '#D97706' },
    { name: 'Signal & Telecommunication', count: 348, color: '#059669' }
  ];

  const prioStats = data?.prioStats || [
    { name: 'Critical', count: 86, color: '#DC2626' },
    { name: 'High', count: 210, color: '#EA580C' },
    { name: 'Medium', count: 480, color: '#D97706' },
    { name: 'Low', count: 472, color: '#059669' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner with RUN DEMO SCENARIO Button */}
      <div className="bg-[#002B49] rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-200 border border-blue-400/30 mb-2">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            Automatic Railway Maintenance Block Planning System
          </div>
          <h2 className="text-2xl font-black tracking-tight">Executive Operations Dashboard</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl font-medium">
            Integrating maintenance requirements (TMS/SMMS/TDMS), corridor availability & train timetables (COA), and block requests (BDMS) to generate optimized coordinated block schedules.
          </p>
        </div>

        <button
          onClick={handleRunDemoScenario}
          disabled={demoRunning}
          className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-amber-950/40 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap animate-pulse-glow"
        >
          <Play className="w-5 h-5 fill-slate-950" />
          {demoRunning ? 'EXECUTING DEMO SCENARIO...' : 'RUN DEMO SCENARIO'}
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        <KPICard title="Total Tasks" value={kpis.totalTasks.toLocaleString()} icon={Wrench} color="blue" badgeText="MongoDB" />
        <KPICard title="Critical Tasks" value={kpis.criticalTasks.toLocaleString()} icon={AlertOctagon} color="red" badgeText="Urgent" />
        <KPICard title="Block Requests" value={kpis.pendingRequests.toLocaleString()} icon={Clock} color="amber" badgeText="BDMS" />
        <KPICard title="Corridors" value={kpis.availableCorridors.toLocaleString()} icon={GitCommit} color="purple" badgeText="Available" />
        <KPICard title="Scheduled Blocks" value={kpis.scheduledBlocks.toLocaleString()} icon={Layers} color="emerald" badgeText="Coordinated" />
        <KPICard title="Conflicts" value={kpis.conflictsCount.toLocaleString()} icon={AlertTriangle} color="red" badgeText="Action Required" />
      </div>

      {/* Visual System Flow Diagram */}
      <SystemFlow />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">
            Departmental Maintenance Task Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deptStats} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {deptStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-4">
            Priority Breakdown (Grok AI & Fallback Score)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={prioStats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#00529B" radius={[6, 6, 0, 0]}>
                  {prioStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row: Upcoming Blocks & Recent Conflicts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Blocks */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Upcoming Coordinated Blocks
            </h3>
            <button
              onClick={() => navigate('/admin/planning')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {data?.upcomingBlocks?.length > 0 ? (
              data.upcomingBlocks.map((block) => (
                <div
                  key={block.blockId}
                  onClick={() => { setSelectedItem(block); setModalType('block'); }}
                  className="py-3 flex items-center justify-between hover:bg-slate-50 px-2 rounded-lg cursor-pointer transition-colors"
                >
                  <div>
                    <div className="font-bold text-xs text-slate-900 flex items-center gap-2">
                      <span className="font-mono text-blue-600">{block.blockId}</span>
                      <span>{block.corridorId}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {block.departments?.join(' + ')} • {block.totalDuration} mins
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {block.startTime}–{block.endTime}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">{block.date}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No scheduled blocks generated yet. Click "RUN DEMO SCENARIO" or generate optimized plan.
              </div>
            )}
          </div>
        </div>

        {/* Recent Conflicts */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
              Recent Detected Conflicts
            </h3>
            <button
              onClick={() => navigate('/admin/conflicts')}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Review All <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {data?.recentConflicts?.length > 0 ? (
              data.recentConflicts.map((conf) => (
                <div key={conf.conflictId} className="p-3 bg-red-50/50 rounded-xl border border-red-100 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-red-900">{conf.conflictType}</span>
                      <span className="text-[10px] font-mono text-slate-500">{conf.corridorId}</span>
                    </div>
                    <p className="text-[11px] text-slate-700 mt-0.5 leading-snug">{conf.description}</p>
                    <div className="mt-2 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded inline-block">
                      Rec: {conf.recommendedWindow}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No open conflicts detected. System is running cleanly.
              </div>
            )}
          </div>
        </div>
      </div>

      <DetailModal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={modalType === 'task' ? 'Maintenance Task Detail' : 'Coordinated Block Detail'}
        data={selectedItem}
        type={modalType}
      />
    </div>
  );
}
