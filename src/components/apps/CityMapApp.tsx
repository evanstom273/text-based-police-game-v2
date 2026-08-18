import React from 'react';
import { Navigation, Shield, Compass } from 'lucide-react';

export const CityMapApp: React.FC<{ windowId: string; appId: string }> = () => {
  return (
    <div className="flex flex-col h-full bg-slate-100 text-slate-900 text-xs font-sans select-none relative overflow-hidden">
      {/* Map Top Bar */}
      <div className="z-10 flex items-center justify-between px-3.5 py-2 bg-white border-b border-slate-200 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-slate-800 font-semibold text-xs">
            <Compass className="w-4 h-4 text-blue-700" />
            4th Precinct Sector GIS Map
          </span>
          <span className="text-slate-300 hidden sm:inline">|</span>
          <span className="text-slate-500 font-mono text-[11px] hidden sm:inline">GRID 42.21°N 71.04°W</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            6 Active GPS Transponders
          </span>
        </div>
      </div>

      {/* Modern Municipal GIS Map Canvas */}
      <div className="flex-1 relative bg-[#eef3f8] overflow-hidden flex items-center justify-center">
        {/* Subtle Map Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e125_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e125_1px,transparent_1px)] bg-[size:48px_48px]"></div>

        {/* River & City Road SVG Vector Graphics */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {/* Waterway (River) */}
          <path
            d="M -50 250 Q 250 200 450 350 T 900 300 T 1400 450"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="48"
            strokeLinecap="round"
          />
          <path
            d="M -50 250 Q 250 200 450 350 T 900 300 T 1400 450"
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="4"
          />

          {/* Major Streets and Avenues */}
          <line x1="100" y1="0" x2="200" y2="800" stroke="#cbd5e1" strokeWidth="3" />
          <line x1="380" y1="0" x2="420" y2="800" stroke="#cbd5e1" strokeWidth="4" />
          <line x1="680" y1="0" x2="650" y2="800" stroke="#cbd5e1" strokeWidth="3" />
          <line x1="0" y1="200" x2="1200" y2="200" stroke="#cbd5e1" strokeWidth="4" />
          <line x1="0" y1="480" x2="1200" y2="480" stroke="#cbd5e1" strokeWidth="3" />

          {/* Secondary Grid Lines */}
          <line x1="0" y1="100" x2="1200" y2="100" stroke="#e2e8f0" strokeWidth="1.5" />
          <line x1="0" y1="340" x2="1200" y2="340" stroke="#e2e8f0" strokeWidth="1.5" />
          <line x1="240" y1="0" x2="240" y2="800" stroke="#e2e8f0" strokeWidth="1.5" />
          <line x1="540" y1="0" x2="540" y2="800" stroke="#e2e8f0" strokeWidth="1.5" />

          {/* Sector Boundary Box Lines */}
          <rect x="60" y="40" width="300" height="240" fill="#ffffff" fillOpacity="0.4" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="6 4" rx="4" />
          <rect x="380" y="40" width="360" height="240" fill="#ffffff" fillOpacity="0.4" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="6 4" rx="4" />
          <rect x="60" y="300" width="300" height="240" fill="#ffffff" fillOpacity="0.4" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="6 4" rx="4" />
          <rect x="380" y="300" width="360" height="240" fill="#ffffff" fillOpacity="0.4" stroke="#93c5fd" strokeWidth="1.5" strokeDasharray="6 4" rx="4" />
        </svg>

        {/* Sector Labels */}
        <div className="absolute top-12 left-18 font-sans text-[11px] font-semibold text-slate-700 bg-white/90 border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
          Sector 1 — Downtown Core
        </div>
        <div className="absolute top-12 left-[396px] font-sans text-[11px] font-semibold text-slate-700 bg-white/90 border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
          Sector 2 — Riverfront & Harbor
        </div>
        <div className="absolute top-[316px] left-18 font-sans text-[11px] font-semibold text-slate-700 bg-white/90 border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
          Sector 3 — Civic Center & Heights
        </div>
        <div className="absolute top-[316px] left-[396px] font-sans text-[11px] font-semibold text-slate-700 bg-white/90 border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
          Sector 4 — Industrial Yards
        </div>

        {/* 4th Precinct Station Marker */}
        <div className="absolute top-[256px] left-[340px] flex items-center gap-1.5 px-2.5 py-1 bg-white border-2 border-blue-600 rounded-md shadow-md">
          <Shield className="w-4 h-4 text-blue-700" />
          <span className="font-sans text-[11px] font-bold text-slate-900">4th Precinct HQ</span>
        </div>

        {/* Unit Markers with High-Clarity Status */}
        {/* Unit 401 Available */}
        <div className="absolute top-28 left-48 flex items-center gap-1.5 bg-white border border-emerald-300 px-2 py-0.5 rounded-full text-[11px] text-slate-800 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-mono font-semibold text-slate-900">Unit 401</span>
          <span className="text-[10px] text-emerald-700 font-medium">Available</span>
        </div>

        {/* Unit 402 On Scene (Red) */}
        <div className="absolute top-44 left-[490px] flex items-center gap-1.5 bg-white border-2 border-red-500 px-2 py-0.5 rounded-full text-[11px] text-slate-900 shadow-md">
          <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
          <span className="font-mono font-bold text-red-700">Unit 402</span>
          <span className="text-[10px] font-semibold text-red-700">On Scene (211)</span>
        </div>

        {/* Unit 408 En Route (Blue) */}
        <div className="absolute top-20 left-[550px] flex items-center gap-1.5 bg-white border border-blue-400 px-2 py-0.5 rounded-full text-[11px] text-slate-800 shadow-sm">
          <Navigation className="w-3 h-3 text-blue-600 rotate-45" />
          <span className="font-mono font-semibold text-slate-900">Unit 408</span>
          <span className="text-[10px] text-blue-700 font-medium">En Route</span>
        </div>

        {/* Unit 411 En Route (Blue) */}
        <div className="absolute top-[380px] left-36 flex items-center gap-1.5 bg-white border border-blue-400 px-2 py-0.5 rounded-full text-[11px] text-slate-800 shadow-sm">
          <Navigation className="w-3 h-3 text-blue-600 rotate-90" />
          <span className="font-mono font-semibold text-slate-900">Unit 411</span>
          <span className="text-[10px] text-blue-700 font-medium">En Route</span>
        </div>

        {/* Unit 414 Available */}
        <div className="absolute top-[420px] left-[520px] flex items-center gap-1.5 bg-white border border-emerald-300 px-2 py-0.5 rounded-full text-[11px] text-slate-800 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-mono font-semibold text-slate-900">Unit 414</span>
          <span className="text-[10px] text-emerald-700 font-medium">Available</span>
        </div>
      </div>

      {/* Map Bottom Legend */}
      <div className="z-10 px-4 py-2 bg-white border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
            En Route
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 inline-block"></span>
            On Scene Incident
          </span>
        </div>
        <span className="text-slate-400 text-[11px] font-sans">Municipal GIS 8.4</span>
      </div>
    </div>
  );
};
