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

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Wrench className="w-4 h-4 text-white" />
            + Create & Assign Task
          </button>
          <button
            onClick={handlePrioritizeAll}
            disabled={prioritizing}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            {prioritizing ? 'Calculating...' : 'Recalculate Priorities (Engine)'}
          </button>
        </div>
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

      {/* Admin Task Creation Modal */}
      {showCreateModal && (
        <CreateTaskModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => { setMessage('Task created & allocated to user successfully!'); fetchTasks(); }}
        />
      )}
    </div>
  );
}

function CreateTaskModal({ isOpen, onClose, onSuccess }) {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [maintenanceType, setMaintenanceType] = useState('Rail Defect Repair');
  const [priorityLevel, setPriorityLevel] = useState('CRITICAL');
  const [baseCity, setBaseCity] = useState('Vijayawada');
  const [railwayDivision, setRailwayDivision] = useState('Vijayawada Division');
  const [zone, setZone] = useState('Vijayawada Area');
  const [corridorId, setCorridorId] = useState('VJA-GNT');
  const [section, setSection] = useState('VJA-GDL');
  const [maintenanceLocation, setMaintenanceLocation] = useState('Track Section A-17');
  const [assetId, setAssetId] = useState('TRK-VJA-A17');
  const [assetName, setAssetName] = useState('Track Section A-17');
  const [dueDate, setDueDate] = useState('2026-09-17');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endTime, setEndTime] = useState('12:00 PM');
  const [assignedUserEmail, setAssignedUserEmail] = useState('user@railopt.demo');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const taskObj = {
        title,
        description: `${maintenanceType} required at ${maintenanceLocation} along ${corridorId} corridor.`,
        department,
        maintenanceType,
        priorityLevel,
        baseCity,
        railwayDivision,
        zone,
        corridorId,
        section,
        maintenanceLocation,
        location: maintenanceLocation,
        assetId,
        assetName,
        dueDate,
        startTime,
        endTime,
        assignedUserEmail,
        assignedUserName: 'Ravi Kumar (SSE)',
        status: 'ASSIGNED'
      };

      const res = await api.post('/tasks', taskObj);
      if (res.data?.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full overflow-hidden my-6">
        <div className="px-6 py-4 bg-[#002B49] text-white flex items-center justify-between">
          <h3 className="text-base font-black tracking-tight">Create & Allocate Maintenance Work Order</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white font-bold text-sm">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Work Order Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Track Inspection & Defect Joint Repair"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-900 focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Department *</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
              >
                <option value="Engineering">Engineering</option>
                <option value="Traction Distribution">Traction Distribution</option>
                <option value="Signal & Telecommunication">Signal & Telecommunication</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Priority Level *</label>
              <select
                value={priorityLevel}
                onChange={(e) => setPriorityLevel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-bold text-red-700"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </select>
            </div>
          </div>

          {/* Railway Location Hierarchy */}
          <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 space-y-3">
            <span className="font-black text-blue-900 uppercase text-[11px] block">Mandatory Railway Location Hierarchy</span>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Base City</label>
                <input type="text" required value={baseCity} onChange={(e) => setBaseCity(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Railway Division</label>
                <input type="text" required value={railwayDivision} onChange={(e) => setRailwayDivision(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Assigned Corridor</label>
                <input type="text" required value={corridorId} onChange={(e) => setCorridorId(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono font-bold text-blue-700" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Maintenance Location</label>
                <input type="text" required value={maintenanceLocation} onChange={(e) => setMaintenanceLocation(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-bold text-blue-900" />
              </div>
            </div>
          </div>

          {/* Schedule & Asset */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Asset ID</label>
              <input type="text" required value={assetId} onChange={(e) => setAssetId(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono font-bold" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Schedule Date</label>
              <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono font-bold" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Assign User</label>
              <input type="text" required value={assignedUserEmail} onChange={(e) => setAssignedUserEmail(e.target.value)} className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-blue-700" />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-100 font-bold text-xs rounded-xl">Cancel</button>
            <button type="submit" disabled={submitting} className="px-5 py-2 bg-emerald-600 text-white font-black text-xs rounded-xl shadow-md">
              {submitting ? 'Creating...' : 'Create & Allocate Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
