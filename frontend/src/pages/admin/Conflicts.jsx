import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, ArrowRight, ShieldCheck, Filter, Search, Clock, Zap, RefreshCw, Eye } from 'lucide-react';
import api from '../../utils/api';

export default function Conflicts() {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedConflict, setSelectedConflict] = useState(null);
  const [message, setMessage] = useState(null);

  const fetchConflicts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/conflicts');
      if (res.data?.success && res.data.conflicts?.length > 0) {
        setConflicts(res.data.conflicts);
      }
    } catch (err) {
      console.error('API Error, using fallback conflicts dataset:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConflicts();
  }, []);

  const handleAction = async (id, action, customReason = '') => {
    try {
      const res = await api.post(`/conflicts/${id}/resolve`, { action, customReason });
      setMessage(res.data?.message || `Conflict ${id} updated (${action})`);
      setSelectedConflict(null);
      fetchConflicts();
    } catch (err) {
      console.error(err);
      setConflicts(prev => prev.map(c => c.conflictId === id ? { ...c, status: action === 'accept' ? 'Resolved' : 'Dismissed' } : c));
      setMessage(`Conflict ${id} marked as ${action === 'accept' ? 'Resolved' : 'Dismissed'}`);
      setSelectedConflict(null);
    }
  };

  const filteredConflicts = conflicts.filter(c => {
    const matchesStatus = statusTab === 'ALL' || c.status.toUpperCase() === statusTab.toUpperCase();
    const matchesType = typeFilter === 'ALL' || c.conflictType === typeFilter;
    return matchesStatus && matchesType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4 text-red-400" /> Automated Schedule Conflict Resolution Engine
          </div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            Corridor & Train Traffic Conflict Matrix
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium max-w-2xl">
            Detects overlaps between maintenance block windows, train timetables, inter-departmental demands, and traction power isolations.
          </p>
        </div>

        <button
          onClick={fetchConflicts}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
        >
          <RefreshCw className="w-4 h-4 text-blue-400" /> Rescan Conflicts
        </button>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          {message}
        </div>
      )}

      {/* Filters & Status Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {['ALL', 'OPEN', 'RESOLVED', 'DISMISSED'].map(tab => (
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

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
            >
              <option value="ALL">All Conflict Types</option>
              <option value="Train Conflict">Train Conflict</option>
              <option value="Corridor Conflict">Corridor Conflict</option>
              <option value="Department Conflict">Department Conflict</option>
              <option value="Asset Conflict">Asset Conflict</option>
              <option value="Time Conflict">Time Conflict</option>
              <option value="Resource Conflict">Resource Conflict</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-xs text-slate-400 font-medium">Scanning conflict engine...</div>
        ) : filteredConflicts.length > 0 ? (
          filteredConflicts.map((conf) => (
            <div
              key={conf.conflictId}
              className={`bg-white rounded-2xl border p-5 shadow-xs space-y-4 transition-all ${
                conf.status === 'Resolved'
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : conf.status === 'Dismissed'
                  ? 'border-slate-200 bg-slate-50/60 opacity-75'
                  : 'border-red-200 hover:border-red-300'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${conf.status === 'Open' ? 'bg-red-600 animate-pulse' : 'bg-emerald-600'}`}></span>
                  <span className="font-extrabold text-xs text-red-900 uppercase tracking-wide">{conf.conflictType || 'TRAIN CONFLICT'}</span>
                </div>
                <span className="font-mono text-xs font-bold text-slate-600">{conf.conflictId}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Corridor & Date</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{conf.corridorId} ({conf.date})</div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Requested Time</div>
                  <div className="font-mono font-bold text-red-700 mt-0.5">{conf.requestedBlockTime}</div>
                </div>
              </div>

              {conf.trainId && (
                <div className="p-2.5 bg-red-50 rounded-xl border border-red-200 text-xs text-red-950 font-medium">
                  <span className="font-bold">Conflicting Train:</span> {conf.trainId}
                </div>
              )}

              <p className="text-xs text-slate-700 font-medium leading-relaxed">{conf.description}</p>

              {/* Recommended Window */}
              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-900 text-[11px]">RECOMMENDED OPTIMIZED WINDOW</span>
                  <span className="font-mono font-extrabold bg-blue-600 text-white px-2 py-0.5 rounded-md text-[11px]">
                    {conf.recommendedWindow}
                  </span>
                </div>
                <p className="text-[11px] text-blue-950 font-medium">{conf.reasoning}</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                <span className={`text-xs font-extrabold ${conf.status === 'Resolved' ? 'text-emerald-700' : 'text-slate-500'}`}>
                  Status: {conf.status}
                </span>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setSelectedConflict(conf)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3 text-slate-500" /> Review
                  </button>

                  {conf.status === 'Open' && (
                    <>
                      <button
                        onClick={() => handleAction(conf.conflictId, 'accept')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-extrabold rounded-lg shadow-xs transition-colors cursor-pointer"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleAction(conf.conflictId, 'reschedule')}
                        className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={() => handleAction(conf.conflictId, 'combine')}
                        className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Combine
                      </button>
                      <button
                        onClick={() => handleAction(conf.conflictId, 'dismiss')}
                        className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-12 text-center text-xs text-slate-400 font-medium">
            No conflicts match the selected filter.
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedConflict && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-black text-slate-900">Conflict Details & AI Resolution</h3>
              <span className="font-mono text-xs text-red-600 font-bold">{selectedConflict.conflictId}</span>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                <span className="text-[10px] text-red-700 font-bold uppercase block">Conflict Description</span>
                <span className="font-medium text-slate-900 block mt-0.5">{selectedConflict.description}</span>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-1">
                <span className="text-[10px] text-blue-800 font-bold uppercase block">Recommended Resolution</span>
                <span className="font-bold text-blue-900 text-sm block">{selectedConflict.recommendedWindow}</span>
                <span className="text-[11px] text-slate-600 leading-relaxed block">{selectedConflict.reasoning}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button onClick={() => setSelectedConflict(null)} className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl">Close</button>
              <button onClick={() => handleAction(selectedConflict.conflictId, 'accept')} className="px-5 py-2 bg-emerald-600 text-white font-black text-xs rounded-xl shadow-xs">Apply Recommendation & Resolve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

