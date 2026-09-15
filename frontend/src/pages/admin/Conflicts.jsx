import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import api from '../../utils/api';

const DEFAULT_CONFLICTS = [
  {
    conflictId: 'CONF-001',
    corridorId: 'VJA-GNT',
    date: '2026-09-15',
    requestedBlockTime: '10:00–12:00',
    trainId: '12705 (Guntur Intercity Express)',
    conflictType: 'Train Conflict',
    description: 'Requested Engineering block (10:00–12:00) overlaps with Express 12705 passage at 10:45.',
    recommendedWindow: '11:30–13:00',
    reasoning: 'Lower train traffic window after Train 12705 departure. Enables multi-department coordination.',
    status: 'Open'
  }
];

export default function Conflicts() {
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConflicts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/conflicts');
      if (res.data?.success && res.data.conflicts?.length > 0) {
        setConflicts(res.data.conflicts);
      } else {
        setConflicts(DEFAULT_CONFLICTS);
      }
    } catch (err) {
      console.error('API Error, using fallback conflicts dataset:', err);
      setConflicts(DEFAULT_CONFLICTS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConflicts();
  }, []);

  const handleResolve = async (id, action) => {
    try {
      await api.post(`/conflicts/${id}/resolve`, { action });
      fetchConflicts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-600" />
            Conflict Detection & Resolution Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Identifies train movement overlaps, corridor schedule violations, and departmental request collisions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {loading ? (
          <div className="col-span-2 py-12 text-center text-xs text-slate-400">Scanning conflicts...</div>
        ) : conflicts.length > 0 ? (
          conflicts.map((conf) => (
            <div
              key={conf.conflictId}
              className={`bg-white rounded-xl border p-5 shadow-sm space-y-4 transition-all ${
                conf.status === 'Resolved'
                  ? 'border-emerald-200 bg-emerald-50/20'
                  : conf.status === 'Rejected'
                  ? 'border-slate-200 bg-slate-50/60 opacity-75'
                  : 'border-red-200 hover:border-red-300'
              }`}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                  <span className="font-extrabold text-xs text-red-900 uppercase tracking-wide">⚠ CONFLICT DETECTED</span>
                </div>
                <span className="font-mono text-xs font-bold text-slate-600">{conf.conflictId}</span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Corridor</div>
                  <div className="font-mono font-bold text-slate-900 mt-0.5">{conf.corridorId} ({conf.date})</div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Requested Block</div>
                  <div className="font-mono font-bold text-red-700 mt-0.5">{conf.requestedBlockTime}</div>
                </div>
              </div>

              {conf.trainId && (
                <div className="p-2.5 bg-red-50 rounded border border-red-100 text-xs text-red-950 font-medium">
                  <span className="font-bold">Conflicting Train:</span> {conf.trainId}
                </div>
              )}

              <p className="text-xs text-slate-700 font-normal leading-relaxed">{conf.description}</p>

              {/* Recommended Window */}
              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-blue-900">RECOMMENDED OPTIMIZED WINDOW</span>
                  <span className="font-mono font-extrabold bg-blue-600 text-white px-2 py-0.5 rounded text-xs">
                    {conf.recommendedWindow}
                  </span>
                </div>
                <p className="text-[11px] text-blue-950 font-medium">{conf.reasoning}</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between">
                <span className={`text-xs font-bold ${
                  conf.status === 'Resolved' ? 'text-emerald-700' : 'text-slate-500'
                }`}>
                  Status: {conf.status}
                </span>

                {conf.status === 'Open' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResolve(conf.conflictId, 'accept')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                    >
                      Accept Recommendation
                    </button>
                    <button
                      onClick={() => handleResolve(conf.conflictId, 'reject')}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 py-12 text-center text-xs text-slate-400 font-medium">
            No open conflicts detected across corridors.
          </div>
        )}
      </div>
    </div>
  );
}
