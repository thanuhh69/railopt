import React, { useState, useEffect } from 'react';
import { Clock, Plus, CheckCircle, XCircle } from 'lucide-react';
import api from '../../utils/api';

export default function BlockRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/block-requests');
      if (res.data?.success) setRequests(res.data.requests);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/block-requests/${id}/status`, { status });
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-600" />
            Block Demand Management (BDMS)
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Review departmental requests for maintenance blocks & disconnections.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Corridor</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Requested Time</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Reason</th>
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
              ) : requests.map((req) => (
                <tr key={req.requestId} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{req.requestId}</td>
                  <td className="py-3 px-4 font-semibold">{req.department}</td>
                  <td className="py-3 px-4 font-mono">{req.corridorId}</td>
                  <td className="py-3 px-4 font-mono">{req.requestedDate}</td>
                  <td className="py-3 px-4 font-mono font-bold">{req.startTime} – {req.endTime}</td>
                  <td className="py-3 px-4">{req.duration} mins</td>
                  <td className="py-3 px-4">{req.reason}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      req.priority === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {req.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold">{req.status}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleUpdateStatus(req.requestId, 'Approved')}
                        className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded font-bold hover:bg-emerald-200 text-[10px]"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(req.requestId, 'Rejected')}
                        className="px-2 py-1 bg-red-100 text-red-800 rounded font-bold hover:bg-red-200 text-[10px]"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
