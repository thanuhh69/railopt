import React, { useState, useEffect } from 'react';
import { UserCheck, Wrench, CheckCircle2, Clock, Upload, AlertCircle } from 'lucide-react';
import api from '../../utils/api';
import DetailModal from '../../components/DetailModal';
import CompletionModal from '../../components/CompletionModal';

export default function UserDashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [completionTaskId, setCompletionTaskId] = useState(null);

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks/my-tasks');
      if (res.data?.success) setTasks(res.data.tasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const assignedCount = tasks.length;
  const pendingCount = tasks.filter(t => t.status !== 'COMPLETED' && t.status !== 'VERIFICATION_PENDING').length;
  const verificationCount = tasks.filter(t => t.status === 'VERIFICATION_PENDING').length;
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#002B49] rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30 mb-2">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            Field Maintenance Staff Task Execution Portal
          </div>
          <h2 className="text-2xl font-black tracking-tight">Assigned Maintenance Tasks</h2>
          <p className="text-xs text-slate-300 mt-1 font-medium">
            Review assigned maintenance activities, perform section work, and click <strong>"Mark as Completed"</strong> to upload completion notes & evidence photos.
          </p>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Total Tasks</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{assignedCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Pending Work</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Verification Pending</div>
          <div className="text-2xl font-black text-purple-600 mt-1">{verificationCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase">Verified Completed</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{completedCount}</div>
        </div>
      </div>

      {/* Assigned Tasks Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-600" /> Maintenance Work Orders
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Task ID</th>
                <th className="py-3 px-4">Maintenance Task</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Asset Name</th>
                <th className="py-3 px-4">Corridor</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Scheduled Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Completion Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 font-medium">Loading maintenance tasks...</td>
                </tr>
              ) : tasks.length > 0 ? (
                tasks.map((task) => {
                  const isCompleted = task.status === 'COMPLETED';
                  const isPendingVerification = task.status === 'VERIFICATION_PENDING';

                  return (
                    <tr key={task.taskId} className="hover:bg-slate-50 transition-colors">
                      <td
                        onClick={() => setSelectedTask(task)}
                        className="py-3 px-4 font-mono font-bold text-blue-700 hover:underline cursor-pointer"
                      >
                        {task.taskId}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {task.title || task.assetName || task.maintenanceType}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-600">{task.department}</td>
                      <td className="py-3 px-4">{task.assetName}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">{task.corridorId}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          (task.priorityLevel || '').toUpperCase() === 'CRITICAL' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {task.priorityLevel || 'HIGH'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">{task.dueDate}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          isCompleted ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                          isPendingVerification ? 'bg-purple-100 text-purple-800 border-purple-200' :
                          'bg-amber-100 text-amber-800 border-amber-200'
                        }`}>
                          {task.status || 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {isCompleted ? (
                          <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed ✓
                          </span>
                        ) : isPendingVerification ? (
                          <span className="inline-flex items-center gap-1 font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 text-xs">
                            <Clock className="w-3.5 h-3.5 text-purple-600" /> Verification Pending
                          </span>
                        ) : (
                          <button
                            onClick={() => setCompletionTaskId(task.taskId)}
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition-all cursor-pointer ml-auto"
                          >
                            <Upload className="w-3.5 h-3.5" /> Mark as Completed
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 font-medium">No assigned maintenance tasks found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DetailModal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title="Assigned Task Detail Inspection"
        data={selectedTask}
        type="task"
      />

      <CompletionModal
        isOpen={!!completionTaskId}
        onClose={() => setCompletionTaskId(null)}
        taskId={completionTaskId}
        onSuccess={() => fetchMyTasks()}
      />
    </div>
  );
}
