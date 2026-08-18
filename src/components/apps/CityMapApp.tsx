import React from 'react';
import { Navigation, Shield, AlertTriangle, Compass } from 'lucide-react';

export const CityMapApp: React.FC<{ windowId: string; appId: string }> = () => {
  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-200 text-xs select-none relative overflow-hidden">
      {/* Map Top Bar */}
      <div className="z-10 flex items-center justify-between px-3 py-2 bg-slate-900/90 border-b border-slate-800 backdrop-blur">
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-sky-400 font-bold">
            <Compass className="w-3.5 h-3.5" />
            4TH PRECINCT SECTOR TACTICAL MAP
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">COORDS: 42°21'N 71°04'W</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
            GPS: ACTIVE
          </span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 font-mono text-[10px]">
            6 UNITS PINGING
          </span>
        </div>
      </div>

      {/* Simulated GIS Tactical Grid Map */}
      <div className="flex-1 relative bg-slate-950 overflow-hidden flex items-center justify-center">
        {/* Map Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:40px_40px]"></div>

        {/* River & City Geography SVG Vector Graphics */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
          {/* River */}
          <path
            d="M -50 250 Q 250 200 450 350 T 900 300 T 1400 450"
            fill="none"
            stroke="#0284c7"
            strokeWidth="38"
            strokeLinecap="round"
            className="opacity-20"
          />
          <path
            d="M -50 250 Q 250 200 450 350 T 900 300 T 1400 450"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="4"
            className="opacity-40"
          />

          {/* Major Avenues */}
          <line x1="100" y1="0" x2="200" y2="800" stroke="#334155" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="380" y1="0" x2="420" y2="800" stroke="#334155" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="680" y1="0" x2="650" y2="800" stroke="#334155" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="0" y1="200" x2="1200" y2="200" stroke="#334155" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="0" y1="480" x2="1200" y2="480" stroke="#334155" strokeWidth="2" strokeDasharray="4 2" />

          {/* Sector Boundary Box Lines */}
          <rect x="60" y="40" width="300" height="240" fill="#0f172a" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 4" />
          <rect x="380" y="40" width="360" height="240" fill="#0f172a" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 4" />
          <rect x="60" y="300" width="300" height="240" fill="#0f172a" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 4" />
          <rect x="380" y="300" width="360" height="240" fill="#0f172a" fillOpacity="0.25" stroke="#38bdf8" strokeWidth="1" strokeDasharray="6 4" />
        </svg>

        {/* Sector Labels */}
        <div className="absolute top-12 left-20 font-mono text-[10px] font-bold text-sky-400/70 tracking-wider">
          SECTOR 1 — DOWNTOWN CORE
        </div>
        <div className="absolute top-12 left-[400px] font-mono text-[10px] font-bold text-sky-400/70 tracking-wider">
          SECTOR 2 — RIVERFRONT / PIERS
        </div>
        <div className="absolute top-[320px] left-20 font-mono text-[10px] font-bold text-sky-400/70 tracking-wider">
          SECTOR 3 — CIVIC CENTER & HILLS
        </div>
        <div className="absolute top-[320px] left-[400px] font-mono text-[10px] font-bold text-sky-400/70 tracking-wider">
          SECTOR 4 — INDUSTRIAL YARDS
        </div>

        {/* 4th Precinct Station Marker */}
        <div className="absolute top-[260px] left-[340px] flex items-center gap-1.5 p-1.5 bg-slate-900 border-2 border-sky-500 rounded shadow-lg shadow-sky-500/20">
          <Shield className="w-4 h-4 text-sky-400" />
          <span className="font-mono text-[10px] font-bold text-white">4TH PRECINCT HQ</span>
        </div>

        {/* Unit Markers */}
        <div className="absolute top-28 left-48 flex items-center gap-1 bg-slate-900/90 border border-emerald-500/80 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 shadow">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          UNIT 401 (10-8)
        </div>

        <div className="absolute top-44 left-[480px] flex items-center gap-1 bg-slate-900/90 border border-red-500/80 px-2 py-0.5 rounded text-[10px] font-mono text-red-400 shadow animate-pulse">
          <AlertTriangle className="w-3 h-3 text-red-400" />
          UNIT 402 [ON SCENE 211]
        </div>

        <div className="absolute top-20 left-[540px] flex items-center gap-1 bg-slate-900/90 border border-sky-500/80 px-2 py-0.5 rounded text-[10px] font-mono text-sky-400 shadow">
          <Navigation className="w-3 h-3 text-sky-400 rotate-45" />
          UNIT 408 [EN ROUTE]
        </div>

        <div className="absolute top-[380px] left-36 flex items-center gap-1 bg-slate-900/90 border border-sky-500/80 px-2 py-0.5 rounded text-[10px] font-mono text-sky-400 shadow">
          <Navigation className="w-3 h-3 text-sky-400 rotate-90" />
          UNIT 411 [EN ROUTE]
        </div>

        <div className="absolute top-[420px] left-[520px] flex items-center gap-1 bg-slate-900/90 border border-emerald-500/80 px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 shadow">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          UNIT 414 (10-8)
        </div>
      </div>

      {/* Map Bottom Legend */}
      <div className="z-10 px-3 py-1.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span> Patrol Available</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-sky-400 inline-block"></span> En Route</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400 inline-block"></span> Incident On Scene</span>
        </div>
        <span>MUNICIPAL GIS v8.4.2</span>
      </div>
    </div>
  );
};
