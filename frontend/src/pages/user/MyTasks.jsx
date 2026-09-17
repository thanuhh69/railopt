import React, { useState, useEffect } from 'react';
import { Wrench, Search, Filter, MapPin, Eye, PlayCircle, Upload, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import api from '../../utils/api';
import TaskDetailModal from '../../components/TaskDetailModal';
import CompletionModal from '../../components/CompletionModal';

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [inspectTask, setInspectTask] = useState(null);
  const [completionTaskId, setCompletionTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks/my-tasks');
      if (res.data?.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStartTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/start`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ASSIGNED' && (task.status === 'ASSIGNED' || task.status === 'Prioritized')) ||
      (statusFilter === 'IN_PROGRESS' && task.status === 'IN_PROGRESS') ||
      (statusFilter === 'VERIFICATION_PENDING' && task.status === 'VERIFICATION_PENDING') ||
      (statusFilter === 'COMPLETED' && task.status === 'COMPLETED') ||
      (statusFilter === 'OVERDUE' && (task.overdueDays > 0 || task.status === 'OVERDUE'));

    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      (task.taskId || '').toLowerCase().includes(q) ||
      (task.title || '').toLowerCase().includes(q) ||
      (task.assetName || '').toLowerCase().includes(q) ||
      (task.corridorId || '').toLowerCase().includes(q) ||
      (task.maintenanceLocation || '').toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#002B49] p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-400" />
            My Maintenance Work Orders
          </h1>
          <p className="text-xs text-blue-200 mt-1 font-medium">
            Complete assigned railway section work orders, start maintenance execution, and submit completion reports.
          </p>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1 text-xs">
          {['ALL', 'ASSIGNED', 'IN_PROGRESS', 'VERIFICATION_PENDING', 'COMPLETED', 'OVERDUE'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg font-extrabold uppercase transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Live Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID, Asset, Corridor, Location..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:border-blue-600"
          />
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Task ID</th>
                <th className="py-3 px-4">Task Title</th>
                <th className="py-3 px-4">City / Division</th>
                <th className="py-3 px-4">Corridor & Location</th>
                <th className="py-3 px-4">Asset Specs</th>
                <th className="py-3 px-4">Schedule</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 font-medium">Loading work orders...</td>
                </tr>
              ) : filteredTasks.length > 0 ? (
                filteredTasks.map((task) => {
                  const isCompleted = task.status === 'COMPLETED';
                  const isPendingVerification = task.status === 'VERIFICATION_PENDING';
                  const isInProgress = task.status === 'IN_PROGRESS';
                  const isAssigned = task.status === 'ASSIGNED' || task.status === 'Prioritized';

                  return (
                    <tr key={task.taskId} className="hover:bg-slate-50 transition-colors">
                      <td
                        onClick={() => setInspectTask(task)}
                        className="py-3 px-4 font-mono font-bold text-blue-700 hover:underline cursor-pointer"
                      >
                        {task.taskId}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{task.title || task.assetName || task.maintenanceType}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">
                        {task.baseCity || 'Vijayawada'} ({task.railwayDivision || 'Vijayawada Div'})
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-blue-700">{task.corridorId || 'VJA-GNT'}</div>
                        <div className="text-[11px] font-semibold text-slate-600">{task.maintenanceLocation || 'Track Section A-17'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-800">{task.assetName}</div>
                        <div className="font-mono text-[10px] text-slate-500">{task.assetId}</div>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        <div className="font-bold text-slate-900">{task.dueDate}</div>
                        <div className="text-[10px] font-extrabold text-emerald-700">{task.startTime || '10:00'} – {task.endTime || '12:00'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          (task.priorityLevel || '').toUpperCase() === 'CRITICAL' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {task.priorityLevel || 'HIGH'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                          isCompleted ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                          isPendingVerification ? 'bg-purple-100 text-purple-800 border-purple-200' :
                          isInProgress ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-amber-100 text-amber-800 border-amber-200'
                        }`}>
                          {task.status || 'ASSIGNED'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setInspectTask(task)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            title="Inspect Task"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {isAssigned && (
                            <button
                              onClick={() => handleStartTask(task.taskId)}
                              className="px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-[10px] font-extrabold cursor-pointer"
                            >
                              Start
                            </button>
                          )}

                          {(isInProgress || isAssigned) && (
                            <button
                              onClick={() => setCompletionTaskId(task.taskId)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-extrabold cursor-pointer"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 font-medium">No matching maintenance tasks found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TaskDetailModal
        isOpen={!!inspectTask}
        onClose={() => setInspectTask(null)}
        task={inspectTask}
        onStartTask={handleStartTask}
        onMarkCompleted={(id) => setCompletionTaskId(id)}
      />

      <CompletionModal
        isOpen={!!completionTaskId}
        onClose={() => setCompletionTaskId(null)}
        taskId={completionTaskId}
        onSuccess={() => fetchTasks()}
      />
    </div>
  );
}
