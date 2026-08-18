import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const CrimeAnalyticsApp: React.FC<{ windowId: string; appId: string }> = () => {
  return (
    <div className="flex flex-col h-full bg-white text-slate-900 text-xs font-sans select-text overflow-y-auto p-4 sm:p-5 space-y-4">
      {/* Top Header Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            28-Day Incidents
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-slate-900">418</span>
            <span className="text-[11px] font-medium text-emerald-700 flex items-center">
              <TrendingDown className="w-3 h-3 mr-0.5" /> -4.2%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">vs prior 28 days</span>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Clearance Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-blue-700">68.4%</span>
            <span className="text-[11px] font-medium text-emerald-700 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +2.1%
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Target: 65.0%</span>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Avg Priority 1 Response
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-slate-900">4m 42s</span>
            <span className="text-[11px] font-medium text-amber-700 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +18s
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Riverfront traffic</span>
        </div>

        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Public Trust Index
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono text-emerald-700">74 / 100</span>
            <span className="text-[11px] font-medium text-slate-500 flex items-center">
              Stable
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Quarterly survey</span>
        </div>
      </div>

      {/* Crime Category & Sector Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Crime Category Trends */}
        <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-lg flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
            <span className="font-semibold text-slate-800 text-xs uppercase tracking-wide">
              Crime Category Trends
            </span>
            <span className="text-slate-500 text-[11px]">Month-to-Date</span>
          </div>
          <div className="space-y-3 flex-1">
            {[
              { type: 'Commercial Robbery', count: 18, pct: 60, status: 'Elevated', color: 'bg-red-500' },
              { type: 'Auto Theft / Grand Larceny', count: 42, pct: 75, status: 'Surge Warning', color: 'bg-amber-500' },
              { type: 'Assault / Domestic 415', count: 64, pct: 45, status: 'Normal', color: 'bg-blue-600' },
              { type: 'Narcotics Distribution', count: 31, pct: 50, status: 'Targeted Ops', color: 'bg-indigo-600' },
              { type: 'Burglary (Residential)', count: 22, pct: 30, status: 'Low', color: 'bg-emerald-600' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-800 font-medium">{item.type}</span>
                  <span className="font-mono text-slate-600">{item.count} cases ({item.status})</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sector Crime Distribution */}
        <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-lg flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-200">
            <span className="font-semibold text-slate-800 text-xs uppercase tracking-wide">
              Sector Incident Density
            </span>
            <span className="text-slate-500 text-[11px]">Sectors 1–4</span>
          </div>
          <div className="space-y-2.5">
            <div className="p-3 bg-white border border-slate-200 rounded-md">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-900">Sector 1 — Downtown Core</span>
                <span className="text-red-700 bg-red-50 px-1.5 py-0.2 rounded border border-red-200 text-[10px] font-semibold">
                  High Density
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">Peak hours: 22:00 – 03:00 | Commercial corridor disturbances and theft</p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-md">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-900">Sector 2 — Riverfront & Harbor</span>
                <span className="text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 text-[10px] font-semibold">
                  Moderate
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">Peak hours: 01:00 – 05:00 | Warehouse cargo security and transit routes</p>
            </div>
            <div className="p-3 bg-white border border-slate-200 rounded-md">
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-900">Sector 3 & 4 — Residential & Industrial</span>
                <span className="text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 text-[10px] font-semibold">
                  Low / Stable
                </span>
              </div>
              <p className="text-slate-600 text-[11px]">Peak hours: 14:00 – 18:00 | Routine patrol and traffic compliance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
