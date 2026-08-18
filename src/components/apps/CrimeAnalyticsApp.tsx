import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const CrimeAnalyticsApp: React.FC<{ windowId: string; appId: string }> = () => {
  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 text-xs select-text overflow-y-auto p-4 space-y-4">
      {/* Top Header Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
            28-Day Incident Total
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-mono font-bold text-slate-100">418</span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center">
              <TrendingDown className="w-3 h-3 mr-0.5" /> -4.2%
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">vs previous 28-day cycle</span>
        </div>

        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
            Violent Crime Clearance
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-mono font-bold text-sky-400">68.4%</span>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +2.1%
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Target benchmark: 65.0%</span>
        </div>

        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
            Avg Priority 1 Response
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-mono font-bold text-amber-400">4m 42s</span>
            <span className="text-[11px] font-mono text-red-400 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +18s
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Traffic bottleneck: Riverfront</span>
        </div>

        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
            Public Trust Index
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-mono font-bold text-emerald-400">74 / 100</span>
            <span className="text-[11px] font-mono text-slate-400 flex items-center">
              Stable
            </span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">Quarterly community poll</span>
        </div>
      </div>

      {/* Sector Hotspot Heat Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Crime Category Table */}
        <div className="p-3 bg-slate-950/40 border border-slate-800 rounded flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 font-mono text-[11px]">
            <span className="font-semibold text-slate-200 uppercase">Crime Category Trends</span>
            <span className="text-slate-500">M-T-D</span>
          </div>
          <div className="space-y-2.5 flex-1">
            {[
              { type: 'Commercial Robbery', count: 18, pct: 60, status: 'Surge Warning', color: 'bg-red-500' },
              { type: 'Auto Theft / Grand Larceny', count: 42, pct: 75, status: 'Elevated', color: 'bg-amber-500' },
              { type: 'Assault / Domestic 415', count: 64, pct: 45, status: 'Normal', color: 'bg-sky-500' },
              { type: 'Narcotics Distribution', count: 31, pct: 50, status: 'Targeted Ops', color: 'bg-indigo-500' },
              { type: 'Burglary (Residential)', count: 22, pct: 30, status: 'Low', color: 'bg-emerald-500' },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-300 font-medium">{item.type}</span>
                  <span className="font-mono text-slate-400">{item.count} cases ({item.status})</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${item.pct}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sector Crime Distribution */}
        <div className="p-3 bg-slate-950/40 border border-slate-800 rounded flex flex-col">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 font-mono text-[11px]">
            <span className="font-semibold text-slate-200 uppercase">Sector Incident Density</span>
            <span className="text-sky-400 font-mono">SECTORS 1 - 4</span>
          </div>
          <div className="space-y-3">
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sky-400 font-mono">SECTOR 1 — DOWNTOWN CORE</span>
                <span className="text-red-400 font-mono text-[10px] font-bold">HIGH DENSITY</span>
              </div>
              <p className="text-slate-400 text-[11px]">Peak hours: 22:00 - 03:00 | Primary: Nightclub row, bar disturbances, theft</p>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sky-400 font-mono">SECTOR 2 — RIVERFRONT / WAREHOUSES</span>
                <span className="text-amber-400 font-mono text-[10px] font-bold">MODERATE</span>
              </div>
              <p className="text-slate-400 text-[11px]">Peak hours: 01:00 - 05:00 | Primary: Cargo theft, narcotics trafficking</p>
            </div>
            <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-sky-400 font-mono">SECTOR 3 & 4 — RESIDENTIAL HEIGHTS</span>
                <span className="text-emerald-400 font-mono text-[10px] font-bold">LOW / CONTROLLED</span>
              </div>
              <p className="text-slate-400 text-[11px]">Peak hours: 14:00 - 18:00 | Primary: Traffic violations, package porch piracy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
