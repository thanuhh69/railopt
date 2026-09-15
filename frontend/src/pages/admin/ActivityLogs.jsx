import React, { useState, useEffect } from 'react';
import { History, Shield, User, Clock } from 'lucide-react';
import api from '../../utils/api';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true);
        const res = await api.get('/activity-logs');
        if (res.data?.success) setLogs(res.data.logs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-purple-600" />
            Audit Activity Log
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            System audit trail recording user registrations, task assignments, work starts, completion submissions, and admin verifications.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Task ID</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400 font-medium">Loading activity audit log...</td>
                </tr>
              ) : logs.map((log) => (
                <tr key={log._id} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">{log.user}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{log.action}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{log.description}</td>
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{log.taskId || '—'}</td>
                  <td className="py-3 px-4 font-mono text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
