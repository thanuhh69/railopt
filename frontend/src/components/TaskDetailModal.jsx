import React from 'react';
import { X, MapPin, Wrench, Clock, ShieldAlert, FileText, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';

export default function TaskDetailModal({ isOpen, onClose, task, onStartTask, onMarkCompleted }) {
  if (!isOpen || !task) return null;

  const isCompleted = task.status === 'COMPLETED';
  const isPendingVerification = task.status === 'VERIFICATION_PENDING';
  const isInProgress = task.status === 'IN_PROGRESS';
  const isAssigned = task.status === 'ASSIGNED' || task.status === 'Prioritized';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-[#002B49] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center">
              <Wrench className="w-5 h-5 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-extrabold text-sm text-blue-300">{task.taskId}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                  (task.priorityLevel || '').toUpperCase() === 'CRITICAL' ? 'bg-red-500 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {task.priorityLevel || 'HIGH'}
                </span>
              </div>
              <h3 className="text-lg font-black tracking-tight">{task.title || task.assetName || task.maintenanceType}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rejection Alert Notice if returned to IN_PROGRESS */}
        {task.rejectionReason && (
          <div className="bg-red-50 border-b border-red-200 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-black text-red-900 uppercase tracking-wide">Report Rejected by Admin</div>
              <p className="text-xs text-red-800 font-medium mt-0.5">"{task.rejectionReason}"</p>
              <div className="text-[11px] text-red-700 mt-1 font-semibold">Please review notes, complete required maintenance rework, and resubmit completion evidence.</div>
            </div>
          </div>
        )}

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">

          {/* Section 1: Railway Operational Location Hierarchy */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" /> Railway Operational Location Hierarchy
              </span>
              <span className="text-[11px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {task.corridorId || 'VJA-GNT'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Base City</div>
                <div className="font-bold text-slate-900 mt-0.5">{task.baseCity || 'Vijayawada'}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Railway Division</div>
                <div className="font-bold text-slate-900 mt-0.5">{task.railwayDivision || 'Vijayawada Division'}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Zone / Area</div>
                <div className="font-bold text-slate-900 mt-0.5">{task.zone || 'Vijayawada Area'}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Corridor</div>
                <div className="font-bold text-blue-700 font-mono mt-0.5">{task.corridorId || 'VJA-GNT'}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Section</div>
                <div className="font-bold text-slate-900 font-mono mt-0.5">{task.section || 'VJA-GDL'}</div>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Maintenance Location</div>
                <div className="font-extrabold text-blue-900 mt-0.5">{task.maintenanceLocation || task.location || 'Track Section A-17'}</div>
              </div>
            </div>

            {/* Hierarchical Visual Pipeline */}
            <div className="pt-1 flex items-center gap-1.5 overflow-x-auto text-[10px] font-bold text-slate-600">
              <span className="bg-white px-2 py-1 rounded border">{task.baseCity || 'Vijayawada'}</span>
              <span>→</span>
              <span className="bg-white px-2 py-1 rounded border">{task.railwayDivision || 'Vijayawada Div'}</span>
              <span>→</span>
              <span className="bg-white px-2 py-1 rounded border text-blue-700">{task.corridorId || 'VJA-GNT'}</span>
              <span>→</span>
              <span className="bg-blue-100 text-blue-900 px-2 py-1 rounded border border-blue-300">{task.maintenanceLocation || 'Track Section A-17'}</span>
            </div>
          </div>

          {/* Section 2: Asset & Maintenance Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Asset Specifications</div>
              <div>
                <span className="text-slate-500">Asset Name: </span>
                <span className="font-bold text-slate-900">{task.assetName}</span>
              </div>
              <div>
                <span className="text-slate-500">Asset ID: </span>
                <span className="font-mono font-bold text-blue-700">{task.assetId}</span>
              </div>
              <div>
                <span className="text-slate-500">Asset Type: </span>
                <span className="font-semibold text-slate-800">{task.assetType || 'Rail Track'}</span>
              </div>
              <div>
                <span className="text-slate-500">Condition: </span>
                <span className="font-semibold text-amber-700">{task.assetCondition || 'Action Required'}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Schedule & Block Window</div>
              <div>
                <span className="text-slate-500">Maintenance Date: </span>
                <span className="font-mono font-bold text-slate-900">{task.dueDate}</span>
              </div>
              <div>
                <span className="text-slate-500">Window: </span>
                <span className="font-mono font-extrabold text-emerald-700">{task.startTime || '10:00'} – {task.endTime || '12:00'}</span>
              </div>
              <div>
                <span className="text-slate-500">Assigned Block ID: </span>
                <span className="font-mono font-bold text-blue-700">{task.blockId || 'BLK-2026-021'}</span>
              </div>
              <div>
                <span className="text-slate-500">Est. Duration: </span>
                <span className="font-semibold text-slate-800">{task.estimatedDuration || 90} mins</span>
              </div>
            </div>
          </div>

          {/* Section 3: Work & Safety Instructions */}
          <div className="space-y-3 text-xs">
            <div className="bg-blue-50/70 p-3.5 rounded-xl border border-blue-200 space-y-1">
              <div className="font-bold text-blue-900 uppercase text-[10px] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" /> Maintenance Work Instructions
              </div>
              <p className="text-slate-700 font-medium leading-relaxed">
                {task.workInstructions || task.issueDescription || 'Perform sleeper joint inspection, torque mechanical bolts, replace defective rail section, and calibrate line alignment.'}
              </p>
            </div>

            <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 space-y-1">
              <div className="font-bold text-amber-900 uppercase text-[10px] flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" /> Mandatory Safety Protocol
              </div>
              <p className="text-amber-950 font-medium leading-relaxed">
                {task.safetyInstructions || 'Ensure catenary overhead power disconnection, apply track circuit shunt flags, and deploy look-out protection before entering section.'}
              </p>
            </div>
          </div>

          {/* Section 4: Assigned Personnel */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <div className="font-bold text-slate-900">{task.assignedUserName || 'Ravi Kumar (SSE)'}</div>
                <div className="text-[10px] text-slate-500 font-medium">{task.department || 'Engineering'} • {task.assignedUserEmail || 'user@railopt.demo'}</div>
              </div>
            </div>
            <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] border ${
              isCompleted ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
              isPendingVerification ? 'bg-purple-100 text-purple-800 border-purple-200' :
              isInProgress ? 'bg-blue-100 text-blue-800 border-blue-200' :
              'bg-amber-100 text-amber-800 border-amber-200'
            }`}>
              STATUS: {task.status || 'ASSIGNED'}
            </span>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {isAssigned && onStartTask && (
              <button
                onClick={() => { onStartTask(task.taskId); onClose(); }}
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
              >
                Start Maintenance
              </button>
            )}

            {(isAssigned || isInProgress) && onMarkCompleted && (
              <button
                onClick={() => { onMarkCompleted(task.taskId); onClose(); }}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
              >
                Mark as Completed
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
