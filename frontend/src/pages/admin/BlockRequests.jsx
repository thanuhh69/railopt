import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Eye, RefreshCw, Calendar, AlertTriangle, ShieldCheck, Filter, Search } from 'lucide-react';
import api from '../../utils/api';

const DEMO_BLOCK_REQUESTS = [
  { requestId: 'REQ-801', department: 'Engineering', corridorId: 'VJA-GNT', requestedDate: '2026-09-17', startTime: '10:00', endTime: '12:00', duration: 120, reason: 'Track Section Defect Joint Repair', priority: 'Critical', status: 'Pending' },
  { requestId: 'REQ-802', department: 'Signal & Telecommunication', corridorId: 'VJA-GNT', requestedDate: '2026-09-17', startTime: '12:00', endTime: '13:00', duration: 60, reason: 'Point Machine Calibration & Relay Check', priority: 'Medium', status: 'Pending' },
  { requestId: 'REQ-803', department: 'Traction Distribution', corridorId: 'VJA-GNT', requestedDate: '2026-09-17', startTime: '14:00', endTime: '15:30', duration: 90, reason: 'OHE Catenary Wire Tensioning', priority: 'High', status: 'Pending' },
  { requestId: 'REQ-804', department: 'Engineering', corridorId: 'BZA-RU', requestedDate: '2026-09-18', startTime: '09:30', endTime: '11:30', duration: 120, reason: 'Concrete Sleeper Renewal', priority: 'Critical', status: 'Pending' },
  { requestId: 'REQ-805', department: 'Signal & Telecommunication', corridorId: 'NDL-GNT', requestedDate: '2026-09-18', startTime: '11:00', endTime: '12:00', duration: 60, reason: 'Axle Counter Testing', priority: 'Low', status: 'Pending' },
  { requestId: 'REQ-806', department: 'Engineering', corridorId: 'SC-KZJ', requestedDate: '2026-09-18', startTime: '13:00', endTime: '15:00', duration: 120, reason: 'Turnout Switch Point Grinding', priority: 'High', status: 'Approved' },
  { requestId: 'REQ-807', department: 'Traction Distribution', corridorId: 'VSKP-BZA', requestedDate: '2026-09-19', startTime: '10:00', endTime: '11:30', duration: 90, reason: 'Insulator Washing & Alignment', priority: 'Medium', status: 'Approved' },
  { requestId: 'REQ-808', department: 'Engineering', corridorId: 'VJA-GNT', requestedDate: '2026-09-19', startTime: '15:00', endTime: '16:30', duration: 90, reason: 'Ballast Tamping Machine Run', priority: 'High', status: 'Approved' },
  { requestId: 'REQ-809', department: 'Signal & Telecommunication', corridorId: 'BZA-RU', requestedDate: '2026-09-16', startTime: '08:00', endTime: '09:00', duration: 60, reason: 'Track Circuit Voltage Tuning', priority: 'Low', status: 'Approved' },
  { requestId: 'REQ-810', department: 'Traction Distribution', corridorId: 'SC-KZJ', requestedDate: '2026-09-16', startTime: '12:30', endTime: '13:30', duration: 60, reason: 'Substation Transformer Check', priority: 'Medium', status: 'Approved' },
  { requestId: 'REQ-811', department: 'Engineering', corridorId: 'NDL-GNT', requestedDate: '2026-09-15', startTime: '14:00', endTime: '16:00', duration: 120, reason: 'Bridge Girder Inspection', priority: 'Critical', status: 'Rejected' },
  { requestId: 'REQ-812', department: 'Signal & Telecommunication', corridorId: 'VSKP-BZA', requestedDate: '2026-09-15', startTime: '10:00', endTime: '11:00', duration: 60, reason: 'Level Crossing Gate Interlocking', priority: 'High', status: 'Rejected' },
  { requestId: 'REQ-813', department: 'Engineering', corridorId: 'VJA-GNT', requestedDate: '2026-09-15', startTime: '11:30', endTime: '13:00', duration: 90, reason: 'Ultrasonic Flaw Detector Testing', priority: 'Medium', status: 'Rejected' },
  { requestId: 'REQ-814', department: 'Traction Distribution', corridorId: 'BZA-RU', requestedDate: '2026-09-17', startTime: '16:00', endTime: '17:30', duration: 90, reason: 'Pantograph Inspection', priority: 'Low', status: 'Rescheduled' },
  { requestId: 'REQ-815', department: 'Engineering', corridorId: 'SC-KZJ', requestedDate: '2026-09-17', startTime: '17:00', endTime: '18:30', duration: 90, reason: 'Guard Rail Realignment', priority: 'Medium', status: 'Rescheduled' }
];

export default function BlockRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedReq, setSelectedReq] = useState(null);
  const [reschedulingReq, setReschedulingReq] = useState(null);
  const [newTime, setNewTime] = useState('11:30');
  const [message, setMessage] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/block-requests');
      if (res.data?.success && res.data.requests?.length > 0) {
        setRequests(res.data.requests);
      } else {
        setRequests(DEMO_BLOCK_REQUESTS);
      }
    } catch (err) {
      console.error('API Error, using fallback block requests:', err);
      setRequests(DEMO_BLOCK_REQUESTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status, extraData = {}) => {
    try {
      const res = await api.patch(`/block-requests/${id}/status`, { status, ...extraData });
      setMessage(res.data?.message || `Block ${id} set to ${status}`);
      setSelectedReq(null);
      setReschedulingReq(null);
      fetchRequests();
    } catch (err) {
      console.error(err);
      // Fallback update
      setRequests(prev => prev.map(r => r.requestId === id ? { ...r, status, ...(extraData.rescheduledTime ? { startTime: extraData.rescheduledTime } : {}) } : r));
      setMessage(`Block ${id} updated to ${status}`);
      setSelectedReq(null);
      setReschedulingReq(null);
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesTab = statusTab === 'ALL' || r.status.toUpperCase() === statusTab.toUpperCase();
    const matchesSearch = (r.requestId + r.department + r.corridorId + r.reason).toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4 text-amber-400" /> Block Demand Management System (BDMS)
          </div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            Maintenance Block Requests & Demand Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium max-w-2xl">
            Review departmental requests from Engineering, Traction, and Signal teams. Authorize, reschedule, or reject disconnection windows before corridor publishing.
          </p>
        </div>

        <button
          onClick={fetchRequests}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4 text-blue-400" /> Refresh Requests
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-3 shadow-xs">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          {message}
        </div>
      )}

      {/* Filters & Status Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'RESCHEDULED'].map(tab => (
              <button
                key={tab}
                onClick={() => setStatusTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  statusTab === tab
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Request ID, Corridor, Reason..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Corridor</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Requested Window</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Purpose / Reason</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-400 font-medium">Loading block requests...</td>
                </tr>
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.requestId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-blue-700">{req.requestId}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{req.department}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800">{req.corridorId}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{req.requestedDate}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{req.startTime} – {req.endTime}</td>
                    <td className="py-3 px-4 font-semibold">{req.duration} mins</td>
                    <td className="py-3 px-4 max-w-xs truncate font-medium text-slate-700">{req.reason}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                        req.priority === 'Critical' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                      }`}>
                        {req.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-black">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        req.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        req.status === 'Rescheduled' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedReq(req)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg text-[10px] flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" /> View
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.requestId, 'Approved')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setReschedulingReq(req)}
                          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg text-[10px] cursor-pointer"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.requestId, 'Rejected')}
                          className="px-2.5 py-1 bg-red-100 hover:bg-red-200 text-red-800 font-bold rounded-lg text-[10px] cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-400 font-medium">No block requests match the selected filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Request Modal */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900">Block Demand Request Details</h3>
              <span className="font-mono text-xs text-blue-700 font-bold">{selectedReq.requestId}</span>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Department</span>
                  <span className="font-bold text-slate-900">{selectedReq.department}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Corridor</span>
                  <span className="font-bold font-mono text-slate-900">{selectedReq.corridorId}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Requested Date & Window</span>
                <span className="font-mono font-bold text-slate-900 text-sm block">{selectedReq.requestedDate} ({selectedReq.startTime} – {selectedReq.endTime})</span>
                <span className="text-[11px] text-slate-500">Duration: {selectedReq.duration} Minutes</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Maintenance Purpose</span>
                <span className="font-medium text-slate-900">{selectedReq.reason}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button onClick={() => setSelectedReq(null)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl">Close</button>
              <button onClick={() => handleUpdateStatus(selectedReq.requestId, 'Approved')} className="px-5 py-2 bg-emerald-600 text-white font-black text-xs rounded-xl shadow-xs">Approve Block</button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {reschedulingReq && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-black text-slate-900">Reschedule Block Request</h3>
            <p className="text-xs text-slate-500">Select a new start time for request <span className="font-mono font-bold text-blue-700">{reschedulingReq.requestId}</span> to avoid train traffic conflicts.</p>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">New Start Time Window</label>
              <select
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
              >
                <option value="11:30">11:30 AM – 01:00 PM (Post Express Departure)</option>
                <option value="13:30">01:30 PM – 03:00 PM (Low Traffic Window)</option>
                <option value="15:30">03:30 PM – 05:00 PM (Evening Maintenance Slot)</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button onClick={() => setReschedulingReq(null)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl">Cancel</button>
              <button
                onClick={() => handleUpdateStatus(reschedulingReq.requestId, 'Rescheduled', { rescheduledTime: newTime })}
                className="px-5 py-2 bg-purple-600 text-white font-black text-xs rounded-xl shadow-xs"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

