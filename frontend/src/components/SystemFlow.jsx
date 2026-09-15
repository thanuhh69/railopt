import React from 'react';
import { Database, Cpu, AlertTriangle, Layers, CalendarCheck, ArrowRight } from 'lucide-react';

export default function SystemFlow() {
  const steps = [
    { title: 'Data Sources', desc: 'TMS, SMMS, TDMS, COA, BDMS', icon: Database, color: 'bg-slate-800 text-white' },
    { title: 'RAILOPT Integration', desc: 'Normalized Feature Store', icon: Cpu, color: 'bg-blue-600 text-white' },
    { title: 'Priority Engine', desc: 'Grok AI & Deterministic Fallback', icon: Layers, color: 'bg-indigo-600 text-white' },
    { title: 'Conflict Detection', desc: 'Train & Corridor Constraint Engine', icon: AlertTriangle, color: 'bg-amber-600 text-white' },
    { title: 'Block Optimization', desc: 'Multi-Department Solver', icon: CalendarCheck, color: 'bg-emerald-600 text-white' }
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <h3 className="text-sm font-extrabold text-slate-900 mb-4 tracking-tight uppercase">
        RAILOPT System Flow Architecture
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center p-3 rounded-lg border border-slate-200 bg-slate-50 text-center relative group hover:border-blue-300 transition-colors">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold mb-2 shadow-sm ${step.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-bold text-slate-900">{step.title}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">{step.desc}</div>
              </div>
              {idx < steps.length - 1 && (
                <div className="hidden md:flex items-center justify-center text-slate-300">
                  <ArrowRight className="w-5 h-5 text-blue-500" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
