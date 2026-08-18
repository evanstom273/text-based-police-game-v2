import React, { useState } from 'react';
import { AlertCircle, Navigation, MapPin } from 'lucide-react';
import { useIsMobile } from '../../hooks/useIsMobile';

export const DispatchApp: React.FC<{ windowId: string; appId: string }> = () => {
  const isMobile = useIsMobile(768);
  const [mobileTab, setMobileTab] = useState<'incidents' | 'units'>('incidents');

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 font-sans text-xs select-text">
      {/* CAD Header Status Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            CAD Terminal 04 — Active
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="text-slate-500 hidden sm:inline">
            Primary Channel: <span className="font-medium text-slate-700">TAC-1</span>
          </span>
        </div>
        <div className="flex items-center gap-3 font-sans text-xs">
          <span className="text-slate-600">
            Pending Calls: <strong className="text-amber-700 font-mono font-semibold">3</strong>
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-600">
            Units Available: <strong className="text-emerald-700 font-mono font-semibold">6 / 14</strong>
          </span>
        </div>
      </div>

      {/* Mobile Tab Switcher */}
      {isMobile && (
        <div className="flex border-b border-slate-200 bg-white">
          <button
            onClick={() => setMobileTab('incidents')}
            className={`flex-1 py-2 text-center font-medium border-b-2 transition ${
              mobileTab === 'incidents'
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Incidents (3)
          </button>
          <button
            onClick={() => setMobileTab('units')}
            className={`flex-1 py-2 text-center font-medium border-b-2 transition ${
              mobileTab === 'units'
                ? 'border-blue-600 text-blue-700 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Patrol Units (6)
          </button>
        </div>
      )}

      {/* Main CAD Split View */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden bg-slate-100/50">
        {/* Left: Active Incidents Queue */}
        {(!isMobile || mobileTab === 'incidents') && (
          <div className="md:col-span-7 border-r border-slate-200 flex flex-col overflow-hidden bg-white">
            <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-slate-600">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-slate-500" />
                Active 911 Incidents
              </span>
              <span className="text-[11px] text-slate-500 font-sans">Updated just now</span>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {/* Incident 1: Priority 1 Armed Robbery (High Visual Contrast) */}
              <div className="p-3 bg-red-50/50 border-l-4 border-l-red-600 border border-red-200/80 rounded-r-md shadow-2xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-red-700 flex items-center gap-1.5">
                    <span className="font-mono text-[11px] bg-red-600 text-white px-1.5 py-0.2 rounded font-semibold">
                      PRIORITY 1
                    </span>
                    211 — Armed Robbery
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">03:38 (2m ago)</span>
                </div>
                <div className="text-slate-900 font-medium text-xs mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  842 W. Roosevelt Ave (QuickMart Convenience)
                </div>
                <p className="text-slate-600 text-[11px] mt-1 pl-4">
                  Suspect: Male, dark hoodie, handgun displayed. Cash drawer taken, fled on foot eastbound.
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-red-200/60">
                  <span className="text-slate-500 font-sans">Dispatch Queue: Level 1 Armed</span>
                  <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-mono font-medium border border-blue-200">
                    Unit 402, 408 Assigned
                  </span>
                </div>
              </div>

              {/* Incident 2: Priority 2 */}
              <div className="p-3 bg-amber-50/30 border-l-4 border-l-amber-500 border border-amber-200/70 rounded-r-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                    <span className="font-mono text-[11px] bg-amber-500 text-white px-1.5 py-0.2 rounded font-semibold">
                      PRIORITY 2
                    </span>
                    415 — Disturbance / Noise
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">03:31 (9m ago)</span>
                </div>
                <div className="text-slate-900 font-medium text-xs mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  1104 Elmwood Terr, Apt 3B
                </div>
                <p className="text-slate-600 text-[11px] mt-1 pl-4">
                  Caller reports ongoing loud argument, sound of broken glass.
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-amber-200/60">
                  <span className="text-slate-500 font-sans">Sector 3 Patrol</span>
                  <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded font-mono font-medium border border-slate-200">
                    Unit 411 En Route
                  </span>
                </div>
              </div>

              {/* Incident 3: Priority 3 (Quiet, Low Visual Noise) */}
              <div className="p-3 bg-slate-50/80 border-l-4 border-l-slate-300 border border-slate-200 rounded-r-md">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="font-mono text-[11px] bg-slate-400 text-white px-1.5 py-0.2 rounded font-semibold">
                      PRIORITY 3
                    </span>
                    10-31 — Suspicious Vehicle
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">03:22 (18m ago)</span>
                </div>
                <div className="text-slate-900 font-medium text-xs mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  Oak Street Industrial Park, Gate 4
                </div>
                <p className="text-slate-600 text-[11px] mt-1 pl-4">
                  Commercial van parked with headlights off since 02:00.
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[11px] pt-2 border-t border-slate-200">
                  <span className="text-slate-500 font-sans">Sector 4 Industrial</span>
                  <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-sans text-[11px] border border-slate-200">
                    Queued
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right: Unit Availability Board */}
        {(!isMobile || mobileTab === 'units') && (
          <div className="md:col-span-5 flex flex-col overflow-hidden bg-slate-50">
            <div className="px-3.5 py-2 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-slate-600">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-blue-700" />
                Patrol Unit Status
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">6 Available</span>
            </div>

            <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
              {[
                { unit: '401', officer: 'Ofc. Miller / Chen', status: 'Available', code: '10-8', sector: 'Sector 1', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                { unit: '402', officer: 'Sgt. Kowalski', status: 'On Scene', code: '10-97', sector: 'Sector 2', badge: 'bg-red-50 text-red-800 border-red-200' },
                { unit: '408', officer: 'Ofc. Velez / Diaz', status: 'En Route', code: '10-76', sector: 'Sector 2', badge: 'bg-blue-50 text-blue-800 border-blue-200' },
                { unit: '411', officer: 'Ofc. Gallagher', status: 'En Route', code: '10-76', sector: 'Sector 3', badge: 'bg-blue-50 text-blue-800 border-blue-200' },
                { unit: '414', officer: 'Ofc. Sterling', status: 'Available', code: '10-8', sector: 'Sector 4', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
                { unit: '420', officer: 'K9 Ofc. Vance (Buster)', status: 'Available', code: '10-8', sector: 'Tactical', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
              ].map((u) => (
                <div key={u.unit} className="flex items-center justify-between p-2.5 bg-white border border-slate-200/80 rounded-md hover:border-slate-300 transition shadow-2xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-800 text-xs">UNIT {u.unit}</span>
                      <span className="text-slate-800 font-medium text-xs">{u.officer}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">{u.sector}</div>
                  </div>
                  <div className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${u.badge}`}>
                    {u.status} <span className="font-mono font-normal opacity-80 text-[10px]">({u.code})</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Command Input Bar */}
      <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
        <span className="text-slate-400 font-mono font-semibold text-xs pl-1">CAD&gt;</span>
        <input 
          type="text" 
          placeholder="Enter unit or dispatch command (e.g. 401 10-8)..." 
          disabled
          className="flex-1 bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-slate-700 text-xs focus:outline-none placeholder:text-slate-400"
        />
        <button disabled className="px-3 py-1.5 bg-slate-100 border border-slate-300 text-slate-500 text-xs rounded font-medium opacity-70">
          Execute
        </button>
      </div>
    </div>
  );
};
