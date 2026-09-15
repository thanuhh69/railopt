import React, { useState, useEffect } from 'react';
import { GitCommit, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import api from '../../utils/api';

export default function Corridors() {
  const [corridors, setCorridors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCorridors() {
      try {
        const res = await api.get('/corridors');
        if (res.data?.success) setCorridors(res.data.corridors);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCorridors();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <GitCommit className="w-6 h-6 text-purple-600" />
            Corridor Availability Register
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Operational maintenance windows and traffic density across railway section corridors.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Corridor ID</th>
                <th className="py-3 px-4">From Location</th>
                <th className="py-3 px-4">To Location</th>
                <th className="py-3 px-4">Target Date</th>
                <th className="py-3 px-4">Available Start</th>
                <th className="py-3 px-4">Available End</th>
                <th className="py-3 px-4 text-center">Train Density</th>
                <th className="py-3 px-4">Traffic Level</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 font-medium">Loading corridors...</td>
                </tr>
              ) : corridors.map((cor) => (
                <tr key={`${cor.corridorId}_${cor.date}`} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{cor.corridorId}</td>
                  <td className="py-3 px-4 font-semibold">{cor.fromLocation}</td>
                  <td className="py-3 px-4 font-semibold">{cor.toLocation}</td>
                  <td className="py-3 px-4 font-mono">{cor.date}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">{cor.availableStart}</td>
                  <td className="py-3 px-4 font-mono font-bold text-emerald-700">{cor.availableEnd}</td>
                  <td className="py-3 px-4 text-center font-bold">{cor.trainCount} Trains</td>
                  <td className="py-3 px-4 font-semibold">{cor.trafficLevel}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {cor.availabilityStatus}
                    </span>
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
