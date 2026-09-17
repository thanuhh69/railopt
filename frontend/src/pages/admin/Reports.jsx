import React from 'react';
import { FileSpreadsheet, Download, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

export default function Reports() {
  const handleExport = (typeKey) => {
    window.location.href = `/api/reports/export?type=${typeKey}`;
  };

  const reports = [
    { type: 'maintenance', title: 'Maintenance Tasks & Priority Register', desc: 'Centralized engineering, S&T, and traction task dataset with Grok AI priority scores.', icon: FileText, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { type: 'completion', title: 'Completion & Verification Clearance Report', desc: 'Audit log of completed site maintenance work with Before/After photo evidence verification state.', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { type: 'overdue', title: 'Overdue Defects & Critical Risk Report', desc: 'High-priority overdue track and signaling maintenance tasks requiring urgent block allocation.', icon: ShieldAlert, color: 'text-red-600 bg-red-50 border-red-200' },
    { type: 'blocks', title: 'Optimized Coordinated Block Plan', desc: 'Complete generated schedule with multi-department block windows and occupation hours.', icon: FileSpreadsheet, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { type: 'conflicts', title: 'Detected Conflicts & Resolutions Audit', desc: 'Audit report of train overlaps, corridor availability breaches, and recommended resolutions.', icon: ShieldAlert, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { type: 'department', title: 'Departmental Breakdown & Performance Matrix', desc: 'Inter-departmental block demand utilization summary for Engineering, Signal, and Traction.', icon: FileSpreadsheet, color: 'text-purple-600 bg-purple-50 border-purple-200' }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            Reports & Plan Export Center
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Download CSV reports for operational dispatching, safety audits, and departmental review.
          </p>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {reports.map((rep) => {
          const Icon = rep.icon;
          return (
            <div key={rep.type} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border ${rep.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900">{rep.title}</h3>
                    <span className="text-[10px] font-mono text-slate-400">CSV FORMAT</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 font-normal leading-relaxed">{rep.desc}</p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => handleExport(rep.type)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download CSV Report
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Limitations Documentation (Requirement #50) */}
      <div className="bg-amber-50/60 rounded-xl border border-amber-200 p-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          Project Limitations & Prototype Architecture Scope
        </div>
        <div className="text-xs text-amber-950 font-medium leading-relaxed space-y-2">
          <p>
            • <strong>Synthetic Data Prototype:</strong> This application is a Smart India Hackathon working prototype/simulation utilizing MongoDB synthetic collections and batch CSV ingestion. It is <strong>NOT</strong> officially connected to live production Indian Railways systems (TMS, SMMS, TDMS, COA, BDMS, IRCTC).
          </p>
          <p>
            • <strong>Production Deployment Requirements:</strong> Full enterprise implementation in Indian Railways would require official security clearances, domain validation, safety authorization, integration with CRIS/FOIS infrastructure, and cybersecurity boundary controls.
          </p>
        </div>
      </div>
    </div>
  );
}
