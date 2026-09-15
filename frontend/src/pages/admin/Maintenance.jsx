import React, { useState, useEffect } from 'react';
import { Search, Filter, Wrench, Sparkles, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../utils/api';
import DetailModal from '../../components/DetailModal';

export default function Maintenance() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [prioFilter, setPrioFilter] = useState('All');
  const [corridorFilter, setCorridorFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [selectedTask, setSelectedTask] = useState(null);
  const [prioritizing, setPrioritizing] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 15,
        search: search.trim(),
        department: deptFilter,
        priority: prioFilter,
        corridor: corridorFilter
      };
      const res = await api.get('/maintenance', { params });
      if (res.data?.success) {
        setTasks(res.data.tasks);
        setTotalPages(res.data.totalPages);
        setTotalTasks(res.data.total);
      }
    } catch (err) {
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [page, deptFilter, prioFilter, corridorFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTasks();
  };

  const handlePrioritizeAll = async () => {
    try {
      setPrioritizing(true);
      setMessage(null);
      const res = await api.post('/maintenance/prioritize-all');
      if (res.data?.success) {
        setMessage(res.data.message);
        fetchTasks();
      }
    } catch (err) {
      console.error('Prioritize error:', err);
    } finally {
      setPrioritizing(false);
    }
  };

  const getPriorityBadge = (level) => {
    const map = {
      CRITICAL: 'bg-red-100 text-red-800 border-red-200',
      HIGH: 'bg-amber-100 text-amber-800 border-amber-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      LOW: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return map[level] || 'bg-slate-100 text-slate-800 border-slate-200';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-600" />
            Maintenance Task Register
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Centralized register of Engineering, Traction, and Signal defects with Grok AI & Fallback Priority Analysis.
          </p>
        </div>

        <button
          onClick={handlePrioritizeAll}
          disabled={prioritizing}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          {prioritizing ? 'Calculating Priority Scores...' : 'Recalculate Priorities (Grok/Engine)'}
        </button>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {message}
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Task ID, Asset, Defect..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-500 mr-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </div>

          <select
            value={deptFilter}
            onChange={(e) => { setDeptFilter(e.target.value); setPage(1); }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Traction Distribution">Traction Distribution</option>
            <option value="Signal & Telecommunication">Signal & Telecommunication</option>
          </select>

          <select
            value={prioFilter}
            onChange={(e) => { setPrioFilter(e.target.value); setPage(1); }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
          >
            <option value="All">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>

          <select
            value={corridorFilter}
            onChange={(e) => { setCorridorFilter(e.target.value); setPage(1); }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium"
          >
            <option value="All">All Corridors</option>
            <option value="VJA-GNT">VJA-GNT (Vijayawada-Guntur)</option>
            <option value="NDL-GNT">NDL-GNT (Nandyal-Guntur)</option>
            <option value="BZA-RU">BZA-RU (Vijayawada-Renigunta)</option>
            <option value="SC-KZJ">SC-KZJ (Secunderabad-Kazipet)</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Task ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Corridor</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-center">Score</th>
                <th className="py-3 px-4 text-center">Priority</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 font-medium">Loading maintenance tasks from MongoDB...</td>
                </tr>
              ) : tasks.length > 0 ? (
                tasks.map((task) => (
                  <tr
                    key={task.taskId}
                    onClick={() => setSelectedTask(task)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">{task.taskId}</td>
                    <td className="py-3 px-4 font-medium">{task.department}</td>
                    <td className="py-3 px-4">{task.assetName}</td>
                    <td className="py-3 px-4 font-mono font-semibold">{task.corridorId}</td>
                    <td className="py-3 px-4">{task.maintenanceType}</td>
                    <td className="py-3 px-4 font-mono">{task.dueDate}</td>
                    <td className="py-3 px-4 text-center font-extrabold text-slate-900">{task.priorityScore || 50}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${getPriorityBadge(task.priorityLevel)}`}>
                        {task.priorityLevel || 'MEDIUM'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-600">{task.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 font-medium">No matching maintenance tasks found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>Showing {tasks.length} of {totalTasks} records</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-1.5 rounded bg-white border border-slate-200 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-1.5 rounded bg-white border border-slate-200 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <DetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title="Maintenance Task Details"
        data={selectedTask}
        type="task"
      />
    </div>
  );
}
