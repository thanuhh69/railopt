import React from 'react';
import { ArrowRight, Clock, ShieldCheck, CheckCircle2, TrendingUp } from 'lucide-react';

export default function BeforeAfterVisualizer() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Before vs After Optimization Impact Analysis
          </h3>
          <p className="text-xs text-slate-500">Coordinated Multi-Department Block Planning Comparison</p>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
          Based on prototype simulation
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BEFORE: Decentralized / Separate Planning */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="px-2.5 py-1 bg-red-100 text-red-800 font-extrabold text-xs rounded-md">
              BEFORE — Decentralized Independent Blocks
            </span>
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-red-600" /> 3.0 Hours Total Occupation
            </span>
          </div>

          <div className="space-y-3 text-xs font-semibold">
            <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                <span>Engineering Block</span>
              </div>
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">10:00 – 11:00 (60m)</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                <span>Signal & Telecom (S&T)</span>
              </div>
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">12:00 – 13:00 (60m)</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                <span>Traction Distribution (TRD)</span>
              </div>
              <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">14:00 – 15:00 (60m)</span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200/80 text-[11px] text-slate-500">
            ⚠ Multiple train speed restrictions, 3 separate corridor blockades, high operational downtime.
          </div>
        </div>

        {/* AFTER: RAILOPT Coordinated Planning */}
        <div className="bg-blue-50/40 rounded-xl p-5 border border-blue-200 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="px-2.5 py-1 bg-emerald-600 text-white font-extrabold text-xs rounded-md shadow-xs">
              AFTER — RAILOPT Coordinated Unified Block
            </span>
            <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 1.5 Hours Total Occupation
            </span>
          </div>

          <div className="p-4 bg-white rounded-xl border border-blue-200 shadow-sm space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-blue-900">ONE COORDINATED MAINTENANCE BLOCK</span>
              <span className="font-mono text-xs font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded">
                10:00 – 11:30 (90m)
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="p-2 bg-blue-50 rounded border border-blue-100 text-[11px] font-semibold text-blue-900 text-center">
                Engineering
              </div>
              <div className="p-2 bg-emerald-50 rounded border border-emerald-100 text-[11px] font-semibold text-emerald-900 text-center">
                S&T Signal Check
              </div>
              <div className="p-2 bg-amber-50 rounded border border-amber-100 text-[11px] font-semibold text-amber-900 text-center">
                OHE Traction Wire
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-white p-3 rounded-lg border border-emerald-200 text-center">
              <div className="text-lg font-black text-emerald-600">50%</div>
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Block Duration Reduction</div>
            </div>
            <div className="bg-white p-3 rounded-lg border border-blue-200 text-center">
              <div className="text-lg font-black text-blue-700">+35%</div>
              <div className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">Train Availability Boost</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
