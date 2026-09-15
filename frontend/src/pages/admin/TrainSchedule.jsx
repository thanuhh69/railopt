import React, { useState, useEffect } from 'react';
import { Train, ShieldAlert } from 'lucide-react';
import api from '../../utils/api';

export default function TrainSchedule() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrains() {
      try {
        const res = await api.get('/trains');
        if (res.data?.success) setTrains(res.data.trains);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTrains();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Train className="w-6 h-6 text-blue-600" />
            Train Timetable & Operations Register
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Simulated Control Office Application (COA) passenger and freight train schedules.
          </p>
        </div>

        <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          Prototype / Synthetic Data
        </span>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Train Number</th>
                <th className="py-3 px-4">Train Name</th>
                <th className="py-3 px-4">Corridor</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Arrival</th>
                <th className="py-3 px-4">Departure</th>
                <th className="py-3 px-4">Train Type</th>
                <th className="py-3 px-4">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 font-medium">Loading train schedules...</td>
                </tr>
              ) : trains.map((t) => (
                <tr key={`${t.trainNumber}_${t.date}`} className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{t.trainNumber}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{t.trainName}</td>
                  <td className="py-3 px-4 font-mono font-semibold">{t.corridorId}</td>
                  <td className="py-3 px-4 font-mono">{t.date}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{t.arrivalTime}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800">{t.departureTime}</td>
                  <td className="py-3 px-4 font-semibold">{t.trainType}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      t.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                    }`}>
                      {t.priority}
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
