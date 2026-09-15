import React, { useState, useEffect } from 'react';
import { Train, ShieldAlert } from 'lucide-react';
import api from '../../utils/api';

const DEFAULT_TRAINS = [
  { trainNumber: '12705', trainName: 'Guntur Intercity Express', corridorId: 'VJA-GNT', date: '2026-09-15', arrivalTime: '10:35', departureTime: '10:45', trainType: 'Express', priority: 'High' },
  { trainNumber: '17239', trainName: 'Simhadri Express', corridorId: 'VJA-GNT', date: '2026-09-15', arrivalTime: '14:15', departureTime: '14:25', trainType: 'Express', priority: 'High' },
  { trainNumber: '12711', trainName: 'Pinakini Express', corridorId: 'BZA-RU', date: '2026-09-15', arrivalTime: '06:10', departureTime: '06:20', trainType: 'Superfast', priority: 'High' },
  { trainNumber: '12704', trainName: 'Falaknuma Express', corridorId: 'SC-KZJ', date: '2026-09-15', arrivalTime: '08:45', departureTime: '08:55', trainType: 'Superfast', priority: 'High' },
  { trainNumber: '57305', trainName: 'Guntur Passenger', corridorId: 'VJA-GNT', date: '2026-09-15', arrivalTime: '09:10', departureTime: '09:20', trainType: 'Passenger', priority: 'Medium' },
  { trainNumber: '12805', trainName: 'Jan Shatabdi Express', corridorId: 'VSKP-BZA', date: '2026-09-15', arrivalTime: '11:00', departureTime: '11:10', trainType: 'Superfast', priority: 'High' },
  { trainNumber: '17226', trainName: 'Amaravati Express', corridorId: 'NDL-GNT', date: '2026-09-15', arrivalTime: '13:30', departureTime: '13:40', trainType: 'Express', priority: 'High' },
  { trainNumber: '57201', trainName: 'Vijayawada Passenger', corridorId: 'BZA-RU', date: '2026-09-15', arrivalTime: '15:20', departureTime: '15:30', trainType: 'Passenger', priority: 'Medium' },
  { trainNumber: 'BOXN-88', trainName: 'Coal Freight Rake #88', corridorId: 'SC-KZJ', date: '2026-09-15', arrivalTime: '16:00', departureTime: '16:30', trainType: 'Freight', priority: 'Low' },
  { trainNumber: 'BCN-104', trainName: 'Grain Freight Rake #104', corridorId: 'VSKP-BZA', date: '2026-09-15', arrivalTime: '18:15', departureTime: '18:45', trainType: 'Freight', priority: 'Low' }
];

export default function TrainSchedule() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTrains() {
      try {
        const res = await api.get('/trains');
        if (res.data?.success && res.data.trains?.length > 0) {
          setTrains(res.data.trains);
        } else {
          setTrains(DEFAULT_TRAINS);
        }
      } catch (err) {
        console.error('API Error, using fallback train dataset:', err);
        setTrains(DEFAULT_TRAINS);
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
