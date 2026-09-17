import React, { useState, useEffect } from 'react';
import { UserCheck, Wrench, CheckCircle2, Clock, Upload, AlertTriangle, MapPin, Navigation, Eye, PlayCircle, ShieldCheck } from 'lucide-react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import TaskDetailModal from '../../components/TaskDetailModal';
import CompletionModal from '../../components/CompletionModal';

const DEFAULT_USER_TASKS = [
  {
    taskId: 'ENG-1042',
    title: 'Track Inspection & Defect Joint Repair',
    department: 'Engineering',
    assetId: 'TRK-VJA-A17',
    assetName: 'Track Section A-17',
    assetType: 'Rail Joint & Sleepers',
    assetCondition: 'Critical Crack Detected',
    baseCity: 'Vijayawada',
    railwayDivision: 'Vijayawada Division',
    zone: 'Vijayawada Area',
    corridorId: 'VJA-GNT',
    section: 'VJA-GDL',
    maintenanceLocation: 'Track Section A-17',
    location: 'Track Section A-17',
    maintenanceType: 'Rail Joint Replacement',
    issueDescription: 'Severe crack detected on sleeper joint 245 along Vijayawada – Gudivada line. Immediate track block required.',
    criticality: 95,
    urgency: 90,
    dueDate: '2026-09-17',
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    blockId: 'BLK-2026-021',
    status: 'ASSIGNED',
    priorityLevel: 'CRITICAL',
    assignedUserEmail: 'user@railopt.demo',
    assignedUserName: 'Ravi Kumar (SSE)',
    workInstructions: 'Perform ultrasonic defect flaw detection, replace damaged fishplate, torque joint bolts to 450 Nm, and test line clearance.',
    safetyInstructions: 'Ensure catenary overhead power disconnection, apply track circuit shunt flags, and deploy look-out protection before work.',
    specialInstructions: 'Log ultrasonic defect readings into TMS upon completion.'
  },
  {
    taskId: 'ST-3021',
    title: 'Point Machine Calibration & Signaling Check',
    department: 'Signal & Telecommunication',
    assetId: 'SIG-BZA-88',
    assetName: 'Turnout Switch SIG-88',
    assetType: 'Point Machine Interlocking',
    assetCondition: 'Signaling Delay Reported',
    baseCity: 'Vijayawada',
    railwayDivision: 'Vijayawada Division',
    zone: 'Vijayawada Area',
    corridorId: 'VJA-GNT',
    section: 'VJA-GDL',
    maintenanceLocation: 'Turnout Switch SIG-88',
    location: 'Turnout Switch SIG-88',
    maintenanceType: 'Signal Calibration',
    issueDescription: 'Intermittent signaling delay at turnout 88 switch motor. Recalibration required.',
    criticality: 78,
    urgency: 75,
    dueDate: '2026-09-17',
    startTime: '12:30 PM',
    endTime: '01:30 PM',
    blockId: 'BLK-2026-022',
    status: 'IN_PROGRESS',
    priorityLevel: 'HIGH',
    assignedUserEmail: 'user@railopt.demo',
    assignedUserName: 'Ravi Kumar (SSE)',
    workInstructions: 'Calibrate point machine stroke motor, inspect relay contacts, lubricate slide chairs, and conduct interlocking drop test.',
    safetyInstructions: 'Inform station master before opening point machine cover. Maintain radio contact with signal cabin.',
    specialInstructions: 'Test point detection feedback with local cabin.'
  },
  {
    taskId: 'TR-5012',
    title: 'Overhead Wire Tensioning & Insulator Check',
    department: 'Traction Distribution',
    assetId: 'OHE-VJA-112',
    assetName: 'OHE Catenary Cable #112',
    assetType: 'Overhead Equipment (OHE)',
    assetCondition: 'Catenary Sag Observed',
    baseCity: 'Vijayawada',
    railwayDivision: 'Vijayawada Division',
    zone: 'Vijayawada Area',
    corridorId: 'VJA-GNT',
    section: 'VJA-GDL',
    maintenanceLocation: 'Overhead Span KM 245/14',
    location: 'Overhead Span KM 245/14',
    maintenanceType: 'OHE Tensioning',
    issueDescription: 'Sagging overhead catenary cable observed during routine pantograph patrol.',
    criticality: 82,
    urgency: 80,
    dueDate: '2026-09-17',
    startTime: '02:00 PM',
    endTime: '03:30 PM',
    blockId: 'BLK-2026-023',
    status: 'ASSIGNED',
    priorityLevel: 'HIGH',
    assignedUserEmail: 'user@railopt.demo',
    assignedUserName: 'Ravi Kumar (SSE)',
    workInstructions: 'Adjust counterweight dropper tension, clean porcelain disc insulators, and align cantilever assembly.',
    safetyInstructions: 'Mandatory power block discharge rod grounding on both sides of work zone before ladder deployment.',
    specialInstructions: 'Verify height and stagger with pantograph gauge.'
  },
  {
    taskId: 'ENG-1048',
    title: 'Switch Point Surface Grinding',
    department: 'Engineering',
    assetId: 'SP-BZA-12',
    assetName: 'Switch Point SP-12',
    assetType: 'Turnout Switch Rail',
    assetCondition: 'Surface Fatigue Wear',
    baseCity: 'Vijayawada',
    railwayDivision: 'Vijayawada Division',
    zone: 'Vijayawada Area',
    corridorId: 'BZA-RU',
    section: 'BZA-RU-01',
    maintenanceLocation: 'South Yard Switch 12',
    location: 'South Yard Switch 12',
    maintenanceType: 'Grinding',
    issueDescription: 'Surface fatigue wear and metal flow on switch stock rail.',
    criticality: 65,
    urgency: 60,
    dueDate: '2026-09-18',
    startTime: '09:00 AM',
    endTime: '11:00 AM',
    blockId: 'BLK-2026-024',
    status: 'VERIFICATION_PENDING',
    priorityLevel: 'MEDIUM',
    assignedUserEmail: 'user@railopt.demo',
    assignedUserName: 'Ravi Kumar (SSE)',
    workInstructions: 'Grind stock rail profile, remove lip formation, and check turnout housing fit.',
    safetyInstructions: 'Wear safety goggles, ear protection, and fire-resistant apron during grinding operations.',
    specialInstructions: 'Ensure spark shield is positioned to protect signaling cables.'
  },
  {
    taskId: 'ST-3025',
    title: 'Axle Counter Sensor Testing',
    department: 'Signal & Telecommunication',
    assetId: 'AC-SC-04',
    assetName: 'Axle Counter Unit AC-04',
    assetType: 'Axle Counter Sensor',
    assetCondition: 'Completed Routine Servicing',
    baseCity: 'Vijayawada',
    railwayDivision: 'Vijayawada Division',
    zone: 'Vijayawada Area',
    corridorId: 'SC-KZJ',
    section: 'SC-KZJ-03',
    maintenanceLocation: 'Block Section Crossing 4',
    location: 'Block Section Crossing 4',
    maintenanceType: 'Testing',
    issueDescription: 'Periodic testing of trackside axle counter counting heads.',
    criticality: 55,
    urgency: 50,
    dueDate: '2026-09-16',
    startTime: '11:00 AM',
    endTime: '12:00 PM',
    blockId: 'BLK-2026-015',
    status: 'COMPLETED',
    priorityLevel: 'MEDIUM',
    assignedUserEmail: 'user@railopt.demo',
    assignedUserName: 'Ravi Kumar (SSE)',
    workInstructions: 'Tested sensor pulse output, cleaned magnetic heads, and verified channel redundancy.',
    safetyInstructions: 'Follow track safety rules during live train operations.',
    specialInstructions: 'Reported zero pulse count errors to central monitoring.'
  }
];

export default function UserDashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inspectTask, setInspectTask] = useState(null);
  const [completionTaskId, setCompletionTaskId] = useState(null);

  const currentUser = {
    fullName: user?.fullName || user?.name || 'Ravi Kumar',
    employeeId: user?.employeeId || 'EMP-1042',
    department: user?.department || 'Engineering',
    designation: user?.designation || 'Senior Section Engineer (SSE)',
    baseCity: user?.baseCity || 'Vijayawada',
    railwayDivision: user?.railwayDivision || 'Vijayawada Division',
    assignedZone: user?.assignedZone || 'Vijayawada Area',
    assignedCorridor: user?.assignedCorridor || 'Vijayawada – Gudivada (VJA-GNT)'
  };

  const fetchMyTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tasks/my-tasks');
      if (res.data?.success && res.data.tasks?.length > 0) {
        setTasks(res.data.tasks);
      } else {
        setTasks(DEFAULT_USER_TASKS);
      }
    } catch (err) {
      console.error('API Error, using fallback user tasks:', err);
      setTasks(DEFAULT_USER_TASKS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const handleStartTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/start`);
      fetchMyTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const totalAssigned = tasks.length;
  const pendingCount = tasks.filter(t => t.status === 'ASSIGNED' || t.status === 'Prioritized').length;
  const inProgressCount = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const verificationPendingCount = tasks.filter(t => t.status === 'VERIFICATION_PENDING').length;
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="p-6 space-y-6">
      
      {/* 1. TOP GREETING & PROFILE BANNER */}
      <div className="bg-[#002B49] rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30 mb-2">
            <UserCheck className="w-3.5 h-3.5 text-blue-400" />
            Field Maintenance Staff Task Execution Portal
          </div>
          <h1 className="text-2xl font-black tracking-tight">Good Morning, {currentUser.fullName}</h1>
          <p className="text-xs text-blue-200 mt-1 font-medium flex items-center gap-3">
            <span>{currentUser.department} • <span className="font-mono text-white font-bold">{currentUser.employeeId}</span></span>
            <span>•</span>
            <span>{currentUser.designation}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Active Shift • On Duty
          </span>
        </div>
      </div>

      {/* 2. COMPACT BASE LOCATION CARD */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" /> Assigned Base Railway Operational Location
          </h2>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
            Profile Location Reference
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Base City</div>
            <div className="font-extrabold text-slate-900 mt-0.5">{currentUser.baseCity}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Railway Division</div>
            <div className="font-extrabold text-slate-900 mt-0.5">{currentUser.railwayDivision}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Assigned Zone</div>
            <div className="font-extrabold text-slate-900 mt-0.5">{currentUser.assignedZone}</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Assigned Corridor</div>
            <div className="font-extrabold text-blue-700 font-mono mt-0.5">{currentUser.assignedCorridor}</div>
          </div>
        </div>
      </div>

      {/* 3. TASK SUMMARY KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Total Work Orders</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{totalAssigned}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Assigned / Pending</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">In Progress</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{inProgressCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Verification Pending</div>
          <div className="text-2xl font-black text-purple-600 mt-1">{verificationPendingCount}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm col-span-2 sm:col-span-1">
          <div className="text-[10px] font-bold text-slate-500 uppercase">Completed</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{completedCount}</div>
        </div>
      </div>

      {/* 4. TODAY'S MAINTENANCE TASKS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-600" /> Today's Maintenance Tasks
          </h2>
          <span className="text-xs font-bold text-slate-500">Showing {tasks.length} active assignments</span>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl p-12 border text-center text-xs text-slate-400 font-medium">
            Loading assigned maintenance work orders...
          </div>
        ) : tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tasks.map((task) => {
              const isCompleted = task.status === 'COMPLETED';
              const isPendingVerification = task.status === 'VERIFICATION_PENDING';
              const isInProgress = task.status === 'IN_PROGRESS';
              const isAssigned = task.status === 'ASSIGNED' || task.status === 'Prioritized';
              const hasRejection = !!task.rejectionReason;

              return (
                <div
                  key={task.taskId}
                  className={`bg-white rounded-2xl border p-5 shadow-sm space-y-4 transition-all hover:shadow-md ${
                    hasRejection
                      ? 'border-red-300 bg-red-50/20'
                      : isCompleted
                      ? 'border-emerald-200 bg-emerald-50/10'
                      : isInProgress
                      ? 'border-blue-300 bg-blue-50/20'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Task Header */}
                  <div className="flex items-start justify-between border-b border-slate-100 pb-3 gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-extrabold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {task.taskId}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          (task.priorityLevel || '').toUpperCase() === 'CRITICAL'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {task.priorityLevel || 'HIGH'}
                        </span>
                      </div>
                      <h3 className="font-black text-sm text-slate-900 leading-snug">
                        {task.title || task.assetName || task.maintenanceType}
                      </h3>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold border shrink-0 ${
                      isCompleted ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                      isPendingVerification ? 'bg-purple-100 text-purple-800 border-purple-200' :
                      isInProgress ? 'bg-blue-100 text-blue-800 border-blue-200' :
                      'bg-amber-100 text-amber-800 border-amber-200'
                    }`}>
                      {task.status || 'ASSIGNED'}
                    </span>
                  </div>

                  {/* Rejection Alert Notice */}
                  {hasRejection && (
                    <div className="p-2.5 bg-red-100/80 border border-red-300 rounded-xl text-xs text-red-950 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold block">Rejection Reason from Admin:</span>
                        <span className="font-medium">"{task.rejectionReason}"</span>
                      </div>
                    </div>
                  )}

                  {/* Railway Location Hierarchy Grid */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="text-[10px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" /> Allocated Railway Location
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <span className="text-slate-400 font-semibold block text-[10px]">CITY & DIVISION</span>
                        <span className="font-bold text-slate-900">{task.baseCity || 'Vijayawada'} ({task.railwayDivision || 'Vijayawada Div'})</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold block text-[10px]">CORRIDOR & SECTION</span>
                        <span className="font-mono font-bold text-blue-700">{task.corridorId || 'VJA-GNT'} ({task.section || 'VJA-GDL'})</span>
                      </div>
                      <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                        <span className="text-slate-400 font-semibold text-[10px]">MAINTENANCE LOCATION:</span>
                        <span className="font-extrabold text-blue-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {task.maintenanceLocation || task.location || 'Track Section A-17'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Schedule & Asset Info */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Asset</span>
                      <span className="font-bold text-slate-900 truncate block">{task.assetName}</span>
                      <span className="font-mono text-[10px] text-blue-600 font-bold block">{task.assetId}</span>
                    </div>

                    <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Schedule & Block</span>
                      <span className="font-mono font-bold text-slate-900 block">{task.dueDate}</span>
                      <span className="font-mono font-extrabold text-emerald-700 text-[11px] block">
                        {task.startTime || '10:00 AM'} – {task.endTime || '12:00 PM'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                    <button
                      onClick={() => setInspectTask(task)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Task
                    </button>

                    <div className="flex items-center gap-2">
                      {isAssigned && (
                        <button
                          onClick={() => handleStartTask(task.taskId)}
                          className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <PlayCircle className="w-3.5 h-3.5" /> Start Maintenance
                        </button>
                      )}

                      {(isInProgress || isAssigned) && (
                        <button
                          onClick={() => setCompletionTaskId(task.taskId)}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" /> Mark as Completed
                        </button>
                      )}

                      {isPendingVerification && (
                        <span className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-purple-600" /> Verification Pending
                        </span>
                      )}

                      {isCompleted && (
                        <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Completed ✓
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center text-xs text-slate-400 font-medium">
            No assigned maintenance tasks found for today.
          </div>
        )}
      </div>

      {/* Task Inspection Modal */}
      <TaskDetailModal
        isOpen={!!inspectTask}
        onClose={() => setInspectTask(null)}
        task={inspectTask}
        onStartTask={handleStartTask}
        onMarkCompleted={(id) => setCompletionTaskId(id)}
      />

      {/* Completion & Dual Photo Upload Modal */}
      <CompletionModal
        isOpen={!!completionTaskId}
        onClose={() => setCompletionTaskId(null)}
        taskId={completionTaskId}
        onSuccess={() => fetchMyTasks()}
      />

    </div>
  );
}
