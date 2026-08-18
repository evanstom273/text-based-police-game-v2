import React from 'react';
import { AlertCircle, Navigation } from 'lucide-react';

export const DispatchApp: React.FC<{ windowId: string; appId: string }> = () => {
  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 font-mono text-xs select-text">
      {/* CAD Header Status Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-slate-800 text-[11px]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            CAD TERMINAL 04 — LIVE
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">CHANNEL: <span className="text-sky-400">TAC-1 (MAIN)</span></span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>PENDING CALLS: <strong className="text-amber-400">3</strong></span>
          <span>UNITS DISPATCHED: <strong className="text-sky-400">8 / 14</strong></span>
        </div>
      </div>

      {/* Main CAD Split View */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
        {/* Left: Active Incidents Queue */}
        <div className="md:col-span-7 border-r border-slate-800 flex flex-col overflow-hidden bg-slate-900/50">
          <div className="px-3 py-2 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between text-slate-400 font-sans text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              Active 911 Incidents
            </span>
            <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Auto-refresh 5s</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {/* Incident 1 */}
            <div className="p-2.5 bg-slate-800/60 border-l-4 border-l-red-500 border border-slate-700/60 rounded-r shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-red-400 flex items-center gap-1">
                  [PRIORITY 1] 211 - ARMED ROBBERY
                </span>
                <span className="text-[10px] text-slate-400 font-mono">03:38:12 (2m ago)</span>
              </div>
              <p className="text-slate-300 font-sans text-xs">842 W. Roosevelt Ave (QuickMart Convenience)</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-700/40">
                <span>Suspect: Male, dark hoodie, firearm displayed</span>
                <span className="text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800/50">Unit 402, 408 Assigned</span>
              </div>
            </div>

            {/* Incident 2 */}
            <div className="p-2.5 bg-slate-800/40 border-l-4 border-l-amber-500 border border-slate-700/40 rounded-r">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-amber-400">
                  [PRIORITY 2] 415 - DISTURBANCE / NOISE
                </span>
                <span className="text-[10px] text-slate-400 font-mono">03:31:05 (9m ago)</span>
              </div>
              <p className="text-slate-300 font-sans text-xs">1104 Elmwood Terr, Apt 3B</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-700/40">
                <span>Caller reports loud argument, breaking glass</span>
                <span className="text-amber-400/90 bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-800/40">Unit 411 En Route</span>
              </div>
            </div>

            {/* Incident 3 */}
            <div className="p-2.5 bg-slate-800/30 border-l-4 border-l-slate-600 border border-slate-700/30 rounded-r opacity-80">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-300">
                  [PRIORITY 3] 10-31 - SUSPICIOUS VEHICLE
                </span>
                <span className="text-[10px] text-slate-400 font-mono">03:22:40 (18m ago)</span>
              </div>
              <p className="text-slate-300 font-sans text-xs">Oak Street Industrial Park, Gate 4</p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-700/40">
                <span>Van parked with engine running since 02:00</span>
                <span className="text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">Queued (No Unit)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Unit Board */}
        <div className="md:col-span-5 flex flex-col overflow-hidden bg-slate-950/30">
          <div className="px-3 py-2 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between text-slate-400 font-sans text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-sky-400" />
              Sector Patrol Units
            </span>
            <span className="text-[10px] text-emerald-400">6 Available</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {[
              { unit: '401', officer: 'Ofc. Miller / Chen', status: '10-8 (AVAILABLE)', sector: 'SECTOR-1', color: 'text-emerald-400', badge: 'bg-emerald-950/80 border-emerald-800/60' },
              { unit: '402', officer: 'Sgt. Kowalski', status: '10-97 (ON SCENE)', sector: 'SECTOR-2', color: 'text-red-400', badge: 'bg-red-950/80 border-red-800/60' },
              { unit: '408', officer: 'Ofc. Velez / Diaz', status: '10-76 (EN ROUTE)', sector: 'SECTOR-2', color: 'text-sky-400', badge: 'bg-sky-950/80 border-sky-800/60' },
              { unit: '411', officer: 'Ofc. Gallagher', status: '10-76 (EN ROUTE)', sector: 'SECTOR-3', color: 'text-sky-400', badge: 'bg-sky-950/80 border-sky-800/60' },
              { unit: '414', officer: 'Ofc. Sterling', status: '10-8 (AVAILABLE)', sector: 'SECTOR-4', color: 'text-emerald-400', badge: 'bg-emerald-950/80 border-emerald-800/60' },
              { unit: '420', officer: 'K9 Ofc. Vance (Buster)', status: '10-8 (AVAILABLE)', sector: 'SECTOR-ALL', color: 'text-emerald-400', badge: 'bg-emerald-950/80 border-emerald-800/60' },
            ].map((u) => (
              <div key={u.unit} className="flex items-center justify-between p-2 bg-slate-900/90 border border-slate-800/80 rounded text-[11px] hover:border-slate-700 transition">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sky-400">UNIT {u.unit}</span>
                    <span className="text-slate-300 font-sans">{u.officer}</span>
                  </div>
                  <div className="text-[10px] text-slate-500">{u.sector}</div>
                </div>
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold border ${u.badge} ${u.color}`}>
                  {u.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Command Input Placeholder */}
      <div className="p-2 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
        <span className="text-slate-500 font-bold">CAD&gt;</span>
        <input 
          type="text" 
          placeholder="DISPATCH COMMAND [UNIT#] [STATUS/CALL#]..." 
          disabled
          className="flex-1 bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-slate-400 text-xs focus:outline-none placeholder:text-slate-600"
        />
        <button disabled className="px-3 py-1 bg-sky-950 border border-sky-800 text-sky-400 text-[11px] rounded font-semibold opacity-60">
          EXECUTE
        </button>
      </div>
    </div>
  );
};
