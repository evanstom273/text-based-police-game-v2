import React, { useState } from 'react';
import { Search, User } from 'lucide-react';

export const CaseFilesApp: React.FC<{ windowId: string; appId: string }> = () => {
  const [selectedCase, setSelectedCase] = useState<string>('26-0841');

  const cases = [
    {
      id: '26-0841',
      title: 'Homicide: Waterfront Warehouse Pier 14',
      lead: 'Det. E. Velez',
      status: 'ACTIVE',
      priority: 'HIGH',
      date: '2026-08-14',
      type: 'Violent Crime',
      summary: 'Victim identified as local union rep. Found with gunshot wounds. Shell casings recovered: 9mm Luger. Ballistics match pending with IA database.',
      evidenceCount: 7,
      suspects: ['Marcus "Snake" Vance', 'V. Geller (Person of Interest)']
    },
    {
      id: '26-0799',
      title: 'Grand Larceny: Midtown Diamond Exchange',
      lead: 'Det. D. Sterling',
      status: 'INVESTIGATION',
      priority: 'MEDIUM',
      date: '2026-08-09',
      type: 'Property Crime',
      summary: 'Alarm bypassed cleanly without trip. Safe opened via thermal lance. Estimated retail value $420,000 in uncut stones.',
      evidenceCount: 4,
      suspects: ['Unknown Crew (Professional)']
    },
    {
      id: '26-0752',
      title: 'Narcotics Ring: River District Distribution Hub',
      lead: 'Det. D. Sterling',
      status: 'ACTIVE / WIRETAP',
      priority: 'CRITICAL',
      date: '2026-07-28',
      type: 'Organized Crime',
      summary: 'Inter-state fentanyl trafficking syndicate. Surveillance ongoing on St. Jude trucking warehouse.',
      evidenceCount: 19,
      suspects: ['R. "Chemist" Thorne', 'Driver #4']
    },
    {
      id: '25-9921',
      title: 'Cold Case: 2025 Riverside Armored Van Ambush',
      lead: 'Unassigned',
      status: 'COLD',
      priority: 'LOW',
      date: '2025-11-04',
      type: 'Robbery / Cold',
      summary: 'Guard killed during transport heist. Unresolved ballistics lead from state police.',
      evidenceCount: 12,
      suspects: ['Unidentified']
    }
  ];

  const current = cases.find(c => c.id === selectedCase) || cases[0];

  return (
    <div className="flex h-full bg-slate-900 text-slate-200 text-xs select-text">
      {/* Left List of Cases */}
      <div className="w-80 border-r border-slate-800 flex flex-col bg-slate-950/40">
        <div className="p-2.5 border-b border-slate-800 bg-slate-950/80 flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search case #, victim, or lead..." 
            className="w-full bg-slate-900 border border-slate-700/60 rounded px-2 py-1 text-xs text-slate-300 placeholder:text-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
          {cases.map((c) => (
            <div
              key={c.id}
              onClick={() => setSelectedCase(c.id)}
              className={`p-3 cursor-pointer transition ${
                selectedCase === c.id 
                  ? 'bg-slate-800/80 border-l-4 border-l-sky-500' 
                  : 'hover:bg-slate-800/30'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-mono font-bold text-sky-400">CASE #{c.id}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold border ${
                  c.status.includes('ACTIVE') 
                    ? 'bg-red-950/60 border-red-800/60 text-red-400' 
                    : c.status === 'COLD' 
                    ? 'bg-slate-800 border-slate-700 text-slate-400' 
                    : 'bg-amber-950/60 border-amber-800/60 text-amber-400'
                }`}>
                  {c.status}
                </span>
              </div>
              <h4 className="font-medium text-slate-200 line-clamp-1 mb-1">{c.title}</h4>
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{c.lead}</span>
                <span>{c.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Case Dossier Detail */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-900">
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sky-400 font-bold text-sm">CASE DOSSIER #{current.id}</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400">{current.type}</span>
            </div>
            <h2 className="text-sm font-semibold text-slate-100 mt-0.5">{current.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-slate-300 font-medium text-[11px]">
              Print Summary
            </button>
            <button className="px-2.5 py-1 bg-sky-900/60 hover:bg-sky-800/60 border border-sky-700 rounded text-sky-300 font-medium text-[11px]">
              + Add Lead / Note
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-2.5 bg-slate-950/50 border border-slate-800 rounded">
              <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Lead Investigator</span>
              <span className="font-semibold text-slate-200">{current.lead}</span>
            </div>
            <div className="p-2.5 bg-slate-950/50 border border-slate-800 rounded">
              <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Date Filed</span>
              <span className="font-mono font-semibold text-slate-200">{current.date}</span>
            </div>
            <div className="p-2.5 bg-slate-950/50 border border-slate-800 rounded">
              <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">Evidence Log</span>
              <span className="font-mono font-semibold text-sky-400">{current.evidenceCount} Cataloged Items</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/30 border border-slate-800 rounded space-y-1.5">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Incident Synopsis</span>
            <p className="text-slate-300 leading-relaxed font-sans text-xs">{current.summary}</p>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Persons of Interest & Suspects</span>
            <div className="grid grid-cols-2 gap-2">
              {current.suspects.map((s, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-slate-800/40 border border-slate-700/60 rounded">
                  <User className="w-4 h-4 text-amber-400" />
                  <span className="text-slate-200 font-medium">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-2 bg-slate-950 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex justify-between">
          <span>CHAIN OF CUSTODY VERIFIED — MD-RMS v4.2.1</span>
          <span>RECORD CLASSIFIED: OFFICIAL USE ONLY</span>
        </div>
      </div>
    </div>
  );
};
