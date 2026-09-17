import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Wrench, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../utils/api';
import TaskDetailModal from '../../components/TaskDetailModal';

export default function UserSchedule() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('weekly'); // 'weekly' or 'monthly'
  const [inspectTask, setInspectTask] = useState(null);

  useEffect(() => {
    async function loadTasks() {
      try {
        setLoading(true);
        const res = await api.get('/tasks/my-tasks');
        if (res.data?.success) setTasks(res.data.tasks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadTasks();
  }, []);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const baseDates = ['2026-09-15', '2026-09-16', '2026-09-17', '2026-09-18', '2026-09-19', '2026-09-20', '2026-09-21'];

  const weeklySchedule = daysOfWeek.map((dayName, idx) => {
    const dateStr = baseDates[idx];
    const dayTasks = tasks.filter(t => t.dueDate === dateStr || (idx === 2 && t.dueDate === '2026-09-17'));
    return {
      dayName,
      dateStr,
      tasks: dayTasks
    };
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="bg-[#002B49] p-6 rounded-2xl text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-400" />
            Maintenance Operations Schedule
          </h1>
          <p className="text-xs text-blue-200 mt-1 font-medium">
            Weekly & monthly maintenance block execution timeline for assigned railway corridors.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl border border-white/20">
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'weekly' ? 'bg-blue-600 text-white shadow-xs' : 'text-blue-200 hover:text-white'
            }`}
          >
            Weekly Schedule
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              viewMode === 'monthly' ? 'bg-blue-600 text-white shadow-xs' : 'text-blue-200 hover:text-white'
            }`}
          >
            Monthly Calendar
          </button>
        </div>
      </div>

      {/* Weekly View Grid */}
      {viewMode === 'weekly' ? (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weeklySchedule.map((day) => (
            <div key={day.dateStr} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[300px]">
              <div className="p-3 bg-slate-50 border-b border-slate-200 text-center">
                <div className="font-extrabold text-xs text-slate-800 uppercase">{day.dayName}</div>
                <div className="text-[10px] font-mono text-slate-500 font-bold mt-0.5">{day.dateStr}</div>
              </div>

              <div className="p-2 space-y-2 flex-1 overflow-y-auto">
                {day.tasks.length > 0 ? (
                  day.tasks.map((task) => (
                    <div
                      key={task.taskId}
                      onClick={() => setInspectTask(task)}
                      className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg hover:border-blue-400 transition-all cursor-pointer text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[10px] text-blue-700">{task.taskId}</span>
                        <span className="text-[9px] font-extrabold bg-blue-600 text-white px-1.5 py-0.2 rounded">
                          {task.startTime || '10:00'}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 line-clamp-1">{task.title || task.assetName}</div>
                      <div className="text-[10px] text-slate-600 font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="truncate">{task.corridorId} • {task.maintenanceLocation || 'Sec A-17'}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-[11px] text-slate-400 font-medium text-center p-4">
                    No block scheduled
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Monthly Calendar View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">September 2026 Operations Calendar</h2>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Vijayawada Division Schedule
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-slate-400 uppercase py-2">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-xs">
            {Array.from({ length: 30 }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-09-${String(dayNum).padStart(2, '0')}`;
              const dayTasks = tasks.filter(t => t.dueDate === dateStr);

              return (
                <div key={dayNum} className="min-h-[70px] bg-slate-50 p-2 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <span className="font-mono font-bold text-slate-700">{dayNum}</span>
                  {dayTasks.length > 0 && (
                    <div className="bg-blue-600 text-white font-bold text-[10px] p-1 rounded text-center truncate">
                      {dayTasks.length} Work Order{dayTasks.length > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <TaskDetailModal
        isOpen={!!inspectTask}
        onClose={() => setInspectTask(null)}
        task={inspectTask}
      />
    </div>
  );
}
