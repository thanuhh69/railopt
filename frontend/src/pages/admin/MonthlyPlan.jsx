import React, { useState, useEffect } from 'react';
import { CalendarRange, Info } from 'lucide-react';
import api from '../../utils/api';

export default function MonthlyPlan() {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('2026-09-15');

  useEffect(() => {
    async function loadMonthly() {
      try {
        const res = await api.get('/planning/monthly');
        if (res.data?.success) setBlocks(res.data.blocks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMonthly();
  }, []);

  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-09-${String(dayNum).padStart(2, '0')}`;
    const dayBlocks = blocks.filter(b => b.date === dateStr);
    return { dayNum, dateStr, dayBlocks };
  });

  const activeDateBlocks = blocks.filter(b => b.date === selectedDate);

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CalendarRange className="w-6 h-6 text-purple-600" />
            Monthly Maintenance Calendar — September 2026
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            30-day operational view of scheduled corridor maintenance disconnections.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-extrabold text-slate-400 uppercase mb-3">
            <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((cd) => (
              <button
                key={cd.dateStr}
                onClick={() => setSelectedDate(cd.dateStr)}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all ${
                  selectedDate === cd.dateStr
                    ? 'border-blue-600 bg-blue-50/80 shadow-xs'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="text-xs font-black text-slate-900">{cd.dayNum}</div>
                {cd.dayBlocks.length > 0 && (
                  <div className="mt-1">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                      {cd.dayBlocks.length} Blocks
                    </span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Date Summary Panel */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase">
              Date Schedule Summary
            </h3>
            <p className="text-xs text-blue-600 font-mono font-bold mt-0.5">{selectedDate}</p>
          </div>

          <div className="space-y-3">
            {activeDateBlocks.length > 0 ? (
              activeDateBlocks.map((b) => (
                <div key={b.blockId} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="font-mono font-bold text-blue-900 flex items-center justify-between">
                    <span>{b.blockId}</span>
                    <span>{b.corridorId}</span>
                  </div>
                  <div className="font-mono text-emerald-800 font-bold">{b.startTime} – {b.endTime}</div>
                  <div className="text-slate-600">{b.departments?.join(' + ')}</div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400 font-medium">
                No blocks scheduled for {selectedDate}.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
