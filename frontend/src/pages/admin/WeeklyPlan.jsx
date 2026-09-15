import React, { useState, useEffect } from 'react';
import { CalendarDays, Filter } from 'lucide-react';
import api from '../../utils/api';
import DetailModal from '../../components/DetailModal';

export default function WeeklyPlan() {
  const [grid, setGrid] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deptFilter, setDeptFilter] = useState('All');
  const [selectedBlock, setSelectedBlock] = useState(null);

  useEffect(() => {
    async function loadWeekly() {
      try {
        const res = await api.get('/planning/weekly');
        if (res.data?.success) setGrid(res.data.weeklyGrid);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadWeekly();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-600" />
            Weekly Maintenance Block Schedule
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Monday through Sunday coordinated block distribution matrix.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
          >
            <option value="All">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Traction Distribution">Traction Distribution</option>
            <option value="Signal & Telecommunication">Signal & Telecommunication</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {loading ? (
          <div className="col-span-7 py-12 text-center text-xs text-slate-400">Loading weekly grid...</div>
        ) : grid.map((dayData, idx) => {
          const filteredBlocks = (dayData.blocks || []).filter(b => 
            deptFilter === 'All' || b.departments?.includes(deptFilter)
          );

          return (
            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
              <div className="border-b border-slate-100 pb-2">
                <div className="font-extrabold text-sm text-slate-900">{dayData.day}</div>
                <div className="text-[10px] text-slate-400 font-mono">{dayData.date}</div>
              </div>

              <div className="space-y-2">
                {filteredBlocks.length > 0 ? (
                  filteredBlocks.map((b) => (
                    <div
                      key={b.blockId}
                      onClick={() => setSelectedBlock(b)}
                      className="p-2.5 bg-blue-50/70 hover:bg-blue-100 border border-blue-200 rounded-lg cursor-pointer transition-colors space-y-1 text-xs"
                    >
                      <div className="font-mono font-bold text-blue-900 flex items-center justify-between text-[11px]">
                        <span>{b.blockId}</span>
                        <span>{b.corridorId}</span>
                      </div>
                      <div className="font-mono font-bold text-emerald-800 text-[10px]">
                        {b.startTime}–{b.endTime}
                      </div>
                      <div className="text-[10px] text-slate-600 truncate">
                        {b.departments?.join(', ')}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-[11px] text-slate-400 font-medium">No blocks</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <DetailModal
        isOpen={!!selectedBlock}
        onClose={() => setSelectedBlock(null)}
        title="Block Detail"
        data={selectedBlock}
        type="block"
      />
    </div>
  );
}
