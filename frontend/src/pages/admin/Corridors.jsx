import React, { useState, useEffect } from 'react';
import { GitCommit, CheckCircle2, AlertTriangle, Clock, Eye, Search, MapPin, Train, Wrench, X } from 'lucide-react';
import api from '../../utils/api';

const DEFAULT_CORRIDORS = [
  { corridorId: 'VJA-GNT', name: 'Vijayawada – Guntur Main Line', division: 'Vijayawada Division', zone: 'Vijayawada Area', section: 'VJA-GDL-01', fromLocation: 'Vijayawada', toLocation: 'Guntur', date: '2026-09-17', availableStart: '09:30', availableEnd: '16:30', trainCount: 18, activeBlocks: 3, maintenanceCount: 8, trafficLevel: 'High', availabilityStatus: 'AVAILABLE' },
  { corridorId: 'NDL-GNT', name: 'Nandyal – Guntur Branch Line', division: 'Guntur Division', zone: 'Nandyal Zone', section: 'NDL-GNT-02', fromLocation: 'Nandyal', toLocation: 'Guntur', date: '2026-09-17', availableStart: '09:30', availableEnd: '16:30', trainCount: 12, activeBlocks: 2, maintenanceCount: 5, trafficLevel: 'Medium', availabilityStatus: 'AVAILABLE' },
  { corridorId: 'BZA-RU', name: 'Vijayawada – Renigunta South Coast', division: 'Vijayawada Division', zone: 'South Coast Zone', section: 'BZA-RU-01', fromLocation: 'Vijayawada', toLocation: 'Renigunta', date: '2026-09-17', availableStart: '10:00', availableEnd: '17:00', trainCount: 26, activeBlocks: 4, maintenanceCount: 12, trafficLevel: 'Critical High', availabilityStatus: 'RESTRICTED' },
  { corridorId: 'SC-KZJ', name: 'Secunderabad – Kazipet Main Trunk', division: 'Secunderabad Division', zone: 'Secunderabad Area', section: 'SC-KZJ-03', fromLocation: 'Secunderabad', toLocation: 'Kazipet', date: '2026-09-17', availableStart: '09:00', availableEnd: '16:00', trainCount: 32, activeBlocks: 5, maintenanceCount: 14, trafficLevel: 'Critical High', availabilityStatus: 'RESTRICTED' },
  { corridorId: 'VSKP-BZA', name: 'Visakhapatnam – Vijayawada Coastal', division: 'Waltair Division', zone: 'Coastal Zone', section: 'VSKP-BZA-05', fromLocation: 'Visakhapatnam', toLocation: 'Vijayawada', date: '2026-09-17', availableStart: '09:30', availableEnd: '16:30', trainCount: 22, activeBlocks: 3, maintenanceCount: 9, trafficLevel: 'High', availabilityStatus: 'AVAILABLE' },
  { corridorId: 'GNT-RAL', name: 'Guntur – Repalle Section', division: 'Guntur Division', zone: 'Guntur Area', section: 'GNT-RAL-04', fromLocation: 'Guntur', toLocation: 'Repalle', date: '2026-09-17', availableStart: '11:00', availableEnd: '15:00', trainCount: 8, activeBlocks: 1, maintenanceCount: 4, trafficLevel: 'Low', availabilityStatus: 'AVAILABLE' },
  { corridorId: 'BZA-BMT', name: 'Vijayawada – Bhimavaram Branch', division: 'Vijayawada Division', zone: 'Delta Zone', section: 'BZA-BMT-06', fromLocation: 'Vijayawada', toLocation: 'Bhimavaram', date: '2026-09-17', availableStart: '10:30', availableEnd: '16:00', trainCount: 10, activeBlocks: 2, maintenanceCount: 6, trafficLevel: 'Medium', availabilityStatus: 'AVAILABLE' },
  { corridorId: 'GTL-NDL', name: 'Guntakal – Nandyal Feeder', division: 'Guntakal Division', zone: 'Rayalaseema Area', section: 'GTL-NDL-07', fromLocation: 'Guntakal', toLocation: 'Nandyal', date: '2026-09-17', availableStart: '09:00', availableEnd: '14:30', trainCount: 14, activeBlocks: 2, maintenanceCount: 7, trafficLevel: 'Medium', availabilityStatus: 'AVAILABLE' }
];

export default function Corridors() {
  const [corridors, setCorridors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCorridor, setSelectedCorridor] = useState(null);

  useEffect(() => {
    async function loadCorridors() {
      try {
        const res = await api.get('/corridors');
        if (res.data?.success && res.data.corridors?.length > 0) {
          setCorridors(res.data.corridors);
        } else {
          setCorridors(DEFAULT_CORRIDORS);
        }
      } catch (err) {
        console.error('API Error, using fallback corridors:', err);
        setCorridors(DEFAULT_CORRIDORS);
      } finally {
        setLoading(false);
      }
    }
    loadCorridors();
  }, []);

  const filteredCorridors = corridors.filter(c => 
    (c.corridorId + c.fromLocation + c.toLocation + (c.division || '')).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
            <GitCommit className="w-4 h-4 text-purple-400" /> Railway Infrastructure Corridor Register
          </div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            Section Corridors & Block Window Availability
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-medium max-w-2xl">
            Real-time operational status, traffic density metrics, and scheduled maintenance disconnection windows across key Indian Railways routes.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Corridor ID, Division, Location..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-purple-600"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Corridor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-4 py-12 text-center text-xs text-slate-400 font-medium">Loading corridors dataset...</div>
        ) : filteredCorridors.map((cor) => (
          <div
            key={cor.corridorId}
            onClick={() => setSelectedCorridor(cor)}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-purple-300 cursor-pointer transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-sm text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
                {cor.corridorId}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                cor.availabilityStatus === 'RESTRICTED' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {cor.availabilityStatus || 'AVAILABLE'}
              </span>
            </div>

            <div>
              <h3 className="font-black text-sm text-slate-900">{cor.fromLocation} &rarr; {cor.toLocation}</h3>
              <p className="text-[11px] text-slate-500 font-medium">{cor.division || 'Vijayawada Division'}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">Trains</span>
                <span className="font-black text-slate-900">{cor.trainCount || 12}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">Blocks</span>
                <span className="font-black text-blue-700">{cor.activeBlocks || 3}</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-lg">
                <span className="text-[9px] text-slate-400 font-bold block uppercase">Tasks</span>
                <span className="font-black text-emerald-700">{cor.maintenanceCount || 6}</span>
              </div>
            </div>

            <button className="w-full py-2 bg-slate-100 hover:bg-purple-600 hover:text-white text-slate-700 font-extrabold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5">
              <Eye className="w-3.5 h-3.5" /> View Corridor Breakdown
            </button>
          </div>
        ))}
      </div>

      {/* Corridor Modal */}
      {selectedCorridor && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-purple-600">Corridor Infrastructure View</span>
                <h3 className="text-base font-black text-slate-900">{selectedCorridor.fromLocation} &rarr; {selectedCorridor.toLocation}</h3>
              </div>
              <button onClick={() => setSelectedCorridor(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Corridor ID</span>
                  <span className="font-mono font-bold text-purple-700 text-sm">{selectedCorridor.corridorId}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Division & Zone</span>
                  <span className="font-bold text-slate-900">{selectedCorridor.division || 'Vijayawada Division'}</span>
                </div>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 space-y-1">
                <span className="text-[10px] text-purple-800 font-bold uppercase block">Daily Available Maintenance Window</span>
                <span className="font-mono font-bold text-purple-950 text-sm block">{selectedCorridor.availableStart || '09:30'} AM – {selectedCorridor.availableEnd || '16:30'} PM</span>
                <span className="text-[11px] text-purple-900 font-medium">Traffic Level: {selectedCorridor.trafficLevel}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Train className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                  <span className="font-bold text-slate-900 block">{selectedCorridor.trainCount || 18}</span>
                  <span className="text-[10px] text-slate-400 font-bold">Scheduled Trains</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Clock className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                  <span className="font-bold text-slate-900 block">{selectedCorridor.activeBlocks || 3}</span>
                  <span className="text-[10px] text-slate-400 font-bold">Active Blocks</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <Wrench className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                  <span className="font-bold text-slate-900 block">{selectedCorridor.maintenanceCount || 8}</span>
                  <span className="text-[10px] text-slate-400 font-bold">Total Tasks</span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button onClick={() => setSelectedCorridor(null)} className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-xs">
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

