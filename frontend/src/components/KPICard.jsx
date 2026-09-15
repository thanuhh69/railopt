import React from 'react';

export default function KPICard({ title, value, icon: Icon, color = 'blue', badgeText, subtitle }) {
  const colorMap = {
    blue: { bg: 'bg-blue-50 text-blue-700 border-blue-100', iconBg: 'bg-blue-600 text-white' },
    red: { bg: 'bg-red-50 text-red-700 border-red-100', iconBg: 'bg-red-600 text-white' },
    amber: { bg: 'bg-amber-50 text-amber-800 border-amber-100', iconBg: 'bg-amber-600 text-white' },
    emerald: { bg: 'bg-emerald-50 text-emerald-800 border-emerald-100', iconBg: 'bg-emerald-600 text-white' },
    purple: { bg: 'bg-purple-50 text-purple-800 border-purple-100', iconBg: 'bg-purple-600 text-white' },
    indigo: { bg: 'bg-indigo-50 text-indigo-800 border-indigo-100', iconBg: 'bg-indigo-600 text-white' }
  };

  const activeColor = colorMap[color] || colorMap.blue;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-semibold ${activeColor.iconBg} shadow-sm`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
        {badgeText && (
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${activeColor.bg}`}>
            {badgeText}
          </span>
        )}
      </div>

      {subtitle && <p className="text-[11px] text-slate-400 mt-1 font-medium">{subtitle}</p>}
    </div>
  );
}
