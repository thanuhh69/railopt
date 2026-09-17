import React, { useState, useEffect } from 'react';
import { Train, ShieldAlert, Search, Filter, RefreshCw } from 'lucide-react';
import api from '../../utils/api';

const DEFAULT_TRAINS = [
  { trainNumber: '12705', trainName: 'Guntur Intercity Express', corridorId: 'VJA-GNT', section: 'VJA-GDL-01', origin: 'Vijayawada (BZA)', destination: 'Guntur (GNT)', direction: 'DOWN', date: '2026-09-17', arrivalTime: '10:35 AM', departureTime: '10:45 AM', trainType: 'Express', priority: 'High', status: 'ON_TIME' },
  { trainNumber: '17239', trainName: 'Simhadri Express', corridorId: 'VJA-GNT', section: 'VJA-GDL-01', origin: 'Guntur (GNT)', destination: 'Visakhapatnam (VSKP)', direction: 'UP', date: '2026-09-17', arrivalTime: '02:15 PM', departureTime: '02:25 PM', trainType: 'Express', priority: 'High', status: 'ON_TIME' },
  { trainNumber: '12711', trainName: 'Pinakini Express', corridorId: 'BZA-RU', section: 'BZA-RU-01', origin: 'Vijayawada (BZA)', destination: 'Chennai Central (MAS)', direction: 'DOWN', date: '2026-09-17', arrivalTime: '06:10 AM', departureTime: '06:20 AM', trainType: 'Superfast', priority: 'High', status: 'ON_TIME' },
  { trainNumber: '12704', trainName: 'Falaknuma Express', corridorId: 'SC-KZJ', section: 'SC-KZJ-03', origin: 'Secunderabad (SC)', destination: 'Howrah (HWH)', direction: 'UP', date: '2026-09-17', arrivalTime: '08:45 AM', departureTime: '08:55 AM', trainType: 'Superfast', priority: 'High', status: 'ON_TIME' },
  { trainNumber: '57305', trainName: 'Guntur Passenger', corridorId: 'VJA-GNT', section: 'VJA-GDL-01', origin: 'Vijayawada (BZA)', destination: 'Guntur (GNT)', direction: 'DOWN', date: '2026-09-17', arrivalTime: '09:10 AM', departureTime: '09:20 AM', trainType: 'Passenger', priority: 'Medium', status: 'ON_TIME' },
  { trainNumber: '12805', trainName: 'Jan Shatabdi Express', corridorId: 'VSKP-BZA', section: 'VSKP-BZA-05', origin: 'Visakhapatnam (VSKP)', destination: 'Vijayawada (BZA)', direction: 'DOWN', date: '2026-09-17', arrivalTime: '11:00 AM', departureTime: '11:10 AM', trainType: 'Superfast', priority: 'High', status: 'ON_TIME' },
  { trainNumber: '17226', trainName: 'Amaravati Express', corridorId: 'NDL-GNT', section: 'NDL-GNT-02', origin: 'Vasco-da-Gama (VSG)', destination: 'Howrah (HWH)', direction: 'UP', date: '2026-09-17', arrivalTime: '01:30 PM', departureTime: '01:40 PM', trainType: 'Express', priority: 'High', status: 'ON_TIME' },
  { trainNumber: '57201', trainName: 'Vijayawada Passenger', corridorId: 'BZA-RU', section: 'BZA-RU-01', origin: 'Renigunta (RU)', destination: 'Vijayawada (BZA)', direction: 'UP', date: '2026-09-17', arrivalTime: '03:20 PM', departureTime: '03:30 PM', trainType: 'Passenger', priority: 'Medium', status: 'ON_TIME' },
  { trainNumber: 'BOXN-88', trainName: 'Coal Freight Rake #88', corridorId: 'SC-KZJ', section: 'SC-KZJ-03', origin: 'Singareni (STPD)', destination: 'NTTPS Power Plant', direction: 'DOWN', date: '2026-09-17', arrivalTime: '04:00 PM', departureTime: '04:30 PM', trainType: 'Freight', priority: 'Low', status: 'RUNNING' },
  { trainNumber: 'BCN-104', trainName: 'Grain Freight Rake #104', corridorId: 'VSKP-BZA', section: 'VSKP-BZA-05', origin: 'Visakhapatnam Port', destination: 'Vijayawada Goods Yard', direction: 'DOWN', date: '2026-09-17', arrivalTime: '06:15 PM', departureTime: '06:45 PM', trainType: 'Freight', priority: 'Low', status: 'RUNNING' },
  { trainNumber: '12702', trainName: 'Hussainsagar Express', corridorId: 'SC-KZJ', section: 'SC-KZJ-03', origin: 'Hyderabad (HYB)', destination: 'Mumbai CSMT', direction: 'UP', date: '2026-09-17', arrivalTime: '02:45 PM', departureTime: '02:55 PM', trainType: 'Superfast', priority: 'High', status: 'ON_TIME' },
  { trainNumber: '12760', trainName: 'Charminar Express', corridorId: 'BZA-RU', section: 'BZA-RU-01', origin: 'Hyderabad (HYB)', destination: 'Chennai Central', direction: 'DOWN', date: '2026-09-17', arrivalTime: '07:00 PM', departureTime: '07:15 PM', trainType: 'Express', priority: 'High', status: 'ON_TIME' },
  { trainNumber: '17255', trainName: 'Narsapur Express', corridorId: 'NDL-GNT', section: 'NDL-GNT-02', origin: 'Narsapur (NS)', destination: 'Hyderabad (HYB)', direction: 'UP', date: '2026-09-17', arrivalTime: '08:30 PM', departureTime: '08:40 PM', trainType: 'Express', priority: 'High', status: 'ON_TIME' },
  { trainNumber: '12727', trainName: 'Godavari Express', corridorId: 'VSKP-BZA', section: 'VSKP-BZA-05', origin: 'Visakhapatnam (VSKP)', destination: 'Hyderabad (HYB)', direction: 'UP', date: '2026-09-17', arrivalTime: '09:20 PM', departureTime: '09:35 PM', trainType: 'Superfast', priority: 'High', status: 'ON_TIME' },
  { trainNumber: '20833', trainName: 'Vande Bharat Express', corridorId: 'VSKP-BZA', section: 'VSKP-BZA-05', origin: 'Visakhapatnam (VSKP)', destination: 'Secunderabad (SC)', direction: 'UP', date: '2026-09-17', arrivalTime: '07:30 AM', departureTime: '07:35 AM', trainType: 'Vande Bharat', priority: 'CRITICAL HIGH', status: 'ON_TIME' },
  { trainNumber: 'CONTAINER-40', trainName: 'Concor Container Express', corridorId: 'VJA-GNT', section: 'VJA-GDL-01', origin: 'Chennai Port', destination: 'Concor ICD Guntur', direction: 'UP', date: '2026-09-17', arrivalTime: '11:45 AM', departureTime: '12:15 PM', trainType: 'Freight', priority: 'Medium', status: 'RUNNING' }
];

export default function TrainSchedule() {
  const [trains, setTrains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

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

  const filteredTrains = trains.filter(t => {
    const matchesSearch = (t.trainNumber + t.trainName + t.corridorId + (t.origin || '') + (t.destination || '')).toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'ALL' || t.trainType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Train className="w-4 h-4 text-blue-400" /> Control Office Application (COA) Integration
          </div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            Train Timetable & Operations Register
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium max-w-2xl">
            Live train movement timetable used by the block conflict resolution engine to schedule non-interfering maintenance windows.
          </p>
        </div>

        <span className="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-black flex items-center gap-1.5 self-start sm:self-auto">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          Demo / Synthetic Schedule Data
        </span>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Train #, Name, Corridor..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-blue-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold w-full sm:w-auto"
          >
            <option value="ALL">All Train Types</option>
            <option value="Vande Bharat">Vande Bharat</option>
            <option value="Superfast">Superfast</option>
            <option value="Express">Express</option>
            <option value="Passenger">Passenger</option>
            <option value="Freight">Freight Rakes</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Train Number</th>
                <th className="py-3 px-4">Train Name</th>
                <th className="py-3 px-4">Corridor & Section</th>
                <th className="py-3 px-4">Origin &rarr; Destination</th>
                <th className="py-3 px-4">Direction</th>
                <th className="py-3 px-4">Arrival</th>
                <th className="py-3 px-4">Departure</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 font-medium">Loading train schedules...</td>
                </tr>
              ) : filteredTrains.length > 0 ? (
                filteredTrains.map((t) => (
                  <tr key={`${t.trainNumber}_${t.date || t.corridorId}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-black text-blue-700">{t.trainNumber}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{t.trainName}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800">
                      {t.corridorId} <span className="text-[10px] text-slate-400 block">{t.section || 'Track 1'}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {t.origin || 'Vijayawada'} &rarr; {t.destination || 'Guntur'}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-xs text-slate-600">{t.direction || 'UP'}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{t.arrivalTime}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{t.departureTime}</td>
                    <td className="py-3 px-4 font-bold text-slate-700">{t.trainType}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                        t.priority === 'CRITICAL HIGH' || t.priority === 'High' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-blue-100 text-blue-800 border-blue-200'
                      }`}>
                        {t.priority}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="py-12 text-center text-slate-400 font-medium">No train records match search filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

