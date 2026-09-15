import React from 'react';
import { X, CheckCircle, AlertTriangle, Clock, MapPin, Wrench, ShieldAlert } from 'lucide-react';

export default function DetailModal({ isOpen, onClose, title, data, type = 'task' }) {
  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">{title || 'Details View'}</h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{data.taskId || data.blockId || data.requestId || 'Record Inspection'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          {type === 'task' && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Department</div>
                  <div className="font-semibold text-slate-900 mt-1">{data.department}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Corridor Section</div>
                  <div className="font-semibold text-slate-900 mt-1">{data.corridorId}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Priority Score</div>
                  <div className="font-extrabold text-blue-700 mt-1 text-sm">{data.priorityScore || 50} / 100 ({data.priorityLevel || 'MEDIUM'})</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Issue Description</div>
                <div className="font-medium text-slate-900 leading-relaxed">{data.issueDescription}</div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-900 uppercase mb-2">Normalized Operational Parameters</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div className="p-2.5 bg-slate-100/70 rounded border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-500">Criticality</div>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">{data.criticality}%</div>
                  </div>
                  <div className="p-2.5 bg-slate-100/70 rounded border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-500">Urgency</div>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">{data.urgency}%</div>
                  </div>
                  <div className="p-2.5 bg-slate-100/70 rounded border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-500">Asset Impact</div>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">{data.assetImpact}%</div>
                  </div>
                  <div className="p-2.5 bg-slate-100/70 rounded border border-slate-200 text-center">
                    <div className="text-[10px] text-slate-500">Safety Impact</div>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">{data.safetyImpact}%</div>
                  </div>
                </div>
              </div>

              {data.reasoning && data.reasoning.length > 0 && (
                <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200">
                  <div className="text-xs font-extrabold text-blue-900 mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-blue-600" />
                    Priority Engine Reasoning & Explanation
                  </div>
                  <ul className="space-y-1.5 pl-5 list-disc text-blue-950 font-medium">
                    {data.reasoning.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {type === 'block' && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Corridor</div>
                  <div className="font-bold text-slate-900 mt-1">{data.corridorId}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Scheduled Window</div>
                  <div className="font-mono font-bold text-emerald-800 mt-1">{data.startTime} – {data.endTime}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Total Duration</div>
                  <div className="font-bold text-slate-900 mt-1">{data.totalDuration} Minutes</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Status</div>
                  <div className="font-bold text-blue-700 mt-1">{data.status}</div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <div className="text-xs font-extrabold text-emerald-950 mb-2">Coordinated Multi-Department Work Items</div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.departments?.map((d, i) => (
                    <span key={i} className="px-2.5 py-1 bg-white border border-emerald-300 rounded font-bold text-emerald-900 text-xs">
                      {d}
                    </span>
                  ))}
                </div>
                <div className="text-[11px] text-emerald-800 font-medium">
                  Associated Task IDs: {data.tasks?.join(', ') || 'N/A'}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">Train Conflicts</div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">{data.trainConflictsCount || 0}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">Corridor Conflicts</div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">{data.corridorConflictsCount || 0}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-[10px] text-slate-500">Deadline Conflicts</div>
                  <div className="text-base font-extrabold text-slate-900 mt-0.5">{data.deadlineConflictsCount || 0}</div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
